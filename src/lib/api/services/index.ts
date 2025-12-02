// src/lib/api/services/index.ts

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
  question_text_id: string;
  question_text_en: string;
  question_type: "scale" | "boolean" | "multiple_choice";
  min_value?: number;
  max_value?: number;
  options?: string[];
  order_number: number;
  is_active: boolean;
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
  name_id: string;
  name_en: string;
  description_id: string;
  description_en: string;
  severity: "low" | "moderate" | "high" | "critical";
  recommendations_id: string;
  recommendations_en: string;
  probability?: number;
}

export interface QuestionnaireResult {
  submission_id: number;
  user_id: number;
  total_score: number;
  submitted_at: string;
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
 * Auth Service
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requireAuth: false }
    );
    return response.data!;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      { requireAuth: false }
    );
    return response.data!;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data!;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      { requireAuth: false }
    );
    return response.data!;
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password },
      { requireAuth: false }
    );
    return response.data!;
  },
};

/**
 * Questionnaire Service
 */
export const questionnaireService = {
  async getQuestions(lang: Language = "id"): Promise<Question[]> {
    const response = await apiClient.get<Question[]>(
      API_ENDPOINTS.QUESTIONNAIRE.GET_QUESTIONS,
      { params: { lang }, requireAuth: false }
    );
    return response.data!;
  },

  async submitQuestionnaire(
    data: QuestionnaireSubmit
  ): Promise<{ submission_id: number }> {
    const response = await apiClient.post<{ submission_id: number }>(
      API_ENDPOINTS.QUESTIONNAIRE.SUBMIT,
      data
    );
    return response.data!;
  },

  async getResult(
    submissionId: string,
    lang: Language = "id"
  ): Promise<QuestionnaireResult> {
    const response = await apiClient.get<QuestionnaireResult>(
      API_ENDPOINTS.QUESTIONNAIRE.GET_RESULT(submissionId),
      { params: { lang } }
    );
    return response.data!;
  },

  async getHistory(
    limit: number = 10,
    offset: number = 0,
    lang: Language = "id"
  ): Promise<HistoryResponse> {
    const response = await apiClient.get<HistoryResponse>(
      API_ENDPOINTS.QUESTIONNAIRE.HISTORY,
      { params: { limit, offset, lang } }
    );
    return response.data!;
  },

  async exportToPDF(
    submissionId: string,
    lang: Language = "id"
  ): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.QUESTIONNAIRE.EXPORT_PDF(submissionId),
      { params: { lang } }
    );
    return response.data!; // HTML string
  },

  async exportToExcel(
    submissionId: string,
    lang: Language = "id"
  ): Promise<string> {
    const response = await apiClient.get<string>(
      API_ENDPOINTS.QUESTIONNAIRE.EXPORT_EXCEL(submissionId),
      { params: { lang } }
    );
    return response.data!; // Text/CSV string
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
  // Users Management
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

  // Questions Management
  questions: {
    async getAll(lang: Language = "id"): Promise<Question[]> {
      const response = await apiClient.get<Question[]>(
        API_ENDPOINTS.ADMIN.QUESTIONS.LIST,
        { params: { lang } }
      );
      return response.data!;
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

  // Diseases Management
  diseases: {
    async getAll(): Promise<Disease[]> {
      const response = await apiClient.get<Disease[]>(
        API_ENDPOINTS.ADMIN.DISEASES.LIST
      );
      return response.data!;
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

  // History
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
 * Articles Service (External)
 */
export const articlesService = {
  async getArticles(limit: number = 10, query?: string): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ARTICLES, {
      params: { limit, q: query },
      requireAuth: false,
    });
    return response.data;
  },
};

/**
 * Maps Service (External)
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
