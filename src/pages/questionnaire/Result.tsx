// src/pages/questionnaire/Result.tsx - WITH REACT-TO-PRINT

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Printer,
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
  const printRef = useRef<HTMLDivElement>(null);

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

  // ✅ SIMPLE: Using react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `SheCare-Result-${submissionId}`,
    onBeforePrint: () => {
      setExporting("pdf");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setExporting(null);
    },
  });

  const handleExportExcel = async () => {
    if (!result) return;

    try {
      setExporting("excel");

      // Create CSV content
      let csv = "\ufeff"; // UTF-8 BOM for Excel
      csv += "SheCare - Hasil Analisis Kesehatan\n\n";
      csv += `Nama,${result.user_name || "N/A"}\n`;
      csv += `Tanggal,${new Date(result.submission_date).toLocaleDateString(
        "id-ID"
      )}\n`;
      csv += `Total Skor,${result.total_score}\n\n`;

      csv += "Diagnosis\n";
      if (result.diseases.length === 0) {
        csv +=
          "Hasil Normal,Tidak ditemukan indikasi kondisi kesehatan yang memerlukan perhatian khusus\n\n";
      } else {
        result.diseases.forEach((disease: Disease, index: number) => {
          csv += `${index + 1}. ${
            disease.name || disease.name_id || "Unknown"
          }\n`;
          csv += `Tingkat Keparahan,${disease.severity}\n`;
          csv += `Probabilitas,${disease.probability || "N/A"}%\n`;
          csv += `Deskripsi,"${(
            disease.description ||
            disease.description_id ||
            "N/A"
          ).replace(/"/g, '""')}"\n`;
          csv += `Rekomendasi,"${(
            disease.recommendations ||
            disease.recommendations_id ||
            "N/A"
          ).replace(/"/g, '""')}"\n\n`;
        });
      }

      csv += "Jawaban Kuisioner\n";
      csv += "No,Pertanyaan,Jawaban\n";
      result.answers.forEach((answer: any, index: number) => {
        csv += `${index + 1},"${answer.question_text.replace(/"/g, '""')}",${
          answer.answer_value
        }\n`;
      });

      // Create blob and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SheCare-Result-${submissionId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Excel exported successfully");
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
      {/* Header - NOT printed */}
      <nav className="bg-card shadow-md sticky top-0 z-50 print:hidden">
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
        {/* ✅ PRINTABLE CONTENT */}
        <div ref={printRef} className="print:p-8">
          {/* PDF Header - Only visible when printing */}
          <div className="hidden print:block text-center mb-8 border-b-4 border-pink-500 pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logoIcon} alt="SheCare" className="w-12 h-12" />
              <h1 className="text-3xl font-bold text-pink-600">SheCare</h1>
            </div>
            <h2 className="text-2xl font-semibold mt-2">
              Hasil Diagnosis Kesehatan Kewanitaan
            </h2>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-4xl font-bold text-primary mb-4 print:text-3xl print:hidden">
              Hasil Analisis Kesehatan
            </h1>
            <div className="hidden print:block mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="grid grid-cols-2 gap-2 text-sm text-left">
                <div>
                  <strong>Nama:</strong> {result.user_name || "N/A"}
                </div>
                <div>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(result.submission_date).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground print:hidden">
              Tanggal:{" "}
              {new Date(result.submission_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Score Summary */}
          <Card className="mb-8 border-2 border-primary/20 print:shadow-none print:mb-6">
            <CardHeader className="text-center">
              <CardTitle className="print:text-xl">Total Skor</CardTitle>
              <div className="text-6xl font-bold text-primary my-4 print:text-4xl print:my-2">
                {result.total_score}
              </div>
              <CardDescription className="print:text-sm">
                Berdasarkan {result.answers.length} pertanyaan
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Diseases Analysis */}
          <div className="space-y-6 mb-8 print:mb-6">
            <h2 className="text-2xl font-bold print:text-xl print:border-b-2 print:border-blue-300 print:pb-2">
              Indikasi Kondisi Kesehatan
            </h2>

            {result.diseases.length === 0 ? (
              <Alert className="print:bg-green-50 print:border-green-300">
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
                <Card
                  key={index}
                  className="overflow-hidden print:shadow-none print:border-2 print:mb-4"
                >
                  <CardHeader className={getSeverityColor(disease.severity)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl print:text-lg">
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
                  <CardContent className="pt-6 print:pt-4">
                    <div className="space-y-4 print:space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 print:text-sm">
                          <AlertCircle
                            size={18}
                            className="print:w-4 print:h-4"
                          />
                          Deskripsi
                        </h4>
                        <p className="text-muted-foreground print:text-sm print:text-gray-700">
                          {disease.description ||
                            disease.description_id ||
                            disease.description_en ||
                            "No description available"}
                        </p>
                      </div>

                      <Separator className="print:my-2" />

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 print:text-sm">
                          <CheckCircle2
                            size={18}
                            className="print:w-4 print:h-4"
                          />
                          Rekomendasi
                        </h4>
                        <p className="text-muted-foreground whitespace-pre-line print:text-sm print:text-gray-700">
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

          {/* Answers Section - Only in print */}
          <div className="hidden print:block mb-6">
            <h3 className="font-bold text-xl mb-4 text-blue-900 border-b-2 border-blue-300 pb-2">
              Jawaban Kuisioner
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left w-12">
                    No
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Pertanyaan
                  </th>
                  <th className="border border-gray-300 p-2 text-center w-24">
                    Jawaban
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.answers.map((answer: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {answer.question_text}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {answer.answer_value} / 5
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer - Only in print */}
          <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-300 text-xs text-gray-600">
            <p className="mb-2">
              <strong>Catatan Penting:</strong> Hasil ini merupakan diagnosis
              awal berdasarkan kuesioner yang diisi. Untuk diagnosis yang lebih
              akurat, silakan konsultasikan dengan dokter atau tenaga medis
              profesional.
            </p>
            <p className="text-center text-gray-500 mt-4">
              © {new Date().getFullYear()} SheCare - Women's Health Care
              Platform
            </p>
          </div>
        </div>

        {/* Actions - NOT printed */}
        <Card className="print:hidden">
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
                onClick={handlePrint}
                disabled={exporting !== null}
                className="w-full"
              >
                {exporting === "pdf" ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Opening Print...
                  </>
                ) : (
                  <>
                    <Printer className="mr-2" size={20} />
                    Print / Save as PDF
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={20} />
                    Export to Excel
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

        {/* Disclaimer - NOT printed */}
        <Alert className="mt-8 print:hidden">
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
