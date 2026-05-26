import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import {
  RefreshCw, ShieldCheck, TrendingUp, TrendingDown,
  Monitor, AlertCircle, ExternalLink, Activity,
  Loader2, Flame
} from 'lucide-react';

const DashboardPage = ({ activeMenu, onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentLogs()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (logsRes.success) setRecentLogs(logsRes.data || []);
      setLastRefresh(new Date());
    } catch {
      // fallback: keep whatever we had
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const healthIndex = stats?.securityHealthIndex ?? 0;
  const healthTrend = healthIndex >= 90;

  return (
    <section className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{activeMenu}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Live security metrics for tenant <span className="font-mono font-medium text-slate-700">{user?.subdomain || 'workspace'}</span>
            {lastRefresh && (
              <span className="ml-2 text-slate-400">· Updated {lastRefresh.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          {isLoading
            ? <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
            : <RefreshCw className="w-3 h-3 text-slate-400" />
          }
          <span>Refresh data</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Health Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Security Health</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {stats ? `${healthIndex}%` : '—'}
              </span>
              {stats && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  healthTrend ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {healthTrend
                    ? <><TrendingUp className="w-2.5 h-2.5" /> Good</>
                    : <><TrendingDown className="w-2.5 h-2.5" /> Attention</>
                  }
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              {stats ? `Based on ${stats.totalAlerts} alert(s) and ${stats.suspiciousSessions} suspicious session(s)` : 'Loading...'}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-brand-primary">
            <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Active Sessions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {stats ? stats.activeSessions : '—'}
              </span>
              <span className="text-[10px] text-slate-400">connected now</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {stats ? `${stats.suspiciousSessions} flagged as suspicious` : 'Loading...'}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-slate-500">
            <Monitor className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Unresolved Alerts */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Unresolved Alerts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {stats ? stats.unresolvedAlerts : '—'}
              </span>
              {stats && stats.criticalAlerts > 0 && (
                <span className="text-[10px] text-brand-danger font-medium bg-red-50 text-red-600 px-1.5 py-0.5 rounded">
                  {stats.criticalAlerts} CRITICAL
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              {stats ? `${stats.totalAlerts} total alert(s) recorded` : 'Loading...'}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-brand-danger">
            <AlertCircle className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Open Incidents</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {stats ? stats.openIncidents : '—'}
              </span>
              <span className="text-[10px] text-slate-400">active cases</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {stats ? `${stats.totalLogs} audit log entries recorded` : 'Loading...'}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-amber-500">
            <Flame className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-xs text-slate-800 tracking-tight uppercase">Recent Audit Logs</h2>
          <button
            onClick={() => onNavigate && onNavigate('Logs')}
            className="text-xs text-brand-primary font-medium hover:text-blue-800 flex items-center gap-1"
          >
            <span>View all logs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-2.5">Timestamp</th>
                <th className="px-6 py-2.5">Action</th>
                <th className="px-6 py-2.5">Resource</th>
                <th className="px-6 py-2.5">IP Address</th>
                <th className="px-6 py-2.5">Result</th>
                <th className="px-6 py-2.5">Hash</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No audit activity yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Logs will populate here as users interact with the platform.
                    </p>
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{log.action}</td>
                    <td className="px-6 py-3 text-slate-500 max-w-[180px] truncate">{log.resource}</td>
                    <td className="px-6 py-3 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded font-medium text-[10px] border ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-[9px] text-slate-400 max-w-[90px] truncate" title={log.logHash}>
                      {log.logHash?.substring(0, 12)}…
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
