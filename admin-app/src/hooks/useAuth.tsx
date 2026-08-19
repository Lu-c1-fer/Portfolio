import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStoredKey, getStoredKey, setStoredKey, setUnauthorizedHandler } from "../lib/auth";

type AuthContextValue = {
  apiKey: string | null;
  isAuthenticated: boolean;
  login: (key: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Holds the API key in state (not just localStorage) so the app can react
// when it changes. That matters because api.ts's 401 handler clears the
// stored key from inside a rejected fetch — outside React's render cycle —
// and needs a way to flip the UI back to the Login screen without a full
// page reload. It registers itself as the unauthorized handler on mount so
// api.ts can stay framework-agnostic (no React import there).
export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => getStoredKey());

  const logout = useCallback(() => {
    clearStoredKey();
    setApiKey(null);
  }, []);

  const login = useCallback((key: string) => {
    setStoredKey(key);
    setApiKey(key);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ apiKey, isAuthenticated: apiKey !== null, login, logout }),
    [apiKey, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
