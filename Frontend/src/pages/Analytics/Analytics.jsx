import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  IndianRupee,
  AlertTriangle,
  Layers,
  Filter,
  Download,
  FileSpreadsheet,
  Brain,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { PentagonCard } from '../../components/common/PentagonCard';

export const Analytics = () => {
  const [stateRisks, setStateRisks] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [fraudData, setFraudData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const { showToast } = useApp();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const defaultMonthlyTrends = [
    { month: 'Apr 25', cost: 18, duplicateImage: 12, vendorCartel: 5, delayed: 9, total: 44 },
    { month: 'May 25', cost: 22, duplicateImage: 15, vendorCartel: 7, delayed: 11, total: 55 },
    { month: 'Jun 25', cost: 29, duplicateImage: 19, vendorCartel: 8, delayed: 14, total: 70 },
    { month: 'Jul 25', cost: 35, duplicateImage: 24, vendorCartel: 11, delayed: 19, total: 89 },
    { month: 'Aug 25', cost: 41, duplicateImage: 28, vendorCartel: 13, delayed: 22, total: 104 },
    { month: 'Sep 25', cost: 48, duplicateImage: 32, vendorCartel: 15, delayed: 27, total: 122 },
    { month: 'Oct 25', cost: 56, duplicateImage: 39, vendorCartel: 17, delayed: 31, total: 143 },
    { month: 'Nov 25', cost: 62, duplicateImage: 44, vendorCartel: 19, delayed: 36, total: 161 },
    { month: 'Dec 25', cost: 58, duplicateImage: 41, vendorCartel: 18, delayed: 33, total: 150 },
    { month: 'Jan 26', cost: 51, duplicateImage: 36, vendorCartel: 16, delayed: 29, total: 132 },
    { month: 'Feb 26 (Active)', cost: 44, duplicateImage: 31, vendorCartel: 14, delayed: 24, total: 113 },
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

  const loadAnalytics = async () => {
    try {
      const [stRes, trendRes, fraudRes] = await Promise.all([
        api.getStateRiskData(),
        api.getMonthlyTrends(),
        api.getFraudBreakdown(),
      ]);

      if (stRes.success && stRes.data?.length >= 5) {
        setStateRisks(stRes.data);
      } else {
        setStateRisks(defaultStateRisks);
      }

      if (trendRes.success && trendRes.data?.length > 1) {
        setMonthlyTrends(trendRes.data);
      } else {
        setMonthlyTrends(defaultMonthlyTrends);
      }

      if (fraudRes.success) setFraudData(fraudRes.data);
    } catch {
      setStateRisks(defaultStateRisks);
      setMonthlyTrends(defaultMonthlyTrends);
    }
  };

  const fundUtilizationData = [
    { category: 'Roads & Bridges', sanctioned: 840, released: 620, utilized: 480 },
    { category: 'Drinking Water', sanctioned: 520, released: 450, utilized: 390 },
    { category: 'Education Labs', sanctioned: 430, released: 380, utilized: 350 },
    { category: 'Healthcare PHCs', sanctioned: 390, released: 310, utilized: 240 },
    { category: 'Community Halls', sanctioned: 306, released: 240, utilized: 160 },
  ];

  const riskDistributionData = [
    { name: 'Low Risk (0-30%)', value: 68, color: '#16A34A' },
    { name: 'Medium Risk (31-60%)', value: 20, color: '#D97706' },
    { name: 'High Risk (61-85%)', value: 9, color: '#EA580C' },
    { name: 'Critical Risk (86-100%)', value: 3, color: '#DC2626' },
  ];

  const handleExportCSV = () => {
    if (!stateRisks.length) {
      showToast('No active risk analytics records to export.', 'info');
      return;
    }
    const headers = 'State Code,State Name,Total Projects,High Risk Count,Anomalies Detected,Fraud Risk Percentage\n';
    const rows = stateRisks.map(s => `"${s.code}","${s.state}",${s.totalProjects},${s.highRisk},${s.anomalies},${s.fraudRiskPct}%`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Scheme_Guard_Intelligence_Export_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('National Analytics dataset downloaded as CSV.', 'success');
  };

  return (
    <PageLayout
      title="National Analytics & Anomaly Intelligence"
      subtitle="Clear trends, fund distributions, and risk patterns across all states and work categories."
      breadcrumbs={['Dashboard', 'Analytics']}
      badge={
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
          <img
            src="/emblem_india.png"
            alt="State Emblem of India"
            className="h-8 w-auto object-contain shrink-0 filter drop-shadow-xs"
          />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Government of India</span>
            <span className="text-xs font-mono font-black text-slate-900 tracking-tight leading-tight mt-0.5">MoSPI ANALYTICS CORPS</span>
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExportCSV}
            className="border-gov-border bg-gov-surface hover:bg-gov-subtle text-gov-slateDark font-semibold"
          >
            Export CSV Dataset
          </Button>
        </div>
      }
    >
      {/* 4 Modular KPI Quick Overview Cards (BankLY Pattern 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <PentagonCard
          index={0}
          title="Total Monitored Outlay"
          value="₹2,486 Cr"
          subtitle="FY 2025-26 Active Projects"
          icon={IndianRupee}
          variant="purple"
        />

        <PentagonCard
          index={1}
          title="Normal Low-Risk Works"
          value="88.2%"
          subtitle="Routine Milestone Progress"
          trend="+2.4% vs prev Qtr"
          trendPositive={true}
          icon={ShieldCheck}
          variant="success"
        />

        <PentagonCard
          index={2}
          title="Escrow Hold Required"
          value="42 Works"
          subtitle="High/Critical Priority Flags"
          trend="-5 remediated"
          trendPositive={true}
          icon={AlertTriangle}
          variant="danger"
        />

        <PentagonCard
          index={3}
          title="Remediation Turnaround"
          value="6.4 Days"
          subtitle="From Flag to Sign-off"
          trend="-1.2 days speedup"
          trendPositive={true}
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      {/* Top Filter Bar (BankLY Pattern 2 & 10) */}
      <ScrollReveal>
      <div className="p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-wrap items-center gap-4 shadow-xs mb-8">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <Filter className="w-4 h-4" />
          </div>
          <span>Filters:</span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[300px]">
          <Dropdown
            label="Fiscal Year"
            value={selectedYear}
            onChange={setSelectedYear}
            options={[
              { value: '2025-26', label: 'FY 2025-26 (Active Monitoring)' },
              { value: '2024-25', label: 'FY 2024-25 (Archived)' },
              { value: '2023-24', label: 'FY 2023-24 (Audited)' },
            ]}
          />

          <Dropdown
            label="State Focus"
            value={selectedState}
            onChange={setSelectedState}
            options={[
              { value: 'ALL', label: 'All 28 States & UTs' },
              { value: 'UP', label: 'Uttar Pradesh' },
              { value: 'BR', label: 'Bihar' },
              { value: 'MH', label: 'Maharashtra' },
              { value: 'RJ', label: 'Rajasthan' },
              { value: 'DL', label: 'Delhi UT' },
            ]}
          />

          <Dropdown
            label="Work Category"
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'ALL', label: 'All Project Types' },
              { value: 'ROADS', label: 'Roads & Bridges' },
              { value: 'WATER', label: 'Drinking Water & RO' },
              { value: 'HEALTH', label: 'Public Health (PHCs)' },
              { value: 'EDU', label: 'Education & Community' },
            ]}
          />
        </div>
      </div>
      </ScrollReveal>

      {/* Analytics Charts Grid */}
      <ScrollReveal delay={0.15}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Monthly Anomaly Trends (ComposedChart with Area & Line) */}
        <Card
          title="Monthly Anomaly Velocity Trends (FY 25-26)"
          subtitle="Multi-vector time series of caught cost inflations, duplicate images, and cartel alerts"
          icon={TrendingUp}
          className="lg:col-span-8"
          action={
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Cost Drift
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Duplicate Photos
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Cartel Rings
              </span>
            </div>
          }
        >
          <div className="h-[340px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrends} margin={{ top: 12, right: 12, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="dupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val, name) => [`${val} Cases Detected`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#2563EB" fillOpacity={1} fill="url(#costGrad)" name="Cost Discrepancies" strokeWidth={2.5} />
                <Area type="monotone" dataKey="duplicateImage" stroke="#E11D48" fillOpacity={1} fill="url(#dupGrad)" name="Duplicate Image Flags" strokeWidth={2.5} />
                <Line
                  type="monotone"
                  dataKey="vendorCartel"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#D97706', stroke: '#FFF', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#D97706', stroke: '#FFF', strokeWidth: 2 }}
                  name="Cartel Collusion"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Contextual Annotation (BankLY Pattern 6) */}
          <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-3 text-xs text-slate-700">
            <div className="p-1 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">Surveillance Telemetry: </span>
              <span>
                Continuous monthly tracking of anomaly flags. Blue tracks invoices exceeding standard schedule rates, red catches identical photographic reuse across works, and orange highlights contractor bid collusion rings.
              </span>
            </div>
          </div>
        </Card>

        {/* Chart 2: National Risk Distribution (Pie - BankLY Pattern 4) */}
        <Card
          title="National Risk Portfolio Segmentation"
          subtitle="Proportion of monitored portfolio across algorithmic risk bands"
          icon={PieIcon}
          className="lg:col-span-4"
        >
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={102}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}% of Monitored Works`, 'Portfolio Share']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black font-mono fill-slate-900">
                  12,482
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold uppercase tracking-widest fill-slate-500">
                  Total Works
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-3 border-t border-slate-100 pt-3">
            {riskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800 text-[11px] truncate">{item.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 shrink-0 ml-1 text-xs">{item.value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
            <span className="text-sm shrink-0">💡</span>
            <p className="leading-relaxed">
              <strong className="text-slate-800">Portfolio Health:</strong> Over 88% of monitored works are within normal operational baselines. Only the 3% critical tier is placed under automated escrow hold for direct collector verification.
            </p>
          </div>
        </Card>

        {/* Chart 3: Fund Utilization by Category */}
        <Card
          title="Fund Utilization by Work Sector (₹ Crores)"
          subtitle="Comparing sanctioned allocations against vendor release and physical MB certification"
          icon={IndianRupee}
          className="lg:col-span-6"
          action={
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                Sanctioned
              </span>
              <span className="flex items-center gap-1.5 text-sky-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                Released
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Utilized
              </span>
            </div>
          }
        >
          <div className="h-[370px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundUtilizationData} barGap={5} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="sanctGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="relGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="category" stroke="#475569" fontSize={11} fontWeight={600} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#64748B" fontSize={12} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Crores`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="sanctioned" fill="url(#sanctGrad)" name="Sanctioned Outlay" barSize={16} radius={[4, 4, 0, 0]} />
                <Bar dataKey="released" fill="url(#relGrad)" name="Released (PFMS)" barSize={16} radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" fill="url(#utilGrad)" name="Physical MB Utilized" barSize={16} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3 text-xs text-slate-700">
            <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">Expenditure Health: </span>
              <span>
                Roads & Bridges and Drinking Water receive the largest share of sanctioned development. The green bar ensures that public disbursements closely follow verified on-site milestone progress.
              </span>
            </div>
          </div>
        </Card>

        {/* Chart 4: Anomalies by State */}
        <Card
          title="Regional Anomaly Density by State"
          subtitle="Distribution of flagged works across major jurisdictions"
          icon={BarChart3}
          className="lg:col-span-6"
          action={
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Operational
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Critical Flags
              </span>
            </div>
          }
        >
          <div className="h-[370px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} barGap={6} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="stateAnomAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="stateCritRose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="code" stroke="#475569" fontSize={12} fontWeight={600} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#64748B" fontSize={12} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val, name) => [`${val} Projects`, name]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="anomalies" fill="url(#stateAnomAmber)" barSize={22} radius={[4, 4, 0, 0]} name="Total Anomalies" />
                <Bar dataKey="highRisk" fill="url(#stateCritRose)" barSize={22} radius={[4, 4, 0, 0]} name="Critical Triage Flags" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-slate-700">
            <div className="p-1 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">State Oversight: </span>
              <span>
                States with higher sanction volumes naturally record more automated checks. Critical red flags highlight works that require expedited field inspection by district collectors.
              </span>
            </div>
          </div>
        </Card>
      </div>
      </ScrollReveal>
    </PageLayout>
  );
};

export default Analytics;
