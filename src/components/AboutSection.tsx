const AboutSection = () => {
  return (
    <section id="tentang" className="py-20 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Tentang SheCare</h2>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground">
            <p>
              SheCare adalah platform kesehatan digital yang didedikasikan untuk perempuan Indonesia. 
              Kami memahami bahwa setiap perempuan memiliki kebutuhan kesehatan yang unik dan memerlukan 
              akses yang mudah ke informasi dan layanan kesehatan yang berkualitas.
            </p>
            <p>
              Dengan SheCare, Anda dapat berkonsultasi dengan profesional kesehatan, mengakses artikel edukatif, 
              dan mengelola kesehatan Anda dengan lebih baik - semuanya dalam satu platform yang aman dan terpercaya.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary pt-4">
              Kesehatan Anda, Prioritas Kami
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
