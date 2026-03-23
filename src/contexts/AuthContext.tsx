import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthUser, AppRole } from "@/types/auth";
import {
  login as keycloakLogin,
  refreshAccessToken,
  getUserFromToken,
  isTokenExpired,
  storeTokens,
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // Initialize from stored token
  useEffect(() => {
    const init = async () => {
      const accessToken = getStoredAccessToken();
      const refreshToken = getStoredRefreshToken();

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      if (!isTokenExpired(accessToken)) {
        setUser(getUserFromToken(accessToken));
        setIsLoading(false);
        return;
      }

      // Try refresh
      if (refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          storeTokens(tokens);
          setUser(getUserFromToken(tokens.access_token));
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // Auto-refresh timer
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const accessToken = getStoredAccessToken();
      const refreshToken = getStoredRefreshToken();

      if (accessToken && isTokenExpired(accessToken) && refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          storeTokens(tokens);
          setUser(getUserFromToken(tokens.access_token));
        } catch {
          logout();
        }
      }
    }, 30000); // check every 30s

    return () => clearInterval(interval);
  }, [user, logout]);

  const login = async (username: string, password: string) => {
    const tokens = await keycloakLogin(username, password);
    storeTokens(tokens);
    setUser(getUserFromToken(tokens.access_token));
  };

  const hasRole = (role: AppRole) => user?.roles.includes(role) ?? false;
  const hasAnyRole = (roles: AppRole[]) => roles.some((r) => user?.roles.includes(r));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
