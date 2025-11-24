import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center center",
        }}
      />

      {/* Dark Overlay - stronger gradient from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white drop-shadow-lg">
              Kami hadir untuk menjadikan setiap wanita merasa sehat, kuat, dan
              bahagia.
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-white/95 font-medium leading-relaxed drop-shadow-md max-w-2xl">
              Bersama SheCare, wujudkan masa depan yang lebih peduli terhadap
              kesehatan wanita.
            </p>
          </div>

          {/* Right Side - CTA Button */}
          <div
            className="flex justify-center lg:justify-end items-center animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <Button
              size="lg"
              className="
                bg-white text-primary 
                hover:bg-white/95 hover:scale-105
                font-bold text-xl
                px-12 py-8 h-auto
                rounded-full 
                shadow-2xl
                transition-all duration-300
                flex items-center gap-3
                group
              "
              onClick={() => (window.location.href = "/analisa")}
            >
              <span>Mulai Analisa</span>
              <ArrowUp
                size={24}
                className="group-hover:translate-y-[-4px] transition-transform duration-300"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
