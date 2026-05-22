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

export default function LandingPage() {
  const router = useRouter();
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{type: 'cmd' | 'output', content: string | React.ReactNode}>>([
    { type: 'output', content: <span className="text-zinc-500">Git4Data Lab v2.4.1 • Legendary Tier simulation • type "help" for commands</span> },
    { type: 'cmd', content: 'git reset --hard HEAD~3' },
    { type: 'output', content: <span className="text-amber-300">HEAD is now at 9f2a1b4 chore: bump dbt version</span> },
    { type: 'cmd', content: 'git log --oneline -5' },
    { type: 'output', content: <div className="text-zinc-400">9f2a1b4 chore: bump dbt version<br/>3c8e2a1 docs: update runbook<br/><span className="text-zinc-600">... older history, feature work missing ...</span></div> },
    { type: 'output', content: <div className="border-l-2 border-sage/40 pl-3 py-2 bg-sage/5 rounded-r"><div className="text-sage font-medium">✓ Recovery path discovered • Reflog contains all movements for 90 days</div><div className="text-zinc-400 text-xs mt-1">The commits are not gone. Only the branch pointer moved. Git keeps everything.</div></div> }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const commands: Record<string, React.ReactNode> = {
    help: (
      <div className="space-y-2">
        <div className="text-zinc-300">Available commands in Legendary Lab:</div>
        <div className="space-y-1 text-zinc-400 text-xs font-mono">
          <div><span className="text-sage">git reflog</span> — Show all HEAD movements, even deleted commits</div>
          <div><span className="text-sage">git fsck --lost-found</span> — Find dangling objects</div>
          <div><span className="text-sage">git show &lt;sha&gt;</span> — Inspect a recovered commit</div>
          <div><span className="text-sage">git worktree list</span> — See parallel working trees</div>
        </div>
      </div>
    ),
    'git reflog': (
      <div className="space-y-1 text-xs font-mono">
        <div className="text-zinc-300">a7f3c9d HEAD@{0}: reset: moving to HEAD~3</div>
        <div className="text-sage">4b2e1a0 HEAD@{1}: commit: feat: customer 360 features • 847 lines</div>
        <div className="text-sage">9c1d4f2 HEAD@{2}: commit: feat: uplift v3 model • DVC tracked</div>
        <div className="text-sage">f3a8b91 HEAD@{3}: commit: feat: add revenue guardrail tests</div>
        <div>9f2a1b4 HEAD@{4}: commit: chore: bump dbt version</div>
        <div className="mt-2 text-emerald-400">✓ Found 3 commits not in current branch history. Recoverable.</div>
      </div>
    ),
    'git fsck --lost-found': (
      <div className="text-zinc-400 font-mono text-xs">
        Checking object directories: 100% (256/256), done.<br/>
        dangling commit 4b2e1a07d3f9a2c1b8e4<br/>
        dangling blob f9a2c1b8e4d3f9a2c1b8e4d3f9a2c1b8e4d3f9a2 • (features/customer_360.sql)
        <div className="mt-2 text-amber-300">⚠ Objects exist but no ref points to them. Recovery begins.</div>
      </div>
    ),
    'git show a7f3c9d': (
      <div className="text-zinc-300 font-mono text-xs leading-relaxed">
        commit a7f3c9d4b2e1a07d3f9a2c1b8e4f3a8b91 (HEAD)<br/>
        Author: Dr. Hassan &lt;hassan@datapulse.ai&gt;<br/>
        GPG: 4096R/4A7F9C2D VALID • Signed 2 hours ago<br/><br/>
        feat: cascade uplift model v3 • production deploy<br/><br/>
        models/uplift_v3.pkl | 1142 ++<br/>
        features/customer_360.sql | 847 ++<br/>
        <div className="text-emerald-400 mt-2">✓ Verified • DVC tracked • Great Expectations passed • Deployed</div>
      </div>
    ),
    'git worktree list': (
      <div className="text-zinc-300 font-mono text-xs leading-relaxed">
        /repo/data-platform           9f2a1b4 [main]<br/>
        /repo/../dt-worktrees/uplift-v3        4b2e1a0 [feat/uplift-cascade]<br/>
        /repo/../dt-worktrees/uplift-v3-causal 9c1d4f2 [feat/uplift-causal]<br/>
        /repo/../dt-worktrees/baseline         a7f3c9d [main]<br/><br/>
        <span className="text-sage">3 worktrees • 0 context switches • parallel experiments running</span>
      </div>
    )
  };

  const handleCommand = (cmd: string) => {
    if (!cmd) return;
    const normalizedCmd = cmd.trim();
    setTerminalHistory(prev => [...prev, { type: 'cmd', content: normalizedCmd }]);
    
    setTimeout(() => {
      const output = commands[normalizedCmd] || (
        <div className="text-zinc-500">Command not in Legendary Lab. Try: help, git reflog, git fsck --lost-found</div>
      );
      setTerminalHistory(prev => [...prev, { type: 'output', content: output }]);
      setTerminalInput('');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-100 antialiased overflow-x-hidden selection:bg-sage/30 selection:text-white">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage to-violet flex items-center justify-center shadow-glow">
                <span className="font-mono font-semibold text-[11px] tracking-widest text-white">G4D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_16px_rgba(245,158,11,0.8)]"></div>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-[15px]">Git4Data</div>
              <div className="text-[10px] text-zinc-500 font-mono -mt-0.5 uppercase">PHD+ • LEGENDARY TIER</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-zinc-400">
            <a href="#roadmap" className="hover:text-zinc-200 transition-colors">Roadmap</a>
            <a href="#lab" className="hover:text-zinc-200 transition-colors">Lab</a>
            <a href="#modules" className="hover:text-zinc-200 transition-colors">Modules</a>
            <span className="text-zinc-700">•</span>
            <span className="font-mono text-xs text-sage italic">v2.4.1 • main • signed</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-2.5 h-8 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              1,247 legends online
            </div>
            <button 
              onClick={() => router.push('/terminal')}
              className="h-9 px-4 rounded-lg bg-white text-ink font-medium text-[13px] hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-sm"
            >
              Enter Lab
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
            className="absolute top-[-30%] right-[-10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(14,165,163,0.18),_transparent_60%)] blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-5%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.15),_transparent_60%)] blur-3xl"
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-sage-ink/60 border border-sage/20 text-xs mb-10"
            >
              <span className="px-1.5 py-0.5 rounded bg-sage text-ink font-semibold font-mono text-[10px] tracking-wider uppercase">ACTIVE</span>
              <span className="text-zinc-300 font-light">Big Tech Scale Simulation • Meta & Google internal patterns declassified</span>
              <span className="hidden sm:inline text-zinc-500">•</span>
              <span className="hidden sm:inline text-zinc-400 font-mono italic">20 LEVELS • 0 TO LEGENDARY</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans font-semibold tracking-[-0.03em] text-[clamp(42px,8vw,84px)] leading-[1.1] mb-12 flex flex-col items-center gap-4"
            >
              <span>The ledger of</span>
              <span className="relative inline-block px-4">
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent italic">integrity</span>
                <div className="absolute inset-x-0 bottom-2 h-px bg-gradient-to-r from-transparent via-sage/50 to-transparent"></div>
              </span>
              <span>is a Git graph.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[19px] lg:text-[22px] leading-[1.5] text-zinc-300 max-w-3xl font-light tracking-[-0.01em] mb-16"
            >
              Not a tutorial. A high-fidelity simulation of the environments where trillion-row decisions ship daily. 
              You will learn to recover work others consider lost forever, and to sign every byte that touches production.
            </motion.p>

            {/* Dr. Hassan hook */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-3xl rounded-[20px] border border-white/10 bg-ink-2/80 backdrop-blur p-5 lg:p-6 shadow-terminal text-left"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-11 h-11 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <span className="font-mono text-[10px] leading-none font-semibold text-zinc-300 tracking-widest text-center uppercase">DR<br/>H</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2.5">
                    <h2 className="text-[13px] font-semibold tracking-wide text-white uppercase">DR. HASSAN • THE SAGE OF DATAPULSE</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber/15 text-amber-300 border border-amber/20 font-mono font-medium uppercase tracking-tighter">FORMER META • AIRBNB STAFF</span>
                  </div>
                  <blockquote className="text-[15px] leading-[1.6] text-zinc-300 font-light italic">
                    “A junior analyst trusts their memory. A professional trusts their code. 
                    <strong className="text-white font-medium not-italic"> A Legend trusts the Reflog.</strong> 
                    Welcome to the final tier of data science — where history is engineered, 
                    not recorded.”
                  </blockquote>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 font-mono italic">
                    <span>• 14 yrs production lineage • 3 incidents recovered from reflog • GPG key: 0x4A7F 9C2D</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core philosophy strips */}
            <div className="mt-14 grid lg:grid-cols-3 gap-3 max-w-5xl">
              {[
                { 
                  title: 'ABSOLUTE TRACEABILITY', 
                  desc: 'Every bit, every weight, every SQL line — cryptographically linked to a human-signed commit. No exceptions.',
                  color: 'sage',
                  icon: <Shield size={18} className="text-sage" />
                },
                { 
                  title: 'RESILIENCE', 
                  desc: 'Recover work that others consider lost forever. Reflog, fsck, and object database mining as muscle memory.',
                  color: 'violet',
                  icon: <Clock size={18} className="text-violet-300" />
                },
                { 
                  title: 'META/GOOGLE SCALE', 
                  desc: 'Navigate repos housing collective intelligence of entire companies. Sparse-checkout, VFS, monolith mastery.',
                  color: 'amber',
                  icon: <Database size={18} className="text-amber-300" />
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className={`group rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-${item.color}/30 p-4 transition-all cursor-default`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-9 h-9 rounded-xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center flex-shrink-0 group-hover:border-${item.color}/40 transition-colors`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold tracking-widest text-zinc-500 mb-1 uppercase">{item.title}</div>
                      <div className="text-[13px] leading-[1.5] text-zinc-300 font-light">{item.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" class="border-b border-white/5 bg-ink-2/50">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div class="flex flex-wrap items-end justify-between gap-8 mb-12">
                <div>
                    <div class="text-[11px] font-semibold tracking-[0.14em] text-sage mb-3 uppercase">0 TO LEGENDARY • 20 LEVELS OF MASTERY</div>
                    <h2 class="text-[36px] lg:text-[48px] font-semibold tracking-[-0.02em] leading-[0.95] text-white">
                        The path is not linear.<br/><span className="italic font-light opacity-80">It is versioned.</span>
                    </h2>
                </div>
                <div class="text-right hidden lg:block">
                    <div class="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink border border-white/10">
                        <div class="text-left">
                            <div class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Current cohort</div>
                            <div class="text-[13px] font-medium text-zinc-200 italic font-mono">Level 14 • Interactive Rebase</div>
                        </div>
                        <div class="w-px h-8 bg-white/10"></div>
                        <div class="text-[24px] font-mono font-medium text-white leading-none">63%</div>
                    </div>
                </div>
            </div>

            {/* Modules grid */}
            <div class="grid lg:grid-cols-5 gap-4 items-start" id="modules">
                {/* Module 1 */}
                <div class="lg:col-span-1">
                    <div class="sticky top-24 rounded-2xl border border-white/10 bg-ink p-4">
                        <div class="text-[10px] font-mono text-sage mb-1 uppercase">MODULE 01</div>
                        <div class="font-semibold text-white mb-1 tracking-tight">The Safety Net</div>
                        <div class="text-xs text-zinc-500 mb-3 leading-snug font-light">Foundation • Commits, ignore, time travel, undo. Where legends learn to never panic.</div>
                        <div class="space-y-1.5 text-[11px] font-mono italic">
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>01 • Atomic commits</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>02 • .gitignore patterns</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>03 • Time travel</div>
                            <div class="flex items-center gap-2 text-sage"><span class="w-1 h-1 rounded-full bg-sage"></span>04 • Undo without fear</div>
                        </div>
                    </div>
                </div>

                {/* Module 2 */}
                <div class="lg:col-span-1">
                    <div class="sticky top-24 rounded-2xl border border-white/10 bg-ink p-4">
                        <div class="text-[10px] font-mono text-violet-300 mb-1 uppercase">MODULE 02</div>
                        <div class="font-semibold text-white mb-1 tracking-tight">Collaboration Protocol</div>
                        <div class="text-xs text-zinc-500 mb-3 leading-snug font-light">Branching, remotes, conflicts, PRs. How staff engineers review each other.</div>
                        <div class="space-y-1.5 text-[11px] font-mono italic">
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>05 • Branch topology</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>06 • Remotes & forks</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>07 • Conflict resolution</div>
                            <div class="flex items-center gap-2 text-zinc-500"><span class="w-1 h-1 rounded-full bg-zinc-700"></span>08 • PRs that ship</div>
                        </div>
                    </div>
                </div>

                {/* Module 3 */}
                <div class="lg:col-span-1">
                    <div class="sticky top-24 rounded-2xl border border-white/10 bg-ink p-4">
                        <div class="text-[10px] font-mono text-amber-300 mb-1 uppercase">MODULE 03</div>
                        <div class="font-semibold text-white mb-1 tracking-tight">Specialized Forge</div>
                        <div class="text-xs text-zinc-500 mb-3 leading-snug font-light">dbt, Jupytext, SQLFluff, DVC. Tooling for data engineers who ship.</div>
                        <div class="space-y-1.5 text-[11px] font-mono italic">
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>09 • dbt + Git</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>10 • Notebook versioning</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>11 • Data quality hooks</div>
                            <div class="flex items-center gap-2 text-zinc-500"><span class="w-1 h-1 rounded-full bg-zinc-700"></span>12 • DVC & MLOps</div>
                        </div>
                    </div>
                </div>

                {/* Module 4 - Big Tech */}
                <div class="lg:col-span-1">
                    <div class="sticky top-24 rounded-2xl border border-sage/30 bg-sage-ink/40 p-4 shadow-glow">
                        <div class="flex items-center gap-2 mb-1">
                            <div class="text-[10px] font-mono text-sage uppercase">MODULE 04</div>
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sage text-ink font-mono uppercase">ULTRA HERO</span>
                        </div>
                        <div class="font-semibold text-white mb-1 tracking-tight">Big Tech Scale</div>
                        <div class="text-xs text-zinc-300 mb-3 leading-snug font-light">Meta/Airbnb scale. Sparse checkout, bisect audits, history rewriting.</div>
                        <div class="space-y-1.5 text-[11px] font-mono italic">
                            <div class="flex items-center gap-2 text-white"><span class="w-1.5 h-1.5 rounded-full bg-sage shadow-[0_0_8px_#0ea5a3]"></span>13 • Sparse checkout</div>
                            <div class="flex items-center gap-2 text-sage"><span class="w-1.5 h-1.5 rounded-full bg-sage shadow-[0_0_8px_#0ea5a3]"></span>14 • Interactive rebase</div>
                            <div class="flex items-center gap-2 text-zinc-300"><span class="w-1 h-1 rounded-full bg-zinc-500"></span>15 • Git bisect audit</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>16 • Filter-repo cleanup</div>
                        </div>
                    </div>
                </div>

                {/* Module 5 - Legendary Tier */}
                <div class="lg:col-span-1">
                    <div class="sticky top-24 rounded-2xl border border-amber/30 bg-amber/5 p-4 shadow-glow-violet">
                        <div class="flex items-center gap-2 mb-1">
                            <div class="text-[10px] font-mono text-amber-300 uppercase">MODULE 05</div>
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber text-ink font-mono uppercase">LEGENDARY</span>
                        </div>
                        <div class="font-semibold text-white mb-1 tracking-tight">The Dark Arts</div>
                        <div class="text-xs text-zinc-300 mb-3 leading-snug font-light">Reflog resurrection, worktrees, GPG seals, Piper/Sapling architecture.</div>
                        <div class="space-y-1.5 text-[11px] font-mono italic text-amber-100/70">
                            <div class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>17 • Reflog resurrection</div>
                            <div class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>18 • Shadow clones</div>
                            <div class="flex items-center gap-2 text-zinc-300"><span class="w-1 h-1 rounded-full bg-zinc-500"></span>19 • Cryptographic seal</div>
                            <div class="flex items-center gap-2 text-zinc-400"><span class="w-1 h-1 rounded-full bg-zinc-600"></span>20 • Monolith master</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive Lab Section */}
      <section id="lab" className="py-20 bg-ink border-b border-white/5 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] font-semibold tracking-[0.14em] text-violet-300 mb-3 uppercase">INTERACTIVE LAB • SIMULATED PRODUCTION</div>
            <h2 className="text-[36px] lg:text-[48px] font-semibold tracking-[-0.02em] leading-[0.95] text-white mb-4">
              The terminal does not lie.<br/><span className="italic font-light opacity-80">Try to break things.</span>
            </h2>
            <p className="text-[17px] leading-relaxed text-zinc-400 font-light">
              These are not toys. They are exact replicas of the internal tools used for lineage audits at companies 
              where a single bad commit can affect $200M in reported revenue. Type, run, recover.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Main Terminal Simulation */}
            <div className="lg:col-span-3">
              <div className="rounded-[20px] border border-white/10 bg-ink-2 shadow-terminal overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center justify-between px-4 h-11 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-600 opacity-50" />
                      <div className="w-3 h-3 rounded-full bg-zinc-600 opacity-50" />
                      <div className="w-3 h-3 rounded-full bg-zinc-600 opacity-50" />
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="text-xs font-mono text-zinc-400 tracking-tight">
                      data-platform • <span className="text-sage font-semibold italic">main</span> • GPG signed
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                    <span className="px-2 py-1 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 uppercase">RECOVERABLE</span>
                  </div>
                </div>

                {/* Terminal content */}
                <div className="p-6 font-mono text-[13px] leading-[1.7] text-zinc-300 bg-[#08090c] min-h-[400px]">
                  <div className="space-y-4">
                    {terminalHistory.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                      >
                        {item.type === 'cmd' && (
                          <div className="flex gap-2 text-white">
                            <span className="text-sage font-bold uppercase tracking-widest text-[10px] mt-1 pr-1">❯</span>
                            <span className="font-semibold">{item.content}</span>
                          </div>
                        )}
                        {item.type === 'output' && (
                          <div className="pl-6 text-zinc-400 font-light">
                            {item.content}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 group">
                    <span className="text-sage font-bold uppercase tracking-widest text-[10px] pr-1">❯</span>
                    <input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommand(terminalInput)}
                      className="flex-1 bg-transparent border-none outline-none text-white font-semibold caret-sage placeholder:text-zinc-700 italic"
                      placeholder="git reflog — type 'help' to start"
                      spellCheck={false}
                      autoComplete="off"
                      autoFocus
                    />
                    <ChevronRight size={14} className="text-zinc-700 group-focus-within:text-sage transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-3 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.1em] px-2 italic">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> keystroke tracking enabled</span>
                <span>•</span>
                <span>Reflog retention: 90 days</span>
                <span>•</span>
                <span>Object DB: 4.2 GB</span>
              </div>
            </div>

            {/* Side Highlights */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-ink-2 p-5 shadow-glow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sage/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-sage uppercase tracking-[0.2em]">Assignment Insight</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">The Multi-Verse Architecture</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4 italic">
                    Stop switching branches. Learn to spin up parallel working trees for concurrent A/B testing on multi-terabyte datasets.
                  </p>
                  <button className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest hover:text-sage transition-colors group/btn">
                    Read the whitepaper <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center text-violet-300">
                    <Lock size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Audit Trails</span>
                </div>
                <div className="space-y-3 font-mono text-[10px]">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 italic">Signed Commit</span>
                    <span className="text-emerald-400 font-bold">✓ VERIFIED</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 italic">DVC Pointer</span>
                    <span className="text-zinc-300">dvc://s3-v1.2</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 italic">Reflog Index</span>
                    <span className="text-sage italic">0x4F2...A9B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-ink-2/80 backdrop-blur py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-violet flex items-center justify-center shadow-glow">
                  <span className="font-mono font-semibold text-xs tracking-widest text-white">G4D</span>
                </div>
                <div className="text-lg font-bold tracking-tight text-white uppercase italic">Git4Data</div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500 font-light italic">
                The absolute ceiling of Git mastery for the high-stakes world of data. 
                Where PhD-level research meets staff-level engineering rigor.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Curriculum</h4>
                <ul className="text-xs space-y-2 text-zinc-500 font-light">
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">Safety Net</li>
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">The Forge</li>
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">Dark Arts</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Architecture</h4>
                <ul className="text-xs space-y-2 text-zinc-500 font-light">
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">VFS Layer</li>
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">Reflog Engine</li>
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">DVC Audit</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Contact</h4>
                <ul className="text-xs space-y-2 text-zinc-500 font-light">
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">Secure Node</li>
                  <li className="hover:text-sage transition-colors cursor-pointer italic underline decoration-white/5">Status: Nominal</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest italic">
            <div>© 2026 Git4Data • Engineered by Dr. Hassan</div>
            <div className="flex gap-6">
              <span>Verified Lineage</span>
              <span>GPG Signed</span>
              <span>0% Data Loss</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
