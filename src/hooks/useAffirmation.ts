import { useState, useCallback } from "react";
import { ZodiacSign, DailyAffirmation } from "@vibes/shared-types";
import { generateDailyAffirmation } from "@vibes/shared-utils";

interface UseAffirmationReturn {
  affirmation: DailyAffirmation | null;
  isLoading: boolean;
  fetchAffirmation: (sign: ZodiacSign) => void;
  refreshAffirmation: (sign: ZodiacSign) => void;
  clear: () => void;
}

export function useAffirmation(): UseAffirmationReturn {
  const [affirmation, setAffirmation] = useState<DailyAffirmation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAffirmation = useCallback((sign: ZodiacSign) => {
    setIsLoading(true);
    try {
      const result = generateDailyAffirmation(sign);
      setAffirmation(result);
    } catch (err) {
      console.error("Failed to generate affirmation:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh generates for "tomorrow" to get a different one (preview next day)
  const refreshAffirmation = useCallback((sign: ZodiacSign) => {
    setIsLoading(true);
    try {
      // Use a random offset date to get a different affirmation
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = generateDailyAffirmation(sign, tomorrow);
      setAffirmation(result);
    } catch (err) {
      console.error("Failed to refresh affirmation:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAffirmation(null);
  }, []);

  return {
    affirmation,
    isLoading,
    fetchAffirmation,
    refreshAffirmation,
    clear,
  };
}
