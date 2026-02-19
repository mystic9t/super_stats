import {
  DailyPrediction,
  WeeklyPrediction,
  ZodiacSign,
} from "@vibes/shared-types";
import { apiClient } from "@vibes/api-client";
import { ServiceResponse } from "@/types";

class PredictionService {
  async getDailyPrediction(
    sign: ZodiacSign,
  ): Promise<ServiceResponse<DailyPrediction> & { isFallback?: boolean }> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const result = await apiClient.getDailyPrediction(sign, today);
      return {
        success: true,
        data: result.data,
        isFallback: result.isFallback,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch prediction";
      console.error("Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }

  async getPredictionForDate(
    sign: ZodiacSign,
    date: string,
  ): Promise<ServiceResponse<DailyPrediction> & { isFallback?: boolean }> {
    try {
      const result = await apiClient.getDailyPrediction(sign, date);
      return {
        success: true,
        data: result.data,
        isFallback: result.isFallback,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch prediction";
      console.error("Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }

  async getWeeklyPrediction(
    sign: ZodiacSign,
  ): Promise<ServiceResponse<WeeklyPrediction> & { isFallback?: boolean }> {
    try {
      const result = await apiClient.getWeeklyPrediction(sign);
      return {
        success: true,
        data: result.data,
        isFallback: result.isFallback,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch weekly prediction";
      console.error("Weekly Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }
}

export const predictionService = new PredictionService();
