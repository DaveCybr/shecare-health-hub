// src/pages/questionnaire/Result.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  questionnaireService,
  type QuestionnaireResult,
  type Disease,
} from "@/lib/api/services";
import { STORAGE_KEYS } from "@/lib/api/config";
import logoIcon from "@/assets/logo-icon.png";

const Result = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [language] = useState<"id" | "en">(
    (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as "id" | "en") || "id"
  );

  useEffect(() => {
    if (submissionId) {
      loadResult();
    }
  }, [submissionId]);

  const loadResult = async () => {
    try {
      setLoading(true);
      setError("");

      if (!submissionId) {
        throw new Error("Submission ID tidak ditemukan");
      }

      const data = await questionnaireService.getResult(submissionId, language);
      setResult(data);
      console.log("✅ Result loaded:", data);
    } catch (err: any) {
      console.error("❌ Failed to load result:", err);
      setError(err.message || "Gagal memuat hasil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting("pdf");
      const htmlContent = await questionnaireService.exportToPDF(
        submissionId!,
        language
      );

      // Create new window with HTML content
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        // Trigger print dialog
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (err: any) {
      console.error("❌ PDF export failed:", err);
      alert("Gagal export PDF. Silakan coba lagi.");
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting("excel");
      const csvContent = await questionnaireService.exportToExcel(
        submissionId!,
        language
      );

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shecare-result-${submissionId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("❌ Excel export failed:", err);
      alert("Gagal export Excel. Silakan coba lagi.");
    } finally {
      setExporting(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      low: "Rendah",
      moderate: "Sedang",
      high: "Tinggi",
      critical: "Kritis",
    };
    return labels[severity] || severity;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Memuat hasil analisis...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Hasil tidak ditemukan"}
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-3">
              <Button onClick={loadResult} className="w-full">
                Coba Lagi
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/history")}
                className="w-full"
              >
                Lihat Riwayat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-3">
              <img src={logoIcon} alt="SheCare Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-accent">SheCare</span>
            </a>
            <Button
              variant="ghost"
              onClick={() => navigate("/history")}
              className="flex items-center gap-2"
            >
              <FileText size={20} />
              Riwayat
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Hasil Analisis Kesehatan
          </h1>
          <p className="text-muted-foreground">
            Tanggal:{" "}
            {new Date(result.submitted_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Score Summary */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Total Skor</CardTitle>
            <div className="text-6xl font-bold text-primary my-4">
              {result.total_score}
            </div>
            <CardDescription>
              Berdasarkan {result.answers.length} pertanyaan
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Diseases Analysis */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Indikasi Kondisi Kesehatan</h2>

          {result.diseases.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-5 w-5" />
              <AlertDescription>
                <strong>Hasil Normal</strong>
                <p className="mt-2">
                  Tidak ditemukan indikasi kondisi kesehatan yang memerlukan
                  perhatian khusus. Tetap jaga pola hidup sehat!
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            result.diseases.map((disease: Disease, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className={getSeverityColor(disease.severity)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {disease.name ||
                          disease.name_id ||
                          disease.name_en ||
                          "Unknown Disease"}
                      </CardTitle>
                      {disease.probability && (
                        <p className="text-sm mt-1">
                          Tingkat kemungkinan: {disease.probability}%
                        </p>
                      )}
                    </div>
                    <Badge className={getSeverityColor(disease.severity)}>
                      {getSeverityLabel(disease.severity)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Deskripsi
                      </h4>
                      <p className="text-muted-foreground">
                        {disease.description ||
                          disease.description_id ||
                          disease.description_en ||
                          "No description available"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Rekomendasi
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {disease.recommendations ||
                          disease.recommendations_id ||
                          disease.recommendations_en ||
                          "No recommendations available"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
            <CardDescription>
              Export hasil atau lakukan analisis ulang
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={exporting !== null}
                className="w-full"
              >
                {exporting === "pdf" ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={20} />
                    Export PDF
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleExportExcel}
                disabled={exporting !== null}
                className="w-full"
              >
                {exporting === "excel" ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={20} />
                    Export Excel
                  </>
                )}
              </Button>
            </div>

            <Separator />

            <Button
              onClick={() => navigate("/questionnaire")}
              className="w-full"
            >
              Mulai Analisis Baru
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/history")}
              className="w-full"
            >
              Lihat Riwayat Lengkap
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-8">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            <strong>Disclaimer:</strong> Hasil analisis ini bersifat indikatif
            dan tidak menggantikan diagnosis medis profesional. Konsultasikan
            dengan dokter untuk diagnosis yang akurat.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Result;
