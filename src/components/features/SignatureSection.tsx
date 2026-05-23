"use client";

import React from 'react';
import { Shield, ArrowRight, Check } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface SignatureSectionProps {
  router: AppRouterInstance;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ router }) => {
  return (
    <>
      {/* Signature Section */}
      <section className="border-b border-white/5 bg-ink-2/30 py-24 lg:py-32 text-left">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 text-left">
                <div className="max-w-3xl">
                    <div className="text-[11px] font-black tracking-[0.4em] text-gh-green mb-5 uppercase italic underline decoration-gh-green/20 underline-offset-8">LEVEL 19 • CRYPTOGRAPHIC SEAL</div>
                    <h2 className="text-[28px] lg:text-[48px] font-black tracking-tighter leading-[1] text-white italic uppercase">
                        Verified badges are not decoration.<br/>
                        <span className="text-white font-light font-serif opacity-70 normal-case italic">They are technical liability.</span>
                    </h2>
                </div>
                <div className="lg:text-right">
                    <div className="inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-ink border border-white/10 text-[11px] font-mono italic font-black text-white shadow-inner uppercase tracking-widest">
                        <span className="w-2.5 h-2.5 rounded-full bg-gh-green animate-pulse shadow-[0_0_10px_#238636]" />
                        GPG: 4096R/4A7F9C2D • SIGNED
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 text-left">
                <div className="lg:col-span-2 rounded-[32px] border border-gh-green/20 bg-gh-green/[0.03] overflow-hidden transition-all duration-500 hover:border-gh-green/40 shadow-2xl group">
                    <div className="p-10">
                        <div className="flex items-start gap-8">
                            <div className="relative mt-1 w-16 h-16 rounded-2xl bg-gh-green/10 border border-gh-green/20 flex items-center justify-center flex-shrink-0 shadow-glow group-hover:scale-110 transition-transform duration-500">
                                <Shield size={32} className="text-gh-green" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <code className="text-[16px] font-mono text-white font-black italic tracking-tighter uppercase underline decoration-white/10">a7f3c9d • Cascade Model v3</code>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gh-green text-white text-[11px] font-black font-mono italic tracking-[0.2em] shadow-lg animate-pulse">
                                        VERIFIED
                                    </span>
                                </div>
                                <p className="text-[15px] text-white leading-relaxed mb-6 font-bold italic opacity-95 max-w-2xl border-l-2 border-white/5 pl-8 py-1">
                                    Merged to main • Deployed to prod-us-east-1 • 14.2M predictions/hour • 
                                    Lineage: dvc://models/uplift-v3.pkl
                                </p>
                                <div className="flex flex-wrap gap-6 text-[11px] font-mono text-zinc-500 italic font-black uppercase tracking-[0.3em] border-t border-white/5 pt-4">
                                    <span className="text-gh-green opacity-80">No rogue data detected</span>
                                    <span>•</span>
                                    <span>Audit-proof lineage</span>
                                    <span>•</span>
                                    <span>2.4 TB Meta-Metadata</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[32px] border border-gh-danger/20 bg-gh-danger/[0.03] p-10 transition-all duration-500 hover:border-gh-danger/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gh-danger/20 animate-pulse" />
                    <div className="text-[12px] font-black tracking-[0.4em] text-gh-danger mb-6 uppercase italic underline decoration-gh-danger/20 underline-offset-4 text-center">REJECTION POLICY</div>
                    <div className="text-[14px] text-white leading-relaxed mb-10 font-mono italic font-black text-center space-y-4">
                        <div className="opacity-80 underline decoration-white/5 pb-2">commits without signature</div>
                        <div className="opacity-80 underline decoration-white/5 pb-2">force pushes to main</div>
                        <div className="opacity-80 underline decoration-white/5 pb-2">untracked notebook cell output</div>
                        <div className="text-gh-danger font-black underline decoration-gh-danger/40 uppercase tracking-widest italic animate-pulse">missing Great Expectations</div>
                    </div>
                    <div className="flex flex-col items-center gap-4 text-[11px] text-gh-danger font-black italic uppercase tracking-[0.3em] border-t border-white/5 pt-8">
                        <div className="w-3 h-3 rounded-full bg-gh-danger animate-ping shadow-[0_0_12px_#ff7b72]" />
                        Blocked by Firm Policy
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink border-b border-white/5 py-24 lg:py-40 flex flex-col items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <h2 className="text-[36px] lg:text-[74px] font-black tracking-[-0.06em] leading-[0.85] text-white mb-12 italic uppercase">
              The environment refuses<br/>to let you fail.
            </h2>
            <p className="text-[22px] leading-relaxed text-white max-w-3xl mb-20 font-bold italic opacity-95 border-x border-white/5 px-12">
              Git4Data is used by staff engineers at 47 companies to train teams on the patterns 
              that prevent midnight production pages. No certificates. Only recovery stories.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => router.push('/terminal')}
                  className="group relative h-20 px-16 rounded-[24px] bg-gh-blue text-white font-black text-[18px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-glow flex items-center justify-center gap-5 uppercase tracking-[0.3em] italic border border-white/20 overflow-hidden"
                >
                    Initialize Level 1
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sheen-anim_1.5s_infinite]" />
                </button>
                <button className="h-20 px-16 rounded-[24px] bg-white/5 border border-white/10 text-white font-black text-[16px] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-2xl uppercase tracking-[0.2em] italic">
                    Incident Reports
                </button>
            </div>

            <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-[12px] text-zinc-700 font-mono uppercase tracking-[0.5em] italic font-black opacity-60">
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> E2E_ENCRYPTED</span>
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> ZERO_DATA_LOSS</span>
                <span className="flex items-center gap-3"><Check size={16} className="text-gh-green" /> SIGNED_LINEAGE</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
