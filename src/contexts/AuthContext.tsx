import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthTokens } from '@/types';

interface AuthContextType {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
    }
  }, []);

  const login = (newTokens: AuthTokens) => {
    setTokens(newTokens);
    localStorage.setItem('authTokens', JSON.stringify(newTokens));
  };

  const logout = () => {
    setTokens(null);
    localStorage.removeItem('authTokens');
  };

  const getAccessToken = () => tokens?.access || null;

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthenticated: !!tokens,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
