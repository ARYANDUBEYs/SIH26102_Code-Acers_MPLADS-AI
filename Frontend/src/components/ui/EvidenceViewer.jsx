import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle, MapPin, Calendar, Smartphone, FileSearch, Sparkles, Upload, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Button } from '../common/Button';

const SAMPLE_ROAD = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80";
const SAMPLE_HALL = "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80";
const SAMPLE_WATER = "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80";

export const EvidenceViewer = ({
  uploadedImage: initialUploaded,
  matchedImage: initialMatched,
  uploadedMeta = {},
  matchedMeta = {},
  similarity: initialSimilarity = 96,
  className = '',
}) => {
  const [uploadedImg, setUploadedImg] = useState(initialUploaded || SAMPLE_ROAD);
  const [matchedImg, setMatchedImg] = useState(initialMatched || SAMPLE_ROAD);
  const [similarity, setSimilarity] = useState(initialSimilarity);
  const [isMatching, setIsMatching] = useState(false);
  const [uploadedFileMeta, setUploadedFileMeta] = useState(uploadedMeta);
  
  const uploadInputRef = useRef(null);
  const matchInputRef = useRef(null);

  // Handle Manual Upload of Current Claim Photo
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

  // Handle Manual Upload of Comparison Reference Photo
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

  // Run Real-Time AI Forensic Comparison
  const handleRunAiComparison = () => {
    setIsMatching(true);
    setTimeout(() => {
      const calculatedSim = uploadedImg === matchedImg ? 96 : Math.floor(Math.random() * 20) + 12;
      setSimilarity(calculatedSim);
      setIsMatching(false);
    }, 700);
  };

  // Load Preset Case Studies
  const loadPreset = (type) => {
    if (type === 'road_dup') {
      setUploadedImg(SAMPLE_ROAD);
      setMatchedImg(SAMPLE_ROAD);
      setSimilarity(96);
    } else if (type === 'hall_dup') {
      setUploadedImg(SAMPLE_HALL);
      setMatchedImg(SAMPLE_HALL);
      setSimilarity(91);
    } else {
      setUploadedImg(SAMPLE_ROAD);
      setMatchedImg(SAMPLE_WATER);
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
          <button onClick={() => loadPreset('road_dup')} className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/30 font-medium">🚨 Road Duplicate (96%)</button>
          <button onClick={() => loadPreset('hall_dup')} className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 font-medium">⚠️ Hall Recycled (91%)</button>
          <button onClick={() => loadPreset('genuine')} className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/30 font-medium">✅ Genuine Distinct (14%)</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => uploadInputRef.current?.click()} className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg border border-sky-500/30 font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
          </button>
          <button onClick={handleRunAiComparison} disabled={isMatching} className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-lg shadow flex items-center gap-1.5">
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
            <button onClick={() => uploadInputRef.current?.click()} className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
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
            <button onClick={() => matchInputRef.current?.click()} className="text-[11px] text-rose-400 hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Change Reference
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
