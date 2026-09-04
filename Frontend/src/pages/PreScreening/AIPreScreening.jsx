import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { RiskBadge, Badge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/helpers';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Building,
  FileCheck2,
  MapPin,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

export const AIPreScreening = () => {
  const [selectedCase, setSelectedCase] = useState('clean'); // 'clean' | 'suspicious'
  const [modalAction, setModalAction] = useState({ open: false, type: '' });
  const [remarks, setRemarks] = useState('');
  const { showToast } = useApp();

  const cleanProject = {
    id: 'MPLAD-2026-00089',
    name: 'Digital Smart Classroom Lab & Computer Setup',
    location: 'Govt Model Higher Secondary School, Patna',
    agency: 'Bihar State Educational Infra Corp',
    sanctionedAmount: 1800000,
    riskScore: 18,
    riskLevel: 'LOW',
    aiConfidence: '91.4%',
    aiRecommendation: 'PROCEED WITH STAGE-1 SANCTION',
    recommendationTone: 'success',
    checks: [
      { name: 'Photo Integrity Verification', status: 'pass', confidence: '94%', detail: 'Clean computer lab setup with genuine EXIF timestamp & no perceptual gradient duplicates in repository.' },
      { name: 'Cost Baseline Benchmark', status: 'pass', confidence: '89%', detail: 'Estimated ₹18 Lakh is within 3.2% of national smart classroom schedule baseline.' },
      { name: 'Vendor Integrity History', status: 'pass', confidence: '96%', detail: 'Vendor EdTech Next India has 0 prior collusion, tender ring, or blacklisting flags.' },
      { name: 'Duplicate Asset Geofence', status: 'pass', confidence: '92%', detail: 'No existing smart class asset recorded in same school campus survey records.' },
      { name: 'Geo-location Boundary Match', status: 'pass', confidence: '98%', detail: 'GPS coordinates exactly match school boundary revenue survey plot #412.' },
    ]
  };

  const suspiciousProject = {
    id: 'MPLAD-2026-00124',
    name: 'Rural Road Construction & Paver Block',
    location: 'Chiraigaon Block, Varanasi',
    agency: 'Rural Engineering Services (RES), Div-2',
    sanctionedAmount: 4800000,
    riskScore: 87,
    riskLevel: 'HIGH',
    aiConfidence: '94.2%',
    aiRecommendation: 'HOLD DISBURSAL • DISPATCH ON-SITE PHYSICAL AUDIT',
    recommendationTone: 'danger',
    checks: [
      { name: 'Photo Integrity Verification', status: 'fail', confidence: '96.8%', detail: '96% perceptual gradient dHash match with historical completed 2024 Jaunpur road completion photo.' },
      { name: 'Cost Baseline Benchmark', status: 'fail', confidence: '88%', detail: 'Per-kilometer cost estimate is 42% higher than District Schedule of Rates (DSR baseline).' },
      { name: 'Vendor Integrity History', status: 'fail', confidence: '93%', detail: 'Apex Infra shares registered director with 2 rival bidder firms (ROC collusion alert).' },
      { name: 'Duplicate Asset Geofence', status: 'pass', confidence: '85%', detail: 'No conflicting MPLADS road in immediate 500m radius; alignment is unique.' },
      { name: 'Geo-location Boundary Match', status: 'pass', confidence: '91%', detail: 'Coordinates match within Chiraigaon block boundaries, though milestone progress is unverified.' },
    ]
  };

  const activeProject = selectedCase === 'clean' ? cleanProject : suspiciousProject;

  const handleAction = (type) => {
    setModalAction({ open: true, type });
  };

  const handleConfirmDecision = () => {
    const actionText =
      modalAction.type === 'APPROVE'
        ? 'Approved & Sanction Disbursed'
        : modalAction.type === 'REVIEW'
        ? 'Sent for Senior District Field Review'
        : 'Disbursal Frozen & Tender Under Audit';
    showToast(`Official order recorded: ${actionText} for ${activeProject.id}`, modalAction.type === 'APPROVE' ? 'success' : 'error');
    setModalAction({ open: false, type: '' });
  };

  return (
    <PageLayout
      title="AI Pre-Screening & Disbursal Audit Desk"
      subtitle="Explainable 5-point algorithmic verification evaluating statutory guidelines, photo uniqueness, and tender integrity before fund release."
      breadcrumbs={['District Suite', 'AI Pre-Screening']}
      actions={
        <div className="flex items-center gap-1 bg-gov-surface border border-gov-border rounded-md p-1 text-xs shadow-sm">
          <button
            onClick={() => setSelectedCase('clean')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedCase === 'clean' ? 'bg-emerald-600 text-white' : 'text-gov-slate hover:text-emerald-700'
            }`}
          >
            Clean Case (18% Low Risk)
          </button>
          <button
            onClick={() => setSelectedCase('suspicious')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedCase === 'suspicious' ? 'bg-rose-600 text-white' : 'text-gov-slate hover:text-rose-700'
            }`}
          >
            Suspicious Case (87% High Risk)
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Project Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title={activeProject.name}
            subtitle={`Work ID: ${activeProject.id} • ${activeProject.location}`}
            icon={Building}
            riskAccent={activeProject.riskLevel === 'HIGH' ? 'critical' : 'low'}
          >
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
                <span className="text-gov-muted">Sanction Amount:</span>
                <span className="font-mono font-bold text-gov-slateDark">{formatINR(activeProject.sanctionedAmount)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
                <span className="text-gov-muted">Implementing Agency:</span>
                <span className="font-semibold text-gov-slateDark">{activeProject.agency}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
                <span className="text-gov-muted">Composite Threat Index:</span>
                <span className={`font-mono font-bold ${activeProject.riskScore >= 60 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {activeProject.riskScore} / 100 ({activeProject.riskLevel} TIER)
                </span>
              </div>
            </div>

            {/* Explainable Recommendation Banner */}
            <div className={`mt-4 p-3.5 rounded border ${
              activeProject.recommendationTone === 'danger'
                ? 'bg-rose-50 border-rose-200 text-rose-900 border-l-4 border-l-rose-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 border-l-4 border-l-emerald-600'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>AI Recommendation (Predictive)</span>
                <span className="font-mono">{activeProject.aiConfidence} Confidence</span>
              </div>
              <p className="text-xs font-bold leading-snug">
                {activeProject.aiRecommendation}
              </p>
              <p className="text-[11px] opacity-80 mt-1">
                Recommendation is algorithmic guidance under Human-in-the-Loop protocol; final statutory order requires District Officer digital signature.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gov-border flex flex-col gap-2">
              <Button
                variant={activeProject.riskScore >= 60 ? 'secondary' : 'success'}
                size="md"
                onClick={() => handleAction('APPROVE')}
                icon={CheckCircle2}
                className="w-full text-xs font-bold justify-center"
              >
                Approve Disbursal Order
              </Button>
              <Button
                variant="warning"
                size="md"
                onClick={() => handleAction('REVIEW')}
                icon={AlertTriangle}
                className="w-full text-xs font-bold justify-center"
              >
                Dispatch Physical Field Inspection
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => handleAction('REJECT')}
                icon={XCircle}
                className="w-full text-xs font-bold justify-center"
              >
                Freeze Payout & Issue Show-Cause Notice
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: 5-Point AI Integrity Checks Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Explainable 5-Point AI Integrity Evaluation"
            subtitle="Deep neural baseline evaluation across computer vision, ROC corporate registry, and DSR baselines"
            icon={Sparkles}
          >
            <div className="space-y-2.5">
              {activeProject.checks.map((chk, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded border flex items-start gap-3 transition-colors ${
                    chk.status === 'pass'
                      ? 'bg-gov-surface border-gov-border text-gov-slate'
                      : 'bg-rose-50/70 border-rose-200 text-gov-slate border-l-4 border-l-rose-600'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {chk.status === 'pass' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-gov-slateDark">{chk.name}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-gov-muted">{chk.confidence} match</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            chk.status === 'pass'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {chk.status === 'pass' ? 'PASSED' : 'FLAGGED'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gov-slate mt-1 leading-relaxed">{chk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Decision Confirmation Modal */}
      <Modal
        isOpen={modalAction.open}
        onClose={() => setModalAction({ open: false, type: '' })}
        title={`Authorize District Order: ${modalAction.type}`}
        subtitle={`Work Dossier: ${activeProject.id} (${activeProject.name})`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gov-slate leading-relaxed">
            You are recording an official order as <strong>District Project Officer</strong>. This statutory file notation will be recorded on the national e-SAKSHI ledger with cryptographic audit trail.
          </p>

          <div>
            <label className="text-xs font-bold text-gov-slateDark uppercase tracking-wider block mb-1.5">
              Official Justification / Order Notation:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official file notation, inspection order number, or reason for action..."
              className="w-full bg-white border border-gov-border rounded p-2.5 text-xs text-gov-slateDark placeholder-gov-muted focus:outline-none focus:ring-1 focus:ring-gov-navy shadow-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gov-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalAction({ open: false, type: '' })}
              className="border-gov-border text-gov-slate"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDecision}
              icon={Send}
              className="bg-gov-navy hover:bg-gov-navyDark text-white"
            >
              Execute Official Order
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
