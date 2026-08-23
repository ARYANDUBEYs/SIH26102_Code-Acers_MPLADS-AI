import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { RiskBadge, StatusBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  IndianRupee,
  Calendar,
  MapPin,
  Building,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  Network,
  ArrowRight,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  XCircle,
  ExternalLink
} from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState('VERIFY'); // 'VERIFY' | 'FLAG' | 'AUDIT'
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  const { role, isDistrictOfficer, isAdmin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProjectById(id || 'MPLAD-2026-00124');
      if (res.success) {
        setProject(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteDecision = async () => {
    setIsSubmittingDecision(true);
    try {
      const statusMap = {
        VERIFY: 'VERIFIED',
        FLAG: 'UNDER_INVESTIGATION',
        AUDIT: 'FLAGGED',
      };
      const res = await api.updateProjectDecision(project.id, statusMap[decisionType], decisionRemarks);
      if (res.success) {
        setProject(res.data);
        setIsDecisionModalOpen(false);
        showToast(`Official decision recorded for ${project.id}: ${statusMap[decisionType]}`, 'success');
      }
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  if (isLoading || !project) {
    return (
      <PageLayout title="Project Details" breadcrumbs={['Dashboard', 'Projects', 'Loading...']}>
        <div className="p-12 text-center text-slate-400">Loading comprehensive project dossier...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={project.name}
      subtitle={`Project ID: ${project.id} • ${project.location}, ${project.district}, ${project.state}`}
      breadcrumbs={['Dashboard', 'High-Risk Queue', project.id]}
      badge={<StatusBadge status={project.status} />}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/cartel-matrix')}
            icon={Network}
          >
            Cartel Graph
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/evidence')}
            icon={Camera}
          >
            Verify AI Evidence
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDecisionModalOpen(true)}
            icon={ShieldCheck}
          >
            Take Official Action
          </Button>
        </div>
      }
    >
      {/* 4 Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sanctioned Amount</p>
          <h3 className="text-2xl font-black font-mono text-slate-100">{formatINR(project.sanctionedAmount)}</h3>
          <p className="text-[11px] text-slate-500">Sanctioned: {formatDate(project.sanctionDate)}</p>
        </div>

        <div className="p-4 bg-slate-900 border border-blue-900/40 rounded-xl space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Released Funds (Installment 1)</p>
          <h3 className="text-2xl font-black font-mono text-blue-400">{formatINR(project.releasedAmount)}</h3>
          <p className="text-[11px] text-slate-500">Disbursed to Agency Escrow</p>
        </div>

        <div className="p-4 bg-slate-900 border border-emerald-900/40 rounded-xl space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Utilized Amount</p>
          <h3 className="text-2xl font-black font-mono text-emerald-400">{formatINR(project.utilizedAmount)}</h3>
          <p className="text-[11px] text-slate-500">Physical MB Certified</p>
        </div>

        <div className="p-4 bg-slate-900 border border-amber-900/40 rounded-xl space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Remaining Balance</p>
          <h3 className="text-2xl font-black font-mono text-amber-400">{formatINR(project.remainingAmount)}</h3>
          <p className="text-[11px] text-slate-500">Stage-2 Payout Pending</p>
        </div>
      </div>

      {/* Progress & Milestones Bar */}
      <Card
        title="Project Physical Milestone Timeline"
        subtitle={`Current Stage: ${project.currentStage} (${project.progressPercent}% Physical Work Recorded)`}
        icon={Clock}
      >
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center pt-2">
            {(project.timeline || [
              { stage: 'Approved', date: 'Aug 2025', status: 'completed' },
              { stage: 'Funds Released', date: 'Oct 2025', status: 'completed' },
              { stage: 'Work Started', date: 'Nov 2025', status: 'completed' },
              { stage: 'Work Progress', date: 'Jan 2026', status: 'in-progress' },
              { stage: 'Field Inspection', date: 'Pending', status: 'pending' },
              { stage: 'Completion', date: 'Pending', status: 'pending' },
            ]).map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs ${
                  step.status === 'completed'
                    ? 'bg-slate-950 border-emerald-500/30 text-emerald-300'
                    : step.status === 'in-progress'
                    ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-semibold shadow-glow-blue/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {step.status === 'in-progress' && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
                  <span className="font-semibold truncate">{step.stage}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">{step.date}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Grid: AI Risk Assessment & Explainable Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Circular AI Risk Gauge & Summary */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title="AI Risk Assessment"
            subtitle="Normalized neural threat index"
            icon={ShieldAlert}
            riskAccent="high"
            className="flex flex-col items-center justify-center p-6 text-center"
          >
            <RiskGauge score={project.riskScore} size={190} />

            <div className="mt-6 w-full pt-4 border-t border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Model Confidence:</span>
                <span className="font-mono font-bold text-white">94.2%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Anomaly Vectors Caught:</span>
                <span className="font-mono font-bold text-rose-400">{project.anomalies?.length || 4} Factors</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Recommended Action:</span>
                <span className="font-bold text-amber-400">Hold Payout & Dispatch Inspection</span>
              </div>
            </div>

            <Button
              variant="danger"
              size="md"
              onClick={() => navigate('/evidence')}
              className="w-full mt-4"
              icon={Camera}
            >
              Examine Forensic Evidence
            </Button>
          </Card>

          {/* Project Administrative Metadata */}
          <Card title="Project Administration" icon={Building} className="text-xs space-y-3">
            <div>
              <span className="text-slate-400 block">Implementing Agency:</span>
              <span className="font-semibold text-slate-200">{project.implementingAgency}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Awarded Contractor:</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{project.contractor}</span>
                <Link to="/cartel-matrix" className="text-blue-400 hover:underline text-[11px] flex items-center gap-0.5">
                  <span>Cartel Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block">Recommended By (Hon'ble MP):</span>
              <span className="font-semibold text-slate-200">{project.mpName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Target Completion:</span>
              <span className="font-mono text-slate-200">{formatDate(project.targetDate)}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Explainable AI Findings (4 Core Cards) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Explainable AI Findings ({project.anomalies?.length || 4})</span>
              </h3>
              <p className="text-xs text-slate-400">Detailed algorithmic justification for high-risk flags</p>
            </div>
          </div>

          <div className="space-y-3">
            {project.anomalies?.map((ano) => (
              <div
                key={ano.id}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2.5 transition-all shadow-card-dark"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-2 rounded-lg text-xs font-bold ${
                        ano.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : ano.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {ano.severity}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{ano.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">Anomaly Code: {ano.id}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {ano.confidence}% Confidence
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ano.description}</p>

                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Auditable Evidence: </strong>
                  <span>{ano.evidence}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Banner */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Need to inspect raw computer vision feature maps or coordinate boundary overlays?
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/evidence')}
              icon={Camera}
            >
              Open Photo Forensic Lab
            </Button>
          </div>
        </div>
      </div>

      {/* Official Decision Action Modal */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title={`Official Governance Action — ${project.id}`}
        subtitle="Authorize or freeze funds based on AI findings & physical audits"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="text-slate-400 block font-semibold uppercase">Project Under Action:</span>
            <p className="font-bold text-slate-100">{project.name}</p>
            <p className="text-slate-400">{project.district}, {project.state} • Sanction: {formatINR(project.sanctionedAmount)}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Select Official Order:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionType('VERIFY')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'VERIFY'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-glow-green/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Approve & Clear
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('AUDIT')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'AUDIT'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-glow-orange/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Dispatch Audit Team
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('FLAG')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'FLAG'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-glow-red/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Freeze Next Payout
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Official Remarks & File Notation:
            </label>
            <textarea
              rows={3}
              value={decisionRemarks}
              onChange={(e) => setDecisionRemarks(e.target.value)}
              placeholder="Enter official justification, reference to inspection memo, or officer remarks..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDecisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteDecision}
              isLoading={isSubmittingDecision}
              icon={Send}
            >
              Execute Decision
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
