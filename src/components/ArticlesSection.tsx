import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { articlesService } from "@/lib/api/services";

interface Article {
  title: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  image?: string;
  publishedAt?: string;
  published_at?: string;
  source?: any;
  category?: string;
}

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("women health");
  const [inputValue, setInputValue] = useState("women health");
  const [limit, setLimit] = useState(12);

  const fetchArticles = async (
    query: string = searchQuery,
    itemLimit: number = limit
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log("📰 Fetching articles:", { query, limit: itemLimit });
      const response = await articlesService.getArticles(itemLimit, query);

      console.log("📥 Articles response:", response);

      let articlesData: Article[] = [];

      if (response?.articles && Array.isArray(response.articles)) {
        // Map backend structure to frontend structure
        articlesData = response.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image || article.urlToImage,
          publishedAt: article.published_at || article.publishedAt,
          source: article.source,
          category: article.category,
        }));
      }

      if (articlesData.length > 0) {
        setArticles(articlesData);
        setError(null);
      } else {
        setArticles([]);
        setError("Tidak ada artikel ditemukan");
      }
    } catch (err: any) {
      console.error("❌ Error fetching articles:", err);
      setError(err.message || "Gagal memuat artikel");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = () => {
    setSearchQuery(inputValue);
    fetchArticles(inputValue);
  };

  const handleLoadMore = () => {
    const newLimit = limit + 6;
    setLimit(newLimit);
    fetchArticles(searchQuery, newLimit);
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800";

    const colors: Record<string, string> = {
      health: "bg-pink-100 text-pink-800",
      women: "bg-red-100 text-red-800",
      wellness: "bg-purple-100 text-purple-800",
      lifestyle: "bg-blue-100 text-blue-800",
      mental: "bg-green-100 text-green-800",
      nutrition: "bg-orange-100 text-orange-800",
    };

    const key = Object.keys(colors).find((k) =>
      category.toLowerCase().includes(k)
    );
    return colors[key || ""] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Baru-baru ini";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Baru-baru ini";
      }

      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Baru-baru ini";
    }
  };

  const getImageUrl = (article: Article) => {
    return (
      article.urlToImage ||
      article.image ||
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop"
    );
  };

  const getSourceName = (article: Article) => {
    if (typeof article.source === "object" && article.source?.name) {
      return article.source.name;
    }
    if (typeof article.source === "string") {
      return article.source;
    }
    return "Unknown Source";
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return "Baca artikel lengkap untuk informasi lebih lanjut...";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <section id="artikel" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Artikel Kesehatan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Informasi terpercaya dan terkini tentang kesehatan wanita
          </p>

          <div className="max-w-xl mx-auto flex gap-2">
            <Input
              type="text"
              placeholder="Cari artikel kesehatan..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search size={18} className="mr-2" />
              Cari
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 max-w-2xl mx-auto">
            <CardContent className="p-6 flex items-start gap-3">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={24}
              />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Gagal Memuat Artikel
                </p>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fetchArticles()}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Search
                className="mx-auto mb-4 text-muted-foreground"
                size={48}
              />
              <p className="text-muted-foreground mb-4">
                Tidak ada artikel ditemukan untuk "{searchQuery}"
              </p>
              <Button
                onClick={() => {
                  setInputValue("women health");
                  setSearchQuery("women health");
                  fetchArticles("women health");
                }}
                variant="outline"
              >
                Reset Pencarian
              </Button>
            </CardContent>
          </Card>
        )}

        {articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border group"
                  style={{
                    animation: "fadeIn 0.5s ease-in",
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={getImageUrl(article)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop";
                      }}
                    />
                    {article.category && (
                      <Badge
                        className={`absolute top-4 left-4 ${getCategoryColor(
                          article.category
                        )}`}
                      >
                        {article.category}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-4 right-4 bg-white/90"
                    >
                      {getSourceName(article)}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                      {article.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[4.5rem]">
                      {truncateText(article.description || "", 120)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(
                          article.publishedAt || article.published_at
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/90 hover:bg-primary/10"
                        onClick={() => {
                          if (article.url) {
                            window.open(article.url, "_blank");
                          }
                        }}
                      >
                        Baca
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loading}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Memuat...
                  </>
                ) : (
                  "Lihat Artikel Lainnya"
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ArticlesSection;
