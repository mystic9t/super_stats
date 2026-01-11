import {
  ZodiacSign,
  DailyPrediction,
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
    day: "yesterday" | "today" | "tomorrow" = "today",
  ): Promise<DailyPrediction> {
    const response = await this.request<ApiResponse<DailyPrediction>>(
      `/api/predictions?sign=${sign}&day=${day}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch prediction");
    }

    return response.data;
  }

  async getNumerologyPrediction(lifePath: number, destiny: number): Promise<NumerologyPrediction> {
    const response = await this.request<ApiResponse<NumerologyPrediction>>(
      `/api/numerology?lifePath=${lifePath}&destiny=${destiny}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch numerology prediction");
    }
    return response.data;
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return await this.request<HealthCheckResponse>("/health");
  }
}

export const apiClient = new ApiClient();
