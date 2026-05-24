"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreVertical, Phone, Video, ShieldCheck } from "lucide-react";
import Image from "next/image";

export interface ChatMessage {
  id: string;
  sender: "HASSAN" | "USER";
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface DataPulseMessengerProps {
  initialMessages: string[];
  onSendMessage?: (text: string) => void;
  extraMessages?: ChatMessage[];
}

export function DataPulseMessenger({ 
  initialMessages, 
  onSendMessage,
  extraMessages = [] 
}: DataPulseMessengerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNarrativeIndex, setCurrentNarrativeIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to track the last handled level/messages array
  const initialMessagesRef = useRef<string[]>([]);

  // Robust Level Reset
  useEffect(() => {
    // If the narrative array reference actually changed, it's a new level
    if (initialMessagesRef.current !== initialMessages) {
      initialMessagesRef.current = initialMessages;
      setMessages([]);
      setCurrentNarrativeIndex(0);
      setIsTyping(false);
      setCurrentStreamingText("");
    }
  }, [initialMessages]);

  // High-Fidelity Typing Engine
  useEffect(() => {
    // Stop if we've typed all messages or are already typing
    if (currentNarrativeIndex >= initialMessages.length || isTyping) return;

    let isMounted = true;
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const runTypingSequence = async () => {
      setIsTyping(true);
      const textToType = initialMessages[currentNarrativeIndex];
      
      // Delay before Dr. Hassan starts typing (simulated thinking)
      timer = setTimeout(() => {
        if (!isMounted) return;

        let charIndex = 0;
        interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval);
            return;
          }

          if (charIndex < textToType.length) {
            setCurrentStreamingText(textToType.substring(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(interval);
            // Commit message to history
            setMessages(prev => [...prev, {
              id: Math.random().toString(36),
              sender: "HASSAN",
              text: textToType,
              timestamp: new Date()
            }]);
            setCurrentStreamingText("");
            setCurrentNarrativeIndex(prev => prev + 1);
            setIsTyping(false);
          }
        }, 20);
      }, 700);
    };

    runTypingSequence();

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentNarrativeIndex, initialMessages, isTyping]);

  // Handle external replies (Help etc)
  useEffect(() => {
    if (extraMessages.length > 0) {
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newOnes = extraMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...newOnes];
      });
    }
  }, [extraMessages]);

  // Auto-Scroll Protocol
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, currentStreamingText]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(36),
      sender: "USER",
      text: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    onSendMessage?.(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-ink-2/50 backdrop-blur-xl border-l border-gh-border font-sans relative">
      <div className="px-6 py-5 bg-ink-3 border-b border-gh-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden group">
              <Image 
                src="/dr-hassan.png" 
                alt="Dr. Hassan" 
                fill 
                sizes="44px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gh-blue/5 group-hover:bg-gh-blue/10 transition-colors" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gh-green border-2 border-ink shadow-sm" />
          </div>
          <div>
            <div className="text-[14px] font-black text-white leading-tight italic tracking-tight">
              Dr. Hassan
            </div>
            <div className="text-[9px] text-gh-blue font-bold uppercase tracking-[0.2em] mt-0.5 italic">
              Head of Data • Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 text-zinc-600">
          <Video size={18} className="cursor-not-allowed opacity-20" />
          <Phone size={17} className="cursor-not-allowed opacity-20" />
          <MoreVertical
            size={18}
            className="cursor-pointer hover:text-white transition-colors"
          />
        </div>
      </div>

      <div className="px-5 py-2.5 bg-gh-blue/5 border-b border-gh-border flex items-center justify-center gap-3">
        <ShieldCheck size={14} className="text-gh-blue/60 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black italic">
          Audit-Verified Encrypted Link
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-left"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === "HASSAN" ? -10 : 10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={`flex ${msg.sender === "HASSAN" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-xl italic whitespace-pre-wrap ${
                  msg.sender === "HASSAN"
                    ? "bg-ink-3/80 text-white rounded-tl-none border border-white/5 font-light border-l-gh-blue border-l-2"
                    : "bg-gh-blue text-white rounded-tr-none font-bold"
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-2 text-right opacity-60 font-mono italic font-black`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[90%] p-4 rounded-2xl rounded-tl-none bg-ink-3/40 text-white text-[15px] leading-relaxed border border-white/5 italic font-light whitespace-pre-wrap">
              {currentStreamingText}
              <span className="inline-block w-1.5 h-3.5 bg-gh-blue ml-1 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-ink border-t border-gh-border">
        <div className={`flex items-center gap-4 bg-ink-3 rounded-2xl px-5 py-3 border border-white/5 transition-all ${isTyping ? "opacity-40 cursor-not-allowed" : "opacity-100 hover:border-gh-blue/30 focus-within:border-gh-blue/50 focus-within:ring-1 focus-within:ring-gh-blue/20"}`}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "Awaiting response..." : "Type 'help' for instructions..."}
            className="flex-1 bg-transparent border-none outline-none text-white text-xs italic font-medium placeholder:text-zinc-400"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="text-gh-blue disabled:text-zinc-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
