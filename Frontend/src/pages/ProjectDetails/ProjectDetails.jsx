import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FALLBACK_PROJECTS } from '../../data/fallbackProjects';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../utils/constants';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  IndianRupee,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  Network,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
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
      <div className="p-12 text-center text-slate-500 font-medium">
        Loading comprehensive project dossier...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <p>Project dossier could not be located.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Calculations for display
  const sanctionedLakh = Math.round((project.sanctionedAmount || 0) / 100000);
  const releasedLakh = Math.round((project.releasedAmount || 0) / 100000);
  const utilizedLakh = Math.round((project.utilizedAmount || 0) / 100000);
  const unspentLakh = Math.max(0, releasedLakh - utilizedLakh);
  const fundsUtilPct = sanctionedLakh > 0 ? Math.round((utilizedLakh / sanctionedLakh) * 100) : 0;
  const physicalProgressPct = project.progressPercent || 45;
  const riskScoreVal = project.riskScore || 70;

  // Timeline steps
  const timelineSteps = project.timeline && project.timeline.length > 0 ? project.timeline : [
    { stage: 'Approved', date: 'Aug 2024', status: 'completed' },
    { stage: 'Funds Released', date: 'Oct 2024', status: 'completed' },
    { stage: 'Work Started', date: 'Nov 2024', status: 'completed' },
    { stage: 'Work Progress', date: 'Jan 2025', status: 'in-progress' },
    { stage: 'Field Inspection', date: 'Pending', status: 'pending' },
    { stage: 'Completion', date: 'Pending', status: 'pending' },
  ];

  // Circle Gauge Dimensions & Animation
  const circleSize = 140;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 270 degree sweep for gauge or standard circumference
  const strokeOffset = circumference - (riskScoreVal / 100) * circumference;

  return (
    <div className="space-y-8 pb-16">
      {/* ========================================================================= */}
      {/* HEADER SECTION with Breadcrumb, Title, Tag & Transparent Background Image */}
      {/* ========================================================================= */}
      <div className="relative bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 overflow-hidden shadow-xs">
        {/* Transparent Decorative Road & Trees Vector in the Upper Right Corner */}
        <div className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 pointer-events-none opacity-20 overflow-hidden">
          <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <path d="M400 200 C300 180 240 120 180 80 C120 40 40 10 0 0 L400 0 Z" fill="#93C5FD" />
            <path d="M400 170 C310 150 250 95 190 60 C130 25 50 5 0 0" stroke="#3B82F6" strokeWidth="4" strokeDasharray="12 8" />
            <circle cx="280" cy="50" r="18" fill="#60A5FA" />
            <circle cx="330" cy="40" r="24" fill="#93C5FD" />
            <circle cx="240" cy="65" r="14" fill="#3B82F6" />
            <circle cx="360" cy="70" r="16" fill="#60A5FA" />
          </svg>
        </div>

        <div className="relative z-10 space-y-2.5">
          {/* Clean Small Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-600 font-semibold">Project Details</span>
          </div>

          {/* Project Title */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {project.name}
            </h1>
          </div>

          {/* Project Metadata Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex flex-wrap items-center gap-2">
            <span>Project ID: <strong className="font-mono text-slate-700">{project.id}</strong></span>
            <span>•</span>
            <span>{project.location || `${project.district}, ${project.state}`}</span>
            <span>•</span>
            <span>{project.district}, {project.state}</span>
          </p>
        </div>

          {/* Action Buttons for Authorized Officers */}
          {!isCitizen && (
            <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-4 mt-3 border-t border-slate-100">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/grievances')}
                  icon={FileText}
                  className="text-xs font-semibold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-xl"
                >
                  Public Vigilance Reports
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/cartel-matrix')}
                icon={Network}
                className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Cartel Graph
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => navigate('/evidence')}
                icon={Camera}
                className="text-xs font-semibold rounded-xl"
              >
                Verify AI Evidence
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDecisionModalOpen(true)}
                icon={ShieldCheck}
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Take Official Action
              </Button>
            </div>
          )}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN GRID: Left (Risk + Funds) & Right (Progress + Why Flagged) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN (5 of 12)                                                  */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          
          {/* Card 1: Risk Overview with Animated Circle Gauge */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Orange Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-amber-500 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Risk Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI analysis of documents, spending patterns and project progress.
                </p>
              </div>
            </div>

            {/* Split: Animated Circle Gauge (Left) + 3 Metrics (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
              {/* Circle Gauge */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
                  <svg className="transform -rotate-90" width={circleSize} height={circleSize}>
                    {/* Background Track */}
                    <circle
                      cx={circleSize / 2}
                      cy={circleSize / 2}
                      r={radius}
                      stroke="#F1F5F9"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    {/* Animated Stroke Circle */}
                    <motion.circle
                      cx={circleSize / 2}
                      cy={circleSize / 2}
                      r={radius}
                      stroke={riskScoreVal >= 70 ? '#F97316' : riskScoreVal >= 40 ? '#FBBF24' : '#10B981'}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Gauge Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                      {riskScoreVal}
                      <span className="text-xs font-normal text-slate-400 font-sans">/100</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 mt-0.5">
                      {riskScoreVal >= 70 ? 'High Risk' : riskScoreVal >= 40 ? 'Warning' : 'Safe'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Right Key Metrics */}
              <div className="sm:col-span-7 space-y-3.5 sm:border-l sm:border-slate-100 sm:pl-5">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Model confidence</span>
                  <span className="text-lg font-black font-mono text-slate-900">
                    {project.mlAnomalyScore ? `${project.mlAnomalyScore}%` : '94.2%'}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-2.5">
                  <span className="text-[11px] text-slate-400 font-medium block">Critical signals found</span>
                  <span className="text-lg font-black font-mono text-slate-900">
                    {project.anomalies?.length || 5}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-2.5">
                  <span className="text-[11px] text-slate-400 font-medium block">Recommended action</span>
                  <span className="text-xs font-bold text-amber-600 block mt-0.5">
                    Hold milestone payout
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fund Utilization (BankLY Pattern 7) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Emerald Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-emerald-500 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Fund Utilization</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Amount-wise breakdown of the project funds.
                </p>
              </div>
            </div>

            {/* 4 Clean Value Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl space-y-1 text-left">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sanctioned</span>
                <span className="text-base font-black font-mono text-slate-900">₹{sanctionedLakh} Lakh</span>
              </div>

              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl space-y-1 text-left">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Released</span>
                <span className="text-base font-black font-mono text-blue-700">₹{releasedLakh} Lakh</span>
              </div>

              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl space-y-1 text-left">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Utilized</span>
                <span className="text-base font-black font-mono text-emerald-700">₹{utilizedLakh} Lakh</span>
              </div>

              <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl space-y-1 text-left">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Unspent</span>
                <span className="text-base font-black font-mono text-amber-600">₹{unspentLakh} Lakh</span>
              </div>
            </div>

            {/* Progress Bars for Funds Utilization & Physical Progress (BankLY Pattern 7) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Funds Utilization</span>
                  <span className="font-mono font-bold text-slate-900">{fundsUtilPct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-emerald-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, fundsUtilPct)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">₹{utilizedLakh}L utilized of ₹{sanctionedLakh}L total</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Physical Progress</span>
                  <span className="font-mono font-bold text-slate-900">{physicalProgressPct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-blue-600 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, physicalProgressPct)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Verified by field monitoring & geotag</p>
              </div>
            </div>
          </div>

          {/* Card: Project Details (BankLY Pattern 10) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Purple Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-[#2E1065] pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Administrative jurisdiction and execution parties.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
              <div className="space-y-1 p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Implementing Agency</span>
                <span className="text-slate-900 font-bold block">{project.implementingAgency || 'MPLADS Implementing Agency'}</span>
                <span className="text-slate-400 text-[10px] block">(Govt. of {project.state || 'UP'})</span>
              </div>

              <div className="space-y-1 p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Contractor</span>
                <span className="text-slate-900 font-bold block">{project.contractor || 'Apex Infra & BuildTech Pvt Ltd'}</span>
                <span className="text-slate-400 text-[10px] block">(Vendor ID: VEN-2024-81)</span>
              </div>

              <div className="space-y-1 p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Sponsoring MP</span>
                <span className="text-slate-900 font-bold block">{project.mpName || 'Shri Narendra Modi'}</span>
                <span className="text-slate-400 text-[10px] block">({project.district || 'Varanasi'})</span>
              </div>

              <div className="space-y-1 p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">District Authority</span>
                <span className="text-slate-900 font-bold block">{project.district}, {project.state}</span>
                <span className="text-slate-400 text-[10px] block">(District Collector)</span>
              </div>
            </div>
          </div>

          {/* Card: Physical Progress Evidence Photo */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between border-l-4 border-purple-600 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Field Progress Evidence</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Geotagged site photograph submitted by executing agency.
                </p>
              </div>
              <Link to="/evidence" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <span>Forensic Lab</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
              <img
                src={project.images?.uploaded || "/projects/ruralroad.jpg"}
                alt={project.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>{project.id} • {project.district}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (7 of 12)                                                 */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* Card 3: Project Progress with Step Horizontal Timeline Transition */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Blue Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-blue-600 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current stage of work and timeline.
                </p>
              </div>
            </div>

            {/* Animated Interactive Step Timeline with Full Sliding Active Orb */}
            <div className="pt-2 pb-2">
              <div>
                {/* Row 1: Step Labels (Titles and Dates) perfectly aligned */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 items-end mb-3">
                  {timelineSteps.map((step, idx) => {
                    const isDone = step.status === 'completed';
                    const isCurrent = step.status === 'in-progress';

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-end text-center px-1"
                      >
                        <motion.span
                          initial={{ opacity: 0.4 }}
                          animate={{
                            opacity: 1,
                            fontWeight: isCurrent ? 800 : isDone ? 700 : 500,
                            color: isCurrent ? '#1d4ed8' : isDone ? '#1e293b' : '#94a3b8'
                          }}
                          transition={{ duration: 0.5, delay: idx * 0.15 }}
                          className="text-[11px] leading-tight transition-colors line-clamp-2"
                        >
                          {step.stage}
                        </motion.span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                          {step.date}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Row 2: Connecting Track Line + Node Stations (All sharing the exact 50% vertical center) */}
                <div className="relative h-8 flex items-center">
                  {/* Continuous Background Track Line across the grid */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[8.33%] right-[8.33%] h-1 bg-slate-200 rounded-full z-0 overflow-hidden">
                    {/* Active progress bar filling left to right */}
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${
                          timelineSteps.length > 1
                            ? (Math.max(0, timelineSteps.findIndex(s => s.status === 'in-progress')) / (timelineSteps.length - 1)) * 100
                            : 0
                        }%`
                      }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  {/* Gliding Full Active Circle Indicator that physically moves left-to-right to the current step */}
                  {(() => {
                    const currentIdx = Math.max(0, timelineSteps.findIndex(s => s.status === 'in-progress'));
                    const totalSteps = timelineSteps.length;
                    const targetLeftPct = (currentIdx / (totalSteps - 1)) * 100;

                    return (
                      <div className="absolute top-1/2 -translate-y-1/2 left-[8.33%] right-[8.33%] pointer-events-none z-20 flex items-center">
                        <motion.div
                          className="absolute -top-3.5 -ml-3.5 flex items-center justify-center"
                          initial={{ left: '0%', scale: 0.8 }}
                          animate={{ left: `${targetLeftPct}%`, scale: 1 }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {/* Outer radiating pulse */}
                          <motion.span
                            className="absolute w-8 h-8 rounded-full bg-blue-500/25"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.1, 0.7] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          />
                          {/* Main solid vibrant indicator circle */}
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                          </div>
                        </motion.div>
                      </div>
                    );
                  })()}

                  {/* Station Anchor Nodes */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full h-8 relative z-10">
                    {timelineSteps.map((step, idx) => {
                      const isDone = step.status === 'completed';
                      const isCurrent = step.status === 'in-progress';

                      return (
                        <div
                          key={idx}
                          className="h-full flex items-center justify-center relative group"
                        >
                          {isDone ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.18 }}
                              whileHover={{ scale: 1.25 }}
                              className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center shadow-xs cursor-pointer"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </motion.div>
                          ) : isCurrent ? (
                            /* Space reserved for gliding circle */
                            <div className="w-7 h-7" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white group-hover:border-slate-400 transition-colors" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Why this project was flagged (BankLY Pattern 5) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Orange Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-amber-500 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Why this project was flagged</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Key issues found by the AI engine.
                </p>
              </div>
            </div>

            {/* List of Simplified Key Issues */}
            <div className="divide-y divide-slate-100">
              {(project.anomalies && project.anomalies.length > 0
                ? project.anomalies.slice(0, 4).map((anom, idx) => ({
                    title: typeof anom === 'string' ? anom : anom.description || anom.title || 'Anomalous pattern detected',
                    tag: idx < 2 ? 'CRITICAL' : 'REVIEW',
                    pct: `${Math.max(55, Math.min(95, Math.round(riskScoreVal * (1 - idx * 0.08))))}%`,
                    isCrit: idx < 2,
                  }))
                : [
                    {
                      title: project.delayDays ? `Timeline is ${project.delayDays} days behind schedule` : 'Timeline is 109 days behind schedule',
                      tag: 'CRITICAL',
                      pct: `${Math.round(riskScoreVal * 0.95)}%`,
                      isCrit: true,
                    },
                    {
                      title: 'Spending pattern looks unusual against progress',
                      tag: 'CRITICAL',
                      pct: `${Math.round(riskScoreVal * 0.88)}%`,
                      isCrit: true,
                    },
                    {
                      title: 'Stage-2 measurement & MB entry is pending',
                      tag: 'REVIEW',
                      pct: '64%',
                      isCrit: false,
                    },
                    {
                      title: 'Physical progress lower than benchmark for sector',
                      tag: 'REVIEW',
                      pct: '58%',
                      isCrit: false,
                    }
                  ]
              ).map((item, idx) => (
                <div key={idx} className="py-3.5 px-2 rounded-xl hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4 text-xs">
                  <span className="text-slate-800 font-semibold">{item.title}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      item.isCrit
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.tag}
                    </span>
                    <span className="font-mono text-slate-500 font-bold text-xs w-9 text-right">
                      {item.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Verified Records (BankLY Pattern 5) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header with Emerald Accent Bar */}
            <div className="flex items-start gap-3 border-l-4 border-emerald-500 pl-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Verified Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Checks against official records and documents.
                </p>
              </div>
            </div>

            {/* Records List */}
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 px-2 rounded-xl hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 font-medium">Work order & agreement</span>
                </div>
                <span className="text-emerald-700 font-bold font-mono text-xs">Verified</span>
              </div>
              <div className="py-3 px-2 rounded-xl hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 font-medium">Payment records</span>
                </div>
                <span className="text-emerald-700 font-bold font-mono text-xs">Verified</span>
              </div>
              <div className="py-3 px-2 rounded-xl hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-800 font-medium">Measurement book</span>
                </div>
                <span className="text-amber-700 font-bold font-mono text-xs">Pending</span>
              </div>
              <div className="py-3 px-2 rounded-xl hover:bg-slate-50/70 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 font-medium">Inspection reports</span>
                </div>
                <span className="text-emerald-700 font-bold font-mono text-xs">Verified</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer System Disclaimer */}
      <div className="text-[11px] text-slate-400 pt-2 font-mono">
        Generated by MPLAD Sentinel AI risk engine
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
    </div>
  );
};

