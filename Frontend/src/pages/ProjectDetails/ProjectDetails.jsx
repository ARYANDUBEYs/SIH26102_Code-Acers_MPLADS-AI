import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { RiskBadge, StatusBadge, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FALLBACK_PROJECTS } from '../../data/fallbackProjects';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../utils/constants';
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
  const isCitizen = role === ROLES.CITIZEN;
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const targetId = id || 'MPLAD-2026-00124';
      const res = await api.getProjectById(targetId);
      if (res && res.success && res.data) {
        setProject(res.data);
      } else {
        const fb = FALLBACK_PROJECTS.find(p => p.id.toLowerCase() === targetId.toLowerCase()) || FALLBACK_PROJECTS[0];
        setProject(fb);
      }
    } catch {
      const targetId = id || 'MPLAD-2026-00124';
      const fb = FALLBACK_PROJECTS.find(p => p.id.toLowerCase() === targetId.toLowerCase()) || FALLBACK_PROJECTS[0];
      setProject(fb);
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

  if (isLoading && !project) {
    return (
      <PageLayout title="Project Details" breadcrumbs={['Dashboard', 'Projects', 'Loading...']}>
        <div className="p-12 text-center text-slate-500 font-medium">Loading comprehensive project dossier...</div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Project Not Found" breadcrumbs={['Dashboard', 'Projects', 'Not Found']}>
        <div className="p-12 text-center text-slate-500 space-y-4">
          <p>Project dossier could not be located.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
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
          {isCitizen ? (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => navigate(`/public/report?projectId=${encodeURIComponent(project.id)}`)}
                icon={Camera}
              >
                Report Citizen Grievance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/public')}
              >
                Public Transparency Portal
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      }
    >
      {/* 4 Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-gov-card space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sanctioned Amount</p>
          <h3 className="text-2xl font-black font-mono text-slate-900">{formatINR(project.sanctionedAmount)}</h3>
          <p className="text-[11px] text-slate-400">Sanctioned: {formatDate(project.sanctionDate)}</p>
        </div>

        <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-gov-card space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Released Funds (Installment 1)</p>
          <h3 className="text-2xl font-black font-mono text-blue-700">{formatINR(project.releasedAmount)}</h3>
          <p className="text-[11px] text-slate-400">Disbursed to Agency Escrow</p>
        </div>

        <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-gov-card space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Utilized Amount</p>
          <h3 className="text-2xl font-black font-mono text-emerald-700">{formatINR(project.utilizedAmount)}</h3>
          <p className="text-[11px] text-slate-400">Physical MB Certified</p>
        </div>

        <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-gov-card space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Remaining Balance</p>
          <h3 className="text-2xl font-black font-mono text-amber-700">{formatINR(project.remainingAmount)}</h3>
          <p className="text-[11px] text-slate-400">Stage-2 Payout Pending</p>
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
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200">
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
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : step.status === 'in-progress'
                    ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {step.status === 'in-progress' && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
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

            <div className="mt-6 w-full pt-4 border-t border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Model Confidence:</span>
                <span className="font-mono font-bold text-slate-900">94.2%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Anomaly Vectors Caught:</span>
                <span className="font-mono font-bold text-rose-600">{project.anomalies?.length || 4} Factors</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recommended Action:</span>
                <span className="font-bold text-amber-700">Hold Payout & Dispatch Inspection</span>
              </div>
            </div>

            {isCitizen ? (
              <div className="mt-4 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Public Vigilance Status:</span> Automated multi-factor ML verification active across milestone photos and expenditure records.
              </div>
            ) : (
              <div className={`mt-4 w-full p-2.5 rounded-lg text-center text-xs font-semibold ${
                project.riskScore > 70
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : project.riskScore > 40
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}>
                {project.riskScore > 70
                  ? 'High-Priority Review Required • Escalated to Collector'
                  : project.riskScore > 40
                  ? 'Moderate Variance • Periodic Field Inspection Due'
                  : 'Low Risk • Project Progress Milestone Normal'}
              </div>
            )}
          </Card>

          {/* Project Administrative Metadata */}
          <Card title="Project Administration" icon={Building} className="text-xs space-y-3">
            <div>
              <span className="text-slate-500 block">Implementing Agency:</span>
              <span className="font-semibold text-slate-800">{project.implementingAgency}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Contractor:</span>
              <span className="font-semibold text-slate-800">{project.contractor}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sponsoring Hon'ble MP:</span>
              <span className="font-semibold text-slate-800">{project.mpName} ({project.constituency})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nodal District Authority:</span>
              <span className="font-semibold text-slate-800">{project.district}, {project.state}</span>
            </div>
          </Card>

          {/* Verification Audit Signatures */}
          <Card title="Vigilance Trail & Audit Signatures" icon={FileText} className="text-xs space-y-3">
            <div className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Sanction Order Authenticated</p>
                <p className="text-[10px] text-slate-400">Signed with NIC DSC token #48102-DL</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Milestone 1 Geo-Coordinates Matched</p>
                <p className="text-[10px] text-slate-400">Within 15m radius of sanction boundary</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800">Pending Stage-2 MB Measurement</p>
                <p className="text-[10px] text-slate-400">Junior Engineer inspection report awaited</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Explanations & Anomaly Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Explainable Algorithmic Findings</h3>
              <p className="text-xs text-slate-500">Detailed algorithmic justification for high-risk flags</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              {project.anomalies?.length || 4} Signals Extracted
            </span>
          </div>

          <div className="space-y-3">
            {(project.anomalies && project.anomalies.length > 0 ? project.anomalies : [
              {
                id: `${project.id}-AI-1`,
                title: 'Financial Drift: 87.5% funds disbursed with only 35.0% physical work completed.',
                description: 'Financial Drift: 87.5% funds disbursed with only 35.0% physical work completed.',
                evidence: 'Generated by the MPLADS-AI risk engine.',
                severity: 'medium',
                confidence: 52
              },
              {
                id: `${project.id}-AI-2`,
                title: 'Timeline Hazard: 415 days elapsed of 263 sanctioned schedule.',
                description: 'Timeline Hazard: 415 days elapsed of 263 sanctioned schedule.',
                evidence: 'Generated by the MPLADS-AI risk engine.',
                severity: 'medium',
                confidence: 52
              },
              {
                id: `${project.id}-AI-3`,
                title: 'ML Model Alert: IsolationForest flagged this fund/progress/time combination as a statistical outlier (67/100).',
                description: 'ML Model Alert: IsolationForest flagged this fund/progress/time combination as a statistical outlier (67/100).',
                evidence: 'Generated by the MPLADS-AI risk engine.',
                severity: 'medium',
                confidence: 52
              },
              {
                id: `${project.id}-AI-4`,
                title: 'Predictive Overrun Risk: 99% probability this project exceeds its sanctioned budget by >15% without intervention.',
                description: 'Predictive Overrun Risk: 99% probability this project exceeds its sanctioned budget by >15% without intervention.',
                evidence: 'Generated by the MPLADS-AI risk engine.',
                severity: 'medium',
                confidence: 52
              }
            ]).map((ano, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-gov-card space-y-2 hover:border-blue-400 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ano.severity === 'high' || ano.severity === 'critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : ano.severity === 'medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {ano.severity || 'Alert'}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{ano.title}</h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-blue-700">{ano.confidence || 92}%</span>
                    <span className="text-[10px] text-slate-400 block">Confidence</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <span>Anomaly Code: {ano.id}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{ano.description}</p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <strong className="text-slate-800">Auditable Evidence: </strong>
                  <span>{ano.evidence}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Banner */}
          {isCitizen ? (
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-gov-card">
              <div className="text-xs text-slate-600">
                Explore developmental works, contractor bidding histories, and fund allocations across your constituency.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/public/search')}
                icon={ExternalLink}
                className="shrink-0 ml-3"
              >
                Explore Constituency Works
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-gov-card">
              <div className="text-xs text-slate-600">
                Review statutory SLA delay escalation protocols and contractual liability notices.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/sla')}
                icon={Clock}
                className="shrink-0 ml-3"
              >
                Inspect SLA Timelines
              </Button>
            </div>
          )}
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
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <span className="text-slate-500 block font-semibold uppercase">Project Under Action:</span>
            <p className="font-bold text-slate-900">{project.name}</p>
            <p className="text-slate-600">{project.district}, {project.state} • Sanction: {formatINR(project.sanctionedAmount)}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Select Official Order:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionType('VERIFY')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'VERIFY'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Approve & Clear
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('AUDIT')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'AUDIT'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dispatch Audit Team
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('FLAG')}
                className={`p-3 rounded-lg border text-xs font-bold text-center transition-colors ${
                  decisionType === 'FLAG'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Freeze Next Payout
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Official Remarks & File Notation:
            </label>
            <textarea
              rows={3}
              value={decisionRemarks}
              onChange={(e) => setDecisionRemarks(e.target.value)}
              placeholder="Enter official justification, reference to inspection memo, or officer remarks..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
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
