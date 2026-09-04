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
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/project/${row.id}`);
          }}
          className="font-mono text-xs font-bold text-gov-blue hover:underline cursor-pointer"
        >
          {row.id}
        </span>
      ),
    },
    {
      header: 'Project Name & Agency',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="max-w-xs">
          <p className="font-bold text-gov-slateDark line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-gov-muted mt-0.5">{row.implementingAgency || 'Varanasi Nodal Agency'}</p>
        </div>
      ),
    },
    {
      header: 'Sanction Amount',
      accessor: 'sanctionedAmount',
      sortable: true,
      cell: (row) => <span className="font-mono text-xs font-bold text-gov-slateDark">{formatINR(row.sanctionedAmount)}</span>,
    },
    {
      header: 'AI Risk Level',
      accessor: 'riskScore',
      sortable: true,
      cell: (row) => <RiskBadge score={row.riskScore} />,
    },
    {
      header: 'Action Needed',
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
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
          className="text-xs shadow-none py-1 px-2.5 bg-gov-navy hover:bg-gov-navyDark text-white"
        >
          Screen & Decide
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="District Executive Officer Cockpit"
      subtitle="District Administration (Varanasi, UP) — Daily processing queue: AI pre-screening, SLA escalations, and milestone photo validation."
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gov-blue/15 text-gov-blue border border-gov-blue/30">
          DISTRICT LEVEL (VARANASI)
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDistrictData}
            icon={RefreshCw}
            className="border-gov-border bg-gov-surface text-gov-slate hover:bg-gov-subtle"
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/district/pre-screening')}
            icon={Sparkles}
            className="bg-gov-navy hover:bg-gov-navyDark text-white"
          >
            AI Pre-Screening
          </Button>
        </div>
      }
    >
      {/* 4 District Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Pending Sanctions"
          value="24"
          subtitle="Awaiting administrative review"
          icon={CheckSquare}
          trend="+4 new today"
          trendPositive={false}
          variant="blue"
          onClick={() => navigate('/district/pending')}
        />

        <DashboardCard
          title="SLA Breaches Imminent"
          value="7"
          subtitle="Statutory deadlines &lt; 48 hours"
          icon={Clock}
          trend="3 critical (<48h)"
          trendPositive={false}
          variant="danger"
          onClick={() => navigate('/sla')}
        />

        <DashboardCard
          title="AI Photo Discrepancies"
          value="13"
          subtitle="Duplicate/spoofed EXIF flags"
          icon={AlertTriangle}
          trend="Requires physical audit"
          trendPositive={false}
          variant="warning"
          onClick={() => navigate('/district/photo-validation')}
        />

        <DashboardCard
          title="Certified Completed Works"
          value="148"
          subtitle="FY 2025-26 Assets built"
          icon={CheckCircle2}
          trend="+12 this month"
          trendPositive={true}
          variant="success"
          onClick={() => navigate('/projects')}
        />
      </div>

      {/* District Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: AI Pre-Screening Module */}
        <Card
          title="AI Pre-Screening Desk"
          subtitle="Automated 5-point statutory checklist evaluation before fund release"
          icon={Sparkles}
          action={
            <Link to="/district/pre-screening" className="text-xs text-gov-blue hover:underline flex items-center gap-1 font-bold">
              <span>Launch Pre-Screening</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-2.5">
            <div className="p-3 bg-gov-canvas border border-gov-border rounded flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gov-slateDark">Patna Digital Smart Classroom (MPLAD-00089)</p>
                  <p className="text-[11px] text-gov-muted">All 5 AI integrity checks passed • 18/100 Low Risk</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                PASSED
              </span>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div>
                  <p className="text-xs font-bold text-rose-900">Varanasi Rural Road (MPLAD-00124)</p>
                  <p className="text-[11px] text-rose-700">Photo duplicate detected (96%) • 87/100 High Risk</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 shrink-0">
                AUDIT REQ
              </span>
            </div>
          </div>
        </Card>

        {/* Card 2: Photo Validation Queue */}
        <Card
          title="Photo Evidence Forensic Desk"
          subtitle="Inspect physical progress geotagged field uploads"
          icon={Camera}
          action={
            <Link to="/district/photo-validation" className="text-xs text-gov-blue hover:underline flex items-center gap-1 font-bold">
              <span>Photo Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="flex items-center gap-3.5 p-3 bg-gov-canvas border border-gov-border rounded">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80"
              alt="Road progress"
              className="w-14 h-14 rounded object-cover border border-rose-300 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gov-navy">MPLAD-2026-00124</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-rose-100 text-rose-800 rounded font-mono font-bold border border-rose-200">
                  96% DUPLICATE
                </span>
              </div>
              <p className="text-xs font-bold text-gov-slateDark truncate mt-0.5">Rural Road Construction & Paver Block</p>
              <p className="text-[11px] text-gov-muted">Location: Chiraigaon Block, Varanasi</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/district/photo-validation')}
              className="shrink-0 text-xs border-gov-border text-gov-slateDark hover:bg-gov-subtle"
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
            <h3 className="text-base font-bold text-gov-slateDark">District Sanction & Approval Triage</h3>
            <p className="text-xs text-gov-muted">Projects requiring District Magistrate / Nodal Officer sanction verification</p>
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
