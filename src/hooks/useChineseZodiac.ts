import { useState, useCallback } from "react";
import { ChineseZodiacReading } from "@vibes/shared-types";
import {
  calculateChineseZodiac,
  getChineseZodiacReading,
} from "@vibes/shared-utils";
import { UserProfile } from "@vibes/shared-types";

interface UseChineseZodiacReturn {
  reading: ChineseZodiacReading | null;
  chineseYear: string | null;
  element: string | null;
  isLoading: boolean;
  error: string | null;
  fetchReading: (profile: UserProfile) => Promise<void>;
  refreshReading: (profile: UserProfile) => Promise<void>;
  clear: () => void;
}

export function useChineseZodiac(): UseChineseZodiacReturn {
  const [reading, setReading] = useState<ChineseZodiacReading | null>(null);
  const [chineseYear, setChineseYear] = useState<string | null>(null);
  const [element, setElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReading = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const chineseProfile = calculateChineseZodiac(
        new Date(profile.dateOfBirth),
      );
      const zodiacReading = getChineseZodiacReading(chineseProfile.sign);
      setReading(zodiacReading);
      setChineseYear(chineseProfile.chineseYear);
      setElement(chineseProfile.element); // Use the calculated specific element
    } catch (err) {
      console.error("Failed to fetch Chinese zodiac:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to calculate Chinese zodiac",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshReading = useCallback(
    async (profile: UserProfile) => {
      await fetchReading(profile);
    },
    [fetchReading],
  );

  const clear = useCallback(() => {
    setReading(null);
    setChineseYear(null);
    setElement(null);
    setError(null);
  }, []);

  return {
    reading,
    chineseYear,
    element,
    isLoading,
    error,
    fetchReading,
    refreshReading,
    clear,
  };
}
