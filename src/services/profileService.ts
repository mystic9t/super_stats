import { UserProfile } from '@vibes/shared-types';
import { getUserProfile, saveUserProfile, clearUserProfile } from '@vibes/shared-utils';
import { ServiceResponse } from '@/types';

class ProfileService {
  /**
   * Load user profile from localStorage
   */
  loadProfile(): ServiceResponse<UserProfile> {
    try {
      const profile = getUserProfile();
      if (profile) {
        return { success: true, data: profile };
      }
      return { success: false, error: 'No profile found' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      return { success: false, error: message };
    }
  }

  /**
   * Save user profile to localStorage
   */
  saveProfile(profile: UserProfile): ServiceResponse<UserProfile> {
    try {
      saveUserProfile(profile);
      return { success: true, data: profile };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      return { success: false, error: message };
    }
  }

  /**
   * Clear user profile from localStorage
   */
  clearProfile(): ServiceResponse<void> {
    try {
      clearUserProfile();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear profile';
      return { success: false, error: message };
    }
  }
}

export const profileService = new ProfileService();
