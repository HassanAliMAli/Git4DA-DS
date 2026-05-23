"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useProfile } from "@/contexts/ProfileContext";

// Extracted Features
import { Navigation } from "@/components/features/Navigation";
import { HeroSection } from "@/components/features/HeroSection";
import { RoadmapSection } from "@/components/features/RoadmapSection";
import { LabSection } from "@/components/features/LabSection";
import { SignatureSection } from "@/components/features/SignatureSection";
import { FooterSection } from "@/components/features/FooterSection";

/**
 * Main Landing Page Orchestrator
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * This page serves as the entry point to the Git4Data universe. It utilizes
 * a modular feature-based architecture where individual sections are extracted
 * into standalone components to maintain strict file length limits (<300 lines).
 * 
 * It manages the high-level 'Legendary Lab' terminal state used in the hero 
 * and interactive sections to provide a seamless preview of the PhD-level simulation.
 */
export default function LandingPage(): React.ReactNode {
  const router: AppRouterInstance = useRouter();
  const { isLoaded } = useProfile();
  
  // Terminal state for the interactive lab preview
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "cmd" | "output"; content: string | React.ReactNode }>
  >([
    {
      type: "output",
      content: (
        <span className="text-white font-mono font-bold">
          Git4Data Lab v2.4.1 • Legendary Tier simulation • type "help" for
          commands
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

  // Maintain visual focus on the latest terminal movement
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  /**
   * Safe-guard: Ensure user profile is hydrated before rendering the simulation.
   */
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

  // Pre-configured simulated command responses for the Landing Page interactive lab
  const commands: Record<string, React.ReactNode> = {
    help: (
      <div className="space-y-2 text-left">
        <div className="text-white font-bold uppercase tracking-widest text-xs italic">
          Available commands in Legendary Lab:
        </div>
        <div className="space-y-1 text-white text-xs font-mono">
          <div>
            <span className="text-gh-blue font-black tracking-widest">
              git reflog
            </span>{" "}
            — Show all HEAD movements
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
      <div className="space-y-1 text-xs font-mono text-left">
        <div className="text-zinc-500 italic">
          a7f3c9d HEAD@{0}: reset: moving to HEAD~3
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          4b2e1a0 HEAD@{1}: commit: feat: customer 360 features
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          9c1d4f2 HEAD@{2}: commit: feat: uplift v3 model • DVC
        </div>
        <div className="text-gh-blue font-bold italic underline decoration-white/10">
          f3a8b91 HEAD@{3}: commit: feat: add revenue guardrails
        </div>
        <div className="mt-2 text-gh-green font-black uppercase tracking-widest">
          ✓ Found 3 commits recoverable history.
        </div>
      </div>
    ),
    "git fsck --lost-found": (
      <div className="text-white font-mono text-xs opacity-90 text-left">
        Checking object directories: 100% (256/256), done.
        <br />
        dangling commit 4b2e1a07d3f9a2c1b8e4
        <br />
        dangling blob f9a2c1b8e4d3f9a2 • (customer_360.sql)
        <div className="mt-2 text-gh-warn font-black italic uppercase tracking-widest">
          ⚠ Objects exist but no ref points to them. Recovery begins.
        </div>
      </div>
    ),
    "git show a7f3c9d": (
      <div className="text-white font-mono text-[11px] leading-relaxed font-bold italic text-left border-l-2 border-white/5 pl-4">
        commit a7f3c9d4b2e1a07d3f9a2c1b8e4f3a8b91
        <br />
        Author: Dr. Hassan &lt;hassan@datapulse.ai&gt;
        <br />
        GPG: VALID SIGNATURE • Deployed
        <br />
        <br />
        <div className="text-gh-green font-black uppercase tracking-widest text-[9px]">
          ✓ Verified • DVC tracked
        </div>
      </div>
    ),
    "git worktree list": (
      <div className="text-white font-mono text-[11px] leading-relaxed italic font-bold text-left">
        /repo/data-platform 9f2a1b4 [main]
        <br />
        /repo/../dt-worktrees/uplift-v3 4b2e1a0 [feat/uplift]
        <br />
        <br />
        <span className="text-gh-blue font-black uppercase tracking-widest text-[11px]">
          Parallel experiments running
        </span>
      </div>
    ),
  };

  /**
   * Command dispatcher for the Landing Page terminal preview.
   * Provides immediate feedback to hook the user into the simulation experience.
   */
  const handleCommand = (cmd: string): void => {
    if (!cmd) return;
    const normalizedCmd = cmd.trim();
    setTerminalHistory((prev) => [...prev, { type: "cmd", content: normalizedCmd }]);

    setTimeout(() => {
      const output =
        commands[normalizedCmd] || (
          <div className="text-zinc-500 font-mono italic font-bold uppercase tracking-widest text-[10px]">
            Unknown command. Try: help, git reflog
          </div>
        );
      setTerminalHistory((prev) => [...prev, { type: "output", content: output }]);
      setTerminalInput("");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ink text-gh-text antialiased overflow-x-hidden selection:bg-gh-blue selection:text-white font-sans">
      <div className="scanline opacity-40" />

      <Navigation />

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
