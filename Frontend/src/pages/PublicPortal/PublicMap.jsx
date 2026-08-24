import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, MapPin, CheckCircle2, ArrowRight, Eye, Camera } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';

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
    if (risk >= 80) return '#EF4444'; // Red = Attention Required
    if (risk >= 50) return '#EAB308'; // Yellow = Monitoring
    return '#22C55E'; // Green = Normal
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 flex flex-col">
      {/* Tiranga Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Public Header */}
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
              <p className="text-[10px] text-slate-500 font-medium">Interactive Geospatial Project Locator</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/public" className="hover:text-blue-600">Home</Link>
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

      {/* Map Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Public Project Map</h2>
            <p className="text-xs text-slate-500">Explore active and completed MPLADS works in your area</p>
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

        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md min-h-[550px] relative">
          <MapContainer
            center={[25.3176, 82.9739]} // Centered on Varanasi/UP
            zoom={6}
            className="w-full h-full min-h-[550px]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {projects.map((p) => {
              const coords = p.coordinates || [25.3176, 82.9739];
              const color = getPinColor(p.status, p.riskScore);

              return (
                <CircleMarker
                  key={p.id}
                  center={coords}
                  radius={12}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-2 text-slate-900 min-w-[220px]">
                      <div className="border-b border-slate-200 pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">{p.id}</span>
                        <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                        <p className="text-[11px] text-slate-500">{p.location}, {p.district}</p>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Sanction:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(p.sanctionedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Physical Progress:</span>
                          <span className="font-mono font-bold text-blue-600">{p.progressPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Public Status:</span>
                          <span className="font-semibold text-emerald-600">AI Monitored</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="w-full mt-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 shadow"
                      >
                        <span>View Project</span>
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
    </div>
  );
};
