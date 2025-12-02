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

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && storedUser) {
        try {
          // Validate token by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);

          // Update stored user data
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        } catch (error) {
          // Token invalid or expired
          console.error("Auth validation failed:", error);
          logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response: AuthResponse = await authService.login({
        email,
        password,
      });

      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      setUser(response.user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);

      const response: AuthResponse = await authService.register({
        name,
        email,
        password,
        phone,
      });

      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      setUser(response.user);
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(error.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    window.location.href = "/";
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
