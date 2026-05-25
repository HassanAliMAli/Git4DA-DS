"use client";

import { useState, useMemo, useCallback } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { FileSystem } from "@/lib/vfs/FileSystem";
import { GitRepository } from "@/lib/git/GitRepository";
import { Terminal } from "@/components/Terminal";
import { DataPulseMessenger } from "@/components/DataPulseMessenger";
import { PullRequestView } from "@/components/PullRequestView";
import { RebaseView } from "@/components/RebaseView";
import { TerminalSidebar } from "@/components/features/TerminalSidebar";
import { DrHassanAdvisor } from "@/components/DrHassanAdvisor";
import { useRouter } from "next/navigation";
import { useLevelEngine } from "@/hooks/useLevelEngine";

export default function TerminalPage() {
  const router = useRouter();
  const { profile, isLoaded } = useProfile();

  const fs = useMemo(() => new FileSystem(), []);
  const git = useMemo(() => new GitRepository(fs), [fs]);

  const {
    currentLevel,
    processor,
    terminalHistory,
    setTerminalHistory,
    completedGoalIds,
    isLevelComplete,
    isPROpen,
    setIsPROpen,
    isRebaseOpen,
    setIsRebaseOpen,
    extraChatMessages,
    setExtraChatMessages,
    checkLevelProgress,
    onNextLevel
  } = useLevelEngine(profile, fs, git);

  const [activeAdvice, setActiveAdvice] = useState<string | null>(null);

  const handleCommand = useCallback(async (command: string) => {
    setTerminalHistory((prev) => [...prev, { type: "command", text: command }]);
    try {
      const output = await processor?.execute(command);
      if (output === "CLEAR_TERMINAL") setTerminalHistory([]);
      else if (output === "SIGNAL:OPEN_PR") {
        setIsPROpen(true);
        checkLevelProgress(true);
      } else if (output === "SIGNAL:OPEN_REBASE") setIsRebaseOpen(true);
      else if (output) setTerminalHistory((prev) => [...prev, { type: "output", text: output }]);
      checkLevelProgress();
    } catch (e: any) {
      setTerminalHistory((prev) => [...prev, { type: "error", text: e.message || String(e) }]);
    }
  }, [processor, setIsPROpen, checkLevelProgress, setTerminalHistory, setIsRebaseOpen]);

  const handleRebaseExecute = useCallback(async (plan: any[]): Promise<void> => {
    setIsRebaseOpen(false);
    if (plan.some((p) => p.action === "squash")) {
      setTerminalHistory((prev) => [...prev, { type: "output", text: "✓ History rewritten successfully." }]);
      await git.reset("HEAD~3", "hard");
      await git.add("logic.sql");
      await git.commit("feat: optimized logic", profile?.name || "User");
    }
    checkLevelProgress();
  }, [git, profile?.name, checkLevelProgress, setTerminalHistory, setIsRebaseOpen]);

  const handleUserChatMessage = useCallback((text: string) => {
    const query = text.toLowerCase().trim();
    const sender = "HASSAN" as const;
    const msg = query === "help" ? (currentLevel?.helpMessage || "Refer to your training.") : "Efficiency is key.";
    setTimeout(() => setExtraChatMessages((prev) => [...prev, { id: Math.random().toString(36), sender, text: msg, timestamp: new Date() }]), 800);
  }, [currentLevel, setExtraChatMessages]);

  if (!isLoaded || !profile || !currentLevel || !processor) return <div className="h-screen bg-ink flex items-center justify-center text-white italic font-bold">Synchronizing Secure Node...</div>;

  return (
    <div className="flex h-screen bg-ink text-white overflow-hidden font-sans selection:bg-gh-blue selection:text-white">
      <div className="scanline opacity-40" />
      <DrHassanAdvisor advice={activeAdvice} onClose={() => setActiveAdvice(null)} />
      <TerminalSidebar profile={profile} currentLevel={currentLevel} completedGoalIds={completedGoalIds} graphData={git.getGraph()} currentBranch={git.getHead()} isLevelComplete={isLevelComplete} onNextLevel={onNextLevel} onAbort={() => router.push("/")} />
      <main className="w-[53%] p-10 flex flex-col relative border-r border-white/10 grid-bg">
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto shadow-2xl rounded-[32px] overflow-hidden border border-white/5 bg-ink/20">
          {isPROpen ? <PullRequestView title="Resolve revenue logic conflict" author={profile.name} description="Audit pending." diff="" onApprove={() => { setIsPROpen(false); checkLevelProgress(true); }} /> : isRebaseOpen ? <RebaseView commits={git.getGraph().commits.slice(0, 3)} onExecute={handleRebaseExecute} onCancel={() => setIsRebaseOpen(false)} /> : <Terminal onCommand={handleCommand} history={terminalHistory} />}
        </div>
      </main>
      <aside className="w-[25%] shrink-0 shadow-2xl">
        <DataPulseMessenger initialMessages={currentLevel.narrative} extraMessages={extraChatMessages} onSendMessage={handleUserChatMessage} />
      </aside>
    </div>
  );
}
