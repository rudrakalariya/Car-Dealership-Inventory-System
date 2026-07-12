import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/services/api";
import type { User, Role } from "@/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string, role?: Role) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authApi.current());
    setLoading(false);
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    login: async (email, password) => {
      const u = await authApi.login(email, password);
      setUser(u);
      return u;
    },
    register: async (username, email, password, role) => {
      const u = await authApi.register(username, email, password, role);
      setUser(u);
      return u;
    },
    logout: () => {
      authApi.logout();
      setUser(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
