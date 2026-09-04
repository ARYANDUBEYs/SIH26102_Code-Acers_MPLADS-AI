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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/public" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                MPLADS <span className="text-blue-600">Public Map</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Interactive Geospatial Project Locator (English)</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            <Link to="/" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-md font-semibold transition">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Back to Home</span>
            </Link>
            <Link to="/public" className="hover:text-blue-600">Public Portal</Link>
            <Link to="/public/map" className="text-blue-600 font-bold">Interactive Map</Link>
            <Link to="/public/search" className="hover:text-blue-600">Search Projects</Link>
            <Link to="/public/report" className="text-rose-600 font-semibold hover:text-rose-700">Report Grievance</Link>
          </nav>

          <Link to="/public/report">
            <Button variant="danger" size="sm" icon={Camera}>
              Report Issue
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Public Project Map (English India Map)</h2>
            <p className="text-xs text-slate-500">Explore active and completed MPLADS works in your area with English location labels</p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal Verified
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Continuous Monitoring
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Attention Required
            </span>
          </div>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md h-[600px] relative">
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
                  radius={9}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: '#ffffff',
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-2 text-xs font-sans max-w-xs">
                      <div>
                        <span className="font-mono font-bold text-[10px] text-blue-600">{p.id}</span>
                        <h4 className="font-bold text-slate-900 leading-tight">{p.name}</h4>
                        <p className="text-slate-500 text-[11px]">{p.district}, {p.state}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Sanctioned:</span>
                          <span className="font-bold font-mono">{formatINR(p.sanctionedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">AI Risk Score:</span>
                          <span className="font-bold font-mono text-rose-600">{p.riskScore}/100</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Project Audit
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
