"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Lock } from 'lucide-react';

interface TerminalEntry {
  type: 'cmd' | 'output';
  content: string | React.ReactNode;
}

interface LabSectionProps {
  terminalHistory: TerminalEntry[];
  terminalInput: string;
  setTerminalInput: (input: string) => void;
  handleCommand: (cmd: string) => void;
}

export const LabSection: React.FC<LabSectionProps> = ({
  terminalHistory,
  terminalInput,
  setTerminalInput,
  handleCommand
}) => {
  return (
    <section id="lab" className="py-24 lg:py-32 bg-ink border-b border-white/5 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="max-w-4xl mb-20 text-left">
          <div className="text-[11px] font-black tracking-[0.4em] text-teal-400 mb-5 uppercase italic underline decoration-teal-400/20 underline-offset-8">INTERACTIVE LAB • SIMULATED PRODUCTION</div>
          <h2 className="text-[36px] lg:text-[54px] font-black tracking-tighter leading-[0.95] text-white mb-8 text-left italic uppercase">
            The terminal does not lie.<br/><span className="text-white font-light font-serif opacity-70 normal-case">Try to break things.</span>
          </h2>
          <p className="text-[19px] leading-relaxed text-white font-bold text-left italic max-w-3xl opacity-90 border-l-2 border-white/5 pl-8">
            These are not toys. They are exact replicas of the internal tools used for lineage audits at companies 
            where a single bad commit can affect $200M in reported revenue. Type, run, recover.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Main Terminal Simulation */}
          <div className="lg:col-span-3">
            <div className="rounded-[28px] border border-white/10 bg-ink-2 shadow-terminal overflow-hidden transition-all duration-500 hover:border-white/20">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-gh-warn/20 border border-gh-warn/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-gh-green/20 border border-gh-green/40" />
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-[11px] font-mono text-white tracking-widest uppercase font-black italic opacity-60">
                    data-platform • <span className="text-gh-blue italic font-black opacity-100">main</span> • GPG SIGNED
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest">
                  <span className="px-3 py-1 rounded-md bg-gh-green/10 text-gh-green border border-gh-green/20 italic">RECOVERABLE</span>
                </div>
              </div>

              {/* Terminal content */}
              <div className="p-10 font-mono text-[13.5px] leading-[1.8] text-white bg-ink min-h-[500px] text-left">
                <div className="space-y-6">
                  {terminalHistory.map((item, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                    >
                      {item.type === 'cmd' && (
                        <div className="flex gap-4 text-white">
                          <span className="text-gh-blue font-black uppercase tracking-widest text-[11px] mt-1.5 pr-1 italic">❯</span>
                          <span className="font-black italic underline decoration-white/5">{item.content}</span>
                        </div>
                      )}
                      {item.type === 'output' && (
                        <div className="pl-9 text-white font-bold italic border-l-2 border-white/5 ml-1 opacity-90">
                          {item.content}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5 group">
                  <span className="text-gh-blue font-black uppercase tracking-widest text-[11px] pr-1 italic animate-pulse">❯</span>
                  <input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand(terminalInput)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-black caret-gh-blue placeholder:text-zinc-800 italic uppercase tracking-tighter"
                    placeholder="git reflog — try it"
                    spellCheck={false}
                    autoComplete="off"
                    autoFocus
                  />
                  <ChevronRight size={18} className="text-zinc-800 group-focus-within:text-gh-blue transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-5 text-[10px] text-white font-mono uppercase tracking-[0.3em] px-6 italic font-black opacity-40">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gh-green/60 shadow-[0_0_10px_rgba(35,134,54,0.6)]" /> telemetry encrypted</span>
              <span>•</span>
              <span>Retention: 90 days</span>
              <span>•</span>
              <span>Audit: secure</span>
            </div>
          </div>

          {/* Side Highlights */}
          <div className="lg:col-span-2 space-y-8 text-left">
            <div className="rounded-2xl border border-white/10 bg-ink-2 p-8 shadow-glow relative overflow-hidden group transition-all duration-500 hover:border-gh-blue/30 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gh-blue/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gh-blue/20 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-black text-gh-blue uppercase tracking-[0.4em] italic underline decoration-gh-blue/20">Assignment Insight</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-gh-green animate-pulse shadow-[0_0_12px_#238636]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter italic uppercase underline decoration-white/5 underline-offset-8">Multi-Verse</h3>
                <p className="text-[14px] text-white leading-relaxed font-bold mb-8 italic opacity-90 border-l border-white/10 pl-6">
                  Stop switching branches. Learn to spin up parallel working trees for concurrent A/B testing on multi-terabyte datasets. The staff engineer workflow.
                </p>
                <button className="flex items-center gap-3 text-[11px] font-black text-white uppercase tracking-[0.2em] hover:text-gh-blue transition-colors group/btn italic border-b border-white/10 pb-1">
                  Read the Whitepaper <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-inner border-dashed transition-all duration-500 hover:bg-white/[0.04]">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400 shadow-glow shadow-2xl">
                  <Lock size={20} />
                </div>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">Audit Trails</span>
              </div>
              <div className="space-y-5 font-mono text-[11px] italic font-black uppercase tracking-widest">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-zinc-600">Signed Commit</span>
                  <span className="text-gh-green shadow-glow">✓ VERIFIED</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-zinc-600">DVC Pointer</span>
                  <span className="text-white italic">dvc://s3-v1.2</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-zinc-600">Reflog Index</span>
                  <span className="text-gh-blue shadow-glow">0x4F2...A9B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
