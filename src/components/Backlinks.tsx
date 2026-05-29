import Link from "next/link";

export default function Backlinks({
  items,
}: {
  items: { slug: string; title: string }[];
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-serif text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span>🔗</span> 反向链接 · Backlinks
        <span className="ml-auto text-xs font-mono text-slate-400">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">还没有其它笔记链接到这里。</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/notes/${b.slug}`}
                className="block text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg px-2 py-1 transition-colors truncate"
              >
                {b.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
