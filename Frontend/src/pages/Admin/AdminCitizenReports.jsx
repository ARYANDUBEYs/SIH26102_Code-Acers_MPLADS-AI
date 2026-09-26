import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareWarning,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Calendar,
  Camera,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Eye,
  Building,
  ArrowRight
} from 'lucide-react';

export const AdminCitizenReports = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCitizenReports();
      if (res && res.data) {
        setReports(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedReport) return;
    setIsProcessing(true);
    try {
      const updated = reports.map((r) =>
        r.id === selectedReport.id ? { ...r, status: newStatus, adminNote: actionNote } : r
      );
      setReports(updated);
      try {
        const local = JSON.parse(localStorage.getItem('scheme_guard_citizen_reports') || '[]');
        const updatedLocal = local.map((r) =>
          r.id === selectedReport.id ? { ...r, status: newStatus, adminNote: actionNote } : r
        );
        localStorage.setItem('scheme_guard_citizen_reports', JSON.stringify(updatedLocal));
      } catch (e) {
        console.error(e);
      }

      showToast(`Report ${selectedReport.id} marked as ${newStatus}`, 'success');
      setSelectedReport(null);
      setActionNote('');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.id?.toLowerCase().includes(q) ||
      r.projectId?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.issueType?.toLowerCase().includes(q) ||
      r.citizenName?.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PENDING' && (r.status === 'Under Verification' || r.status === 'PENDING')) ||
      (selectedStatus === 'DISPATCHED' && (r.status === 'Inspection Dispatched' || r.status === 'DISPATCHED')) ||
      (selectedStatus === 'RESOLVED' && (r.status === 'Verified & Cleared' || r.status === 'RESOLVED'));

    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <PageLayout title="Access Restricted" breadcrumbs={['Dashboard', 'Security']}>
        <div className="p-12 text-center text-slate-500 space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Central MoSPI Administrator Clearance Required</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This module contains statutory whistleblower dossiers and citizen vigilance logs. Only authorized Central MoSPI administrators can review public filings.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <span>&gt;</span>
          <span className="text-slate-600 font-semibold">Public Vigilance Reports</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Public Vigilance & Grievance Logs
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Admin Clearance Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Real-time feed of ground audits, geotagged complaints, and whistleblower submissions filed by citizens across India.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-100 px-3.5 py-2 rounded-xl text-slate-700">
              Total Logged: <strong className="text-blue-600">{reports.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, project, district, or citizen..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'DISPATCHED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid / Feed */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading vigilance feed...</div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <MessageSquareWarning className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No public vigilance reports matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((rep) => {
            const isDispatched = rep.status === 'Inspection Dispatched' || rep.status === 'DISPATCHED';
            const isPending = rep.status === 'Under Verification' || rep.status === 'PENDING';
            const isResolved = rep.status === 'Verified & Cleared' || rep.status === 'RESOLVED';

            return (
              <div
                key={rep.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:border-blue-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue-700">{rep.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isDispatched
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                        {rep.projectName || rep.projectId}
                      </p>
                      <Link
                        to={`/project/${rep.projectId}`}
                        className="text-[11px] font-mono text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 mt-1"
                      >
                        <span>Project: {rep.projectId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {rep.submissionDate}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                      Discrepancy: {rep.issueType}
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed line-clamp-2">
                      "{rep.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{rep.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{rep.citizenName || 'Whistleblower Protected'}</span>
                    </div>
                  </div>

                  {rep.aiPreCheck && (
                    <div className="text-[11px] p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 flex items-start gap-1.5">
                      <span className="font-bold shrink-0">AI Sentinel Flag:</span>
                      <span className="line-clamp-1">{rep.aiPreCheck}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/project/${rep.projectId}`)}
                    className="text-xs text-slate-700 border-slate-200 hover:bg-slate-50"
                  >
                    View Project Dossier
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedReport(rep)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Action Grievance
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action / Review Modal */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={`Administrative Action: ${selectedReport.id}`}
          subtitle={`Citizen filing for Project ${selectedReport.projectId}`}
          size="md"
        >
          <div className="space-y-5 p-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Project Name:</span>
                <p className="font-bold text-slate-900">{selectedReport.projectName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Citizen Observation:</span>
                <p className="text-slate-700 italic">"{selectedReport.description}"</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200">
                <span>GPS: {selectedReport.gps}</span>
                <span>Filer: {selectedReport.citizenName}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Official Administrative Order:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Inspection Dispatched')}
                  className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center cursor-pointer transition"
                >
                  Dispatch Field Audit
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Verified & Cleared')}
                  className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-center cursor-pointer transition"
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Escalated to MoSPI Vigilance')}
                  className="p-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold text-center cursor-pointer transition"
                >
                  Escalate to MoSPI
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Notation for District Collector:
              </label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Enter mandatory administrative directives or field inspection memo reference..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
