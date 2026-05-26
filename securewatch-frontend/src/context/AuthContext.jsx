import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('sw_access_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('sw_user') || 'null'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const login = async (email, password, subdomain) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, subdomain })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || (typeof data === 'string' ? data : 'Authentication failed'));
      }

      if (data.mfaRequired) {
        setError({ message: 'Multi-Factor Authentication (MFA) is required.', type: 'warning' });
        setIsLoading(false);
        return false;
      }

      localStorage.setItem('sw_access_token', data.accessToken);
      localStorage.setItem('sw_refresh_token', data.refreshToken);
      const userData = { nom: data.nom, role: data.role, email, subdomain };
      localStorage.setItem('sw_user', JSON.stringify(userData));

      setToken(data.accessToken);
      setUser(userData);
      return true;
    } catch (err) {
      setError({ message: err.message || 'Server connection failed', type: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nomTenant, subdomain, adminNom, adminEmail, adminPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomTenant, subdomain, adminNom, adminEmail, adminPassword })
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Organisation registration failed.');
      }
      return true;
    } catch (err) {
      setError({ message: err.message || 'Server connection failed', type: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sw_access_token');
    localStorage.removeItem('sw_refresh_token');
    localStorage.removeItem('sw_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const loadMockSession = () => {
    const mockUser = {
      nom: 'Marwan Analyst',
      role: 'ADMIN',
      email: 'analyst@securewatch.com',
      subdomain: 'demo'
    };
    setToken('mock-jwt-token');
    setUser(mockUser);
    localStorage.setItem('sw_access_token', 'mock-jwt-token');
    localStorage.setItem('sw_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, error, login, register, logout, clearError, loadMockSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
