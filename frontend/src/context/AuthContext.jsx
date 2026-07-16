import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('qc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('qc_token'));

  const saveAuth = useCallback((userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('qc_user', JSON.stringify(userData));
    localStorage.setItem('qc_token', tokenValue);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: tokenValue } = response.data;
      saveAuth(userData, tokenValue);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  }, [saveAuth]);

  const register = useCallback(async (data) => {
    try {
      const response = await authAPI.register(data);
      const { user: userData, token: tokenValue } = response.data;
      saveAuth(userData, tokenValue);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  }, [saveAuth]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qc_user');
    localStorage.removeItem('qc_token');
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!token && !!user;

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
        localStorage.setItem('qc_user', JSON.stringify(response.data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
