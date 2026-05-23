"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/contexts/ProfileContext';
import { UserRole } from '@/models/Profile';
import { ChevronRight, Database, FlaskConical, ShieldAlert, Cpu } from 'lucide-react';

export function ProfileSelection() {
  const { setRole } = useProfile();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedRole) {
      setIsIssuing(true);
      // Brief delay to simulate "badge issuance" for narrative effect
      setTimeout(async () => {
        await setRole(selectedRole, name);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-sage/30 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(14,165,163,0.08),_transparent_60%)] blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-violet flex items-center justify-center shadow-glow">
              <span className="font-mono font-bold text-[10px] text-white tracking-widest">G4D</span>
            </div>
            <span className="text-sm font-bold tracking-widest text-white uppercase italic">DataPulse HQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 italic">
            Forge your identity.
          </h1>
          <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto italic">
            You are entering a high-stakes environment. State your designation and select your technical trajectory.
          </p>
        </div>

        <div className="bg-ink-2/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">
          <div className="flex items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <ShieldAlert size={16} className="text-amber-500 mr-3" />
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Security Clearance Protocol</span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="mb-12">
              <label htmlFor="name" className="block text-[11px] font-bold text-sage uppercase tracking-widest mb-3">
                Operative Designation
              </label>
              <div className="relative group">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-ink/50 border-2 border-white/10 rounded-xl px-5 py-4 text-white font-mono text-sm outline-none transition-all focus:border-sage/50 focus:bg-ink placeholder:text-zinc-600"
                  required
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                  [Req]
                </div>
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-[11px] font-bold text-sage uppercase tracking-widest mb-4">
                Trajectory Selection
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Analyst Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('DATA_ANALYST')}
                  className={`text-left relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                    selectedRole === 'DATA_ANALYST' 
                      ? 'border-sage bg-sage/5 shadow-glow' 
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'DATA_ANALYST' ? 'bg-sage/20 text-sage' : 'bg-white/5 text-zinc-400 group-hover:text-zinc-300'
                    }`}>
                      <Database size={24} />
                    </div>
                    {selectedRole === 'DATA_ANALYST' && (
                      <div className="px-2 py-1 rounded bg-sage/20 border border-sage/30 text-[9px] font-bold text-sage uppercase tracking-widest">Selected</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 italic">Data Analyst</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    Master logic, insights, and Analytics Engineering. Learn to version SQL pipelines (dbt) and ensure perfectly reproducible dashboards.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">SQL</span>
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">dbt</span>
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">Jupyter</span>
                  </div>
                </button>

                {/* Scientist Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('DATA_SCIENTIST')}
                  className={`text-left relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                    selectedRole === 'DATA_SCIENTIST' 
                      ? 'border-violet bg-violet/5 shadow-glow-violet' 
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'DATA_SCIENTIST' ? 'bg-violet/20 text-violet-300' : 'bg-white/5 text-zinc-400 group-hover:text-zinc-300'
                    }`}>
                      <FlaskConical size={24} />
                    </div>
                    {selectedRole === 'DATA_SCIENTIST' && (
                      <div className="px-2 py-1 rounded bg-violet/20 border border-violet/30 text-[9px] font-bold text-violet-300 uppercase tracking-widest">Selected</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 italic">Data Scientist</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    Master models, experiments, and MLOps. Learn to version massive datasets (DVC) and cryptographically secure your deployment lineage.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">Python</span>
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">DVC</span>
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-ink border border-white/10 text-zinc-500 uppercase">MLOps</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center pt-8 border-t border-white/5">
              <button
                type="submit"
                disabled={!name || !selectedRole || isIssuing}
                className="group relative h-14 px-12 rounded-xl bg-white text-ink font-bold text-[14px] hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-glow flex items-center justify-center gap-3 uppercase tracking-widest w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {isIssuing ? (
                  <>
                    <Cpu className="animate-pulse" size={18} />
                    Issuing Badge...
                  </>
                ) : (
                  <>
                    Authorize Clearance
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                
                {/* Sheen effect on button */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[sheen-anim_1.5s_infinite]" />
              </button>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">
                <Lock size={12} /> Connection encrypted via DataPulse protocols
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
