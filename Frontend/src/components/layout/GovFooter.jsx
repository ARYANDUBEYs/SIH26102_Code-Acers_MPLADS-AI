import React from 'react';
import { ShieldCheck, Phone, Mail, ExternalLink, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GovFooter = () => {
  return (
    <footer className="w-full bg-[#07172B] text-slate-300 border-t border-slate-800">
      {/* Upper Information Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Government Masthead */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Scheme Guard 2.0</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Scheme Guard — Integrated High-Assurance AI Forensic Vigilance Layer under the Ministry of Statistics and Programme Implementation (MoSPI).
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded text-[10px] font-mono">
              Viksit Bharat @ 2047
            </span>
            <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 rounded text-[10px] font-mono">
              Smart India Hackathon 2026
            </span>
          </div>
        </div>

        {/* Col 2: Official Contact Information */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Official Contact & Helpdesk</h4>
          <div className="space-y-2 text-slate-400 text-[11px]">
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-slate-300">011-2345602 / 011-23455607</p>
                <p className="text-[10px] text-slate-500">Working Days: 09:30 AM - 05:30 PM IST</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <a href="mailto:cna-mplads@mospi.gov.in" className="text-blue-400 hover:underline">
                cna-mplads@mospi.gov.in
              </a>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Khursheed Lal Bhawan, Janpath, New Delhi - 110001
            </p>
          </div>
        </div>

        {/* Col 3: Statutory Guidelines & Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Statutory Resources</h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li>
              <a href="https://www.mplads.mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                <span>Revised MPLADS Guidelines (2023)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://www.mplads.mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                <span>TSA / Hybrid Fund Flow Protocol</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>
            <li>
              <Link to="/public" className="hover:text-blue-400">Citizen Transparency Portal</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400">Officer Secure Access</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Mobile Application Download */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">e-SAKSHI Mobile Access</h4>
          <p className="text-[11px] text-slate-400">
            Dedicated mobile application for Hon'ble MPs and District Authorities to recommend and inspect on-site progress.
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white text-xs">
                eS
              </div>
              <div className="text-[10px]">
                <p className="font-bold text-slate-200">Scheme Guard App</p>
                <p className="text-slate-500">Available on Google Play & App Store</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Sovereign Disclaimer */}
      <div className="border-t border-slate-800 bg-[#05101E] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="text-center md:text-left">
            © Content Owned by Ministry of Statistics and Programme Implementation, Government of India.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>NIC Standards Compliant</span>
            <span>•</span>
            <span>WCAG 2.1 AA Accessible</span>
            <span>•</span>
            <span className="text-slate-400">Built for SIH 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};