import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Building, Mail, Lock, User as UserIcon, Loader2, ExternalLink } from 'lucide-react';

const AuthPage = () => {
  const { login, register, isLoading, loadMockSession } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSubdomain, setLoginSubdomain] = useState('');

  // Register inputs
  const [regTenantName, setRegTenantName] = useState('');
  const [regSubdomain, setRegSubdomain] = useState('');
  const [regAdminNom, setRegAdminNom] = useState('');
  const [regAdminEmail, setRegAdminEmail] = useState('');
  const [regAdminPassword, setRegAdminPassword] = useState('');

  const submitLogin = async (e) => {
    e.preventDefault();
    await login(loginEmail, loginPassword, loginSubdomain);
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const success = await register(
      regTenantName,
      regSubdomain,
      regAdminNom,
      regAdminEmail,
      regAdminPassword
    );
    if (success) {
      setIsRegisterMode(false);
      setLoginSubdomain(regSubdomain);
      setLoginEmail(regAdminEmail);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/50 via-slate-900 to-slate-900 z-0"></div>
        <div className="z-10 flex items-center gap-3">
          <div className="bg-blue-600/10 p-2.5 rounded-lg border border-blue-500/20 text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">SecureWatch</span>
        </div>

        <div className="z-10 max-w-md space-y-6">
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Enterprise Multi-Tenant Security Orchestration & Operations
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Consolidate telemetry, audit access trails, and execute real-time threat intelligence detection algorithms under isolated cryptographically secure workspaces.
          </p>
        </div>

        <div className="z-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <span className="text-xs text-slate-500">SecureWatch Platform Team</span>
          <button 
            onClick={loadMockSession}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Launch offline mockup</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
              {isRegisterMode ? 'Register New Tenant' : 'Sign in to SecureWatch'}
            </h1>
            <p className="text-slate-500 text-xs">
              {isRegisterMode 
                ? 'Initialize an isolated database partition for your organization.' 
                : 'Enter your organization credentials below to access your dashboard.'}
            </p>
          </div>

          {isRegisterMode ? (
            /* Registration Form */
            <form onSubmit={submitRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Organisation Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regTenantName}
                      onChange={(e) => setRegTenantName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Subdomain</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={regSubdomain}
                      onChange={(e) => setRegSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="acme"
                      className="w-full pl-3 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800 font-mono text-right"
                    />
                    <span className="absolute right-3 text-[10px] font-semibold text-slate-400 font-mono">.securewatch</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Admin Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regAdminNom}
                    onChange={(e) => setRegAdminNom(e.target.value)}
                    placeholder="Marwan Fo"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regAdminEmail}
                    onChange={(e) => setRegAdminEmail(e.target.value)}
                    placeholder="admin@acme.com"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Password (Min 8 chars)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={regAdminPassword}
                    onChange={(e) => setRegAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Organisation Account'}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={submitLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Tenant Subdomain</label>
                <div className="relative flex items-center">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginSubdomain}
                    onChange={(e) => setLoginSubdomain(e.target.value.toLowerCase())}
                    placeholder="acme"
                    className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                  <span className="absolute right-3 text-[10px] font-semibold text-slate-400 font-mono">.securewatch</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Workspace Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="analyst@acme.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Password</label>
                  <a href="#" className="text-[10px] text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Identity & Login'}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              {isRegisterMode 
                ? 'Already have an organisation? Sign In' 
                : 'Register a new organisation profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
