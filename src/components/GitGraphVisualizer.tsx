"use client";

import React from "react";
import { GitCommit } from "@/lib/git/types";
import { GitBranch, User, Hash } from "lucide-react";

interface GraphCommit extends GitCommit {
  hash: string;
}

interface GitGraphVisualizerProps {
  commits: GraphCommit[];
  branches: { name: string; hash: string }[];
  currentBranch: string;
}

export function GitGraphVisualizer({
  commits,
  branches,
  currentBranch,
}: GitGraphVisualizerProps) {
  if (commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-ink-2/30 border border-white/5 rounded-2xl border-dashed">
        <GitBranch className="text-zinc-600 mb-3" size={24} />
        <p className="text-white text-[10px] font-mono uppercase tracking-[0.2em] italic font-bold">
          No history detected
        </p>
      </div>
    );
  }

  const spacing = 80;
  const dotRadius = 5;
  const startX = 30;

  return (
    <div className="bg-ink-2/50 backdrop-blur-xl border border-gh-border rounded-2xl overflow-hidden shadow-inner h-full flex flex-col font-sans">
      <div className="px-5 py-3.5 bg-ink-3 border-b border-gh-border flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[9px] font-black text-white uppercase tracking-[0.2em] italic">
          <GitBranch size={13} className="text-gh-blue shadow-glow" />
          Branch Lineage
        </div>
        <span className="text-[9px] font-mono text-gh-blue px-2 py-0.5 rounded-full bg-gh-blue/10 border border-gh-blue/20 uppercase font-black italic">
          {currentBranch}
        </span>
      </div>

      <div className="p-6 overflow-y-auto flex-1 scrollbar-hide bg-ink/20">
        <svg width="100%" height={commits.length * spacing + 40}>
          {commits.map((commit, idx) => {
            const y = (idx + 1) * spacing - 40;
            const nextCommit = commits[idx + 1];
            const pointingBranches = branches.filter(
              (b) => b.hash === commit.hash,
            );

            return (
              <g key={commit.hash}>
                {/* Connection Line */}
                {commit.parent && nextCommit && (
                  <line
                    x1={startX}
                    y1={y}
                    x2={startX}
                    y2={y + spacing}
                    className="stroke-gh-gray stroke-[1.5]"
                  />
                )}

                {/* Commit Node */}
                <circle
                  cx={startX}
                  cy={y}
                  r={dotRadius}
                  className={`${
                    pointingBranches.some((b) => b.name === currentBranch)
                      ? "fill-gh-blue stroke-white"
                      : "fill-gh-gray stroke-gh-border"
                  } stroke-1 transition-all duration-500`}
                />

                {/* Commit Content */}
                <foreignObject
                  x={startX + 20}
                  y={y - 15}
                  width="85%"
                  height="60"
                >
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="text-[12px] font-bold text-gh-text truncate w-full italic">
                      {commit.message}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase tracking-widest font-black italic">
                        <Hash size={10} /> {commit.hash.substring(0, 7)}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase tracking-widest font-black italic">
                        <User size={10} /> {commit.author.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </foreignObject>

                {/* Branch Labels */}
                {pointingBranches.map((branch, bIdx) => (
                  <foreignObject
                    key={branch.name}
                    x="72%"
                    y={y - 12}
                    width="80"
                    height="30"
                  >
                    <div
                      className={`
                      inline-flex items-center px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-tighter italic
                      ${
                        branch.name === currentBranch
                          ? "bg-gh-blue/10 border-gh-blue/30 text-gh-blue"
                          : "bg-zinc-900 border-white/5 text-zinc-400"
                      }
                    `}
                    >
                      {branch.name}
                    </div>
                  </foreignObject>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
