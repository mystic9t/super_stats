import {
  ZodiacSign,
  DailyPrediction,
  WeeklyPrediction,
  ApiResponse,
} from "@vibes/shared-types";

interface PredictionWithFallback<T> {
  data: T;
  isFallback: boolean;
}

const DEFAULT_TIMEOUT_MS = 15_000; // 15 seconds

class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(baseUrl: string = "", timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request to ${endpoint} timed out after ${this.timeoutMs}ms`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getDailyPrediction(
    sign: ZodiacSign,
    date: string = "",
  ): Promise<PredictionWithFallback<DailyPrediction>> {
    const dateParam = date || new Date().toISOString().split("T")[0];

    const response = await this.request<
      ApiResponse<DailyPrediction> & { isFallback?: boolean }
    >(`/api/predictions?sign=${sign}&date=${dateParam}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch prediction");
    }

    return {
      data: response.data,
      isFallback: response.isFallback ?? false,
    };
  }

  async getWeeklyPrediction(
    sign: ZodiacSign,
  ): Promise<PredictionWithFallback<WeeklyPrediction>> {
    const response = await this.request<
      ApiResponse<WeeklyPrediction> & { isFallback?: boolean }
    >(`/api/predictions/weekly?sign=${sign}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch weekly prediction");
    }

    return {
      data: response.data,
      isFallback: response.isFallback ?? false,
    };
  }
}

export const apiClient = new ApiClient();
