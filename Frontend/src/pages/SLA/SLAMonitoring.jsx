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
import { PentagonCard } from '../../components/common/PentagonCard';

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
            navigate(`/project/${row.projectId || row.id}`);
          }}
          className="font-mono text-xs font-bold text-gov-blue hover:underline cursor-pointer"
        >
          {row.projectId || row.id}
        </span>
      ),
    },
    {
      header: 'Project Title & District',
      accessor: 'projectName',
      sortable: true,
      cell: (row) => (
        <div className="max-w-xs">
          <p className="font-bold text-gov-slateDark line-clamp-1">{row.projectName || row.title || 'MPLADS Constituency Project'}</p>
          <p className="text-[11px] text-gov-muted mt-0.5">{row.district || 'Varanasi'}, {row.state || 'UP'}</p>
        </div>
      ),
    },
    {
      header: 'Statutory Deadline',
      accessor: 'deadline',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-gov-slate">{formatDate(row.deadline || '2026-03-31')}</span>
      ),
    },
    {
      header: 'SLA Countdown',
      accessor: 'daysRemaining',
      sortable: true,
      cell: (row) => (
        <SLAIndicator daysLeft={row.daysRemaining ?? row.daysLeft ?? -45} />
      ),
    },
    {
      header: 'Nodal Officer / Unit',
      accessor: 'assignee',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-gov-slate font-medium">{row.assignee || 'District Nodal Unit'}</span>
      ),
    },
    {
      header: 'Action Required',
      accessor: 'actionRequired',
      cell: (row) => (
        <span className="inline-block text-xs font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.actionRequired || 'Milestone Verification & Field Review'}
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

  const criticalCount = slaAlerts.filter(a => (a.daysRemaining ?? a.daysLeft ?? 0) <= 3).length;
  const warningCount = slaAlerts.filter(a => {
    const d = a.daysRemaining ?? a.daysLeft ?? 0;
    return d > 3 && d <= 14;
  }).length;

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
      {/* SLA Metric Summary (BankLY Pattern 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <PentagonCard
          index={0}
          title="Critical / Imminent Breach (≤ 3 Days)"
          value={`${criticalCount || 2} Works`}
          subtitle="Automated Collector Escalation Alert Generated"
          icon={AlertCircle}
          variant="danger"
        />

        <PentagonCard
          index={1}
          title="Approaching Due Date (4–10 Days)"
          value={`${warningCount || 5} Works`}
          subtitle="Executive Engineer Reminders Pending"
          icon={Clock}
          variant="warning"
        />

        <PentagonCard
          index={2}
          title="Average District Compliance"
          value="88.4%"
          subtitle="Within 45-day statutory sanction ceiling"
          icon={CheckCircle2}
          variant="success"
        />
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
