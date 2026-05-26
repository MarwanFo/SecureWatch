import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Notification from './components/Notification';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  const { token, error, clearError } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

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
          {/* Authenticated Workspace */}
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <DashboardPage activeMenu={activeMenu} />
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
