"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TreeNode } from "@/lib/content";

function FolderNode({ node, depth }: { node: Extract<TreeNode, { type: "folder" }>; depth: number }) {
  const [open, setOpen] = useState(true);
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        style={{ paddingLeft: depth * 12 + 8 }}
      >
        <span className={`text-[10px] text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
        <span>📁</span>
        <span className="font-medium truncate">{node.name}</span>
      </button>
      {open && (
        <ul>
          {node.children.map((c, i) => (
            <TreeItem key={i} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function NoteLeaf({ node, depth }: { node: Extract<TreeNode, { type: "note" }>; depth: number }) {
  const pathname = usePathname();
  const href = `/notes/${node.slug}`;
  const active = decodeURIComponent(pathname) === href;
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm truncate transition-colors ${
          active
            ? "bg-indigo-50 text-indigo-700 font-medium"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}
        style={{ paddingLeft: depth * 12 + 22 }}
      >
        <span className="text-slate-400">📄</span>
        <span className="truncate">{node.title}</span>
      </Link>
    </li>
  );
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  return node.type === "folder" ? (
    <FolderNode node={node} depth={depth} />
  ) : (
    <NoteLeaf node={node} depth={depth} />
  );
}

export default function NoteTree({ tree }: { tree: TreeNode[] }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="font-serif text-base font-bold text-slate-800 mb-3 px-2 flex items-center gap-2">
        <span>🗂️</span> 笔记库 · Vault
      </h3>
      <nav className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
        {tree.length === 0 ? (
          <p className="text-sm text-slate-400 px-2">content/notes 为空。</p>
        ) : (
          <ul>
            {tree.map((n, i) => (
              <TreeItem key={i} node={n} depth={0} />
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}
