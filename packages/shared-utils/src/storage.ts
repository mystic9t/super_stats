import { UserProfile } from "@vibes/shared-types";

export const STORAGE_KEYS = {
  USER_PROFILE: "vibes-user-profile",
  PROFILES_LIST: "vibes-profiles-list",
  ACTIVE_PROFILE_ID: "vibes-active-profile-id",
} as const;

/**
 * Multiple Profile Support
 * Each profile gets a unique ID and is stored separately
 */

// Generate a unique profile ID
function generateProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Get list of all profile IDs
export function getProfileList(): string[] {
  try {
    const list = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
}

// Save profile list
function saveProfileList(ids: string[]): void {
  localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(ids));
}

// Get the currently active profile ID
export function getActiveProfileId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
}

// Set the active profile ID
export function setActiveProfileId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
}

// Get storage key for a specific profile
function getProfileStorageKey(id: string): string {
  return `${STORAGE_KEYS.USER_PROFILE}_${id}`;
}

export function saveUserProfile(
  profile: UserProfile,
  profileId?: string,
): string {
  try {
    // If no profile ID provided, check if there's an active one, otherwise create new
    let id = profileId;
    if (!id) {
      id = getActiveProfileId() || generateProfileId();
    }

    const serialized = JSON.stringify({
      ...profile,
      dateOfBirth: profile.dateOfBirth.toISOString(),
      _profileId: id, // Store ID in the profile for reference
    });
    localStorage.setItem(getProfileStorageKey(id), serialized);

    // Update profile list
    const list = getProfileList();
    if (!list.includes(id)) {
      saveProfileList([...list, id]);
    }

    // Set as active if no active profile
    if (!getActiveProfileId()) {
      setActiveProfileId(id);
    }

    return id;
  } catch (error) {
    console.error("Failed to save user profile:", error);
    throw new Error("Failed to save user profile");
  }
}

export function getUserProfile(profileId?: string): UserProfile | null {
  try {
    // Use provided ID, or fall back to active profile
    const id = profileId || getActiveProfileId();
    if (!id) {
      return null;
    }

    const serialized = localStorage.getItem(getProfileStorageKey(id));
    if (!serialized) {
      return null;
    }

    const data = JSON.parse(serialized);
    // Remove internal _profileId before returning
    const { _profileId, ...profile } = data;
    return {
      ...profile,
      dateOfBirth: new Date(profile.dateOfBirth),
    };
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return null;
  }
}

export function getAllProfiles(): Array<{
  id: string;
  name: string;
  sunSign: string;
}> {
  try {
    const list = getProfileList();
    const profiles: Array<{ id: string; name: string; sunSign: string }> = [];

    for (const id of list) {
      const profile = getUserProfile(id);
      if (profile) {
        profiles.push({ id, name: profile.name, sunSign: profile.sunSign });
      }
    }

    return profiles;
  } catch {
    return [];
  }
}

export function deleteProfile(profileId: string): boolean {
  try {
    const list = getProfileList();
    const newList = list.filter((id) => id !== profileId);
    saveProfileList(newList);

    localStorage.removeItem(getProfileStorageKey(profileId));

    // If deleted profile was active, switch to another
    if (getActiveProfileId() === profileId) {
      if (newList.length > 0) {
        setActiveProfileId(newList[0]);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function switchToProfile(profileId: string): boolean {
  try {
    const list = getProfileList();
    if (list.includes(profileId)) {
      setActiveProfileId(profileId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function clearUserProfile(): void {
  try {
    const activeId = getActiveProfileId();
    if (activeId) {
      deleteProfile(activeId);
    }
  } catch (error) {
    console.error("Failed to clear user profile:", error);
  }
}
