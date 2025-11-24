import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapSection = () => {
  const handleViewMap = () => {
    // Open Google Maps with health facilities filter
    window.open(
      "https://www.google.com/maps/search/klinik+kesehatan+wanita+jember",
      "_blank"
    );
  };

  return (
    <section id="lokasi" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text & CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Temukan Klinik Terdekat
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Akses mudah ke fasilitas kesehatan wanita di sekitar Anda. Kami
              membantu Anda menemukan puskesmas, klinik, dan rumah sakit yang
              menyediakan layanan kesehatan reproduksi.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold mb-1">Puskesmas & Klinik</h3>
                  <p className="text-sm text-muted-foreground">
                    Layanan konsultasi, pemeriksaan rutin, dan KB
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold mb-1">Rumah Sakit</h3>
                  <p className="text-sm text-muted-foreground">
                    Layanan spesialis kandungan dan kebidanan
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleViewMap}
              size="lg"
              className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MapPin size={20} className="mr-2" />
              Lihat Peta Lengkap
            </Button>
          </div>

          {/* Right Side - Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63161.84152887451!2d113.66806042167967!3d-8.166498699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695b617d8f623%3A0xf6c4437632474338!2sJember%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SheCare Health Facilities Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
