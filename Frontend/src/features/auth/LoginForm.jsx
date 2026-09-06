import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { api } from '../../services/api';

export const LoginForm = ({ onSuccess, initialRole = ROLES.MOSPI_ADMIN }) => {
  const [view, setView] = useState('signin'); // 'signin' | 'forgot' | 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('admin.mospi@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Reset state
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Sign up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState(ROLES.CITIZEN);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Role toggle handler
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    if (roleKey === ROLES.MOSPI_ADMIN) {
      setEmail('admin.mospi@gov.in');
    } else if (roleKey === ROLES.DISTRICT_OFFICER) {
      setEmail('collector.varanasi@gov.in');
    } else {
      setEmail('citizen.patel@gmail.com');
    }
    setPassword('••••••••••••');
    setError('');
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Determine role from selection or email
      let targetRole = selectedRole;
      const em = email.toLowerCase().trim();
      if (em.includes('district') || em.includes('collector') || em.includes('varanasi') || em.includes('dm')) {
        targetRole = ROLES.DISTRICT_OFFICER;
      } else if (em.includes('citizen') || em.includes('public') || em.includes('patel')) {
        targetRole = ROLES.CITIZEN;
      } else if (em.includes('admin') || em.includes('mospi')) {
        targetRole = ROLES.MOSPI_ADMIN;
      }

      await login(email, password, targetRole);
      if (onSuccess) onSuccess();

      if (targetRole === ROLES.CITIZEN) {
        navigate('/public');
      } else if (targetRole === ROLES.DISTRICT_OFFICER) {
        navigate('/district');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset Request (Matching Image 2)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setIsResetLoading(true);

    try {
      const res = await api.requestPasswordReset(resetEmail);
      if (res && res.success) {
        setResetSuccess(`Password reset link dispatched to ${resetEmail}. Check your inbox for security verification.`);
      } else {
        setResetSuccess(`A reset authorization link has been routed to ${resetEmail}.`);
      }
    } catch (err) {
      setResetError('Unable to route reset link. Please check the email address.');
    } finally {
      setIsResetLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSignupLoading(true);

    try {
      await login(signupEmail, signupPassword, signupRole);
      if (onSuccess) onSuccess();

      if (signupRole === ROLES.CITIZEN) {
        navigate('/public');
      } else if (signupRole === ROLES.DISTRICT_OFFICER) {
        navigate('/district');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Account registration failed.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* ============================================================ */}
      {/* 1. SIGN IN VIEW (MATCHING media_1788637936688.png)           */}
      {/* ============================================================ */}
      {view === 'signin' && (
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-slate-100 p-7 sm:p-9 transition-all">
          {/* Top Emblem: Black rounded square with official Scheme Guard Shield */}
          <div className="w-12 h-12 rounded-xl bg-[#111827] flex items-center justify-center shadow-sm mb-6 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>

          {/* Heading and Subtitle */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Use your credentials or select an access role.
            </p>
          </div>

          {/* Three Roles Selector: Central Admin, District Officer, Public Citizen */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.MOSPI_ADMIN)}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer truncate ${
                selectedRole === ROLES.MOSPI_ADMIN
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Central Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.DISTRICT_OFFICER)}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer truncate ${
                selectedRole === ROLES.DISTRICT_OFFICER
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              District Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.CITIZEN)}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer truncate ${
                selectedRole === ROLES.CITIZEN
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public Citizen
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-3">
            {/* Email Field */}
            <div>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              />
            </div>

            {/* Password Field with SHOW/HIDE Button */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 pr-16 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[11px] font-bold tracking-wider text-slate-700 hover:text-slate-900 select-none cursor-pointer transition"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 bg-[#18181b] hover:bg-black active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Bottom Row: Forgot password? & No account? Sign up */}
          <div className="flex items-center justify-between pt-5 mt-2 text-xs border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setResetEmail(email !== '••••••••••••' ? email : '');
                setView('forgot');
              }}
              className="text-slate-700 hover:text-slate-900 font-medium transition cursor-pointer"
            >
              Forgot password?
            </button>
            <div className="text-slate-500">
              No account?{' '}
              <button
                type="button"
                onClick={() => setView('signup')}
                className="font-semibold text-slate-900 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. RESET PASSWORD VIEW (MATCHING media_1788638383831.png)    */}
      {/* ============================================================ */}
      {view === 'forgot' && (
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-slate-100 p-7 sm:p-9 transition-all">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              setView('signin');
              setResetSuccess('');
              setResetError('');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Enter the email on your account and we'll send a link to set a new password.
            </p>
          </div>

          {resetSuccess ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Reset instructions dispatched</p>
                  <p className="mt-0.5">{resetSuccess}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setView('signin');
                  setResetSuccess('');
                }}
                className="w-full py-3 bg-[#18181b] hover:bg-black text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Return to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {resetError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isResetLoading}
                className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isResetLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SIGN UP VIEW                                             */}
      {/* ============================================================ */}
      {view === 'signup' && (
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-slate-100 p-7 sm:p-9 transition-all">
          <button
            type="button"
            onClick={() => setView('signin')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Register for verified Scheme Guard access.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              />
            </div>

            <div>
              <input
                type="email"
                required
                placeholder="Work or Citizen Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Password (min 8 characters)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Designation / Access Level
              </label>
              <select
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
              >
                <option value={ROLES.CITIZEN}>Public Citizen / Social Auditor</option>
                <option value={ROLES.DISTRICT_OFFICER}>District Magistrate / Collector</option>
                <option value={ROLES.MOSPI_ADMIN}>Central MoSPI Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSignupLoading}
              className="w-full mt-2 py-3 px-4 bg-[#18181b] hover:bg-black active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSignupLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
