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
  FileText,
  Home
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';

export const PublicHome = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const [stats, setStats] = useState({ total: 0, completed: 0, ongoing: 0, expenditure: 0 });
  const [activeTab, setActiveTab] = useState('FEATURED');
  const navigate = useNavigate();

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    const res = await api.getProjects();
    if (res.success && res.data) {
      setProjects(res.data);
      const total = res.data.length;
      const completed = res.data.filter(p => p.status === 'COMPLETED').length;
      const ongoing = res.data.filter(p => p.status === 'IN_PROGRESS').length;
      const expenditure = res.data.reduce((acc, curr) => acc + (curr.spentAmount || 0), 0);
      setStats({ total, completed, ongoing, expenditure });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/public/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const filteredProjects = projects.filter(p => {
    if (selectedState !== 'ALL' && p.state !== selectedState) return false;
    if (activeTab === 'COMPLETED' && p.status !== 'COMPLETED') return false;
    if (activeTab === 'ONGOING' && p.status !== 'IN_PROGRESS') return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'risk_high') return b.riskScore - a.riskScore;
    if (sortBy === 'risk_low') return a.riskScore - b.riskScore;
    if (sortBy === 'amount') return b.sanctionedAmount - a.sanctionedAmount;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gov-canvas text-gov-slateDark selection:bg-gov-navy selection:text-white">
      {/* Sovereign Unified Public Header */}
      <PublicHeader activeSubtitle="Public Fund Registry" />

      {/* Hero Section */}
      <section className="bg-gov-surface py-12 px-4 sm:px-6 lg:px-8 border-b border-gov-border">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-gov-navy text-xs font-semibold border border-gov-border">
            <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
            <span>Official Public Fund Transparency Registry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight leading-tight">
            Know Where Public Funds Are Being Invested.
          </h1>

          <p className="text-xs sm:text-sm text-gov-muted max-w-2xl mx-auto leading-relaxed">
            Direct public access to Member of Parliament Local Area Development Scheme works. Track sanctioned expenditures, inspect verified milestone photography, and submit geotagged feedback directly to District Authorities.
          </p>

          {/* Citizen Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-1.5 bg-gov-canvas rounded-md border border-gov-border max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-xs"
          >
            <div className="flex-1 flex items-center px-3 gap-2 bg-gov-surface rounded border border-gov-border">
              <Search className="w-4 h-4 text-gov-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Constituency, District, or Project ID (e.g. Varanasi)..."
                className="w-full py-2 text-xs sm:text-sm text-gov-slateDark placeholder-gov-muted bg-transparent focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="bg-gov-navy hover:bg-gov-navyLight text-white font-semibold rounded-md shrink-0"
            >
              Search Registry
            </Button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-gov-muted">
            <span className="font-semibold text-gov-slateDark">Quick Lookups:</span>
            {['Varanasi', 'Lucknow', 'Patna', 'Jaipur', 'Pune'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSearchQuery(city);
                  navigate(`/public/search?q=${encodeURIComponent(city)}`);
                }}
                className="px-2.5 py-0.5 rounded bg-gov-surface border border-gov-border hover:border-gov-navy hover:text-gov-navy transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Public Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gov-border">
          <div>
            <h2 className="text-lg font-bold text-gov-navy">Active & Completed Community Works</h2>
            <p className="text-xs text-gov-muted">Verified project milestones synchronized with Central PFMS financial records</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort by Risk / Amount selector */}
            <div className="flex items-center gap-2 bg-gov-surface border border-gov-border rounded-md px-2.5 py-1">
              <span className="text-[11px] font-semibold text-gov-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gov-slateDark focus:outline-none cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="risk_high">⚠️ Highest AI Risk First</option>
                <option value="risk_low">✅ Lowest Risk (Verified)</option>
                <option value="amount">💰 Highest Sanctioned Amount</option>
              </select>
            </div>

            <Link to="/public/map">
              <Button variant="outline" size="sm" icon={MapPin} className="border-gov-border text-gov-slateDark bg-gov-surface rounded-md text-xs font-semibold hover:bg-slate-50">
                View on Map
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedProjects.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="bg-gov-surface rounded-md border border-gov-border hover:border-gov-navy hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Photo Thumbnail with Dual Badges */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-gov-border">
                  <img
                    src={p.images?.uploaded || "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80" || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"; }}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-gov-navyDark/90 backdrop-blur-xs text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                    {p.id}
                  </div>

                  {/* Circular Risk Indicator Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20 shadow-xs">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ring-2 ${
                        p.riskScore >= 70
                          ? 'bg-rose-500 ring-rose-300 animate-pulse'
                          : p.riskScore >= 40
                          ? 'bg-amber-400 ring-amber-200'
                          : 'bg-emerald-400 ring-emerald-200'
                      }`}
                    />
                    <span>{p.riskScore}/100 Risk</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-gov-surface/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>AI Monitored</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-gov-navy text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gov-muted mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gov-muted shrink-0" />
                      <span>{p.district}, {p.state}</span>
                    </p>
                  </div>

                  {/* Fund Progress Details */}
                  <div className="p-3 bg-gov-canvas rounded border border-gov-border space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gov-muted text-[11px]">Sanctioned Allocation:</span>
                      <span className="font-mono font-bold text-gov-navy">{formatINR(p.sanctionedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gov-muted text-[11px]">Ground Disbursed:</span>
                      <span className="font-mono font-bold text-emerald-700">{formatINR(p.utilizedAmount)}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gov-navy h-full rounded-full"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-gov-canvas border-t border-gov-border flex items-center justify-between text-xs">
                <span className="text-gov-muted font-medium text-[11px]">{p.currentStage}</span>
                <span className="font-semibold text-gov-navy group-hover:underline flex items-center gap-1 text-[11px]">
                  <span>View Project Audit</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Citizen Grievance Callout Footer Banner */}
      <section className="bg-gov-navyDark text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold">Notice Incomplete or Substandard Work in Your Area?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Citizen reports directly trigger automated AI forensic verification and alert the District Magistrate's Project Monitoring Cell for on-site inspection.
            </p>
          </div>
          <Link to="/public/report">
            <Button variant="warning" size="md" icon={Camera} className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shrink-0 rounded-md text-xs">
              Submit Grievance with Photo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gov-surface border-t border-gov-border py-4 px-4 text-center text-xs text-gov-muted">
        Ministry of Statistics & Programme Implementation (MoSPI) • Government of India • Central Scheme Guard Surveillance Platform
      </footer>
    </div>
  );
};
