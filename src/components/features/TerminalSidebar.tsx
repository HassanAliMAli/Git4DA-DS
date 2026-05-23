"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Shield,
  ChevronRight,
  Activity,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { GitGraphVisualizer } from "@/components/GitGraphVisualizer";
import { UserProfile } from "@/models/Profile";
import { GitCommit } from "@/lib/git/types";

interface TerminalSidebarProps {
  profile: UserProfile;
  currentLevel: {
    id: number;
    title: string;
    goals: Array<{
      id: string;
      description: string;
    }>;
  };
  completedGoalIds: Set<string>;
  graphData: {
    commits: (GitCommit & { hash: string })[];
    branches: { name: string; hash: string }[];
  };
  currentBranch: string;
  isLevelComplete: boolean;
  onNextLevel: () => void;
  onAbort: () => void;
}

export function TerminalSidebar({
  profile,
  currentLevel,
  completedGoalIds,
  graphData,
  currentBranch,
  isLevelComplete,
  onNextLevel,
  onAbort,
}: TerminalSidebarProps) {
  return (
    <aside className="w-[22%] border-r border-white/10 bg-ink-2/60 backdrop-blur-3xl flex flex-col overflow-hidden shrink-0">
      <div className="p-8 h-full flex flex-col space-y-10 overflow-y-auto scrollbar-hide text-left">
        <header className="flex items-center justify-between mb-2">
          <button
            onClick={onAbort}
            className="group flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-gh-blue transition-colors italic underline decoration-white/10"
          >
            <ArrowLeft size={14} />
            Abort Mission
          </button>
          <div className="text-[10px] font-mono text-gh-blue italic font-black uppercase tracking-widest underline decoration-gh-blue/20">
            Node-v2.4
          </div>
        </header>

        {/* Profile Brief */}
        <div className="bg-white/5 rounded-[24px] p-5 border-2 border-white/5 flex items-center gap-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center text-sm font-black text-white shadow-inner">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-white truncate uppercase tracking-widest italic leading-tight mb-1">
              {profile.name}
            </div>
            <div className="text-[9px] font-mono text-gh-blue uppercase tracking-tighter italic font-black underline decoration-gh-blue/20">
              {profile.role.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Mission Intel */}
        <div className="space-y-8 text-left">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gh-blue/10 border-2 border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow shrink-0">
              <Target size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gh-blue uppercase tracking-[0.3em] italic mb-1 block">
                Assignment {currentLevel.id}
              </span>
              <h2 className="text-lg font-black text-white tracking-tighter italic uppercase underline decoration-white/5 underline-offset-4">
                {currentLevel.title}
              </h2>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic opacity-80">
                Objectives
              </h3>
              <span className="text-[10px] font-mono text-gh-blue italic font-black bg-gh-blue/5 px-2 py-0.5 rounded shadow-glow">
                {completedGoalIds.size}/{currentLevel.goals.length}
              </span>
            </div>

            <ul className="space-y-3">
              {currentLevel.goals.map((goal) => (
                <li
                  key={goal.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-500 shadow-xl ${
                    completedGoalIds.has(goal.id)
                      ? "bg-gh-green/10 border-gh-green/30 text-white"
                      : "bg-white/[0.04] border-white/5 text-zinc-100"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      completedGoalIds.has(goal.id)
                        ? "bg-gh-green border-gh-green text-white shadow-glow"
                        : "border-zinc-700"
                    }`}
                  >
                    {completedGoalIds.has(goal.id) && (
                      <Shield size={10} strokeWidth={4} />
                    )}
                  </div>
                  <span className="text-[12px] leading-relaxed font-black italic tracking-tight">
                    {goal.description}
                  </span>
                </li>
              ))}
            </ul>

            {isLevelComplete && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onNextLevel}
                className="w-full h-14 rounded-2xl bg-white text-ink font-black text-[13px] uppercase tracking-[0.4em] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-glow italic mt-8 border-2 border-white/20"
              >
                Next Mission
                <ChevronRight size={16} className="text-gh-blue" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Git Graph Visualizer */}
        <div className="flex-1 flex flex-col min-h-0 space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic opacity-80">
              Live Lineage
            </h3>
            <Activity
              size={14}
              className="text-gh-green animate-pulse shadow-glow"
            />
          </div>
          <div className="flex-1 min-h-[180px] rounded-[32px] overflow-hidden border-2 border-white/5 bg-ink/60 shadow-2xl shadow-inner">
            <GitGraphVisualizer
              commits={graphData.commits}
              branches={graphData.branches}
              currentBranch={currentBranch}
            />
          </div>
        </div>

        {/* Security Info (Moved from main to sidebar as requested) */}
        <div className="mt-auto pt-6 flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] text-white italic uppercase tracking-[0.2em] font-black">
            <Lock size={10} className="text-gh-warn animate-pulse" />
            Integrity: <span className="text-gh-green">Verified</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
