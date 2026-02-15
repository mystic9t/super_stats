import { useState } from "react";
import { DailyPrediction, ZodiacSign } from "@vibes/shared-types";
import { predictionService } from "@/services";

interface UseDailyPredictionReturn {
  prediction: DailyPrediction | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: (sign: ZodiacSign) => Promise<void>;
  refreshPrediction: (sign: ZodiacSign) => Promise<void>;
  clear: () => void;
}

const CACHE_KEY_PREFIX = "prediction-cache";

function getCacheKey(sign: ZodiacSign, date: string): string {
  return `${CACHE_KEY_PREFIX}-${sign}-${date}`;
}

function getCachedPrediction(
  sign: ZodiacSign,
  date: string,
): DailyPrediction | null {
  try {
    const key = getCacheKey(sign, date);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as DailyPrediction;
    }
  } catch (error) {
    console.error("Error reading prediction cache:", error);
  }
  return null;
}

function cachePrediction(
  sign: ZodiacSign,
  date: string,
  prediction: DailyPrediction,
): void {
  try {
    const key = getCacheKey(sign, date);
    window.localStorage.setItem(key, JSON.stringify(prediction));
  } catch (error) {
    console.error("Error caching prediction:", error);
  }
}

function clearCachedPrediction(sign: ZodiacSign, date: string): void {
  try {
    const key = getCacheKey(sign, date);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing prediction cache:", error);
  }
}

export function useDailyPrediction(): UseDailyPredictionReturn {
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const today = new Date().toISOString().split("T")[0];

    const cached = getCachedPrediction(sign, today);
    if (cached) {
      setPrediction(cached);
      setIsLoading(false);
      return;
    }

    const result = await predictionService.getDailyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      if (!result.isFallback) {
        cachePrediction(sign, today, result.data);
      }
    } else {
      setError(result.error || "Failed to fetch prediction");
    }

    setIsLoading(false);
  };

  const refreshPrediction = async (sign: ZodiacSign) => {
    setIsLoading(true);
    setError(null);

    const today = new Date().toISOString().split("T")[0];

    clearCachedPrediction(sign, today);

    const result = await predictionService.getDailyPrediction(sign);
    if (result.success && result.data) {
      setPrediction(result.data);
      if (!result.isFallback) {
        cachePrediction(sign, today, result.data);
      }
    } else {
      setError(result.error || "Failed to refresh prediction");
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
