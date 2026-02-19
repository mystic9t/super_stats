"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { Toaster, toast } from "sonner";
import {
  useUserProfile,
  useDailyPrediction,
  useWeeklyPrediction,
  useNumerology,
  useTarotReading,
  useChineseZodiac,
  useMoonPhase,
  useBirthChart,
  useCompatibility,
  useAffirmation,
} from "@/hooks";
import { tarotService } from "@/services";
import { Header } from "@/components/Header";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { OnboardingForm } from "@/features/auth/components/OnboardingForm";
import { PredictionPeriod, UserProfile, ZodiacSign } from "@vibes/shared-types";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [predictionPeriod, setPredictionPeriod] =
    useState<PredictionPeriod>("daily");

  // Use custom hooks for state management
  const { profile, setProfile, clearProfile } = useUserProfile();
  const {
    prediction,
    isLoading: predictionLoading,
    error: predictionError,
    fetchPrediction,
    refreshPrediction,
    clear: clearPrediction,
  } = useDailyPrediction();
  const {
    prediction: weeklyPrediction,
    isLoading: weeklyLoading,
    error: weeklyError,
    fetchPrediction: fetchWeeklyPrediction,
    refreshPrediction: refreshWeeklyPrediction,
    clear: clearWeeklyPrediction,
  } = useWeeklyPrediction();
  const {
    reading: tarotReading,
    isDrawing: tarotLoading,
    isShuffling: tarotShuffling,
    isRevealing: tarotRevealing,
    revealedCards: tarotRevealedCards,
    canDraw: canDrawTarot,
    drawCards,
    refreshCards,
    clear: clearTarot,
  } = useTarotReading();
  const {
    reading: numerologyReading,
    isLoading: numerologyLoading,
    fetchReading: fetchNumerology,
    refreshReading: refreshNumerology,
    clear: clearNumerology,
  } = useNumerology();
  const {
    reading: chineseZodiacReading,
    chineseYear: chineseZodiacYear,
    element: chineseZodiacElement,
    isLoading: chineseZodiacLoading,
    fetchReading: fetchChineseZodiac,
    refreshReading: refreshChineseZodiac,
    clear: clearChineseZodiac,
  } = useChineseZodiac();
  const {
    moonData,
    moonZodiacSign,
    rituals: moonPhaseRituals,
    influence: moonPhaseInfluence,
    isLoading: moonPhaseLoading,
    refresh: refreshMoonPhase,
  } = useMoonPhase(profile?.sunSign || null);
  const {
    reading: birthChartReading,
    isLoading: birthChartLoading,
    fetchReading: fetchBirthChart,
    refreshReading: refreshBirthChart,
    clear: clearBirthChart,
  } = useBirthChart();
  const {
    reading: compatibilityReading,
    partnerSign: compatibilityPartnerSign,
    isLoading: compatibilityLoading,
    fetchReading: fetchCompatibility,
    clear: clearCompatibility,
  } = useCompatibility();
  const {
    affirmation,
    isLoading: affirmationLoading,
    fetchAffirmation,
    refreshAffirmation,
    clear: clearAffirmation,
  } = useAffirmation();

  // Use ref to track client-side mounting (SSR hydration fix)
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    startTransition(() => {
      setIsClient(true);
    });
  }, []);

  // Auto-fetch birth chart for advanced mode users
  useEffect(() => {
    if (!mounted.current) return;
    if (profile?.advancedMode && !birthChartReading && !birthChartLoading) {
      fetchBirthChart(profile);
    }
  }, [profile, birthChartReading, birthChartLoading, fetchBirthChart]);

  const handleSaveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsEditing(false);
    toast.success(profile ? "✨ Profile updated!" : "🌟 Welcome to Vibes!");
  };

  const handleClear = () => {
    clearProfile();
    clearPrediction();
    clearWeeklyPrediction();
    clearNumerology();
    clearTarot();
    clearChineseZodiac();
    clearBirthChart();
    clearCompatibility();
    clearAffirmation();
    toast.info("🌙 Profile cleared, fresh start!");
  };

  const handleGetMoonPhase = () => {
    if (!profile) return;
    refreshMoonPhase();
    toast.success("🌙 Moon phase calculated!");
  };

  const handleRefreshMoonPhase = () => {
    if (!profile) return;
    refreshMoonPhase();
    toast.success("🔄 Moon phase refreshed!");
  };

  const handleGetBirthChart = async () => {
    if (!profile || !profile.advancedMode) return;
    try {
      await fetchBirthChart(profile);
      toast.success("🌟 Birth chart calculated!");
    } catch {
      toast.error("Failed to calculate birth chart.");
    }
  };

  const handleRefreshBirthChart = async () => {
    if (!profile || !profile.advancedMode) return;
    try {
      await refreshBirthChart(profile);
      toast.success("🔄 Birth chart refreshed!");
    } catch {
      toast.error("Failed to refresh birth chart.");
    }
  };

  const handleGetPrediction = async () => {
    if (!profile) return;
    try {
      await fetchPrediction(profile.sunSign);
      toast.success("⭐ Stars aligned!");
    } catch {
      toast.error("☁️ Cloudy skies... try again later.");
    }
  };

  const handleRefreshPrediction = async () => {
    if (!profile) return;
    try {
      await refreshPrediction(profile.sunSign);
      toast.success("🔄 Prediction refreshed!");
    } catch {
      toast.error("Failed to refresh prediction.");
    }
  };

  const handleGetWeeklyPrediction = async () => {
    if (!profile) return;
    try {
      await fetchWeeklyPrediction(profile.sunSign);
      toast.success("📅 Weekly forecast ready!");
    } catch {
      toast.error("Cloudy skies for the week... try again later.");
    }
  };

  const handleRefreshWeeklyPrediction = async () => {
    if (!profile) return;
    try {
      await refreshWeeklyPrediction(profile.sunSign);
      toast.success("🔄 Weekly prediction refreshed!");
    } catch {
      toast.error("Failed to refresh weekly prediction.");
    }
  };

  const handleGetNumerology = async () => {
    if (!profile) return;
    try {
      await fetchNumerology(profile);
      toast.success("🔢 Your cosmic numbers revealed!");
    } catch {
      toast.error("Failed to calculate numerology.");
    }
  };

  const handleRefreshNumerology = async () => {
    if (!profile) return;
    try {
      await refreshNumerology(profile);
      toast.success("🔄 Numerology refreshed!");
    } catch {
      toast.error("Failed to refresh numerology.");
    }
  };

  const handleRefreshTarot = async () => {
    if (!profile) return;
    try {
      await refreshCards(profile);
      toast.success("🃏 Cards redrawn!");
    } catch {
      toast.error("Failed to redraw cards.");
    }
  };

  const handleGetTarot = async () => {
    if (!profile) return;

    if (!canDrawTarot) {
      // User has already drawn today, show stored reading
      const lastResult = tarotService.getLastReading(profile);
      if (lastResult.success) {
        toast.info("🌙 Welcome back to your reading.");
      } else {
        toast.error("Reading not found. Try clearing profile.");
      }
      return;
    }

    // Draw new tarot reading
    await drawCards(profile);
    toast.success("🎴 The cards have spoken!");
  };

  const handleGetChineseZodiac = async () => {
    if (!profile) return;
    try {
      await fetchChineseZodiac(profile);
      toast.success("Chinese zodiac revealed!");
    } catch {
      toast.error("Failed to fetch Chinese zodiac.");
    }
  };

  const handleRefreshChineseZodiac = async () => {
    if (!profile) return;
    try {
      await refreshChineseZodiac(profile);
      toast.success("Chinese zodiac refreshed!");
    } catch {
      toast.error("Failed to refresh Chinese zodiac.");
    }
  };

  const handleSelectCompatibilityPartner = (sign: ZodiacSign) => {
    if (!profile) return;
    fetchCompatibility(profile.sunSign, sign);
  };

  const handleGetAffirmation = () => {
    if (!profile) return;
    fetchAffirmation(profile.sunSign);
    toast.success("✨ Your cosmic affirmation awaits!");
  };

  const handleRefreshAffirmation = () => {
    if (!profile) return;
    refreshAffirmation(profile.sunSign);
    toast.success("🔄 Affirmation refreshed!");
  };

  if (!isClient) return null;

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Subtle cosmic background - different for light/dark */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative flex-1 overflow-y-auto">
        <Toaster
          position="bottom-right"
          richColors
          theme="dark"
          duration={500}
        />

        {profile && !isEditing ? (
          <Dashboard
            profile={profile}
            onClear={handleClear}
            prediction={prediction}
            loading={predictionLoading}
            error={predictionError}
            onGetPrediction={handleGetPrediction}
            onRefreshPrediction={handleRefreshPrediction}
            weeklyPrediction={weeklyPrediction}
            weeklyLoading={weeklyLoading}
            weeklyError={weeklyError}
            onGetWeeklyPrediction={handleGetWeeklyPrediction}
            onRefreshWeeklyPrediction={handleRefreshWeeklyPrediction}
            predictionPeriod={predictionPeriod}
            onPeriodChange={setPredictionPeriod}
            onEdit={() => setIsEditing(true)}
            numerologyReading={numerologyReading}
            numerologyLoading={numerologyLoading}
            onGetNumerology={handleGetNumerology}
            onRefreshNumerology={handleRefreshNumerology}
            tarotReading={tarotReading}
            tarotLoading={tarotLoading}
            tarotShuffling={tarotShuffling}
            tarotRevealing={tarotRevealing}
            tarotRevealedCards={tarotRevealedCards}
            canDrawTarot={canDrawTarot}
            onGetTarot={handleGetTarot}
            onRefreshTarot={handleRefreshTarot}
            chineseZodiacReading={chineseZodiacReading}
            chineseZodiacLoading={chineseZodiacLoading}
            chineseZodiacYear={chineseZodiacYear}
            chineseZodiacElement={chineseZodiacElement}
            onGetChineseZodiac={handleGetChineseZodiac}
            onRefreshChineseZodiac={handleRefreshChineseZodiac}
            moonPhaseData={moonData}
            moonZodiacSign={moonZodiacSign}
            moonPhaseRituals={moonPhaseRituals}
            moonPhaseInfluence={moonPhaseInfluence}
            moonPhaseLoading={moonPhaseLoading}
            onGetMoonPhase={handleGetMoonPhase}
            onRefreshMoonPhase={handleRefreshMoonPhase}
            birthChartReading={birthChartReading}
            birthChartLoading={birthChartLoading}
            onGetBirthChart={handleGetBirthChart}
            onRefreshBirthChart={handleRefreshBirthChart}
            compatibilityReading={compatibilityReading}
            compatibilityPartnerSign={compatibilityPartnerSign}
            compatibilityLoading={compatibilityLoading}
            onSelectCompatibilityPartner={handleSelectCompatibilityPartner}
            onClearCompatibility={clearCompatibility}
            affirmation={affirmation}
            affirmationLoading={affirmationLoading}
            onGetAffirmation={handleGetAffirmation}
            onRefreshAffirmation={handleRefreshAffirmation}
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
  );
}
