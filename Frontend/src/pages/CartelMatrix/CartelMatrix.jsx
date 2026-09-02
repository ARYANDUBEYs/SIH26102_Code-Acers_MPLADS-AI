import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import {
  Network,
  Building,
  User,
  FolderGit2,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  Scale
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
      title="Vendor Cartel & Bipartite Collusion Matrix"
      subtitle="NetworkX Bipartite Graph Intelligence calculating Herfindahl-Hirschman Index (HHI) to detect shadow directors, shell entities, and tender ring manipulation."
      breadcrumbs={['Dashboard', 'Cartel Matrix']}
      badge={
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
          NETWORKX GRAPH INTEL (HHI: 4,820)
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Network Graph Canvas (Interactive SVG Graph) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-gov-card relative flex flex-col min-h-[520px]">
          {/* Graph Title & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-bold text-slate-900">Eastern UP Infrastructure Tender Bipartite Cluster</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Primary Contractor (High Risk)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-600" /> Common Director / ROC
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Public Work
              </span>
            </div>
          </div>

          {/* Interactive Visual Graph Canvas */}
          <div className="flex-1 w-full relative min-h-[440px] flex items-center justify-center bg-slate-50/70 rounded-xl overflow-hidden border border-slate-200">
            {/* SVG Link lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Lines from Director (DIR-01: 50%, 20%) to Vendors */}
              <line x1="50%" y1="18%" x2="25%" y2="50%" stroke="#DB2777" strokeWidth="2" strokeDasharray="6 4" className="animate-flow-dash" />
              <line x1="50%" y1="18%" x2="50%" y2="50%" stroke="#DB2777" strokeWidth="2" strokeDasharray="6 4" className="animate-flow-dash" />
              <line x1="50%" y1="18%" x2="75%" y2="50%" stroke="#DB2777" strokeWidth="2" strokeDasharray="6 4" className="animate-flow-dash" />

              {/* Lines from Apex Infra (V-01: 25%, 50%) to Projects */}
              <line x1="25%" y1="50%" x2="20%" y2="82%" stroke="#DC2626" strokeWidth="2.5" />
              <line x1="25%" y1="50%" x2="45%" y2="82%" stroke="#DC2626" strokeWidth="2.5" />
              <line x1="25%" y1="50%" x2="75%" y2="82%" stroke="#DC2626" strokeWidth="1.5" />

              {/* Lines from other dummy bidders to project 124 */}
              <line x1="50%" y1="50%" x2="20%" y2="82%" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow-dash-reverse" />
              <line x1="75%" y1="50%" x2="20%" y2="82%" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow-dash-reverse" />
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
                    details: 'Holds 40% equity in Apex Infra, registered common signatory for Shiva Buildcon, and identical GST contact phone number for Purvanchal Infratech.',
                    connectedVendors: ['Apex Infra & BuildTech', 'Shiva Buildcon Pvt Ltd', 'Purvanchal Infratech'],
                    totalClusterProjects: 17,
                    totalDisbursedCr: 8.4,
                  })}
                  className={`px-3.5 py-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold transition-all shadow-gov-sm ${
                    selectedNode?.id === 'DIR-01'
                      ? 'bg-pink-50 border-pink-600 text-pink-900 ring-2 ring-pink-200 scale-105'
                      : 'bg-white border-pink-300 text-pink-800 hover:border-pink-500'
                  }`}
                >
                  <User className="w-4 h-4 text-pink-600" />
                  <span>R. K. Agarwal (Common Director)</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-pink-100 text-pink-800 font-mono">95% COLLUSION</span>
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
                    details: 'Primary recipient of Varanasi & Jaunpur tenders. Repeatedly uploads duplicate photos and shares ROC corporate registration with L2 bidders.',
                    districts: ['Varanasi', 'Jaunpur', 'Kamrup Metro'],
                    projects: 8,
                    avgRiskScore: 86,
                    alerts: 4,
                  })}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-gov-sm ${
                    selectedNode?.id === 'V-01'
                      ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400'
                  }`}
                >
                  <Building className="w-4 h-4 text-rose-600" />
                  <span className="font-bold">Apex Infra & BuildTech</span>
                  <span className="text-[10px] text-rose-700 font-mono font-semibold">8 Works • 89% Risk</span>
                </button>

                {/* Vendor 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedNode({
                    id: 'V-02',
                    name: 'Shiva Buildcon Pvt Ltd',
                    type: 'vendor',
                    risk: 84,
                    title: 'L2 Cover Bidder',
                    details: 'Submitted bids priced exactly 4% higher than Apex Infra across 6 consecutive Varanasi tenders (classic cover bidding pattern).',
                    districts: ['Varanasi', 'Mirzapur'],
                    projects: 5,
                    avgRiskScore: 82,
                    alerts: 3,
                  })}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-gov-sm ${
                    selectedNode?.id === 'V-02'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-amber-400'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">Shiva Buildcon</span>
                  <span className="text-[10px] text-amber-800 font-mono font-semibold">5 Works • 84% Risk</span>
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
                    details: 'Identical registered IP address and GST portal session tokens as Apex Infra during e-tender submission.',
                    districts: ['Varanasi', 'Ghazipur'],
                    projects: 4,
                    avgRiskScore: 78,
                    alerts: 2,
                  })}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-gov-sm ${
                    selectedNode?.id === 'V-03'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-amber-400'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">Purvanchal Infratech</span>
                  <span className="text-[10px] text-amber-800 font-mono font-semibold">4 Works • 79% Risk</span>
                </button>
              </div>

              {/* Bottom Layer: Linked Projects */}
              <div className="flex justify-around items-center">
                {/* Project 1 */}
                <button
                  type="button"
                  onClick={() => navigate('/project/MPLAD-2026-00124')}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 border-2 border-blue-600 text-blue-900 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-all shadow-gov-sm"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-700" />
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
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-all shadow-gov-sm"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>MPLAD-00892 (Jaunpur 2024)</span>
                </button>

                {/* Project 3 */}
                <button
                  type="button"
                  onClick={() => navigate('/project/MPLAD-2026-00518')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-all shadow-gov-sm"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
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
              className="space-y-4 shadow-gov-card"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Network Entity Role:</span>
                <span className="text-xs font-bold uppercase font-mono text-blue-700">
                  {selectedNode.type}
                </span>
              </div>

              {/* Economic Monopoly HHI Metric */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                  <Scale className="w-3.5 h-3.5 text-rose-700" />
                  <span>HHI Monopoly Score:</span>
                </div>
                <span className="text-sm font-black font-mono text-rose-700">
                  4,820 (Severe)
                </span>
              </div>

              {selectedNode.risk && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Collusion Threat Index:</span>
                  <span className="text-sm font-black font-mono text-rose-700">
                    {selectedNode.risk} / 100
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedNode.details}
              </p>

              {selectedNode.districts && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monopolized Districts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.districts.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.connectedVendors && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">Common Signatory Entities:</span>
                  <div className="space-y-1">
                    {selectedNode.connectedVendors.map((v, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 text-xs text-slate-800 border border-slate-200 flex items-center justify-between">
                        <span className="font-medium">{v}</span>
                        <span className="text-[10px] text-pink-700 font-mono font-bold">Shared ROC</span>
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
                  className="w-full text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-gov-sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Investigate Primary Flagged Work (MPLAD-00124)
                </Button>
              )}
            </Card>
          ) : (
            <Card className="text-center p-8">
              <Network className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Click any entity node on the graph to inspect cartel connections.</p>
            </Card>
          )}

          {/* Institutional Statutory Guidance Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-900 shadow-gov-sm">
            <span className="font-bold flex items-center gap-1.5 text-blue-900">
              <Info className="w-4 h-4 text-blue-700" /> Statutory Audit Impact:
            </span>
            <p className="text-slate-700 leading-relaxed">
              Bipartite graph projections detect ring rotations where the same syndicate submits artificial L2/L3 cover bids to manipulate competitive bidding thresholds required under Central Vigilance Commission (CVC) guidelines.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
