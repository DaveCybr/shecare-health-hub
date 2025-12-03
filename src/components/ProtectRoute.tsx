// src/components/ProtectRoute.tsx - FIXED
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/api/config";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ✅ Debug: Log auth state and token
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log("🔒 [ProtectedRoute] Auth Check:", {
      pathname: location.pathname,
      isAuthenticated,
      isLoading,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });
  }, [isAuthenticated, isLoading, location.pathname]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // ✅ Double check: Verify token exists
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) {
    console.error("❌ [ProtectedRoute] No token found, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.warn("⚠️ [ProtectedRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("✅ [ProtectedRoute] Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
