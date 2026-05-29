"use client";
import { useEffect, useState } from "react";

// Brief "雾中风景" entry veil that auto-fades. Dismissible by click.
export default function WelcomeOverlay({ title }: { title: string }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div
      onClick={() => setGone(true)}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-50/80 backdrop-blur-xl cursor-pointer animate-[fadeIn_.3s_ease-out]"
      style={{ animation: "fadeOut .6s ease-in 1s forwards" }}
    >
      <h1 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
        {title}
      </h1>
    </div>
  );
}
