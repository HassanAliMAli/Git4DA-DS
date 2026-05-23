"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Main Navigation Component
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Centralizes branding and primary navigation links. Handles the transition
 * to the terminal hub and provides consistent entry points for global sections.
 */
export const Navigation: React.FC = () => {
  const router: AppRouterInstance = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-2xl text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left justify-start">
          <div className="relative text-left">
            <img
              src="/logo.png"
              alt="Git4Data Logo"
              className="h-[49px] w-auto object-contain"
            />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gh-green shadow-[0_0_16px_#238636]"></div>
          </div>

          <div className="leading-tight text-left">
            <div className="text-[10px] text-white font-mono -mt-0.5 uppercase font-black tracking-widest opacity-60">
              PHD+ • LEGENDARY TIER
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-white font-bold italic opacity-80 uppercase tracking-widest">
          <Link href="#roadmap" className="hover:text-gh-blue transition-colors underline decoration-transparent hover:decoration-gh-blue/30 underline-offset-4">
            Roadmap
          </Link>
          <Link href="#lab" className="hover:text-gh-blue transition-colors underline decoration-transparent hover:decoration-gh-blue/30 underline-offset-4">
            Lab
          </Link>
          <Link href="#modules" className="hover:text-gh-blue transition-colors underline decoration-transparent hover:decoration-gh-blue/30 underline-offset-4">
            Modules
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="font-mono text-xs text-gh-blue italic font-black">v2.4.1 • main</span>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-2.5 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-mono uppercase tracking-widest font-black italic">
            <span className="w-1.5 h-1.5 rounded-full bg-gh-green animate-pulse"></span>
            Agents: 1,247
          </div>
          <button
            onClick={() => router.push("/terminal")}
            className="h-9 px-4 rounded-lg bg-gh-blue text-white font-black text-[11px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-sm uppercase tracking-widest italic border border-white/10"
          >
            Enter Hub
          </button>
        </div>
      </div>
    </header>
  );
};
