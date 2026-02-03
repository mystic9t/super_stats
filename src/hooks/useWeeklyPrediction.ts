import { useState } from "react";
import { WeeklyPrediction, ZodiacSign } from "@super-stats/shared-types";
import { predictionService } from "@/services";

interface UseWeeklyPredictionReturn {
  prediction: WeeklyPrediction | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (sign: ZodiacSign) => Promise<void>;
  refreshPrediction: (sign: ZodiacSign) => Promise<void>;
  clear: () => void;
}

const CACHE_KEY_PREFIX = "weekly-prediction-cache";

/**
 * Get the current week number and year for cache key
 * Format: YYYY-W## (e.g., 2026-W05)
 */
function getCurrentWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
}

/**
 * Get cache key for a weekly prediction (sign + week)
 */
function getCacheKey(sign: ZodiacSign, weekKey: string): string {
  return `${CACHE_KEY_PREFIX}-${sign}-${weekKey}`;
}

/**
 * Get cached prediction from localStorage
 */
function getCachedPrediction(
  sign: ZodiacSign,
  weekKey: string,
): WeeklyPrediction | null {
  try {
    const key = getCacheKey(sign, weekKey);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as WeeklyPrediction;
    }
  } catch (error) {
    console.error("Error reading weekly prediction cache:", error);
  }
  return null;
}

/**
 * Cache prediction to localStorage
 */
function cachePrediction(
  sign: ZodiacSign,
  weekKey: string,
  prediction: WeeklyPrediction,
): void {
  try {
    const key = getCacheKey(sign, weekKey);
    window.localStorage.setItem(key, JSON.stringify(prediction));
  } catch (error) {
    console.error("Error caching weekly prediction:", error);
  }
}

/**
 * Clear cached prediction
 */
function clearCachedPrediction(sign: ZodiacSign, weekKey: string): void {
  try {
    const key = getCacheKey(sign, weekKey);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing weekly prediction cache:", error);
  }
}

/**
 * Hook to fetch and manage weekly predictions with frontend caching
 * Cache is automatically invalidated when the week changes
 */
export function useWeeklyPrediction(): UseWeeklyPredictionReturn {
  const [prediction, setPrediction] = useState<WeeklyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    // Get current week for cache key
    const weekKey = getCurrentWeekKey();

    // Check cache first
    const cached = getCachedPrediction(sign, weekKey);
    if (cached) {
      setPrediction(cached);
      setIsLoading(false);
      return;
    }

    // Fetch from API if not cached
    const result = await predictionService.getWeeklyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      cachePrediction(sign, weekKey, result.data);
    } else {
      setError(result.error || "Failed to fetch weekly prediction");
    }

    setIsLoading(false);
  };

  const refreshPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const weekKey = getCurrentWeekKey();

    // Clear cache to force fresh fetch
    clearCachedPrediction(sign, weekKey);

    // Fetch fresh prediction from API
    const result = await predictionService.getWeeklyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      cachePrediction(sign, weekKey, result.data);
    } else {
      setError(result.error || "Failed to refresh weekly prediction");
    }

    setIsLoading(false);
  };

  const clear = () => {
    setPrediction(null);
    setError(null);
  };

  return {
    prediction,
    isLoading,
    error,
    fetchPrediction,
    refreshPrediction,
    clear,
  };
}
