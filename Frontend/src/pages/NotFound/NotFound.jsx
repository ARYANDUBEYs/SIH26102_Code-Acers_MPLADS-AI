import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gov-darkest text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <h1 className="text-4xl font-black font-mono text-slate-100">404</h1>
      <h2 className="text-lg font-bold text-slate-200 mt-2">Record or Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
        The requested MPLADS project dossier, audit view, or route does not exist or has been archived.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="sm" icon={ArrowLeft} className="rounded-md">
            Return to Command Center
          </Button>
        </Link>
        <Link to="/public">
          <Button variant="outline" size="sm" className="rounded-md border-slate-700 text-slate-300 hover:text-white">
            Public Transparency Portal
          </Button>
        </Link>
      </div>
    </div>
  );
};
