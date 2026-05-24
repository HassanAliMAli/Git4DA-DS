"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { FileSystem } from "@/lib/vfs/FileSystem";
import { GitRepository } from "@/lib/git/GitRepository";
import { CommandProcessor } from "@/lib/git/CommandProcessor";
import { LEVELS } from "@/lib/narrative/LevelManager";
import { Terminal } from "@/components/Terminal";
import { DataPulseMessenger } from "@/components/DataPulseMessenger";
import { PullRequestView } from "@/components/PullRequestView";
import { RebaseView } from "@/components/RebaseView";
import { TerminalSidebar } from "@/components/features/TerminalSidebar";
import { DrHassanAdvisor } from "@/components/DrHassanAdvisor";
import { useRouter } from "next/navigation";

/**
 * Terminal UI / Workstation Orchestrator
 */

export default function TerminalPage() {
  const router = useRouter();
  const { profile, isLoaded } = useProfile();

  // Simulation state
  const fs = useMemo(() => new FileSystem(), []);
  const git = useMemo(() => new GitRepository(fs), [fs]);

  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{
      type: "command" | "output" | "error";
      text: string | React.ReactNode;
    }>
  >([]);
  const [completedGoalIds, setCompletedGoalIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isPROpen, setIsPROpen] = useState(false);
  const [isRebaseOpen, setIsRebaseOpen] = useState(false);
  const [activeAdvice, setActiveAdvice] = useState<string | null>(null);
  const [extraChatMessages, setExtraChatMessages] = useState<
    import("@/components/DataPulseMessenger").ChatMessage[]
  >([]);

  const currentLevel = useMemo(() => {
    return LEVELS.find(
      (l) =>
        l.id === currentLevelId &&
        (l.role === "BOTH" || l.role === profile?.role),
    );
  }, [currentLevelId, profile?.role]);

  const processor = useMemo(() => {
    if (!profile) return null;
    return new CommandProcessor(fs, git, profile.name);
  }, [fs, git, profile]);

  // Handle Level Initialization
  useEffect(() => {
    if (currentLevel && fs) {
      const initLevel = async () => {
        await currentLevel.setup({ fs, git });
        
        // Reset states for the new level
        setIsLevelComplete(false);
        setIsPROpen(false);
        setCompletedGoalIds(new Set());
        setExtraChatMessages([]);
        
        // Initial progress check to see if setup fulfilled any goals
        const newlyCompleted = new Set<string>();
        currentLevel.goals.forEach((goal) => {
          if (goal.check({ fs, git, prOpened: false })) {
            newlyCompleted.add(goal.id);
          }
        });
        setCompletedGoalIds(newlyCompleted);
      };
      
      initLevel();
    }
  }, [currentLevel, fs, git]);

  if (!isLoaded || !profile || !currentLevel || !processor) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-ink text-gh-text">
        <div className="flex flex-col items-center gap-4 text-center p-8 text-white font-bold italic">
          <div className="w-12 h-12 border-2 border-gh-blue/20 border-t-gh-blue rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold tracking-tight italic">
            Synchronizing Secure Node...
          </h2>
          <p className="text-white font-mono text-[10px] uppercase tracking-widest max-w-xs leading-relaxed opacity-70">
            Establishing encrypted tunnel to DataPulse HQ. Verifying audit
            credentials.
          </p>
        </div>
      </div>
    );
  }

  const checkLevelProgress = (prOpenedOverride?: boolean) => {
    if (!currentLevel) return;

    const newlyCompleted = new Set<string>();
    currentLevel.goals.forEach((goal) => {
      const state = { fs, git, prOpened: isPROpen || prOpenedOverride };
      if (goal.check(state)) {
        newlyCompleted.add(goal.id);
      }
    });

    setCompletedGoalIds(newlyCompleted);

    if (newlyCompleted.size === currentLevel.goals.length && !isLevelComplete) {
      setIsLevelComplete(true);
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: (
            <div className="text-gh-green font-black border-y-2 border-gh-green/20 py-3 my-4 italic uppercase tracking-[0.2em] text-center bg-gh-green/5 shadow-glow">
              ✓ Mission Accomplished: {currentLevel.title}
            </div>
          ),
        },
        {
          type: "output",
          text: (
            <span className="italic text-white font-bold">
              System: Audit logs finalized. Proceed when ready.
            </span>
          ),
        },
      ]);
    }
  };

  const handleCommand = useCallback(async (command: string) => {
    setTerminalHistory((prev) => [...prev, { type: "command", text: command }]);

    try {
      const output = await processor?.execute(command);

      if (output === "CLEAR_TERMINAL") {
        setTerminalHistory([]);
      } else if (output === "SIGNAL:OPEN_PR") {
        setIsPROpen(true);
        checkLevelProgress(true);
      } else if (output === "SIGNAL:OPEN_REBASE") {
        setIsRebaseOpen(true);
      } else if (output) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: output },
        ]);
      }

      checkLevelProgress();
    } catch (error: unknown) {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "error",
          text: error instanceof Error ? error.message : String(error),
        },
      ]);
    }
  }, [processor, checkLevelProgress]);

  const handleRebaseExecute = useCallback(async (
    plan: Array<{ action: string }>,
  ): Promise<void> => {
    setIsRebaseOpen(false);
    const hasSquash = plan.some((p) => p.action === "squash");

    if (hasSquash) {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: "Executing interactive rebase...\n✓ Commits squashed.\n✓ History rewritten successfully.",
        },
      ]);
      await git.reset("HEAD~3", "hard");
      await git.add("logic.sql");
      await git.commit(
        "feat: optimize revenue pipeline",
        profile?.name || "User",
      );
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Rebase completed with no changes to history." },
      ]);
    }
    checkLevelProgress();
  }, [git, profile?.name, checkLevelProgress]);

  const onPRApprove = useCallback(() => {
    setIsPROpen(false);
    setTerminalHistory((prev) => [
      ...prev,
      {
        type: "output",
        text: "✓ Dr. Hassan: 'Audit complete. Logic is sound. Merged to production registry.'",
      },
    ]);
    checkLevelProgress(true);
  }, [checkLevelProgress]);

  const onNextLevel = useCallback(() => {
    // Determine the max level ID available for the current role
    const maxLevelId = Math.max(...LEVELS.filter(l => l.role === "BOTH" || l.role === profile?.role).map(l => l.id));

    if (currentLevelId < maxLevelId) {
      setCurrentLevelId((prev) => prev + 1);
      setTerminalHistory([]);
    } else {
      router.push("/");
    }
  }, [currentLevelId, profile?.role, router]);

  const handleUserChatMessage = useCallback((text: string) => {
    const query = text.toLowerCase().trim();
    if (query === "help") {
      const hassanResponse = {
        id: Math.random().toString(36),
        sender: "HASSAN" as const,
        text: currentLevel?.helpMessage || "Objective is clear. Refer to your training if you are lost.",
        timestamp: new Date(),
      };
      setTimeout(() => {
        setExtraChatMessages((prev) => [...prev, hassanResponse]);
      }, 1000);
    } else {
      const hassanResponse = {
        id: Math.random().toString(36),
        sender: "HASSAN" as const,
        text: "Efficiency is key. Do not waste my time with non-technical queries.",
        timestamp: new Date(),
      };
      setTimeout(() => {
        setExtraChatMessages((prev) => [...prev, hassanResponse]);
      }, 800);
    }
  }, [currentLevel?.helpMessage]);

  const graphData = git.getGraph();

  return (
    <div className="flex h-screen bg-ink text-white overflow-hidden font-sans selection:bg-gh-blue selection:text-white">
      <div className="scanline opacity-40" />

      <DrHassanAdvisor
        advice={activeAdvice}
        onClose={() => setActiveAdvice(null)}
      />

      <TerminalSidebar
        profile={profile}
        currentLevel={currentLevel}
        completedGoalIds={completedGoalIds}
        graphData={graphData}
        currentBranch={git.getHead()}
        isLevelComplete={isLevelComplete}
        onNextLevel={onNextLevel}
        onAbort={() => router.push("/")}
      />

      <main className="w-[53%] p-10 flex flex-col relative overflow-hidden shrink-0 border-r border-white/10 grid-bg">
        <div className="absolute inset-0 pointer-events-none grid-bg opacity-30 shadow-inner" />
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto shadow-2xl rounded-[32px] overflow-hidden border border-white/5 bg-ink/20">
          {isPROpen ? (
            <PullRequestView
              title="Resolve revenue logic conflict"
              author={profile.name}
              description="Merged colleague's tax adjustment with our local US region filtering. All tests pass."
              diff=""
              onApprove={onPRApprove}
            />
          ) : isRebaseOpen ? (
            <RebaseView
              commits={git.getGraph().commits.slice(0, 3)}
              onExecute={handleRebaseExecute}
              onCancel={() => setIsRebaseOpen(false)}
            />
          ) : (
            <Terminal onCommand={handleCommand} history={terminalHistory} />
          )}
        </div>
      </main>

      <aside className="w-[25%] shrink-0 shadow-2xl">
        <DataPulseMessenger
          initialMessages={currentLevel.narrative}
          extraMessages={extraChatMessages}
          onSendMessage={handleUserChatMessage}
        />
      </aside>
    </div>
  );
}
