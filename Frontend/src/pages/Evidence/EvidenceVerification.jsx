import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { EvidenceViewer } from '../../components/ui/EvidenceViewer';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  MapPin,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PentagonCard } from '../../components/common/PentagonCard';

export const EvidenceVerification = () => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [actionModal, setActionModal] = useState({ open: false, action: '' });
  const [remarks, setRemarks] = useState('');
  const { showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProjectById('MPLAD-2026-00124');
      if (res.success) {
        setProject(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    setActionModal({ open: true, action: actionType });
  };

  const handleConfirmAction = async () => {
    const action = actionModal.action;
    if (action === 'FLAG') {
      await api.updateProjectDecision(project.id, 'UNDER_INVESTIGATION', remarks || 'Flagged for duplicate photo');
      setIsFlagged(true);
      showToast('Evidence flagged! Funds frozen pending physical field audit.', 'error');
    } else if (action === 'VERIFY') {
      await api.updateProjectDecision(project.id, 'VERIFIED', remarks || 'Overruled by officer with physical certificate');
      showToast('Evidence manually verified with officer digital signature.', 'success');
    } else {
      await api.updateProjectDecision(project.id, 'FLAGGED', remarks || 'Inspection team dispatched');
      showToast('Physical on-site inspection team dispatched to Varanasi GPS coordinates.', 'info');
    }
    setActionModal({ open: false, action: '' });
  };

  if (isLoading || !project) {
    return (
      <PageLayout title="AI Evidence Verification" breadcrumbs={['Dashboard', 'Evidence Lab']}>
        <div className="p-12 text-center text-slate-500 font-medium">Loading neural forensic evidence comparison...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Digital Forensics Evidence Workbench"
      subtitle="Automated photo analysis comparing newly submitted site progress against past works across India to detect duplicate or recycled photos."
      breadcrumbs={['Dashboard', 'AI Evidence Lab', project.id]}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
          96% DUPLICATE OVERLAP FLAGGED
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('INSPECT')}
            icon={MapPin}
            className="border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Dispatch Inspection
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction('FLAG')}
            icon={ShieldAlert}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
          >
            Freeze Milestone Funds
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleAction('VERIFY')}
            icon={ShieldCheck}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            Digital Sign-Off
          </Button>
        </div>
      }
    >
      {/* Evidence Viewer Side-by-Side Component with live 64-bit dHash Strip */}
      <EvidenceViewer
        uploadedImage={project.images?.uploaded}
        matchedImage={project.images?.matched}
        uploadedMeta={project.images?.uploadedMeta}
        matchedMeta={project.images?.matchedMeta}
        similarity={96}
      />

      {/* Plain-English AI Forensic Integrity Checklist (BankLY Pattern 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        <PentagonCard
          index={0}
          title="Photo Similarity Check"
          value="96.9% Match"
          subtitle="Structurally matches older project"
          icon={Camera}
          variant="danger"
        />

        <PentagonCard
          index={1}
          title="GPS Site Location"
          value="Coordinates Valid"
          subtitle="Within 80m of sanctioned road"
          icon={MapPin}
          variant="success"
        />

        <PentagonCard
          index={2}
          title="Prior Archive Record"
          value="Cross-District Match"
          subtitle="Submitted in Jaunpur (2024 work)"
          icon={ShieldAlert}
          variant="danger"
        />

        <PentagonCard
          index={3}
          title="Recommended Action"
          value="Hold Milestone Funds"
          subtitle="Pause ₹14.2 Lakhs payout"
          icon={ShieldCheck}
          variant="warning"
        />
      </div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, action: '' })}
        title={
          actionModal.action === 'FLAG'
            ? 'Order Formal Forensic Freeze'
            : actionModal.action === 'VERIFY'
            ? 'Authorize Exception Verification'
            : 'Dispatch On-Site Audit Team'
        }
        subtitle={`Project Dossier: ${project.id} (${project.name})`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {actionModal.action === 'FLAG'
              ? 'This statutory order will immediately freeze further fund disbursals for this work and generate an official inquiry notice to Rural Engineering Department (RED Div-2).'
              : actionModal.action === 'VERIFY'
              ? 'Are you certain you want to manually certify this photo progress despite the 96% similarity flag? Your digital token ID will be permanently recorded in the audit log.'
              : 'A formal physical inspection order will be dispatched to the Assistant Engineer & Nodal Field Officer in Varanasi.'}
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Official Reason / Audit Justification:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official auditor findings or order rationale..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionModal({ open: false, action: '' })}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              variant={actionModal.action === 'FLAG' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirmAction}
              icon={Send}
              className={actionModal.action === 'FLAG' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'}
            >
              Issue Order
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
