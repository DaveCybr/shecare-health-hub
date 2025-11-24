import logoIcon from "@/assets/logo-icon.png";
import teamPhoto from "@/assets/team-photo.png";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Ahmad Hilmy Febriandika",
      id: "E31241729",
      position: "left-top",
    },
    {
      name: "Febbry Chandra Wijayanti",
      id: "E31241250",
      position: "left-bottom",
    },
    {
      name: "Ade Cahyadi Enggar Anuraga",
      id: "E31241648",
      position: "right-top",
    },
    {
      name: "Nanda Laksana",
      id: "E31241361",
      position: "right-bottom",
    },
  ];

  return (
    <section id="tim" className="py-20 bg-maroon text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Photo */}
        <div className=" mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={teamPhoto}
              alt="SheCare Team"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
