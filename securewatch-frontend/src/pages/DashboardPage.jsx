import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, ShieldCheck, TrendingUp, Monitor, AlertCircle, ExternalLink } from 'lucide-react';

const DashboardPage = ({ activeMenu }) => {
  const { user } = useAuth();

  return (
    <section className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{activeMenu}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Security health index and compliance metrics for this workspace tenant.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium shadow-sm transition-colors">
          <RefreshCw className="w-3 h-3 text-slate-400" />
          <span>Refresh data</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Security Health Index</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">96.4%</span>
              <span className="text-[10px] text-brand-success font-medium bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +1.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Calculated across 8 security modules</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-brand-primary">
            <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Active Sessions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">14</span>
              <span className="text-[10px] text-slate-400">active now</span>
            </div>
            <p className="text-[10px] text-slate-400">3 suspicious location checks pending</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-slate-500">
            <Monitor className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Pending Alerts Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Unresolved Alerts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">3</span>
              <span className="text-[10px] text-brand-danger font-medium bg-red-50 text-red-600 px-1.5 py-0.5 rounded">
                2 CRITICAL
                  </span>
            </div>
            <p className="text-[10px] text-slate-400">Mean time to resolve: 12.4 minutes</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-brand-danger">
            <AlertCircle className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-xs text-slate-800 tracking-tight uppercase">Recent Security Logs</h2>
          <button className="text-xs text-brand-primary font-medium hover:text-blue-800 flex items-center gap-1">
            <span>Go to Audit Log</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-2.5">Timestamp</th>
                <th className="px-6 py-2.5">User</th>
                <th className="px-6 py-2.5">Action</th>
                <th className="px-6 py-2.5">IP Address</th>
                <th className="px-6 py-2.5">Location</th>
                <th className="px-6 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-mono text-[10px] text-slate-400">2026-05-26 20:54:12</td>
                <td className="px-6 py-3 font-medium text-slate-800">{user?.nom || 'Anonymous'}</td>
                <td className="px-6 py-3 text-slate-500">User Login (MFA verified)</td>
                <td className="px-6 py-3 font-mono text-[11px] text-slate-500">197.230.15.42</td>
                <td className="px-6 py-3">Rabat, Morocco</td>
                <td className="px-6 py-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium text-[10px] border border-emerald-100">
                    SUCCESS
                      </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-mono text-[10px] text-slate-400">2026-05-26 20:52:05</td>
                <td className="px-6 py-3 font-medium text-slate-800">system-cron</td>
                <td className="px-6 py-3 text-slate-500">Automatic Vulnerability Scan</td>
                <td className="px-6 py-3 font-mono text-[11px] text-slate-500">127.0.0.1</td>
                <td className="px-6 py-3">Localhost</td>
                <td className="px-6 py-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium text-[10px] border border-emerald-100">
                    SUCCESS
                      </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
