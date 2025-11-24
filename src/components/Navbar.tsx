import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Profil Website", href: "#tentang" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
    { name: "Lengkapi Data Diri", href: "/profile" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-card shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <a
            href="#beranda"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img src={logoIcon} alt="SheCare Logo" className="w-12 h-12" />
            <span className="text-3xl font-bold text-accent">SheCare</span>
          </a>

          {/* Desktop Navigation - Right */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="nav-link text-sm font-medium text-foreground px-4 py-2 rounded-md hover:bg-accent/10 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* User Icon Button */}
            <button
              className="ml-2 p-3 rounded-full hover:bg-accent/20 transition-all duration-300 group"
              aria-label="User profile"
              onClick={() => (window.location.href = "/profile")}
            >
              <User
                size={24}
                className="text-foreground group-hover:text-accent transition-colors"
              />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-foreground hover:bg-accent/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 animate-fade-in border-t border-border">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent/10"
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile User Profile Link */}
              <a
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent/10 flex items-center gap-2"
              >
                <User size={20} />
                Profil Saya
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
