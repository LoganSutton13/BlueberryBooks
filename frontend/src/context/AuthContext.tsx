'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: { id: number; username: string } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        apiClient.setToken(storedToken);
        setToken(storedToken);
        // Try to decode token to get user info (simplified - in production, verify with backend)
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: payload.user_id, username: payload.sub });
        } catch (e) {
          // Invalid token, clear it
          localStorage.removeItem('auth_token');
          apiClient.setToken(null);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiClient.login(username, password);
    if (response.data) {
      apiClient.setToken(response.data.access_token);
      setToken(response.data.access_token);
      setUser({ id: response.data.user_id, username: response.data.username });
      return { success: true };
    }
    return { success: false, error: response.error || 'Login failed' };
  };

  const register = async (username: string, password: string) => {
    const response = await apiClient.register(username, password);
    if (response.data) {
      apiClient.setToken(response.data.access_token);
      setToken(response.data.access_token);
      setUser({ id: response.data.user_id, username: response.data.username });
      return { success: true };
    }
    return { success: false, error: response.error || 'Registration failed' };
  };

  const logout = () => {
    apiClient.setToken(null);
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

