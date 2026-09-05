import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, ShieldAlert, AlertTriangle, Filter, ArrowRight, Eye, Layers, Compass } from 'lucide-react';
import { getRiskMeta } from '../../utils/helpers';

// Helper component to recenter map
const RecenterAutomatically = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
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
      case 'CRITICAL': return '#DC2626';
      case 'HIGH': return '#EA580C';
      case 'MEDIUM': return '#D97706';
      default: return '#16A34A';
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
      title="National Geospatial Surveillance Heatmap"
      subtitle="GIS surveillance layer visualizing spatial threat density, duplicate photo clusters, and contractor market concentration across Indian states & constituencies."
      breadcrumbs={['Dashboard', 'National Risk Map']}
      actions={
        <div className="flex items-center gap-2">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-gov-surface border border-gov-border rounded-md p-1 text-xs shadow-sm">
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                riskFilter === 'ALL' ? 'bg-gov-navy text-white' : 'text-gov-slate hover:text-gov-slateDark'
              }`}
            >
              All States
            </button>
            <button
              onClick={() => setRiskFilter('CRITICAL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                riskFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'text-gov-slate hover:text-rose-600'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setRiskFilter('HIGH')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                riskFilter === 'HIGH' ? 'bg-orange-600 text-white' : 'text-gov-slate hover:text-orange-600'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setRiskFilter('LOW')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'text-gov-slate hover:text-emerald-600'
              }`}
            >
              Normal
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Leaflet Map Container */}
        <div className="lg:col-span-8 bg-gov-surface border border-gov-border rounded-md overflow-hidden shadow-sm relative flex flex-col min-h-[550px] lg:min-h-[640px]">
          {/* Map Legend Overlay */}
          <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm border border-gov-border rounded-md p-3 shadow-md space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-navy block font-mono">
              Surveillance Threat Index
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-gov-slateDark font-semibold">Critical Threat (&gt;85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span className="text-gov-slate font-medium">High Risk (61-85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gov-slate font-medium">Watchlist (31-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-gov-slate font-medium">Normal Baseline (&le;30%)</span>
            </div>
          </div>

          <div className="flex-1 w-full h-full min-h-[550px]">
            <MapContainer
              center={mapCenter}
              zoom={zoomLevel}
              minZoom={4}
              maxZoom={12}
              maxBounds={[[5.0, 65.0], [38.5, 100.0]]}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[550px]"
            >
              <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} zoom={zoomLevel} />
              
              {/* OpenStreetMap Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                      <div className="p-1 space-y-2 min-w-[210px] text-gov-slateDark">
                        <div className="flex items-center justify-between border-b border-gov-border pb-1.5">
                          <h4 className="font-bold text-sm text-gov-navy">{st.state}</h4>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                            style={{ backgroundColor: `${color}15`, color: color }}
                          >
                            {st.riskLevel}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gov-muted">Monitored Works:</span>
                            <span className="font-mono font-bold text-gov-slateDark">{st.totalProjects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gov-muted">Anomalies Detected:</span>
                            <span className="font-mono font-bold text-amber-700">{st.anomalies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gov-muted">Critical Queue:</span>
                            <span className="font-mono font-bold text-rose-700">{st.highRisk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gov-muted">Fraud Propensity:</span>
                            <span className="font-mono font-bold text-gov-slateDark">{st.fraudRiskPct}%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/high-risk')}
                          className="w-full mt-2 py-1.5 px-3 bg-gov-navy hover:bg-gov-navyDark text-white rounded text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors"
                        >
                          <span>Open State Queue</span>
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

        {/* Right Sidebar: Selected State Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedState ? (
            <Card
              title={selectedState.state}
              subtitle="Jurisdictional Risk Profile & Threat Density"
              icon={MapPin}
              riskAccent={selectedState.riskLevel.toLowerCase()}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3 rounded bg-gov-canvas border border-gov-border">
                <span className="text-xs text-gov-muted font-medium">Jurisdiction Severity:</span>
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-bold"
                  style={{
                    backgroundColor: `${getMarkerColor(selectedState.riskLevel)}15`,
                    color: getMarkerColor(selectedState.riskLevel),
                  }}
                >
                  {selectedState.riskLevel} TIER
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-gov-canvas border border-gov-border rounded">
                  <span className="text-xl font-bold font-mono text-gov-slateDark">{selectedState.totalProjects}</span>
                  <p className="text-[10px] uppercase text-gov-muted font-bold mt-0.5">Tracked Works</p>
                </div>
                <div className="p-3 bg-gov-canvas border border-gov-border rounded">
                  <span className="text-xl font-bold font-mono text-amber-700">{selectedState.anomalies}</span>
                  <p className="text-[10px] uppercase text-gov-muted font-bold mt-0.5">Anomalies</p>
                </div>
                <div className="p-3 bg-gov-canvas border border-gov-border rounded">
                  <span className="text-xl font-bold font-mono text-rose-700">{selectedState.highRisk}</span>
                  <p className="text-[10px] uppercase text-gov-muted font-bold mt-0.5">Critical Flags</p>
                </div>
                <div className="p-3 bg-gov-canvas border border-gov-border rounded">
                  <span className="text-xl font-bold font-mono text-blue-700">{selectedState.delayed}</span>
                  <p className="text-[10px] uppercase text-gov-muted font-bold mt-0.5">SLA Breaches</p>
                </div>
              </div>

              {/* Notable Flagged Case in this state */}
              {selectedState.code === 'UP' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded space-y-2 border-l-4 border-l-rose-600">
                  <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Active Priority Flag: Varanasi Rural Road</span>
                  </div>
                  <p className="text-xs text-gov-slate leading-relaxed">
                    MPLAD-2026-00124 flagged for 96% duplicate image forensic match with Jaunpur completion claim.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate('/project/MPLAD-2026-00124')}
                    className="w-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Open Investigation Dossier (87% Risk)
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/high-risk')}
                className="w-full text-xs font-bold text-gov-slateDark border-gov-border hover:bg-gov-subtle"
                icon={ArrowRight}
                iconPosition="right"
              >
                Inspect All Flagged Works in {selectedState.state}
              </Button>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <MapPin className="w-8 h-8 text-gov-muted mx-auto mb-2" />
              <p className="text-xs text-gov-muted">Click any state cluster on the map to inspect regional data.</p>
            </Card>
          )}

          {/* Regional Quick Selector */}
          <div className="p-3.5 bg-gov-surface border border-gov-border rounded-md space-y-2 shadow-sm">
            <span className="text-xs font-bold text-gov-navy uppercase tracking-wider block font-mono">
              Monitored Jurisdictions ({filteredStates.length})
            </span>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {filteredStates.map((st) => (
                <button
                  key={st.code}
                  onClick={() => handleSelectState(st)}
                  className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors text-left border ${
                    selectedState?.code === st.code
                      ? 'bg-gov-subtle text-gov-navy border-gov-border font-bold'
                      : 'text-gov-slate border-transparent hover:bg-gov-canvas'
                  }`}
                >
                  <span className="truncate">{st.state}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ml-2"
                    style={{
                      backgroundColor: `${getMarkerColor(st.riskLevel)}15`,
                      color: getMarkerColor(st.riskLevel)
                    }}
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
