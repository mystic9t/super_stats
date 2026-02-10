import {
  DailyPrediction,
  WeeklyPrediction,
  MonthlyPrediction,
  ZodiacSign,
} from "@vibes/shared-types";
import { apiClient } from "@vibes/api-client";
import { ServiceResponse } from "@/types";

class PredictionService {
  /**
   * Fetch daily prediction for a zodiac sign for today's date
   */
  async getDailyPrediction(
    sign: ZodiacSign,
  ): Promise<ServiceResponse<DailyPrediction>> {
    try {
      // Send explicit date in YYYY-MM-DD format to avoid timezone issues
      const today = new Date().toISOString().split("T")[0];
      const prediction = await apiClient.getDailyPrediction(sign, today);
      return { success: true, data: prediction };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch prediction";
      console.error("Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }

  /**
   * Fetch prediction for a specific date
   */
  async getPredictionForDate(
    sign: ZodiacSign,
    date: string,
  ): Promise<ServiceResponse<DailyPrediction>> {
    try {
      const prediction = await apiClient.getDailyPrediction(sign, date);
      return { success: true, data: prediction };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch prediction";
      console.error("Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }

  /**
   * Fetch weekly prediction for a zodiac sign
   */
  async getWeeklyPrediction(
    sign: ZodiacSign,
  ): Promise<ServiceResponse<WeeklyPrediction>> {
    try {
      const prediction = await apiClient.getWeeklyPrediction(sign);
      return { success: true, data: prediction };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch weekly prediction";
      console.error("Weekly Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }

  /**
   * Fetch monthly prediction for a zodiac sign
   */
  async getMonthlyPrediction(
    sign: ZodiacSign,
  ): Promise<ServiceResponse<MonthlyPrediction>> {
    try {
      const prediction = await apiClient.getMonthlyPrediction(sign);
      return { success: true, data: prediction };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch monthly prediction";
      console.error("Monthly Prediction Service Error:", message);
      return { success: false, error: message };
    }
  }
}

export const predictionService = new PredictionService();
