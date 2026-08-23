import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import {
  Network,
  Building,
  User,
  FolderGit2,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  ZoomIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartelMatrix = () => {
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNetwork();
  }, []);

  const loadNetwork = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCartelNetwork();
      if (res.success) {
        setNetworkData(res.data);
        // Default to primary suspected vendor
        setSelectedNode(res.data.nodes[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getNodeColor = (type, risk = 0) => {
    if (type === 'director') return '#EC4899'; // Pink for shared directors
    if (type === 'project') return '#3B82F6';  // Blue for projects
    if (type === 'district') return '#10B981'; // Green for districts
    // Vendors
    if (risk >= 85) return '#EF4444';
    if (risk >= 60) return '#F97316';
    return '#EAB308';
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'director': return User;
      case 'project': return FolderGit2;
      case 'district': return MapPin;
      default: return Building;
    }
  };

  return (
    <PageLayout
      title="Cartel & Vendor Relationship Matrix"
      subtitle="Graph intelligence network exposing shared directors, shell contractors, and circular tender collusion."
      breadcrumbs={['Dashboard', 'Cartel Matrix']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          TENDER COLLUSION NETWORK
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Network Graph Canvas (Interactive SVG Graph) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-card-dark relative flex flex-col min-h-[500px]">
          {/* Graph Title & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-slate-100">Eastern UP Infrastructure Tender Cluster</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vendor (High Risk)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Common Director
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Project
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> District
              </span>
            </div>
          </div>

          {/* Interactive Visual Graph Canvas */}
          <div className="flex-1 w-full relative min-h-[420px] flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/60">
            {/* SVG Link lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Lines from Director (DIR-01: 50%, 25%) to Vendors */}
              <line x1="50%" y1="20%" x2="25%" y2="50%" stroke="#EC4899" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="#EC4899" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="50%" y1="20%" x2="75%" y2="50%" stroke="#EC4899" strokeWidth="2" strokeDasharray="4 2" />

              {/* Lines from Apex Infra (V-01: 25%, 50%) to Projects */}
              <line x1="25%" y1="50%" x2="20%" y2="82%" stroke="#EF4444" strokeWidth="2" />
              <line x1="25%" y1="50%" x2="45%" y2="82%" stroke="#EF4444" strokeWidth="2" />
              <line x1="25%" y1="50%" x2="75%" y2="82%" stroke="#EF4444" strokeWidth="1.5" />

              {/* Lines from other vendors to project 124 */}
              <line x1="50%" y1="50%" x2="20%" y2="82%" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="75%" y1="50%" x2="20%" y2="82%" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>

            {/* Positioned Interactive Nodes */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Top Layer: Shared Director */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'DIR-01',
                    name: 'R. K. Agarwal',
                    type: 'director',
                    risk: 95,
                    title: 'Shared Managing Director & Shadow Partner',
                    details: 'Holds 40% equity in Apex Infra, common signatory for Shiva Buildcon, and common GST phone number for Purvanchal Infratech.',
                    connectedVendors: ['Apex Infra & BuildTech', 'Shiva Buildcon Pvt Ltd', 'Purvanchal Infratech'],
                    totalClusterProjects: 17,
                    totalDisbursedCr: 8.4,
                  })}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                    selectedNode?.id === 'DIR-01'
                      ? 'bg-pink-950/80 border-pink-500 text-pink-300 ring-2 ring-pink-500/40 shadow-lg scale-105'
                      : 'bg-slate-900 border-pink-500/50 text-pink-300 hover:scale-105'
                  }`}
                >
                  <User className="w-4 h-4 text-pink-400" />
                  <span>R. K. Agarwal (Shared Director)</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-pink-500/20 text-pink-300 font-mono">95% RISK</span>
                </button>
              </div>

              {/* Middle Layer: Competing Bidding Vendors */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {/* Vendor 1 */}
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'V-01',
                    name: 'Apex Infra & BuildTech Pvt Ltd',
                    type: 'vendor',
                    risk: 89,
                    title: 'L1 Awarded Contractor',
                    details: 'Primary recipient of Varanasi & Jaunpur tenders. Repeatedly uploads duplicate photos and shares ROC registration with L2 bidders.',
                    districts: ['Varanasi', 'Jaunpur', 'Kamrup Metro'],
                    projects: 8,
                    avgRiskScore: 86,
                    alerts: 4,
                  })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                    selectedNode?.id === 'V-01'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 shadow-glow-red scale-105'
                      : 'bg-slate-900 border-rose-500/50 text-slate-200 hover:scale-105'
                  }`}
                >
                  <Building className="w-4 h-4 text-rose-400" />
                  <span className="font-bold">Apex Infra & BuildTech</span>
                  <span className="text-[10px] text-rose-400 font-mono">8 Projects (89% Risk)</span>
                </button>

                {/* Vendor 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'V-02',
                    name: 'Shiva Buildcon Pvt Ltd',
                    type: 'vendor',
                    risk: 84,
                    title: 'L2 Dummy Bidder',
                    details: 'Submitted bids priced exactly 4% higher than Apex Infra across 6 consecutive Varanasi tenders.',
                    districts: ['Varanasi', 'Mirzapur'],
                    projects: 5,
                    avgRiskScore: 82,
                    alerts: 3,
                  })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                    selectedNode?.id === 'V-02'
                      ? 'bg-orange-950/80 border-orange-500 text-orange-200 ring-2 ring-orange-500/40 scale-105'
                      : 'bg-slate-900 border-orange-500/50 text-slate-200 hover:scale-105'
                  }`}
                >
                  <Building className="w-4 h-4 text-orange-400" />
                  <span className="font-bold">Shiva Buildcon</span>
                  <span className="text-[10px] text-orange-400 font-mono">5 Projects (84% Risk)</span>
                </button>

                {/* Vendor 3 */}
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'V-03',
                    name: 'Purvanchal Infratech',
                    type: 'vendor',
                    risk: 79,
                    title: 'L3 Disqualified Bidder',
                    details: 'Same registered IP address for tender e-filing as Apex Infra.',
                    districts: ['Varanasi', 'Ghazipur'],
                    projects: 4,
                    avgRiskScore: 78,
                    alerts: 2,
                  })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                    selectedNode?.id === 'V-03'
                      ? 'bg-yellow-950/80 border-yellow-500 text-yellow-200 ring-2 ring-yellow-500/40 scale-105'
                      : 'bg-slate-900 border-yellow-500/50 text-slate-200 hover:scale-105'
                  }`}
                >
                  <Building className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">Purvanchal Infratech</span>
                  <span className="text-[10px] text-yellow-400 font-mono">4 Projects (79% Risk)</span>
                </button>
              </div>

              {/* Bottom Layer: Linked Projects */}
              <div className="flex justify-around items-center">
                {/* Project 1 */}
                <button
                  type="button"
                  onClick={() => navigate('/project/MPLAD-2026-00124')}
                  className="px-3 py-2 rounded-xl bg-blue-950 border border-blue-500/50 text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-all shadow-glow-blue"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>MPLAD-00124 (Varanasi Road)</span>
                </button>

                {/* Project 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'PRJ-892',
                    name: 'MPLAD-2024-00892 (Jaunpur Road)',
                    type: 'project',
                    risk: 92,
                    details: 'Historical project from which duplicate photo evidence was reused in MPLAD-00124.',
                  })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>MPLAD-00892 (Jaunpur 2024)</span>
                </button>

                {/* Project 3 */}
                <button
                  type="button"
                  onClick={() => navigate('/project/MPLAD-2026-00518')}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>MPLAD-00518 (Guwahati LED)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Entity Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <Card
              title={selectedNode.name}
              subtitle={selectedNode.title || 'Entity Dossier'}
              icon={getNodeIcon(selectedNode.type)}
              riskAccent={selectedNode.risk >= 80 ? 'critical' : 'high'}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400">Entity Type:</span>
                <span className="text-xs font-bold uppercase font-mono text-cyan-400">
                  {selectedNode.type}
                </span>
              </div>

              {selectedNode.risk && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400">Collusion Threat Score:</span>
                  <span className="text-sm font-bold font-mono text-rose-400">
                    {selectedNode.risk}/100 High Risk
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                {selectedNode.details}
              </p>

              {selectedNode.districts && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Operational Districts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.districts.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-200">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.connectedVendors && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-pink-400 uppercase">Directly Linked Firms:</span>
                  <div className="space-y-1">
                    {selectedNode.connectedVendors.map((v, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 text-xs text-slate-200 border border-slate-800 flex items-center justify-between">
                        <span>{v}</span>
                        <span className="text-[10px] text-pink-400 font-mono">Shared ROC</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.id === 'V-01' && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => navigate('/project/MPLAD-2026-00124')}
                  className="w-full text-xs shadow-glow-red"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Inspect Flagship Project (MPLAD-00124)
                </Button>
              )}
            </Card>
          ) : (
            <Card className="text-center p-8">
              <Network className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Click any entity node on the graph to inspect cartel connections.</p>
            </Card>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" /> Why this matters:
            </span>
            <p>
              Cartel detection prevents the same contracting mafia from submitting multiple mock bids to manipulate L1 selection thresholds in MPLADS funds.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
