import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import StorySection from '@/components/StorySection';
import ArticlesSection from '@/components/ArticlesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <StorySection />
      <ArticlesSection />
      <Footer />
    </div>
  );
};

export default Index;
