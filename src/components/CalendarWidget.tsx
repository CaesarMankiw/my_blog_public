"use client";
import { useState } from "react";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarWidget({ noteDates }: { noteDates: string[] }) {
  const counts = new Map<string, number>();
  for (const d of noteDates) counts.set(d, (counts.get(d) || 0) + 1);

  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const first = new Date(view.year, view.month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const shift = (delta: number) => {
    const m = view.month + delta;
    setView({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };
  const todayStr = ymd(today);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600">‹</button>
        <h3 className="font-serif text-base font-bold text-slate-800">
          {view.year} 年 {view.month + 1} 月
        </h3>
        <button onClick={() => shift(1)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] text-slate-400 py-1">{w}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const ds = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isToday = ds === todayStr;
          const n = counts.get(ds) || 0;
          return (
            <div
              key={i}
              title={n ? `${n} 篇笔记` : undefined}
              className={`relative aspect-square flex items-center justify-center text-xs rounded-lg transition-colors ${
                isToday ? "bg-gradient-primary text-white font-bold" : n ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
              }`}
            >
              {d}
              {n > 0 && !isToday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
