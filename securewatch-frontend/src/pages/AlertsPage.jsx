import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import alertService from '../services/alertService';

const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-50 text-red-700 border-red-100',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-100',
  MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  LOW: 'bg-blue-50 text-blue-700 border-blue-100',
  INFO: 'bg-slate-50 text-slate-600 border-slate-200'
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState(null);
  const [stats, setStats] = useState({ unacknowledgedTotal: 0, unacknowledgedCritical: 0 });

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [page, filter]);

  const fetchAlerts = async () => {
    try {
      const res = await alertService.getAlerts(page, 10, filter);
      if (res.success) {
        setAlerts(res.data || []);
        if (res.pagination) setTotalPages(res.pagination.totalPages);
      }
    } catch { setAlerts([]); }
  };

  const fetchStats = async () => {
    try {
      const res = await alertService.getStats();
      if (res.success) setStats(res.data);
    } catch {}
  };

  return (
    <section className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Alerts</h1>
          <p className="text-xs text-slate-500 mt-1">
            {stats.unacknowledgedTotal} unresolved alerts — {stats.unacknowledgedCritical} critical
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filter || ''}
            onChange={(e) => { setFilter(e.target.value || null); setPage(0); }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-2.5">Severity</th>
                <th className="px-6 py-2.5">Type</th>
                <th className="px-6 py-2.5">Title</th>
                <th className="px-6 py-2.5">Risk Score</th>
                <th className="px-6 py-2.5">Timestamp</th>
                <th className="px-6 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No alerts found</p>
                    <p className="text-xs text-slate-400 mt-1">The system is all clear for now.</p>
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.alertId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded font-medium text-[10px] border ${SEVERITY_STYLES[alert.severity]}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-[11px] text-slate-500">{alert.type}</td>
                    <td className="px-6 py-3 font-medium text-slate-800 max-w-xs truncate">{alert.title}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${alert.riskScore >= 80 ? 'bg-red-500' : alert.riskScore >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                            style={{ width: `${alert.riskScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{alert.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {alert.acknowledged ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium text-[10px] border border-emerald-100 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> ACK
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-medium text-[10px] border border-red-100">
                          PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-[10px] text-slate-400">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-1 border border-slate-200 rounded disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-1 border border-slate-200 rounded disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertsPage;
