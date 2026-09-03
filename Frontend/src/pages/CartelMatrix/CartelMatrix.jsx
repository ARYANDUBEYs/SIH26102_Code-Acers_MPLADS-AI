import React, { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { Dropdown } from '../../components/ui/Dropdown';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import {
  Network,
  Building,
  FolderGit2,
  ShieldAlert,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartelMatrix = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const list = await api.getAvailableDistricts();
      setDistricts(list);
      if (list.length > 0) setSelectedDistrict(list[0]);
    })();
  }, []);

  useEffect(() => {
    if (selectedDistrict) loadNetwork(selectedDistrict);
  }, [selectedDistrict]);

  const loadNetwork = async (district) => {
    setIsLoading(true);
    setSelectedNode(null);
    try {
      const res = await api.getCartelNetwork(district);
      if (res.success) {
        setNetworkData(res.data);
        setSelectedNode(res.data.nodes?.[0] || null);
      } else {
        setNetworkData(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const vendors = useMemo(() => networkData?.nodes.filter(n => n.type === 'vendor') || [], [networkData]);
  const projects = useMemo(() => networkData?.nodes.filter(n => n.type === 'project') || [], [networkData]);
  const edges = networkData?.edges || [];

  // Simple two-column bipartite layout: vendors evenly spaced on the left,
  // projects evenly spaced on the right, connected by real award edges.
  const vendorPos = (i) => ({ x: 18, y: 15 + (i * (70 / Math.max(vendors.length - 1, 1))) });
  const projectPos = (i) => ({ x: 82, y: 15 + (i * (70 / Math.max(projects.length - 1, 1))) });

  const nodePositions = useMemo(() => {
    const positions = {};
    vendors.forEach((v, i) => { positions[v.id] = vendorPos(i); });
    projects.forEach((p, i) => { positions[p.id] = projectPos(i); });
    return positions;
  }, [vendors, projects]);

  const getNodeIcon = (type) => (type === 'project' ? FolderGit2 : Building);

  return (
    <PageLayout
      title="Vendor Cartel & Bipartite Collusion Matrix"
      subtitle="Live NetworkX bipartite graph of contractor-project awards for the selected district — flags vendors controlling an outsized share of district funds."
      breadcrumbs={['Dashboard', 'Cartel Matrix']}
      badge={
        networkData?.monopoly_vendors?.length > 0 ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {networkData.monopoly_vendors.length} MONOPOLY ALERT{networkData.monopoly_vendors.length > 1 ? 'S' : ''}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            NO MONOPOLY DETECTED
          </span>
        )
      }
      actions={
        districts.length > 0 && (
          <Dropdown
            options={districts.map(d => ({ label: d, value: d }))}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
          />
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Network Graph Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-gov-card relative flex flex-col min-h-[520px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-bold text-slate-900">
                {selectedDistrict ? `${selectedDistrict} District Tender Network` : 'Select a district'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Monopoly Vendor</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Vendor</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Project</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading live graph…</div>
          ) : !networkData || networkData.nodes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No project data for this district yet.</div>
          ) : (
            <div className="flex-1 w-full relative min-h-[440px] bg-slate-50/70 rounded-xl overflow-hidden border border-slate-200">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {edges.map((e, i) => {
                  const from = nodePositions[e.source];
                  const to = nodePositions[e.target];
                  if (!from || !to) return null;
                  const isMonopolyEdge = networkData.monopoly_vendors?.some(m => m.vendor_id === e.source);
                  return (
                    <line
                      key={i}
                      x1={`${from.x}%`} y1={`${from.y}%`}
                      x2={`${to.x}%`} y2={`${to.y}%`}
                      stroke={isMonopolyEdge ? '#DC2626' : '#94A3B8'}
                      strokeWidth={isMonopolyEdge ? 0.4 : 0.25}
                      strokeDasharray={isMonopolyEdge ? '0' : '1.2 1'}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>

              {/* Vendor nodes (left column) */}
              {vendors.map((v, i) => {
                const pos = vendorPos(i);
                const isMonopoly = v.risk_level === 'CRITICAL';
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedNode(v)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 text-xs transition-all shadow-gov-sm max-w-[140px] ${
                      selectedNode?.id === v.id ? 'ring-2 ring-offset-1 scale-105' : ''
                    } ${isMonopoly ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-white border-blue-300 text-blue-900 hover:border-blue-500'}`}
                  >
                    <Building className={`w-4 h-4 ${isMonopoly ? 'text-rose-600' : 'text-blue-600'}`} />
                    <span className="font-bold text-center leading-tight line-clamp-2">{v.label}</span>
                    {v.total_amount != null && (
                      <span className="text-[10px] font-mono opacity-80">{formatINR(v.total_amount)}</span>
                    )}
                  </button>
                );
              })}

              {/* Project nodes (right column) */}
              {projects.map((p, i) => {
                const pos = projectPos(i);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedNode(p)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute px-3 py-2 rounded-xl border-2 flex items-center gap-1.5 text-xs font-medium max-w-[160px] transition-all shadow-gov-sm ${
                      selectedNode?.id === p.id ? 'ring-2 ring-offset-1 scale-105' : ''
                    } bg-white border-emerald-400 text-emerald-900 hover:border-emerald-600`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-left leading-tight line-clamp-2">{p.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Selected Entity Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <Card
              title={selectedNode.label}
              subtitle={`${selectedNode.type === 'vendor' ? 'Contractor' : 'Sanctioned Work'} Dossier`}
              icon={getNodeIcon(selectedNode.type)}
              riskAccent={selectedNode.risk_level === 'CRITICAL' ? 'critical' : 'default'}
              className="space-y-4 shadow-gov-card"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Entity Role:</span>
                <span className="text-xs font-bold uppercase font-mono text-blue-700">{selectedNode.type}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Contract Value:</span>
                <span className="text-sm font-black font-mono text-slate-800">{formatINR(selectedNode.total_amount)}</span>
              </div>

              {selectedNode.risk_level === 'CRITICAL' && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                    <Scale className="w-3.5 h-3.5 text-rose-700" />
                    <span>District Concentration:</span>
                  </div>
                  <span className="text-sm font-black font-mono text-rose-700">
                    {networkData.monopoly_vendors.find(m => m.vendor_id === selectedNode.id)?.district_tender_share_pct}%
                  </span>
                </div>
              )}

              {selectedNode.type === 'vendor' && (
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {networkData.monopoly_vendors.find(m => m.vendor_id === selectedNode.id)?.alert
                    || 'No monopoly concentration flagged for this vendor in this district.'}
                </p>
              )}

              {selectedNode.type === 'project' && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => navigate(`/project/${selectedNode.id}`)}
                  className="w-full text-xs bg-slate-800 hover:bg-slate-900 text-white shadow-gov-sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Open Project Dossier
                </Button>
              )}
            </Card>
          ) : (
            <Card className="text-center p-8">
              <Network className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Click any entity node on the graph to inspect it.</p>
            </Card>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-900 shadow-gov-sm">
            <span className="font-bold flex items-center gap-1.5 text-blue-900">
              <Info className="w-4 h-4 text-blue-700" /> How this is calculated:
            </span>
            <p className="text-slate-700 leading-relaxed">
              Every project-vendor award in {selectedDistrict || 'the selected district'} becomes a graph edge. A vendor is flagged when its share of total district funds crosses the configured monopoly threshold (default 35%) — see <code className="font-mono">VENDOR_MONOPOLY_CONCENTRATION_LIMIT</code> in the backend's <code className="font-mono">config.py</code>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
