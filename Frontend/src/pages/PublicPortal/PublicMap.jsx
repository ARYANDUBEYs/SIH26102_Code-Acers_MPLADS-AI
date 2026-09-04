import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, MapPin, CheckCircle2, ArrowRight, Eye, Camera, Layers, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export const PublicMap = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await api.getProjects();
    if (res.success) {
      setProjects(res.data);
    }
  };

  const getPinColor = (status, risk) => {
    if (risk >= 80) return '#EF4444';
    if (risk >= 50) return '#EAB308';
    return '#22C55E';
  };

  return (
    <div className="min-h-screen bg-gov-canvas text-gov-slateDark selection:bg-gov-navy selection:text-white flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <header className="sticky top-0 z-40 bg-gov-surface border-b border-gov-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/public" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gov-navy text-white flex items-center justify-center font-bold text-sm shadow-xs border border-gov-navyLight">
              MP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-gov-navy">
                  MPLADS <span className="text-gov-saffron font-bold">PUBLIC MAP</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gov-canvas text-gov-muted border border-gov-border px-1.5 py-0.5 rounded">
                  MoSPI GIS
                </span>
              </div>
              <p className="text-[10px] text-gov-muted font-medium">Interactive Geospatial Project Locator • All India</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-gov-muted">
            <Link to="/" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-gov-slateDark hover:text-gov-navy bg-gov-canvas hover:bg-slate-100 border border-gov-border rounded-md transition">
              <Home className="w-3.5 h-3.5 text-gov-navy" />
              <span>Back to Overview</span>
            </Link>
            <Link to="/public" className="hover:text-gov-navy transition">Citizen Home</Link>
            <Link to="/public/map" className="text-gov-navy font-bold border-b-2 border-gov-navy pb-0.5">Constituency Map</Link>
            <Link to="/public/search" className="hover:text-gov-navy transition">Search Works</Link>
          </nav>

          <Link to="/public/report">
            <Button variant="danger" size="sm" icon={Camera} className="rounded-md shadow-xs font-semibold text-xs">
              Report Issue
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gov-surface p-3.5 rounded-md border border-gov-border shadow-xs">
          <div>
            <h2 className="text-base font-bold text-gov-navy">Geospatial Project Surveillance & Mapping</h2>
            <p className="text-xs text-gov-muted">Visual distribution of sanctioned works across parliamentary constituencies</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gov-slateDark">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" /> Normal Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" /> Under Surveillance
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" /> Discrepancy Flagged
            </span>
          </div>
        </div>

        <div className="w-full bg-gov-surface border border-gov-border rounded-md overflow-hidden shadow-xs h-[620px] relative">
          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <MapResizer />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {projects.map((p) => {
              const coords = p.coordinates || [25.3176, 82.9739];
              const color = getPinColor(p.status, p.riskScore);

              return (
                <CircleMarker
                  key={p.id}
                  center={coords}
                  radius={8}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.9,
                    color: '#ffffff',
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-2 text-xs font-sans max-w-xs">
                      <div>
                        <div className="flex items-center justify-between pb-1 border-b border-gov-border">
                          <span className="font-mono font-bold text-[10px] text-gov-navy">{p.id}</span>
                          <span className="text-[10px] font-bold text-slate-500">{p.currentStage}</span>
                        </div>
                        <h4 className="font-bold text-gov-navy leading-tight mt-1.5">{p.name}</h4>
                        <p className="text-gov-muted text-[11px] mt-0.5">{p.district}, {p.state}</p>
                      </div>
                      <div className="p-2 bg-gov-canvas rounded border border-gov-border space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gov-muted text-[11px]">Sanctioned:</span>
                          <span className="font-bold font-mono text-gov-navy">{formatINR(p.sanctionedAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gov-muted text-[11px]">Disbursed:</span>
                          <span className="font-bold font-mono text-emerald-700">{formatINR(p.utilizedAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-gov-border">
                          <span className="text-gov-muted text-[11px]">Surveillance Index:</span>
                          <span className="font-bold font-mono text-rose-700">{p.riskScore}/100</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="w-full py-1.5 bg-gov-navy hover:bg-gov-navyLight text-white rounded font-semibold text-[11px] flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" /> Inspect Project Dossier
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <footer className="bg-gov-surface border-t border-gov-border py-4 px-4 text-center text-xs text-gov-muted">
        Ministry of Statistics & Programme Implementation (MoSPI) • Government of India
      </footer>
    </div>
  );
};
