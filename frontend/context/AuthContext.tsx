'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { authUtils } from '@/lib/auth';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = authUtils.getUser();
    // Respect explicit logout: if a logout flag exists, don't auto-login even when a token/user are present
    const logoutFlag = authUtils.getLogoutFlag();
    if (storedUser && authUtils.isAuthenticated() && !logoutFlag) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData: User, token: string) => {
    authUtils.setToken(token);
    authUtils.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
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


