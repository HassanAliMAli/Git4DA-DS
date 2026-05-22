'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { FileSystem } from '@/models/FileSystem';
import { GitRepository } from '@/models/GitRepository';
import { CommandProcessor } from '@/models/CommandProcessor';
import { LEVELS } from '@/models/LevelManager';
import Terminal from '@/components/Terminal';
import DrHassanAdvisor from '@/components/DrHassanAdvisor';
import GitGraphVisualizer from '@/components/GitGraphVisualizer';
import styles from './TerminalPage.module.css';

export default function TerminalPage() {
  const { profile, isLoaded } = useProfile();
  
  // Game state
  const fs = useMemo(() => new FileSystem(), []);
  const git = useMemo(() => new GitRepository(fs), [fs]);
  
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'command' | 'output' | 'error'; text: string }[]>([]);
  const [completedGoalIds, setCompletedGoalIds] = useState<Set<string>>(new Set());
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  const currentLevel = LEVELS.find(l => l.id === currentLevelId);
  
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
    return <div className={styles.loading}>Connecting to DataPulse Secure Node...</div>;
  }

  const checkLevelProgress = () => {
    if (!currentLevel) return;

    const newlyCompleted = new Set<string>();
    currentLevel.goals.forEach(goal => {
      if (goal.check({ fs, git })) {
        newlyCompleted.add(goal.id);
      }
    });

    setCompletedGoalIds(newlyCompleted);

    if (newlyCompleted.size === currentLevel.goals.length && !isLevelComplete) {
      setIsLevelComplete(true);
      setTerminalHistory(prev => [
        ...prev, 
        { type: 'output', text: '\n✅ LEVEL COMPLETE: ' + currentLevel.title },
        { type: 'output', text: 'Dr. Hassan is impressed. Calibrating next simulation...\n' }
      ]);
    }
  };

  const handleCommand = async (command: string) => {
    setTerminalHistory(prev => [...prev, { type: 'command', text: command }]);
    
    try {
      const output = await processor.execute(command);
      
      if (output === 'CLEAR_TERMINAL') {
        setTerminalHistory([]);
      } else if (output) {
        setTerminalHistory(prev => [...prev, { type: 'output', text: output }]);
      }
      
      // Check for goal completion after every command
      checkLevelProgress();
    } catch (error: any) {
      setTerminalHistory(prev => [...prev, { type: 'error', text: error.message }]);
    }
  };

  const graphData = git.getGraph();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.levelInfo}>
          <span className={styles.levelLabel}>Level {currentLevel.id}</span>
          <h2 className={styles.levelTitle}>{currentLevel.title}</h2>
        </div>

        <div className={styles.goals}>
          <h3>Objectives</h3>
          <ul>
            {currentLevel.goals.map(goal => (
              <li key={goal.id} className={completedGoalIds.has(goal.id) ? styles.goalMet : ''}>
                {goal.description}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visualizer}>
          <GitGraphVisualizer 
            commits={graphData.commits} 
            branches={graphData.branches} 
            currentBranch={git.getHead()} 
          />
        </div>
      </aside>

      <main className={styles.main}>
        <Terminal onCommand={handleCommand} history={terminalHistory} />
      </main>

      <DrHassanAdvisor messages={currentLevel.narrative} />
    </div>
  );
}
