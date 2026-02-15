import { useState } from "react";
import { WeeklyPrediction, ZodiacSign } from "@vibes/shared-types";
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

function getCurrentWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
}

function getCacheKey(sign: ZodiacSign, weekKey: string): string {
  return `${CACHE_KEY_PREFIX}-${sign}-${weekKey}`;
}

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

function clearCachedPrediction(sign: ZodiacSign, weekKey: string): void {
  try {
    const key = getCacheKey(sign, weekKey);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing weekly prediction cache:", error);
  }
}

export function useWeeklyPrediction(): UseWeeklyPredictionReturn {
  const [prediction, setPrediction] = useState<WeeklyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const weekKey = getCurrentWeekKey();

    const cached = getCachedPrediction(sign, weekKey);
    if (cached) {
      setPrediction(cached);
      setIsLoading(false);
      return;
    }

    const result = await predictionService.getWeeklyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      if (!result.isFallback) {
        cachePrediction(sign, weekKey, result.data);
      }
    } else {
      setError(result.error || "Failed to fetch weekly prediction");
    }

    setIsLoading(false);
  };

  const refreshPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const weekKey = getCurrentWeekKey();

    clearCachedPrediction(sign, weekKey);

    const result = await predictionService.getWeeklyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      if (!result.isFallback) {
        cachePrediction(sign, weekKey, result.data);
      }
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
