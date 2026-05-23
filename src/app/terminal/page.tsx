"use client";

import React, { useState, useEffect, useMemo } from "react";
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
 *
 * ARCHITECTURAL PHILOSOPHY:
 * This component acts as the "Motherboard" of the Git4Data simulation.
 * It is responsible for instantiating the core engines (VFS, GitRepository, CommandProcessor)
 * and mounting them into the React lifecycle using `useMemo`.
 *
 * Data Flow:
 * 1. The user inputs a command in the `<Terminal>` component.
 * 2. `TerminalPage` intercepts this and passes it to the `CommandProcessor`.
 * 3. The `CommandProcessor` executes the logic against the `GitRepository`/`FileSystem` instances.
 * 4. The execution output is returned and appended to the `terminalHistory` state.
 * 5. `checkLevelProgress()` is triggered, reading the mutated VFS to see if narrative goals are met.
 * 6. The UI automatically reflects changes (e.g., updating the GitGraph Visualizer).
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

  const currentLevel = LEVELS.find(
    (l) =>
      l.id === currentLevelId &&
      (l.role === "BOTH" || l.role === profile?.role),
  );

  const processor = useMemo(() => {
    if (!profile) return null;
    return new CommandProcessor(fs, git, profile.name);
  }, [fs, git, profile]);

  useEffect(() => {
    if (currentLevel && fs) {
      currentLevel.setup({ fs, git });
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

  const handleCommand = async (command: string) => {
    setTerminalHistory((prev) => [...prev, { type: "command", text: command }]);

    try {
      const output = await processor.execute(command);

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
  };

  const handleRebaseExecute = async (
    plan: Array<{ action: string }>,
  ): Promise<void> => {
    setIsRebaseOpen(false);

    // Simulate the rebase outcome
    const hasSquash = plan.some((p) => p.action === "squash");

    if (hasSquash) {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: "Executing interactive rebase...\n✓ Commits squashed.\n✓ History rewritten successfully.",
        },
      ]);

      // Technically rewrite the DAG for validation
      await git.reset("HEAD~3", "hard");
      await git.add("logic.sql");
      await git.commit(
        "feat: optimize revenue pipeline",
        profile?.name || "User",
      );
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: "Rebase completed with no changes to history.",
        },
      ]);
    }

    checkLevelProgress();
  };

  const onPRApprove = () => {
    setIsPROpen(false);
    setTerminalHistory((prev) => [
      ...prev,
      {
        type: "output",
        text: "✓ Dr. Hassan: 'Audit complete. Logic is sound. Merged to production registry.'",
      },
    ]);
    checkLevelProgress(true);
  };

  const onNextLevel = () => {
    if (currentLevelId < LEVELS.length) {
      setCurrentLevelId((prev) => prev + 1);
      setIsLevelComplete(false);
      setIsPROpen(false);
      setCompletedGoalIds(new Set());
      setTerminalHistory([]);
    } else {
      router.push("/");
    }
  };

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

      {/* 
        CENTER PANE: The Forge (53%)
      */}
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

      {/* 
        RIGHT PANE: DataPulse Messenger (25%)
      */}
      <aside className="w-[25%] shrink-0 shadow-2xl">
        <DataPulseMessenger messages={currentLevel.narrative} />
      </aside>
    </div>
  );
}
