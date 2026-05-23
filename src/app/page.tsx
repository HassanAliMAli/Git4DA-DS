"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Database, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Terminal as TerminalIcon,
  Search,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded } = useProfile();
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{type: 'cmd' | 'output', content: string | React.ReactNode}>>([
    { type: 'output', content: <span className="text-white font-mono opacity-90">Git4Data Lab v2.4.1 • Legendary Tier simulation • type "help" for commands</span> },
    { type: 'cmd', content: 'git reset --hard HEAD~3' },
    { type: 'output', content: <span className="text-gh-warn font-bold">HEAD is now at 9f2a1b4 chore: bump dbt version</span> },
    { type: 'cmd', content: 'git log --oneline -5' },
    { type: 'output', content: <div className="text-white font-mono opacity-80">9f2a1b4 chore: bump dbt version<br/>3c8e2a1 docs: update runbook<br/><span className="text-zinc-500">... older history, feature work missing ...</span></div> },
    { type: 'output', content: <div className="border-l-2 border-gh-blue pl-4 py-2 bg-gh-blue/10 rounded-r"><div className="text-gh-blue font-black uppercase tracking-widest text-[11px]">✓ Recovery path discovered • Reflog contains all movements for 90 days</div><div className="text-white text-xs mt-1 italic font-light">The commits are not gone. Only the branch pointer moved. Git keeps everything.</div></div> }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gh-blue/20 border-t-gh-blue rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-white uppercase tracking-[0.2em] animate-pulse font-bold">Initializing Secure Node...</span>
        </div>
      </div>
    );
  }

  const commands: Record<string, React.ReactNode> = {
    help: (
      <div className="space-y-2">
        <div className="text-white font-bold uppercase tracking-widest text-xs italic">Available commands in Legendary Lab:</div>
        <div className="space-y-1 text-white text-xs font-mono">
          <div><span className="text-gh-blue font-black tracking-widest">git reflog</span> — Show all HEAD movements, even deleted commits</div>
          <div><span className="text-gh-blue font-black tracking-widest">git fsck --lost-found</span> — Find dangling objects</div>
          <div><span className="text-gh-blue font-black tracking-widest">git show &lt;sha&gt;</span> — Inspect a recovered commit</div>
          <div><span className="text-gh-blue font-black tracking-widest">git worktree list</span> — See parallel working trees</div>
        </div>
      </div>
    ),
    'git reflog': (
      <div className="space-y-1 text-xs font-mono">
        <div className="text-zinc-400">a7f3c9d HEAD@{0}: reset: moving to HEAD~3</div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">4b2e1a0 HEAD@{1}: commit: feat: customer 360 features • 847 lines</div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">9c1d4f2 HEAD@{2}: commit: feat: uplift v3 model • DVC tracked</div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">f3a8b91 HEAD@{3}: commit: feat: add revenue guardrail tests</div>
        <div className="text-white">9f2a1b4 HEAD@{4}: commit: chore: bump dbt version</div>
        <div className="mt-3 text-gh-green font-black uppercase tracking-widest">✓ Found 3 commits not in current branch history. Recoverable.</div>
      </div>
    ),
    'git fsck --lost-found': (
      <div className="text-white font-mono text-xs opacity-90">
        Checking object directories: 100% (256/256), done.<br/>
        dangling commit 4b2e1a07d3f9a2c1b8e4<br/>
        dangling blob f9a2c1b8e4d3f9a2c1b8e4d3f9a2c1b8e4d3f9a2 • (features/customer_360.sql)
        <div className="mt-3 text-gh-warn font-black italic uppercase tracking-widest">⚠ Objects exist but no ref points to them. Recovery begins.</div>
      </div>
    ),
    'git show a7f3c9d': (
      <div className="text-white font-mono text-xs leading-relaxed font-bold italic">
        commit a7f3c9d4b2e1a07d3f9a2c1b8e4f3a8b91 (HEAD)<br/>
        Author: Dr. Hassan &lt;hassan@datapulse.ai&gt;<br/>
        GPG: 4096R/4A7F9C2D VALID • Signed 2 hours ago<br/><br/>
        feat: cascade uplift model v3 • production deploy<br/><br/>
        models/uplift_v3.pkl | 1142 ++<br/>
        features/customer_360.sql | 847 ++<br/>
        <div className="text-gh-green mt-3 font-black uppercase tracking-widest underline decoration-gh-green/30">✓ Verified • DVC tracked • Great Expectations passed • Deployed</div>
      </div>
    ),
    'git worktree list': (
      <div className="text-white font-mono text-xs leading-relaxed italic font-bold">
        /repo/data-platform           9f2a1b4 [main]<br/>
        /repo/../dt-worktrees/uplift-v3        4b2e1a0 [feat/uplift-cascade]<br/>
        /repo/../dt-worktrees/uplift-v3-causal 9c1d4f2 [feat/uplift-causal]<br/>
        /repo/../dt-worktrees/baseline         a7f3c9d [main]<br/><br/>
        <span className="text-gh-blue font-black uppercase tracking-widest text-[11px]">3 worktrees • 0 context switches • parallel experiments running</span>
      </div>
    )
  };

  const handleCommand = (cmd: string) => {
    if (!cmd) return;
    const normalizedCmd = cmd.trim();
    setTerminalHistory(prev => [...prev, { type: 'cmd', content: normalizedCmd }]);
    
    setTimeout(() => {
      const output = commands[normalizedCmd] || (
        <div className="text-zinc-500 font-mono italic font-bold uppercase tracking-widest text-[10px]">Command not in Legendary Lab. Try: help, git reflog, git fsck --lost-found</div>
      );
      setTerminalHistory(prev => [...prev, { type: 'output', content: output }]);
      setTerminalInput('');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ink text-white antialiased overflow-x-hidden selection:bg-gh-blue/30 selection:text-white font-sans">
      {/* Visual Infrastructure */}
      <div className="scanline" />
      
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl text-left">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gh-blue to-violet flex items-center justify-center shadow-glow border border-white/10">
                <span className="font-mono font-black text-[11px] tracking-widest text-white">G4D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gh-green shadow-[0_0_16px_rgba(35,134,54,0.8)]"></div>
            </div>
            <div className="leading-tight">
              <div className="font-black tracking-tighter text-[15px] italic uppercase">Git4Data</div>
              <div className="text-[10px] text-white font-mono -mt-0.5 uppercase font-black tracking-widest opacity-60">PHD+ • LEGENDARY TIER</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-white font-bold italic opacity-80 uppercase tracking-widest">
            <a href="#roadmap" className="hover:text-gh-blue transition-colors">Roadmap</a>
            <a href="#lab" className="hover:text-gh-blue transition-colors">Lab</a>
            <a href="#modules" className="hover:text-gh-blue transition-colors">Modules</a>
            <span className="text-zinc-800">/</span>
            <span className="font-mono text-xs text-gh-blue italic font-black">v2.4.1 • main</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-2.5 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-mono uppercase tracking-widest font-black italic">
              <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse"></span>
              Agents: 1,247
            </div>
            <button 
              onClick={() => router.push('/terminal')}
              className="h-9 px-4 rounded-lg bg-gh-blue text-white font-black text-[11px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-sm uppercase tracking-widest italic border border-white/10"
            >
              Enter Hub
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 grid-bg">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-30%] right-[-10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(31,111,235,0.15),_transparent_60%)] blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-5%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.1),_transparent_60%)] blur-3xl"
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
                  icon: <Clock size={20} className="text-violet-400" />
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

      {/* Roadmap Section */}
      <section id="roadmap" className="border-b border-white/5 bg-ink-2/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="flex flex-wrap items-end justify-between gap-8 mb-16 text-left">
                <div>
                    <div className="text-[11px] font-black tracking-[0.4em] text-gh-blue mb-4 uppercase italic underline decoration-gh-blue/20 underline-offset-4">0 TO LEGENDARY • 20 LEVELS OF MASTERY</div>
                    <h2 className="text-[36px] lg:text-[54px] font-black tracking-tighter leading-[0.95] text-white italic uppercase">
                        The path is not linear.<br/><span className="text-white font-light font-serif opacity-70 normal-case italic">It is versioned.</span>
                    </h2>
                </div>
                <div className="text-right hidden lg:block">
                    <div className="inline-flex items-center gap-5 px-6 py-4 rounded-2xl bg-ink border border-white/10 shadow-inner">
                        <div className="text-left">
                            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black italic mb-1">Cohort analytics</div>
                            <div className="text-[14px] font-black text-white italic font-mono uppercase tracking-tighter">Level 14 • Interactive Rebase</div>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-[32px] font-mono font-black text-gh-blue leading-none italic shadow-glow">63%</div>
                    </div>
                </div>
            </div>

            {/* Modules grid */}
            <div className="grid lg:grid-cols-5 gap-6 items-start text-left font-sans" id="modules">
                {/* Module 1 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
                        <div className="text-[11px] font-black font-mono text-gh-blue mb-3 uppercase tracking-widest italic underline decoration-gh-blue/20">MODULE 01</div>
                        <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">The Safety Net</div>
                        <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">Commits, ignore, time travel, undo. The zero-panic foundation.</div>
                        <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">01 • Atomic commits</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">02 • .gitignore patterns</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">03 • Time travel</div>
                            <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/40 italic">04 • Undo without fear</div>
                        </div>
                    </div>
                </div>

                {/* Module 2 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
                        <div className="text-[11px] font-black font-mono text-violet-400 mb-3 uppercase tracking-widest italic underline decoration-violet-400/20">MODULE 02</div>
                        <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">Collaboration</div>
                        <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">Branching, remotes, conflicts, PRs. Professional sync.</div>
                        <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">05 • Branch topology</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">06 • Remotes & forks</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">07 • Conflict resolution</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">08 • PRs that ship</div>
                        </div>
                    </div>
                </div>

                {/* Module 3 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-ink p-6 shadow-inner">
                        <div className="text-[11px] font-black font-mono text-gh-warn mb-3 uppercase tracking-widest italic underline decoration-gh-warn/20">MODULE 03</div>
                        <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic">Data Forge</div>
                        <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-90 border-l border-white/5 pl-4">dbt, Jupytext, SQLFluff, DVC. Specialized data tooling.</div>
                        <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">09 • dbt + Git</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">10 • Notebooks</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">11 • Quality hooks</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80 underline decoration-white/5">12 • DVC & MLOps</div>
                        </div>
                    </div>
                </div>

                {/* Module 4 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gh-blue/30 bg-gh-blue/[0.03] p-6 shadow-glow transition-all duration-500 hover:border-gh-blue/50 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-[11px] font-black font-mono text-gh-blue uppercase tracking-widest italic">MODULE 04</div>
                            <span className="px-2 py-0.5 rounded bg-gh-blue text-white font-black font-mono text-[8px] tracking-widest uppercase italic animate-pulse shadow-sm">ELITE</span>
                        </div>
                        <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic underline decoration-gh-blue/20">Big Tech Scale</div>
                        <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-95 border-l border-gh-blue/30 pl-4">Meta/Airbnb scale. History rewriting, bisect audits.</div>
                        <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black">
                            <div className="flex items-center gap-2 text-white font-black italic underline decoration-gh-blue/30">13 • Sparse checkout</div>
                            <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/50 italic">14 • Interactive rebase</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80">15 • Git bisect audit</div>
                            <div className="flex items-center gap-2 text-white italic opacity-80">16 • Filter-repo</div>
                        </div>
                    </div>
                </div>

                {/* Module 5 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gh-green/30 bg-gh-green/[0.03] p-6 shadow-inner transition-all duration-500 hover:border-gh-green/50 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-[11px] font-black font-mono text-gh-green uppercase tracking-widest italic">MODULE 05</div>
                            <span className="px-2 py-0.5 rounded bg-gh-green text-white font-black font-mono text-[8px] tracking-widest uppercase italic shadow-sm">LEGEND</span>
                        </div>
                        <div className="font-black text-white mb-2 tracking-tight uppercase text-sm italic underline decoration-gh-green/20">The Dark Arts</div>
                        <div className="text-[12px] text-white mb-5 leading-relaxed font-bold italic opacity-95 border-l border-gh-green/30 pl-4 font-serif">Reflog resurrection, shadow clones, GPG seals.</div>
                        <div className="space-y-2.5 text-[11px] font-mono uppercase tracking-widest font-black text-gh-green/90 italic">
                            <div className="flex items-center gap-2 font-black italic animate-pulse">17 • Reflog resurr.</div>
                            <div className="font-black">18 • Shadow clones</div>
                            <div className="text-zinc-500 opacity-60">19 • GPG seals</div>
                            <div className="text-zinc-500 opacity-50">20 • Piper Master</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive Lab Section */}
      <section id="lab" className="py-24 lg:py-32 bg-ink border-b border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-4xl mb-20 text-left">
            <div className="text-[11px] font-black tracking-[0.4em] text-violet-400 mb-5 uppercase italic underline decoration-violet-400/20 underline-offset-8">INTERACTIVE LAB • SIMULATED PRODUCTION</div>
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
                  <div className="w-12 h-12 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-violet-400 shadow-glow-violet shadow-2xl">
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

      {/* Signature Section */}
      <section className="border-b border-white/5 bg-ink-2/30 py-24 lg:py-32 text-left">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 text-left">
                <div className="max-w-3xl">
                    <div className="text-[11px] font-black tracking-[0.4em] text-gh-green mb-5 uppercase italic underline decoration-gh-green/20 underline-offset-8">LEVEL 19 • CRYPTOGRAPHIC SEAL</div>
                    <h2 className="text-[28px] lg:text-[48px] font-black tracking-tighter leading-[1] text-white italic uppercase">
                        Verified badges are not decoration.<br/>
                        <span className="text-white font-light font-serif opacity-70 normal-case italic">They are technical liability.</span>
                    </h2>
                </div>
                <div className="lg:text-right">
                    <div className="inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-ink border border-white/10 text-[11px] font-mono italic font-black text-white shadow-inner uppercase tracking-widest">
                        <span className="w-2.5 h-2.5 rounded-full bg-gh-green animate-pulse shadow-[0_0_10px_#238636]" />
                        GPG: 4096R/4A7F9C2D • SIGNED
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 text-left">
                <div className="lg:col-span-2 rounded-[32px] border border-gh-green/20 bg-gh-green/[0.03] overflow-hidden transition-all duration-500 hover:border-gh-green/40 shadow-2xl group">
                    <div className="p-10">
                        <div className="flex items-start gap-8">
                            <div className="relative mt-1 w-16 h-16 rounded-2xl bg-gh-green/10 border border-gh-green/20 flex items-center justify-center flex-shrink-0 shadow-glow group-hover:scale-110 transition-transform duration-500">
                                <Shield size={32} className="text-gh-green" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <code className="text-[16px] font-mono text-white font-black italic tracking-tighter uppercase underline decoration-white/10">a7f3c9d • Cascade Model v3</code>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gh-green text-white text-[11px] font-black font-mono italic tracking-[0.2em] shadow-lg animate-pulse">
                                        VERIFIED
                                    </span>
                                </div>
                                <p className="text-[15px] text-white leading-relaxed mb-6 font-bold italic opacity-95 max-w-2xl border-l-2 border-white/5 pl-8 py-1">
                                    Merged to main • Deployed to prod-us-east-1 • 14.2M predictions/hour • 
                                    Lineage: dvc://models/uplift-v3.pkl
                                </p>
                                <div className="flex flex-wrap gap-6 text-[11px] font-mono text-zinc-500 italic font-black uppercase tracking-[0.3em] border-t border-white/5 pt-4">
                                    <span className="text-gh-green opacity-80">No rogue data detected</span>
                                    <span>•</span>
                                    <span>Audit-proof lineage</span>
                                    <span>•</span>
                                    <span>2.4 TB Meta-Metadata</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[32px] border border-gh-danger/20 bg-gh-danger/[0.03] p-10 transition-all duration-500 hover:border-gh-danger/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gh-danger/20 animate-pulse" />
                    <div className="text-[12px] font-black tracking-[0.4em] text-gh-danger mb-6 uppercase italic underline decoration-gh-danger/20 underline-offset-4 text-center">REJECTION POLICY</div>
                    <div className="text-[14px] text-white leading-relaxed mb-10 font-mono italic font-black text-center space-y-4">
                        <div className="opacity-80 underline decoration-white/5 pb-2">commits without signature</div>
                        <div className="opacity-80 underline decoration-white/5 pb-2">force pushes to main</div>
                        <div className="opacity-80 underline decoration-white/5 pb-2">untracked notebook cell output</div>
                        <div className="text-gh-danger font-black underline decoration-gh-danger/40 uppercase tracking-widest italic animate-pulse">missing Great Expectations</div>
                    </div>
                    <div className="flex flex-col items-center gap-4 text-[11px] text-gh-danger font-black italic uppercase tracking-[0.3em] border-t border-white/5 pt-8">
                        <div className="w-3 h-3 rounded-full bg-gh-danger animate-ping shadow-[0_0_12px_#ff7b72]" />
                        Blocked by Firm Policy
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink border-b border-white/5 py-24 lg:py-40 flex flex-col items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <h2 className="text-[36px] lg:text-[74px] font-black tracking-[-0.06em] leading-[0.85] text-white mb-12 italic uppercase">
              The environment refuses<br/>to let you fail.
            </h2>
            <p className="text-[22px] leading-relaxed text-white max-w-3xl mb-20 font-bold italic opacity-95 border-x border-white/5 px-12">
              Git4Data is used by staff engineers at 47 companies to train teams on the patterns 
              that prevent midnight production pages. No certificates. Only recovery stories.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => router.push('/terminal')}
                  className="group relative h-20 px-16 rounded-[24px] bg-gh-blue text-white font-black text-[18px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-glow flex items-center justify-center gap-5 uppercase tracking-[0.3em] italic border border-white/20 overflow-hidden"
                >
                    Initialize Level 1
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sheen-anim_1.5s_infinite]" />
                </button>
                <button className="h-20 px-16 rounded-[24px] bg-white/5 border border-white/10 text-white font-black text-[16px] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-2xl uppercase tracking-[0.2em] italic">
                    Incident Reports
                </button>
            </div>

            <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-[12px] text-zinc-700 font-mono uppercase tracking-[0.5em] italic font-black opacity-60">
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> E2E_ENCRYPTED</span>
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> ZERO_DATA_LOSS</span>
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> SIGNED_LINEAGE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-ink-2/95 backdrop-blur-3xl py-24 lg:py-32 text-left">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-24 text-left font-sans italic">
            <div className="max-w-lg">
              <div className="flex items-center gap-5 mb-10 text-left justify-start group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gh-blue to-violet flex items-center justify-center shadow-glow border border-white/10 group-hover:scale-105 transition-transform duration-500">
                  <span className="font-mono font-black text-lg text-white uppercase tracking-[0.3em]">G4D</span>
                </div>
                <div className="text-3xl font-black tracking-[-0.04em] text-white uppercase italic">Git4Data</div>
              </div>
              <p className="text-[17px] leading-relaxed text-zinc-500 font-bold italic border-l-4 border-gh-blue/20 pl-10 py-2 max-w-md opacity-90">
                The absolute ceiling of Git mastery for the high-stakes world of data science. 
                Where PhD-level research meets staff-level engineering rigor.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-24 text-left font-mono text-[11px] uppercase tracking-[0.4em] font-black">
              <div className="space-y-10 text-left">
                <h4 className="text-white italic underline decoration-gh-blue/30 underline-offset-8 mb-2">Curriculum</h4>
                <div className="space-y-5 text-zinc-600 italic">
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1">Safety Net</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1">The Forge</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1 font-black text-gh-blue">Dark Arts</div>
                </div>
              </div>
              <div className="space-y-10 text-left">
                <h4 className="text-white italic underline decoration-gh-blue/30 underline-offset-8 mb-2">Architecture</h4>
                <div className="space-y-5 text-zinc-600 italic">
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1">VFS Core</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1">Reflog Engine</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer border-l border-white/5 pl-4 py-1">DVC Auditor</div>
                </div>
              </div>
              <div className="space-y-10 text-left">
                <h4 className="text-white italic underline decoration-gh-green/30 underline-offset-8 mb-2">System Status</h4>
                <div className="space-y-5 text-gh-green italic font-black flex flex-col items-start">
                  <div className="flex items-center gap-3 bg-gh-green/5 px-3 py-1 rounded-md border border-gh-green/10 shadow-sm"><span className="w-2 h-2 rounded-full bg-gh-green animate-pulse" /> Nodes Nominal</div>
                  <div className="flex items-center gap-3 bg-gh-green/5 px-3 py-1 rounded-md border border-gh-green/10 shadow-sm"><span className="w-2 h-2 rounded-full bg-gh-green animate-pulse" /> Audit: Secure</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-10 text-[11px] font-mono text-zinc-800 uppercase tracking-[0.6em] italic font-black">
            <div className="hover:text-zinc-600 transition-colors duration-500 underline decoration-white/5">© 2026 Git4Data • Engineered by Dr. Hassan • Staff Edition</div>
            <div className="flex flex-wrap gap-12">
              <span className="flex items-center gap-3 text-gh-green/40 hover:text-gh-green transition-colors cursor-default"><Shield size={12} /> Verified Lineage</span>
              <span className="flex items-center gap-3 text-gh-blue/40 hover:text-gh-blue transition-colors cursor-default"><Lock size={12} /> GPG Signed</span>
              <span className="flex items-center gap-3 text-gh-green/40 hover:text-gh-green transition-colors cursor-default"><Check size={12} /> ISO-9001.SIM</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
