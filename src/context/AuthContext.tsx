// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, type User, type AuthResponse } from "@/lib/api/services";
import { STORAGE_KEYS } from "@/lib/api/config";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state by calling auth/me
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      console.log("🔍 Initializing auth...", { hasToken: !!token });

      if (!token) {
        console.log("❌ No token found, user not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching user from auth/me...");
        const currentUser = await authService.getCurrentUser();

        setUser(currentUser);
        console.log("✅ Auth validated from API:", currentUser);
      } catch (error) {
        console.error("❌ Auth validation failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting login...");

      const response: AuthResponse = await authService.login({
        email,
        password,
      });

      console.log("✅ Login response:", response);

      // ✅ Store token first
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      // ✅ Use user from login response directly
      setUser(response.user);

      console.log(
        "✅ Login successful, user set from response:",
        response.user
      );
    } catch (error: any) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      console.log("📝 Attempting registration...");

      const response: AuthResponse = await authService.register({
        name,
        email,
        password,
        phone,
      });

      console.log("✅ Register response:", response);

      // ✅ Store token first
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      // ✅ Use user from register response directly
      setUser(response.user);

      console.log(
        "✅ Registration successful, user set from response:",
        response.user
      );
    } catch (error: any) {
      console.error("❌ Register error:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      console.log("🔄 Refreshing user from API...");
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      console.log("✅ User refreshed:", currentUser);
    } catch (error) {
      console.error("❌ Failed to refresh user:", error);
      logout();
    }
  };

  const logout = () => {
    console.log("👋 Logging out...");
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
