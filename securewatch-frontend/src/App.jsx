import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Notification from './components/Notification';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { token, error, clearError } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderPage = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardPage activeMenu={activeMenu} onNavigate={setActiveMenu} />;
      case 'Alerts':
        return <AlertsPage />;
      case 'Logs':
        return <LogsPage />;
      case 'Incidents':
        return (
          <section className="flex-1 overflow-y-auto p-8">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Incidents</h1>
            <p className="text-xs text-slate-500 mt-1">Kanban board — coming in Sprint 5.</p>
          </section>
        );
      case 'Scanner':
        return (
          <section className="flex-1 overflow-y-auto p-8">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Vulnerability Scanner</h1>
            <p className="text-xs text-slate-500 mt-1">Passive header analysis — coming in Sprint 5.</p>
          </section>
        );
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage activeMenu={activeMenu} onNavigate={setActiveMenu} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      {/* Global Notifications */}
      {error && (
        <Notification
          message={error.message}
          type={error.type || 'error'}
          onClose={clearError}
        />
      )}

      {!token ? (
        <AuthPage />
      ) : (
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            {renderPage()}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
