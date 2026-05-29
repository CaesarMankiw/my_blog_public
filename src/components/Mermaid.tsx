"use client";
import { useEffect, useRef, useState } from "react";

let counter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          fontFamily: "var(--font-sans)",
        });
        const id = `mmd-${counter++}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm not-prose">
        <p className="text-rose-600 font-medium mb-2">Mermaid 图表语法有误：</p>
        <pre className="text-xs text-rose-500 overflow-x-auto">{chart}</pre>
      </div>
    );
  }
  return <div ref={ref} className="my-6 flex justify-center not-prose [&_svg]:max-w-full [&_svg]:h-auto" />;
}
