import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
            Solusi cerdas untuk wanita modern yang peduli pada kesehatannya.
          </h2>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            Analisa Sekarang
            <ArrowUp size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
