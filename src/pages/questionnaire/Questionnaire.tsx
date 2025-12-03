// src/pages/questionnaire/Questionnaire.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import {
  questionnaireService,
  type Question,
  type Answer,
} from "@/lib/api/services";
import { STORAGE_KEYS } from "@/lib/api/config";
import logoIcon from "@/assets/logo-icon.png";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number | string>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [language] = useState<"id" | "en">(
    (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as "id" | "en") || "id"
  );

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [language]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await questionnaireService.getQuestions(language);
      console.log("📥 Fetched questions:", data.length);

      // Filter only active questions and sort by order
      const activeQuestions = data
        .filter((q) => q.is_active === undefined || q.is_active === true)
        .sort((a, b) => a.order_number - b.order_number);

      if (activeQuestions.length === 0) {
        setError("Tidak ada pertanyaan yang tersedia saat ini.");
        return;
      }

      setQuestions(activeQuestions);
      console.log("✅ Loaded questions:", activeQuestions.length);
    } catch (err: any) {
      console.error("❌ Failed to load questions:", err);
      setError(err.message || "Gagal memuat pertanyaan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: number | string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, value);
    setAnswers(newAnswers);
  };

  const canGoNext = () => {
    return answers.has(currentQuestion?.id);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.size < questions.length) {
      setError("Mohon jawab semua pertanyaan sebelum submit.");
      return;
    }

    // Check if user is logged in
    if (!isAuthenticated) {
      // Save answers to localStorage and redirect to login
      localStorage.setItem(
        "pending_questionnaire_answers",
        JSON.stringify(Array.from(answers.entries()))
      );
      navigate("/login", { state: { from: "/questionnaire" } });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Convert Map to API format
      const answersArray: Answer[] = Array.from(answers.entries()).map(
        ([question_id, answer_value]) => ({
          question_id,
          answer_value:
            typeof answer_value === "string"
              ? parseInt(answer_value)
              : answer_value,
        })
      );

      console.log("📤 Submitting answers:", answersArray);

      const result = await questionnaireService.submitQuestionnaire({
        lang: language,
        answers: answersArray,
      });

      console.log("✅ Submission successful:", result);

      // Clear pending answers
      localStorage.removeItem("pending_questionnaire_answers");

      // Redirect to result page
      navigate(`/result/${result.submission_id}`);
    } catch (err: any) {
      console.error("❌ Submission failed:", err);
      setError(err.message || "Gagal submit jawaban. Silakan coba lagi.");
      setSubmitting(false);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const currentAnswer = answers.get(currentQuestion.id);

    switch (currentQuestion.question_type) {
      case "scale":
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentQuestion.min_value}</span>
              <span className="font-semibold text-lg text-primary">
                {currentAnswer || currentQuestion.min_value}
              </span>
              <span>{currentQuestion.max_value}</span>
            </div>

            <Slider
              min={currentQuestion.min_value || 1}
              max={currentQuestion.max_value || 5}
              step={1}
              value={[
                (currentAnswer as number) || currentQuestion.min_value || 1,
              ]}
              onValueChange={(value) => handleAnswer(value[0])}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tidak sama sekali</span>
              <span>Sangat sering</span>
            </div>
          </div>
        );

      case "boolean":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="1" id="yes" />
                <Label htmlFor="yes" className="flex-1 cursor-pointer">
                  Ya
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="0" id="no" />
                <Label htmlFor="no" className="flex-1 cursor-pointer">
                  Tidak
                </Label>
              </div>
            </div>
          </RadioGroup>
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswer(value)}
          >
            <div className="flex flex-col space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      default:
        return <p className="text-muted-foreground">Unknown question type</p>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 space-y-3">
              <Button onClick={loadQuestions} className="w-full">
                Coba Lagi
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
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
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Kembali
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentQuestion?.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderQuestionInput()}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || submitting}
                className="flex-1"
              >
                <ArrowLeft size={20} className="mr-2" />
                Sebelumnya
              </Button>

              {currentIndex < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext() || submitting}
                  className="flex-1"
                >
                  Selanjutnya
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canGoNext() || submitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <Send size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Helper Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {!isAuthenticated && (
            <span className="block mb-2 text-yellow-600">
              ⚠️ Anda belum login. Jawaban akan disimpan setelah login.
            </span>
          )}
          Jawaban Anda akan membantu kami memberikan analisis yang akurat.
        </p>
      </div>
    </div>
  );
};

export default Questionnaire;
