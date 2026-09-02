import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { DashboardStats } from '../../features/dashboard/DashboardStats';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
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
  FileSpreadsheet
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

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const [stateRisks, setStateRisks] = useState([]);
  const [fraudData, setFraudData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      if (stateRes.success) setStateRisks(stateRes.data);
      if (fraudRes.success) setFraudData(fraudRes.data);
      if (trendRes.success) setMonthlyTrends(trendRes.data);
    } finally {
      setIsLoading(false);
    }
  };

  const highRiskColumns = [
    {
      header: 'Work ID',
      accessor: 'id',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-700 hover:underline">{row.id}</span>
      ),
    },
    {
      header: 'Description & Constituency',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-slate-500">{row.district}, {row.state}</p>
        </div>
      ),
    },
    {
      header: 'Sanction Value',
      accessor: 'sanctionedAmount',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-800">{formatINR(row.sanctionedAmount)}</span>
      ),
    },
    {
      header: 'Composite Risk',
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
      header: 'Audit Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/project/${row.id}`);
          }}
          className="text-xs border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          Dossier
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="National Oversight Dashboard"
      subtitle="AI-Powered Continuous Forensic Vigilance & Anomaly Detection Layer for e-SAKSHI."
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
          MoSPI CENTRAL AUDIT
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDashboardData}
            icon={RefreshCw}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Refresh Feed
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/risk-map')}
            icon={MapPin}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            National Risk Map
          </Button>
        </div>
      }
    >
      {/* 6 Executive KPI Cards */}
      <DashboardStats kpis={kpis || undefined} />

      {/* Critical Urgent Investigation Alert Banner */}
      <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-gov-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
                CRITICAL FORENSIC DISCREPANCY DETECTED
              </span>
              <span className="px-2 py-0.2 text-[10px] font-mono bg-rose-600 text-white rounded font-bold">
                87% RISK SCORE
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              Project MPLAD-2026-00124: Rural Road Construction (₹48 Lakhs)
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              4 Corroborated Flags: 96% Duplicate Photo match with Jaunpur (Hamming dist: 2), 42% cost inflation, and contractor circular bidding ring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/project/MPLAD-2026-00124')}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white"
          >
            Audit Dossier
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Anomaly Bar Chart */}
        <Card
          title="Detected Anomalies by State"
          subtitle="Distribution of operational, timeline, and photo anomalies"
          icon={AlertTriangle}
          className="lg:col-span-7"
          action={
            <Link to="/analytics" className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold">
              <span>Detailed Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="anomalies" fill="#2563EB" radius={[4, 4, 0, 0]} name="Operational Anomalies" />
                <Bar dataKey="highRisk" fill="#DC2626" radius={[4, 4, 0, 0]} name="Critical Audit Flags" />
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
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fraudData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fraudData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-3">
            {fraudData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate font-medium">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Priority High-Risk Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Priority High-Risk Triage Queue</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {highRiskProjects.length} Projects Flagged
              </span>
            </h3>
            <p className="text-xs text-slate-500">Auto-ranked by Mathematical Composite Risk Formula (R = 0.35F + 0.25T + 0.20I + 0.20C)</p>
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
          onRowClick={(row) => navigate(`/project/${row.id}`)}
          rowsPerPage={5}
        />
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          onClick={() => navigate('/risk-map')}
          className="cursor-pointer hover:border-blue-300 hover:shadow-gov-hover transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">National Risk Heatmap</h4>
              <p className="text-xs text-slate-500">Interactive GIS map of district & constituency threat levels</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Card>

        <Card
          onClick={() => navigate('/cartel-matrix')}
          className="cursor-pointer hover:border-amber-300 hover:shadow-gov-hover transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Vendor Cartel Matrix</h4>
              <p className="text-xs text-slate-500">Bipartite graph exposing tender rotation & HHI monopoly</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Card>

        <Card
          onClick={() => navigate('/evidence')}
          className="cursor-pointer hover:border-rose-300 hover:shadow-gov-hover transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">AI Forensic Evidence Lab</h4>
              <p className="text-xs text-slate-500">Real OpenCV 64-bit dHash perceptual hashing inspection</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Card>
      </div>
    </PageLayout>
  );
};
