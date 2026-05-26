import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
        </span>
        <span className="text-[11px] font-medium text-slate-500">Live Telemetry System Connected</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, logs, sessions..."
            className="w-64 pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-primary focus:bg-white transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors relative border border-slate-200">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-danger rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
