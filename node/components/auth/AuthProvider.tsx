"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * アプリケーション全体へ認証状態と認証操作を提供する。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUser(): Promise<void> {
    try {
      const response = await api.get<User>("/api/user");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    await api.post("/api/logout");
    setUser(null);
  }

  useEffect(() => {
    // 初回表示時にログインユーザーを取得する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * AuthProviderが管理する認証情報を取得する。
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthはAuthProvider内で使用してください。");
  }

  return context;
}
