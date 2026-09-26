import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { DashboardStats } from '../../features/dashboard/DashboardStats';
import { DrillDownSlideOver } from '../../components/ui/DrillDownSlideOver';
import { SarvamIndicModal } from '../../components/sarvam/SarvamIndicModal';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Camera,
  Network,
  RefreshCw,
  ChevronRight,
  FileSpreadsheet,
  SlidersHorizontal,
  Sparkles
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
  CartesianGrid
} from 'recharts';

import { ScrollReveal } from '../../components/common/ScrollReveal';



export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [kpis, setKpis] = useState(null);
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const FRAUD_COLOR_MAP = {
    'Duplicate Evidence': '#E11D48',
    'Cost / Financial Anomalies': '#7E22CE',
    'Vendor Concentration': '#D97706',
    'Timeline / Overrun Risk': '#2563EB',
  };

  const defaultFraudData = [
    { name: 'Duplicate Evidence', value: 38, count: 70, color: '#E11D48' },
    { name: 'Cost / Financial Anomalies', value: 31, count: 57, color: '#7E22CE' },
    { name: 'Vendor Concentration', value: 19, count: 35, color: '#D97706' },
    { name: 'Timeline / Overrun Risk', value: 12, count: 21, color: '#2563EB' },
  ];

  const defaultStateRisks = [
    { code: 'UP', state: 'Uttar Pradesh', totalProjects: 80, anomalies: 28, highRisk: 11, fraudRiskPct: 14 },
    { code: 'MH', state: 'Maharashtra', totalProjects: 48, anomalies: 19, highRisk: 8, fraudRiskPct: 17 },
    { code: 'WB', state: 'West Bengal', totalProjects: 42, anomalies: 16, highRisk: 6, fraudRiskPct: 14 },
    { code: 'BR', state: 'Bihar', totalProjects: 40, anomalies: 18, highRisk: 7, fraudRiskPct: 18 },
    { code: 'TN', state: 'Tamil Nadu', totalProjects: 39, anomalies: 9, highRisk: 3, fraudRiskPct: 8 },
    { code: 'MP', state: 'Madhya Pradesh', totalProjects: 29, anomalies: 12, highRisk: 5, fraudRiskPct: 17 },
    { code: 'KA', state: 'Karnataka', totalProjects: 28, anomalies: 10, highRisk: 4, fraudRiskPct: 14 },
    { code: 'GJ', state: 'Gujarat', totalProjects: 26, anomalies: 8, highRisk: 3, fraudRiskPct: 12 },
    { code: 'RJ', state: 'Rajasthan', totalProjects: 25, anomalies: 14, highRisk: 6, fraudRiskPct: 24 },
    { code: 'DL', state: 'Delhi UT', totalProjects: 7, anomalies: 4, highRisk: 2, fraudRiskPct: 29 },
  ];

  const [stateRisks, setStateRisks] = useState(defaultStateRisks);
  const [fraudData, setFraudData] = useState(defaultFraudData);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Slide-over & voice modal state
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [kpiRes, hrRes, stateRes, fraudRes, trendRes] = await Promise.all([
        api.getNationalKPIs(),
        api.getHighRiskProjects(),
        api.getStateRiskData(),
        api.getFraudBreakdown(),
        api.getMonthlyTrends(),
      ]);

      if (kpiRes.success) setKpis(kpiRes.data);
      if (hrRes.success) setHighRiskProjects(hrRes.data);
      if (stateRes.success && stateRes.data?.length >= 8) {
        setStateRisks(stateRes.data);
      } else {
        setStateRisks(defaultStateRisks);
      }

      if (fraudRes.success && Array.isArray(fraudRes.data) && fraudRes.data.length > 0) {
        const totalRaw = fraudRes.data.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
        const enriched = fraudRes.data.map((item, idx) => {
          const color = item.color || FRAUD_COLOR_MAP[item.name] || ['#E11D48', '#7E22CE', '#D97706', '#2563EB'][idx % 4];
          const pct = totalRaw > 0 ? Math.round(((Number(item.value) || 1) / totalRaw) * 100) : defaultFraudData[idx]?.value || 25;
          const count = Math.round((pct / 100) * 183);
          return {
            ...item,
            color,
            value: pct,
            count,
          };
        });
        setFraudData(enriched);
      } else {
        setFraudData(defaultFraudData);
      }

      if (trendRes.success) setMonthlyTrends(trendRes.data);
    } catch {
      setStateRisks(defaultStateRisks);
      setFraudData(defaultFraudData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSlideOver = (project = null) => {
    setSelectedProject(project);
    setIsSlideOverOpen(true);
  };

  const highRiskColumns = [
    {
      header: t('table_work_id', 'Work ID'),
      accessor: 'id',
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleOpenSlideOver(row);
          }}
          className="font-mono text-xs font-bold text-blue-700 hover:underline cursor-pointer"
        >
          {row.id}
        </span>
      ),
    },
    {
      header: t('table_desc_constituency', 'Description & Constituency'),
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-slate-500">{row.district}, {row.state}</p>
        </div>
      ),
    },
    {
      header: t('table_sanction_value', 'Sanction Value'),
      accessor: 'sanctionedAmount',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-800">{formatINR(row.sanctionedAmount)}</span>
      ),
    },
    {
      header: t('table_composite_risk', 'Composite Risk'),
      accessor: 'riskScore',
      cell: (row) => <RiskBadge score={row.riskScore} />,
    },
    {
      header: 'Forensic Anomaly',
      accessor: 'anomalies',
      cell: (row) => (
        <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          {row.anomalies?.[0]?.title || 'Multi-factor Anomaly'}
        </span>
      ),
    },
    {
      header: t('table_status', 'Audit Status'),
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: t('table_actions', 'Action'),
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenSlideOver(row);
          }}
          className="text-xs border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          {t('btn_audit', 'Audit Dossier')}
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title={t('nav_exec_dashboard', 'National Oversight Dashboard')}
      subtitle="AI-Powered Continuous Forensic Vigilance & Public Fund Integrity Command for e-SAKSHI."
      badge={
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
          <img
            src="/emblem_india.png"
            alt="State Emblem of India"
            className="h-8 w-auto object-contain shrink-0 filter drop-shadow-xs"
          />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Government of India</span>
            <span className="text-xs font-mono font-black text-slate-900 tracking-tight leading-tight mt-0.5">MoSPI CENTRAL AUDIT</span>
          </div>
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDashboardData}
            icon={RefreshCw}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {t('btn_refresh', 'Refresh Feed')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/risk-map')}
            icon={MapPin}
            className="bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
          >
            {t('nav_risk_map', 'National Risk Map')}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 6 Executive KPI Cards */}
        <DashboardStats kpis={kpis || undefined} />

        {/* Critical Urgent Investigation Alert Banner with Concise Plain Language (Pattern 6) */}
        <ScrollReveal delay={0.1}>
          <div className="p-6 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 border-l-4 border-l-rose-600 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider font-mono">
                    CRITICAL FORENSIC DISCREPANCY DETECTED
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 rounded-md font-bold">
                    87% RISK SCORE
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Project MPLAD-2026-00124: Rural Road Construction & Flood Drainage (₹48.5 Lakhs)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  ⚠️ <span className="font-semibold text-rose-700">Audit Finding:</span> Contractor uploaded a duplicate site photo matching another project 400km away in Jaunpur. Estimated costs exceed standard schedule of rates by 42%, and tender bidding shows high contractor cartel concentration.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleOpenSlideOver({
                  id: 'MPLAD-2026-00124',
                  name: 'Rural Road Construction & Flood Drainage',
                  constituency: 'Varanasi',
                  district: 'Varanasi',
                  state: 'Uttar Pradesh',
                  sanctionedAmount: 4800000,
                  disbursedAmount: 4100000,
                  physicalProgress: 38,
                  riskScore: 87,
                  contractor: 'Apex Infra & BuildTech Pvt Ltd',
                  hhiScore: 2840,
                  warningTags: ['DUPLICATE_PHOTO_DHASH_EXACT', 'HHI_CARTEL_SYNDICATE_MONOPOLY', 'SLA_BREACH_IMMUTABLE']
                })}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto text-xs font-bold rounded-xl"
              >
                {t('btn_audit', 'Audit Dossier')}
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Charts Grid */}
        <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0">
        {/* State Anomaly Bar Chart */}
        <Card
          title="Detected Anomalies by State"
          subtitle="Distribution of operational, timeline, and photo anomalies"
          icon={AlertTriangle}
          className="lg:col-span-7"
          action={
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Operational
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  Critical Flags
                </span>
              </div>
              <Link to="/analytics" className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold">
                <span>Detailed Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          }
        >
          <div className="h-[350px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} barGap={5} margin={{ top: 16, right: 16, left: -10, bottom: 6 }}>
                <defs>
                  <linearGradient id="adminAnomBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="adminCritRose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="code" stroke="#475569" fontSize={12} fontWeight={600} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#64748B" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val, name) => [`${val} Detected Issues`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="anomalies" fill="url(#adminAnomBlue)" barSize={18} radius={[4, 4, 0, 0]} name="Operational Anomalies" />
                <Bar dataKey="highRisk" fill="url(#adminCritRose)" barSize={18} radius={[4, 4, 0, 0]} name="Critical Audit Flags" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Fraud vs Inefficiency Donut Chart */}
        <Card
          title="Fraud vs Inefficiency Breakdown"
          subtitle="Taxonomy of flagged public expenditure risks"
          icon={AlertOctagon}
          className="lg:col-span-5"
        >
          <div className="h-[265px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fraudData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fraudData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val}% Portfolio Risk (${item?.payload?.count || Math.round((val/100)*183)} works)`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black font-mono fill-slate-900">
                  183
                </text>
                <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-bold uppercase tracking-wider fill-slate-500">
                  Total Flags
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700 mt-2 border-t border-slate-100 pt-3">
            {fraudData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/80 font-medium">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-slate-800 font-bold text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono font-black text-slate-900 shrink-0 ml-1.5 text-xs">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </ScrollReveal>

      {/* Priority High-Risk Queue */}
      <ScrollReveal delay={0.15}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Priority High-Risk Triage Queue</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {highRiskProjects.length} Projects Flagged
              </span>
            </h3>
            <p className="text-xs text-slate-500">Prioritized automatically based on duplicate photos, fund discrepancies, contractor cartels, and project delays.</p>
          </div>

          <Link to="/high-risk">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right" className="border-slate-200 hover:bg-slate-50 text-slate-700 text-xs">
              View All 42 Flagged Works
            </Button>
          </Link>
        </div>

        <Table
          columns={highRiskColumns}
          data={highRiskProjects}
          isLoading={isLoading}
          onRowClick={(row) => handleOpenSlideOver(row)}
          rowsPerPage={5}
        />
      </div>
      </ScrollReveal>

      {/* Quick Navigation Panels */}
      <ScrollReveal delay={0.2}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/risk-map')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{t('nav_risk_map', 'National Risk Heatmap')}</h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">Live map of project locations, risk clusters, and delays across all states</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
        </div>

        <div
          onClick={() => navigate('/cartel-matrix')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{t('nav_cartel_matrix', 'Vendor Cartel Matrix')}</h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">Identifies contractor rings, shared directors, and repeat tender wins</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
        </div>

        <div
          onClick={() => navigate('/evidence')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">{t('nav_evidence_lab', 'AI Forensic Evidence Lab')}</h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">Detects duplicate or manipulated completion photos across projects</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
        </div>
      </div>
      </ScrollReveal>
      </div>

      {/* Drill-Down Audit Slide-Over Sheet */}
      <DrillDownSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        project={selectedProject}
      />

      {/* Sarvam Sovereign Indic Voice Modal */}
      <SarvamIndicModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </PageLayout>
  );
};
