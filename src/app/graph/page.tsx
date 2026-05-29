import BackgroundGrid from "@/components/BackgroundGrid";
import SiteHeader from "@/components/SiteHeader";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { getGraph, getProfile } from "@/lib/content";

export const metadata = { title: "知识图谱 — Knowledge Graph" };

export default function GraphPage() {
  const data = getGraph();
  const profile = getProfile();
  return (
    <div className="min-h-screen text-slate-700">
      <BackgroundGrid />
      <SiteHeader name={profile.name} />
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-12 animate-fade-in">
        <div className="flex items-end justify-between mb-4">
          <h1 className="font-serif text-3xl font-bold text-slate-900">知识图谱 · Knowledge Graph</h1>
          <p className="text-sm text-slate-400">
            {data.nodes.length} 个笔记 · {data.links.length} 条链接 · 悬停聚焦，点击进入
          </p>
        </div>
        {data.nodes.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center text-slate-400">
            还没有笔记。用 <code className="text-indigo-500">[[双链]]</code> 把笔记连起来即可生成图谱。
          </div>
        ) : (
          <KnowledgeGraph data={data} />
        )}
      </div>
    </div>
  );
}
