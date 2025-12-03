// src/context/AuthContext.tsx - REACTIVE FIX
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
  // ✅ Add token state to trigger re-renders
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    console.log("🚀 [AuthContext] Initializing...");
    initAuth();
  }, []);

  // ✅ Check token on every render
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const tokenExists = !!token;

    if (tokenExists !== hasToken) {
      console.log("🔄 [AuthContext] Token state changed:", tokenExists);
      setHasToken(tokenExists);
    }
  }, [user]); // Re-check when user changes

  const initAuth = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    console.log("🔍 [AuthContext] Init check:", {
      hasToken: !!token,
      tokenPreview: token?.substring(0, 30) + "...",
    });

    if (!token) {
      console.log("❌ [AuthContext] No token");
      setUser(null);
      setHasToken(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log("📡 [AuthContext] Validating token...");
      const currentUser = await authService.getCurrentUser();

      setUser(currentUser);
      setHasToken(true);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      console.log("✅ [AuthContext] Auth validated:", currentUser.name);
    } catch (error) {
      console.error("❌ [AuthContext] Token validation failed:", error);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setHasToken(false);
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

      // ✅ Store token
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      // ✅ Verify immediately
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        throw new Error("Failed to store token!");
      }

      console.log("✅ [AuthContext] Token stored, length:", storedToken.length);

      // ✅ Update states
      setUser(response.user);
      setHasToken(true);

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

      // ✅ Store token
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        throw new Error("Failed to store token!");
      }

      // ✅ Update states
      setUser(response.user);
      setHasToken(true);

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
    setHasToken(false);

    console.log("✅ [AuthContext] Logout complete");
  }, []);

  // ✅ Listen to storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TOKEN) {
        console.log("🔄 [AuthContext] Token changed in another tab");
        const newToken = e.newValue;
        setHasToken(!!newToken);
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

  // ✅ useMemo for isAuthenticated - recomputes when dependencies change
  const isAuthenticated = useMemo(() => {
    const result = !!user && hasToken;

    console.log("🔍 [AuthContext] isAuthenticated computed:", {
      hasUser: !!user,
      hasToken,
      result,
    });

    return result;
  }, [user, hasToken]);

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
