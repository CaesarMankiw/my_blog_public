#!/usr/bin/env node
// One-click cleanup of SAMPLE content.
// Backs up everything under content/notes to content/_backup_<timestamp>/,
// then deletes only notes whose frontmatter contains `sample: true`,
// leaving any real notes you've added untouched. Then writes a starter note
// if the vault ends up empty. profile.json is never deleted (edit it yourself).
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const NOTES = path.join(ROOT, "content", "notes");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : full.endsWith(".md") ? [full] : [];
  });
}
function isSample(file) {
  const txt = fs.readFileSync(file, "utf-8");
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return !!m && /\bsample:\s*true\b/.test(m[1]);
}

const files = walk(NOTES);
const samples = files.filter(isSample);

if (samples.length === 0) {
  console.log("No sample notes found (nothing flagged `sample: true`). Nothing to do.");
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(ROOT, "content", `_backup_${stamp}`);
for (const f of files) {
  const rel = path.relative(NOTES, f);
  const dest = path.join(backupDir, "notes", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(f, dest);
}
console.log(`Backed up ${files.length} note(s) to ${path.relative(ROOT, backupDir)}`);

for (const f of samples) {
  fs.rmSync(f);
}
console.log(`Deleted ${samples.length} sample note(s).`);

// Remove now-empty folders under notes.
function prune(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) prune(path.join(dir, e.name));
  }
  if (dir !== NOTES && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
prune(NOTES);

if (walk(NOTES).length === 0) {
  fs.mkdirSync(NOTES, { recursive: true });
  fs.writeFileSync(
    path.join(NOTES, "welcome.md"),
    `---\ntitle: 第一篇笔记\ndate: ${new Date().toISOString().slice(0, 10)}\ntags: []\nsummary: ""\n---\n\n# 第一篇笔记\n\n开始写吧。用 [[其它笔记标题]] 建立双链。\n`
  );
  console.log("Vault empty -> wrote a starter content/notes/welcome.md");
}
console.log("Done. Remember to edit content/profile.json with your real info.");
