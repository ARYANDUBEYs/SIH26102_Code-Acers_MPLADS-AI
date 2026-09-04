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
      <div className="h-20 bg-gov-navy text-white relative -m-5 mb-0 p-4 flex items-end justify-between border-b border-gov-border">
        <span className="text-xs font-bold tracking-wider uppercase text-white/80">
          e-SAKSHI Officer Profile
        </span>
        <span className="text-[10px] font-mono text-gov-navy bg-white px-2 py-0.5 rounded font-bold">
          Gov Clearance: LEVEL-4
        </span>
      </div>

      <div className="relative pt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-16 h-16 rounded-md object-cover border-2 border-white shadow-sm ring-1 ring-gov-border"
        />

        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-gov-navy">{user?.name}</h3>
            <Badge variant="primary" dot>{user?.badge}</Badge>
          </div>
          <p className="text-xs text-blue-700 font-semibold">{user?.designation}</p>
          <p className="text-xs text-gov-muted">{user?.department}</p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gov-border space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
          <span className="text-gov-muted flex items-center gap-2">
            <Mail className="w-4 h-4 text-gov-navy" /> Official Email:
          </span>
          <span className="font-mono font-semibold text-gov-slateDark">{user?.email}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
          <span className="text-gov-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Signature Token:
          </span>
          <span className="font-mono font-semibold text-emerald-800">DSC-VALID-2026-OK</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded bg-gov-canvas border border-gov-border">
          <span className="text-gov-muted flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" /> Multi-Factor Auth (SSO):
          </span>
          <span className="font-mono font-semibold text-amber-800">ENABLED (MoSPI Gov SSO)</span>
        </div>
      </div>
    </Card>
  );
};
