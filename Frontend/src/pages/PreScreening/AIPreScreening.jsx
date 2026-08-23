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
  Send
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
    checks: [
      { name: 'Photo Verification', status: 'pass', detail: 'Clean computer lab setup with genuine EXIF & no perceptual duplicates.' },
      { name: 'Cost Baseline Check', status: 'pass', detail: '₹18 Lakh is within 3.2% of national smart classroom benchmark.' },
      { name: 'Vendor Integrity History', status: 'pass', detail: 'Vendor EdTech Next India has 0 prior collusion or blacklisting flags.' },
      { name: 'No Duplicate Asset Found', status: 'pass', detail: 'No existing smart class recorded in same school campus.' },
      { name: 'Geo-location Boundary Match', status: 'pass', detail: 'GPS exact coordinates match school revenue survey plot.' },
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
    checks: [
      { name: 'Photo Verification', status: 'fail', detail: '96% perceptual hash match with completed 2024 Jaunpur road.' },
      { name: 'Cost Baseline Check', status: 'fail', detail: 'Rate is 42% higher than District Schedule of Rates (DSR baseline).' },
      { name: 'Vendor Integrity History', status: 'fail', detail: 'Apex Infra shares registered director with 2 rival bidder firms.' },
      { name: 'No Duplicate Asset Found', status: 'pass', detail: 'No conflicting MPLADS road in immediate 500m radius.' },
      { name: 'Geo-location Boundary Match', status: 'pass', detail: 'Coordinates match within Chiraigaon block boundary.' },
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
        ? 'Sent for Senior District Review'
        : 'Rejected & Tender Cancelled';
    showToast(`Decision recorded: ${actionText} for ${activeProject.id}`, modalAction.type === 'APPROVE' ? 'success' : 'error');
    setModalAction({ open: false, type: '' });
  };

  return (
    <PageLayout
      title="AI Pre-Screening & Disbursal Audit"
      subtitle="Automated 5-point neural integrity verification before sanctioning funds or milestone disbursals."
      breadcrumbs={['District Suite', 'AI Pre-Screening']}
      actions={
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setSelectedCase('clean')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedCase === 'clean' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clean Case (18% Risk)
          </button>
          <button
            onClick={() => setSelectedCase('suspicious')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedCase === 'suspicious' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Suspicious Case (87% Risk)
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title={activeProject.name}
            subtitle={`ID: ${activeProject.id} • ${activeProject.location}`}
            icon={Building}
            riskAccent={activeProject.riskLevel === 'HIGH' ? 'critical' : 'low'}
          >
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Sanctioned Amount:</span>
                <span className="font-mono font-bold text-white">{formatINR(activeProject.sanctionedAmount)}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Implementing Agency:</span>
                <span className="font-semibold text-slate-200">{activeProject.agency}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">AI Neural Threat Score:</span>
                <span className={`font-mono font-bold ${activeProject.riskScore >= 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeProject.riskScore} / 100 ({activeProject.riskLevel} RISK)
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Button
                variant={activeProject.riskScore >= 60 ? 'secondary' : 'success'}
                size="md"
                onClick={() => handleAction('APPROVE')}
                icon={CheckCircle2}
              >
                Approve Disbursal
              </Button>
              <Button
                variant="warning"
                size="md"
                onClick={() => handleAction('REVIEW')}
                icon={AlertTriangle}
              >
                Send for Physical Review
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => handleAction('REJECT')}
                icon={XCircle}
              >
                Reject & Flag Project
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: 5-Point AI Integrity Checks Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="5-Point Automated AI Pre-Checks"
            subtitle="Deep neural baseline evaluation across computer vision, ROC registry, and DSR baselines"
            icon={Sparkles}
          >
            <div className="space-y-3">
              {activeProject.checks.map((chk, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    chk.status === 'pass'
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-200'
                      : 'bg-rose-950/20 border-rose-900/40 text-slate-200 shadow-glow-red/10'
                  }`}
                >
                  <div className="mt-0.5">
                    {chk.status === 'pass' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{chk.name}</h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          chk.status === 'pass'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {chk.status === 'pass' ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{chk.detail}</p>
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
        title={`Confirm Decision: ${modalAction.type}`}
        subtitle={`Project: ${activeProject.id}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            You are recording an official order as <strong>District Project Officer</strong>. This decision will be logged to the national PFMS database and digitally signed.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Official Justification / Order Note:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official file reference or justification..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalAction({ open: false, type: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDecision}
              icon={Send}
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
