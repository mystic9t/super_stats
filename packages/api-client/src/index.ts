import {
  ZodiacSign,
  DailyPrediction,
  WeeklyPrediction,
  MonthlyPrediction,
  ApiResponse,
  HealthCheckResponse,
  NumerologyPrediction,
} from "@super-stats/shared-types";

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
  ): Promise<DailyPrediction> {
    // Date should be in YYYY-MM-DD format, defaults to today
    const dateParam = date || new Date().toISOString().split("T")[0];

    const response = await this.request<ApiResponse<DailyPrediction>>(
      `/api/predictions?sign=${sign}&date=${dateParam}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch prediction");
    }

    return response.data;
  }

  async getWeeklyPrediction(sign: ZodiacSign): Promise<WeeklyPrediction> {
    const response = await this.request<ApiResponse<WeeklyPrediction>>(
      `/api/predictions/weekly?sign=${sign}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch weekly prediction");
    }

    return response.data;
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
