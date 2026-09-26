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
      subtitle="Explainable 5-point automated verification evaluating budget benchmarks, photo uniqueness, and contractor history before fund release."
      breadcrumbs={['District Suite', 'AI Pre-Screening']}
      actions={
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedCase('clean')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCase === 'clean'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full transition-colors ${selectedCase === 'clean' ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-300'}`} />
            <span>Clean Case</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${selectedCase === 'clean' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
              18% Risk
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCase('suspicious')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCase === 'suspicious'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full transition-colors ${selectedCase === 'suspicious' ? 'bg-rose-500 ring-2 ring-rose-100' : 'bg-slate-300'}`} />
            <span>Suspicious Case</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${selectedCase === 'suspicious' ? 'bg-rose-50 text-rose-700' : 'text-slate-400'}`}>
              87% Risk
            </span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Project Dossier */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title={activeProject.name}
            subtitle={`Work ID: ${activeProject.id} • ${activeProject.location}`}
            icon={Building}
            className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden"
            headerClassName="bg-slate-50/70 border-b border-slate-200 px-6 py-4.5"
            bodyClassName="p-6 sm:p-7 space-y-6"
            action={
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 border ${
                activeProject.riskLevel === 'HIGH'
                  ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeProject.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                {activeProject.riskLevel === 'HIGH' ? 'HIGH RISK (87/100)' : 'LOW RISK (18/100)'}
              </span>
            }
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Sanction Amount:</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(activeProject.sanctionedAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Implementing Agency:</span>
                <span className="font-semibold text-slate-800 truncate ml-2 text-right">{activeProject.agency}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Composite Threat Index:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{activeProject.riskScore} / 100</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    activeProject.riskScore >= 60
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {activeProject.riskLevel} TIER
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Recommendation Banner */}
            <div className={`p-4 rounded-xl border transition-colors ${
              activeProject.recommendationTone === 'danger'
                ? 'bg-rose-50/35 border-rose-200/80 text-slate-800'
                : 'bg-slate-50/90 border-slate-200/90 text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>AI Recommendation (Predictive)</span>
                </div>
                <span className="font-mono px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
                  {activeProject.aiConfidence} Confidence
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-black tracking-tight">
                <span className={`w-2 h-2 rounded-full shrink-0 ${activeProject.recommendationTone === 'danger' ? 'bg-rose-600' : 'bg-emerald-500'}`} />
                <span className={activeProject.recommendationTone === 'danger' ? 'text-rose-900' : 'text-slate-900'}>
                  {activeProject.aiRecommendation}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                Recommendation is algorithmic guidance under Human-in-the-Loop protocol; final statutory order requires District Officer digital signature.
              </p>
            </div>

            {/* Hierarchical Action Controls */}
            <div className="pt-2 flex flex-col gap-2">
              {selectedCase === 'clean' ? (
                <>
                  {/* Recommended Primary Button for Clean Case */}
                  <button
                    type="button"
                    onClick={() => handleAction('APPROVE')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2E1065] hover:bg-[#1E1B4B] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Approve Disbursal Order</span>
                  </button>

                  {/* Secondary Alternative Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAction('REVIEW')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Field Inspection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('REJECT')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50/60 text-slate-600 hover:text-rose-700 border border-slate-200/90 shadow-2xs text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Freeze Payout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Recommended Primary Button for Suspicious Case */}
                  <button
                    type="button"
                    onClick={() => handleAction('REJECT')}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
                  >
                    <XCircle className="w-4 h-4 text-rose-100" />
                    <span>Freeze Payout & Issue Show-Cause Notice</span>
                  </button>

                  {/* Secondary Alternative Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAction('REVIEW')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-800 border border-slate-200/90 shadow-2xs text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Field Inspection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('APPROVE')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200/90 shadow-2xs text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer opacity-80 hover:opacity-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Override & Approve</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Right: 5-Point AI Integrity Checks Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Explainable 5-Point AI Integrity Evaluation"
            subtitle="Automated checks across photo evidence, cost benchmarks, vendor history, duplicate assets, and GPS bounds"
            icon={Sparkles}
            className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden"
            headerClassName="bg-slate-50/70 border-b border-slate-200 px-6 py-4.5"
            bodyClassName="p-6 sm:p-7 space-y-4"
            action={
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                {activeProject.checks.filter((c) => c.status === 'pass').length} of {activeProject.checks.length} Clear
              </span>
            }
          >
            <div className="space-y-4">
              {activeProject.checks.map((chk, i) => (
                <div
                  key={i}
                  className={`p-4 sm:p-4.5 rounded-xl border flex items-start gap-4 transition-all ${
                    chk.status === 'pass'
                      ? 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                      : 'bg-rose-50/30 border-rose-200/80 shadow-2xs hover:border-rose-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {chk.status === 'pass' ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100/90 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200/90 flex items-center justify-center text-rose-600">
                        <XCircle className="w-4 h-4 text-rose-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${chk.status === 'pass' ? 'text-slate-900' : 'text-rose-950'}`}>
                        {chk.name}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-mono ${chk.status === 'pass' ? 'text-slate-400' : 'text-rose-400'}`}>
                          {chk.confidence} match
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            chk.status === 'pass'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-rose-100/90 text-rose-700 border-rose-200/90'
                          }`}
                        >
                          {chk.status === 'pass' ? 'PASSED' : 'FLAGGED'}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${chk.status === 'pass' ? 'text-slate-600' : 'text-slate-700'}`}>
                      {chk.detail}
                    </p>
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
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 leading-relaxed text-slate-600">
            You are recording an official order as <strong className="text-slate-900">District Project Officer</strong>. This statutory file notation will be recorded on the national e-SAKSHI ledger with cryptographic audit trail.
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Official Justification / Order Notation:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official file notation, inspection order number, or reason for action..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-2xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalAction({ open: false, type: '' })}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDecision}
              className="px-4 py-2 rounded-xl bg-[#2E1065] hover:bg-[#1E1B4B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Execute Official Order</span>
            </button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
