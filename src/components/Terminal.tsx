"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ChevronRight } from "lucide-react";

interface TerminalProps {
  onCommand: (command: string) => Promise<void>;
  history: Array<{
    type: "command" | "output" | "error";
    text: string | React.ReactNode;
  }>;
}

export function Terminal({ onCommand, history }: TerminalProps) {
  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (): void => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input;
    setInput("");
    await onCommand(cmd);
  };

  return (
    <div
      className="flex flex-col h-full bg-ink-2 border border-gh-border rounded-2xl overflow-hidden shadow-terminal min-h-[500px]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-ink-3 border-b border-gh-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-gh-warn/20 border border-gh-warn/40" />
            <div className="w-3 h-3 rounded-full bg-gh-green/20 border border-gh-green/40" />
          </div>
          <div className="ml-5 flex items-center gap-2 text-[10px] font-mono text-gh-text-sec uppercase tracking-[0.2em] font-bold italic">
            <TerminalIcon size={14} className="text-gh-blue" />
            DataPulse • Secure Shell • node-v2.4
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 font-bold italic uppercase tracking-tighter">
          Verified Connection
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-8 overflow-y-auto font-mono text-[14px] leading-relaxed scrollbar-hide text-left">
        <div className="space-y-3">
          {history.map((entry, idx) => (
            <div
              key={idx}
              className={
                entry.type === "command"
                  ? "text-white"
                  : entry.type === "error"
                    ? "text-gh-danger"
                    : "text-white opacity-90"
              }
            >
              {entry.type === "command" && (
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-gh-blue font-black italic">❯</span>
                  <span className="font-bold italic">{entry.text}</span>
                </div>
              )}
              {entry.type !== "command" && (
                <div className="whitespace-pre-wrap pl-6 font-medium border-l border-white/10 ml-1">
                  {entry.text}
                </div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="px-8 py-5 bg-ink border-t border-gh-border flex items-center gap-3"
      >
        <span className="text-gh-blue font-black italic text-[15px]">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[14px] placeholder:text-zinc-500 italic font-bold"
          placeholder="git init — initialize your registry"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <ChevronRight size={16} className="text-zinc-500" />
      </form>
    </div>
  );
}
