"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle2, User, MessageSquare, ShieldCheck, Activity } from 'lucide-react';

interface PullRequestViewProps {
  title: string;
  author: string;
  description: string;
  diff: string;
  onApprove: () => void;
}

export function PullRequestView({ title, author, description, diff, onApprove }: PullRequestViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ink-2 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl h-full flex flex-col font-sans italic"
    >
      {/* PR Header */}
      <div className="px-8 py-6 bg-ink-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gh-blue/10 border-2 border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow">
            <GitPullRequest size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] font-black text-gh-blue uppercase tracking-[0.3em]">Pull Request #1207</span>
              <span className="px-2 py-0.5 rounded-full bg-gh-green/10 border border-gh-green/20 text-[9px] font-black text-gh-green uppercase tracking-widest animate-pulse">Open</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">{title}</h2>
          </div>
        </div>
        <button 
          onClick={onApprove}
          className="px-6 py-2.5 rounded-xl bg-gh-green text-white font-black text-[11px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-glow flex items-center gap-2"
        >
          <ShieldCheck size={14} />
          Approve Merge
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        {/* Author Info */}
        <div className="flex items-start gap-5">
           <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-xs font-black text-white">
             {author.substring(0, 2).toUpperCase()}
           </div>
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-black text-white italic">{author}</span>
                <span className="text-zinc-600 font-mono text-[10px]">requested a merge into</span>
                <span className="text-gh-blue font-black font-mono text-[10px] bg-gh-blue/5 px-2 py-0.5 rounded">main</span>
              </div>
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl italic font-bold text-white/80 text-[13px]">
                {description}
              </div>
           </div>
        </div>

        {/* Audit Status */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic border-b border-white/5 pb-2">Automated Audit Analysis</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gh-green/5 border border-gh-green/20 p-4 rounded-2xl flex items-center gap-4">
                <CheckCircle2 className="text-gh-green" size={20} />
                <div>
                   <div className="text-[10px] font-black text-white uppercase italic">Unit Tests</div>
                   <div className="text-[9px] text-gh-green font-bold uppercase tracking-widest">12/12 PASSED</div>
                </div>
              </div>
              <div className="bg-gh-green/5 border border-gh-green/20 p-4 rounded-2xl flex items-center gap-4">
                <Activity className="text-gh-green" size={20} />
                <div>
                   <div className="text-[10px] font-black text-white uppercase italic">Data Drift</div>
                   <div className="text-[9px] text-gh-green font-bold uppercase tracking-widest">0.02% (NOMINAL)</div>
                </div>
              </div>
           </div>
        </div>

        {/* The Diff */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic border-b border-white/5 pb-2">Lineage Changes</h3>
           <div className="bg-ink rounded-3xl p-8 border border-white/5 font-mono text-[13px] leading-relaxed shadow-inner overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Database size={100} className="text-gh-blue" />
              </div>
              <div className="space-y-1 relative z-10">
                 <div className="text-zinc-600">--- a/revenue_q4.sql</div>
                 <div className="text-zinc-600">+++ b/revenue_q4.sql</div>
                 <div className="text-gh-danger bg-gh-danger/5">- SELECT SUM(amount) FROM sales;</div>
                 <div className="text-gh-green bg-gh-green/5">+ SELECT SUM(amount) * 1.05 FROM sales WHERE region = "US";</div>
                 <div className="text-gh-green bg-gh-green/5">+ -- Resolved conflict: Merged US filter with global tax logic</div>
              </div>
           </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-ink-3 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black italic">
           <MessageSquare size={14} className="text-gh-blue" />
           Awaiting Dr. Hassan's Review
         </div>
      </div>
    </motion.div>
  );
}
