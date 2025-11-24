import logoIcon from '@/assets/logo-icon.png';
import aboutImage from '@/assets/about-image.jpg';

const AboutSection = () => {
  return (
    <section id="tentang" className="py-20 bg-maroon text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo and Text */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <img src={logoIcon} alt="SheCare Logo" className="w-16 h-16" />
              <h2 className="text-4xl md:text-5xl font-bold text-accent">SheCare</h2>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed">
              kami percaya bahwa setiap wanita berhak untuk memahami dan merawat tubuhnya dengan penuh cinta.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl max-w-md w-full">
              <img 
                src={aboutImage} 
                alt="Happy woman" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
