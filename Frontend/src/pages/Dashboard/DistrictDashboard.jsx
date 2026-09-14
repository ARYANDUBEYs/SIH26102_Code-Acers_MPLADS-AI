import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import {
  CheckSquare,
  Clock,
  Sparkles,
  Camera,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Tv,
  ListFilter
} from 'lucide-react';

/**
 * National Emblem of India (Ashoka Lion Capital) Silhouette
 */
const AshokaEmblem = ({ className = "w-9 h-11" }) => (
  <svg viewBox="0 0 100 120" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 6C41.2 6 34 13.2 34 22C34 25.5 35.2 28.7 37.2 31.2C33.2 33.6 30 38.2 30 43.5C30 48.8 33.2 53.4 37.4 55.8C35.3 58.2 34 61.4 34 65C34 72.8 39.8 79.2 47.5 80.8V84H34C28.5 84 24 88.5 24 94V99H76V94C76 88.5 71.5 84 66 84H52.5V80.8C60.2 79.2 66 72.8 66 65C66 61.4 64.7 58.2 62.6 55.8C66.8 53.4 70 48.8 70 43.5C70 38.2 66.8 33.6 62.8 31.2C64.8 28.7 66 25.5 66 22C66 13.2 58.8 6 50 6ZM47.5 16C47.5 14.6 48.6 13.5 50 13.5C51.4 13.5 52.5 14.6 52.5 16V26H47.5V16ZM40 38C42.8 38 45 40.2 45 43C45 45.8 42.8 48 40 48C37.2 48 35 45.8 35 43C35 40.2 37.2 38 40 38ZM60 38C62.8 38 65 40.2 65 43C65 45.8 62.8 48 60 48C57.2 48 55 45.8 55 43C55 40.2 57.2 38 60 38ZM50 88C57.2 88 63 90.8 63 94H37C37 90.8 42.8 88 50 88ZM28 103H72V107C72 109.2 70.2 111 68 111H32C29.8 111 28 109.2 28 107V103ZM44 113H56V117H44V113Z" />
    <circle cx="50" cy="94" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const DistrictDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('02:15 PM');
  const navigate = useNavigate();

  useEffect(() => {
    loadDistrictData();
    // Format initial current time
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setLastUpdatedTime(formatted);
  }, []);

  const loadDistrictData = async () => {
    setIsLoading(true);
    try {
      const pRes = await api.getProjects({ district: 'Varanasi' });
      if (pRes.success && Array.isArray(pRes.data)) {
        setProjects(pRes.data);
      }
      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    } catch {
      // Handled gracefully by api fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure default primary projects are present for triage matching the design
  const defaultTriageProject = {
    id: 'MPLAD-2026-00124',
    name: 'Rural Road Construction & Paver Block Laying...',
    implementingAgency: 'MPLADS Implementing Agency',
    sanctionedAmount: 4800000,
    riskScore: 61.6,
    actionNeeded: 'Stage-2 Disbursal Pre-Check'
  };

  const displayProjects = projects.length > 0 ? projects : [
    defaultTriageProject,
    {
      id: 'MPLAD-2026-00125',
      name: 'CC Road & Interlocking Drain from Shivpur to Tarna',
      implementingAgency: 'Rural Engineering Dept (RED) Varanasi',
      sanctionedAmount: 3900000,
      riskScore: 34.0,
      actionNeeded: 'Technical Sanction Audit'
    },
    {
      id: 'MPLAD-2026-00089',
      name: 'Digital Smart Classroom Lab & Computer Setup',
      implementingAgency: 'Bihar State Educational Infrastructure',
      sanctionedAmount: 1800000,
      riskScore: 18.0,
      actionNeeded: 'Final Certificate Endorsement'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ======================================================================= */}
      {/* 1. TOP HEADER SECTION (MATCHING media_1789367492438.png)                 */}
      {/* ======================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Left: Ashoka Emblem + Title + District Jurisdiction */}
        <div className="flex items-center gap-3.5">
          <div className="text-[#0B2545] shrink-0">
            <AshokaEmblem className="w-8 h-10 sm:w-9 sm:h-11 drop-shadow-xs" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              District Executive Officer Cockpit
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>Varanasi</span>
              <span className="text-slate-300">•</span>
              <span>District Administration (UP)</span>
            </p>
          </div>
        </div>

        {/* Right: Last Updated Status & + AI Pre-Screening Dark Pill Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Refresh Circle & Last Updated text */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadDistrictData}
              title="Refresh District Cockpit Data"
              className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-slate-400 font-medium block leading-none">Last updated</span>
              <span className="text-xs font-bold text-slate-700 block leading-tight mt-0.5">
                Today, {lastUpdatedTime}
              </span>
            </div>
          </div>

          {/* Dark Navy Pill Button: + AI Pre-Screening */}
          <button
            type="button"
            onClick={() => navigate('/district/pre-screening')}
            className="flex items-center gap-2 bg-[#0B2545] hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm cursor-pointer transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>+ AI Pre-Screening</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. FOUR PASTEL METRIC CARDS (MATCHING media_1789367492438.png)           */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Pending Sanctions (Sky Blue) */}
        <div
          onClick={() => navigate('/district/pending')}
          className="bg-[#EEF6FF] border border-[#DCEBFE] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#DCEBFE] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Pending Sanctions</p>
              <p className="text-3xl font-black text-slate-900 mt-0.5">24</p>
              <p className="text-xs font-semibold text-[#2563EB] mt-1">+4 new today</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
        </div>

        {/* Card 2: SLA Breaches Imminent (Rose Pink) */}
        <div
          onClick={() => navigate('/sla')}
          className="bg-[#FFF1F2] border border-[#FFE2E5] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFE2E5] flex items-center justify-center text-[#E11D48] shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-[#E11D48]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">SLA Breaches Imminent</p>
              <p className="text-3xl font-black text-[#E11D48] mt-0.5">7</p>
              <p className="text-xs font-semibold text-[#E11D48] mt-1">3 critical (&lt;48h)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
        </div>

        {/* Card 3: AI Photo Discrepancies (Soft Amber) */}
        <div
          onClick={() => navigate('/district/photo-validation')}
          className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6 text-[#D97706]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">AI Photo Discrepancies</p>
              <p className="text-3xl font-black text-[#B45309] mt-0.5">13</p>
              <p className="text-xs font-semibold text-[#D97706] mt-1">Requires physical audit</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
        </div>

        {/* Card 4: Certified Completed Works (Soft Emerald) */}
        <div
          onClick={() => navigate('/projects')}
          className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Certified Completed Works</p>
              <p className="text-3xl font-black text-[#15803D] mt-0.5">148</p>
              <p className="text-xs font-semibold text-[#16A34A] mt-1">+12 this month</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 3. ROW 2: TWO OPERATIONAL DESKS (MATCHING media_1789367492438.png)        */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Desk 1: Pre-Screening Desk */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0">
                <Tv className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Pre-Screening Desk</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated 5-point statutory checklist evaluation before fund release
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/district/pre-screening')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold border border-[#BFDBFE] flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <span>Launch Pre-Screening</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* List Rows */}
          <div className="space-y-3 pt-1">
            {/* Row 1: Patna Smart Classroom (PASSED) */}
            <div
              onClick={() => navigate('/district/pre-screening')}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 hover:border-slate-200 transition flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    Patna Digital Smart Classroom (MPLAD-00089)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    All 5 AI integrity checks passed • 18/100 Low Risk
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] text-xs font-bold font-mono tracking-wider shrink-0">
                PASSED
              </span>
            </div>

            {/* Row 2: Varanasi Rural Road (AUDIT REQ) */}
            <div
              onClick={() => navigate('/project/MPLAD-2026-00124')}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 hover:border-slate-200 transition flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    Varanasi Rural Road (MPLAD-00124)
                  </p>
                  <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                    Photo duplicate detected (96%) • 87/100 High Risk
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] text-xs font-bold font-mono tracking-wider shrink-0">
                AUDIT REQ
              </span>
            </div>
          </div>
        </div>

        {/* Desk 2: Photo Evidence Forensic Desk */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FAF5FF] flex items-center justify-center text-[#9333EA] shrink-0">
                <Camera className="w-5 h-5 text-[#9333EA]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Photo Evidence Forensic Desk</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect physical progress geotagged field uploads
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/district/photo-validation')}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#9333EA] text-xs font-bold border border-[#E9D5FF] flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <span>Photo Lab</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* Photo Preview Item */}
          <div className="pt-1">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src="/projects/ruralroad.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80";
                  }}
                  alt="Rural Road Progress Evidence"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">MPLAD-2026-00124</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] text-[10px] font-bold">
                      96% DUPLICATE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-1">
                    Rural Road Construction & Paver Block
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Location: Chiraigaon Block, Varanasi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/district/photo-validation')}
                className="px-4 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold border border-[#BFDBFE] transition cursor-pointer shrink-0"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 4. ROW 3: DISTRICT SANCTION & APPROVAL TRIAGE (MATCHING media_1789367492438.png) */}
      {/* ======================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0">
              <ListFilter className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                District Sanction & Approval Triage
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Projects requiring District Magistrate / Nodal Officer sanction verification
              </p>
            </div>
          </div>
          <Link
            to="/district/pending"
            className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1 transition shrink-0"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Triage Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">Project ID</th>
                <th className="py-3 px-3">Project Name & Agency</th>
                <th className="py-3 px-3">Sanction Amount</th>
                <th className="py-3 px-3">AI Risk Level</th>
                <th className="py-3 px-3">Action Needed</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayProjects.slice(0, 5).map((row, idx) => {
                const score = row.riskScore ?? 61.6;
                const isHighRisk = score >= 60;
                const isMedRisk = score >= 30 && score < 60;

                return (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/project/${row.id}`)}
                  >
                    {/* Project ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-[#2563EB] group-hover:underline whitespace-nowrap">
                      {row.id}
                    </td>

                    {/* Project Name & Agency */}
                    <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                      <p className="font-bold text-slate-900 truncate">{row.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {row.implementingAgency || 'MPLADS Implementing Agency'}
                      </p>
                    </td>

                    {/* Sanction Amount */}
                    <td className="py-3.5 px-3 font-black text-slate-900 font-mono whitespace-nowrap">
                      {formatINR(row.sanctionedAmount || 4800000)}
                    </td>

                    {/* AI Risk Level Pill */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isHighRisk
                            ? 'bg-[#FFF4ED] text-[#EA580C] border border-[#FED7AA]'
                            : isMedRisk
                            ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]'
                            : 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isHighRisk ? 'bg-[#EA580C]' : isMedRisk ? 'bg-[#CA8A04]' : 'bg-[#16A34A]'
                          }`}
                        />
                        <span>{score.toFixed(1)}% {isHighRisk ? 'High Risk' : isMedRisk ? 'Medium' : 'Low'}</span>
                      </span>
                    </td>

                    {/* Action Needed */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-xl bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A] text-xs font-medium">
                        {row.actionNeeded || 'Stage-2 Disbursal Pre-Check'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/district/pre-screening');
                        }}
                        className="bg-[#0B2545] hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
                      >
                        Screen & Decide
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;
