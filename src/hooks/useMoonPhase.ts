import { useState, useEffect, useCallback } from "react";
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
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

interface MoonPhaseCache {
  data: MoonPhaseData;
  moonZodiac: ZodiacSign;
  timestamp: number;
}

/**
 * Hook to get current moon phase data and personalized rituals
 */
export function useMoonPhase(sunSign: ZodiacSign | null): UseMoonPhaseReturn {
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [moonZodiacSign, setMoonZodiacSign] = useState<ZodiacSign | null>(null);
  const [rituals, setRituals] = useState<MoonRitual[]>([]);
  const [influence, setInfluence] = useState<ZodiacMoonInfluence | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAndCache = useCallback(() => {
    const now = new Date();
    const data = calculateMoonPhase(now);
    const moonZodiac = getMoonZodiacSign(now);

    // Cache the results
    const cache: MoonPhaseCache = {
      data,
      moonZodiac,
      timestamp: now.getTime(),
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

      // Check if cache is still valid
      const now = Date.now();
      if (now - parsed.timestamp > CACHE_DURATION) {
        return null;
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
        const rituals = getMoonRituals(cached.data.phase, sunSign);
        const influence = getZodiacMoonInfluence(cached.data.phase, sunSign);
        setRituals(rituals);
        setInfluence(influence);
      }
    } else {
      // Calculate fresh data
      const { data, moonZodiac } = calculateAndCache();
      setMoonData(data);
      setMoonZodiacSign(moonZodiac);

      if (sunSign) {
        const rituals = getMoonRituals(data.phase, sunSign);
        const influence = getZodiacMoonInfluence(data.phase, sunSign);
        setRituals(rituals);
        setInfluence(influence);
      }
    }

    setIsLoading(false);
  }, [sunSign, calculateAndCache, loadFromCache]);

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
