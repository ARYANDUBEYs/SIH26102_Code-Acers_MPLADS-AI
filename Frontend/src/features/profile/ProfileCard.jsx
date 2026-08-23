import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Mail, MapPin, Building, KeyRound, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileCard = () => {
  const { user, role } = useAuth();

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      {/* Background Banner */}
      <div className="h-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative -m-5 mb-0 p-4 flex items-end justify-end">
        <span className="text-[10px] font-mono text-blue-300 bg-slate-950/60 px-2 py-0.5 rounded border border-blue-500/30">
          Gov Clearance: LEVEL-4
        </span>
      </div>

      <div className="relative pt-3 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-xl"
        />

        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-100">{user?.name}</h3>
            <Badge variant="primary" dot>{user?.badge}</Badge>
          </div>
          <p className="text-xs text-blue-400 font-medium">{user?.designation}</p>
          <p className="text-xs text-slate-400">{user?.department}</p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" /> Official Email:
          </span>
          <span className="font-mono text-slate-200">{user?.email}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Digital Signature Token:
          </span>
          <span className="font-mono text-emerald-400">DSC-VALID-2026-OK</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" /> 2FA Multi-Factor Auth:
          </span>
          <span className="font-mono text-amber-400">ENABLED (Gov SSO)</span>
        </div>
      </div>
    </Card>
  );
};
