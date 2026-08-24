import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, ShieldAlert, AlertTriangle, Filter, ArrowRight, Eye, Layers } from 'lucide-react';
import { getRiskMeta } from '../../utils/helpers';

// Helper component to recenter map
const RecenterAutomatically = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};

export const RiskMap = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]); // Center of India
  const [zoomLevel, setZoomLevel] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    const res = await api.getStateRiskData();
    if (res.success) {
      setStates(res.data);
      setSelectedState(res.data[0]); // Default to UP
    }
  };

  const filteredStates = states.filter((st) => {
    if (riskFilter === 'ALL') return true;
    return st.riskLevel === riskFilter;
  });

  const getMarkerColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#EF4444';
      case 'HIGH': return '#F97316';
      case 'MEDIUM': return '#EAB308';
      default: return '#22C55E';
    }
  };

  const handleSelectState = (st) => {
    setSelectedState(st);
    if (st.center) {
      setMapCenter(st.center);
      setZoomLevel(6);
    }
  };

  return (
    <PageLayout
      title="National Risk Map"
      subtitle="AI-generated geospatial threat distribution and anomaly density across Indian states & districts."
      breadcrumbs={['Dashboard', 'National Risk Map']}
      actions={
        <div className="flex items-center gap-2">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                riskFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All States
            </button>
            <button
              onClick={() => setRiskFilter('CRITICAL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                riskFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setRiskFilter('HIGH')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                riskFilter === 'HIGH' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setRiskFilter('LOW')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Leaflet Map Container */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-card-dark relative flex flex-col min-h-[550px] lg:min-h-[650px]">
          {/* Map Legend Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              Risk Level Index
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-slate-300 font-medium">Critical Threat (&gt;85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-slate-300 font-medium">High Risk (61-85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-slate-300 font-medium">Medium Watch (31-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-medium">Low / Normal (0-30%)</span>
            </div>
          </div>

          <div className="flex-1 w-full h-full min-h-[550px]">
            <MapContainer
              center={mapCenter}
              zoom={zoomLevel}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[550px] bg-slate-950"
            >
              <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} zoom={zoomLevel} />
              
              {/* Dark CartoDB Map Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a> Dark Matter'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {filteredStates.map((st) => {
                const color = getMarkerColor(st.riskLevel);
                return (
                  <CircleMarker
                    key={st.code}
                    center={st.center}
                    radius={st.highRisk * 1.8 + 10}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.5,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => handleSelectState(st),
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 text-slate-100 min-w-[200px]">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                          <h4 className="font-bold text-sm text-white">{st.state}</h4>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                            style={{ backgroundColor: `${color}30`, color: color }}
                          >
                            {st.riskLevel}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Projects:</span>
                            <span className="font-mono font-bold text-white">{st.totalProjects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Anomalies Detected:</span>
                            <span className="font-mono font-bold text-amber-400">{st.anomalies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">High Risk Queue:</span>
                            <span className="font-mono font-bold text-rose-400">{st.highRisk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Fraud Propensity:</span>
                            <span className="font-mono font-bold text-white">{st.fraudRiskPct}%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/high-risk')}
                          className="w-full mt-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 shadow"
                        >
                          <span>Inspect Region</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right Sidebar: Selected State / District Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedState ? (
            <Card
              title={selectedState.state}
              subtitle="Regional Risk Profile & Threat Density"
              icon={MapPin}
              riskAccent={selectedState.riskLevel.toLowerCase()}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Overall State Risk:</span>
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-bold"
                  style={{
                    backgroundColor: `${getMarkerColor(selectedState.riskLevel)}20`,
                    color: getMarkerColor(selectedState.riskLevel),
                  }}
                >
                  {selectedState.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xl font-bold font-mono text-slate-100">{selectedState.totalProjects}</span>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold mt-0.5">Projects Tracked</p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xl font-bold font-mono text-amber-400">{selectedState.anomalies}</span>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold mt-0.5">Anomalies</p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xl font-bold font-mono text-rose-400">{selectedState.highRisk}</span>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold mt-0.5">High Risk Triage</p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xl font-bold font-mono text-cyan-400">{selectedState.delayed}</span>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold mt-0.5">Delayed SLAs</p>
                </div>
              </div>

              {/* Notable Flagged Case in this state */}
              {selectedState.code === 'UP' && (
                <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Top Anomaly: Varanasi Road</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    MPLAD-2026-00124 flagged for 96% duplicate image forensic match with Jaunpur.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate('/project/MPLAD-2026-00124')}
                    className="w-full text-xs"
                  >
                    Open Investigation (87% Risk)
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/high-risk')}
                className="w-full"
                icon={ArrowRight}
                iconPosition="right"
              >
                Filter Projects for {selectedState.state}
              </Button>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Click on any marker on the map to inspect regional data.</p>
            </Card>
          )}

          {/* Regional Quick Selector */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-mono">
              Monitored States ({filteredStates.length})
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {filteredStates.map((st) => (
                <button
                  key={st.code}
                  onClick={() => handleSelectState(st)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                    selectedState?.code === st.code
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{st.state}</span>
                  <span
                    className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                    style={{ color: getMarkerColor(st.riskLevel) }}
                  >
                    {st.anomalies} anomalies
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
