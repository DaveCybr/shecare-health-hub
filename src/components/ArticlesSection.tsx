const ArticlesSection = () => {
  const articles = [
    {
      title: 'Pentingnya Menjaga Kesehatan Reproduksi bagi Wanita Sejak Dini',
    },
    {
      title: 'Cara Mengatasi Nyeri Haid Secara Alami dan Efektif',
    },
    {
      title: 'Ciri-Ciri dan Pencegahan Kanker Serviks yang Perlu Diketahui Wanita',
    },
    {
      title: 'Dampak Kurang Tidur terhadap Hormon dan Kesehatan Kulit Wanita',
    },
    {
      title: 'Bahaya Stres Berlebih terhadap Siklus Menstruasi',
    },
    {
      title: 'Peran Nutrisi dalam Menjaga Keseimbangan Hormon Wanita',
    },
  ];

  return (
    <section id="artikel" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Artikel Kesehatan
          </h2>
          <p className="text-lg text-muted-foreground">
            Informasi terpercaya untuk kesehatan Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-md card-hover border-2 border-border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-center h-full">
                <h3 className="text-lg md:text-xl font-semibold text-foreground text-center leading-relaxed">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
