// src/lib/api/services/index.ts - COMPLETE FIXED VERSION

import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../config";
import type { Language } from "../config";

/**
 * Type Definitions
 */

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role?: "user" | "admin";
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Question Types
export interface Question {
  id: number;
  question_text: string;
  question_type: "scale" | "boolean" | "multiple_choice";
  min_value?: number;
  max_value?: number;
  options?: string[];
  order_number: number;
  is_active?: boolean;
}

export interface Answer {
  question_id: number;
  answer_value: number | string | boolean;
}

export interface QuestionnaireSubmit {
  lang: Language;
  answers: Answer[];
}

// Result Types
export interface Disease {
  id: number;
  name_id?: string;
  name_en?: string;
  name?: string;
  description_id?: string;
  description_en?: string;
  description?: string;
  severity: "low" | "moderate" | "high" | "critical";
  recommendations_id?: string;
  recommendations_en?: string;
  recommendations?: string;
  probability?: number;
}

export interface QuestionnaireResult {
  submission_id: number;
  user_id: number;
  user_name?: string;
  total_score: number;
  submission_date: string;
  diseases: Disease[];
  answers: Array<{
    question_id: number;
    question_text: string;
    answer_value: number | string | boolean;
  }>;
}

// History Types
export interface HistoryItem {
  submission_id: number;
  submitted_at: string;
  total_score: number;
  primary_disease?: string;
  severity?: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Helper: Extract array from nested response
 */
function extractArray<T>(responseData: any): T[] {
  console.log("🔍 Extracting array from:", responseData);

  if (Array.isArray(responseData)) {
    console.log("✅ Direct array:", responseData.length);
    return responseData;
  }

  if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
    console.log("✅ Found nested data.data:", responseData.data.data.length);
    return responseData.data.data;
  }

  if (responseData?.data && Array.isArray(responseData.data)) {
    console.log("✅ Found data array:", responseData.data.length);
    return responseData.data;
  }

  const wrapperKeys = ["questions", "items", "results", "list"];
  for (const key of wrapperKeys) {
    if (responseData?.[key] && Array.isArray(responseData[key])) {
      console.log(`✅ Found ${key} array:`, responseData[key].length);
      return responseData[key];
    }
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData)
  ) {
    console.log("⚠️ Single object, wrapping in array");
    return [responseData];
  }

  console.warn("⚠️ Could not extract array, returning empty array");
  return [];
}

/**
 * Auth Service
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requireAuth: false }
    );

    const data = response.data?.data || response.data;

    return {
      user: data.user,
      token: data.token,
    };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      { requireAuth: false }
    );

    const data = response.data?.data || response.data;

    return {
      user: data.user,
      token: data.token,
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.ME);
    const data = response.data?.data || response.data;
    return data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      { requireAuth: false }
    );
    return { message: response.data?.message || "Success" };
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password },
      { requireAuth: false }
    );
    return { message: response.data?.message || "Success" };
  },
};

/**
 * Questionnaire Service
 */
export const questionnaireService = {
  async getQuestions(lang: Language = "id"): Promise<Question[]> {
    try {
      console.log("📡 [questionnaireService] Fetching questions...");

      const response = await apiClient.get<any>(
        API_ENDPOINTS.QUESTIONNAIRE.GET_QUESTIONS,
        { params: { lang } }
      );

      console.log("📥 [questionnaireService] Raw response:", response);

      const questions = extractArray<Question>(response.data);
      console.log(
        "✅ [questionnaireService] Parsed questions:",
        questions.length
      );

      const activeQuestions = questions.filter((q) => q.is_active !== false);
      console.log(
        "✅ [questionnaireService] Active questions:",
        activeQuestions.length
      );

      return activeQuestions;
    } catch (error) {
      console.error("❌ [questionnaireService] Get questions error:", error);
      throw error;
    }
  },

  async submitQuestionnaire(
    data: QuestionnaireSubmit
  ): Promise<{ submission_id: number }> {
    console.log("📤 [questionnaireService] Submitting questionnaire...");

    const response = await apiClient.post<any>(
      API_ENDPOINTS.QUESTIONNAIRE.SUBMIT,
      data
    );

    const result = response.data?.data || response.data;

    return {
      submission_id: result.submission_id || result.id,
    };
  },

  async getResult(
    submissionId: string,
    lang: Language = "id"
  ): Promise<QuestionnaireResult> {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.QUESTIONNAIRE.GET_RESULT(submissionId),
      { params: { lang } }
    );

    let resultData = response.data?.data || response.data;

    if (resultData) {
      resultData.diseases = extractArray<Disease>(resultData.diseases || []);
      resultData.answers = extractArray<any>(resultData.answers || []);
    }

    return resultData;
  },

  async getHistory(
    limit: number = 10,
    offset: number = 0,
    lang: Language = "id"
  ): Promise<HistoryResponse> {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.QUESTIONNAIRE.HISTORY,
      { params: { limit, offset, lang } }
    );

    const data = response.data?.data || response.data || {};

    return {
      data: extractArray<HistoryItem>(data.data || data),
      total: data.total || data.count || 0,
      limit: data.limit || limit,
      offset: data.offset || offset,
    };
  },

  async exportToPDF(
    submissionId: string,
    lang: Language = "id"
  ): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.QUESTIONNAIRE.EXPORT_PDF(submissionId),
      { params: { lang } }
    );
    return response.data!;
  },

  async exportToExcel(
    submissionId: string,
    lang: Language = "id"
  ): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.QUESTIONNAIRE.EXPORT_EXCEL(submissionId),
      { params: { lang } }
    );
    return response.data!;
  },

  async exportHistory(lang: Language = "id"): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.QUESTIONNAIRE.EXPORT_HISTORY,
      { params: { lang } }
    );
    return response.data!;
  },
};

/**
 * Admin Service
 */
export const adminService = {
  users: {
    async getAll(limit: number = 10, offset: number = 0): Promise<any> {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS.LIST, {
        params: { limit, offset },
      });
      return response.data;
    },

    async getDetail(userId: string): Promise<User> {
      const response = await apiClient.get<User>(
        API_ENDPOINTS.ADMIN.USERS.DETAIL(userId)
      );
      return response.data!;
    },

    async delete(userId: string): Promise<{ message: string }> {
      const response = await apiClient.delete<{ message: string }>(
        API_ENDPOINTS.ADMIN.USERS.DELETE(userId)
      );
      return response.data!;
    },
  },

  questions: {
    async getAll(lang: Language = "id"): Promise<Question[]> {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.ADMIN.QUESTIONS.LIST,
        { params: { lang } }
      );
      return extractArray<Question>(response.data);
    },

    async create(questionData: Partial<Question>): Promise<Question> {
      const response = await apiClient.post<Question>(
        API_ENDPOINTS.ADMIN.QUESTIONS.CREATE,
        questionData
      );
      return response.data!;
    },

    async update(
      questionId: string,
      questionData: Partial<Question>
    ): Promise<Question> {
      const response = await apiClient.put<Question>(
        API_ENDPOINTS.ADMIN.QUESTIONS.UPDATE(questionId),
        questionData
      );
      return response.data!;
    },

    async delete(questionId: string): Promise<{ message: string }> {
      const response = await apiClient.delete<{ message: string }>(
        API_ENDPOINTS.ADMIN.QUESTIONS.DELETE(questionId)
      );
      return response.data!;
    },
  },

  diseases: {
    async getAll(): Promise<Disease[]> {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.ADMIN.DISEASES.LIST
      );
      return extractArray<Disease>(response.data);
    },

    async create(diseaseData: Partial<Disease>): Promise<Disease> {
      const response = await apiClient.post<Disease>(
        API_ENDPOINTS.ADMIN.DISEASES.CREATE,
        diseaseData
      );
      return response.data!;
    },

    async update(
      diseaseId: string,
      diseaseData: Partial<Disease>
    ): Promise<Disease> {
      const response = await apiClient.put<Disease>(
        API_ENDPOINTS.ADMIN.DISEASES.UPDATE(diseaseId),
        diseaseData
      );
      return response.data!;
    },

    async delete(diseaseId: string): Promise<{ message: string }> {
      const response = await apiClient.delete<{ message: string }>(
        API_ENDPOINTS.ADMIN.DISEASES.DELETE(diseaseId)
      );
      return response.data!;
    },
  },

  async getHistory(
    limit: number = 20,
    offset: number = 0,
    lang: Language = "id"
  ): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.HISTORY, {
      params: { limit, offset, lang },
    });
    return response.data;
  },
};

/**
 * Statistics Service
 */
export const statisticsService = {
  async getDiseaseStats(lang: Language = "id"): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.STATISTICS.DISEASES, {
      params: { lang },
      requireAuth: false,
    });
    return response.data;
  },

  async getSummary(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.STATISTICS.SUMMARY, {
      requireAuth: false,
    });
    return response.data;
  },
};

/**
 * Articles Service - FIXED FOR NESTED STRUCTURE
 */
export const articlesService = {
  async getArticles(limit: number = 10, query?: string): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ARTICLES, {
      params: { limit, q: query },
      requireAuth: false,
    });

    console.log("📥 Raw articles response:", response);

    let articlesData = response.data as any;

    // Handle deeply nested structure: { data: { data: { articles: [...] } } }
    if (articlesData?.data?.data?.articles) {
      return {
        articles: articlesData.data.data.articles,
        count: articlesData.count || articlesData.data.data.articles.length,
        message: articlesData.data.data.message,
      };
    } else if (articlesData?.data?.articles) {
      return {
        articles: articlesData.data.articles,
        count: articlesData.count || articlesData.data.articles.length,
      };
    } else if (articlesData?.articles) {
      return {
        articles: articlesData.articles,
        count: articlesData.count || articlesData.articles.length,
      };
    } else if (Array.isArray(articlesData?.data)) {
      return {
        articles: articlesData.data,
        count: articlesData.count || articlesData.data.length,
      };
    } else if (Array.isArray(articlesData)) {
      return {
        articles: articlesData,
        count: articlesData.length,
      };
    }

    return {
      articles: [],
      count: 0,
    };
  },
};

/**
 * Maps Service
 */
export const mapsService = {
  async getNearbyClinic(
    lat: number,
    lng: number,
    radius: number = 5000
  ): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.MAPS.CLINICS, {
      params: { lat, lng, radius },
      requireAuth: false,
    });
    return response.data;
  },
};
