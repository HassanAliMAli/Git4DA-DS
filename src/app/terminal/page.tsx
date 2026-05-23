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
import { PullRequestView } from '@/components/PullRequestView';
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
  const [isPROpen, setIsPROpen] = useState(false);
  
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
        <div className="flex flex-col items-center gap-4 text-center p-8 text-white font-bold italic">
           <div className="w-12 h-12 border-2 border-gh-blue/20 border-t-gh-blue rounded-full animate-spin mb-4" />
           <h2 className="text-xl font-bold tracking-tight italic">Synchronizing Secure Node...</h2>
           <p className="text-white font-mono text-[10px] uppercase tracking-widest max-w-xs leading-relaxed opacity-70">
             Establishing encrypted tunnel to DataPulse HQ. Verifying audit credentials.
           </p>
        </div>
      </div>
    );
  }

  const checkLevelProgress = (prOpenedOverride?: boolean) => {
    if (!currentLevel) return;

    const newlyCompleted = new Set<string>();
    currentLevel.goals.forEach(goal => {
      const state = { fs, git, prOpened: isPROpen || prOpenedOverride };
      if (goal.check(state)) {
        newlyCompleted.add(goal.id);
      }
    });

    setCompletedGoalIds(newlyCompleted);

    if (newlyCompleted.size === currentLevel.goals.length && !isLevelComplete) {
      setIsLevelComplete(true);
      setTerminalHistory(prev => [
        ...prev, 
        { type: 'output', text: <div className="text-gh-green font-black border-y-2 border-gh-green/20 py-3 my-4 italic uppercase tracking-[0.2em] text-center bg-gh-green/5 shadow-glow">✓ Mission Accomplished: {currentLevel.title}</div> },
        { type: 'output', text: <span className="italic text-white font-bold">System: Audit logs finalized. Proceed when ready.</span> }
      ]);
    }
  };

  const handleCommand = async (command: string) => {
    setTerminalHistory(prev => [...prev, { type: 'command', text: command }]);
    
    try {
      const output = await processor.execute(command);
      
      if (output === 'CLEAR_TERMINAL') {
        setTerminalHistory([]);
      } else if (output === 'SIGNAL:OPEN_PR') {
        setIsPROpen(true);
        checkLevelProgress(true);
      } else if (output) {
        setTerminalHistory(prev => [...prev, { type: 'output', text: output }]);
      }
      
      checkLevelProgress();
    } catch (error: any) {
      setTerminalHistory(prev => [...prev, { type: 'error', text: error.message }]);
    }
  };

  const onPRApprove = () => {
    setIsPROpen(false);
    setTerminalHistory(prev => [...prev, { type: 'output', text: "✓ Dr. Hassan: 'Audit complete. Logic is sound. Merged to production registry.'" }]);
    checkLevelProgress(true);
  };

  const onNextLevel = () => {
    if (currentLevelId < LEVELS.length) {
      setCurrentLevelId(prev => prev + 1);
      setIsLevelComplete(false);
      setIsPROpen(false);
      setCompletedGoalIds(new Set());
      setTerminalHistory([]);
    } else {
      router.push('/');
    }
  };

  const graphData = git.getGraph();

  return (
    <div className="flex h-screen bg-ink text-white overflow-hidden font-sans selection:bg-gh-blue selection:text-white">
      <div className="scanline opacity-40" />
      {/* 
        LEFT PANE: Intelligence (22%)
      */}
      <aside className="w-[22%] border-r border-white/10 bg-ink-2/60 backdrop-blur-3xl flex flex-col overflow-hidden shrink-0">
         <div className="p-8 h-full flex flex-col space-y-10 overflow-y-auto scrollbar-hide text-left">
            <header className="flex items-center justify-between mb-2">
              <button 
                onClick={() => router.push('/')}
                className="group flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-gh-blue transition-colors italic underline decoration-white/10"
              >
                <ArrowLeft size={14} />
                Abort Mission
              </button>
              <div className="text-[10px] font-mono text-gh-blue italic font-black uppercase tracking-widest underline decoration-gh-blue/20">Node-v2.4</div>
            </header>

            {/* Profile Brief */}
            <div className="bg-white/5 rounded-[24px] p-5 border-2 border-white/5 flex items-center gap-5 shadow-2xl">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center text-sm font-black text-white shadow-inner">
                 {profile.name.substring(0, 2).toUpperCase()}
               </div>
               <div className="min-w-0">
                  <div className="text-[13px] font-black text-white truncate uppercase tracking-widest italic leading-tight mb-1">{profile.name}</div>
                  <div className="text-[9px] font-mono text-gh-blue uppercase tracking-tighter italic font-black underline decoration-gh-blue/20">{profile.role.replace('_', ' ')}</div>
               </div>
            </div>

            {/* Mission Intel */}
            <div className="space-y-8 text-left">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gh-blue/10 border-2 border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow shrink-0">
                  <Target size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gh-blue uppercase tracking-[0.3em] italic mb-1 block">Assignment {currentLevel.id}</span>
                  <h2 className="text-lg font-black text-white tracking-tighter italic uppercase underline decoration-white/5 underline-offset-4">{currentLevel.title}</h2>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic opacity-80">Objectives</h3>
                  <span className="text-[10px] font-mono text-gh-blue italic font-black bg-gh-blue/5 px-2 py-0.5 rounded shadow-glow">{completedGoalIds.size}/{currentLevel.goals.length}</span>
                </div>
                
                <ul className="space-y-3">
                  {currentLevel.goals.map(goal => (
                    <li key={goal.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-500 shadow-xl ${
                      completedGoalIds.has(goal.id) 
                        ? 'bg-gh-green/10 border-gh-green/30 text-white' 
                        : 'bg-white/[0.04] border-white/5 text-zinc-100'
                    }`}>
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        completedGoalIds.has(goal.id) ? 'bg-gh-green border-gh-green text-white shadow-glow' : 'border-zinc-700'
                      }`}>
                        {completedGoalIds.has(goal.id) && <Shield size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[12px] leading-relaxed font-black italic tracking-tight">
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
                    className="w-full h-14 rounded-2xl bg-white text-ink font-black text-[13px] uppercase tracking-[0.4em] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-glow italic mt-8 border-2 border-white/20"
                  >
                    Next Mission
                    <ChevronRight size={16} className="text-gh-blue" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Git Graph Visualizer */}
            <div className="flex-1 flex flex-col min-h-0 space-y-6 text-left">
               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic opacity-80">Live Lineage</h3>
                  <Activity size={14} className="text-gh-green animate-pulse shadow-glow" />
               </div>
               <div className="flex-1 min-h-[180px] rounded-[32px] overflow-hidden border-2 border-white/5 bg-ink/60 shadow-2xl shadow-inner">
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
            ) : (
              <Terminal onCommand={handleCommand} history={terminalHistory} />
            )}
         </div>

         {/* Bottom Security Info */}
         <div className="mt-10 flex justify-center shrink-0">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-ink-2 border-2 border-white/10 backdrop-blur-2xl text-[11px] text-white italic uppercase tracking-[0.4em] font-black shadow-glow shadow-gh-blue/5">
              <Lock size={12} className="text-gh-warn animate-pulse" />
              Production Integrity: <span className="text-gh-green font-black ml-1 underline decoration-gh-green/20 underline-offset-4">Verified</span>
            </div>
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
