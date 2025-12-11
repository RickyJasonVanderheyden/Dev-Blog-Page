'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { authUtils } from '@/lib/auth';
import { authApi } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void; // Token is no longer needed as it's in HTTP-only cookie
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = authUtils.getUser();
    // Respect explicit logout: if a logout flag exists, don't auto-login even when a user is present
    const logoutFlag = authUtils.getLogoutFlag();
    if (storedUser && authUtils.isAuthenticated() && !logoutFlag) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData: User) => {
    // Token is handled by HTTP-only cookie set by server
    authUtils.setUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call the logout API to clear the HTTP-only cookie
      await authApi.logout();
    } catch (error) {
      // Even if the API call fails, we still want to clear local state
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage and state
      authUtils.removeToken();
      setUser(null);
    }
  };

  const updateUser = (userData: User) => {
    authUtils.setUser(userData);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


