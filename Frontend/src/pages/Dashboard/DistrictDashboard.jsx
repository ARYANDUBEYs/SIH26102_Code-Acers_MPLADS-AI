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



import { PentagonCard } from '../../components/common/PentagonCard';

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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ======================================================================= */}
      {/* 1. TOP HEADER SECTION (MATCHING media_1789367492438.png)                 */}
      {/* ======================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
        {/* Left: Official State Emblem with Satyameva Jayate + Title + District Jurisdiction */}
        <div className="flex items-center gap-3.5">
          <img
            src="/emblem_india.png"
            alt="State Emblem of India"
            className="h-14 w-auto object-contain shrink-0 filter drop-shadow-xs"
          />
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

        {/* Right: Last Updated Status (Adjusted cleanly to the right) */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={loadDistrictData}
            title="Refresh District Cockpit Data"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-medium block leading-none">Last updated</span>
            <span className="text-xs font-bold text-slate-700 block leading-tight mt-0.5">
              Today, {lastUpdatedTime}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. FOUR METRIC CARDS (BankLY Pattern 1)                                   */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Pending Sanctions */}
        <PentagonCard
          index={0}
          onClick={() => navigate('/district/pending')}
          title="Pending Sanctions"
          value="24"
          trend="+4 new today"
          trendPositive={true}
          icon={ShieldCheck}
          variant="purple"
          className="hover:border-blue-400/80"
        />

        {/* Card 2: SLA Breaches Imminent */}
        <PentagonCard
          index={1}
          onClick={() => navigate('/sla')}
          title="SLA Breaches Imminent"
          value="7"
          trend="3 critical (<48h)"
          trendPositive={false}
          icon={Clock}
          variant="danger"
          className="hover:border-rose-400/80"
        />

        {/* Card 3: AI Photo Discrepancies */}
        <PentagonCard
          index={2}
          onClick={() => navigate('/district/photo-validation')}
          title="AI Photo Discrepancies"
          value="13"
          subtitle="Requires physical audit"
          icon={AlertTriangle}
          variant="warning"
          className="hover:border-amber-400/80"
        />

        {/* Card 4: Certified Completed Works */}
        <PentagonCard
          index={3}
          onClick={() => navigate('/projects')}
          title="Certified Completed Works"
          value="148"
          trend="+12 this month"
          trendPositive={true}
          icon={CheckCircle2}
          variant="success"
          className="hover:border-emerald-400/80"
        />
      </div>

      {/* ======================================================================= */}
      {/* 3. ROW 2: TWO OPERATIONAL DESKS (BankLY Pattern 5 & 10)                  */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Desk 1: Pre-Screening Desk */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-blue-100">
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
              className="px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold border border-[#BFDBFE] flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
            >
              <span>Launch Pre-Screening</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* List Rows */}
          <div className="space-y-3 pt-2">
            {/* Row 1: Patna Smart Classroom (PASSED) */}
            <div
              onClick={() => navigate('/district/pre-screening')}
              className="p-4 sm:p-4.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0 ring-4 ring-emerald-50" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Patna Digital Smart Classroom (MPLAD-00089)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
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
              className="p-4 sm:p-4.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shrink-0 ring-4 ring-rose-50" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Varanasi Rural Road (MPLAD-00124)
                  </p>
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF5FF] flex items-center justify-center text-[#9333EA] shrink-0 border border-purple-100">
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
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#9333EA] text-xs font-bold border border-[#E9D5FF] flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
            >
              <span>Photo Lab</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* Photo Preview Item */}
          <div className="pt-2">
            <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src="/projects/ruralroad.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80";
                  }}
                  alt="Rural Road Progress Evidence"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
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
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Location: Chiraigaon Block, Varanasi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/district/photo-validation')}
                className="px-4 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold border border-[#BFDBFE] transition cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 4. ROW 3: DISTRICT SANCTION & APPROVAL TRIAGE (BankLY Pattern 5 & 10)    */}
      {/* ======================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-2">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-blue-100">
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
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Project ID</th>
                <th className="py-3.5 px-4 sm:px-5">Project Name & Agency</th>
                <th className="py-3.5 px-4 sm:px-5">Sanction Amount</th>
                <th className="py-3.5 px-4 sm:px-5">AI Risk Level</th>
                <th className="py-3.5 px-4 sm:px-5">Action Needed</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Action</th>
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
                    <td className="py-4 px-4 sm:px-5 font-mono font-bold text-[#2563EB] group-hover:underline whitespace-nowrap">
                      {row.id}
                    </td>

                    {/* Project Name & Agency */}
                    <td className="py-4 px-4 sm:px-5 max-w-xs sm:max-w-md">
                      <p className="font-bold text-slate-900 truncate">{row.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {row.implementingAgency || 'MPLADS Implementing Agency'}
                      </p>
                    </td>

                    {/* Sanction Amount */}
                    <td className="py-4 px-4 sm:px-5 font-black text-slate-900 font-mono whitespace-nowrap">
                      {formatINR(row.sanctionedAmount || 4800000)}
                    </td>

                    {/* AI Risk Level Pill */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
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
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-xl bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A] text-xs font-medium">
                        {row.actionNeeded || 'Stage-2 Disbursal Pre-Check'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/district/pre-screening');
                        }}
                        className="bg-[#2E1065] hover:bg-purple-900 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
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
