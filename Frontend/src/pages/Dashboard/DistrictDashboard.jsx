import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { DashboardCard } from '../../features/dashboard/DashboardCard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { RiskBadge, StatusBadge, Badge } from '../../components/ui/Badge';
import { SLAIndicator } from '../../components/ui/SLAIndicator';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import {
  CheckSquare,
  Clock,
  Sparkles,
  Camera,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileSearch,
  Building2,
  RefreshCw
} from 'lucide-react';

export const DistrictDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [slaAlerts, setSlaAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDistrictData();
  }, []);

  const loadDistrictData = async () => {
    setIsLoading(true);
    try {
      const [pRes, slaRes] = await Promise.all([
        api.getProjects({ district: 'Varanasi' }),
        api.getSLAAlerts(),
      ]);
      if (pRes.success) setProjects(pRes.data);
      if (slaRes.success) setSlaAlerts(slaRes.data.filter(s => s.district === 'Varanasi' || s.risk === 'CRITICAL'));
    } finally {
      setIsLoading(false);
    }
  };

  const pendingColumns = [
    {
      header: 'Project ID',
      accessor: 'id',
      cell: (row) => <span className="font-mono text-xs font-bold text-blue-400">{row.id}</span>,
    },
    {
      header: 'Project Name & Agency',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-100 line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-slate-400">{row.implementingAgency}</p>
        </div>
      ),
    },
    {
      header: 'Sanction Amount',
      accessor: 'sanctionedAmount',
      cell: (row) => <span className="font-mono text-slate-200">{formatINR(row.sanctionedAmount)}</span>,
    },
    {
      header: 'AI Risk Level',
      accessor: 'riskScore',
      cell: (row) => <RiskBadge score={row.riskScore} />,
    },
    {
      header: 'Action Needed',
      accessor: 'status',
      cell: (row) => (
        <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
          Stage-2 Disbursal Pre-Check
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/district/pre-screening')}
          className="text-xs"
        >
          AI Screen & Decision
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="District Monitoring Dashboard"
      subtitle="Good Morning, District Project Officer — Varanasi District Administration"
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          DISTRICT LEVEL (UP)
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDistrictData}
            icon={RefreshCw}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/district/pre-screening')}
            icon={Sparkles}
          >
            AI Pre-Screening
          </Button>
        </div>
      }
    >
      {/* 4 District Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Pending Approvals"
          value="24"
          subtitle="Awaiting administrative review"
          icon={CheckSquare}
          trend="+4 new today"
          trendPositive={false}
          variant="blue"
          onClick={() => navigate('/district/pending')}
        />

        <DashboardCard
          title="SLA At Risk"
          value="7"
          subtitle="Milestones approaching deadline"
          icon={Clock}
          trend="3 critical (<48h)"
          trendPositive={false}
          variant="danger"
          onClick={() => navigate('/sla')}
        />

        <DashboardCard
          title="AI Flags"
          value="13"
          subtitle="Discrepancies & photo alerts"
          icon={AlertTriangle}
          trend="Requires physical audit"
          trendPositive={false}
          variant="warning"
          onClick={() => navigate('/district/photo-validation')}
        />

        <DashboardCard
          title="Completed Projects"
          value="148"
          subtitle="FY 2025-26 Certified"
          icon={CheckCircle2}
          trend="+12 this month"
          trendPositive={true}
          variant="success"
          onClick={() => navigate('/projects')}
        />
      </div>

      {/* District Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Pre-Screening Module */}
        <Card
          title="AI Pre-Screening Workflow"
          subtitle="Automated 5-point verification before sanctioning funds"
          icon={Sparkles}
          action={
            <Link to="/district/pre-screening" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <span>Launch Pre-Screening</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Patna Digital Smart Classroom (MPLAD-00089)</p>
                  <p className="text-[11px] text-slate-400">All 5 AI integrity checks passed • 18/100 Low Risk</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">READY TO APPROVE</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-rose-900/40 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Varanasi Rural Road (MPLAD-00124)</p>
                  <p className="text-[11px] text-rose-400">Photo duplicate detected (96%) • 87/100 High Risk</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">SEND FOR AUDIT</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Photo Validation Queue */}
        <Card
          title="Photo Evidence Forensic Queue"
          subtitle="Inspect physical progress geotagged field uploads"
          icon={Camera}
          action={
            <Link to="/district/photo-validation" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <span>Validate Photos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="flex items-center gap-4 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80"
              alt="Road progress"
              className="w-16 h-16 rounded-lg object-cover border border-rose-500/50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-400">MPLAD-2026-00124</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-rose-500/20 text-rose-300 rounded font-mono">
                  96% DUPLICATE
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">Rural Road Construction & Paver Block</p>
              <p className="text-[11px] text-slate-400">Location: Chiraigaon Block, Varanasi</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/district/photo-validation')}
              className="shrink-0 text-xs"
            >
              Verify
            </Button>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">District Approval Queue</h3>
            <p className="text-xs text-slate-400">Projects requiring District Magistrate / Nodal Officer sanction</p>
          </div>
        </div>

        <Table
          columns={pendingColumns}
          data={projects}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/project/${row.id}`)}
          rowsPerPage={5}
        />
      </div>
    </PageLayout>
  );
};
