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
  Download
} from 'lucide-react';

export const Analytics = () => {
  const [stateRisks, setStateRisks] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [fraudData, setFraudData] = useState([]);
  const [fundUtilizationData, setFundUtilizationData] = useState([]);
  const [riskDistributionData, setRiskDistributionData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const [stRes, trendRes, fraudRes, projRes] = await Promise.all([
      api.getStateRiskData(),
      api.getMonthlyTrends(),
      api.getFraudBreakdown(),
      api.getProjects(),
    ]);

    if (stRes.success) setStateRisks(stRes.data);
    if (trendRes.success) setMonthlyTrends(trendRes.data);
    if (fraudRes.success) setFraudData(fraudRes.data);

    if (projRes.success) {
      const projects = projRes.data;

      // Real fund utilization grouped by category (₹ Crores)
      const byCategory = {};
      for (const p of projects) {
        const cat = p.category || 'Uncategorized';
        if (!byCategory[cat]) byCategory[cat] = { category: cat, sanctioned: 0, released: 0, utilized: 0 };
        byCategory[cat].sanctioned += (p.sanctionedAmount || 0) / 10000000;
        byCategory[cat].released += (p.releasedAmount || 0) / 10000000;
        byCategory[cat].utilized += (p.utilizedAmount || 0) / 10000000;
      }
      setFundUtilizationData(Object.values(byCategory).map(c => ({
        category: c.category,
        sanctioned: Math.round(c.sanctioned * 10) / 10,
        released: Math.round(c.released * 10) / 10,
        utilized: Math.round(c.utilized * 10) / 10,
      })));

      // Real risk-bucket distribution
      const buckets = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
      for (const p of projects) if (buckets[p.riskLevel] !== undefined) buckets[p.riskLevel] += 1;
      const total = projects.length || 1;
      setRiskDistributionData([
        { name: 'Low Risk (0-30%)', value: Math.round((buckets.LOW / total) * 100), color: '#22C55E' },
        { name: 'Medium Risk (31-60%)', value: Math.round((buckets.MEDIUM / total) * 100), color: '#EAB308' },
        { name: 'High Risk (61-85%)', value: Math.round((buckets.HIGH / total) * 100), color: '#F97316' },
        { name: 'Critical Risk (86-100%)', value: Math.round((buckets.CRITICAL / total) * 100), color: '#EF4444' },
      ]);
    }
  };

  return (
    <PageLayout
      title="National Analytics & Anomaly Intelligence"
      subtitle="Multi-dimensional algorithmic breakdown of MPLADS expenditures, risk distributions, and anomaly vectors."
      breadcrumbs={['Dashboard', 'Analytics']}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting Analytics Dossier (PDF/CSV)...')}
          >
            Export Dossier
          </Button>
        </div>
      }
    >
      {/* Top Filter Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filters:</span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-[300px]">
          <Dropdown
            label="Fiscal Year"
            value={selectedYear}
            onChange={setSelectedYear}
            options={[
              { value: '2025-26', label: 'FY 2025-26 (Active)' },
              { value: '2024-25', label: 'FY 2024-25' },
              { value: '2023-24', label: 'FY 2023-24' },
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
              { value: 'ROADS', label: 'Roads & Infrastructure' },
              { value: 'WATER', label: 'Drinking Water & RO' },
              { value: 'HEALTH', label: 'Public Health' },
              { value: 'EDU', label: 'Education & Skill' },
            ]}
          />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Monthly Anomaly Trends (Line / Area) */}
        <Card
          title="Monthly Anomaly Trends (FY 25-26)"
          subtitle="Timeline of caught cost inflations, duplicate images, and cartel alerts"
          icon={TrendingUp}
          className="lg:col-span-8"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="cost" stroke="#3B82F6" fillOpacity={1} fill="url(#costGrad)" name="Cost Anomalies" />
                <Area type="monotone" dataKey="duplicateImage" stroke="#EF4444" fillOpacity={1} fill="url(#dupGrad)" name="Duplicate Image Flags" />
                <Line type="monotone" dataKey="vendorCartel" stroke="#F97316" strokeWidth={2} name="Cartel Collusion" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: National Risk Distribution (Pie) */}
        <Card
          title="National Risk Distribution"
          subtitle="Portfolio segmentation by neural threat score"
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
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-xs mt-2">
            {riskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 3: Fund Utilization by Category (Sanctioned vs Released vs Utilized) */}
        <Card
          title="Fund Utilization by Category (₹ Crores)"
          subtitle="Tracking financial milestones from sanction to physical utilization"
          icon={IndianRupee}
          className="lg:col-span-6"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="sanctioned" fill="#1E40AF" name="Sanctioned" radius={[2, 2, 0, 0]} />
                <Bar dataKey="released" fill="#3B82F6" name="Released" radius={[2, 2, 0, 0]} />
                <Bar dataKey="utilized" fill="#10B981" name="Utilized" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Anomalies by State (Bar Chart) */}
        <Card
          title="Anomalies by State"
          subtitle="Comparison of high-risk vs moderate irregularities"
          icon={BarChart3}
          className="lg:col-span-6"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="anomalies" fill="#F59E0B" name="Total Anomalies" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highRisk" fill="#EF4444" name="Critical Triage" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
