import Link from "next/link";
import BackgroundGrid from "@/components/BackgroundGrid";
import SiteHeader from "@/components/SiteHeader";
import Weather from "@/components/Weather";
import CalendarWidget from "@/components/CalendarWidget";
import StatsWidget from "@/components/StatsWidget";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import { getProfile, getAllNotes, getStats, getNoteDates, getSiteConfig } from "@/lib/content";

export default function HomePage() {
  const profile = getProfile();
  const stats = getStats();
  const noteDates = getNoteDates();
  const site = getSiteConfig();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 animate-slide-up">
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
              {profile.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            {profile.interests && profile.interests.length > 0 && (
              <section className="mt-6">
                <h2 className="font-serif text-xl font-bold text-slate-800 mb-3">研究方向 · Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600 border border-indigo-100">{t}</span>
                  ))}
                </div>
              </section>
            )}

            {profile.publications && profile.publications.length > 0 && (
              <section className="mt-8">
                <h2 className="font-serif text-xl font-bold text-slate-800 mb-4">论文发表 · Publications</h2>
                <ol className="space-y-4">
                  {profile.publications.map((p, i) => (
                    <li key={i} className="glass-card rounded-2xl p-5 flex gap-4">
                      <span className="font-serif text-lg font-bold text-indigo-300 shrink-0">{i + 1}</span>
                      <div>
                        <h3 className="font-medium text-slate-800 leading-snug">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">{p.title}</a>
                          ) : (
                            p.title
                          )}
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

            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-slate-800">最近笔记 · Recent</h2>
                <Link href="/notes" className="text-sm font-medium text-indigo-600 hover:underline">全部 →</Link>
              </div>
              <div className="space-y-3">
                {recent.length === 0 ? (
                  <p className="text-slate-400 text-sm">还没有笔记。</p>
                ) : (
                  recent.map((n) => (
                    <Link key={n.slug} href={`/notes/${n.slug}`} className="glass-card block rounded-2xl p-5 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-serif text-lg font-bold text-slate-800">{n.title}</h3>
                        <time className="text-xs text-slate-400 font-mono shrink-0">{n.date}</time>
                      </div>
                      {n.summary && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{n.summary}</p>}
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 animate-fade-in">
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
