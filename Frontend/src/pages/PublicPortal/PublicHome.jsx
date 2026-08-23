import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Camera,
  ArrowRight,
  Sparkles,
  Eye,
  FileText
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';

export const PublicHome = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadPublicProjects();
  }, []);

  const loadPublicProjects = async () => {
    const res = await api.getProjects();
    if (res.success) {
      setProjects(res.data);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/public/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600">
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
                MPLADS <span className="text-blue-600">Citizen Transparency</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Public Fund Accountability Portal • MoSPI</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/public" className="text-blue-600 font-bold">Home</Link>
            <Link to="/public/map" className="hover:text-blue-600">Interactive Map</Link>
            <Link to="/public/search" className="hover:text-blue-600">Search Projects</Link>
            <Link to="/public/report" className="text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1">
              <span>Report Grievance</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/public/report">
              <Button variant="danger" size="sm" icon={Camera}>
                Report Issue
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/80 to-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Real-time Public Accountability</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Know Where Public Funds Are Being Used.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Search MPLADS development projects in your constituency, track fund utilization in real-time, view verified milestone photos, and report grievances directly to government authorities.
          </p>

          {/* Citizen Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-3 gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Constituency, District, or Project ID..."
                className="w-full py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Search Projects
            </Button>
          </form>
        </div>
      </section>

      {/* Public Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Local Development Works</h2>
            <p className="text-xs text-slate-500">Live fund transparency data synchronized with official PFMS records</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/public/map">
              <Button variant="outline" size="sm" icon={MapPin} className="border-slate-300 text-slate-700">
                View on Map
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={p.images?.uploaded || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    {p.id}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>AI Monitored</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.district}, {p.state}</span>
                    </p>
                  </div>

                  {/* Fund Progress Details */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanctioned:</span>
                      <span className="font-mono font-bold text-slate-800">{formatINR(p.sanctionedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Utilized on Ground:</span>
                      <span className="font-mono font-bold text-emerald-600">{formatINR(p.utilizedAmount)}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{p.currentStage}</span>
                <span className="font-semibold text-blue-600 group-hover:underline flex items-center gap-0.5">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Citizen Grievance Callout Footer Banner */}
      <section className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Notice Incomplete or Substandard Work?</h3>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Citizen reports directly trigger automated AI verification and alert the District Magistrate for physical site inspection.
            </p>
          </div>
          <Link to="/public/report">
            <Button variant="warning" size="lg" icon={Camera} className="bg-amber-400 text-slate-950 font-bold shrink-0">
              Submit Grievance with Photo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        Ministry of Statistics & Programme Implementation (MoSPI) • Government of India
      </footer>
    </div>
  );
};
