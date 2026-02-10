import { useState } from "react";
import { MonthlyPrediction, ZodiacSign } from "@vibes/shared-types";
import { predictionService } from "@/services";

interface UseMonthlyPredictionReturn {
  prediction: MonthlyPrediction | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (sign: ZodiacSign) => Promise<void>;
  refreshPrediction: (sign: ZodiacSign) => Promise<void>;
  clear: () => void;
}

const CACHE_KEY_PREFIX = "monthly-prediction-cache";

/**
 * Get the current month and year for cache key
 * Format: YYYY-MM (e.g., 2026-02)
 */
function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
}

/**
 * Get cache key for a monthly prediction (sign + month)
 */
function getCacheKey(sign: ZodiacSign, monthKey: string): string {
  return `${CACHE_KEY_PREFIX}-${sign}-${monthKey}`;
}

/**
 * Get cached prediction from localStorage
 */
function getCachedPrediction(
  sign: ZodiacSign,
  monthKey: string,
): MonthlyPrediction | null {
  try {
    const key = getCacheKey(sign, monthKey);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as MonthlyPrediction;
    }
  } catch (error) {
    console.error("Error reading monthly prediction cache:", error);
  }
  return null;
}

/**
 * Cache prediction to localStorage
 */
function cachePrediction(
  sign: ZodiacSign,
  monthKey: string,
  prediction: MonthlyPrediction,
): void {
  try {
    const key = getCacheKey(sign, monthKey);
    window.localStorage.setItem(key, JSON.stringify(prediction));
  } catch (error) {
    console.error("Error caching monthly prediction:", error);
  }
}

/**
 * Clear cached prediction
 */
function clearCachedPrediction(sign: ZodiacSign, monthKey: string): void {
  try {
    const key = getCacheKey(sign, monthKey);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing monthly prediction cache:", error);
  }
}

/**
 * Hook to fetch and manage monthly predictions with frontend caching
 * Cache is automatically invalidated when the month changes
 */
export function useMonthlyPrediction(): UseMonthlyPredictionReturn {
  const [prediction, setPrediction] = useState<MonthlyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    // Get current month for cache key
    const monthKey = getCurrentMonthKey();

    // Check cache first
    const cached = getCachedPrediction(sign, monthKey);
    if (cached) {
      setPrediction(cached);
      setIsLoading(false);
      return;
    }

    // Fetch from API if not cached
    const result = await predictionService.getMonthlyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      cachePrediction(sign, monthKey, result.data);
    } else {
      setError(result.error || "Failed to fetch monthly prediction");
    }

    setIsLoading(false);
  };

  const refreshPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const monthKey = getCurrentMonthKey();

    // Clear cache to force fresh fetch
    clearCachedPrediction(sign, monthKey);

    // Fetch fresh prediction from API
    const result = await predictionService.getMonthlyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      cachePrediction(sign, monthKey, result.data);
    } else {
      setError(result.error || "Failed to refresh monthly prediction");
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
