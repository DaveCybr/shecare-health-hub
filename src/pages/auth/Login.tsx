// src/pages/Login.tsx
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logoIcon from "@/assets/logo-icon.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Nama lengkap harus diisi");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Password tidak cocok");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter");
        setLoading(false);
        return;
      }
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data
      const mockUser = {
        id: "1",
        name: isLogin ? "Sarah Wijaya" : formData.name,
        email: formData.email,
      };

      // Store in localStorage
      localStorage.setItem("shecare_user", JSON.stringify(mockUser));
      localStorage.setItem("shecare_token", "mock-jwt-token-123");

      // Redirect based on mode
      if (isLogin) {
        window.location.href = "/profile";
      } else {
        // After register, redirect to profile
        window.location.href = "/profile";
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

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
                    className="h-12"
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
                    className="h-12 pl-10"
                  />
                </div>
              </div>

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
                    className="h-12 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Lupa password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                disabled={loading}
              >
                {loading ? (
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
                    setFormData({
                      email: "",
                      password: "",
                      confirmPassword: "",
                      name: "",
                    });
                  }}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </div>

            {/* Terms (Register only) */}
            {!isLogin && (
              <p className="text-xs text-center text-muted-foreground mt-6">
                Dengan mendaftar, Anda menyetujui{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a href="/privacy" className="text-primary hover:underline">
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
