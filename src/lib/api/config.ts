// src/lib/api/config.ts// src/lib/api/config.ts

export const API_BASE_URL = "/api";

// ✅ Endpoint TIDAK pakai ${API_BASE_URL}, hanya path saja
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register", // ✅ Relative path
    LOGIN: "/auth/login", // ✅ Relative path
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  QUESTIONNAIRE: {
    GET_QUESTIONS: "/questions",
    SUBMIT: "/questionnaire/submit",
    GET_RESULT: (id: string) => `/questionnaire/result/${id}`,
    HISTORY: "/questionnaire/history",
    EXPORT_PDF: (id: string) => `/questionnaire/export/pdf/${id}`,
    EXPORT_EXCEL: (id: string) => `/questionnaire/export/excel/${id}`,
    EXPORT_HISTORY: "/questionnaire/export/history",
  },

  ADMIN: {
    USERS: {
      LIST: "/admin/users",
      DETAIL: (id: string) => `/admin/users/${id}`,
      DELETE: (id: string) => `/admin/users/${id}`,
    },
    HISTORY: "/admin/history",
    QUESTIONS: {
      LIST: "/admin/questions",
      CREATE: "/admin/questions",
      UPDATE: (id: string) => `/admin/questions/${id}`,
      DELETE: (id: string) => `/admin/questions/${id}`,
    },
    DISEASES: {
      LIST: "/admin/diseases",
      CREATE: "/admin/diseases",
      UPDATE: (id: string) => `/admin/diseases/${id}`,
      DELETE: (id: string) => `/admin/diseases/${id}`,
    },
  },

  ARTICLES: "/articles",
  MAPS: {
    CLINICS: "/maps/clinics",
  },

  STATISTICS: {
    DISEASES: "/statistics/diseases",
    SUMMARY: "/statistics/summary",
  },

  HEALTH: "/health",
} as const;

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: "shecare_token",
  USER: "shecare_user",
  LANGUAGE: "shecare_lang",
} as const;

// Default language
export const DEFAULT_LANGUAGE = "id";

// Supported languages
export const SUPPORTED_LANGUAGES = ["id", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
