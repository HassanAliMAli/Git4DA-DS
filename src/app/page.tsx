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
    { type: 'output', content: <span className="text-gh-text-sec">Git4Data Lab v2.4.1 • Legendary Tier simulation • type "help" for commands</span> },
    { type: 'cmd', content: 'git reset --hard HEAD~3' },
    { type: 'output', content: <span className="text-gh-warn">HEAD is now at 9f2a1b4 chore: bump dbt version</span> },
    { type: 'cmd', content: 'git log --oneline -5' },
    { type: 'output', content: <div className="text-gh-text-sec">9f2a1b4 chore: bump dbt version<br/>3c8e2a1 docs: update runbook<br/><span className="text-zinc-600">... older history, feature work missing ...</span></div> },
    { type: 'output', content: <div className="border-l-2 border-gh-blue/40 pl-3 py-2 bg-gh-blue/5 rounded-r"><div className="text-gh-blue font-medium">✓ Recovery path discovered • Reflog contains all movements for 90 days</div><div className="text-gh-text-sec text-xs mt-1 italic">The commits are not gone. Only the branch pointer moved. Git keeps everything.</div></div> }
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
          <span className="font-mono text-[10px] text-gh-text-sec uppercase tracking-[0.2em] animate-pulse">Initializing Secure Node...</span>
        </div>
      </div>
    );
  }

  const commands: Record<string, React.ReactNode> = {
    help: (
      <div className="space-y-2">
        <div className="text-gh-text">Available commands in Legendary Lab:</div>
        <div className="space-y-1 text-gh-text-sec text-xs font-mono">
          <div><span className="text-gh-blue">git reflog</span> — Show all HEAD movements, even deleted commits</div>
          <div><span className="text-gh-blue">git fsck --lost-found</span> — Find dangling objects</div>
          <div><span className="text-gh-blue">git show &lt;sha&gt;</span> — Inspect a recovered commit</div>
          <div><span className="text-gh-blue">git worktree list</span> — See parallel working trees</div>
        </div>
      </div>
    ),
    'git reflog': (
      <div className="space-y-1 text-xs font-mono">
        <div className="text-gh-text">a7f3c9d HEAD@{0}: reset: moving to HEAD~3</div>
        <div className="text-gh-blue">4b2e1a0 HEAD@{1}: commit: feat: customer 360 features • 847 lines</div>
        <div className="text-gh-blue">9c1d4f2 HEAD@{2}: commit: feat: uplift v3 model • DVC tracked</div>
        <div className="text-gh-blue">f3a8b91 HEAD@{3}: commit: feat: add revenue guardrail tests</div>
        <div>9f2a1b4 HEAD@{4}: commit: chore: bump dbt version</div>
        <div className="mt-2 text-gh-green">✓ Found 3 commits not in current branch history. Recoverable.</div>
      </div>
    ),
    'git fsck --lost-found': (
      <div className="text-gh-text-sec font-mono text-xs">
        Checking object directories: 100% (256/256), done.<br/>
        dangling commit 4b2e1a07d3f9a2c1b8e4<br/>
        dangling blob f9a2c1b8e4d3f9a2c1b8e4d3f9a2c1b8e4d3f9a2 • (features/customer_360.sql)
        <div className="mt-2 text-gh-warn">⚠ Objects exist but no ref points to them. Recovery begins.</div>
      </div>
    ),
    'git show a7f3c9d': (
      <div className="text-gh-text font-mono text-xs leading-relaxed">
        commit a7f3c9d4b2e1a07d3f9a2c1b8e4f3a8b91 (HEAD)<br/>
        Author: Dr. Hassan &lt;hassan@datapulse.ai&gt;<br/>
        GPG: 4096R/4A7F9C2D VALID • Signed 2 hours ago<br/><br/>
        feat: cascade uplift model v3 • production deploy<br/><br/>
        models/uplift_v3.pkl | 1142 ++<br/>
        features/customer_360.sql | 847 ++<br/>
        <div className="text-gh-green mt-2 font-bold uppercase tracking-tighter italic">✓ Verified • DVC tracked • Great Expectations passed • Deployed</div>
      </div>
    ),
    'git worktree list': (
      <div className="text-gh-text font-mono text-xs leading-relaxed">
        /repo/data-platform           9f2a1b4 [main]<br/>
        /repo/../dt-worktrees/uplift-v3        4b2e1a0 [feat/uplift-cascade]<br/>
        /repo/../dt-worktrees/uplift-v3-causal 9c1d4f2 [feat/uplift-causal]<br/>
        /repo/../dt-worktrees/baseline         a7f3c9d [main]<br/><br/>
        <span className="text-gh-blue font-bold italic">3 worktrees • 0 context switches • parallel experiments running</span>
      </div>
    )
  };

  const handleCommand = (cmd: string) => {
    if (!cmd) return;
    const normalizedCmd = cmd.trim();
    setTerminalHistory(prev => [...prev, { type: 'cmd', content: normalizedCmd }]);
    
    setTimeout(() => {
      const output = commands[normalizedCmd] || (
        <div className="text-zinc-500 font-mono italic">Command not in Legendary Lab. Try: help, git reflog, git fsck --lost-found</div>
      );
      setTerminalHistory(prev => [...prev, { type: 'output', content: output }]);
      setTerminalInput('');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ink text-gh-text antialiased overflow-x-hidden selection:bg-gh-blue/30 selection:text-white font-sans">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gh-blue to-violet flex items-center justify-center shadow-glow">
                <span className="font-mono font-semibold text-[11px] tracking-widest text-white">G4D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gh-green shadow-[0_0_16px_rgba(35,134,54,0.8)]"></div>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-[15px] italic">Git4Data</div>
              <div className="text-[10px] text-gh-text-sec font-mono -mt-0.5 uppercase font-bold tracking-widest">PHD+ • LEGENDARY TIER</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-gh-text-sec font-medium italic">
            <a href="#roadmap" className="hover:text-gh-text transition-colors">Roadmap</a>
            <a href="#lab" className="hover:text-gh-text transition-colors">Lab</a>
            <a href="#modules" className="hover:text-gh-text transition-colors">Modules</a>
            <span className="text-zinc-800">/</span>
            <span className="font-mono text-xs text-gh-blue italic font-bold">v2.4.1 • main</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-2.5 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] text-gh-text-sec font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse"></span>
              Verified Agents: 1,247
            </div>
            <button 
              onClick={() => router.push('/terminal')}
              className="h-9 px-4 rounded-lg bg-gh-blue text-white font-bold text-[11px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-sm uppercase tracking-widest italic"
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
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gh-blue/10 border border-gh-blue/20 text-xs mb-12"
            >
              <span className="px-1.5 py-0.5 rounded bg-gh-blue text-white font-semibold font-mono text-[9px] tracking-widest uppercase">ACTIVE</span>
              <span className="text-gh-text-sec font-mono text-[10px] uppercase tracking-widest font-bold italic">Meta & Google internal patterns declassified</span>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <span className="hidden sm:inline text-zinc-600 font-mono italic">20 LEVELS • 0 TO LEGENDARY</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans font-semibold tracking-[-0.04em] text-[clamp(42px,8vw,84px)] leading-[1.05] mb-12 flex flex-col items-center gap-4 italic"
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
              className="text-[19px] lg:text-[22px] leading-[1.5] text-gh-text-sec max-w-5xl font-light tracking-tight mb-12 italic opacity-80"
            >
              Not a tutorial. A high-fidelity simulation of the environments where trillion-row decisions ship daily. 
              You will learn to recover work others consider lost forever, and to sign every byte that touches production.
            </motion.p>

            {/* Dr. Hassan hook */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-3xl rounded-[24px] border border-white/5 bg-ink-2/80 backdrop-blur-xl p-6 lg:p-8 shadow-terminal text-left mb-12"
            >
              <div className="flex items-start gap-5">
                <div className="mt-0.5 w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner relative">
                  <span className="font-mono text-[10px] leading-none font-bold text-zinc-300 tracking-widest text-center uppercase">DR<br/>H</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gh-green border-2 border-ink-2 shadow-sm" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                    <h2 className="text-[12px] font-bold tracking-[0.2em] text-gh-blue uppercase italic underline decoration-gh-blue/30">DR. HASSAN • THE SAGE OF DATAPULSE</h2>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-gh-warn/15 text-gh-warn border border-gh-warn/20 font-mono font-bold uppercase tracking-widest">FORMER STAFF ENG • META</span>
                  </div>
                  <blockquote className="text-[16px] leading-[1.6] text-gh-text font-light italic">
                    “A junior analyst trusts their memory. A professional trusts their code. 
                    <strong className="text-white font-medium not-italic px-1 underline decoration-gh-blue/50 decoration-2">A Legend trusts the Reflog.</strong> 
                    Welcome to the final tier of data science — where history is engineered, not recorded.”
                  </blockquote>
                  <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-600 font-mono italic font-bold uppercase tracking-widest">
                    <span>• GPG: 0x4A7F 9C2D</span>
                    <span className="text-gh-green opacity-50">• STATUS: ONLINE</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core philosophy strips */}
            <div className="grid lg:grid-cols-3 gap-4 max-w-5xl">
              {[
                { 
                  title: 'ABSOLUTE TRACEABILITY', 
                  desc: 'Every bit, every weight, every SQL line — cryptographically linked to a human-signed commit. No exceptions.',
                  color: 'gh-blue',
                  icon: <Shield size={18} className="text-gh-blue" />
                },
                { 
                  title: 'RESILIENCE', 
                  desc: 'Recover work that others consider lost forever. Reflog, fsck, and object database mining as muscle memory.',
                  color: 'violet',
                  icon: <Clock size={18} className="text-violet-300" />
                },
                { 
                  title: 'META/GOOGLE SCALE', 
                  desc: 'Navigate repos housing collective intelligence of entire companies. Sparse-checkout, monolith mastery.',
                  color: 'gh-green',
                  icon: <Database size={18} className="text-gh-green" />
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className={`group rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 p-5 transition-all cursor-default text-left`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 w-10 h-10 rounded-xl bg-ink border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/10 transition-colors shadow-inner`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 mb-1.5 uppercase italic">{item.title}</div>
                      <div className="text-[13px] leading-[1.6] text-gh-text-sec font-light italic">{item.desc}</div>
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
                    <div className="text-[11px] font-bold tracking-[0.3em] text-gh-blue mb-4 uppercase italic underline decoration-gh-blue/20 underline-offset-4">0 TO LEGENDARY • 20 LEVELS OF MASTERY</div>
                    <h2 className="text-[36px] lg:text-[48px] font-bold tracking-tight leading-[0.95] text-white italic">
                        The path is not linear.<br/><span className="text-gh-text-sec font-light opacity-80 font-serif">It is versioned.</span>
                    </h2>
                </div>
                <div className="text-right hidden lg:block">
                    <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-ink border border-white/5 shadow-inner">
                        <div className="text-left">
                            <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest font-bold italic mb-1">Current cohort progress</div>
                            <div className="text-[13px] font-bold text-gh-text-sec italic font-mono uppercase tracking-tighter">Level 14 • Interactive Rebase</div>
                        </div>
                        <div className="w-px h-10 bg-white/5"></div>
                        <div className="text-[28px] font-mono font-black text-gh-blue leading-none italic">63%</div>
                    </div>
                </div>
            </div>

            {/* Modules grid */}
            <div className="grid lg:grid-cols-5 gap-5 items-start text-left" id="modules">
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/5 bg-ink p-5 shadow-inner">
                        <div className="text-[10px] font-bold font-mono text-gh-blue mb-2 uppercase tracking-widest italic">MODULE 01</div>
                        <div className="font-bold text-white mb-1.5 tracking-tight uppercase text-xs italic underline decoration-white/10">The Safety Net</div>
                        <div className="text-[11px] text-zinc-500 mb-4 leading-relaxed font-light italic">Commits, ignore, time travel, undo. The zero-panic foundation.</div>
                        <div className="space-y-2 text-[10px] font-mono uppercase tracking-tighter">
                            <div className="flex items-center gap-2 text-zinc-600">01 • Atomic commits</div>
                            <div className="flex items-center gap-2 text-zinc-600">02 • .gitignore patterns</div>
                            <div className="flex items-center gap-2 text-zinc-600">03 • Time travel</div>
                            <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/30 italic">04 • Undo without fear</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/5 bg-ink p-5 shadow-inner opacity-80">
                        <div className="text-[10px] font-bold font-mono text-violet-400 mb-2 uppercase tracking-widest italic">MODULE 02</div>
                        <div className="font-bold text-white mb-1.5 tracking-tight uppercase text-xs italic underline decoration-white/10">Collaboration</div>
                        <div className="text-[11px] text-zinc-500 mb-4 leading-relaxed font-light italic">Branching, remotes, conflicts, PRs. Professional sync.</div>
                        <div className="space-y-2 text-[10px] font-mono uppercase tracking-tighter">
                            <div className="flex items-center gap-2 text-zinc-700 italic">05 • Branch topology</div>
                            <div className="flex items-center gap-2 text-zinc-700 italic">06 • Remotes & forks</div>
                            <div className="flex items-center gap-2 text-zinc-700 italic">07 • Conflict resolution</div>
                            <div className="flex items-center gap-2 text-zinc-800 italic">08 • PRs that ship</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/5 bg-ink p-5 shadow-inner opacity-70">
                        <div className="text-[10px] font-bold font-mono text-gh-warn mb-2 uppercase tracking-widest italic">MODULE 03</div>
                        <div className="font-bold text-white mb-1.5 tracking-tight uppercase text-xs italic underline decoration-white/10">Data Forge</div>
                        <div className="text-[11px] text-zinc-600 mb-4 leading-relaxed font-light italic">dbt, Jupytext, SQLFluff, DVC. Specialized data tooling.</div>
                        <div className="space-y-2 text-[10px] font-mono uppercase tracking-tighter text-zinc-800">
                            <div>09 • dbt + Git</div>
                            <div>10 • Notebooks</div>
                            <div>11 • Quality hooks</div>
                            <div>12 • DVC & MLOps</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gh-blue/20 bg-gh-blue/[0.02] p-5 shadow-glow">
                        <div className="text-[10px] font-black font-mono text-gh-blue mb-2 uppercase tracking-[0.2em] italic">MODULE 04 • ELITE</div>
                        <div className="font-bold text-white mb-1.5 tracking-tight uppercase text-xs italic underline decoration-gh-blue/20">Big Tech Scale</div>
                        <div className="text-[11px] text-gh-text-sec mb-4 leading-relaxed font-light italic">Meta/Airbnb scale. History rewriting, bisect audits.</div>
                        <div className="space-y-2 text-[10px] font-mono uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-white font-black italic">13 • Sparse checkout</div>
                            <div className="flex items-center gap-2 text-gh-blue font-black underline decoration-gh-blue/40 italic">14 • Interactive rebase</div>
                            <div className="flex items-center gap-2 text-zinc-500 italic">15 • Git bisect audit</div>
                            <div className="flex items-center gap-2 text-zinc-600 italic">16 • Filter-repo</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gh-green/20 bg-gh-green/[0.02] p-5 shadow-inner">
                        <div className="text-[10px] font-black font-mono text-gh-green mb-2 uppercase tracking-[0.2em] italic">MODULE 05 • LEGEND</div>
                        <div className="font-bold text-white mb-1.5 tracking-tight uppercase text-xs italic underline decoration-gh-green/20">The Dark Arts</div>
                        <div className="text-[11px] text-zinc-500 mb-4 leading-relaxed font-light italic font-serif">Reflog resurrection, shadow clones, cryptographic seals.</div>
                        <div className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-gh-green/70 italic">
                            <div className="flex items-center gap-2 font-black italic animate-pulse">17 • Reflog resurr.</div>
                            <div className="font-black italic">18 • Shadow clones</div>
                            <div className="text-zinc-600">19 • GPG seals</div>
                            <div className="text-zinc-700">20 • Piper Master</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive Lab Section */}
      <section id="lab" className="py-24 lg:py-32 bg-ink border-b border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mb-16 text-left">
            <div className="text-[11px] font-bold tracking-[0.3em] text-violet-400 mb-4 uppercase italic underline decoration-violet-400/20 underline-offset-4">INTERACTIVE LAB • SIMULATED PRODUCTION</div>
            <h2 className="text-[36px] lg:text-[48px] font-bold tracking-tight leading-[0.95] text-white mb-6 text-left italic">
              The terminal does not lie.<br/><span className="text-gh-text-sec font-light font-serif opacity-70">Try to break things.</span>
            </h2>
            <p className="text-[18px] leading-relaxed text-gh-text-sec font-light text-left italic max-w-3xl opacity-80">
              These are not toys. They are exact replicas of the internal tools used for lineage audits at companies 
              where a single bad commit can affect $200M in reported revenue. Type, run, recover.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <div className="rounded-[24px] border border-white/10 bg-ink-2 shadow-terminal overflow-hidden transition-all duration-500 hover:border-white/20">
                {/* Window chrome */}
                <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                      <div className="w-3 h-3 rounded-full bg-gh-green/20 border border-gh-green/40" />
                    </div>
                    <div className="h-6 w-px bg-white/5" />
                    <div className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase font-bold italic">
                      data-platform • <span className="text-gh-blue italic font-black">main</span> • GPG SIGNED
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase">
                    <span className="px-2.5 py-1 rounded-md bg-gh-green/10 text-gh-green border border-gh-green/20 tracking-widest italic">RECOVERABLE</span>
                  </div>
                </div>

                {/* Terminal content */}
                <div className="p-8 font-mono text-[13px] leading-[1.8] text-gh-text-sec bg-ink min-h-[450px] text-left">
                  <div className="space-y-5">
                    {terminalHistory.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                      >
                        {item.type === 'cmd' && (
                          <div className="flex gap-3 text-white">
                            <span className="text-gh-blue font-black uppercase tracking-widest text-[11px] mt-1 pr-1 italic">❯</span>
                            <span className="font-bold italic">{item.content}</span>
                          </div>
                        )}
                        {item.type === 'output' && (
                          <div className="pl-7 text-gh-text-sec font-light italic border-l border-white/5 ml-1">
                            {item.content}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5 group">
                    <span className="text-gh-blue font-black uppercase tracking-widest text-[11px] pr-1 italic">❯</span>
                    <input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommand(terminalInput)}
                      className="flex-1 bg-transparent border-none outline-none text-white font-bold caret-gh-blue placeholder:text-zinc-800 italic"
                      placeholder="git reflog — try it"
                      spellCheck={false}
                      autoComplete="off"
                      autoFocus
                    />
                    <ChevronRight size={16} className="text-zinc-800 group-focus-within:text-gh-blue transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex items-center gap-4 text-[9px] text-zinc-700 font-mono uppercase tracking-[0.2em] px-4 italic font-bold">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gh-green/40 shadow-[0_0_8px_rgba(35,134,54,0.4)]" /> keystroke telemetry encrypted</span>
                <span>•</span>
                <span>Retention: 90 days</span>
                <span>•</span>
                <span>Audit Index: nominal</span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 text-left">
              <div className="rounded-2xl border border-white/5 bg-ink-2 p-6 shadow-glow relative overflow-hidden group transition-all duration-500 hover:border-gh-blue/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gh-blue/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gh-blue/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black text-gh-blue uppercase tracking-[0.3em] italic">Assignment Insight</span>
                    <div className="w-2 h-2 rounded-full bg-gh-green animate-pulse shadow-[0_0_10px_#238636]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight italic underline decoration-gh-blue/20 underline-offset-4">The Multi-Verse Architecture</h3>
                  <p className="text-[13px] text-gh-text-sec leading-relaxed font-light mb-6 italic opacity-80">
                    Stop switching branches. Learn to spin up parallel working trees for concurrent A/B testing on multi-terabyte datasets. The staff engineer workflow.
                  </p>
                  <button className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-gh-blue transition-colors group/btn italic">
                    Read the Whitepaper <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-xl shadow-inner border-dashed">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-violet-400 shadow-glow-violet">
                    <Lock size={18} />
                  </div>
                  <span className="text-[11px] font-black text-gh-text uppercase tracking-[0.3em] italic">Audit Trails</span>
                </div>
                <div className="space-y-4 font-mono text-[10px] italic font-bold">
                  <div className="flex justify-between py-2.5 border-b border-white/5">
                    <span className="text-zinc-600 uppercase">Signed Commit</span>
                    <span className="text-gh-green">✓ VERIFIED</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-white/5">
                    <span className="text-zinc-600 uppercase">DVC Pointer</span>
                    <span className="text-gh-text-sec">dvc://s3-v1.2</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-zinc-600 uppercase">Reflog Index</span>
                    <span className="text-gh-blue">0x4F2...A9B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Section */}
      <section className="border-b border-white/5 bg-ink-2/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 text-left">
                <div className="max-w-2xl">
                    <div className="text-[11px] font-bold tracking-[0.3em] text-gh-green mb-4 uppercase italic underline decoration-gh-green/20">LEVEL 19 • CRYPTOGRAPHIC SEAL</div>
                    <h2 className="text-[28px] lg:text-[42px] font-bold tracking-tight leading-[1.1] text-white italic">
                        Verified badges are not decoration.<br/>
                        <span className="text-gh-text-sec font-light opacity-80 font-serif">They are technical liability.</span>
                    </h2>
                </div>
                <div className="lg:text-right">
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-ink border border-white/5 text-[10px] font-mono italic font-bold text-zinc-500 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-gh-green animate-pulse" />
                        GPG: 4096R/4A7F9C2D • SIGNED
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5 text-left">
                <div className="lg:col-span-2 rounded-[24px] border border-gh-green/10 bg-gh-green/[0.02] overflow-hidden transition-all duration-500 hover:border-gh-green/30">
                    <div className="p-8">
                        <div className="flex items-start gap-6">
                            <div className="relative mt-1 w-12 h-12 rounded-2xl bg-gh-green/10 border border-gh-green/20 flex items-center justify-center flex-shrink-0 shadow-glow">
                                <Shield size={24} className="text-gh-green" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <code className="text-[14px] font-mono text-white font-bold italic tracking-tighter">a7f3c9d • feat: cascade uplift model v3</code>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gh-green text-white text-[10px] font-black font-mono italic tracking-widest shadow-sm">
                                        VERIFIED
                                    </span>
                                </div>
                                <p className="text-sm text-gh-text-sec leading-relaxed mb-4 font-light italic opacity-90">
                                    Merged to main • Deployed to prod-us-east-1 • 14.2M predictions/hour • 
                                    Lineage: dvc://models/uplift-v3.pkl
                                </p>
                                <div className="flex flex-wrap gap-5 text-[10px] font-mono text-zinc-600 italic font-bold uppercase tracking-widest">
                                    <span className="text-gh-green">No rogue data detected</span>
                                    <span>•</span>
                                    <span>Audit-proof lineage</span>
                                    <span>•</span>
                                    <span>2.4 TB Meta-Metadata</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[24px] border border-gh-danger/10 bg-gh-danger/[0.02] p-8 transition-all duration-500 hover:border-gh-danger/30">
                    <div className="text-[11px] font-black tracking-[0.2em] text-gh-danger mb-4 uppercase italic">REJECTION POLICY</div>
                    <div className="text-[13px] text-zinc-400 leading-relaxed mb-6 font-mono italic font-bold border-l border-gh-danger/20 pl-4 py-2">
                        commits without signature<br/>
                        force pushes to main<br/>
                        untracked notebook cell output<br/>
                        missing Great Expectations
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gh-danger font-black italic uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-gh-danger animate-pulse" />
                        Blocked by Firm Policy
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink border-b border-white/5 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <h2 className="text-[36px] lg:text-[62px] font-black tracking-[-0.05em] leading-[0.9] text-white mb-10 italic">
              You don’t need more tutorials.<br/>
              <span className="text-gh-text-sec font-light font-serif opacity-70">You need an environment.</span>
            </h2>
            <p className="text-[20px] leading-relaxed text-gh-text-sec max-w-3xl mb-16 font-light italic opacity-80">
              Git4Data is used by staff engineers at 47 companies to train teams on the patterns 
              that prevent midnight production pages. No certificates. Only recovery stories.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => router.push('/terminal')}
                  className="h-16 px-12 rounded-2xl bg-gh-blue text-white font-black text-[15px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-glow flex items-center justify-center gap-3 uppercase tracking-widest italic"
                >
                    Initialize Level 1
                    <ArrowRight size={20} />
                </button>
                <button className="h-16 px-12 rounded-2xl bg-white/5 border border-white/10 text-gh-text font-bold text-[15px] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl uppercase tracking-widest italic">
                    Incident Reports
                </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[11px] text-zinc-700 font-mono uppercase tracking-[0.3em] italic font-black">
                <span className="flex items-center gap-2"><Check size={12} className="text-gh-green" /> End-to-End Encrypted</span>
                <span className="flex items-center gap-2"><Check size={12} className="text-gh-green" /> 0% Data Loss</span>
                <span className="flex items-center gap-2"><Check size={12} className="text-gh-green" /> Signed Lineage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-ink-2/90 backdrop-blur-2xl py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 text-left">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-8 text-left justify-start">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gh-blue to-violet flex items-center justify-center shadow-glow">
                  <span className="font-mono font-black text-sm text-white uppercase tracking-widest">G4D</span>
                </div>
                <div className="text-2xl font-black tracking-tighter text-white uppercase italic">Git4Data</div>
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-600 font-light italic border-l-2 border-white/5 pl-6 py-1">
                The absolute ceiling of Git mastery for the high-stakes world of data science. 
                Where PhD-level research meets staff-level engineering rigor.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-20 text-left font-mono text-[11px] uppercase tracking-widest">
              <div className="space-y-8 text-left">
                <h4 className="font-black text-gh-text italic">Curriculum</h4>
                <div className="space-y-4 text-zinc-600 italic font-bold">
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">Safety Net</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">The Forge</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">Dark Arts</div>
                </div>
              </div>
              <div className="space-y-8 text-left">
                <h4 className="font-black text-gh-text italic">Architecture</h4>
                <div className="space-y-4 text-zinc-600 italic font-bold">
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">VFS Core</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">Reflog Engine</div>
                  <div className="hover:text-gh-blue transition-colors cursor-pointer underline decoration-white/5">DVC Auditor</div>
                </div>
              </div>
              <div className="space-y-8 text-left">
                <h4 className="font-black text-gh-text italic">System Status</h4>
                <div className="space-y-4 text-gh-green italic font-black flex flex-col items-start">
                  <div className="flex items-center gap-2 underline decoration-white/5"><span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse" /> Nodes Nominal</div>
                  <div className="flex items-center gap-2 underline decoration-white/5"><span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse" /> Audit: Secure</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-6 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em] italic font-black">
            <div>© 2026 Git4Data • Engineered by Dr. Hassan • Staff Edition</div>
            <div className="flex gap-10">
              <span className="flex items-center gap-2"><Shield size={10} className="text-gh-green opacity-50" /> Verified Lineage</span>
              <span className="flex items-center gap-2"><Lock size={10} className="text-gh-blue opacity-50" /> GPG Signed</span>
              <span className="flex items-center gap-2"><Check size={10} className="text-gh-green opacity-50" /> ISO-9001.Sim</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
