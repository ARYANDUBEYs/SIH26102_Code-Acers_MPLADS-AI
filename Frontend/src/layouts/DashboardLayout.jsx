import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { SearchBar } from '../components/ui/SearchBar';
import { api } from '../services/api';
import { FolderGit2, MapPin, Building, AlertOctagon, ArrowRight, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../utils/helpers';

export const DashboardLayout = () => {
  const { isSearchOpen, setIsSearchOpen, toast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ projects: [], districts: [], vendors: [], alerts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ projects: [], districts: [], vendors: [], alerts: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await api.getProjects({ search: searchQuery });
      const q = searchQuery.toLowerCase();
      
      const matchedProjects = res.data || [];
      const matchedDistricts = [
        { name: 'Varanasi', state: 'Uttar Pradesh', anomalies: 41, highRisk: 12 },
        { name: 'Jaunpur', state: 'Uttar Pradesh', anomalies: 19, highRisk: 4 },
        { name: 'Banswara', state: 'Rajasthan', anomalies: 27, highRisk: 8 },
        { name: 'Patna', state: 'Bihar', anomalies: 34, highRisk: 9 },
      ].filter(d => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));

      const matchedVendors = [
        { name: 'Apex Infra & BuildTech Pvt Ltd', projects: 8, risk: 89 },
        { name: 'Shiva Buildcon Pvt Ltd', projects: 5, risk: 84 },
        { name: 'Vanguard Civilcon LLP', projects: 3, risk: 78 },
      ].filter(v => v.name.toLowerCase().includes(q));

      setSearchResults({
        projects: matchedProjects.slice(0, 4),
        districts: matchedDistricts.slice(0, 2),
        vendors: matchedVendors.slice(0, 2),
      });
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (path) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gov-canvas text-gov-slateDark flex flex-col selection:bg-gov-blue selection:text-white">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1920px] mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-16">
          <Outlet />
        </main>
      </div>

      <Footer />

      {/* Global Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        size="lg"
        showClose={true}
      >
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Type Project ID, District, Contractor, or Risk..."
            showShortcut={false}
          />

          {/* Categorized Results */}
          <div className="max-h-96 overflow-y-auto space-y-4 pt-2">
            {!searchQuery.trim() ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Type at least 2 characters to search across National MPLADS intelligence databases.
              </div>
            ) : (
              <>
                {/* Projects Section */}
                {searchResults.projects.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5" /> Matched Projects ({searchResults.projects.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectResult(`/project/${p.id}`)}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors text-left group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-200">{p.id}</span>
                              <span className="text-xs text-slate-300 truncate">{p.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{p.district}, {p.state} • {p.contractor}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn('text-xs font-mono font-bold', p.riskScore >= 80 ? 'text-rose-400' : 'text-emerald-400')}>
                              {p.riskScore}% Risk
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendors Section */}
                {searchResults.vendors.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> Contractors / Vendors ({searchResults.vendors.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.vendors.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectResult('/cartel-matrix')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors text-left group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-200">{v.name}</p>
                            <p className="text-[11px] text-slate-500">{v.projects} Monitored Projects • Collusion Cluster Flagged</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400">{v.risk}% Risk</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Districts Section */}
                {searchResults.districts.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Monitored Districts
                    </span>
                    <div className="space-y-1">
                      {searchResults.districts.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectResult('/risk-map')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors text-left group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-200">{d.name}, {d.state}</p>
                            <p className="text-[11px] text-slate-500">{d.anomalies} Anomalies Detected • {d.highRisk} High-Risk Triage</p>
                          </div>
                          <span className="text-xs text-blue-400 group-hover:underline">View on Map →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* Global Toast Message */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl animate-bounce">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          ) : (
            <Info className="w-5 h-5 text-blue-400" />
          )}
          <span className="text-xs font-semibold text-slate-100">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
