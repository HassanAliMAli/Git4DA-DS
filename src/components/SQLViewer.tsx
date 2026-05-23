"use client";

import React from "react";
import { Database, Copy, Play } from "lucide-react";

interface SQLViewerProps {
  code: string;
  filename: string;
}

/**
 * High-Fidelity SQL Viewer
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Designed to provide a "Staff Alchemist" feel for SQL pipelines.
 * It simulates a modern, dark-themed SQL IDE with syntax highlighting 
 * and structural metadata visualization.
 */
export const SQLViewer: React.FC<SQLViewerProps> = ({ code, filename }) => {
  return (
    <div className="bg-ink rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col font-mono text-[13px]">
      {/* Chrome Header */}
      <div className="px-6 py-4 bg-ink-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20 shadow-glow">
            <Database size={16} />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">
              Production Script
            </div>
            <div className="text-white font-bold tracking-tight">{filename}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
            <Copy size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg border border-teal-500/20 transition-all font-black text-[10px] uppercase italic tracking-widest">
            <Play size={10} fill="currentColor" /> Run Audit
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 p-8 overflow-y-auto leading-[1.8] bg-ink relative scrollbar-hide text-left">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Database size={200} className="text-teal-400" />
        </div>
        
        <pre className="relative z-10 whitespace-pre-wrap">
          {code.split('\n').map((line, i) => (
            <div key={i} className="flex gap-8 group">
              <span className="w-8 text-right text-zinc-800 select-none group-hover:text-zinc-600 transition-colors shrink-0">
                {i + 1}
              </span>
              <span className="text-white/90 font-medium italic">
                {line.split(' ').map((word, j) => {
                  const upper = word.toUpperCase();
                  const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP', 'BY', 'ORDER', 'SUM', 'COUNT', 'AND', 'OR', 'LIMIT'];
                  if (keywords.includes(upper)) {
                    return <span key={j} className="text-gh-blue font-black not-italic">{word} </span>;
                  }
                  if (word.startsWith('"') || word.startsWith("'")) {
                    return <span key={j} className="text-gh-green opacity-80">{word} </span>;
                  }
                  return word + ' ';
                })}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-ink-2 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] italic text-zinc-600">
         <div className="flex gap-6">
           <span>Length: {code.length} chars</span>
           <span>Lines: {code.split('\n').length}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse" />
            Logic Verified
         </div>
      </div>
    </div>
  );
};
