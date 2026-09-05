import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, MapPin, CheckCircle2, ArrowRight, Eye, Camera, Filter, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
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
      const res = await api.getProjects();
      if (res.success) {
        let filtered = res.data;
        if (stateFilter !== 'ALL') {
          filtered = filtered.filter(p => p.state === stateFilter);
        }
        setProjects(filtered);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // filtered in place
  };

  const filteredProjects = projects.filter(p => {
    const q = query.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q) ||
      p.district?.toLowerCase().includes(q) ||
      p.state?.toLowerCase().includes(q) ||
      p.mpName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gov-canvas text-gov-slateDark selection:bg-gov-navy selection:text-white flex flex-col">
      {/* Sovereign Unified Public Header */}
      <PublicHeader activeSubtitle="Constituency Database" />

      {/* Search Header */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        <div className="bg-gov-surface p-4 rounded-md border border-gov-border shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md flex items-center bg-gov-canvas border border-gov-border rounded px-3 py-1.5">
            <Search className="w-4 h-4 text-gov-muted mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by constituency, district, ID, MP name..."
              className="w-full bg-transparent text-xs sm:text-sm text-gov-slateDark placeholder-gov-muted focus:outline-none"
            />
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <span className="text-xs font-semibold text-gov-muted">Filter State Jurisdiction:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-gov-canvas border border-gov-border rounded px-3 py-1.5 text-xs font-medium text-gov-slateDark focus:outline-none"
            >
              <option value="ALL">All States / UTs</option>
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-gov-muted font-semibold">
              Showing <span className="font-mono font-bold text-gov-navy">{filteredProjects.length}</span> Verified Works
            </p>
            <span className="text-[11px] text-gov-muted font-mono">Central Data Sync: Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                className="bg-gov-surface rounded-md border border-gov-border hover:border-gov-navy hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-gov-border">
                    <span className="font-mono text-xs font-bold text-gov-navy">{p.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {p.currentStage}
                    </span>
                  </div>

                  <h3 className="font-bold text-gov-navy text-sm mt-3 line-clamp-1 group-hover:text-blue-700 transition-colors">{p.name}</h3>
                  <p className="text-xs text-gov-muted mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gov-muted shrink-0" />
                    <span>{p.location}, {p.district}</span>
                  </p>
                </div>

                <div className="p-3 bg-gov-canvas rounded border border-gov-border space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gov-muted text-[11px]">Sanctioned:</span>
                    <span className="font-mono font-bold text-gov-navy">{formatINR(p.sanctionedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gov-muted text-[11px]">Disbursed:</span>
                    <span className="font-mono font-bold text-emerald-700">{formatINR(p.utilizedAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gov-navy font-semibold pt-2 border-t border-gov-border group-hover:underline">
                  <span>View Full Audit File</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gov-surface border-t border-gov-border py-4 px-4 text-center text-xs text-gov-muted">
        Ministry of Statistics & Programme Implementation (MoSPI) • Government of India
      </footer>
    </div>
  );
};
