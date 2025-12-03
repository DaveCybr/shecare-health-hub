// src/context/AuthContext.tsx - PRODUCTION FIX
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
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

  // ✅ Initialize auth on mount
  useEffect(() => {
    console.log("🚀 [AuthContext] Initializing...");
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      console.log("🔍 [AuthContext] Init check:", {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 30) + "..." : "none",
      });

      if (!token) {
        console.log("❌ [AuthContext] No token found");
        setUser(null);
        setIsLoading(false);
        return;
      }

      // ✅ Validate token by fetching user
      console.log("📡 [AuthContext] Validating token...");
      const currentUser = await authService.getCurrentUser();

      setUser(currentUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      console.log("✅ [AuthContext] Auth validated:", currentUser.name);
    } catch (error: any) {
      console.error("❌ [AuthContext] Token validation failed:", error);

      // ✅ Clear invalid token
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 [AuthContext] Starting login...");

      const response: AuthResponse = await authService.login({
        email,
        password,
      });

      console.log("📥 [AuthContext] Login response:", {
        hasToken: !!response.token,
        tokenLength: response.token?.length,
        user: response.user.name,
      });

      // ✅ CRITICAL: Store token SYNCHRONOUSLY
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      // ✅ Verify storage immediately
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken || storedToken !== response.token) {
        throw new Error(
          "Failed to persist token! Check browser settings or storage quota."
        );
      }

      console.log("✅ [AuthContext] Token verified in storage:", {
        stored: storedToken.substring(0, 30) + "...",
        matches: storedToken === response.token,
      });

      // ✅ Update state after storage is confirmed
      setUser(response.user);

      console.log("✅ [AuthContext] Login complete");
    } catch (error: any) {
      console.error("❌ [AuthContext] Login error:", error);
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
      console.log("📝 [AuthContext] Starting registration...");

      const response: AuthResponse = await authService.register({
        name,
        email,
        password,
        phone,
      });

      // ✅ Store token SYNCHRONOUSLY
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      // ✅ Verify storage
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken || storedToken !== response.token) {
        throw new Error("Failed to persist token!");
      }

      // ✅ Update state
      setUser(response.user);

      console.log("✅ [AuthContext] Registration complete");
    } catch (error: any) {
      console.error("❌ [AuthContext] Register error:", error);
      throw error;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      console.log("🔄 [AuthContext] Refreshing user...");
      const currentUser = await authService.getCurrentUser();

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      setUser(currentUser);

      console.log("✅ [AuthContext] User refreshed");
    } catch (error) {
      console.error("❌ [AuthContext] Refresh failed:", error);
      logout();
    }
  }, []);

  const logout = useCallback(() => {
    console.log("👋 [AuthContext] Logging out...");

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);

    console.log("✅ [AuthContext] Logout complete");
  }, []);

  // ✅ Listen to storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TOKEN) {
        console.log("🔄 [AuthContext] Token changed in another tab");
        const newToken = e.newValue;
        if (!newToken) {
          setUser(null);
        } else {
          initAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Compute isAuthenticated based on BOTH user AND token
  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const result = !!user && !!token;

    console.log("🔍 [AuthContext] isAuthenticated computed:", {
      hasUser: !!user,
      hasToken: !!token,
      result,
    });

    return result;
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
