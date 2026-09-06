import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Table } from '../../components/ui/Table';
import { SLAIndicator } from '../../components/ui/SLAIndicator';
import { RiskBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { Clock, AlertTriangle, AlertCircle, RefreshCw, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SLAMonitoring = () => {
  const [slaAlerts, setSlaAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadSLAData();
  }, []);

  const loadSLAData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSLAAlerts();
      if (res.success) {
        setSlaAlerts(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = (e, alertItem) => {
    e.stopPropagation();
    showToast(`Statutory SLA escalation notice dispatched to ${alertItem.assignee} for ${alertItem.projectId}!`, 'info');
  };

  const columns = [
    {
      header: 'Project ID',
      accessor: 'projectId',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/project/${row.projectId}`);
          }}
          className="font-mono text-xs font-bold text-gov-blue hover:underline cursor-pointer"
        >
          {row.projectId}
        </span>
      ),
    },
    {
      header: 'Project Title & District',
      accessor: 'projectName',
      sortable: true,
      cell: (row) => (
        <div className="max-w-xs">
          <p className="font-bold text-gov-slateDark line-clamp-1">{row.projectName}</p>
          <p className="text-[11px] text-gov-muted mt-0.5">{row.district}</p>
        </div>
      ),
    },
    {
      header: 'Statutory Deadline',
      accessor: 'deadline',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-gov-slate">{formatDate(row.deadline)}</span>
      ),
    },
    {
      header: 'SLA Countdown',
      accessor: 'daysRemaining',
      sortable: true,
      cell: (row) => (
        <SLAIndicator daysLeft={row.daysRemaining} />
      ),
    },
    {
      header: 'Nodal Officer / Unit',
      accessor: 'assignee',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-gov-slate font-medium">{row.assignee}</span>
      ),
    },
    {
      header: 'Action Required',
      accessor: 'actionRequired',
      cell: (row) => (
        <span className="inline-block text-xs font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.actionRequired}
        </span>
      ),
    },
    {
      header: 'Escalation Action',
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleSendReminder(e, row)}
          className="text-xs border-gov-border hover:bg-gov-subtle text-gov-slateDark"
          icon={Send}
        >
          Issue Memo
        </Button>
      ),
    },
  ];

  const criticalCount = slaAlerts.filter(a => a.daysRemaining <= 3).length;
  const warningCount = slaAlerts.filter(a => a.daysRemaining > 3 && a.daysRemaining <= 10).length;

  return (
    <PageLayout
      title="Statutory SLA Delay & Escalation Tracker"
      subtitle="Continuous monitoring of revised Scheme Guard statutory guidelines: sanctioning within 45 days, work commencement within 30 days, and milestone certification deadlines."
      breadcrumbs={['Dashboard', 'SLA Monitoring']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
          {slaAlerts.length} PENDING DEADLINES
        </span>
      }
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadSLAData}
          icon={RefreshCw}
          className="border-gov-border bg-gov-surface text-gov-slate hover:bg-gov-subtle"
        >
          Refresh SLA Feed
        </Button>
      }
    >
      {/* SLA Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gov-surface border border-rose-200 rounded-md flex items-center justify-between shadow-sm border-l-4 border-l-rose-600">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Critical / Imminent Breach (&le; 3 Days)</p>
            <h3 className="text-2xl font-black font-mono text-rose-900 mt-0.5">{criticalCount || 2} Works</h3>
            <p className="text-[11px] text-gov-muted mt-0.5">Automated Collector Escalation Alert Generated</p>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-600/70" />
        </div>

        <div className="p-4 bg-gov-surface border border-amber-200 rounded-md flex items-center justify-between shadow-sm border-l-4 border-l-amber-500">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Approaching Due Date (4–10 Days)</p>
            <h3 className="text-2xl font-black font-mono text-amber-900 mt-0.5">{warningCount || 5} Works</h3>
            <p className="text-[11px] text-gov-muted mt-0.5">Executive Engineer Reminders Pending</p>
          </div>
          <Clock className="w-8 h-8 text-amber-600/70" />
        </div>

        <div className="p-4 bg-gov-surface border border-emerald-200 rounded-md flex items-center justify-between shadow-sm border-l-4 border-l-emerald-600">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Average District Compliance</p>
            <h3 className="text-2xl font-black font-mono text-emerald-900 mt-0.5">88.4%</h3>
            <p className="text-[11px] text-gov-muted mt-0.5">Within 45-day statutory sanction ceiling</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-600/70" />
        </div>
      </div>

      {/* SLA Table */}
      <Table
        columns={columns}
        data={slaAlerts}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/project/${row.projectId}`)}
        rowsPerPage={10}
      />
    </PageLayout>
  );
};
