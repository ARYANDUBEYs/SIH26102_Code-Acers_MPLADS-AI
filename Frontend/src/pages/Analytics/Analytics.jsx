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
    link.setAttribute('download', `MPLADS_AI_Intelligence_Export_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('National Analytics dataset downloaded as CSV.', 'success');
  };

  return (
    <PageLayout
      title="National Analytics & Anomaly Intelligence"
      subtitle="Multi-dimensional algorithmic breakdown of MPLADS expenditures, risk distributions, and forensic anomaly vectors."
      breadcrumbs={['Dashboard', 'Analytics']}
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
      {/* Top Filter Bar */}
      <ScrollReveal>
      <div className="p-3.5 bg-gov-surface border border-gov-border rounded-md flex flex-wrap items-center gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider">
          <Filter className="w-4 h-4 text-gov-blue" />
          <span>Filters:</span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-[300px]">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Monthly Anomaly Trends (ComposedChart with Area & Line) */}
        <Card
          title="Monthly Forensic Anomaly Trends (FY 25-26)"
          subtitle="Time-series progression of caught cost inflations, duplicate images, and cartel alerts"
          icon={TrendingUp}
          className="lg:col-span-8"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  formatter={(val, name) => [`${val} Cases Detected`, name]}
                  contentStyle={{ backgroundColor: '#0B2545', borderColor: '#1E3A5F', borderRadius: '6px', fontSize: '12px', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="cost" stroke="#1D4ED8" fillOpacity={1} fill="url(#costGrad)" name="Cost Discrepancies" strokeWidth={2} />
                <Area type="monotone" dataKey="duplicateImage" stroke="#DC2626" fillOpacity={1} fill="url(#dupGrad)" name="Duplicate Image Flags" strokeWidth={2} />
                <Line type="monotone" dataKey="vendorCartel" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Cartel Collusion" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Contextual Annotation */}
          <div className="mt-3 p-2.5 bg-blue-50/70 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900/40 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 dark:text-blue-200">Surveillance Telemetry: </span>
              <span>
                Continuous monthly tracking of anomaly flags. Blue tracks invoices exceeding standard schedule rates, red catches identical photographic reuse across works, and orange highlights contractor bid collusion rings.
              </span>
            </div>
          </div>
        </Card>

        {/* Chart 2: National Risk Distribution (Pie) */}
        <Card
          title="National Risk Portfolio Segmentation"
          subtitle="Proportion of monitored portfolio across algorithmic risk bands"
          icon={PieIcon}
          className="lg:col-span-4"
        >
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}% of Monitored Works`, 'Portfolio Share']}
                  contentStyle={{ backgroundColor: '#0B2545', borderColor: '#1E3A5F', borderRadius: '6px', fontSize: '12px', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs mt-2 border-t border-slate-200 dark:border-slate-800 pt-3">
            {riskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-200 dark:border-slate-700">
            💡 <strong>Portfolio Health:</strong> Over 88% of monitored works are within normal operational baselines. Only the 3% critical tier is placed under automated escrow hold for direct collector verification.
          </p>
        </Card>

        {/* Chart 3: Fund Utilization by Category */}
        <Card
          title="Fund Utilization by Work Sector (₹ Crores)"
          subtitle="Comparing sanctioned allocations against vendor release and physical MB certification"
          icon={IndianRupee}
          className="lg:col-span-6"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundUtilizationData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Crores`, name]}
                  contentStyle={{ backgroundColor: '#0B2545', borderColor: '#1E3A5F', borderRadius: '6px', fontSize: '12px', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="sanctioned" fill="#0B2545" name="Sanctioned" radius={[3, 3, 0, 0]} />
                <Bar dataKey="released" fill="#1D4ED8" name="Released (PFMS)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="utilized" fill="#15803D" name="Physical MB Utilized" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-md border border-emerald-200 dark:border-emerald-900/40 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 dark:text-emerald-200">Expenditure Health: </span>
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
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  formatter={(val, name) => [`${val} Projects`, name]}
                  contentStyle={{ backgroundColor: '#0B2545', borderColor: '#1E3A5F', borderRadius: '6px', fontSize: '12px', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="anomalies" fill="#D97706" name="Total Anomalies" radius={[3, 3, 0, 0]} />
                <Bar dataKey="highRisk" fill="#DC2626" name="Critical Triage Flags" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900/40 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 dark:text-amber-200">State Oversight: </span>
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
