import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";

// Mock auth hook - replace with real useAuth later
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Check localStorage for auth
    const storedUser = localStorage.getItem("shecare_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated, user };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavLinks = [
    { name: "Beranda", href: "#beranda" },
    { name: "Tentang", href: "#tentang" },
    { name: "Artikel", href: "#artikel" },
    { name: "Lokasi", href: "#lokasi" },
    { name: "Tim", href: "#tim" },
    { name: "Kontak", href: "#kontak" },
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

          {/* Desktop Navigation - Center & Right */}
          <div className="hidden lg:flex items-center flex-1 justify-end space-x-2">
            {/* Main Navigation Links */}
            {mainNavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="nav-link text-sm font-medium text-foreground px-3 py-2 rounded-md hover:bg-accent/10 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Conditional Auth Buttons */}
            {isAuthenticated ? (
              <>
                {/* User Profile Button - When Logged In */}
                <button
                  onClick={() => (window.location.href = "/profile")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent/20 transition-all duration-300 group"
                  title={`Profile: ${user?.name || "User"}`}
                >
                  <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <User size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {user?.name?.split(" ")[0] || "Profile"}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Join Button - When Not Logged In */}
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                  onClick={() => (window.location.href = "/login")}
                >
                  Join
                </Button>
              </>
            )}
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
              {/* Main Navigation Links */}
              {mainNavLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent/10 hover:text-primary"
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-border mt-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* Profile Button - Mobile */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = "/profile";
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      Profil Saya
                    </button>
                  </>
                ) : (
                  <>
                    {/* Join Button - Mobile */}
                    <Button
                      variant="default"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = "/login";
                      }}
                    >
                      Join SheCare
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
