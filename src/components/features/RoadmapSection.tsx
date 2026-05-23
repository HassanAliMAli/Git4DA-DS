"use client";

import React from "react";

export const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="border-b border-white/5 bg-ink-2/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-16 text-left">
          <div>
            <div className="text-[11px] font-black tracking-[0.4em] text-gh-blue mb-4 uppercase italic underline decoration-gh-blue/20 underline-offset-4">
              0 TO LEGENDARY • 20 LEVELS OF MASTERY
            </div>
            <h2 className="text-[36px] lg:text-[54px] font-black tracking-tighter leading-[0.95] text-white italic uppercase">
              The path is not linear.
              <br />
              <span className="text-white font-light font-serif opacity-70 normal-case italic">
                It is versioned.
              </span>
            </h2>
          </div>
          <div className="text-right hidden lg:block">
            <div className="inline-flex items-center gap-5 px-6 py-4 rounded-2xl bg-ink border border-white/10 shadow-inner">
              <div className="text-left">
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black italic mb-1">
                  Cohort analytics
                </div>
                <div className="text-[14px] font-black text-white italic font-mono uppercase tracking-tighter">
                  Level 14 • Interactive Rebase
                </div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-[32px] font-mono font-black text-gh-blue leading-none italic shadow-glow">
                63%
              </div>
            </div>
          </div>
        </div>

        {/* Modules grid */}
        <div
          className="grid lg:grid-cols-5 gap-6 items-start text-left font-sans"
          id="modules"
        >
          {/* Module 1 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
              <div className="text-[11px] font-black font-mono text-gh-blue mb-3 uppercase tracking-widest italic underline decoration-gh-blue/20">
                MODULE 01
              </div>
              <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">
                The Safety Net
              </div>
              <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">
                Commits, ignore, time travel, undo. The zero-panic foundation.
              </div>
              <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  01 • Atomic commits
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  02 • .gitignore patterns
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  03 • Time travel
                </div>
                <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/40 italic">
                  04 • Undo without fear
                </div>
              </div>
            </div>
          </div>

          {/* Module 2 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
              <div className="text-[11px] font-black font-mono text-teal-400 mb-3 uppercase tracking-widest italic underline decoration-teal-400/20">
                MODULE 02
              </div>
              <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">
                Collaboration
              </div>
              <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">
                Branching, remotes, conflicts, PRs. Professional sync.
              </div>
              <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  05 • Branch topology
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  06 • Remotes & forks
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  07 • Conflict resolution
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  08 • PRs that ship
                </div>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
              <div className="text-[11px] font-black font-mono text-gh-warn mb-3 uppercase tracking-widest italic underline decoration-gh-warn/20">
                MODULE 03
              </div>
              <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">
                Data Forge
              </div>
              <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">
                dbt, Jupytext, SQLFluff, DVC. Specialized data tooling.
              </div>
              <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  09 • dbt + Git
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  10 • Notebooks
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  11 • Quality hooks
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">
                  12 • DVC & MLOps
                </div>
              </div>
            </div>
          </div>

          {/* Module 4 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gh-blue/30 bg-gh-blue/[0.03] p-6 shadow-glow transition-all duration-500 hover:border-gh-blue/50 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-[11px] font-black font-mono text-gh-blue uppercase tracking-widest italic">
                  MODULE 04
                </div>
                <span className="px-2 py-0.5 rounded bg-gh-blue text-white font-black font-mono text-[8px] tracking-widest uppercase italic animate-pulse shadow-sm">
                  ELITE
                </span>
              </div>
              <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic underline decoration-gh-blue/20">
                Big Tech Scale
              </div>
              <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-95 border-l border-gh-blue/30 pl-4">
                Meta/Airbnb scale. History rewriting, bisect audits.
              </div>
              <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                <div className="flex items-center gap-2 text-white font-black italic underline decoration-gh-blue/30">
                  13 • Sparse checkout
                </div>
                <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/50 italic">
                  14 • Interactive rebase
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80">
                  15 • Git bisect audit
                </div>
                <div className="flex items-center gap-2 text-white italic opacity-80">
                  16 • Filter-repo
                </div>
              </div>
            </div>
          </div>

          {/* Module 5 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gh-green/30 bg-gh-green/[0.03] p-6 shadow-inner transition-all duration-500 hover:border-gh-green/50 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-[11px] font-black font-mono text-gh-green uppercase tracking-widest italic">
                  MODULE 05
                </div>
                <span className="px-2 py-0.5 rounded bg-gh-green text-white font-black font-mono text-[8px] tracking-widest uppercase italic shadow-sm">
                  LEGEND
                </span>
              </div>
              <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic underline decoration-gh-green/20">
                The Dark Arts
              </div>
              <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-95 border-l border-gh-green/30 pl-4 font-serif">
                Reflog resurrection, shadow clones, GPG seals.
              </div>
              <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black text-gh-green/90 italic">
                <div className="flex items-center gap-2 font-black italic animate-pulse">
                  17 • Reflog resurr.
                </div>
                <div className="font-black">18 • Shadow clones</div>
                <div className="text-zinc-500 opacity-60">19 • GPG seals</div>
                <div className="text-zinc-500 opacity-50">
                  20 • Piper Master
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
