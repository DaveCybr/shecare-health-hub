import { Calendar, Eye, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  views: number;
  comments: number;
  date: string;
  readTime: string;
}

const ImprovedArticlesSection = () => {
  const articles: Article[] = [
    {
      id: "1",
      title: "Pentingnya Menjaga Kesehatan Reproduksi bagi Wanita Sejak Dini",
      excerpt:
        "Kesehatan reproduksi adalah fondasi penting untuk kesejahteraan wanita di segala usia...",
      category: "Kesehatan Reproduksi",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
      views: 1234,
      comments: 23,
      date: "2024-11-20",
      readTime: "5 menit",
    },
    {
      id: "2",
      title: "Cara Mengatasi Nyeri Haid Secara Alami dan Efektif",
      excerpt:
        "Nyeri haid atau dismenore adalah kondisi yang dialami banyak wanita. Berikut cara mengatasinya...",
      category: "Menstruasi",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400",
      views: 2156,
      comments: 45,
      date: "2024-11-18",
      readTime: "6 menit",
    },
    {
      id: "3",
      title: "Ciri-Ciri dan Pencegahan Kanker Serviks yang Perlu Diketahui",
      excerpt:
        "Kanker serviks adalah salah satu penyakit yang dapat dicegah dengan deteksi dini...",
      category: "Pencegahan Penyakit",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400",
      views: 3421,
      comments: 67,
      date: "2024-11-15",
      readTime: "8 menit",
    },
    {
      id: "4",
      title: "Dampak Kurang Tidur terhadap Hormon dan Kesehatan Kulit",
      excerpt:
        "Kurang tidur tidak hanya membuat lelah, tapi juga mempengaruhi keseimbangan hormon...",
      category: "Gaya Hidup",
      image:
        "https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=400",
      views: 1876,
      comments: 34,
      date: "2024-11-12",
      readTime: "5 menit",
    },
    {
      id: "5",
      title: "Bahaya Stres Berlebih terhadap Siklus Menstruasi",
      excerpt:
        "Stres kronis dapat mengganggu siklus menstruasi dan kesehatan reproduksi secara keseluruhan...",
      category: "Mental Health",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
      views: 2543,
      comments: 56,
      date: "2024-11-10",
      readTime: "7 menit",
    },
    {
      id: "6",
      title: "Peran Nutrisi dalam Menjaga Keseimbangan Hormon",
      excerpt:
        "Makanan yang tepat dapat membantu menjaga keseimbangan hormon dan kesehatan optimal...",
      category: "Nutrisi",
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
      views: 1987,
      comments: 41,
      date: "2024-11-08",
      readTime: "6 menit",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Kesehatan Reproduksi": "bg-pink-100 text-pink-800",
      Menstruasi: "bg-red-100 text-red-800",
      "Pencegahan Penyakit": "bg-purple-100 text-purple-800",
      "Gaya Hidup": "bg-blue-100 text-blue-800",
      "Mental Health": "bg-green-100 text-green-800",
      Nutrisi: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="artikel" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Artikel Kesehatan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Informasi terpercaya dan terkini tentang kesehatan wanita dari para
            ahli
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="bg-card rounded-2xl overflow-hidden shadow-md card-hover border border-border animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge
                  className={`absolute top-4 left-4 ${getCategoryColor(
                    article.category
                  )}`}
                >
                  {article.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {article.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {article.comments}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {article.readTime}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(article.date)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/90"
                  >
                    Baca Selengkapnya
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Lihat Artikel Lainnya
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ImprovedArticlesSection;
