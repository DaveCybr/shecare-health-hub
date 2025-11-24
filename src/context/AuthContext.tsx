// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("shecare_user");
      const token = localStorage.getItem("shecare_token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: "1",
        name: "Sarah Wijaya",
        email: email,
      };

      // Store in localStorage
      localStorage.setItem("shecare_user", JSON.stringify(mockUser));
      localStorage.setItem("shecare_token", "mock-jwt-token-123");

      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login gagal. Silakan coba lagi.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: "1",
        name: name,
        email: email,
      };

      // Store in localStorage
      localStorage.setItem("shecare_user", JSON.stringify(mockUser));
      localStorage.setItem("shecare_token", "mock-jwt-token-123");

      setUser(mockUser);
    } catch (error) {
      console.error("Register error:", error);
      throw new Error("Pendaftaran gagal. Silakan coba lagi.");
    }
  };

  const logout = () => {
    localStorage.removeItem("shecare_user");
    localStorage.removeItem("shecare_token");
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
