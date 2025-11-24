import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const StorySection = () => {
  return (
    <section className="py-20 bg-maroon-darker text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Setiap wanita punya cerita dan tantangannya sendiri.
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-4">
                Dari masa remaja, kehamilan, hingga menopause—tubuh wanita terus berkembang dan berubah.
              </p>
            </div>
            <div>
              <p className="text-lg md:text-xl leading-relaxed mb-8">
                SheCare hadir untuk mendukungmu di setiap tahap kehidupan, dengan informasi, edukasi, dan layanan yang bisa kamu percayai.
              </p>
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
      </div>
    </section>
  );
};

export default StorySection;
