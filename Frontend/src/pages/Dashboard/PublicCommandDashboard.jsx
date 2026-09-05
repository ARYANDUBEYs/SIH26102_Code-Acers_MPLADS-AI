import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Eye,
  MapPin,
  TrendingUp,
  Search,
  MessageSquareWarning,
  Info,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Layers,
  HelpCircle,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const PublicCommandDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mode: Layman View vs Industry Expert Audit Mode
  const [viewMode, setViewMode] = useState('layman'); // 'layman' | 'expert'
  const [selectedState, setSelectedState] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Public Transparency KPIs
  const publicKPIs = [
    {
      title: 'Total Monitored Public Funds',
      value: '₹83,336 Cr',
      laymanSub: 'Every rupee allocated to 543 Lok Sabha Constituencies',
      expertSub: 'PFMS SNA Escrow reconciliations for FY 2024-26',
      icon: Building2,
      color: 'border-l-blue-600 bg-blue-50/40 text-blue-900',
    },
    {
      title: 'Public Works Under Surveillance',
      value: '8,420 Works',
      laymanSub: 'Schools, roads, water plants, and hospitals tracked',
      expertSub: '100% Geotagged MB (Measurement Book) entries indexed',
      icon: Eye,
      color: 'border-l-emerald-600 bg-emerald-50/40 text-emerald-900',
    },
    {
      title: 'Forensic Photo Checks Passed',
      value: '96.4%',
      laymanSub: 'Verified genuine site construction photos',
      expertSub: 'dHash 64-bit perceptual similarity hamming distance > 10',
      icon: ShieldCheck,
      color: 'border-l-teal-600 bg-teal-50/40 text-teal-900',
    },
    {
      title: 'Citizen Grievances Resolved',
      value: '88.2%',
      laymanSub: '312 out of 354 public reports addressed by officers',
      expertSub: 'Mean SLA turnaround time: 4.2 days vs statutory 7 days',
      icon: MessageSquareWarning,
      color: 'border-l-amber-500 bg-amber-50/40 text-amber-900',
    },
  ];

  // Invented but coherent & easy-to-understand dataset for Category Fund Utilization
  const categoryFundsData = [
    { name: 'Roads & Bridges', funds: 3420, laymanDesc: 'Connectivity in rural & tribal hamlets', expertMetric: 'IRC-SP-20 Standards Compliance' },
    { name: 'Drinking Water & RO', funds: 2150, laymanDesc: 'Clean tap water pipelines & borewells', expertMetric: 'Jal Jeevan Mission Synergy' },
    { name: 'Education & Smart Labs', funds: 1680, laymanDesc: 'Government school classrooms & computers', expertMetric: 'DISE Asset Verification' },
    { name: 'Health PHCs & Clinics', funds: 1240, laymanDesc: 'Primary health centers & diagnostic tools', expertMetric: 'IPHS Norms Alignment' },
    { name: 'Community Halls', funds: 890, laymanDesc: 'Public spaces for social gatherings', expertMetric: 'Civic Asset Registry 2025' },
  ];

  // State-wise Transparency & Citizen Oversight Index
  const stateTransparencyData = [
    { state: 'Uttar Pradesh', code: 'UP', works: 1420, verified: 1360, transparencyScore: 94 },
    { state: 'Maharashtra', code: 'MH', works: 1180, verified: 1140, transparencyScore: 96 },
    { state: 'Tamil Nadu', code: 'TN', works: 980, verified: 965, transparencyScore: 98 },
    { state: 'West Bengal', code: 'WB', works: 920, verified: 860, transparencyScore: 91 },
    { state: 'Bihar', code: 'BR', works: 890, verified: 810, transparencyScore: 88 },
    { state: 'Rajasthan', code: 'RJ', works: 760, verified: 720, transparencyScore: 93 },
    { state: 'Gujarat', code: 'GJ', works: 710, verified: 695, transparencyScore: 97 },
    { state: 'Madhya Pradesh', code: 'MP', works: 690, verified: 640, transparencyScore: 90 },
  ];

  // Recent Transparent Community Projects
  const publicProjects = [
    {
      id: 'MPLAD-2026-00142',
      title: 'Solar Powered Drinking Water Plant',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      sanctioned: 2400000,
      spent: 2150000,
      status: 'VERIFIED',
      verificationDate: 'Yesterday',
      laymanSummary: 'Solar plant functional with clean water supply running to 400 households.',
      expertSummary: 'OpenCV dHash verified; zero pixel replication against regional water repository.',
    },
    {
      id: 'MPLAD-2026-00188',
      title: 'Composite High School Digital Smart Lab',
      district: 'Pune',
      state: 'Maharashtra',
      sanctioned: 1850000,
      spent: 1850000,
      status: 'COMPLETED',
      verificationDate: '3 days ago',
      laymanSummary: '20 computer workstations installed and connected to high-speed broadband.',
      expertSummary: 'Asset serial numbers cross-checked with GeM procurement invoice DB.',
    },
    {
      id: 'MPLAD-2026-00204',
      title: 'All-Weather Rural Link Road (KM 0 to 4.2)',
      district: 'Jaipur',
      state: 'Rajasthan',
      sanctioned: 4200000,
      spent: 3100000,
      status: 'IN_PROGRESS',
      verificationDate: '5 days ago',
      laymanSummary: 'Bituminous layer laid down; final surface grading under inspection.',
      expertSummary: 'Milestone 2 certified via drone orthomosaic imagery; financial drift normal (+0.4%).',
    },
  ];

  return (
    <PageLayout
      title="MoSPI Central Command — Public Transparency & Vigilance Portal"
      subtitle="Open Citizen Intelligence & Oversight: Real-time public tracking of MPLADS developmental expenditures across India"
      breadcrumbs={['Civil Command', 'Public Transparency']}
      actions={
        <div className="flex items-center gap-3">
          {/* Layman vs Industry Expert Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-300 rounded-lg shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('layman')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'layman'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌱 Citizen / Layman Mode
            </button>
            <button
              type="button"
              onClick={() => setViewMode('expert')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'expert'
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>🔬 Industry Expert / Audit Mode</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/public/report')}
            icon={MessageSquareWarning}
            className="border-amber-400 text-amber-800 hover:bg-amber-50 cursor-pointer hidden sm:flex"
          >
            Report Grievance
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Explainability Banner for Layman vs Expert */}
        <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{viewMode === 'layman' ? 'Viewing in Simplified Layman Mode' : 'Viewing in Full Technical & Algorithmic Audit Mode'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                  {viewMode === 'layman' ? 'Plain Language' : 'Mathematical Formulas Active'}
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {viewMode === 'layman'
                  ? 'Complex government statistics are translated into plain everyday terms so every citizen can track how their local MP uses development funds without needing an engineering degree.'
                  : 'Exposing exact forensic coefficients, OpenCV 64-bit dHash perceptual Hamming distance thresholds, NetworkX HHI cartel indices, and PFMS SNA Escrow banking reconciliations.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <Link
              to="/public/map"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B2545] hover:bg-[#081D37] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Geospatial Map</span>
            </Link>
          </div>
        </div>

        {/* 4 Public Transparency Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {publicKPIs.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm border-l-4 ${kpi.color} space-y-2 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{kpi.title}</span>
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black font-mono tracking-tight text-slate-900">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {viewMode === 'layman' ? kpi.laymanSub : kpi.expertSub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two-Column Structured Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          
          {/* Chart 1: Sector-Wise Development Fund Flow (Left 7 Cols) */}
          <div className="lg:col-span-7 min-w-0 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Public Fund Expenditure by Developmental Category</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewMode === 'layman'
                    ? 'Where are your tax rupees going? Breakdown in ₹ Crores.'
                    : 'Reconciled Central SNA Escrow payouts categorized by CPWD / MoSPI Sector Schemas.'}
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded">
                FY 2024-26
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryFundsData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value) => [`₹${value} Crores`, 'Sanctioned Funds']}
                  />
                  <Bar dataKey="funds" fill="#2563EB" radius={[4, 4, 0, 0]} name="Sanctioned Funds (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Explanatory Cards underneath Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {categoryFundsData.slice(0, 4).map((c, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <div>
                    <strong className="text-slate-900">{c.name}: </strong>
                    <span className="text-slate-600">
                      {viewMode === 'layman' ? c.laymanDesc : c.expertMetric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: State Transparency & Verification Rate (Right 5 Cols) */}
          <div className="lg:col-span-5 min-w-0 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>State Public Verification Leaderboard</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewMode === 'layman'
                    ? 'States with highest rate of photo-verified community works'
                    : 'Composite dHash Image & GPS Consistency Ratio (%)'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {stateTransparencyData.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{st.state} ({st.code})</span>
                    <span className="font-mono text-emerald-700">{st.transparencyScore}% Verified</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${st.transparencyScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{st.verified} of {st.works} works verified</span>
                    <span>{viewMode === 'layman' ? 'Zero fraud flags' : 'HHI < 1200'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transparent Works Directory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Citizen Project Verification Stream</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  Live Public Feed
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Constituency projects with audited photographic proof and public contractor contracts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/public/search"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search All Works</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3 group cursor-pointer shadow-xs"
                onClick={() => navigate(`/project/${p.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {p.id}
                  </span>
                  <span className="text-[10px] text-slate-500">{p.verificationDate}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{p.district}, {p.state}</span>
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Disbursed:</span>
                    <strong className="font-mono text-slate-900">{formatINR(p.spent)}</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-snug">
                    {viewMode === 'layman' ? p.laymanSummary : p.expertSummary}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <StatusBadge status={p.status} />
                  <span className="text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
