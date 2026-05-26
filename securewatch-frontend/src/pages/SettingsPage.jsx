import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, KeyRound, Copy, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

const SettingsPage = () => {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [setupData, setSetupData] = useState(null); // { secret, qrCodeUrl }
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if user has MFA enabled initially from context
    if (user) {
      // Fetch fresh user profile if needed, or rely on user context
      // For simplicity, we check local context, or we can query user profile endpoint if it exists
      // Let's call /api/v1/auth/mfa/status if there was one, or just check user object
      setMfaEnabled(user.mfaEnabled || false);
    }
  }, [user]);

  const handleStartSetup = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/api/v1/auth/mfa/setup', {});
      if (res.success) {
        setSetupData(res.data);
      } else {
        setMessage({ text: res.error || 'Failed to start MFA setup', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Could not connect to backend', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndEnable = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/api/v1/auth/mfa/enable', { code: verificationCode });
      if (res.success) {
        setMfaEnabled(true);
        setSetupData(null);
        setVerificationCode('');
        setMessage({ text: 'Multi-Factor Authentication enabled successfully!', type: 'success' });
        // Update user context local state if possible
        const localUser = JSON.parse(localStorage.getItem('sw_user') || '{}');
        localUser.mfaEnabled = true;
        localStorage.setItem('sw_user', JSON.stringify(localUser));
      } else {
        setMessage({ text: res.error || 'Invalid verification code', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error during validation', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!confirm('Are you sure you want to disable Multi-Factor Authentication? This will decrease your account security.')) {
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/api/v1/auth/mfa/disable', {});
      if (res.success) {
        setMfaEnabled(false);
        setMessage({ text: 'Multi-Factor Authentication disabled.', type: 'info' });
        const localUser = JSON.parse(localStorage.getItem('sw_user') || '{}');
        localUser.mfaEnabled = false;
        localStorage.setItem('sw_user', JSON.stringify(localUser));
      } else {
        setMessage({ text: res.error || 'Failed to disable MFA', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error disabling MFA', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate Google Chart QR code URL to avoid hosting libraries
  const getQrImageUrl = (otpauthUrl) => {
    if (!otpauthUrl) return '';
    return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauthUrl)}`;
  };

  return (
    <section className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure your login preferences and multi-factor security rules.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border text-xs font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* MFA Management Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span>Multi-Factor Authentication (MFA)</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
              Require a time-based code (TOTP) from your mobile device to complete authentication. This safeguards your administrator credentials.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded font-medium text-[10px] border flex items-center gap-1 ${
            mfaEnabled 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {mfaEnabled ? (
              <><ShieldCheck className="w-3 h-3 text-emerald-600" /> ACTIVE</>
            ) : (
              <><ShieldAlert className="w-3 h-3 text-slate-400" /> INACTIVE</>
            )}
          </span>
        </div>

        {/* Dynamic State Panels */}
        {!mfaEnabled && !setupData && (
          <button
            onClick={handleStartSetup}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Configure Authenticator App</span>
          </button>
        )}

        {mfaEnabled && (
          <button
            onClick={handleDisableMfa}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Disable Two-Factor Authentication</span>
          </button>
        )}

        {/* MFA Setup Assistant Flow */}
        {!mfaEnabled && setupData && (
          <div className="border-t border-slate-100 pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Step 1: Scan QR Code */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-800">1. Scan QR Code</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Open your authenticator app (Google Authenticator, Microsoft Authenticator, Duo, etc.) and scan the QR code below.
                </p>
                <div className="border border-slate-200 rounded-lg p-3 w-48 h-48 flex items-center justify-center bg-slate-50 mx-auto md:mx-0">
                  <img 
                    src={getQrImageUrl(setupData.qrCodeUrl)} 
                    alt="Scan to configure TOTP" 
                    className="w-44 h-44"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Or enter manually</p>
                  <div className="flex items-center gap-2 max-w-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="font-mono text-[11px] text-slate-600 select-all overflow-x-auto whitespace-nowrap scrollbar-none flex-1">
                      {setupData.secret}
                    </span>
                    <button
                      onClick={copySecretToClipboard}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy Key"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Validate Verification Code */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-800">2. Validate Code</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verify your device is synced by typing the 6-digit code currently shown on your app.
                </p>
                <form onSubmit={handleVerifyAndEnable} className="space-y-4 max-w-xs">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">6-Digit Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full tracking-[0.5em] font-mono py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSetupData(null)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Verify and Activate</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default SettingsPage;
