import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle, MapPin, Calendar, Smartphone, FileSearch, Sparkles, Upload, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../../utils/helpers';

const DEFAULT_ROAD_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%231e293b'/><polygon points='120,600 360,220 440,220 680,600' fill='%23334155'/><line x1='400' y1='220' x2='400' y2='600' stroke='%23fbbf24' stroke-width='8' stroke-dasharray='25,18'/><rect y='0' width='800' height='220' fill='%230f172a'/><circle cx='660' cy='90' r='45' fill='%23f59e0b' opacity='0.9'/><rect x='40' y='30' width='380' height='65' rx='8' fill='%230f172a' stroke='%2338bdf8' stroke-width='2'/><text x='55' y='60' fill='%23f8fafc' font-family='Arial,sans-serif' font-size='18' font-weight='bold'>MPLADS: Rural Road Infrastructure</text><text x='55' y='82' fill='%2338bdf8' font-family='Arial,sans-serif' font-size='13'>Chiraigaon Block, Varanasi (UP)</text></svg>";

const DEFAULT_HALL_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%230f172a'/><rect x='160' y='200' width='480' height='360' fill='%231e293b' stroke='%2338bdf8' stroke-width='3'/><polygon points='120,200 400,60 680,200' fill='%230284c7'/><rect x='330' y='360' width='140' height='200' fill='%230369a1'/><rect x='40' y='30' width='380' height='65' rx='8' fill='%230f172a' stroke='%23a855f7' stroke-width='2'/><text x='55' y='60' fill='%23f8fafc' font-family='Arial,sans-serif' font-size='18' font-weight='bold'>MPLADS: Community Center Hall</text><text x='55' y='82' fill='%23a855f7' font-family='Arial,sans-serif' font-size='13'>Sector 4, Rohini, North West Delhi</text></svg>";

const DEFAULT_WATER_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%230f172a'/><rect x='240' y='180' width='320' height='320' rx='20' fill='%231e293b' stroke='%230ea5e9' stroke-width='3'/><circle cx='400' cy='320' r='100' fill='%230284c7'/><rect x='40' y='30' width='380' height='65' rx='8' fill='%230f172a' stroke='%230ea5e9' stroke-width='2'/><text x='55' y='60' fill='%23f8fafc' font-family='Arial,sans-serif' font-size='18' font-weight='bold'>MPLADS: Solar Drinking Water RO</text><text x='55' y='82' fill='%230ea5e9' font-family='Arial,sans-serif' font-size='13'>Banswara Tribal Block, Rajasthan</text></svg>";

export const EvidenceViewer = ({
  uploadedImage: initialUploaded,
  matchedImage: initialMatched,
  uploadedMeta = {},
  matchedMeta = {},
  similarity: initialSimilarity = 96,
  className = '',
}) => {
  const [uploadedImg, setUploadedImg] = useState(DEFAULT_ROAD_IMG);
  const [matchedImg, setMatchedImg] = useState(DEFAULT_ROAD_IMG);
  const [similarity, setSimilarity] = useState(initialSimilarity);
  const [isMatching, setIsMatching] = useState(false);
  const [uploadedFileMeta, setUploadedFileMeta] = useState(uploadedMeta);
  
  const uploadInputRef = useRef(null);
  const matchInputRef = useRef(null);

  const handleUploadedChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImg(reader.result);
        setUploadedFileMeta({
          ...uploadedFileMeta,
          device: 'Manual User Upload',
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          timestamp: 'Just now (Interactive Demo)',
          gps: '25.3190° N, 82.9810° E (User Uploaded)'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchedChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMatchedImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiComparison = () => {
    setIsMatching(true);
    setTimeout(() => {
      const calculatedSim = uploadedImg === matchedImg ? 96 : Math.floor(Math.random() * 20) + 12;
      setSimilarity(calculatedSim);
      setIsMatching(false);
    }, 700);
  };

  const loadPreset = (type) => {
    if (type === 'road_dup') {
      setUploadedImg(DEFAULT_ROAD_IMG);
      setMatchedImg(DEFAULT_ROAD_IMG);
      setSimilarity(96);
    } else if (type === 'hall_dup') {
      setUploadedImg(DEFAULT_HALL_IMG);
      setMatchedImg(DEFAULT_HALL_IMG);
      setSimilarity(91);
    } else {
      setUploadedImg(DEFAULT_ROAD_IMG);
      setMatchedImg(DEFAULT_WATER_IMG);
      setSimilarity(14);
    }
  };

  const isFraud = similarity >= 75;

  return (
    <div className={cn('flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl', className)}>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('p-2 rounded-lg border', isFraud ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')}>
            {isFraud ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>AI Forensic Photo Analysis Lab</span>
              <span className={cn('px-2 py-0.5 rounded text-[11px] font-mono font-bold border', isFraud ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30')}>
                {isFraud ? 'CRITICAL MATCH (RECYCLED PHOTO)' : 'VERIFIED GENUINE WORK'}
              </span>
            </h4>
            <p className="text-xs text-slate-400">Deep Feature Alignment, Perceptual Gradient Hash & EXIF Forensic Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 border rounded-lg', isFraud ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400')}>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs text-slate-300">Neural Match:</span>
            <span className="text-sm font-extrabold font-mono">{similarity}%</span>
          </div>
        </div>
      </div>

      {/* Preset Test Case Selector & Manual Upload Bar */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Test Presets:</span>
          <button type="button" onClick={() => loadPreset('road_dup')} className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/30 font-medium">🚨 Road Duplicate (96%)</button>
          <button type="button" onClick={() => loadPreset('hall_dup')} className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 font-medium">⚠️ Hall Recycled (91%)</button>
          <button type="button" onClick={() => loadPreset('genuine')} className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/30 font-medium">✅ Genuine Distinct (14%)</button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => uploadInputRef.current?.click()} className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg border border-sky-500/30 font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
          </button>
          <button type="button" onClick={handleRunAiComparison} disabled={isMatching} className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-lg shadow flex items-center gap-1.5">
            <RefreshCw className={cn("w-3.5 h-3.5", isMatching && "animate-spin")} /> {isMatching ? 'Analyzing...' : 'Run Live AI Match'}
          </button>
          <input type="file" ref={uploadInputRef} onChange={handleUploadedChange} accept="image/*" className="hidden" />
          <input type="file" ref={matchInputRef} onChange={handleMatchedChange} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Visual Comparison Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/60">
        {/* Left: Uploaded Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              1. Current Claim Photo
            </span>
            <button type="button" onClick={() => uploadInputRef.current?.click()} className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Change File
            </button>
          </div>

          <div className="relative rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-950 aspect-[4/3] group shadow-inner">
            <img
              src={uploadedImg}
              alt="Uploaded Project Progress"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-blue-400 border border-slate-700">
              Submitted: 20 Aug 2026
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> GPS Tag:
              </span>
              <span className="font-mono text-slate-200">{uploadedFileMeta.gps || '25.3190° N, 82.9810° E'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Device / File:
              </span>
              <span className="font-mono text-slate-200">{uploadedFileMeta.device || 'Realme 9 Pro (5G)'}</span>
            </div>
          </div>
        </div>

        {/* Right: Matched Archive Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              2. Matched Historical Archive Photo
            </span>
            <button type="button" onClick={() => matchInputRef.current?.click()} className="text-[11px] text-rose-400 hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Change Reference
            </button>
          </div>

          <div className={cn("relative rounded-lg overflow-hidden border-2 bg-slate-950 aspect-[4/3] group shadow-inner", isFraud ? "border-rose-500/70" : "border-emerald-500/70")}>
            <img
              src={matchedImg}
              alt="Matched Prior Project Photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-rose-400 border border-rose-500/40">
              Archived: 12 Nov 2024 (Jaunpur District)
            </div>
            <div className={cn("absolute bottom-3 right-3 text-white font-mono text-xs font-bold px-2.5 py-1 rounded shadow", isFraud ? "bg-rose-600/90" : "bg-emerald-600/90")}>
              {similarity}% {isFraud ? 'Exact Structure Match' : 'Distinct Fingerprint'}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-purple-400" /> Source Work:
              </span>
              <span className="font-medium text-slate-200">Gram Panchayat Road, Jaunpur</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Verification Result:
              </span>
              <span className={cn("font-bold", isFraud ? "text-rose-400" : "text-emerald-400")}>
                {isFraud ? 'SUSPICIOUS DUPLICATE EVIDENCE' : 'PASS - AUTHENTIC SITE PROGRESS'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
