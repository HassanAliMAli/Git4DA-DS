"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Phone, Video, ShieldCheck, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'HASSAN' | 'USER';
  text: string;
  timestamp: Date;
}

interface DataPulseMessengerProps {
  messages: string[];
  onComplete?: () => void;
}

export function DataPulseMessenger({ messages, onComplete }: DataPulseMessengerProps) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedMessages, isTyping, currentText]);

  // Handle Hassan's typing sequence
  useEffect(() => {
    if (currentMessageIndex >= messages.length) {
      if (onComplete && displayedMessages.length === messages.length) {
         // All messages displayed
      }
      return;
    }

    const startTyping = async () => {
      setIsTyping(true);
      // Simulate "Thinking" delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fullText = messages[currentMessageIndex];
      let charIndex = 0;
      setCurrentText('');

      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          // Fix: Ensure we don't append undefined by checking charIndex again
          const char = fullText.charAt(charIndex);
          if (char !== undefined) {
            setCurrentText(prev => prev + char);
          }
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setDisplayedMessages(prev => [...prev, {
            id: Math.random().toString(36),
            sender: 'HASSAN',
            text: fullText,
            timestamp: new Date()
          }]);
          setCurrentText('');
          setCurrentMessageIndex(prev => prev + 1);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    };

    startTyping();
  }, [currentMessageIndex, messages]);

  return (
    <div className="flex flex-col h-full bg-ink-2/40 backdrop-blur-xl border-l border-white/5 font-sans relative">
      {/* Header (WhatsApp Style) */}
      <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
              <span className="font-mono text-[10px] font-bold text-zinc-300 tracking-widest">DRH</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-ink-2 shadow-sm" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white leading-tight">Dr. Hassan</div>
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Online • Sage Node</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <Video size={18} className="cursor-not-allowed opacity-30" />
          <Phone size={17} className="cursor-not-allowed opacity-30" />
          <MoreVertical size={18} className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Security Banner */}
      <div className="px-4 py-2 bg-amber-500/5 border-b border-white/5 flex items-center justify-center gap-2">
        <ShieldCheck size={12} className="text-amber-500" />
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter italic">
          Messages are end-to-end encrypted for audit safety
        </span>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {displayedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'HASSAN' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                msg.sender === 'HASSAN' 
                  ? 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-white/5' 
                  : 'bg-sage text-white rounded-tr-none'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-1.5 text-right opacity-50 font-mono italic`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live Typing Animation */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-zinc-800/40 text-zinc-400 text-[13px] leading-relaxed border border-white/5 italic">
              {currentText}
              <span className="inline-block w-1 h-3 bg-sage ml-1 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area (Fake for simulation) */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="flex items-center gap-3 bg-ink-3/60 rounded-xl px-4 py-3 border border-white/5 opacity-50">
          <div className="flex-1 text-zinc-600 text-xs italic">Awaiting technical output...</div>
          <Send size={16} className="text-zinc-700" />
        </div>
      </div>
    </div>
  );
}
