"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Info, X } from "lucide-react";

interface DrHassanAdvisorProps {
  advice: string | null;
  onClose: () => void;
}

/**
 * Dr. Hassan's Technical Advisor
 *
 * ARCHITECTURAL PHILOSOPHY:
 * This component provides specialized, high-importance technical guidance that
 * is distinct from the main narrative flow in the Messenger. It is designed
 * as a high-fidelity "Heads-Up Display" (HUD) element.
 *
 * Aesthetic:
 * Uses the signature DataPulse Teal gradient with a backdrop blur to command
 * visual attention without obscuring the workstation context.
 */
export const DrHassanAdvisor: React.FC<DrHassanAdvisorProps> = ({
  advice,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {advice && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl"
        >
          <div className="bg-ink-2/95 backdrop-blur-2xl border-2 border-gh-blue/30 rounded-[32px] p-8 shadow-terminal relative overflow-hidden group">
            {/* The "Sage" Gradient Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.1),_transparent_70%)] pointer-events-none" />

            <div className="flex items-start gap-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gh-blue/10 border-2 border-gh-blue/20 flex items-center justify-center text-gh-blue shadow-glow shrink-0">
                <ShieldCheck size={28} />
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gh-blue uppercase tracking-[0.4em] italic underline decoration-gh-blue/20 underline-offset-8">
                      PhD Technical Advice
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-gh-blue text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                      <Info size={10} /> Active
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-zinc-600 hover:text-white transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-[15px] leading-relaxed text-white font-medium italic border-l-2 border-gh-blue/40 pl-6 py-1 shadow-sm">
                  {advice}
                </p>

                <div className="mt-6 flex items-center gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black italic">
                  <span>• Source: Sage Archive</span>
                  <span className="text-gh-green opacity-60">• Verified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
