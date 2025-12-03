// src/pages/auth/Login.tsx - DEBUG VERSION
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import logoIcon from "@/assets/logo-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading: authLoading } = useAuth();

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
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleSubmit = async () => {
    setError("");
    setDebugInfo("");

    console.log("🚀 Form submitted:", { isLogin, email: formData.email });

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Nama lengkap harus diisi");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Password tidak cocok");

        return;
      }
      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter");
        return;
      }
    }

    try {
      setDebugInfo("Menghubungi server...");
      console.log("📡 Calling API...");

      if (isLogin) {
        console.log("🔐 Attempting login with:", formData.email);
        await login(formData.email, formData.password);
        console.log("✅ Login successful!");
        setDebugInfo("Login berhasil! Redirecting...");

        // Small delay to show success message
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      } else {
        console.log("📝 Attempting register with:", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });

        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone || undefined
        );

        console.log("✅ Registration successful!");
        setDebugInfo("Registrasi berhasil! Redirecting...");

        // Small delay to show success message
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err);

      // Detailed error logging
      if (err.error) {
        console.error("Error code:", err.error);
      }
      if (err.status) {
        console.error("HTTP status:", err.status);
      }

      // User-friendly error messages
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (err.message) {
        errorMessage = err.message;
      } else if (err.error === "NETWORK_ERROR") {
        errorMessage =
          "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err.error === "TIMEOUT") {
        errorMessage = "Request timeout. Server tidak merespons.";
      } else if (err.status === 401) {
        errorMessage = isLogin
          ? "Email atau password salah"
          : "Registrasi gagal. Email mungkin sudah terdaftar.";
      } else if (err.status === 422 || err.status === 400) {
        errorMessage = "Data yang dimasukkan tidak valid";
      } else if (err.status >= 500) {
        errorMessage = "Server error. Silakan coba lagi nanti.";
      }

      setError(errorMessage);
      setDebugInfo(
        `Error: ${err.error || "Unknown"} (Status: ${err.status || "N/A"})`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !authLoading) {
      handleSubmit();
    }
  };

  // Show loading state from AuthContext
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
      {/* Back to Home Button */}
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

      {/* Login/Register Card */}
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
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

          {/* Form */}
          <div className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-xs">
                  Debug: {debugInfo}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="h-12"
                    disabled={authLoading}
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
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
                    className="h-12 pl-10"
                    disabled={authLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Nomor Telepon{" "}
                    <span className="text-muted-foreground">(Opsional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="h-12"
                    disabled={authLoading}
                  />
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
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
                    className="h-12 pl-10 pr-10"
                    disabled={authLoading}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={authLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold"
                  >
                    Konfirmasi Password
                  </Label>
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
                      className="h-12 pl-10"
                      disabled={authLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      alert("Fitur lupa password akan segera tersedia");
                    }}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                    disabled={authLoading}
                  >
                    Lupa password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                disabled={authLoading}
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : isLogin ? (
                  "Masuk"
                ) : (
                  "Daftar"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setDebugInfo("");
                    setFormData({
                      email: "",
                      password: "",
                      confirmPassword: "",
                      name: "",
                      phone: "",
                    });
                  }}
                  className="text-primary hover:text-primary/80 font-semibold"
                  disabled={authLoading}
                >
                  {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </div>

            {/* Terms (Register only) */}
            {!isLogin && (
              <p className="text-xs text-center text-muted-foreground mt-6">
                Dengan mendaftar, Anda menyetujui{" "}
                <a href="#" className="text-primary hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-primary hover:underline">
                  Kebijakan Privasi
                </a>{" "}
                kami
              </p>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/70 text-sm mt-6">
          © 2024 SheCare. Platform kesehatan perempuan terpercaya.
        </p>
      </div>
    </div>
  );
};

export default Login;
