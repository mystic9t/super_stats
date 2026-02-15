import {
  ZodiacSign,
  DailyPrediction,
  WeeklyPrediction,
  MonthlyPrediction,
  ApiResponse,
  HealthCheckResponse,
  NumerologyPrediction,
} from "@vibes/shared-types";

interface PredictionWithFallback<T> {
  data: T;
  isFallback: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
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

  async getMonthlyPrediction(sign: ZodiacSign): Promise<MonthlyPrediction> {
    const response = await this.request<ApiResponse<MonthlyPrediction>>(
      `/api/predictions/monthly?sign=${sign}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch monthly prediction");
    }

    return response.data;
  }

  async getNumerologyPrediction(
    lifePath: number,
    destiny: number,
  ): Promise<NumerologyPrediction> {
    const response = await this.request<ApiResponse<NumerologyPrediction>>(
      `/api/numerology?lifePath=${lifePath}&destiny=${destiny}`,
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error || "Failed to fetch numerology prediction",
      );
    }
    return response.data;
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return await this.request<HealthCheckResponse>("/health");
  }
}

export const apiClient = new ApiClient();
