import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import StorySection from "@/components/StorySection";
import ArticlesSection from "@/components/ArticlesSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <StorySection />
      <ArticlesSection />
      <TeamSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default Index;
