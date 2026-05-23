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
    if (currentMessageIndex >= messages.length) return;

    const startTyping = async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const fullText = messages[currentMessageIndex];
      let charIndex = 0;
      setCurrentText('');

      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
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
      }, 25);

      return () => clearInterval(typingInterval);
    };

    startTyping();
  }, [currentMessageIndex, messages]);

  return (
    <div className="flex flex-col h-full bg-ink-2/50 backdrop-blur-xl border-l border-gh-border font-sans relative">
      {/* Header (Professional Dashboard Style) */}
      <div className="px-6 py-5 bg-ink-3 border-b border-gh-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden group">
              <span className="font-mono text-[10px] font-black text-gh-blue tracking-widest italic">DRH</span>
              <div className="absolute inset-0 bg-gh-blue/5 group-hover:bg-gh-blue/10 transition-colors" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gh-green border-2 border-ink shadow-sm" />
          </div>
          <div>
            <div className="text-[14px] font-black text-white leading-tight italic tracking-tight">Dr. Hassan</div>
            <div className="text-[9px] text-gh-blue font-bold uppercase tracking-[0.2em] mt-0.5 italic">Head of Data • Online</div>
          </div>
        </div>
        <div className="flex items-center gap-5 text-zinc-600">
          <Video size={18} className="cursor-not-allowed opacity-20" />
          <Phone size={17} className="cursor-not-allowed opacity-20" />
          <MoreVertical size={18} className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Security Status */}
      <div className="px-5 py-2.5 bg-gh-blue/5 border-b border-gh-border flex items-center justify-center gap-3">
        <ShieldCheck size={14} className="text-gh-blue/60 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black italic">
          Audit-Verified Encrypted Link
        </span>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-left"
      >
        <AnimatePresence initial={false}>
          {displayedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={`flex ${msg.sender === 'HASSAN' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-xl italic ${
                msg.sender === 'HASSAN' 
                  ? 'bg-ink-3/80 text-gh-text rounded-tl-none border border-white/5 font-light border-l-gh-blue border-l-2' 
                  : 'bg-gh-blue text-white rounded-tr-none font-bold'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-2 text-right opacity-60 font-mono italic font-black`}>
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
            <div className="max-w-[90%] p-4 rounded-2xl rounded-tl-none bg-ink-3/40 text-gh-text-sec text-[13px] leading-relaxed border border-white/5 italic font-light">
              {currentText}
              <span className="inline-block w-1.5 h-3.5 bg-gh-blue ml-1 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Placeholder */}
      <div className="p-6 bg-ink border-t border-gh-border">
        <div className="flex items-center gap-4 bg-ink-3 rounded-2xl px-5 py-4 border border-white/5 opacity-40 cursor-not-allowed group">
          <div className="flex-1 text-zinc-500 text-xs italic font-bold uppercase tracking-widest">
             Awaiting system acknowledgement...
          </div>
          <Send size={18} className="text-zinc-600" />
        </div>
      </div>
    </div>
  );
}
