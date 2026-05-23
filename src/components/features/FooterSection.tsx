"use client";

import React from 'react';
import { Shield, Lock, Check } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-ink-2/95 backdrop-blur-3xl py-24 lg:py-32 text-left">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-24 text-left font-sans italic">
          <div className="max-w-lg">
            <div className="flex items-center gap-5 mb-10 text-left justify-start group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gh-blue to-teal-600 flex items-center justify-center shadow-glow border-2 border-white/20 group-hover:scale-105 transition-transform duration-500">
                <span className="font-mono font-black text-2xl text-white uppercase tracking-[0.3em]">G4D</span>
              </div>
              <div className="text-5xl font-black tracking-[-0.04em] text-white uppercase italic">Git4Data</div>
            </div>
            <p className="text-[21px] leading-relaxed text-white font-bold italic border-l-8 border-gh-blue/20 pl-12 py-3 max-w-md opacity-90">
              The absolute ceiling of Git mastery for the high-stakes world of data science. 
              Where PhD-level research meets staff-level engineering rigor.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-24 text-left font-mono text-[15px] uppercase tracking-[0.4em] font-black">
            <div className="space-y-10 text-left">
              <h4 className="text-white text-lg italic underline decoration-gh-blue/30 underline-offset-8 mb-4">Curriculum</h4>
              <div className="space-y-6 text-white opacity-60 italic">
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1">Safety Net</div>
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1">The Forge</div>
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1 font-black text-gh-blue">Dark Arts</div>
              </div>
            </div>
            <div className="space-y-10 text-left">
              <h4 className="text-white text-lg italic underline decoration-gh-blue/30 underline-offset-8 mb-4">Architecture</h4>
              <div className="space-y-6 text-white opacity-60 italic">
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1">VFS Core</div>
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1">Reflog Engine</div>
                <div className="hover:text-gh-blue transition-colors cursor-pointer border-l-4 border-white/5 pl-6 py-1">DVC Auditor</div>
              </div>
            </div>
            <div className="space-y-10 text-left">
              <h4 className="text-white text-lg italic underline decoration-gh-green/30 underline-offset-8 mb-4">System Status</h4>
              <div className="space-y-6 text-gh-green italic font-black flex flex-col items-start">
                <div className="flex items-center gap-4 bg-gh-green/5 px-4 py-2 rounded-xl border-2 border-gh-green/10 shadow-sm"><span className="w-3 h-3 rounded-full bg-gh-green animate-pulse" /> Nodes Nominal</div>
                <div className="flex items-center gap-4 bg-gh-green/5 px-4 py-2 rounded-xl border-2 border-gh-green/10 shadow-sm"><span className="w-3 h-3 rounded-full bg-gh-green animate-pulse" /> Audit: Secure</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t-2 border-white/5 flex flex-col sm:flex-row justify-between gap-10 text-[15px] font-mono text-white opacity-40 uppercase tracking-[0.6em] italic font-black">
          <div className="hover:text-white transition-colors duration-500 underline decoration-white/5">© 2026 Git4Data • Staff Edition</div>
          <div className="flex flex-wrap gap-16">
            <span className="flex items-center gap-4 text-white opacity-40 hover:opacity-100 transition-opacity cursor-default"><Shield size={18} /> Verified Lineage</span>
            <span className="flex items-center gap-4 text-white opacity-40 hover:opacity-100 transition-opacity cursor-default"><Lock size={18} /> GPG Signed</span>
            <span className="flex items-center gap-4 text-white opacity-40 hover:opacity-100 transition-opacity cursor-default"><Check size={18} /> ISO-9001.SIM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
