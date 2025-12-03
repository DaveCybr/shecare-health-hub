// src/lib/api/apiClient.ts - LOGIN ERROR FIX

import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from "./config";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(
    baseURL: string = API_BASE_URL,
    timeout: number = REQUEST_TIMEOUT
  ) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  private getToken(): string | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!token) {
      console.warn("⚠️ [ApiClient] No token in localStorage");
      return null;
    }

    if (!token.includes(".")) {
      console.error("❌ [ApiClient] Invalid token format!");
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return null;
    }

    console.log(
      "🔑 [ApiClient] Token retrieved:",
      token.substring(0, 30) + "..."
    );
    return token;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      const url = new URL(endpoint);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      return url.toString();
    }

    const base = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let fullURL = `${base}${path}`;

    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      fullURL += `?${queryParams.toString()}`;
    }

    return fullURL;
  }

  private buildHeaders(requireAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (requireAuth) {
      const token = this.getToken();

      if (!token) {
        console.error("❌ [ApiClient] Auth required but no valid token found!");
        throw {
          success: false,
          message: "Session expired. Please login again.",
          error: "NO_TOKEN",
          status: 401,
        };
      }

      headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ [ApiClient] Authorization header added");
    }

    return headers;
  }

  private async handleResponse<T>(
    response: Response,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    // ✅ Handle 401 with context awareness
    if (response.status === 401) {
      console.error("❌ [ApiClient] 401 Unauthorized");

      // Parse response body to get actual error message
      let errorMessage = "Session expired. Please login again.";

      if (contentType?.includes("application/json")) {
        try {
          const data = await response.json();
          // ✅ Use backend's error message if available
          errorMessage = data.message || errorMessage;

          // ✅ Only clear token if this was an authenticated request
          // For login failures (requireAuth: false), don't clear anything
          if (requireAuth) {
            console.log("🧹 [ApiClient] Clearing invalid token");
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          } else {
            console.log("⚠️ [ApiClient] Login failed - not clearing storage");
          }

          throw {
            success: false,
            message: errorMessage,
            error: data.error || "Unauthorized",
            status: 401,
          };
        } catch (parseError) {
          // If JSON parsing fails, use default message
        }
      }

      // Default 401 handling
      if (requireAuth) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }

      throw {
        success: false,
        message: errorMessage,
        error: "Unauthorized",
        status: 401,
      };
    }

    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: data.message || "Request failed",
          error: data.error || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    }

    if (contentType?.includes("text/html")) {
      const html = await response.text();
      return { success: true, data: html as any };
    }

    if (contentType?.includes("text/plain")) {
      const text = await response.text();
      return { success: true, data: text as any };
    }

    if (contentType?.includes("application/octet-stream")) {
      const blob = await response.blob();
      return { success: true, data: blob as any };
    }

    const data = await response.json();
    return {
      success: response.ok,
      data: data.data || data,
      message: data.message,
    };
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      timeout = this.defaultTimeout,
      requireAuth = true,
      ...fetchConfig
    } = config;

    const url = this.buildURL(endpoint, params);

    let headers: HeadersInit;
    try {
      headers = this.buildHeaders(requireAuth);
    } catch (error) {
      throw error;
    }

    console.log("📡 [ApiClient] Request:", {
      method: fetchConfig.method || "GET",
      url,
      requireAuth,
      hasToken: !!this.getToken(),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: {
          ...headers,
          ...fetchConfig.headers,
        },
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      // ✅ Pass requireAuth to handleResponse for context
      return await this.handleResponse<T>(response, requireAuth);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw {
          success: false,
          message: "Request timeout",
          error: "TIMEOUT",
          status: 0,
        };
      }

      if (error.success === false) {
        throw error;
      }

      throw {
        success: false,
        message: error.message || "Network error",
        error: "NETWORK_ERROR",
        status: 0,
      };
    }
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  async downloadFile(
    endpoint: string,
    filename: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.request<Blob>(endpoint, {
      ...config,
      headers: {
        ...config?.headers,
      },
    });

    if (response.data) {
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
