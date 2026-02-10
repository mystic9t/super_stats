import { UserProfile } from '@vibes/shared-types';

export const STORAGE_KEYS = {
  USER_PROFILE: 'vibes-user-profile',
} as const;

export function saveUserProfile(profile: UserProfile): void {
  try {
    const serialized = JSON.stringify({
      ...profile,
      dateOfBirth: profile.dateOfBirth.toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, serialized);
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw new Error('Failed to save user profile');
  }
}

export function getUserProfile(): UserProfile | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!serialized) {
      return null;
    }

    const data = JSON.parse(serialized);
    return {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    };
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Failed to clear user profile:', error);
  }
}
