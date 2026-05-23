"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Database } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-white/5 grid-bg">
      <div className="absolute inset-0">
        <motion.div 
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-30%] right-[-10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(13, 148, 136,0.15),_transparent_60%)] blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-5%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(13, 148, 136,0.1),_transparent_60%)] blur-3xl"
        />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 py-24 lg:py-32 relative flex flex-col items-center text-center">
        <div className="max-w-6xl flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gh-blue/10 border border-gh-blue/20 text-xs mb-12 shadow-glow"
          >
            <span className="px-1.5 py-0.5 rounded bg-gh-blue text-white font-black font-mono text-[9px] tracking-widest uppercase">ACTIVE</span>
            <span className="text-white font-mono text-[10px] uppercase tracking-widest font-black italic opacity-90">Meta & Google internal patterns declassified</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="hidden sm:inline text-white font-mono italic font-bold uppercase tracking-widest text-[9px]">20 LEVELS • 0 TO LEGENDARY</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans font-black tracking-[-0.04em] text-[clamp(42px,8vw,84px)] leading-[1.05] mb-12 flex flex-col items-center gap-4 italic uppercase"
          >
            <span>The ledger of</span>
            <span className="relative inline-block px-4">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-gh-blue bg-clip-text text-transparent italic text-[1.05em] font-black underline decoration-gh-blue/20 underline-offset-8">integrity</span>
              <div className="absolute inset-x-0 bottom-2 h-px bg-gradient-to-r from-transparent via-gh-blue/50 to-transparent"></div>
            </span>
            <span>is a Git graph.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[19px] lg:text-[24px] leading-[1.5] text-white max-w-5xl font-light tracking-tight mb-12 italic opacity-90"
          >
            Not a tutorial. A high-fidelity simulation of the environments where trillion-row decisions ship daily. 
            You will learn to recover work others consider lost forever, and to sign every byte that touches production.
          </motion.p>

          {/* Dr. Hassan hook */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-4xl rounded-[24px] border border-white/10 bg-ink-2/80 backdrop-blur-xl p-6 lg:p-10 shadow-terminal text-left mb-16"
          >
            <div className="flex items-start gap-6 text-left">
              <div className="mt-0.5 w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner relative">
                <span className="font-mono text-[12px] leading-none font-black text-zinc-300 tracking-widest text-center uppercase">DR<br/>H</span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gh-green border-2 border-ink-2 shadow-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
                  <h2 className="text-[14px] font-black tracking-[0.2em] text-gh-blue uppercase italic underline decoration-gh-blue/30">DR. HASSAN • THE SAGE OF DATAPULSE</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-gh-warn/15 text-gh-warn border border-gh-warn/20 font-mono font-black uppercase tracking-widest italic">FORMER STAFF ENG • META</span>
                </div>
                <blockquote className="text-[18px] leading-[1.6] text-white font-medium italic border-l-2 border-white/5 pl-6 py-1">
                  “A junior analyst trusts their memory. A professional trusts their code. 
                  <strong className="text-gh-blue font-black not-italic px-1 underline decoration-gh-blue/50 decoration-2 italic">A Legend trusts the Reflog.</strong> 
                  Welcome to the final tier of data science — where history is engineered, not recorded.”
                </blockquote>
                <div className="mt-5 flex items-center gap-5 text-[11px] text-zinc-500 font-mono italic font-black uppercase tracking-[0.2em]">
                  <span>• GPG: 0x4A7F 9C2D</span>
                  <span className="text-gh-green animate-pulse">• STATUS: ONLINE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core philosophy strips */}
          <div className="grid lg:grid-cols-3 gap-5 max-w-6xl">
            {[
              { 
                title: 'ABSOLUTE TRACEABILITY', 
                desc: 'Every bit, every weight, every SQL line — cryptographically linked to a human-signed commit. No exceptions.',
                color: 'gh-blue',
                icon: <Shield size={20} className="text-gh-blue" />
              },
              { 
                title: 'RESILIENCE', 
                desc: 'Recover work that others consider lost forever. Reflog, fsck, and object database mining as muscle memory.',
                color: 'violet',
                icon: <Clock size={20} className="text-teal-400" />
              },
              { 
                title: 'META/GOOGLE SCALE', 
                desc: 'Navigate repos housing collective intelligence of entire companies. Sparse-checkout, monolith mastery.',
                color: 'gh-green',
                icon: <Database size={20} className="text-gh-green" />
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className={`group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 p-6 transition-all cursor-default text-left shadow-inner`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 w-11 h-11 rounded-xl bg-ink border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors shadow-glow`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-black tracking-[0.3em] text-white mb-2 uppercase italic">{item.title}</div>
                    <div className="text-[14px] leading-[1.6] text-white font-medium italic opacity-90">{item.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
