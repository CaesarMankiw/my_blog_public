import { notFound } from "next/navigation";
import BackgroundGrid from "@/components/BackgroundGrid";
import SiteHeader from "@/components/SiteHeader";
import NoteTree from "@/components/NoteTree";
import MarkdownView from "@/components/MarkdownView";
import Backlinks from "@/components/Backlinks";
import Comments from "@/components/Comments";
import { getNote, getBacklinks, getTree, getAllSlugs, getProfile, getSiteConfig } from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }) {
  const note = getNote(params.slug.map(decodeURIComponent).join("/"));
  return { title: note ? `${note.title} — 笔记` : "笔记" };
}

export default function NotePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.map(decodeURIComponent).join("/");
  const note = getNote(slug);
  if (!note) notFound();

  const tree = getTree();
  const backlinks = getBacklinks(slug);
  const profile = getProfile();
  const site = getSiteConfig();

  return (
    <div className="min-h-screen text-slate-700">
      <BackgroundGrid />
      <SiteHeader name={profile.name} />
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <NoteTree tree={tree} />
          </aside>

          <main className="lg:col-span-6">
            <article className="glass-card rounded-3xl p-8 md:p-10">
              <header className="mb-8 pb-6 border-b border-slate-200/60">
                {note.folder.length > 0 && (
                  <p className="text-xs font-mono text-slate-400 mb-2">{note.folder.join(" / ")}</p>
                )}
                <h1 className="font-serif text-4xl font-bold text-slate-900 leading-tight">{note.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {note.date && <time className="font-mono">{note.date}</time>}
                  {note.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                      #{t}
                    </span>
                  ))}
                </div>
              </header>
              <MarkdownView content={note.rendered} />
            </article>
            <Comments giscus={site.giscus} />
          </main>

          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
            <Backlinks items={backlinks} />
            {note.outgoing.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-serif text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>↗</span> 出链 · Links
                  <span className="ml-auto text-xs font-mono text-slate-400">{note.outgoing.length}</span>
                </h3>
                <ul className="space-y-1.5">
                  {note.outgoing.map((s) => (
                    <li key={s}>
                      <a
                        href={`/notes/${s}`}
                        className="block text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg px-2 py-1 transition-colors truncate"
                      >
                        {s.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
