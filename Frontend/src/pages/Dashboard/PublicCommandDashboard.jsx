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

import { ScrollReveal } from '../../components/common/ScrollReveal';

export const PublicCommandDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Public Transparency KPIs with crystal-clear professional layman explanations
  const publicKPIs = [
    {
      title: 'Total Monitored Public Funds',
      value: '₹83,336 Cr',
      subtitle: 'Every rupee allocated across 543 Lok Sabha Constituencies verified via PFMS banking escrows.',
      icon: Building2,
      color: 'border-l-blue-600 bg-blue-50/40 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200',
    },
    {
      title: 'Public Works Under Surveillance',
      value: '8,420 Works',
      subtitle: 'Schools, drinking water plants, roads, and hospitals actively verified with GPS geotags.',
      icon: Eye,
      color: 'border-l-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200',
    },
    {
      title: 'Forensic Photo Checks Passed',
      value: '96.4%',
      subtitle: 'Physical construction photos confirmed authentic against national duplicate image archives.',
      icon: ShieldCheck,
      color: 'border-l-teal-600 bg-teal-50/40 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200',
    },
    {
      title: 'Citizen Grievances Resolved',
      value: '88.2%',
      subtitle: '312 out of 354 public reports formally inspected and resolved by District Magistrates.',
      icon: MessageSquareWarning,
      color: 'border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200',
    },
  ];

  // Coherent & easy-to-understand dataset for Category Fund Utilization
  const categoryFundsData = [
    { name: 'Roads & Bridges', funds: 3420, desc: 'Connectivity in rural & tribal hamlets' },
    { name: 'Drinking Water & RO', funds: 2150, desc: 'Clean tap water pipelines & community RO plants' },
    { name: 'Education & Smart Labs', funds: 1680, desc: 'Government school classrooms & digital smart labs' },
    { name: 'Health PHCs & Clinics', funds: 1240, desc: 'Primary health centers & diagnostic equipment' },
    { name: 'Community Halls', funds: 890, desc: 'Public civic spaces & social gathering centres' },
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
      summary: 'Solar plant fully operational with clean water supply running to 400 households.',
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
      summary: '20 computer workstations installed and connected to high-speed broadband.',
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
      summary: 'Bituminous layer laid down; final surface grading under inspection.',
    },
  ];

  return (
    <PageLayout
      title="MoSPI Central Command — Public Transparency & Vigilance Portal"
      subtitle="Open Citizen Intelligence & Oversight: Real-time public tracking of MPLADS developmental expenditures across India"
      breadcrumbs={['Civil Command', 'Public Transparency']}
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/public/report')}
            icon={MessageSquareWarning}
            className="border-amber-400 text-amber-800 hover:bg-amber-50 cursor-pointer hidden sm:flex"
          >
            Report Grievance
          </Button>
          <Link
            to="/public/map"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B2545] hover:bg-[#081D37] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Map</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Public Transparency Banner */}
        <ScrollReveal>
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Sovereign Public Fund Transparency Engine</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Live Telemetry
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Every rupee allocated across all 543 Lok Sabha Constituencies is tracked with satellite GPS geotags, authentic progress photography, and public citizen audit logs.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Public Transparency Metric Cards */}
        <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {publicKPIs.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm border-l-4 ${kpi.color} space-y-2 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {kpi.title}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {kpi.subtitle}
                </p>
              </div>
            );
          })}
        </div>
        </ScrollReveal>

        {/* Two-Column Structured Charts Section */}
        <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          
          {/* Chart 1: Sector-Wise Development Fund Flow (Left 7 Cols) */}
          <div className="lg:col-span-7 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Public Fund Expenditure by Developmental Category</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct breakdown of developmental funds allocated across core community sectors (in ₹ Crores).
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                FY 2024-26
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryFundsData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B2545', borderColor: '#1E3A5F', borderRadius: '8px', fontSize: '12px', color: '#FFF' }}
                    formatter={(value) => [`₹${value} Crores`, 'Sanctioned Funds']}
                  />
                  <Bar dataKey="funds" fill="#2563EB" radius={[4, 4, 0, 0]} name="Sanctioned Funds (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Explanatory Cards underneath Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {categoryFundsData.slice(0, 4).map((c, i) => (
                <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">{c.name}: </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      {c.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: State Transparency & Verification Rate (Right 5 Cols) */}
          <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>State Public Verification Leaderboard</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  States ranked by proportion of verified, geotagged community development works.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {stateTransparencyData.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{st.state} ({st.code})</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{st.transparencyScore}% Verified</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${st.transparencyScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{st.verified} of {st.works} works verified</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Audited & Clean</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Recent Transparent Works Directory */}
        <ScrollReveal delay={0.3}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Citizen Project Verification Stream</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Live Public Feed
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Constituency projects with audited photographic proof, public expenditure ledger, and GPS verification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/public/search"
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Search All Works</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all space-y-3 group cursor-pointer shadow-xs"
                onClick={() => navigate(`/project/${p.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {p.id}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.verificationDate}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{p.district}, {p.state}</span>
                  </p>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Disbursed:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{formatINR(p.spent)}</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 leading-snug">
                    {p.summary}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <StatusBadge status={p.status} />
                  <span className="text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>

      </div>
    </PageLayout>
  );
};
