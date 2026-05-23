"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/contexts/ProfileContext';
import { FileSystem } from '@/models/FileSystem';
import { GitRepository } from '@/models/GitRepository';
import { CommandProcessor } from '@/models/CommandProcessor';
import { LEVELS } from '@/models/LevelManager';
import { Terminal } from '@/components/Terminal';
import { DataPulseMessenger } from '@/components/DataPulseMessenger';
import { GitGraphVisualizer } from '@/components/GitGraphVisualizer';
import { 
  Target, 
  Shield, 
  ChevronRight, 
  Activity, 
  Database,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TerminalPage() {
  const router = useRouter();
  const { profile, isLoaded } = useProfile();
  
  // Simulation state
  const fs = useMemo(() => new FileSystem(), []);
  const git = useMemo(() => new GitRepository(fs), [fs]);
  
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [terminalHistory, setTerminalHistory] = useState<Array<{type: 'command' | 'output' | 'error', text: string | React.ReactNode}>>([]);
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
    return (
      <div className="h-screen w-full flex items-center justify-center bg-ink text-gh-text">
        <div className="flex flex-col items-center gap-4 text-center p-8">
           <div className="w-12 h-12 border-2 border-gh-blue/20 border-t-gh-blue rounded-full animate-spin mb-4" />
           <h2 className="text-xl font-bold tracking-tight italic">Synchronizing Secure Node...</h2>
           <p className="text-gh-text-sec font-mono text-[10px] uppercase tracking-widest max-w-xs leading-relaxed">
             Establishing encrypted tunnel to DataPulse HQ. Verifying audit credentials.
           </p>
        </div>
      </div>
    );
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
        { type: 'output', text: <div className="text-gh-green font-bold border-y border-gh-green/20 py-2 my-4 italic uppercase tracking-widest text-center bg-gh-green/5">✓ Mission Accomplished: {currentLevel.title}</div> },
        { type: 'output', text: <span className="italic text-gh-text-sec">System: Audit logs finalized. Proceed when ready.</span> }
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
      
      checkLevelProgress();
    } catch (error: any) {
      setTerminalHistory(prev => [...prev, { type: 'error', text: error.message }]);
    }
  };

  const onNextLevel = () => {
    if (currentLevelId < LEVELS.length) {
      setCurrentLevelId(prev => prev + 1);
      setIsLevelComplete(false);
      setCompletedGoalIds(new Set());
      setTerminalHistory([]);
    } else {
      router.push('/');
    }
  };

  const graphData = git.getGraph();

  return (
    <div className="flex h-screen bg-ink text-zinc-100 overflow-hidden font-sans selection:bg-gh-blue/30 selection:text-white">
      <div className="scanline" />
      {/* 
        LEFT PANE: Intelligence (22%)

      */}
      <aside className="w-[22%] border-r border-white/5 bg-ink-2/50 backdrop-blur-md flex flex-col overflow-hidden shrink-0">
         <div className="p-6 h-full flex flex-col space-y-8 overflow-y-auto scrollbar-hide">
            <header className="flex items-center justify-between mb-2">
              <button 
                onClick={() => router.push('/')}
                className="group flex items-center gap-2 text-[9px] font-bold text-gh-text-sec uppercase tracking-widest hover:text-gh-text transition-colors italic"
              >
                <ArrowLeft size={12} />
                Abort
              </button>
              <div className="text-[10px] font-mono text-gh-blue italic font-bold">Node-v2.4</div>
            </header>

            {/* Profile Brief */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4 shadow-inner">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-gh-text-sec">
                 {profile.name.substring(0, 2).toUpperCase()}
               </div>
               <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate uppercase tracking-wider italic">{profile.name}</div>
                  <div className="text-[9px] font-mono text-gh-blue uppercase tracking-tighter italic font-bold">{profile.role.replace('_', ' ')}</div>
               </div>
            </div>

            {/* Mission Intel */}
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gh-blue/10 border border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow">
                  <Target size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gh-blue uppercase tracking-[0.2em] italic">Assignment {currentLevel.id}</span>
                  <h2 className="text-sm font-bold text-white tracking-tight italic">{currentLevel.title}</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gh-text-sec uppercase tracking-[0.3em] italic">Objectives</h3>
                  <span className="text-[9px] font-mono text-zinc-600 italic font-bold">{completedGoalIds.size}/{currentLevel.goals.length}</span>
                </div>
                
                <ul className="space-y-2.5">
                  {currentLevel.goals.map(goal => (
                    <li key={goal.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${
                      completedGoalIds.has(goal.id) 
                        ? 'bg-gh-green/10 border-gh-green/30 text-zinc-100 shadow-sm' 
                        : 'bg-white/[0.01] border-white/5 text-zinc-600 opacity-60'
                    }`}>
                      <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        completedGoalIds.has(goal.id) ? 'bg-gh-green border-gh-green text-white' : 'border-zinc-800'
                      }`}>
                        {completedGoalIds.has(goal.id) && <Shield size={8} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-relaxed font-light italic">
                        {goal.description}
                      </span>
                    </li>
                  ))}
                </ul>

                {isLevelComplete && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onNextLevel}
                    className="w-full h-11 rounded-xl bg-gh-blue text-white font-bold text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-glow italic"
                  >
                    Next Mission
                    <ChevronRight size={12} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Git Graph Visualizer */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4 text-left">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gh-text-sec uppercase tracking-[0.3em] italic">Live Lineage</h3>
                  <Activity size={10} className="text-gh-green animate-pulse" />
               </div>
               <div className="flex-1 min-h-[150px] rounded-2xl overflow-hidden border border-white/5 bg-ink shadow-inner">
                  <GitGraphVisualizer 
                    commits={graphData.commits} 
                    branches={graphData.branches} 
                    currentBranch={git.getHead()} 
                  />
               </div>
            </div>
         </div>
      </aside>

      {/* 
        CENTER PANE: The Forge (53%)
      */}
      <main className="w-[53%] p-8 flex flex-col bg-grid relative overflow-hidden shrink-0 border-r border-white/5">
         <div className="absolute inset-0 pointer-events-none grid-bg opacity-20" />
         
         <div className="relative z-10 flex-1 flex flex-col w-full mx-auto">
            <Terminal onCommand={handleCommand} history={terminalHistory} />
         </div>

         {/* Bottom Security Info */}
         <div className="mt-8 flex justify-center shrink-0">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-ink-2 border border-white/5 backdrop-blur text-[9px] text-zinc-600 italic uppercase tracking-widest font-bold">
              <Lock size={10} className="text-gh-warn opacity-50" />
              Production Integrity: <span className="text-gh-green font-black ml-1">Verified</span>
            </div>
         </div>
      </main>

      {/* 
        RIGHT PANE: DataPulse Messenger (25%)
      */}
      <aside className="w-[25%] shrink-0">
         <DataPulseMessenger messages={currentLevel.narrative} />
      </aside>
    </div>
  );
}
