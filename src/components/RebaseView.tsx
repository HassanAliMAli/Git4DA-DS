"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, Edit3, Trash2, CheckCircle2, Terminal as TerminalIcon } from "lucide-react";

export type RebaseAction = "pick" | "squash" | "drop";

interface RebaseCommit {
  hash: string;
  message: string;
  action: RebaseAction;
}

interface RebaseViewProps {
  commits: Array<{ hash: string; message: string }>;
  onExecute: (rebasePlan: RebaseCommit[]) => void;
  onCancel: () => void;
}

/**
 * Interactive Rebase Controller (Vim Simulator)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Simulates the staff-engineer rebase workflow. It provides a visual 
 * interface to manipulate the local DAG before it is finalized.
 */
export function RebaseView({
  commits,
  onExecute,
  onCancel,
}: RebaseViewProps): React.ReactNode {
  const [plan, setPlan] = useState<RebaseCommit[]>(
    commits.map((c) => ({ ...c, action: "pick" }))
  );

  const toggleAction = (idx: number): void => {
    setPlan((prev) => {
      const next = [...prev];
      const actions: RebaseAction[] = ["pick", "squash", "drop"];
      const currentIdx = actions.indexOf(next[idx].action);
      next[idx].action = actions[(currentIdx + 1) % actions.length];
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ink-2 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl h-full flex flex-col font-sans italic"
    >
      {/* Header */}
      <div className="px-8 py-6 bg-ink-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gh-blue/10 border-2 border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow">
            <Edit3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black text-gh-blue uppercase tracking-[0.3em]">
                Interactive Rebase
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gh-warn/10 border border-gh-warn/20 text-[8px] font-black text-gh-warn uppercase tracking-widest animate-pulse">
                Modifying History
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">
              The History Weaver
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all italic"
          >
            Abort
          </button>
          <button
            onClick={() => onExecute(plan)}
            className="px-6 py-2.5 rounded-xl bg-gh-blue text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-glow flex items-center gap-2 italic"
          >
            <CheckCircle2 size={14} />
            Finalize DAG
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-8 py-4 bg-ink border-b border-white/5 flex items-center gap-3 text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-black italic">
        <TerminalIcon size={12} className="text-gh-blue" />
        Toggle actions to squash or drop redundant snapshots
      </div>

      {/* Commit List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-3 scrollbar-hide">
        {plan.map((commit, idx) => (
          <motion.div
            key={commit.hash}
            layout
            className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300 ${
              commit.action === "pick"
                ? "bg-white/[0.02] border-white/5"
                : commit.action === "squash"
                ? "bg-gh-blue/5 border-gh-blue/20"
                : "bg-gh-danger/5 border-gh-danger/20 opacity-40 grayscale"
            }`}
          >
            <button
              onClick={() => toggleAction(idx)}
              className={`w-28 px-4 py-2 rounded-lg font-mono font-black text-[10px] uppercase tracking-widest transition-all ${
                commit.action === "pick"
                  ? "bg-zinc-800 text-white"
                  : commit.action === "squash"
                  ? "bg-gh-blue text-white shadow-glow"
                  : "bg-gh-danger text-white"
              }`}
            >
              {commit.action}
            </button>

            <div className="flex-1 flex items-center gap-4">
              <span className="text-gh-blue font-mono font-black text-xs">
                {commit.hash.substring(0, 7)}
              </span>
              <span className="text-white font-bold text-sm italic truncate">
                {commit.message}
              </span>
            </div>

            {commit.action === "drop" && <Trash2 size={16} className="text-gh-danger" />}
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 bg-ink-3 border-t border-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black italic">
        Staff Alchemist Mode • Atomic History Enforcement
      </div>
    </motion.div>
  );
}
