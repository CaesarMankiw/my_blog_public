import Link from "next/link";
import BackgroundGrid from "@/components/BackgroundGrid";
import SiteHeader from "@/components/SiteHeader";
import Weather from "@/components/Weather";
import CalendarWidget from "@/components/CalendarWidget";
import StatsWidget from "@/components/StatsWidget";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import {
  getProfile, getAllNotes, getStats, getNoteDates, getSiteConfig, getTags, getGraph,
} from "@/lib/content";

export default function HomePage() {
  const profile = getProfile();
  const stats = getStats();
  const noteDates = getNoteDates();
  const site = getSiteConfig();
  const tags = getTags().slice(0, 16);
  const hubs = getGraph().nodes
    .filter((n) => n.degree > 0)
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 6);
  const recent = getAllNotes()
    .filter((n) => n.date)
    .sort((a, b) => (a.date! < b.date! ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="min-h-screen text-slate-700">
      <BackgroundGrid />
      <WelcomeOverlay title={site.title || profile.name} />
      <SiteHeader name={profile.name} />

      <main className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* ===== Main (center) ===== */}
          <div className="lg:col-start-4 lg:col-span-6 lg:row-start-1 animate-slide-up">
            <section className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold font-serif shadow-lg shadow-indigo-200/60 shrink-0">
                {profile.avatarText || profile.name?.[0]?.toUpperCase() || "M"}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-4xl font-bold text-slate-900 leading-tight">{profile.name}</h1>
                <p className="mt-2 text-lg text-indigo-600 font-medium">{profile.headline}</p>
                {profile.affiliations?.map((a, i) => (
                  <p key={i} className="text-sm text-slate-500">
                    <span className="text-slate-700 font-medium">{a.role}</span>, {a.org}
                  </p>
                ))}
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="px-3 py-1.5 rounded-full text-sm bg-white/70 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                      ✉ {profile.email}
                    </a>
                  )}
                  {profile.links?.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full text-sm bg-white/70 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8 prose prose-slate max-w-none prose-p:leading-relaxed">
              {profile.bio.map((p, i) => <p key={i}>{p}</p>)}
            </section>

            {profile.interests && profile.interests.length > 0 && (
              <section id="interests" className="mt-6 scroll-mt-24">
                <h2 className="font-serif text-xl font-bold text-slate-800 mb-3">研究方向 · Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600 border border-indigo-100">{t}</span>
                  ))}
                </div>
              </section>
            )}

            {profile.publications && profile.publications.length > 0 && (
              <section id="publications" className="mt-8 scroll-mt-24">
                <h2 className="font-serif text-xl font-bold text-slate-800 mb-4">论文发表 · Publications</h2>
                <ol className="space-y-4">
                  {profile.publications.map((p, i) => (
                    <li key={i} className="glass-card rounded-2xl p-5 flex gap-4">
                      <span className="font-serif text-lg font-bold text-indigo-300 shrink-0">{i + 1}</span>
                      <div>
                        <h3 className="font-medium text-slate-800 leading-snug">
                          {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">{p.title}</a> : p.title}
                          {p.note && <span className="ml-2 text-[11px] align-middle px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{p.note}</span>}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{p.authors}</p>
                        <p className="text-sm text-slate-400 italic">{p.venue}, {p.year}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section id="recent" className="mt-8 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-slate-800">最近笔记 · Recent</h2>
                <Link href="/notes" className="text-sm font-medium text-indigo-600 hover:underline">全部 →</Link>
              </div>
              <div className="space-y-3">
                {recent.length === 0 ? (
                  <p className="text-slate-400 text-sm">还没有笔记。</p>
                ) : recent.map((n) => (
                  <Link key={n.slug} href={`/notes/${n.slug}`} className="glass-card block rounded-2xl p-5 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-lg font-bold text-slate-800">{n.title}</h3>
                      <time className="text-xs text-slate-400 font-mono shrink-0">{n.date}</time>
                    </div>
                    {n.summary && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{n.summary}</p>}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ===== Left rail ===== */}
          <aside className="lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:sticky lg:top-24 space-y-5 animate-fade-in">
            <nav className="glass-card rounded-2xl p-5">
              <h3 className="font-serif text-base font-bold text-slate-800 mb-3">导航 · Navigate</h3>
              <ul className="space-y-1 text-sm">
                {[
                  { href: "#interests", label: "研究方向" },
                  { href: "#publications", label: "论文发表" },
                  { href: "#recent", label: "最近笔记" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="block px-2 py-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors">› {l.label}</a>
                  </li>
                ))}
                <li className="pt-1 mt-1 border-t border-slate-200/60">
                  <Link href="/notes" className="block px-2 py-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors">🗂️ 全部笔记</Link>
                </li>
                <li>
                  <Link href="/graph" className="block px-2 py-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors">🕸️ 知识图谱</Link>
                </li>
              </ul>
            </nav>

            {tags.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-serif text-base font-bold text-slate-800 mb-3">标签 · Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t.name} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600">
                      #{t.name} <span className="text-slate-400">{t.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hubs.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-serif text-base font-bold text-slate-800 mb-3">中心笔记 · Hubs</h3>
                <ul className="space-y-1">
                  {hubs.map((h) => (
                    <li key={h.id}>
                      <Link href={`/notes/${h.id}`} className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                        <span className="truncate">{h.title}</span>
                        <span className="shrink-0 text-xs text-indigo-400 font-mono">{h.degree}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ===== Right rail (narrower, equal to left) ===== */}
          <aside className="lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:sticky lg:top-24 space-y-5 animate-fade-in">
            <Weather />
            <CalendarWidget noteDates={noteDates} />
            <StatsWidget stats={stats} />
          </aside>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-200/60 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {profile.name} · {site.title || "雾中风景"}
        </footer>
      </main>
    </div>
  );
}
