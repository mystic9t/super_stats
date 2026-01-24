'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useUserProfile, useDailyPrediction, useTarotReading } from '@/hooks';
import { tarotService } from '@/services';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Use custom hooks for state management
  const { profile, setProfile, clearProfile } = useUserProfile();
  const { prediction, isLoading: predictionLoading, fetchPrediction, refreshPrediction, clear: clearPrediction } = useDailyPrediction();
  const { reading: tarotReading, isDrawing: tarotLoading, canDraw: canDrawTarot, drawCards, refreshCards, clear: clearTarot } = useTarotReading();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveProfile = async (newProfile: any) => {
    setProfile(newProfile);
    setIsEditing(false);
    toast.success(profile ? 'Profile updated!' : 'Welcome aboard!');
  };

  const handleClear = () => {
    clearProfile();
    clearPrediction();
    clearTarot();
    toast.info('Profile cleared');
  };

  const handleGetPrediction = async () => {
    if (!profile) return;
    try {
      await fetchPrediction(profile.sunSign);
      toast.success('Stars aligned!');
    } catch (err) {
      toast.error('Cloudy skies... try again later.');
    }
  };

  const handleRefreshPrediction = async () => {
    if (!profile) return;
    try {
      await refreshPrediction(profile.sunSign);
      toast.success('Prediction refreshed!');
    } catch (err) {
      toast.error('Failed to refresh prediction.');
    }
  };

  const handleRefreshTarot = async () => {
    if (!profile) return;
    try {
      await refreshCards(profile);
      toast.success('Cards redrawn!');
    } catch (err) {
      toast.error('Failed to redraw cards.');
    }
  };

  const handleGetTarot = async () => {
    if (!profile) return;

    if (!canDrawTarot) {
      // User has already drawn today, show stored reading
      const lastResult = tarotService.getLastReading(profile);
      if (lastResult.success) {
        toast.info('Welcome back to your reading.');
      } else {
        toast.error('Reading not found. Try clearing profile.');
      }
      return;
    }

    // Draw new tarot reading
    await drawCards(profile);
    toast.success('The cards have spoken!');
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-700 dark:opacity-60"
        style={{ backgroundImage: "url('/images/starry-night-stylized.png')" }}
      />

      <div className="relative z-10 p-4">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="pt-12">
          <Toaster position="top-center" richColors theme="system" />
          {profile && !isEditing ? (
            <Dashboard
              profile={profile}
              onClear={handleClear}
              prediction={prediction}
              loading={predictionLoading}
              onGetPrediction={handleGetPrediction}
              onRefreshPrediction={handleRefreshPrediction}
              onEdit={() => setIsEditing(true)}
              tarotReading={tarotReading}
              tarotLoading={tarotLoading}
              canDrawTarot={canDrawTarot}
              onGetTarot={handleGetTarot}
              onRefreshTarot={handleRefreshTarot}
            />
          ) : (
            <OnboardingForm
              onSave={handleSaveProfile}
              initialData={profile}
              onCancel={profile ? () => setIsEditing(false) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

