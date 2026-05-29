"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, type Simulation } from "d3-force";
import { select } from "d3-selection";
import { drag as d3drag } from "d3-drag";
import { zoom as d3zoom, zoomIdentity } from "d3-zoom";
import type { GraphData } from "@/lib/content";

type SimNode = { id: string; title: string; group: string; degree: number; x?: number; y?: number; fx?: number | null; fy?: number | null };
type SimLink = { source: string | SimNode; target: string | SimNode };

const W = 900;
const H = 620;
const PALETTE = ["#6366f1", "#a855f7", "#ec4899", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

export default function KnowledgeGraph({ data }: { data: GraphData }) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const [, force] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  const nodes = useMemo<SimNode[]>(() => data.nodes.map((n) => ({ ...n })), [data]);
  const links = useMemo<SimLink[]>(() => data.links.map((l) => ({ ...l })), [data]);

  const colorOf = useMemo(() => {
    const groups = Array.from(new Set(data.nodes.map((n) => n.group)));
    const map = new Map<string, string>();
    groups.forEach((g, i) => map.set(g, PALETTE[i % PALETTE.length]));
    return (g: string) => map.get(g) || "#94a3b8";
  }, [data]);

  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const l of data.links) {
      if (!m.has(l.source)) m.set(l.source, new Set());
      if (!m.has(l.target)) m.set(l.target, new Set());
      m.get(l.source)!.add(l.target);
      m.get(l.target)!.add(l.source);
    }
    return m;
  }, [data]);

  const simRef = useRef<Simulation<SimNode, undefined> | null>(null);

  useEffect(() => {
    const sim = forceSimulation<SimNode>(nodes)
      .force("charge", forceManyBody().strength(-280))
      .force("link", forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(75).strength(0.6))
      .force("center", forceCenter(W / 2, H / 2))
      .force("collide", forceCollide<SimNode>().radius((d) => 10 + d.degree * 2));
    sim.on("tick", () => force((t) => t + 1));
    simRef.current = sim;
    return () => void sim.stop();
  }, [nodes, links]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const g = select(gRef.current);
    const zoomBehavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    const svg = select(svgRef.current);
    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, zoomIdentity);
    return () => void svg.on(".zoom", null);
  }, []);

  useEffect(() => {
    if (!gRef.current) return;
    const sim = simRef.current;
    const dragBehavior = d3drag<SVGGElement, SimNode>()
      .on("start", (e, d) => {
        if (!e.active) sim?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on("end", (e, d) => {
        if (!e.active) sim?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    select(gRef.current).selectAll<SVGGElement, SimNode>("g.node").data(nodes).call(dragBehavior);
  });

  const isDim = (id: string) => hover !== null && hover !== id && !(adjacency.get(hover)?.has(id) ?? false);

  return (
    <div className="glass-card rounded-3xl p-2 sm:p-4 overflow-hidden">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto cursor-grab active:cursor-grabbing" style={{ maxHeight: "78vh" }}>
        <g ref={gRef}>
          {links.map((l, i) => {
            const s = l.source as SimNode;
            const t = l.target as SimNode;
            if (s.x == null || t.x == null) return null;
            const dim = hover !== null && s.id !== hover && t.id !== hover;
            return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={dim ? "#e2e8f0" : "#c7d2fe"} strokeWidth={dim ? 0.6 : 1.2} />;
          })}
          {nodes.map((n) => {
            if (n.x == null) return null;
            const r = 6 + n.degree * 2;
            return (
              <g
                key={n.id}
                className="node"
                transform={`translate(${n.x},${n.y})`}
                style={{ cursor: "pointer", opacity: isDim(n.id) ? 0.25 : 1, transition: "opacity .2s" }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => router.push(`/notes/${n.id}`)}
              >
                <circle r={r} fill={colorOf(n.group)} stroke="#fff" strokeWidth={1.5} />
                <text x={r + 4} y={4} fontSize={hover === n.id ? 13 : 11} fontWeight={hover === n.id ? 700 : 500} fill="#475569" style={{ pointerEvents: "none" }}>
                  {n.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="px-2 pb-1 pt-2 text-xs text-slate-400">滚轮缩放 · 拖拽空白处平移 · 拖拽节点调整 · 点击进入笔记</p>
    </div>
  );
}
