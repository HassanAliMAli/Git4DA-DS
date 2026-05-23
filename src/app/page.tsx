"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfileContext";

// Extracted Features
import { HeroSection } from "@/components/features/HeroSection";
import { RoadmapSection } from "@/components/features/RoadmapSection";
import { LabSection } from "@/components/features/LabSection";
import { SignatureSection } from "@/components/features/SignatureSection";
import { FooterSection } from "@/components/features/FooterSection";

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded } = useProfile();
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "cmd" | "output"; content: string | React.ReactNode }>
  >([
    {
      type: "output",
      content: (
        <span className="text-white font-mono opacity-90">
          Git4Data Lab v2.4.1 • Legendary Tier simulation • type
          &quot;help&quot; for commands
        </span>
      ),
    },
    { type: "cmd", content: "git reset --hard HEAD~3" },
    {
      type: "output",
      content: (
        <span className="text-gh-warn font-bold">
          HEAD is now at 9f2a1b4 chore: bump dbt version
        </span>
      ),
    },
    { type: "cmd", content: "git log --oneline -5" },
    {
      type: "output",
      content: (
        <div className="text-white font-mono opacity-80">
          9f2a1b4 chore: bump dbt version
          <br />
          3c8e2a1 docs: update runbook
          <br />
          <span className="text-zinc-500">
            ... older history, feature work missing ...
          </span>
        </div>
      ),
    },
    {
      type: "output",
      content: (
        <div className="border-l-2 border-gh-blue pl-4 py-2 bg-gh-blue/10 rounded-r">
          <div className="text-gh-blue font-black uppercase tracking-widest text-[11px]">
            ✓ Recovery path discovered • Reflog contains all movements for 90
            days
          </div>
          <div className="text-white text-xs mt-1 italic font-light">
            The commits are not gone. Only the branch pointer moved. Git keeps
            everything.
          </div>
        </div>
      ),
    },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gh-blue/20 border-t-gh-blue rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-white uppercase tracking-[0.2em] animate-pulse font-bold">
            Initializing Secure Node...
          </span>
        </div>
      </div>
    );
  }

  const commands: Record<string, React.ReactNode> = {
    help: (
      <div className="space-y-2">
        <div className="text-white font-bold uppercase tracking-widest text-xs italic">
          Available commands in Legendary Lab:
        </div>
        <div className="space-y-1 text-white text-xs font-mono">
          <div>
            <span className="text-gh-blue font-black tracking-widest">
              git reflog
            </span>{" "}
            — Show all HEAD movements, even deleted commits
          </div>
          <div>
            <span className="text-gh-blue font-black tracking-widest">
              git fsck --lost-found
            </span>{" "}
            — Find dangling objects
          </div>
          <div>
            <span className="text-gh-blue font-black tracking-widest">
              git show &lt;sha&gt;
            </span>{" "}
            — Inspect a recovered commit
          </div>
          <div>
            <span className="text-gh-blue font-black tracking-widest">
              git worktree list
            </span>{" "}
            — See parallel working trees
          </div>
        </div>
      </div>
    ),
    "git reflog": (
      <div className="space-y-1 text-xs font-mono">
        <div className="text-zinc-400">
          a7f3c9d HEAD@{0}: reset: moving to HEAD~3
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          4b2e1a0 HEAD@{1}: commit: feat: customer 360 features • 847 lines
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          9c1d4f2 HEAD@{2}: commit: feat: uplift v3 model • DVC tracked
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          f3a8b91 HEAD@{3}: commit: feat: add revenue guardrail tests
        </div>
        <div className="text-white">
          9f2a1b4 HEAD@{4}: commit: chore: bump dbt version
        </div>
        <div className="mt-3 text-gh-green font-black uppercase tracking-widest">
          ✓ Found 3 commits not in current branch history. Recoverable.
        </div>
      </div>
    ),
    "git fsck --lost-found": (
      <div className="text-white font-mono text-xs opacity-90">
        Checking object directories: 100% (256/256), done.
        <br />
        dangling commit 4b2e1a07d3f9a2c1b8e4
        <br />
        dangling blob f9a2c1b8e4d3f9a2c1b8e4d3f9a2c1b8e4d3f9a2 •
        (features/customer_360.sql)
        <div className="mt-3 text-gh-warn font-black italic uppercase tracking-widest">
          ⚠ Objects exist but no ref points to them. Recovery begins.
        </div>
      </div>
    ),
    "git show a7f3c9d": (
      <div className="text-white font-mono text-xs leading-relaxed font-bold italic">
        commit a7f3c9d4b2e1a07d3f9a2c1b8e4f3a8b91 (HEAD)
        <br />
        Author: Dr. Hassan &lt;hassan@datapulse.ai&gt;
        <br />
        GPG: 4096R/4A7F9C2D VALID • Signed 2 hours ago
        <br />
        <br />
        feat: cascade uplift model v3 • production deploy
        <br />
        <br />
        models/uplift_v3.pkl | 1142 ++
        <br />
        features/customer_360.sql | 847 ++
        <br />
        <div className="text-gh-green mt-3 font-black uppercase tracking-widest underline decoration-gh-green/30">
          ✓ Verified • DVC tracked • Great Expectations passed • Deployed
        </div>
      </div>
    ),
    "git worktree list": (
      <div className="text-white font-mono text-xs leading-relaxed italic font-bold">
        /repo/data-platform 9f2a1b4 [main]
        <br />
        /repo/../dt-worktrees/uplift-v3 4b2e1a0 [feat/uplift-cascade]
        <br />
        /repo/../dt-worktrees/uplift-v3-causal 9c1d4f2 [feat/uplift-causal]
        <br />
        /repo/../dt-worktrees/baseline a7f3c9d [main]
        <br />
        <br />
        <span className="text-gh-blue font-black uppercase tracking-widest text-[11px]">
          3 worktrees • 0 context switches • parallel experiments running
        </span>
      </div>
    ),
  };

  const handleCommand = (cmd: string): void => {
    if (!cmd) return;
    const normalizedCmd = cmd.trim();
    setTerminalHistory((prev) => [
      ...prev,
      { type: "cmd", content: normalizedCmd },
    ]);

    setTimeout(() => {
      const output = commands[normalizedCmd] || (
        <div className="text-zinc-500 font-mono italic font-bold uppercase tracking-widest text-[10px]">
          Command not in Legendary Lab. Try: help, git reflog, git fsck
          --lost-found
        </div>
      );
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", content: output },
      ]);
      setTerminalInput("");
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gh-blue to-teal-600 flex items-center justify-center shadow-glow border border-white/10">
                <span className="font-mono font-black text-[11px] tracking-widest text-white">
                  G4D
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gh-green shadow-[0_0_16px_rgba(35,134,54,0.8)]"></div>
            </div>
            <div className="leading-tight">
              <div className="font-black tracking-tighter text-[15px] italic uppercase">
                Git4Data
              </div>
              <div className="text-[10px] text-white font-mono -mt-0.5 uppercase font-black tracking-widest opacity-60">
                PHD+ • LEGENDARY TIER
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-white font-bold italic opacity-80 uppercase tracking-widest">
            <Link
              href="#roadmap"
              className="hover:text-gh-blue transition-colors"
            >
              Roadmap
            </Link>
            <Link href="#lab" className="hover:text-gh-blue transition-colors">
              Lab
            </Link>
            <Link
              href="#modules"
              className="hover:text-gh-blue transition-colors"
            >
              Modules
            </Link>
            <span className="text-zinc-800">/</span>
            <span className="font-mono text-xs text-gh-blue italic font-black">
              v2.4.1 • main
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-2.5 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-mono uppercase tracking-widest font-black italic">
              <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse"></span>
              Agents: 1,247
            </div>
            <button
              onClick={() => router.push("/terminal")}
              className="h-9 px-4 rounded-lg bg-gh-blue text-white font-black text-[11px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-sm uppercase tracking-widest italic border border-white/10"
            >
              Enter Hub
            </button>
          </div>
        </div>
      </header>

      <HeroSection />

      <RoadmapSection />

      <LabSection
        terminalHistory={terminalHistory}
        terminalInput={terminalInput}
        setTerminalInput={setTerminalInput}
        handleCommand={handleCommand}
      />

      <SignatureSection router={router} />

      <FooterSection />
    </div>
  );
}
