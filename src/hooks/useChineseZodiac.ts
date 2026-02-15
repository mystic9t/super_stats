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
  fetchReading: (profile: UserProfile) => Promise<void>;
  refreshReading: (profile: UserProfile) => Promise<void>;
  clear: () => void;
}

export function useChineseZodiac(): UseChineseZodiacReturn {
  const [reading, setReading] = useState<ChineseZodiacReading | null>(null);
  const [chineseYear, setChineseYear] = useState<string | null>(null);
  const [element, setElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReading = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      const chineseProfile = calculateChineseZodiac(
        new Date(profile.dateOfBirth),
      );
      const zodiacReading = getChineseZodiacReading(chineseProfile.sign);
      setReading(zodiacReading);
      setChineseYear(chineseProfile.chineseYear);
      setElement(chineseProfile.element); // Use the calculated specific element
    } catch (error) {
      console.error("Failed to fetch Chinese zodiac:", error);
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
  }, []);

  return {
    reading,
    chineseYear,
    element,
    isLoading,
    fetchReading,
    refreshReading,
    clear,
  };
}
