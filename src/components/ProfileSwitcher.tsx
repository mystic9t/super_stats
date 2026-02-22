"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Users, Plus, Trash2, Check, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllProfiles,
  switchToProfile,
  deleteProfile,
  getActiveProfileId,
} from "@vibes/shared-utils";
import { useRouter } from "next/navigation";

interface ProfileSwitcherProps {
  onAddProfile: () => void;
  onProfileSwitch: () => void;
  currentProfileName: string;
}

interface ProfileInfo {
  id: string;
  name: string;
  sunSign: string;
}

export function ProfileSwitcher({
  onAddProfile,
  onProfileSwitch,
  currentProfileName,
}: ProfileSwitcherProps) {
  const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const loadProfiles = useCallback(() => {
    const allProfiles = getAllProfiles();
    setProfiles(allProfiles);
    setActiveProfileId(getActiveProfileId());
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setDeleteConfirm(null);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleSwitchProfile = (profileId: string) => {
    const success = switchToProfile(profileId);
    if (success) {
      setActiveProfileId(profileId);
      setIsOpen(false);
      onProfileSwitch();
      // Force a page reload to refresh all data
      window.location.reload();
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    const success = deleteProfile(profileId);
    if (success) {
      loadProfiles();
      // If we deleted the active profile, we need to reload
      if (profileId === activeProfileId) {
        window.location.reload();
      }
    }
    setDeleteConfirm(null);
  };

  // Don't render if there's only one profile (or none)
  if (profiles.length <= 1) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">{currentProfileName}</span>
      </Button>

      {/* Profile Switcher Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Your Profiles</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
              Switch between profiles or add a new one. Each profile has its own
              readings and settings.
            </div>

            {/* Profile List */}
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    profile.id === activeProfileId
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        profile.id === activeProfileId
                          ? "bg-amber-500 text-background"
                          : "bg-muted"
                      }`}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {profile.name}
                        {profile.id === activeProfileId && (
                          <Check className="h-3 w-3 inline ml-1 text-amber-500" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile.sunSign}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {profile.id !== activeProfileId && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSwitchProfile(profile.id)}
                          className="text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                        >
                          Switch
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(profile.id)}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  onAddProfile();
                }}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-card border border-destructive/50 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold mb-2">Delete Profile?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete this profile and all associated
              readings. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProfile(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
