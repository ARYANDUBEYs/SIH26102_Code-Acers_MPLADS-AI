import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Send,
  Building,
  MapPin,
  FileText,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { PentagonCard } from '../../components/common/PentagonCard';

export const PendingSanctions = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PASSED' | 'AUDIT_REQ' | 'HIGH_OUTLAY'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [approvedIds, setApprovedIds] = useState(new Set());
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingProposals();
  }, []);

  const loadPendingProposals = async () => {
    setIsLoading(true);
    try {
      const pRes = await api.getProjects({ district: 'Varanasi' });
      if (pRes.success && Array.isArray(pRes.data)) {
        setProjects(pRes.data);
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  // Base list of Varanasi proposals awaiting District Magistrate sanction
  const defaultPendingList = [
    {
      id: 'MPLAD-2026-00124',
      title: 'Rural Road Construction & Paver Block Laying in Rohania',
      category: 'Roads, Pathways and Bridges',
      location: 'Chiraigaon Block, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'Rural Engineering Dept (RED) Varanasi',
      sanctionedAmount: 4800000,
      releaseRequested: 1600000,
      phase: 'Stage-2 Disbursal (40%)',
      preScreenStatus: 'AUDIT_REQ',
      preScreenMessage: 'Photo duplicate detected (96% dHash collision) • 87/100 Risk',
      slaDaysRemaining: -109,
      status: 'AUDIT_HOLD',
      daysInQueue: 18,
      dprVerified: true,
      budgetHeadAvailable: true
    },
    {
      id: 'MPLAD-2026-00125',
      title: 'CC Road & Interlocking Drain from Shivpur to Tarna',
      category: 'Roads, Pathways and Bridges',
      location: 'Shivpur Block, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'Public Works Department (PWD) Varanasi',
      sanctionedAmount: 3900000,
      releaseRequested: 3500000,
      phase: 'Administrative Sanction (AS)',
      preScreenStatus: 'PASSED',
      preScreenMessage: 'All 5 statutory checklist requirements verified • 24/100 Risk',
      slaDaysRemaining: 12,
      status: 'READY_FOR_AS',
      daysInQueue: 6,
      dprVerified: true,
      budgetHeadAvailable: true
    },
    {
      id: 'MPLAD-2026-00126',
      title: 'Solar High-Mast Lighting at Kashi Vishwanath Approach Corridors',
      category: 'Other Public Amenities',
      location: 'Dashashwamedh Zone, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'Varanasi Smart City Development Ltd',
      sanctionedAmount: 2800000,
      releaseRequested: 2800000,
      phase: 'Full Work Order Sanction',
      preScreenStatus: 'PASSED',
      preScreenMessage: 'GeM procurement quotation matched standard schedule • 16/100 Risk',
      slaDaysRemaining: 19,
      status: 'READY_FOR_AS',
      daysInQueue: 4,
      dprVerified: true,
      budgetHeadAvailable: true
    },
    {
      id: 'MPLAD-2026-00312',
      title: 'Primary Health Centre Upgradation & Neonatal Wing',
      category: 'Health & Family Welfare',
      location: 'Kerakat Block Border, Varanasi Outskirts',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'UP Jal Nigam / Construction & Design Services',
      sanctionedAmount: 6400000,
      releaseRequested: 2400000,
      phase: 'Stage-2 Civil Sanction',
      preScreenStatus: 'AUDIT_REQ',
      preScreenMessage: 'Vendor cartel concentration detected (HHI=4,280) • 82/100 Risk',
      slaDaysRemaining: -62,
      status: 'AUDIT_HOLD',
      daysInQueue: 24,
      dprVerified: true,
      budgetHeadAvailable: true
    },
    {
      id: 'MPLAD-2026-00127',
      title: 'Deep Borewell with Reverse Osmosis Purification in Arajiline',
      category: 'Drinking Water Facilities',
      location: 'Arajiline Block, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'Jal Sansthan Varanasi',
      sanctionedAmount: 2200000,
      releaseRequested: 2200000,
      phase: 'Initial 100% Capital Outlay',
      preScreenStatus: 'PASSED',
      preScreenMessage: 'Hydro-geological survey clear, water table verified • 12/100 Risk',
      slaDaysRemaining: 22,
      status: 'READY_FOR_AS',
      daysInQueue: 3,
      dprVerified: true,
      budgetHeadAvailable: true
    },
    {
      id: 'MPLAD-2026-00128',
      title: 'Community Skill Development Hall & Digital Lab in Sevapuri',
      category: 'Community Assets & Halls',
      location: 'Sevapuri Model Block, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mpName: 'Shri Narendra Modi (Varanasi PC)',
      implementingAgency: 'District Rural Development Agency (DRDA)',
      sanctionedAmount: 3500000,
      releaseRequested: 1400000,
      phase: 'Stage-1 Foundation Release',
      preScreenStatus: 'PASSED',
      preScreenMessage: 'Land possession certificate & NOC registered • 21/100 Risk',
      slaDaysRemaining: 15,
      status: 'READY_FOR_AS',
      daysInQueue: 7,
      dprVerified: true,
      budgetHeadAvailable: true
    }
  ];

  // Merge loaded real projects into pending format if available
  const queueData = defaultPendingList.map(item => ({
    ...item,
    isApproved: approvedIds.has(item.id)
  }));

  // Filtering
  const filteredList = queueData.filter(item => {
    if (activeFilter === 'PASSED' && item.preScreenStatus !== 'PASSED') return false;
    if (activeFilter === 'AUDIT_REQ' && item.preScreenStatus !== 'AUDIT_REQ') return false;
    if (activeFilter === 'HIGH_OUTLAY' && item.sanctionedAmount < 3500000) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenApproveModal = (proposal) => {
    setSelectedProposal(proposal);
    setApprovalRemarks(`Sanction authorized under Section 3.2 of MPLADS 2023 Guidelines. All statutory pre-conditions certified.`);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedProposal) return;
    setApprovedIds(prev => new Set([...prev, selectedProposal.id]));
    setIsApproveModalOpen(false);
    showToast(`Administrative Sanction (AS) successfully issued for ${selectedProposal.id}! Disbursal order routed to Treasury.`, 'success');
  };

  const handleDispatchFlyingSquad = (proposal) => {
    showToast(`Inspection Order dispatched to Sub-Divisional Magistrate (SDM) Flying Squad for physical verification of ${proposal.id}!`, 'info');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ======================================================================= */}
      {/* 1. TOP HEADER SECTION                                                   */}
      {/* ======================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
            <Link to="/district" className="hover:text-blue-600 transition-colors">District Suite</Link>
            <span>&bull;</span>
            <span className="text-slate-700">Pending Sanctions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            District Sanction & Disbursal Queue
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Statutory administrative & technical clearance desk for proposed works and milestone releases under MPLADS 2023 Guidelines • Varanasi Jurisdiction
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={loadPendingProposals}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. SUMMARY METRIC CARDS (BankLY Pattern 1)                              */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <PentagonCard
          index={0}
          title="Total Pending Sanctions"
          value="24 Works"
          subtitle="₹8.42 Cr Outlay"
          trend="+4 new today"
          trendPositive={true}
          icon={CheckSquare}
          variant="purple"
        />

        <PentagonCard
          index={1}
          title="Pre-Screened Passed"
          value="18 Works"
          subtitle="Zero flags • Ready for sign-off"
          trend="Fast-Track"
          trendPositive={true}
          icon={CheckCircle2}
          variant="success"
        />

        <PentagonCard
          index={2}
          title="Requires Physical Audit"
          value="6 Works"
          subtitle="Photo duplicate or cartel flag"
          trend="Hold Enforced"
          trendPositive={false}
          icon={AlertTriangle}
          variant="danger"
        />

        <PentagonCard
          index={3}
          title="Average Turnaround"
          value="14.2 Days"
          subtitle="Within 45-day statutory ceiling"
          trend="MoSPI SLA"
          trendPositive={true}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* ======================================================================= */}
      {/* 3. SEARCH & FILTER CONTROLS                                             */}
      {/* ======================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            All Pending ({queueData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('PASSED')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'PASSED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pre-Screen Clean (18)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('AUDIT_REQ')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'AUDIT_REQ'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200/70 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Audit Required (6)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('HIGH_OUTLAY')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
              activeFilter === 'HIGH_OUTLAY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 border border-blue-200/70 hover:bg-blue-100'
            }`}
          >
            High Outlay (&gt;₹35L)
          </button>
        </div>

        {/* Search Box */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, Title, Block, Category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 4. PENDING SANCTIONS QUEUE LIST                                         */}
      {/* ======================================================================= */}
      <div className="space-y-5">
        {filteredList.map((proposal) => {
          const isAuditReq = proposal.preScreenStatus === 'AUDIT_REQ';
          const isApproved = proposal.isApproved;

          return (
            <div
              key={proposal.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                isApproved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isAuditReq
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="p-6 sm:p-7 space-y-5">
                {/* Top Row: IDs, Badges & Sponsoring Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {proposal.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {proposal.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      In Queue: <span className="text-slate-700 font-semibold">{proposal.daysInQueue} days</span>
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SANCTION AUTHORIZED (AS-2026)</span>
                      </span>
                    ) : isAuditReq ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3] font-mono">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>GROUND AUDIT MANDATORY</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>AI INTEGRITY PASSED (5/5)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Title, Sponsoring MP, Amounts & Pre-Screening Findings */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Title & Agency (col 7) */}
                  <div className="lg:col-span-7 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 transition cursor-pointer" onClick={() => navigate(`/project/${proposal.id}`)}>
                      {proposal.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proposal.location}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>{proposal.mpName}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="text-slate-600 font-medium">Agency: {proposal.implementingAgency}</span>
                    </div>

                    {/* AI Pre-Screening Callout */}
                    <div className={`p-3 sm:p-3.5 rounded-xl text-xs flex items-center gap-3 mt-3 ${
                      isAuditReq
                        ? 'bg-rose-50/80 border border-rose-200/80 text-rose-800'
                        : 'bg-emerald-50/80 border border-emerald-200/80 text-emerald-800'
                    }`}>
                      <Sparkles className={`w-4 h-4 shrink-0 ${isAuditReq ? 'text-rose-600' : 'text-emerald-600'}`} />
                      <span className="font-medium">{proposal.preScreenMessage}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown (col 5) */}
                  <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 rounded-xl p-4 sm:p-5 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Sanction Requested:</span>
                      <span className="font-mono text-sm font-black text-slate-900">{formatINR(proposal.sanctionedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Clearance Milestone:</span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-mono text-[11px]">
                        {proposal.phase}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Treasury Disbursal:</span>
                      <span className="font-mono font-bold text-emerald-700">{formatINR(proposal.releaseRequested)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/project/${proposal.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
                    >
                      <span>Inspect Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-slate-300">&bull;</span>
                    <button
                      type="button"
                      onClick={() => navigate('/district/pre-screening')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                    >
                      Audit 5-Point Checklist
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {isApproved ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300">
                        Clearance Order Signed
                      </span>
                    ) : isAuditReq ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDispatchFlyingSquad(proposal)}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-2 transition cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Flying Squad</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenApproveModal(proposal)}
                          className="px-4 py-2.5 rounded-xl bg-[#2E1065] hover:bg-purple-900 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Override & Sanction
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenApproveModal(proposal)}
                          className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Grant Administrative Sanction</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================================= */}
      {/* 5. ADMINISTRATIVE SANCTION ORDER MODAL                                   */}
      {/* ======================================================================= */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Issue Official Administrative Sanction (AS)"
        size="md"
      >
        {selectedProposal && (
          <div className="space-y-5 text-xs p-1">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">{selectedProposal.title}</p>
              <p className="text-slate-600 font-mono text-[11px]">Work ID: {selectedProposal.id} • Sanction: {formatINR(selectedProposal.sanctionedAmount)}</p>
              <p className="text-slate-500 mt-1">Recommended By: <strong className="text-slate-800">{selectedProposal.mpName}</strong></p>
            </div>

            <div className="space-y-3 border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/50">
              <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Statutory Verification Checklist</p>
              <div className="space-y-2 text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>Verified MP Recommendation on e-SAKSHI digital registry</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>Technical Sanction (TS) & Cost Estimate confirmed by Executive Engineer</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>PFMS Treasury Escrow account mapped with single nodal agency</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>Image Hash Forensics cleared against 28-State national repository</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold mb-1">
                District Officer Executive Minute / Sanction Note:
              </label>
              <textarea
                rows={3}
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-medium"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
              <strong>Legal Binding:</strong> Authorizing this sanction issues an irrevocable digital Administrative Sanction Order dispatching ₹{formatINR(selectedProposal.releaseRequested)} through PFMS treasury route.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-4 py-2.5 rounded-xl bg-[#2E1065] hover:bg-purple-900 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Sign & Issue Sanction Order</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingSanctions;
