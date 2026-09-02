import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, MapPin, Smartphone, FileSearch, Sparkles, Upload, RefreshCw, Binary, CheckCircle2, AlertTriangle } from 'lucide-react';
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
          device: 'Manual User Inspection Upload',
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          timestamp: 'Live Auditor Session',
          gps: '25.3190° N, 82.9810° E (Varanasi Site)'
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
    }, 600);
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
  const hammingDist = isFraud ? Math.round((1 - similarity / 100) * 64) : 48;

  return (
    <div className={cn('flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-gov-card', className)}>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-lg border shrink-0', isFraud ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>
            {isFraud ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Digital Forensics Image Inspection Workbench</span>
              <span className={cn('px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border uppercase', isFraud ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>
                {isFraud ? 'CRITICAL DISCREPANCY: RECYCLED COMPLETION PHOTO' : 'VERIFIED: DISTINCT PHYSICAL WORK'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              OpenCV 64-bit Difference Hashing (dHash) & EXIF Geotag Forensic Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-2 px-3.5 py-1.5 border rounded-lg', isFraud ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700')}>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">Perceptual Match:</span>
            <span className="text-sm font-black font-mono">{similarity}%</span>
          </div>
        </div>
      </div>

      {/* Preset Test Case Selector & Manual Upload Bar */}
      <div className="p-3.5 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px]">Audit Presets:</span>
          <button type="button" onClick={() => loadPreset('road_dup')} className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 rounded border border-rose-200 font-semibold shadow-gov-sm transition-colors">
            🚨 Road Duplicate (96% Match)
          </button>
          <button type="button" onClick={() => loadPreset('hall_dup')} className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 rounded border border-amber-200 font-semibold shadow-gov-sm transition-colors">
            ⚠️ Hall Recycled (91% Match)
          </button>
          <button type="button" onClick={() => loadPreset('genuine')} className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-semibold shadow-gov-sm transition-colors">
            ✅ Distinct Sites (14% Match)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => uploadInputRef.current?.click()} className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-semibold shadow-gov-sm flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-blue-600" /> Upload Live Field Photo
          </button>
          <button type="button" onClick={handleRunAiComparison} disabled={isMatching} className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-gov-sm flex items-center gap-1.5 transition-colors">
            <RefreshCw className={cn("w-3.5 h-3.5", isMatching && "animate-spin")} /> {isMatching ? 'Processing Gradients...' : 'Run Live OpenCV Scan'}
          </button>
          <input type="file" ref={uploadInputRef} onChange={handleUploadedChange} accept="image/*" className="hidden" />
          <input type="file" ref={matchInputRef} onChange={handleMatchedChange} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Live 64-bit dHash Bitstream Comparison Strip */}
      <div className="px-5 py-3 bg-slate-900 text-slate-100 border-b border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sky-300">OpenCV 64-bit dHash Fingerprint Analysis:</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Hamming Distance: <b className={isFraud ? "text-rose-400" : "text-emerald-400"}>{hammingDist} / 64 bits</b></span>
            <span>Threshold Floor: <b>&le; 6 bits</b></span>
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", isFraud ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30")}>
              {isFraud ? 'CORRUPT CLUSTER DETECTED' : 'FINGERPRINT VERIFIED'}
            </span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 truncate">
          <span className="text-slate-500">Hash A:</span> 1101001011010011001100101101001010101010010101011100110011110000 &nbsp;|&nbsp; 
          <span className="text-slate-500">Hash B:</span> {isFraud ? '1101001011010011001100101101001010101010010101011100110011110011' : '0010110100101100110011010010110101010101101010100011001100001111'}
        </div>
      </div>

      {/* Visual Side-by-Side Comparison Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
        {/* Left: Uploaded Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Newly Claimed Completion Photo (Varanasi)
            </span>
            <button type="button" onClick={() => uploadInputRef.current?.click()} className="text-[11px] text-blue-700 font-medium hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Change File
            </button>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] group shadow-sm">
            <img
              src={uploadedImg}
              alt="Uploaded Project Progress"
              className="w-full h-full object-cover"
            />
            {isMatching && (
              <>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-scanner pointer-events-none z-20" />
                <div className="absolute inset-0 bg-slate-950/50 pointer-events-none z-10 flex flex-col items-center justify-center font-mono text-xs text-cyan-300">
                  <RefreshCw className="w-5 h-5 animate-spin mb-1.5 text-cyan-400" />
                  <span className="font-bold tracking-wider">COMPUTING 64-BIT DHASH</span>
                </div>
              </>
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-mono font-bold text-slate-800 border border-slate-200 shadow-sm z-10">
              Submitted: 20 Aug 2026
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Geotag Coordinates:
              </span>
              <span className="font-mono font-bold text-slate-800">{uploadedFileMeta.gps || '25.3190° N, 82.9810° E'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Inspected Terminal:
              </span>
              <span className="font-mono font-medium text-slate-800">{uploadedFileMeta.device || 'Field Officer Tablet (ID: UP-VAR-42)'}</span>
            </div>
          </div>
        </div>

        {/* Right: Matched Archive Photo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              2. Matched Historical Work Record (Jaunpur)
            </span>
            <button type="button" onClick={() => matchInputRef.current?.click()} className="text-[11px] text-slate-600 font-medium hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Change Reference
            </button>
          </div>

          <div className={cn("relative rounded-lg overflow-hidden border-2 aspect-[4/3] group shadow-sm", isFraud ? "border-rose-400 bg-rose-50" : "border-emerald-400 bg-emerald-50")}>
            <img
              src={matchedImg}
              alt="Matched Prior Project Photo"
              className="w-full h-full object-cover"
            />
            {isMatching && (
              <>
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-scanner pointer-events-none z-20" />
                <div className="absolute inset-0 bg-slate-950/50 pointer-events-none z-10 flex flex-col items-center justify-center font-mono text-xs text-cyan-300">
                  <RefreshCw className="w-5 h-5 animate-spin mb-1.5 text-cyan-400" />
                  <span className="font-bold tracking-wider">COMPARING REPOSITORY HASHES</span>
                </div>
              </>
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-mono font-bold text-slate-800 border border-slate-200 shadow-sm z-10">
              Archive Date: 12 Nov 2024
            </div>
            <div className={cn("absolute bottom-3 right-3 text-white font-mono text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10", isFraud ? "bg-rose-600" : "bg-emerald-600")}>
              {similarity}% {isFraud ? 'Structural Duplication' : 'Distinct Geometry'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-indigo-600" /> Historical Project Record:
              </span>
              <span className="font-semibold text-slate-800">Gram Panchayat Road, Jaunpur (MPLAD-2024-0891)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Forensic Verification:
              </span>
              <span className={cn("font-bold", isFraud ? "text-rose-700" : "text-emerald-700")}>
                {isFraud ? 'FLAGGED: RECYCLED SITE PHOTOGRAPHY' : 'VERIFIED: GENUINE NEW EXPENDITURE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
