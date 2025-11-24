import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="beranda" className="gradient-hero min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Kesehatan Perempuan di Ujung Jari
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in [animation-delay:200ms]">
            Platform kesehatan terpercaya yang dirancang khusus untuk kebutuhan kesehatan perempuan Indonesia
          </p>
          <Button
            size="lg"
            className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in [animation-delay:400ms]"
          >
            Mulai Sekarang
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
