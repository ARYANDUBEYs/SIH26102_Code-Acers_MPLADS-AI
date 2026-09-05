import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, UserCheck, Sparkles, Building, MapPin, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { ROLES, DEMO_USERS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export const LoginForm = ({ onSuccess, initialRole = ROLES.MOSPI_ADMIN }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('admin.mospi@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleTabChange = (roleKey) => {
    setSelectedRole(roleKey);
    const demoUser = DEMO_USERS.find(u => u.role === roleKey);
    if (demoUser) {
      setEmail(demoUser.email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      if (onSuccess) onSuccess();
      if (selectedRole === ROLES.CITIZEN) {
        navigate('/public');
      } else if (selectedRole === ROLES.DISTRICT_OFFICER) {
        navigate('/district');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100">National Officer Login</h3>
        <p className="text-[11px] text-slate-400">Access the AI-Powered MPLADS monitoring & anomaly command platform</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => handleRoleTabChange(ROLES.MOSPI_ADMIN)}
          className={cn(
            'flex flex-col items-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all gap-0.5',
            selectedRole === ROLES.MOSPI_ADMIN
              ? 'bg-blue-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <Building className="w-3.5 h-3.5" />
          <span className="truncate">MoSPI Admin</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleTabChange(ROLES.DISTRICT_OFFICER)}
          className={cn(
            'flex flex-col items-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all gap-0.5',
            selectedRole === ROLES.DISTRICT_OFFICER
              ? 'bg-blue-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">District Officer</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleTabChange(ROLES.CITIZEN)}
          className={cn(
            'flex flex-col items-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all gap-0.5',
            selectedRole === ROLES.CITIZEN
              ? 'bg-blue-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          )}
        >
          <User className="w-3.5 h-3.5" />
          <span className="truncate">Public / Citizen</span>
        </button>
      </div>

      {/* Quick 1-Click Demo Shortcut */}
      <div className="p-2.5 bg-blue-950/30 border border-blue-900/40 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <div className="text-[11px] text-slate-300">
            <span className="font-semibold text-white">Preset: </span>
            {selectedRole === ROLES.MOSPI_ADMIN ? 'Central MoSPI Director' : selectedRole === ROLES.DISTRICT_OFFICER ? 'Varanasi District Magistrate' : 'Public Explorer'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 cursor-pointer"
        >
          1-Click Login →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email / Government Officer ID"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          variant="dark"
          placeholder="officer.id@gov.in"
          required
        />

        <Input
          label="Password / Security Token"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          variant="dark"
          placeholder="••••••••••••"
          required
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span>Remember Officer ID</span>
          </label>
          <a href="#forgot" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full shadow-glow-blue"
          isLoading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Authenticate & Enter Platform
        </Button>
      </form>
    </div>
  );
};
