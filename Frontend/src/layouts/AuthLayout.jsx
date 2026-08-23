import React from 'react';
import { ShieldCheck, Sparkles, Building, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gov-darkest flex flex-col justify-between text-slate-100 selection:bg-blue-600">
      {/* Tiranga Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Hero / Info Pane */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <Link to="/" className="inline-flex items-center gap-3 group mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-glow-blue flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="font-black text-lg text-white tracking-tight">
                    MPLADS <span className="text-blue-400">AI MONITOR</span>
                  </h1>
                  <p className="text-[10px] text-slate-400">Government of India • MoSPI</p>
                </div>
              </Link>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen Anomaly & Fraud Detection</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  Transparent, AI-Governed Public Development.
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Real-time algorithmic oversight of ₹2,480+ Crores in Member of Parliament Local Area Development Scheme funds.
                </p>
              </div>

              {/* Key Features Bullet Points */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automated Computer Vision</strong>: Catch duplicate & stock photos across district borders.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Cartel & Collusion Matrix</strong>: Identify shared directors and shell bidders.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Human-in-the-Loop</strong>: District Magistrates retain final decision authority.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit Encrypted Gov Gateway
              </span>
              <span>v3.4 Production</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/90">
            {children}
          </div>
        </div>
      </div>

      <div className="p-4 text-center text-xs text-slate-400 font-mono">
        Official Portal for Authorized Personnel & Citizens • Ministry of Statistics and Programme Implementation
      </div>
    </div>
  );
};
