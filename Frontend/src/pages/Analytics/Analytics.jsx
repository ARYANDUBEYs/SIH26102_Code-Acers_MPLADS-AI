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
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  const loadAnalytics = async () => {
    const [stRes, trendRes, fraudRes] = await Promise.all([
      api.getStateRiskData(),
      api.getMonthlyTrends(),
      api.getFraudBreakdown(),
    ]);

    if (stRes.success) setStateRisks(stRes.data);
    if (trendRes.success) setMonthlyTrends(trendRes.data);
    if (fraudRes.success) setFraudData(fraudRes.data);
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
    // Generate an authentic CSV export of the state risk data
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
        <div className="flex items-center gap-2">
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

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Monthly Anomaly Trends (Line / Area) */}
        <Card
          title="Monthly Forensic Anomaly Trends (FY 25-26)"
          subtitle="Time-series progression of caught cost inflations, duplicate images, and cartel alerts"
          icon={TrendingUp}
          className="lg:col-span-8"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="cost" stroke="#1D4ED8" fillOpacity={1} fill="url(#costGrad)" name="Cost Discrepancies" strokeWidth={2} />
                <Area type="monotone" dataKey="duplicateImage" stroke="#DC2626" fillOpacity={1} fill="url(#dupGrad)" name="Duplicate Image Flags" strokeWidth={2} />
                <Line type="monotone" dataKey="vendorCartel" stroke="#D97706" strokeWidth={2} name="Cartel Collusion" />
              </AreaChart>
            </ResponsiveContainer>
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs mt-2 border-t border-gov-border pt-3">
            {riskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-gov-slate">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-gov-slateDark">{item.value}%</span>
              </div>
            ))}
          </div>
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
              <BarChart data={fundUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="sanctioned" fill="#0B2545" name="Sanctioned" radius={[3, 3, 0, 0]} />
                <Bar dataKey="released" fill="#1D4ED8" name="Released (PFMS)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="utilized" fill="#15803D" name="Physical MB Utilized" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
              <BarChart data={stateRisks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '6px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="anomalies" fill="#D97706" name="Total Anomalies" radius={[3, 3, 0, 0]} />
                <Bar dataKey="highRisk" fill="#DC2626" name="Critical Triage Flags" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
