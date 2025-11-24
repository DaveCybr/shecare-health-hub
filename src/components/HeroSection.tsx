import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
          {/* Left Side - Text */}
          <div className="text-white animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Kami hadir untuk menjadikan setiap wanita merasa sehat, kuat, dan bahagia.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90">
              Bersama SheCare, wujudkan masa depan yang lebih peduli terhadap kesehatan wanita.
            </p>
          </div>

          {/* Right Side - CTA Button */}
          <div className="flex justify-center lg:justify-end animate-fade-in [animation-delay:300ms]">
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-card/90 font-semibold px-8 py-6 text-lg rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Mulai Analisa
              <ArrowUp size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
