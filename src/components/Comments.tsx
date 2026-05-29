"use client";
import Giscus from "@giscus/react";
import type { SiteConfig } from "@/lib/content";

export default function Comments({ giscus }: { giscus: SiteConfig["giscus"] }) {
  const configured = giscus && giscus.repo && giscus.repoId && giscus.categoryId;

  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 mt-6">
      <h2 className="font-serif text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        💬 评论 · Comments
      </h2>
      {configured ? (
        <Giscus
          repo={giscus!.repo as `${string}/${string}`}
          repoId={giscus!.repoId}
          category={giscus!.category}
          categoryId={giscus!.categoryId}
          mapping={(giscus!.mapping as "pathname") || "pathname"}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="zh-CN"
          loading="lazy"
        />
      ) : (
        <div className="text-sm text-slate-500 leading-relaxed">
          评论功能基于 <span className="font-medium text-slate-700">giscus</span>（评论存进 GitHub Discussions，无需后端）。
          开启步骤：把仓库设为 public 并开启 Discussions、安装 giscus app，到{" "}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
            giscus.app
          </a>{" "}
          生成 <code className="text-indigo-500">repoId / categoryId</code>，填进{" "}
          <code className="text-indigo-500">content/site.json</code> 即可。
        </div>
      )}
    </section>
  );
}
