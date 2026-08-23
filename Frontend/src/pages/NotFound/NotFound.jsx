import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gov-darkest text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold font-mono text-slate-100">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Classified File Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
        The requested MPLADS record, route or intelligence view does not exist or has been archived.
      </p>

      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>
          Return to Command Center
        </Button>
      </Link>
    </div>
  );
};
