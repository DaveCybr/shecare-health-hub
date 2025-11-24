import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const authLinks = [
    { name: 'Profil Website', href: '#' },
    { name: 'Login', href: '#' },
    { name: 'Register', href: '#' },
    { name: 'Lengkapi Data Diri', href: '#' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card shadow-md`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#beranda" className="flex items-center space-x-3">
            <img src={logoIcon} alt="SheCare Logo" className="w-10 h-10" />
            <span className="text-2xl md:text-3xl font-bold text-accent">
              SheCare
            </span>
          </a>

          {/* Desktop Menu - Right Side */}
          <div className="hidden lg:flex items-center space-x-6">
            {authLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link text-sm font-medium text-foreground"
              >
                {link.name}
              </a>
            ))}
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="User profile"
            >
              <User size={24} className="text-foreground" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {authLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium py-2 px-4 rounded-lg transition-colors text-foreground hover:bg-muted"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
