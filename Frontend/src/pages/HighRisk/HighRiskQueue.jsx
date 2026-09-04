import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Table } from '../../components/ui/Table';
import { SearchBar } from '../../components/ui/SearchBar';
import { Dropdown } from '../../components/ui/Dropdown';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
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
        p.contractor?.toLowerCase().includes(q);
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
        <span className="font-mono text-xs font-bold text-gov-blue hover:underline cursor-pointer">
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
          <p className="text-[11px] text-gov-muted mt-0.5">{row.implementingAgency || 'District Authority'}</p>
        </div>
      ),
    },
    {
      header: 'State / District',
      accessor: 'district',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-gov-slateDark">{row.district}</span>
          <span className="text-gov-muted block text-[11px]">{row.state}</span>
        </div>
      ),
    },
    {
      header: 'Sanction Value',
      accessor: 'sanctionedAmount',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-gov-slateDark">{formatINR(row.sanctionedAmount)}</span>
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
        if (!first) return <span className="text-xs text-gov-muted">None Detected</span>;
        return (
          <span className="inline-block px-2 py-0.5 text-[11px] rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium">
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
          className="text-xs shadow-none py-1 px-2.5 bg-gov-navy hover:bg-gov-navyDark text-white"
        >
          Investigate
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="High-Risk Project Triage Queue"
      subtitle="Operational vigilance workflow prioritizing works flagged by multi-factor risk algorithms, OpenCV dHash similarity, and SLA breaches."
      breadcrumbs={['Dashboard', 'High-Risk Queue']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {filteredProjects.length} PRIORITY CASES
        </span>
      }
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadProjects}
          icon={RefreshCw}
          className="border-gov-border bg-gov-surface text-gov-slate hover:bg-gov-subtle"
        >
          Refresh Queue
        </Button>
      }
    >
      {/* Flagship Demo Shortcut Notice */}
      <div className="p-3.5 bg-gov-surface border border-gov-border rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border-l-4 border-l-gov-blue">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-gov-blue shrink-0 mt-0.5" />
          <div className="text-xs text-gov-slate">
            <strong className="text-gov-slateDark font-bold">Recommended SIH Evaluation Workflow: </strong>
            Select <span className="font-mono font-bold text-gov-blue">MPLAD-2026-00124</span> (Varanasi Rural Road) to inspect explainable AI findings, cross-district photo reuse forensics, and fund freeze protocols.
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/project/MPLAD-2026-00124')}
          className="shrink-0 text-xs bg-gov-blue hover:bg-blue-800 text-white font-semibold whitespace-nowrap"
        >
          Open Case MPLAD-2026-00124 →
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-gov-surface border border-gov-border rounded-md flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
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
              { value: 'ALL', label: 'All High & Critical Tiers' },
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
              { value: 'Maharashtra', label: 'Maharashtra' },
              { value: 'Rajasthan', label: 'Rajasthan' },
              { value: 'Delhi', label: 'Delhi UT' },
              { value: 'Assam', label: 'Assam' },
            ]}
          />

          <Dropdown
            label="Anomaly Vector"
            value={anomalyFilter}
            onChange={setAnomalyFilter}
            options={[
              { value: 'ALL', label: 'All Anomaly Types' },
              { value: 'DUPLICATE_IMAGE', label: 'Duplicate Image Forensics' },
              { value: 'COST_ANOMALY', label: 'Cost Baseline Discrepancy' },
              { value: 'VENDOR_CARTEL', label: 'Vendor Cartel Collusion' },
              { value: 'GEO_MISMATCH', label: 'Geotag Discrepancy' },
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
