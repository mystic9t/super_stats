import { useState } from "react";
import { NumerologyReading, UserProfile } from "@super-stats/shared-types";

interface UseNumerologyReturn {
  reading: NumerologyReading | null;
  isLoading: boolean;
  error: string | null;
  fetchReading: (profile: UserProfile) => Promise<void>;
  refreshReading: (profile: UserProfile) => Promise<void>;
  clear: () => void;
}

const CACHE_KEY_PREFIX = "numerology-cache";

/**
 * Get cache key for numerology reading (based on name + birthdate)
 */
function getCacheKey(profile: UserProfile): string {
  const dob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
  const safeName = profile.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${CACHE_KEY_PREFIX}_${safeName}_${dob}`;
}

/**
 * Get cached reading from localStorage
 */
function getCachedReading(profile: UserProfile): NumerologyReading | null {
  try {
    const key = getCacheKey(profile);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as NumerologyReading;
    }
  } catch (error) {
    console.error("Error reading numerology cache:", error);
  }
  return null;
}

/**
 * Cache reading to localStorage
 */
function cacheReading(profile: UserProfile, reading: NumerologyReading): void {
  try {
    const key = getCacheKey(profile);
    window.localStorage.setItem(key, JSON.stringify(reading));
  } catch (error) {
    console.error("Error caching numerology reading:", error);
  }
}

/**
 * Clear cached reading
 */
function clearCachedReading(profile: UserProfile): void {
  try {
    const key = getCacheKey(profile);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing numerology cache:", error);
  }
}

/**
 * Hook to fetch and manage numerology readings with frontend caching
 */
export function useNumerology(): UseNumerologyReturn {
  const [reading, setReading] = useState<NumerologyReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReading = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);

    // Check cache first
    const cached = getCachedReading(profile);
    if (cached) {
      setReading(cached);
      setIsLoading(false);
      return;
    }

    // Fetch from API
    try {
      const dob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
      const response = await fetch(
        `/api/numerology?name=${encodeURIComponent(profile.name)}&birthdate=${dob}`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setReading(data.data);
        cacheReading(profile, data.data);
      } else {
        setError(data.error || "Failed to fetch numerology reading");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch numerology reading",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReading = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);

    // Clear cache to force fresh fetch
    clearCachedReading(profile);

    // Fetch from API
    try {
      const dob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
      const response = await fetch(
        `/api/numerology?name=${encodeURIComponent(profile.name)}&birthdate=${dob}`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setReading(data.data);
        cacheReading(profile, data.data);
      } else {
        setError(data.error || "Failed to refresh numerology reading");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refresh numerology reading",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setReading(null);
    setError(null);
  };

  return {
    reading,
    isLoading,
    error,
    fetchReading,
    refreshReading,
    clear,
  };
}
