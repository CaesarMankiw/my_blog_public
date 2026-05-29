import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ComponentPropsWithoutRef } from "react";

type CodeProps = ComponentPropsWithoutRef<"code"> & { inline?: boolean; node?: unknown };
type AnchorProps = ComponentPropsWithoutRef<"a"> & { node?: unknown };
type ImgProps = ComponentPropsWithoutRef<"img"> & { node?: unknown };

export default function MarkdownView({ content }: { content: string }) {
  return (
    <article
      className="prose prose-slate prose-lg max-w-none
        prose-headings:font-serif prose-headings:text-slate-800 prose-headings:scroll-mt-24
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        prose-code:text-pink-500 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          a(props: AnchorProps) {
            const { node, href, title, children, ...rest } = props;
            void node;
            // Wikilinks are tagged via the link title in the content engine.
            if (title === "wikilink-missing") {
              return <span className="wikilink-missing" title="未链接到任何笔记">{children}</span>;
            }
            if (title === "wikilink" && href) {
              return (
                <Link href={href} className="wikilink">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} {...rest} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img(props: ImgProps) {
            const { node, src, alt, ...rest } = props;
            void node;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeof src === "string" ? src : ""}
                alt={alt || ""}
                loading="lazy"
                className="rounded-2xl shadow-md border border-slate-100 my-6 mx-auto max-w-full"
                {...rest}
              />
            );
          },
          code(props: CodeProps) {
            const { node, inline, className, children, ...rest } = props;
            void node;
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden shadow-md my-6 border border-slate-100 not-prose">
                <div className="bg-[#fafafa] px-4 py-2 flex items-center gap-2 border-b border-slate-200/50">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80" />
                  <span className="ml-2 text-xs text-slate-400 font-mono">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  {...rest}
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: "1.5rem", background: "#fff", fontSize: "0.9rem" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
