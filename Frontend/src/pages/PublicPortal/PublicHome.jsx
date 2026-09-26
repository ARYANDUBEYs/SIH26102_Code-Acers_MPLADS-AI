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
      <section className="bg-gov-surface py-16 px-6 sm:px-8 lg:px-12 border-b border-gov-border">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          <h1 className="text-3xl sm:text-5xl font-black text-gov-navy tracking-tight leading-tight">
            Know Where Public Funds Are Being Invested.
          </h1>

          <p className="text-xs sm:text-sm text-gov-muted max-w-2xl mx-auto leading-relaxed">
            Direct public access to Member of Parliament Local Area Development Scheme works. Track sanctioned expenditures, inspect verified milestone photography, and submit geotagged feedback directly to District Authorities.
          </p>

          {/* Citizen Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2.5 bg-gov-canvas rounded-xl border border-gov-border max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 shadow-xs"
          >
            <div className="flex-1 flex items-center px-4 gap-3 bg-gov-surface rounded-lg border border-gov-border">
              <Search className="w-4 h-4 text-gov-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Constituency, District, or Project ID (e.g. Varanasi)..."
                className="w-full py-2.5 text-xs sm:text-sm text-gov-slateDark placeholder-gov-muted bg-transparent focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="bg-gov-navy hover:bg-gov-navyLight text-white font-semibold rounded-lg shrink-0 px-5 py-2.5"
            >
              Search Registry
            </Button>
          </form>
        </div>
      </section>

      {/* Public Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gov-border">
          <div>
            <h2 className="text-lg font-bold text-gov-navy">Active & Completed Community Works</h2>
            <p className="text-xs text-gov-muted mt-0.5">Verified project milestones synchronized with Central PFMS financial records</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort by Risk / Amount selector */}
            <div className="flex items-center gap-2 bg-gov-surface border border-gov-border rounded-lg px-3 py-1.5">
              <span className="text-[11px] font-semibold text-gov-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gov-slateDark focus:outline-none cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="risk_high">Highest AI Risk First</option>
                <option value="risk_low">Lowest Risk (Verified)</option>
                <option value="amount">Highest Sanctioned Amount</option>
              </select>
            </div>

            <Link to="/public/map">
              <Button variant="outline" size="sm" icon={MapPin} className="border-gov-border text-gov-slateDark bg-gov-surface rounded-lg text-xs font-semibold hover:bg-slate-50 px-3.5 py-1.5">
                View on Map
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {sortedProjects.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group shadow-xs"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={p.images?.uploaded || "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80" || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"; }}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Circular Risk Indicator Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20 shadow-xs">
                    <span
                      className={`w-2 h-2 rounded-full ring-2 ${
                        p.riskScore >= 70
                          ? 'bg-rose-500 ring-rose-300 animate-pulse'
                          : p.riskScore >= 40
                          ? 'bg-amber-400 ring-amber-200'
                          : 'bg-emerald-600 ring-emerald-400/50'
                      }`}
                    />
                    <span>{p.riskScore}/100 Risk</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.district}, {p.state}</span>
                    </p>
                  </div>

                  {/* Fund Progress Details (BankLY Pattern 7) */}
                  <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Sanctioned Allocation:</span>
                      <span className="font-mono font-bold text-slate-900">{formatINR(p.sanctionedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Ground Disbursed:</span>
                      <span className="font-mono font-bold text-emerald-700">{formatINR(p.utilizedAmount)}</span>
                    </div>
                    {/* Progress bar (Pattern 7) */}
                    <div className="space-y-1 pt-1 border-t border-slate-200/60">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                        <span>Milestone Completion</span>
                        <span className="font-mono font-bold text-slate-900">{p.progressPercent || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.progressPercent || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end text-xs">
                <span className="font-semibold text-blue-700 group-hover:underline flex items-center gap-1 text-[11px]">
                  <span>View Project Audit</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Citizen Grievance Callout Footer Banner */}
      <section className="bg-gov-navyDark text-white py-14 px-6 sm:px-8 lg:px-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Notice Incomplete or Substandard Work in Your Area?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Citizen reports directly trigger automated AI forensic verification and alert the District Magistrate's Project Monitoring Cell for on-site inspection.
            </p>
          </div>
          <Link to="/public/report">
            <Button variant="warning" size="md" icon={Camera} className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shrink-0 rounded-lg text-xs px-5 py-2.5">
              Submit Grievance with Photo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gov-surface border-t border-gov-border py-6 px-6 text-center text-xs text-gov-muted">
        Ministry of Statistics & Programme Implementation (MoSPI) • Government of India • Central Scheme Guard Surveillance Platform
      </footer>
    </div>
  );
};
