// src/pages/questionnaire/Questionnaire.tsx - DEBUG & FIX

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number | string>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tokenWarning, setTokenWarning] = useState(false);
  const [language] = useState<"id" | "en">(
    (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as "id" | "en") || "id"
  );

  // ✅ Store initial token to detect changes
  const initialTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      console.log("⏳ [Questionnaire] Waiting for auth...");
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log("🔍 [Questionnaire] Auth ready:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userName: user?.name,
      tokenPreview: token ? token.substring(0, 40) + "..." : "none",
    });

    if (!isAuthenticated || !token) {
      console.log("⚠️ [Questionnaire] Not authenticated, redirecting");
      navigate("/login", { state: { from: "/questionnaire" }, replace: true });
      return;
    }

    // ✅ Store initial token
    initialTokenRef.current = token;

    loadQuestions();
  }, [authLoading, isAuthenticated, user]);

  // ✅ Monitor token changes
  useEffect(() => {
    const checkToken = setInterval(() => {
      const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (initialTokenRef.current && currentToken !== initialTokenRef.current) {
        console.error("🚨 [Questionnaire] TOKEN CHANGED!");
        setTokenWarning(true);
        clearInterval(checkToken);
      }
    }, 2000);

    return () => clearInterval(checkToken);
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("📡 [Questionnaire] Fetching questions with token:", {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 40) + "...",
        fullToken: token, // ✅ DEBUG: Log full token
      });

      const data = await questionnaireService.getQuestions(language);
      console.log("📥 [Questionnaire] Received:", data.length, "questions");

      const activeQuestions = data
        .filter((q) => q.is_active === undefined || q.is_active === true)
        .sort((a, b) => a.order_number - b.order_number);

      if (activeQuestions.length === 0) {
        setError("Tidak ada pertanyaan yang tersedia saat ini.");
        return;
      }

      setQuestions(activeQuestions);
      console.log("✅ [Questionnaire] Loaded:", activeQuestions.length);
    } catch (err: any) {
      console.error("❌ [Questionnaire] Load error:", err);

      if (
        err.status === 401 ||
        err.error === "Unauthorized" ||
        err.error === "NO_TOKEN"
      ) {
        setError("Session expired. Redirecting to login...");
        // logout();
        // setTimeout(() => {
        //   navigate("/login", {
        //     state: { from: "/questionnaire" },
        //     replace: true,
        //   });
        // }, 2000);
        return;
      }

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

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 [Questionnaire] SUBMIT STARTED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // ✅ STEP 1: Verify Auth State
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    console.log("📋 [Step 1] Auth State:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 40) + "..." : "none",
      userFromStorage: userStr,
    });

    if (!isAuthenticated || !user || !token) {
      console.error("❌ [Step 1] FAILED: Not authenticated!");
      setError("Session expired. Please login again.");

      localStorage.setItem(
        "pending_questionnaire_answers",
        JSON.stringify(Array.from(answers.entries()))
      );

      // setTimeout(() => {
      //   logout();
      //   navigate("/login", {
      //     state: { from: "/questionnaire" },
      //     replace: true,
      //   });
      // }, 2000);
      return;
    }

    // ✅ STEP 2: Check Token Validity
    console.log("🔍 [Step 2] Token Details:", {
      fullToken: token,
      tokenParts: token.split(".").length, // Should be 3 for JWT
      isInitialToken: token === initialTokenRef.current,
    });

    if (token.split(".").length !== 3) {
      console.error("❌ [Step 2] FAILED: Invalid JWT format!");
      setError("Invalid token format. Please login again.");
      logout();
      // setTimeout(() => {
      //   navigate("/login", {
      //     state: { from: "/questionnaire" },
      //     replace: true,
      //   });
      // }, 2000);
      return;
    }

    // ✅ STEP 3: Prepare Payload
    const answersArray: Answer[] = Array.from(answers.entries()).map(
      ([question_id, answer_value]) => ({
        question_id,
        answer_value:
          typeof answer_value === "string"
            ? parseInt(answer_value)
            : answer_value,
      })
    );

    console.log("📦 [Step 3] Payload:", {
      language,
      answerCount: answersArray.length,
      answers: answersArray,
    });

    try {
      setSubmitting(true);
      setError("");

      // ✅ STEP 4: Submit
      console.log("📤 [Step 4] Submitting to API...");

      const result = await questionnaireService.submitQuestionnaire({
        lang: language,
        answers: answersArray,
      });

      console.log("✅ [Step 4] SUCCESS:", result);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      localStorage.removeItem("pending_questionnaire_answers");
      navigate(`/result/${result.submission_id}`, { replace: true });
    } catch (err: any) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌ [Step 4] SUBMIT FAILED");
      console.error("Error details:", {
        status: err.status,
        error: err.error,
        message: err.message,
        fullError: err,
      });
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (
        err.status === 401 ||
        err.error === "Unauthorized" ||
        err.error === "NO_TOKEN"
      ) {
        setError("Session expired. Please login again.");
        logout();
        // setTimeout(() => {
        //   navigate("/login", {
        //     state: { from: "/questionnaire" },
        //     replace: true,
        //   });
        // }, 2000);
        return;
      }

      setError(err.message || "Gagal submit jawaban. Silakan coba lagi.");
    } finally {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {authLoading
              ? "Checking authentication..."
              : "Memuat pertanyaan..."}
          </p>
        </div>
      </div>
    );
  }

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
      <nav className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3"
            >
              <img src={logoIcon} alt="SheCare Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-accent">SheCare</span>
            </button>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
              )}
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
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* ✅ Token Warning */}
        {tokenWarning && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Peringatan Keamanan</AlertTitle>
            <AlertDescription>
              Token berubah selama sesi. Untuk keamanan, silakan login ulang.
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="mt-2 w-full"
              >
                Login Ulang
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
                  disabled={!canGoNext() || submitting || tokenWarning}
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Jawaban Anda akan membantu kami memberikan analisis yang akurat.
        </p>
      </div>
    </div>
  );
};

export default Questionnaire;
