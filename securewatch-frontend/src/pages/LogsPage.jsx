import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import logService from '../services/logService';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [chainStatus, setChainStatus] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      const res = await logService.getLogs(page, 20);
      if (res.success) {
        setLogs(res.data || []);
        if (res.pagination) setTotalPages(res.pagination.totalPages);
      }
    } catch { setLogs([]); }
  };

  const handleVerifyIntegrity = async () => {
    try {
      const res = await logService.verifyIntegrity();
      if (res.success) setChainStatus(res.data);
    } catch { setChainStatus({ chainIntact: false, corruptedAtIndex: -1 }); }
  };

  return (
    <section className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically chained immutable audit trail for this tenant.
          </p>
        </div>
        <button
          onClick={handleVerifyIntegrity}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Hash className="w-3 h-3 text-slate-400" />
          <span>Verify Hash Chain</span>
        </button>
      </div>

      {/* Chain Integrity Banner */}
      {chainStatus && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-xs font-medium ${
          chainStatus.chainIntact
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {chainStatus.chainIntact
            ? <><ShieldCheck className="w-4 h-4 text-emerald-600" /> Log chain integrity verified — all hashes are consistent.</>
            : <><ShieldAlert className="w-4 h-4 text-red-600" /> Chain corruption detected at log index {chainStatus.corruptedAtIndex}. Data may have been tampered with.</>
          }
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-2.5">Timestamp</th>
                <th className="px-6 py-2.5">Action</th>
                <th className="px-6 py-2.5">Resource</th>
                <th className="px-6 py-2.5">IP</th>
                <th className="px-6 py-2.5">Result</th>
                <th className="px-6 py-2.5">Duration</th>
                <th className="px-6 py-2.5">Hash</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No audit logs yet</p>
                    <p className="text-xs text-slate-400 mt-1">Logs will appear as actions are performed on the platform.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.logId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{log.action}</td>
                    <td className="px-6 py-3 text-slate-500 max-w-[200px] truncate">{log.resource}</td>
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
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-400">{log.durationMs}ms</td>
                    <td className="px-6 py-3 font-mono text-[9px] text-slate-400 max-w-[100px] truncate" title={log.logHash}>
                      {log.logHash?.substring(0, 12)}…
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

export default LogsPage;
