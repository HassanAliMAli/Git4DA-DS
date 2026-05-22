"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface TerminalProps {
  onCommand: (command: string) => Promise<void>;
  history: Array<{ type: 'command' | 'output' | 'error', text: string | React.ReactNode }>;
}

export function Terminal({ onCommand, history }: TerminalProps) {
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input;
    setInput('');
    await onCommand(cmd);
  };

  return (
    <div 
      className="flex flex-col h-full bg-ink-2/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-terminal min-h-[500px]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <div className="ml-4 flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            <TerminalIcon size={12} className="text-sage" />
            DataPulse • Secure Node • zsh
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-600">v2.4.1-main</div>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-6 overflow-y-auto font-mono text-[13px] leading-relaxed scrollbar-hide text-left">
        <div className="space-y-2">
          {history.map((entry, idx) => (
            <div key={idx} className={
              entry.type === 'command' ? 'text-white' : 
              entry.type === 'error' ? 'text-red-400' : 'text-zinc-400'
            }>
              {entry.type === 'command' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sage font-bold">$</span>
                  <span className="font-semibold italic">{entry.text}</span>
                </div>
              )}
              {entry.type !== 'command' && (
                <div className="whitespace-pre-wrap pl-5 font-light">{entry.text}</div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-2">
        <span className="text-sage font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[13px] placeholder:text-zinc-700 italic"
          placeholder="Enter command..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <ChevronRight size={14} className="text-zinc-700" />
      </form>
    </div>
  );
}
