"use client";
import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content";

export default function NoteToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;
  const min = Math.min(...items.map((i) => i.depth));

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setActive(id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-serif text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span>📑</span> 目录 · Contents
      </h3>
      <nav className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
        {items.map((it, i) => (
          <a
            key={i}
            href={`#${it.id}`}
            onClick={(e) => go(e, it.id)}
            style={{ paddingLeft: (it.depth - min) * 12 + 8 }}
            className={`block py-1 pr-2 rounded-lg text-sm truncate border-l-2 transition-colors ${
              active === it.id
                ? "border-indigo-500 text-indigo-700 bg-indigo-50/60 font-medium"
                : "border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
            }`}
            title={it.text}
          >
            {it.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
