import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { DashboardStats } from '../../features/dashboard/DashboardStats';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { RiskBadge, StatusBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MapPin,
  Camera,
  Network,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight
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
  LineChart,
  Line,
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
      header: 'Project ID',
      accessor: 'id',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-400">{row.id}</span>
      ),
    },
    {
      header: 'Project Title & Location',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-100 line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-slate-400">{row.district}, {row.state}</p>
        </div>
      ),
    },
    {
      header: 'Sanction Amount',
      accessor: 'sanctionedAmount',
      cell: (row) => (
        <span className="font-mono font-medium text-slate-200">{formatINR(row.sanctionedAmount)}</span>
      ),
    },
    {
      header: 'AI Risk Score',
      accessor: 'riskScore',
      cell: (row) => <RiskBadge score={row.riskScore} />,
    },
    {
      header: 'Primary Anomaly',
      accessor: 'anomalies',
      cell: (row) => (
        <span className="text-xs text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
          {row.anomalies?.[0]?.title || 'Multi-factor Anomaly'}
        </span>
      ),
    },
    {
      header: 'Status',
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
          className="text-xs"
        >
          Investigate
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="National Monitoring Dashboard"
      subtitle="AI-powered central command overview of MPLADS project health, anomalies & fraud risks."
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
          NATIONAL LEVEL (MoSPI)
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDashboardData}
            icon={RefreshCw}
          >
            Refresh Feed
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/risk-map')}
            icon={MapPin}
          >
            National Risk Map
          </Button>
        </div>
      }
    >
      {/* 6 KPI Cards */}
      <DashboardStats kpis={kpis || undefined} />

      {/* Flagship Urgent Investigation Alert Banner */}
      <div className="p-4 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-600/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-red/20">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
                CRITICAL INVESTIGATION REQUIRED
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-rose-500 text-white rounded font-bold">
                87% RISK
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-0.5">
              Project MPLAD-2026-00124: Rural Road Construction (₹48 Lakhs)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              4 Detected Anomalies: 96% Duplicate Photo match with Jaunpur, 42% cost inflation above DSR baseline, and vendor collusion ring.
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
            className="w-full sm:w-auto"
          >
            Open Investigation
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Anomaly Bar Chart */}
        <Card
          title="Anomalies by State"
          subtitle="Total detected operational & financial anomalies"
          icon={AlertTriangle}
          className="lg:col-span-7"
          action={
            <Link to="/analytics" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <span>View Analytics</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="anomalies" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Anomalies" />
                <Bar dataKey="highRisk" fill="#EF4444" radius={[4, 4, 0, 0]} name="High Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Fraud vs Inefficiency Donut Chart */}
        <Card
          title="Fraud vs Inefficiency Breakdown"
          subtitle="Distribution of flagged risk vectors"
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
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mt-2">
            {fraudData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* High-Risk Projects Triage Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Priority High-Risk Queue</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {highRiskProjects.length} Projects Flagged
              </span>
            </h3>
            <p className="text-xs text-slate-400">Directly triaged by AI neural scoring for MoSPI Central Review</p>
          </div>

          <Link to="/high-risk">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View Full Queue
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
          className="cursor-pointer hover:border-blue-500 transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">National Risk Heatmap</h4>
              <p className="text-xs text-slate-400">Interactive GIS map of state & district threat levels</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </Card>

        <Card
          onClick={() => navigate('/cartel-matrix')}
          className="cursor-pointer hover:border-amber-500 transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Vendor Cartel Matrix</h4>
              <p className="text-xs text-slate-400">Expose circular bidding and shared shell entities</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </Card>

        <Card
          onClick={() => navigate('/evidence')}
          className="cursor-pointer hover:border-rose-500 transition-all p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">AI Evidence Lab</h4>
              <p className="text-xs text-slate-400">Forensic side-by-side photo similarity verification</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </Card>
      </div>
    </PageLayout>
  );
};
