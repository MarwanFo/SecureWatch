import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Flame,
  Activity,
  ScanEye,
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Alerts', icon: AlertTriangle },
    { name: 'Incidents', icon: Flame },
    { name: 'Logs', icon: Activity },
    { name: 'Scanner', icon: ScanEye },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-3">
        <div className="bg-blue-50 p-2 rounded-lg text-brand-primary">
          <Shield className="w-5 h-5 stroke-[2.5]" />
        </div>
        <span className="font-semibold text-base tracking-tight text-slate-800">SecureWatch</span>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium ml-auto">
          {user?.subdomain || 'root'}
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-100 text-brand-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-primary/50" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 text-xs">
          {user?.nom ? user.nom.split(' ').map((n) => n[0]).join('') : 'SW'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate">{user?.nom}</p>
          <p className="text-[10px] text-slate-400 truncate">{user?.role} - {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="p-1 text-slate-400 hover:text-slate-950 transition-colors"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
