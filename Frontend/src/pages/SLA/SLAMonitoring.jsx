import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Table } from '../../components/ui/Table';
import { SLAIndicator } from '../../components/ui/SLAIndicator';
import { RiskBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { Clock, AlertTriangle, AlertCircle, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
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
    showToast(`Urgent SLA notice dispatched to ${alertItem.assignee} for ${alertItem.projectId}!`, 'info');
  };

  const columns = [
    {
      header: 'Project ID',
      accessor: 'projectId',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-400">{row.projectId}</span>
      ),
    },
    {
      header: 'Project Title & District',
      accessor: 'projectName',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-100 line-clamp-1">{row.projectName}</p>
          <p className="text-[11px] text-slate-400">{row.district}</p>
        </div>
      ),
    },
    {
      header: 'Statutory Deadline',
      accessor: 'deadline',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs text-slate-200">{formatDate(row.deadline)}</span>
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
      header: 'Assigned Officer / Dept',
      accessor: 'assignee',
      cell: (row) => (
        <span className="text-xs text-slate-300 font-medium">{row.assignee}</span>
      ),
    },
    {
      header: 'Action Required',
      accessor: 'actionRequired',
      cell: (row) => (
        <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {row.actionRequired}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleSendReminder(e, row)}
          className="text-xs text-amber-400 hover:text-white"
          icon={Send}
        >
          Send Notice
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="SLA Monitoring & Escalations"
      subtitle="Track statutory government milestone deadlines, work commencement delays, and fund utilization timelines."
      breadcrumbs={['Dashboard', 'SLA Alerts']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {slaAlerts.length} ACTIVE ALERTS
        </span>
      }
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadSLAData}
          icon={RefreshCw}
        >
          Refresh SLA Feed
        </Button>
      }
    >
      {/* SLA Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-rose-900/40 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-rose-400">Critical / Overdue</p>
            <h3 className="text-2xl font-black font-mono text-rose-300 mt-0.5">2 Projects</h3>
            <p className="text-[11px] text-slate-400">Immediate sanction hold</p>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-500/40" />
        </div>

        <div className="p-4 bg-slate-900 border border-amber-900/40 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-amber-400">Approaching (&lt;7 Days)</p>
            <h3 className="text-2xl font-black font-mono text-amber-300 mt-0.5">2 Projects</h3>
            <p className="text-[11px] text-slate-400">Milestone report pending</p>
          </div>
          <Clock className="w-8 h-8 text-amber-500/40" />
        </div>

        <div className="p-4 bg-slate-900 border border-emerald-900/40 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-400">Normal Schedule</p>
            <h3 className="text-2xl font-black font-mono text-emerald-300 mt-0.5">1 Project</h3>
            <p className="text-[11px] text-slate-400">On-track completion</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

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
