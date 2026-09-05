import React from 'react';
import { ShieldCheck, Sparkles, Building, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen lg:h-screen bg-gov-darkest flex flex-col justify-between text-slate-100 selection:bg-blue-600 overflow-y-auto lg:overflow-hidden">
      {/* Tiranga Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 shrink-0" />

      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
          {/* Left Hero / Info Pane */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group mb-5">
                <div className="w-9 h-9 rounded-md bg-blue-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[4px] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="font-black text-sm sm:text-base text-white tracking-tight">
                    MPLADS <span className="text-blue-400">INTELLIGENCE</span>
                  </h1>
                  <p className="text-[10px] text-slate-400 font-medium">Ministry of Statistics & Programme Implementation</p>
                </div>
              </Link>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>National Project Surveillance Platform</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  Transparent, AI-Governed Public Development.
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time algorithmic oversight of ₹2,480+ Crores in Member of Parliament Local Area Development Scheme funds.
                </p>
              </div>

              {/* Key Features Bullet Points */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Computer Vision Verification</strong>: Catch duplicate, stock, and cross-district photographic reuse.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Cartel & Collusion Matrix</strong>: Graph detection of shared directors and shell bidders.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Human-in-the-Loop Governance</strong>: District Magistrates retain final statutory sanction authority.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" /> Authorized National Gateway • MoSPI SSO
              </span>
              <span>e-SAKSHI AI Engine</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-slate-900/95">
            {children}
          </div>
        </div>
      </div>

      <div className="py-2.5 px-4 text-center text-xs text-slate-400 font-mono border-t border-slate-900 bg-slate-950 shrink-0">
        Official Portal for Authorized Personnel & Citizens • Ministry of Statistics and Programme Implementation (MoSPI)
      </div>
    </div>
  );
};
