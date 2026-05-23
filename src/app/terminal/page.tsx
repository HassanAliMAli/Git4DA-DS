"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/contexts/ProfileContext';
import { FileSystem } from '@/models/FileSystem';
import { GitRepository } from '@/models/GitRepository';
import { CommandProcessor } from '@/models/CommandProcessor';
import { LEVELS } from '@/models/LevelManager';
import { Terminal } from '@/components/Terminal';
import { DrHassanAdvisor } from '@/components/DrHassanAdvisor';
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
      <div className="h-screen w-full flex items-center justify-center bg-ink">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-sage/20 border-t-sage rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] animate-pulse italic">Synchronizing Secure Node...</span>
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
        { type: 'output', text: <div className="text-emerald-400 font-bold border-y border-emerald-400/20 py-2 my-4 italic uppercase tracking-widest text-center bg-emerald-400/5">✓ Mission Accomplished: {currentLevel.title}</div> },
        { type: 'output', text: <span className="italic text-zinc-500">Dr. Hassan: "Adequate precision. Your work is logged. Prepare for the next audit."</span> }
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

  const graphData = git.getGraph();

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

  return (
    <div className="flex flex-col h-screen bg-ink text-zinc-100 overflow-hidden font-sans selection:bg-sage/30 selection:text-white">
      {/* Top Header */}
      <header className="h-14 border-b border-white/5 bg-ink-2/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/')}
            className="group flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort Mission
          </button>
          <div className="w-px h-6 bg-white/5" />
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sage to-violet flex items-center justify-center shadow-glow">
              <span className="font-mono font-bold text-[10px] text-white tracking-widest">G4D</span>
            </div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] italic">DataPulse • Lab • v2.4.1</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold text-white uppercase tracking-wider italic leading-none mb-1">{profile.name}</div>
              <div className="text-[9px] font-mono text-sage uppercase tracking-tighter italic">{profile.role.replace('_', ' ')}</div>
            </div>
            <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{profile.name.substring(0, 2)}</span>
            </div>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 leading-none">XP ARCHIVED</span>
              <span className="text-xs font-mono text-zinc-300 font-bold leading-none">{profile.xp}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ink-3 border border-white/5 flex flex-col items-center justify-center shadow-inner">
               <span className="text-[8px] font-bold text-zinc-500 uppercase leading-none mb-1">LVL</span>
               <span className="text-sm font-mono text-white font-bold leading-none">{profile.level}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden grid grid-cols-12 relative">
        {/* Left: Intelligence Sidebar */}
        <div className="col-span-12 lg:col-span-4 border-r border-white/5 bg-ink-2/30 backdrop-blur-md flex flex-col overflow-hidden p-8 space-y-8">
           {/* Mission Brief */}
           <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage shadow-glow">
                  <Target size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sage uppercase tracking-[0.2em]">Assignment {currentLevel.id}</span>
                  <h1 className="text-xl font-bold text-white tracking-tight italic">{currentLevel.title}</h1>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Objectives</h3>
                  <div className="h-px flex-1 bg-white/5 mx-4" />
                  <span className="text-[9px] font-mono text-zinc-600 italic font-bold uppercase">{completedGoalIds.size}/{currentLevel.goals.length}</span>
                </div>
                
                <ul className="space-y-3">
                  {currentLevel.goals.map(goal => (
                    <motion.li 
                      key={goal.id}
                      initial={false}
                      animate={{ scale: completedGoalIds.has(goal.id) ? 1 : 0.98 }}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                        completedGoalIds.has(goal.id) 
                          ? 'bg-sage/10 border-sage/30 text-zinc-100 shadow-glow' 
                          : 'bg-white/5 border-white/5 text-zinc-500 opacity-60'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        completedGoalIds.has(goal.id) ? 'bg-sage border-sage text-ink' : 'border-zinc-800'
                      }`}>
                        {completedGoalIds.has(goal.id) && <Shield size={10} strokeWidth={3} />}
                      </div>
                      <span className="text-[13px] leading-relaxed font-light italic">
                        {goal.description}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {isLevelComplete && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onNextLevel}
                    className="w-full h-12 mt-6 rounded-xl bg-white text-ink font-bold text-[12px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-glow"
                  >
                    Proceed to Mission {currentLevelId + 1}
                    <ChevronRight size={14} />
                  </motion.button>
                )}
              </div>
           </div>

           {/* Live Lineage */}
           <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Live Lineage</h3>
                <div className="h-px flex-1 bg-white/5 mx-4" />
                <Activity size={12} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-terminal border border-white/5 bg-ink/40">
                <GitGraphVisualizer 
                  commits={graphData.commits} 
                  branches={graphData.branches} 
                  currentBranch={git.getHead()} 
                />
              </div>
           </div>

           {/* Node Status */}
           <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest italic">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                Encrypted Connection
              </div>
              <div>Node: lab-us-east-1</div>
           </div>
        </div>

        {/* Right: Terminal Environment */}
        <div className="col-span-12 lg:col-span-8 p-10 flex flex-col bg-grid relative overflow-hidden">
           {/* Grid Background Overlay */}
           <div className="absolute inset-0 pointer-events-none grid-bg opacity-30" />
           
           <div className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto w-full">
              <Terminal onCommand={handleCommand} history={terminalHistory} />
           </div>

           {/* Dr. Hassan Insight */}
           <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-ink-2/60 border border-white/5 backdrop-blur text-[10px] text-zinc-400 italic">
                <Lock size={12} className="text-amber-500" />
                <span className="uppercase tracking-widest font-bold text-zinc-500 not-italic mr-2">Audit Policy:</span>
                Signed commits required for production merge. Unverified data will be purged.
              </div>
           </div>
        </div>
      </main>

      <DrHassanAdvisor messages={currentLevel.narrative} />
    </div>
  );
}
