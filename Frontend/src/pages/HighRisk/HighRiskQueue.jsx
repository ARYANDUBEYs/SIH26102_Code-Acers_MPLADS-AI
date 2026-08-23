import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Table } from '../../components/ui/Table';
import { SearchBar } from '../../components/ui/SearchBar';
import { Dropdown } from '../../components/ui/Dropdown';
import { RiskBadge, StatusBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { AlertOctagon, Filter, ShieldAlert, ArrowRight, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const HighRiskQueue = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [anomalyFilter, setAnomalyFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [riskFilter, stateFilter]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProjects({
        riskLevel: riskFilter,
        state: stateFilter,
      });
      if (res.success) {
        // High risk queue focuses primarily on projects with riskScore >= 60 unless all selected
        let data = res.data;
        if (riskFilter === 'ALL') {
          data = data.filter(p => p.riskScore >= 60);
        }
        setProjects(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (anomalyFilter !== 'ALL') {
      const hasAnomaly = p.anomalies?.some(a => a.type === anomalyFilter);
      if (!hasAnomaly) return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Project ID',
      accessor: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-400">{row.id}</span>
      ),
    },
    {
      header: 'Project Name & Agency',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="max-w-xs">
          <p className="font-semibold text-slate-100 line-clamp-1">{row.name}</p>
          <p className="text-[11px] text-slate-400">{row.implementingAgency}</p>
        </div>
      ),
    },
    {
      header: 'State / District',
      accessor: 'district',
      sortable: true,
      cell: (row) => (
        <div className="text-xs text-slate-200">
          <span className="font-medium text-slate-100">{row.district}</span>
          <span className="text-slate-400 block text-[11px]">{row.state}</span>
        </div>
      ),
    },
    {
      header: 'Sanctioned',
      accessor: 'sanctionedAmount',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-200">{formatINR(row.sanctionedAmount)}</span>
      ),
    },
    {
      header: 'Risk Score',
      accessor: 'riskScore',
      sortable: true,
      cell: (row) => <RiskBadge score={row.riskScore} />,
    },
    {
      header: 'Primary Anomaly Type',
      accessor: 'anomalies',
      cell: (row) => {
        const first = row.anomalies?.[0];
        if (!first) return <span className="text-xs text-slate-500">None</span>;
        return (
          <span className="inline-block px-2 py-0.5 text-[11px] rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
            {first.title}
          </span>
        );
      },
    },
    {
      header: 'Current Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/project/${row.id}`);
          }}
          className="text-xs shadow-none"
        >
          Investigate
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="High-Risk Project Queue"
      subtitle="Priority anomaly investigation queue ranked by AI multi-factor threat indices."
      breadcrumbs={['Dashboard', 'High-Risk Queue']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          {filteredProjects.length} PRIORITY CASES
        </span>
      }
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadProjects}
          icon={RefreshCw}
        >
          Refresh Queue
        </Button>
      }
    >
      {/* Flagship Demo Shortcut Notice */}
      <div className="p-3.5 bg-blue-950/40 border border-blue-900/50 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <strong className="text-white">Flagship Demo Case: </strong>
            Select <strong className="text-cyan-400">MPLAD-2026-00124</strong> (Varanasi Rural Road) below to walk through explainable AI findings, forensic photo verification, and district sanction review.
          </div>
        </div>
        <Button
          variant="glow"
          size="sm"
          onClick={() => navigate('/project/MPLAD-2026-00124')}
          className="shrink-0 text-xs"
        >
          Demo Case →
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by ID, title, contractor, district..."
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <Dropdown
            label="Risk Level"
            value={riskFilter}
            onChange={setRiskFilter}
            options={[
              { value: 'ALL', label: 'All Risk Tiers' },
              { value: 'CRITICAL', label: 'Critical (86-100%)' },
              { value: 'HIGH', label: 'High (61-85%)' },
            ]}
          />

          <Dropdown
            label="State"
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { value: 'ALL', label: 'All States' },
              { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
              { value: 'Bihar', label: 'Bihar' },
              { value: 'Rajasthan', label: 'Rajasthan' },
              { value: 'Delhi', label: 'Delhi' },
              { value: 'Assam', label: 'Assam' },
            ]}
          />

          <Dropdown
            label="Anomaly Filter"
            value={anomalyFilter}
            onChange={setAnomalyFilter}
            options={[
              { value: 'ALL', label: 'All Anomaly Types' },
              { value: 'DUPLICATE_IMAGE', label: 'Duplicate Images' },
              { value: 'COST_ANOMALY', label: 'Cost Baseline Inflations' },
              { value: 'VENDOR_CARTEL', label: 'Vendor Cartels' },
              { value: 'GEO_MISMATCH', label: 'Geotag Mismatch' },
            ]}
          />
        </div>
      </div>

      {/* High-Risk Table */}
      <Table
        columns={columns}
        data={filteredProjects}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/project/${row.id}`)}
        rowsPerPage={10}
      />
    </PageLayout>
  );
};
