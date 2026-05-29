import Link from "next/link";

export default function StatsWidget({
  stats,
}: {
  stats: { noteCount: number; tagCount: number; linkCount: number; days: number };
}) {
  const items = [
    { label: "笔记", value: stats.noteCount },
    { label: "标签", value: stats.tagCount },
    { label: "双链", value: stats.linkCount },
    { label: "天数", value: stats.days },
  ];
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-serif text-base font-bold text-slate-800 mb-3">花园概览</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="text-center rounded-xl bg-white/50 py-3">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{it.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{it.label}</div>
          </div>
        ))}
      </div>
      <Link href="/graph" className="mt-3 block text-center text-sm font-medium text-indigo-600 hover:underline">
        查看知识图谱 →
      </Link>
    </div>
  );
}
