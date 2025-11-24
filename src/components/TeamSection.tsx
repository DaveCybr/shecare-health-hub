import logoIcon from '@/assets/logo-icon.png';
import teamPhoto from '@/assets/team-photo.png';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Ahmad Hilmy Febriandika',
      id: 'E31241729',
      position: 'left-top',
    },
    {
      name: 'Febbry Chandra Wijayanti',
      id: 'E31241250',
      position: 'left-bottom',
    },
    {
      name: 'Ade Cahyadi Enggar Anuraga',
      id: 'E31241648',
      position: 'right-top',
    },
    {
      name: 'Nanda Laksana',
      id: 'E31241361',
      position: 'right-bottom',
    },
  ];

  return (
    <section id="tim" className="py-20 bg-maroon text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logoIcon} alt="SheCare Logo" className="w-12 h-12" />
            <h2 className="text-4xl md:text-5xl font-bold text-accent">SheCare</h2>
          </div>
          <p className="text-xl text-white/90">Founder & Web Developer</p>
        </div>

        {/* Team Photo */}
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={teamPhoto} 
              alt="SheCare Team" 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Team Members Info - Optional overlay or below */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                <p className="text-accent text-sm">{member.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
