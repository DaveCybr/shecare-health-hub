// src/pages/auth/Login.tsx - ADD STORAGE CHECK
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { STORAGE_KEYS } from "@/lib/api/config";
import logoIcon from "@/assets/logo-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    register,
    isAuthenticated,
    user,
    isLoading: authLoading,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Check localStorage support
  useEffect(() => {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      console.log("✅ [Login] localStorage is available");
    } catch (e) {
      console.error("❌ [Login] localStorage is NOT available:", e);
      setError(
        "Browser storage tidak tersedia. Nonaktifkan mode private/incognito."
      );
    }
  }, []);

  // ✅ Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    console.log("🔍 [Login] Auth state check:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      authLoading,
    });

    // ✅ Only redirect if BOTH user AND token exist
    if (isAuthenticated && user && token && !authLoading) {
      const from = (location.state as any)?.from || "/profile";
      console.log("✅ [Login] Fully authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    } else if (isAuthenticated && !token) {
      // ✅ CRITICAL: isAuthenticated TRUE but no token = BUG
      console.error(
        "🐛 [Login] BUG DETECTED: isAuthenticated=true but no token!"
      );
      console.error("This should never happen. Forcing logout...");
      // Don't redirect, stay on login page
    }
  }, [isAuthenticated, user, authLoading, navigate, location]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      setSubmitting(false);
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Nama lengkap harus diisi");
        setSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Password tidak cocok");
        setSubmitting(false);
        return;
      }
      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter");
        setSubmitting(false);
        return;
      }
    }

    try {
      if (isLogin) {
        console.log("🔐 [Login Page] Attempting login...");

        // ✅ Call login
        await login(formData.email, formData.password);

        // ✅ Wait for state update
        await new Promise((resolve) => setTimeout(resolve, 500));

        // ✅ Verify token exists
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(STORAGE_KEYS.USER);

        console.log("🔍 [Login Page] Post-login verification:", {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          hasUser: !!user,
        });

        if (!token) {
          throw new Error(
            "Login successful but token not stored! Check browser settings."
          );
        }

        console.log("✅ [Login Page] Login successful!");

        // ✅ Navigate
        const from = (location.state as any)?.from || "/profile";
        console.log("🚀 [Login Page] Navigating to:", from);
        navigate(from, { replace: true });
      } else {
        console.log("📝 [Login Page] Attempting register...");

        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone || undefined
        );

        // ✅ Wait for state update
        await new Promise((resolve) => setTimeout(resolve, 500));

        // ✅ Verify token
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (!token) {
          throw new Error("Registration successful but token not stored!");
        }

        console.log("✅ [Login Page] Registration successful!");
        navigate("/profile", { replace: true });
      }
    } catch (err: any) {
      console.error("❌ [Login Page] Auth error:", err);

      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (err.message) {
        errorMessage = err.message;
      } else if (err.error === "NETWORK_ERROR") {
        errorMessage = "Gagal terhubung ke server. Periksa koneksi internet.";
      } else if (err.error === "TIMEOUT") {
        errorMessage = "Request timeout. Server tidak merespons.";
      } else if (err.status === 401) {
        errorMessage = isLogin
          ? "Email atau password salah"
          : "Email sudah terdaftar.";
      } else if (err.status === 422 || err.status === 400) {
        errorMessage = "Data tidak valid";
      } else if (err.status >= 500) {
        errorMessage = "Server error. Coba lagi nanti.";
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitting) {
      handleSubmit();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon via-maroon-darker to-primary flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon via-maroon-darker to-primary flex items-center justify-center p-4">
      <a
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors group z-50"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Kembali ke Beranda</span>
      </a>

      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-primary text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <img src={logoIcon} alt="SheCare Logo" className="w-14 h-14" />
              </div>
            </div>
            <h1 className="text-3xl text-white/90 font-bold mb-2">SheCare</h1>
            <p className="text-white/90">
              {isLogin ? "Selamat datang kembali!" : "Bergabung bersama kami"}
            </p>
          </div>

          <div className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                    disabled={submitting}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-10"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    disabled={submitting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress}
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
              </Button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({
                    email: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    phone: "",
                  });
                }}
                className="text-primary hover:underline"
                disabled={submitting}
              >
                {isLogin
                  ? "Belum punya akun? Daftar"
                  : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
