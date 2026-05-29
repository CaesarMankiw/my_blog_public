"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/graph", label: "Graph" },
];

export default function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
            {name?.[0]?.toUpperCase() || "M"}
          </div>
          <span className="font-serif text-lg font-bold text-slate-800">{name}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(n.href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
