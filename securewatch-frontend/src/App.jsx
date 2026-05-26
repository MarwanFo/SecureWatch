import React, { useState } from 'react';

function App() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Alerts', icon: '⚠️' },
    { name: 'Incidents', icon: '🔥' },
    { name: 'Logs', icon: '📝' },
    { name: 'Scanner', icon: '🔍' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-3">
          <span className="text-xl">🛡️</span>
          <span className="font-semibold text-lg tracking-tight text-slate-800">SecureWatch</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">SaaS</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeMenu === item.name
                  ? 'bg-slate-100 text-brand-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700 text-sm">
            MA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Marwan Analyst</p>
            <p className="text-[10px] text-slate-500 truncate">tenant-admin@securewatch.com</p>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
            <span className="text-xs font-medium text-slate-500">System Monitoring Operational</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-64 pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
            <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 relative">
              <span>🔔</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-danger rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{activeMenu}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Vue d'ensemble et télémétrie de sécurité en temps réel de votre tenant.
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Security Health Index</p>
                <p className="text-3xl font-bold text-slate-900">96 / 100</p>
                <p className="text-[10px] text-brand-success font-medium">↑ 1.2% versus last week</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-brand-success/20 border-t-brand-success flex items-center justify-center font-bold text-sm text-brand-success">
                96%
              </div>
            </div>

            {/* Active Sessions Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Active User Sessions</p>
                <p className="text-3xl font-bold text-slate-900">14</p>
                <p className="text-[10px] text-slate-500 font-medium">Across 3 geographical nodes</p>
              </div>
              <div className="text-2xl bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center">
                💻
              </div>
            </div>

            {/* Pending Alerts Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Pending Alerts</p>
                <p className="text-3xl font-bold text-slate-900">3</p>
                <p className="text-[10px] text-brand-danger font-medium">2 require immediate action</p>
              </div>
              <div className="text-2xl bg-brand-danger/10 text-brand-danger w-12 h-12 rounded-lg flex items-center justify-center">
                🚨
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-sm text-slate-800">Recent Security Activity Logs</h2>
              <button className="text-xs text-brand-primary font-medium hover:underline">View All Logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">IP Address</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-500">2026-05-26 20:54:12</td>
                    <td className="px-6 py-3 font-medium text-slate-900">Marwan Analyst</td>
                    <td className="px-6 py-3">User Login</td>
                    <td className="px-6 py-3 font-mono text-slate-500">197.230.15.42</td>
                    <td className="px-6 py-3">Maroc (Rabat)</td>
                    <td className="px-6 py-3">
                      <span className="bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-medium text-[10px]">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-500">2026-05-26 20:52:05</td>
                    <td className="px-6 py-3 font-medium text-slate-900">system-cron</td>
                    <td className="px-6 py-3">Vulnerability Scan</td>
                    <td className="px-6 py-3 font-mono text-slate-500">127.0.0.1</td>
                    <td className="px-6 py-3">Localhost</td>
                    <td className="px-6 py-3">
                      <span className="bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full font-medium text-[10px]">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-mono text-[10px] text-slate-500">2026-05-26 20:48:33</td>
                    <td className="px-6 py-3 font-medium text-slate-900">Unknown Agent</td>
                    <td className="px-6 py-3">Failed Authentication</td>
                    <td className="px-6 py-3 font-mono text-slate-500">95.142.122.9</td>
                    <td className="px-6 py-3">Russia (Moscow)</td>
                    <td className="px-6 py-3">
                      <span className="bg-brand-danger/10 text-brand-danger px-2 py-0.5 rounded-full font-medium text-[10px]">
                        FAILED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
