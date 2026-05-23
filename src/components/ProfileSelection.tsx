"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/contexts/ProfileContext';
import { UserRole } from '@/models/Profile';
import { Lock, ChevronRight, Database, FlaskConical, ShieldAlert, Cpu } from 'lucide-react';

export function ProfileSelection() {
  const { setRole } = useProfile();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (name && selectedRole) {
      setIsIssuing(true);
      setTimeout(async () => {
        await setRole(selectedRole, name);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-gh-blue/30 selection:text-white">
      <div className="scanline" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(13, 148, 136,0.08),_transparent_60%)] blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gh-blue to-teal-600 flex items-center justify-center shadow-glow">
              <span className="font-mono font-black text-xs text-white uppercase tracking-widest">G4D</span>
            </div>
            <span className="text-xs font-black tracking-[0.4em] text-zinc-500 uppercase italic">DataPulse Registry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 italic uppercase">
            Initialize Lineage.
          </h1>
          <p className="text-[18px] text-gh-text-sec font-light max-w-2xl mx-auto italic border-l border-white/5 pl-8">
            Identify yourself and select your technical trajectory. Your actions from this point forward will be cryptographically signed.
          </p>
        </div>

        <div className="bg-ink-2 border border-gh-border rounded-[32px] shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/10">
          <div className="flex items-center px-8 py-5 bg-ink-3 border-b border-gh-border">
            <ShieldAlert size={16} className="text-gh-warn mr-4 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] font-black italic">Identity Verification Required</span>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16">
            <div className="mb-16">
              <label htmlFor="name" className="block text-[10px] font-black text-gh-blue uppercase tracking-[0.4em] mb-4 italic">
                Operative Designation
              </label>
              <div className="relative group">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Designation / Name"
                  className="w-full bg-ink border-2 border-white/5 rounded-2xl px-6 py-5 text-white font-mono text-sm outline-none transition-all focus:border-gh-blue/40 focus:bg-ink-3 placeholder:text-zinc-800 font-bold italic"
                  required
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 font-mono text-[9px] uppercase tracking-widest font-black italic">
                  [REQUIRED_FIELD]
                </div>
              </div>
            </div>

            <div className="mb-16">
              <label className="block text-[10px] font-black text-gh-blue uppercase tracking-[0.4em] mb-6 italic">
                Trajectory Selection
              </label>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole('DATA_ANALYST')}
                  className={`text-left relative p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden group ${
                    selectedRole === 'DATA_ANALYST' 
                      ? 'border-gh-blue bg-gh-blue/[0.03] shadow-glow' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${
                      selectedRole === 'DATA_ANALYST' ? 'bg-gh-blue/20 text-gh-blue scale-110' : 'bg-white/5 text-zinc-600 group-hover:text-zinc-500'
                    }`}>
                      <Database size={28} />
                    </div>
                    {selectedRole === 'DATA_ANALYST' && (
                      <div className="px-3 py-1 rounded-full bg-gh-blue text-[8px] font-black text-white uppercase tracking-widest italic animate-pulse">Designated</div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 italic tracking-tight uppercase">Data Analyst</h3>
                  <p className="text-[13px] text-zinc-500 font-light leading-relaxed mb-6 italic">
                    Master Logic, insights, and Analytics Engineering. Version SQL pipelines and ensure perfectly reproducible dashboard states.
                  </p>
                  <div className="flex gap-3">
                    <span className="text-[8px] font-black font-mono px-2 py-1 rounded-md bg-ink border border-white/5 text-zinc-700 uppercase italic">SQL.v2</span>
                    <span className="text-[8px] font-black font-mono px-2 py-1 rounded-md bg-ink border border-white/5 text-zinc-700 uppercase italic">dbt.eng</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('DATA_SCIENTIST')}
                  className={`text-left relative p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden group ${
                    selectedRole === 'DATA_SCIENTIST' 
                      ? 'border-violet bg-violet/5 shadow-glow' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${
                      selectedRole === 'DATA_SCIENTIST' ? 'bg-violet/20 text-teal-400 scale-110' : 'bg-white/5 text-zinc-600 group-hover:text-zinc-500'
                    }`}>
                      <FlaskConical size={28} />
                    </div>
                    {selectedRole === 'DATA_SCIENTIST' && (
                      <div className="px-3 py-1 rounded-full bg-violet text-[8px] font-black text-white uppercase tracking-widest italic animate-pulse">Designated</div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 italic tracking-tight uppercase">Data Scientist</h3>
                  <p className="text-[13px] text-zinc-500 font-light leading-relaxed mb-6 italic">
                    Master models, experiments, and MLOps. Version massive datasets (DVC) and cryptographically secure your production lineage.
                  </p>
                  <div className="flex gap-3">
                    <span className="text-[8px] font-black font-mono px-2 py-1 rounded-md bg-ink border border-white/5 text-zinc-700 uppercase italic">PY.torch</span>
                    <span className="text-[8px] font-black font-mono px-2 py-1 rounded-md bg-ink border border-white/5 text-zinc-700 uppercase italic">DVC.lin</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center pt-10 border-t border-white/5">
              <button
                type="submit"
                disabled={!name || !selectedRole || isIssuing}
                className="group relative h-16 px-16 rounded-2xl bg-white text-ink font-black text-[15px] hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-glow flex items-center justify-center gap-4 uppercase tracking-[0.2em] w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden italic"
              >
                {isIssuing ? (
                  <>
                    <Cpu className="animate-spin" size={20} />
                    Securing Node...
                  </>
                ) : (
                  <>
                    Authorize Clearance
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-gh-blue" />
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gh-blue/20 to-transparent group-hover:animate-[sheen-anim_1.5s_infinite]" />
              </button>
              <div className="mt-8 flex items-center gap-3 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em] italic font-black">
                <Lock size={12} className="text-gh-blue/50" /> End-to-End Encrypted Handshake
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
