// src/lib/content.ts
// File-based content engine for a single-author digital garden.
// Reads Markdown notes from /content/notes at build time, parses frontmatter,
// resolves Obsidian-style [[wikilinks]], and derives the folder tree, backlinks,
// and the knowledge graph. No database — everything lives in the repo.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");
const PROFILE_PATH = path.join(process.cwd(), "content", "profile.json");

export type NoteMeta = {
  slug: string; // path relative to content/notes without extension, e.g. "ml/transformers"
  title: string;
  date: string | null;
  tags: string[];
  summary: string | null;
  folder: string[]; // path segments, e.g. ["ml"]
};

export type Note = NoteMeta & {
  body: string; // raw markdown body (still contains [[wikilinks]])
  rendered: string; // body with [[wikilinks]] rewritten to markdown links
  outgoing: string[]; // resolved slugs this note links to (unique)
};

export type TreeNode =
  | { type: "folder"; name: string; path: string; children: TreeNode[] }
  | { type: "note"; name: string; slug: string; title: string };

export type TocItem = { depth: number; text: string; id: string };

export type GraphData = {
  nodes: { id: string; title: string; group: string; degree: number }[];
  links: { source: string; target: string }[];
};

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number | string;
  url?: string;
  note?: string;
};

export type Profile = {
  name: string;
  headline: string;
  avatarText?: string;
  bio: string[];
  affiliations?: { role: string; org: string }[];
  interests?: string[];
  links?: { label: string; url: string }[];
  email?: string;
  publications?: Publication[];
};

export type SiteConfig = {
  title?: string;
  giscus?: {
    repo: string; // "owner/repo"
    repoId: string;
    category: string;
    categoryId: string;
    mapping?: string; // default "pathname"
  };
};

// `![[image.png]]` (Obsidian embed) — handled BEFORE wikilinks.
const IMG_EMBED_RE = /!\[\[([^\]]+)\]\]/g;
const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function fileToSlug(file: string): string {
  const rel = path.relative(NOTES_DIR, file).replace(/\\/g, "/");
  return rel.replace(/\.md$/, "");
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

// Build the in-memory index once (cached for the process / build).
type Index = {
  notes: Map<string, Note>; // by slug
  order: string[]; // slugs in stable (title) order
  resolver: Map<string, string>; // normalized title/basename -> slug
};

let _cache: Index | null = null;

function build(): Index {
  const files = walk(NOTES_DIR);

  // First pass: parse frontmatter + body, register resolver keys.
  const raw: { slug: string; meta: NoteMeta; body: string }[] = [];
  const resolver = new Map<string, string>();

  for (const file of files) {
    const slug = fileToSlug(file);
    const parsed = matter(fs.readFileSync(file, "utf-8"));
    const fm = parsed.data as Record<string, unknown>;
    const basename = slug.split("/").pop() || slug;
    const title = (fm.title as string) || basename;
    const folder = slug.split("/").slice(0, -1);
    const tags = Array.isArray(fm.tags) ? (fm.tags as string[]).map(String) : [];
    const meta: NoteMeta = {
      slug,
      title,
      date: fm.date ? String(fm.date) : null,
      tags,
      summary: fm.summary ? String(fm.summary) : null,
      folder,
    };
    raw.push({ slug, meta, body: parsed.content });

    // Wikilinks can target a note by title, by basename, or by full slug.
    resolver.set(normalize(title), slug);
    resolver.set(normalize(basename), slug);
    resolver.set(normalize(slug), slug);
  }

  // Second pass: resolve wikilinks -> outgoing slugs + rendered markdown.
  const notes = new Map<string, Note>();
  for (const { slug, meta, body } of raw) {
    const outgoing = new Set<string>();
    // 1) Obsidian image embeds ![[file.png]] -> standard markdown image under /assets.
    const withImages = body.replace(IMG_EMBED_RE, (_m, inner: string) => {
      const [srcRaw, altRaw] = inner.split("|");
      const file = srcRaw.trim();
      // Resolve to /assets/<basename>; images are synced there from content/ by
      // scripts/sync-assets.mjs (also runs on predev/prebuild).
      const base = file.split("/").pop() || file;
      const href = file.startsWith("/") ? file : `/assets/${encodeURIComponent(base).replace(/\(/g, "%28").replace(/\)/g, "%29")}`;
      return `![${(altRaw || file).trim()}](${href})`;
    });
    // 2) Wikilinks [[note]] / [[note|alias]] -> resolved internal links.
    const rendered = withImages.replace(WIKILINK_RE, (_m, inner: string) => {
      const [targetRaw, aliasRaw] = inner.split("|");
      const target = targetRaw.trim();
      const alias = (aliasRaw || targetRaw).trim();
      const resolved = resolver.get(normalize(target));
      if (resolved) {
        outgoing.add(resolved);
        // encode slug segments but keep the path separators
        const href = "/notes/" + resolved.split("/").map(encodeURIComponent).join("/");
        return `[${alias}](${href} "wikilink")`;
      }
      // Unresolved link: render as a non-navigating marker.
      return `[${alias}](#missing "wikilink-missing")`;
    });
    notes.set(slug, { ...meta, body, rendered, outgoing: [...outgoing] });
  }

  const order = [...notes.values()]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((n) => n.slug);

  return { notes, order, resolver };
}

function index(): Index {
  if (!_cache) _cache = build();
  return _cache;
}

export function getAllNotes(): Note[] {
  const { notes, order } = index();
  return order.map((s) => notes.get(s)!);
}

export function getNote(slug: string): Note | null {
  return index().notes.get(slug) ?? null;
}

export function getAllSlugs(): string[] {
  return index().order;
}

// Notes that link TO the given slug.
export function getBacklinks(slug: string): { slug: string; title: string }[] {
  const { notes } = index();
  const out: { slug: string; title: string }[] = [];
  for (const n of notes.values()) {
    if (n.slug !== slug && n.outgoing.includes(slug)) {
      out.push({ slug: n.slug, title: n.title });
    }
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}

// Recursively-nested folder tree of all notes.
export function getTree(): TreeNode[] {
  const { notes, order } = index();
  const root: TreeNode[] = [];

  const findFolder = (children: TreeNode[], name: string, fullPath: string): TreeNode[] => {
    let node = children.find(
      (c) => c.type === "folder" && c.name === name
    ) as Extract<TreeNode, { type: "folder" }> | undefined;
    if (!node) {
      node = { type: "folder", name, path: fullPath, children: [] };
      children.push(node);
    }
    return node.children;
  };

  for (const slug of order) {
    const note = notes.get(slug)!;
    let level = root;
    let acc = "";
    for (const seg of note.folder) {
      acc = acc ? `${acc}/${seg}` : seg;
      level = findFolder(level, seg, acc);
    }
    level.push({
      type: "note",
      name: slug.split("/").pop()!,
      slug,
      title: note.title,
    });
  }

  // Sort: folders first (alpha), then notes (by title).
  const sortLevel = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      const an = a.type === "folder" ? a.name : a.title;
      const bn = b.type === "folder" ? b.name : b.title;
      return an.localeCompare(bn);
    });
    for (const n of nodes) if (n.type === "folder") sortLevel(n.children);
  };
  sortLevel(root);
  return root;
}

// Knowledge graph derived from resolved wikilinks (undirected, de-duped edges).
export function getGraph(): GraphData {
  const { notes } = index();
  const degree = new Map<string, number>();
  const seen = new Set<string>();
  const links: GraphData["links"] = [];

  for (const n of notes.values()) {
    for (const target of n.outgoing) {
      const key = [n.slug, target].sort().join("\u0000");
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ source: n.slug, target });
      degree.set(n.slug, (degree.get(n.slug) || 0) + 1);
      degree.set(target, (degree.get(target) || 0) + 1);
    }
  }

  const nodes = [...notes.values()].map((n) => ({
    id: n.slug,
    title: n.title,
    group: n.folder[0] || "root",
    degree: degree.get(n.slug) || 0,
  }));

  return { nodes, links };
}

// Table of contents for a single note. Uses the SAME github-slugger as
// rehype-slug (in MarkdownView), so anchor ids match the rendered heading ids.
export function getToc(slug: string): TocItem[] {
  const note = getNote(slug);
  if (!note) return [];
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;
  for (const raw of note.body.split("\n")) {
    if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = raw.match(/^(#{1,6})\s+(.*)$/);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "").replace(/\$+/g, "").trim();
    if (!text) continue;
    items.push({ depth: m[1].length, text, id: slugger.slug(text) });
  }
  return items;
}

export function getTags(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const n of getAllNotes()) for (const t of n.tags) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getProfile(): Profile {
  if (fs.existsSync(PROFILE_PATH)) {
    return JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as Profile;
  }
  return {
    name: "Your Name",
    headline: "Researcher",
    bio: ["Edit content/profile.json to introduce yourself."],
  };
}

const SITE_PATH = path.join(process.cwd(), "content", "site.json");

export function getSiteConfig(): SiteConfig {
  if (fs.existsSync(SITE_PATH)) {
    return JSON.parse(fs.readFileSync(SITE_PATH, "utf-8")) as SiteConfig;
  }
  return {};
}

export function getStats() {
  const notes = getAllNotes();
  const tags = new Set<string>();
  notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
  const dates = notes
    .map((n) => n.date)
    .filter((d): d is string => !!d)
    .sort();
  const first = dates[0];
  const days = first
    ? Math.max(1, Math.floor((Date.now() - new Date(first).getTime()) / 86400000))
    : 0;
  const links = getGraph().links.length;
  return { noteCount: notes.length, tagCount: tags.size, linkCount: links, days };
}

// "YYYY-MM-DD" for every dated note (for the calendar widget).
export function getNoteDates(): string[] {
  return getAllNotes()
    .map((n) => n.date)
    .filter((d): d is string => !!d)
    .map((d) => String(d).slice(0, 10));
}
