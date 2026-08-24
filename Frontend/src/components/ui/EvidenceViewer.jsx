import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, MapPin, Calendar, Smartphone, FileSearch, Sparkles, ZoomIn } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Badge } from './Badge';

const FALLBACK_UPLOADED = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80';
const FALLBACK_MATCHED = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80';

export const EvidenceViewer = ({
  uploadedImage = FALLBACK_UPLOADED,
  matchedImage = FALLBACK_MATCHED,
  uploadedMeta = {},
  matchedMeta = {},
  similarity = 96,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('side-by-side');

  return (
    <div className={cn('flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl', className)}>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>AI Forensic Photo Analysis</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                CRITICAL MATCH
              </span>
            </h4>
            <p className="text-xs text-slate-400">Deep Feature Alignment & EXIF Forensic Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-300">Image Similarity:</span>
            <span className="text-sm font-extrabold font-mono text-rose-400">{similarity}%</span>
          </div>
        </div>
      </div>

      {/* Visual Comparison Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/60">
        {/* Left: Uploaded Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              1. Current Uploaded Progress Photo
            </span>
            <span className="text-[11px] font-mono text-slate-400">Project: MPLAD-2026-00124</span>
          </div>

          <div className="relative rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-950 aspect-[4/3] group shadow-inner">
            <img
              src={uploadedImage || FALLBACK_UPLOADED}
              alt="Uploaded Project Progress"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_UPLOADED; }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-blue-400 border border-slate-700">
              Submitted: 20 Aug 2026
            </div>
          </div>

          {/* Uploaded Meta */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> GPS Tag:
              </span>
              <span className="font-mono text-slate-200">{uploadedMeta.gps || '25.3190° N, 82.9810° E'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Device:
              </span>
              <span className="font-mono text-slate-200">{uploadedMeta.device || 'Realme 9 Pro (5G)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Timestamp:
              </span>
              <span className="font-mono text-slate-200">{uploadedMeta.timestamp || '2026-08-20 16:42 IST'}</span>
            </div>
          </div>
        </div>

        {/* Right: Matched Historical Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              2. Matched Historical Archive Photo
            </span>
            <span className="text-[11px] font-mono text-rose-400 font-bold">
              Match Source: {matchedMeta.sourceProjectId || 'MPLAD-2024-00892'}
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden border-2 border-rose-500/70 bg-slate-950 aspect-[4/3] group shadow-inner">
            <img
              src={matchedImage || FALLBACK_MATCHED}
              alt="Matched Prior Project Photo"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_MATCHED; }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-rose-400 border border-rose-500/40">
              Archived: 12 Nov 2024 (Jaunpur District)
            </div>
            <div className="absolute bottom-3 right-3 bg-rose-600/90 text-white font-mono text-xs font-bold px-2.5 py-1 rounded shadow">
              96% Exact Structure Match
            </div>
          </div>

          {/* Matched Meta */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-purple-400" /> Source Work:
              </span>
              <span className="font-medium text-slate-200">{matchedMeta.sourceProjectName || 'Gram Panchayat Road, Jaunpur'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Match Method:
              </span>
              <span className="font-mono text-slate-200">{matchedMeta.matchType || 'Perceptual Hash Exact Match'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Verification Result:
              </span>
              <span className="font-bold text-rose-400">SUSPICIOUS DUPLICATE EVIDENCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
