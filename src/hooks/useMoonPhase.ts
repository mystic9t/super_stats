import { useState, useCallback, useEffect } from "react";
import {
  MoonPhaseData,
  ZodiacSign,
  MoonRitual,
  ZodiacMoonInfluence,
} from "@vibes/shared-types";
import {
  calculateMoonPhase,
  getMoonZodiacSign,
  getMoonRituals,
  getZodiacMoonInfluence,
} from "@vibes/shared-utils";

interface UseMoonPhaseReturn {
  moonData: MoonPhaseData | null;
  moonZodiacSign: ZodiacSign | null;
  rituals: MoonRitual[];
  influence: ZodiacMoonInfluence | null;
  isLoading: boolean;
  refresh: () => void;
}

const CACHE_KEY = "moon-phase-cache";

interface MoonPhaseCache {
  data: MoonPhaseData;
  moonZodiac: ZodiacSign;
  date: string; // YYYY-MM-DD format
}

/**
 * Hook to get current moon phase data and personalized rituals
 * Auto-fetches on mount and updates daily
 */
export function useMoonPhase(sunSign: ZodiacSign | null): UseMoonPhaseReturn {
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [moonZodiacSign, setMoonZodiacSign] = useState<ZodiacSign | null>(null);
  const [rituals, setRituals] = useState<MoonRitual[]>([]);
  const [influence, setInfluence] = useState<ZodiacMoonInfluence | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date string for cache validation
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const calculateAndCache = useCallback(() => {
    const now = new Date();
    const data = calculateMoonPhase(now);
    const moonZodiac = getMoonZodiacSign(now);

    // Cache with date for daily refresh
    const cache: MoonPhaseCache = {
      data,
      moonZodiac,
      date: getTodayString(),
    };

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ...cache,
          data: {
            ...cache.data,
            nextNewMoon: cache.data.nextNewMoon.toISOString(),
            nextFullMoon: cache.data.nextFullMoon.toISOString(),
          },
        }),
      );
    } catch (e) {
      console.error("Failed to cache moon phase:", e);
    }

    return { data, moonZodiac };
  }, []);

  const loadFromCache = useCallback((): {
    data: MoonPhaseData;
    moonZodiac: ZodiacSign;
  } | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached) as MoonPhaseCache & {
        data: {
          nextNewMoon: string;
          nextFullMoon: string;
        };
      };

      // Check if cache is from today
      if (parsed.date !== getTodayString()) {
        return null; // Cache is stale (different day)
      }

      return {
        data: {
          ...parsed.data,
          nextNewMoon: new Date(parsed.data.nextNewMoon),
          nextFullMoon: new Date(parsed.data.nextFullMoon),
        },
        moonZodiac: parsed.moonZodiac,
      };
    } catch (e) {
      console.error("Failed to load moon phase cache:", e);
      return null;
    }
  }, []);

  const refresh = useCallback(() => {
    setIsLoading(true);

    // Try to load from cache first
    const cached = loadFromCache();

    if (cached) {
      setMoonData(cached.data);
      setMoonZodiacSign(cached.moonZodiac);

      if (sunSign) {
        const moonRituals = getMoonRituals(cached.data.phase, sunSign);
        const moonInfluence = getZodiacMoonInfluence(
          cached.data.phase,
          sunSign,
        );
        setRituals(moonRituals);
        setInfluence(moonInfluence);
      }
    } else {
      // Calculate fresh data
      const { data, moonZodiac } = calculateAndCache();
      setMoonData(data);
      setMoonZodiacSign(moonZodiac);

      if (sunSign) {
        const moonRituals = getMoonRituals(data.phase, sunSign);
        const moonInfluence = getZodiacMoonInfluence(data.phase, sunSign);
        setRituals(moonRituals);
        setInfluence(moonInfluence);
      }
    }

    setIsLoading(false);
  }, [sunSign, calculateAndCache, loadFromCache]);

  // Auto-fetch on mount when sunSign is available
  useEffect(() => {
    if (sunSign) {
      refresh();
    }
  }, [sunSign, refresh]);

  return {
    moonData,
    moonZodiacSign,
    rituals,
    influence,
    isLoading,
    refresh,
  };
}
