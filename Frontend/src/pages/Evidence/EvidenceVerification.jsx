import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { EvidenceViewer } from '../../components/ui/EvidenceViewer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  MapPin,
  Sparkles,
  FileCheck2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div className="p-12 text-center text-slate-400">Loading neural forensic evidence comparison...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="AI Evidence Verification Lab"
      subtitle="Computer Vision forensic comparison between uploaded physical progress photos and historical archive models."
      breadcrumbs={['Dashboard', 'AI Evidence Lab', project.id]}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          96% DUPLICATE SIMILARITY
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('INSPECT')}
            icon={MapPin}
          >
            Request Inspection
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction('FLAG')}
            icon={ShieldAlert}
          >
            Flag Evidence & Freeze
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleAction('VERIFY')}
            icon={ShieldCheck}
          >
            Mark Verified
          </Button>
        </div>
      }
    >
      {/* Evidence Viewer Side-by-Side Component */}
      <EvidenceViewer
        uploadedImage={project.images?.uploaded}
        matchedImage={project.images?.matched}
        uploadedMeta={project.images?.uploadedMeta}
        matchedMeta={project.images?.matchedMeta}
        similarity={96}
      />

      {/* AI Forensic Integrity Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Image Similarity</span>
          <h4 className="text-xl font-black font-mono text-rose-400">96% Match</h4>
          <p className="text-[11px] text-slate-500">Perceptual hash & ResNet-50 feature alignment</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Geo-location Check</span>
          <h4 className="text-xl font-black font-mono text-emerald-400">Verified (80m)</h4>
          <p className="text-[11px] text-slate-500">Inside sanctioned boundary (Chiraigaon Block)</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Duplicate Status</span>
          <h4 className="text-xl font-black font-mono text-rose-400">Suspicious Match</h4>
          <p className="text-[11px] text-slate-500">Matched with Jaunpur 2024 road archive</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Recommended Decision</span>
          <h4 className="text-xl font-black font-mono text-rose-400">HIGH RISK / AUDIT</h4>
          <p className="text-[11px] text-slate-500">Hold ₹27L Stage-2 release until field audit</p>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, action: '' })}
        title={
          actionModal.action === 'FLAG'
            ? 'Flag Forensic Photo Evidence'
            : actionModal.action === 'VERIFY'
            ? 'Manually Verify Evidence'
            : 'Order Physical Field Audit'
        }
        subtitle={`Project: ${project.id} (${project.name})`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            {actionModal.action === 'FLAG'
              ? 'This will immediately freeze further fund disbursals for this project and issue an emergency notice to the implementing agency (RES Div-2).'
              : actionModal.action === 'VERIFY'
              ? 'Are you certain you want to manually certify this photo progress despite the 96% similarity flag? Your digital token ID will be logged.'
              : 'A formal physical inspection task will be dispatched to the Assistant Engineer & Nodal Field Officer in Varanasi.'}
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Official Note / Justification:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official order text or reasons..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionModal({ open: false, action: '' })}
            >
              Cancel
            </Button>
            <Button
              variant={actionModal.action === 'FLAG' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirmAction}
              icon={Send}
            >
              Submit Order
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
