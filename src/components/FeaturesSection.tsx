import FeatureCard from './FeatureCard';
import { MessageCircle, BookOpen, Bell, ClipboardList } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Konsultasi Online',
      description:
        'Chat langsung dengan dokter dan tenaga kesehatan profesional kapan saja, di mana saja',
      delay: '0ms',
    },
    {
      icon: BookOpen,
      title: 'Artikel Kesehatan',
      description:
        'Akses informasi terpercaya tentang kesehatan reproduksi, menstruasi, kehamilan, dan lainnya',
      delay: '100ms',
    },
    {
      icon: Bell,
      title: 'Reminder Kesehatan',
      description:
        'Pengingat otomatis untuk siklus menstruasi, jadwal konsultasi, dan aktivitas kesehatan penting',
      delay: '200ms',
    },
    {
      icon: ClipboardList,
      title: 'Riwayat Kesehatan',
      description:
        'Catat dan pantau kondisi kesehatan Anda dengan sistem pencatatan yang aman dan terorganisir',
      delay: '300ms',
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Fitur Unggulan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
