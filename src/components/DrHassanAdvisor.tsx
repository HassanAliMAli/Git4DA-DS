"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface DrHassanAdvisorProps {
  messages: string[];
  onComplete?: () => void;
  autoStart?: boolean;
}

export function DrHassanAdvisor({ 
  messages, 
  onComplete, 
  autoStart = true 
}: DrHassanAdvisorProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(autoStart);

  useEffect(() => {
    if (!hasStarted || currentMessageIndex >= messages.length) return;

    let currentIndex = 0;
    const fullText = messages[currentMessageIndex];
    setDisplayText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentMessageIndex, messages, hasStarted]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayText(messages[currentMessageIndex]);
      setIsTyping(false);
      return;
    }

    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  if (!hasStarted) return null;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-8 z-[100] max-w-md w-full"
    >
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sage to-violet opacity-20 group-hover:opacity-30 blur rounded-[20px] transition duration-500" />
        
        <div className="relative flex items-start gap-4 p-5 bg-ink-2/90 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-2xl">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner relative">
              <span className="font-mono text-[10px] leading-tight font-bold text-zinc-300 tracking-widest text-center uppercase">DR<br/>H</span>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-ink-2 shadow-sm" />
            </div>
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-sage uppercase tracking-[0.2em]">The Sage of DataPulse</span>
              {!isTyping && (
                <span className="text-[9px] font-mono text-zinc-500">{currentMessageIndex + 1}/{messages.length}</span>
              )}
            </div>
            
            <div className="text-[14px] leading-relaxed text-zinc-300 font-light min-h-[60px] italic">
              {displayText}
              {isTyping && (
                <span className="inline-block w-1.5 h-3.5 bg-sage ml-1 animate-pulse" />
              )}
            </div>

            {!isTyping && (
              <button 
                onClick={handleNext}
                className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white hover:bg-white/10 transition-colors uppercase tracking-widest ml-auto"
              >
                {currentMessageIndex === messages.length - 1 ? 'Acknowledge' : 'Continue'}
                <ChevronRight size={14} className="text-sage" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
