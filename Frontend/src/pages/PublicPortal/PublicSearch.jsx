import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, MapPin, CheckCircle2, ArrowRight, Eye, Camera, Filter, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatINR } from '../../utils/helpers';

export const PublicSearch = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState('ALL');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [stateFilter]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProjects({
        state: stateFilter,
      });
      if (res.success) {
        setProjects(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.mpName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 flex flex-col">
      {/* Tiranga Accent Banner */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/public" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                MPLADS <span className="text-blue-600">Project Search</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Public Transparency Registry</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            <Link to="/" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-md font-semibold transition">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Back to Home</span>
            </Link>
            <Link to="/public" className="hover:text-blue-600">Public Portal</Link>
            <Link to="/public/map" className="hover:text-blue-600">Interactive Map</Link>
            <Link to="/public/search" className="text-blue-600 font-bold">Search Projects</Link>
          </nav>

          <Link to="/public/report">
            <Button variant="danger" size="sm" icon={Camera}>
              Report Issue
            </Button>
          </Link>
        </div>
      </header>

      {/* Search Header */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by constituency, district, ID, MP name..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Filter State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All States</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-semibold">
            Showing {filteredProjects.length} Development Works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{p.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.currentStage}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.location}, {p.district}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanctioned:</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(p.sanctionedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Utilized:</span>
                    <span className="font-mono font-bold text-emerald-600">{formatINR(p.utilizedAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-blue-600 font-semibold pt-2 border-t border-slate-100">
                  <span>View Full Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
