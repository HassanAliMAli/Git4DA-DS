import { useState, useEffect, useMemo, useCallback } from "react";
import { FileSystem } from "@/lib/vfs/FileSystem";
import { GitRepository } from "@/lib/git/GitRepository";
import { CommandProcessor } from "@/lib/git/CommandProcessor";
import { LEVELS } from "@/lib/narrative/LevelManager";
import { UserProfile } from "@/models/Profile";
import { useRouter } from "next/navigation";

export function useLevelEngine(profile: UserProfile | null, fs: FileSystem, git: GitRepository) {
  const router = useRouter();
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "command" | "output" | "error"; text: string | React.ReactNode }>
  >([]);
  const [completedGoalIds, setCompletedGoalIds] = useState<Set<string>>(new Set());
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isPROpen, setIsPROpen] = useState(false);
  const [isRebaseOpen, setIsRebaseOpen] = useState(false);
  const [extraChatMessages, setExtraChatMessages] = useState<any[]>([]);

  const currentLevel = useMemo(() => {
    return LEVELS.find(
      (l) => l.id === currentLevelId && (l.role === "BOTH" || l.role === profile?.role)
    );
  }, [currentLevelId, profile?.role]);

  const processor = useMemo(() => {
    if (!profile) return null;
    return new CommandProcessor(fs, git, profile.name);
  }, [fs, git, profile]);

  const checkLevelProgress = useCallback((prOpenedOverride?: boolean) => {
    if (!currentLevel) return;
    const newlyCompleted = new Set<string>();
    currentLevel.goals.forEach((goal) => {
      if (goal.check({ fs, git, prOpened: isPROpen || prOpenedOverride })) {
        newlyCompleted.add(goal.id);
      }
    });
    setCompletedGoalIds(newlyCompleted);
    if (newlyCompleted.size === currentLevel.goals.length && !isLevelComplete) {
      setIsLevelComplete(true);
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "✓ Mission Accomplished: " + currentLevel.title },
        { type: "output", text: "System: Audit logs finalized. Proceed when ready." }
      ]);
    }
  }, [currentLevel, fs, git, isPROpen, isLevelComplete]);

  useEffect(() => {
    if (currentLevel && fs) {
      currentLevel.setup({ fs, git }).then(() => {
        setIsLevelComplete(false);
        setIsPROpen(false);
        setCompletedGoalIds(new Set());
        setExtraChatMessages([]);
      });
    }
  }, [currentLevel, fs, git]);

  const onNextLevel = useCallback(() => {
    const availableLevels = LEVELS.filter(l => l.role === "BOTH" || l.role === profile?.role);
    const maxLevelId = Math.max(...availableLevels.map(l => l.id));
    if (currentLevelId < maxLevelId) {
      setCurrentLevelId(prev => prev + 1);
      setTerminalHistory([]);
    } else {
      router.push("/");
    }
  }, [currentLevelId, profile?.role, router]);

  return {
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
  };
}
