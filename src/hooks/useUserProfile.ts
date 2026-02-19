import { useEffect, useState, startTransition } from "react";
import { UserProfile } from "@vibes/shared-types";
import { profileService } from "@/services";

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

/**
 * Hook to manage user profile state
 * Handles loading from localStorage on mount and saving changes
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    const result = profileService.loadProfile();
    if (result.success) {
      startTransition(() => {
        setProfileState(result.data || null);
      });
    } else {
      startTransition(() => {
        setError(result.error || null);
      });
    }
    startTransition(() => {
      setIsLoading(false);
    });
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    const result = profileService.saveProfile(newProfile);
    if (result.success) {
      setProfileState(newProfile);
      setError(null);
    } else {
      setError(result.error || null);
    }
  };

  const clearProfile = () => {
    const result = profileService.clearProfile();
    if (result.success) {
      setProfileState(null);
      setError(null);
    } else {
      setError(result.error || null);
    }
  };

  return {
    profile,
    isLoading,
    error,
    setProfile,
    clearProfile,
  };
}
