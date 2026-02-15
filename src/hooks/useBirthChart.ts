import { useState } from "react";
import { BirthChartReading, UserProfile } from "@vibes/shared-types";

interface UseBirthChartReturn {
  reading: BirthChartReading | null;
  isLoading: boolean;
  error: string | null;
  fetchReading: (profile: UserProfile) => Promise<void>;
  refreshReading: (profile: UserProfile) => Promise<void>;
  clear: () => void;
}

const CACHE_KEY_PREFIX = "birth-chart-cache";

function getCacheKey(profile: UserProfile): string {
  const dob = new Date(profile.dateOfBirth).toISOString().split("T")[0];
  const time = profile.birthTime || "noon";
  const location = profile.birthLocation || "unknown";
  return `${CACHE_KEY_PREFIX}-${dob}-${time}-${location}`;
}

function getCachedReading(profile: UserProfile): BirthChartReading | null {
  try {
    const key = getCacheKey(profile);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed as BirthChartReading;
    }
  } catch (error) {
    console.error("Error reading birth chart cache:", error);
  }
  return null;
}

function cacheReading(profile: UserProfile, reading: BirthChartReading): void {
  try {
    const key = getCacheKey(profile);
    window.localStorage.setItem(key, JSON.stringify(reading));
  } catch (error) {
    console.error("Error caching birth chart:", error);
  }
}

function clearCachedReading(profile: UserProfile): void {
  try {
    const key = getCacheKey(profile);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing birth chart cache:", error);
  }
}

export function useBirthChart(): UseBirthChartReturn {
  const [reading, setReading] = useState<BirthChartReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReading = async (profile: UserProfile) => {
    if (!profile.advancedMode) {
      setReading(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const cached = getCachedReading(profile);
    if (cached) {
      setReading(cached);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setReading(data.data);
        cacheReading(profile, data.data);
      } else {
        setError(data.error || "Failed to calculate birth chart");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate birth chart",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReading = async (profile: UserProfile) => {
    if (!profile.advancedMode) {
      setReading(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    clearCachedReading(profile);

    try {
      const response = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setReading(data.data);
        cacheReading(profile, data.data);
      } else {
        setError(data.error || "Failed to calculate birth chart");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate birth chart",
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
