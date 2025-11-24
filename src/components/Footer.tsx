import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  ];

  return (
    <footer id="kontak" className="bg-footer text-footer-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-accent mb-2">SheCare</h3>
            <p className="text-lg">Platform kesehatan perempuan terpercaya</p>
          </div>

          {/* Contact Info */}
          <div className="mb-8 space-y-2">
            <p>Email: info@shecare.id</p>
            <p>Phone: +62 123 456 7890</p>
          </div>

          {/* Social Media */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <social.icon className="text-white" size={20} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-footer-foreground/20 pt-8">
            <p className="text-sm">© 2024 SheCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
