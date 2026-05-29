import Link from "next/link";
import BackgroundGrid from "@/components/BackgroundGrid";
import SiteHeader from "@/components/SiteHeader";
import NoteTree from "@/components/NoteTree";
import { getTree, getAllNotes, getProfile } from "@/lib/content";

export default function NotesIndex() {
  const tree = getTree();
  const notes = getAllNotes();
  const profile = getProfile();

  return (
    <div className="min-h-screen text-slate-700">
      <BackgroundGrid />
      <SiteHeader name={profile.name} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <NoteTree tree={tree} />
          </aside>
          <main className="lg:col-span-9">
            <h1 className="font-serif text-3xl font-bold text-slate-900 mb-6">全部笔记 · {notes.length}</h1>
            <div className="grid sm:grid-cols-2 gap-4">
              {notes.map((n) => (
                <Link key={n.slug} href={`/notes/${n.slug}`} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5">
                  <h2 className="font-serif text-lg font-bold text-slate-800">{n.title}</h2>
                  {n.summary && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{n.summary}</p>}
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    {n.folder.length > 0 && <span className="font-mono">{n.folder.join("/")}</span>}
                    {n.date && <span>· {n.date}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
