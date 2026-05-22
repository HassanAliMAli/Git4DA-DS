"use client";

import React from 'react';
import { GitCommit } from '@/models/GitRepository';
import { GitBranch, User, Hash } from 'lucide-react';

interface GraphCommit extends GitCommit {
  hash: string;
}

interface GitGraphVisualizerProps {
  commits: GraphCommit[];
  branches: { name: string, hash: string }[];
  currentBranch: string;
}

export function GitGraphVisualizer({ 
  commits, 
  branches, 
  currentBranch 
}: GitGraphVisualizerProps) {
  if (commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-ink-2/30 border border-white/5 rounded-2xl border-dashed">
        <GitBranch className="text-zinc-700 mb-3" size={24} />
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] italic">No history detected</p>
      </div>
    );
  }

  const spacing = 80;
  const dotRadius = 6;
  const startX = 30;

  return (
    <div className="bg-ink-2/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-glow h-full flex flex-col">
      <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          <GitBranch size={14} className="text-sage" />
          Branch Lineage
        </div>
        <span className="text-[9px] font-mono text-sage px-2 py-0.5 rounded-full bg-sage/10 border border-sage/20 uppercase font-bold italic">
          {currentBranch}
        </span>
      </div>

      <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
        <svg width="100%" height={commits.length * spacing + 40}>
          {commits.map((commit, idx) => {
            const y = (idx + 1) * spacing - 40;
            const nextCommit = commits[idx + 1];
            const pointingBranches = branches.filter(b => b.hash === commit.hash);

            return (
              <g key={commit.hash}>
                {/* Connection Line */}
                {commit.parent && nextCommit && (
                  <line 
                    x1={startX} y1={y} 
                    x2={startX} y2={y + spacing} 
                    className="stroke-zinc-800 stroke-[1.5]"
                  />
                )}
                
                {/* Commit Node */}
                <circle 
                  cx={startX} cy={y} r={dotRadius} 
                  className={`${
                    pointingBranches.some(b => b.name === currentBranch) 
                      ? 'fill-sage stroke-white' 
                      : 'fill-zinc-800 stroke-zinc-700'
                  } stroke-2 transition-all duration-500`}
                />

                {/* Commit Content */}
                <foreignObject x={startX + 24} y={y - 15} width="85%" height="60">
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="text-[13px] font-medium text-white truncate w-full italic">
                      {commit.message}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                        <Hash size={10} /> {commit.hash.substring(0, 7)}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                        <User size={10} /> {commit.author}
                      </span>
                    </div>
                  </div>
                </foreignObject>

                {/* Branch Labels */}
                {pointingBranches.map((branch, bIdx) => (
                  <foreignObject key={branch.name} x="75%" y={y - 12} width="80" height="30">
                    <div className={`
                      inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tighter italic
                      ${branch.name === currentBranch 
                        ? 'bg-sage/10 border-sage/30 text-sage' 
                        : 'bg-zinc-800/50 border-white/5 text-zinc-500'}
                    `}>
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
