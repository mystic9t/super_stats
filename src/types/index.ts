import {
  UserProfile,
  DailyPrediction,
  WeeklyPrediction,
  TarotReading,
  NumerologyReading,
  ChineseZodiacReading,
  CompatibilityReading,
  DailyAffirmation,
  PredictionPeriod,
  BirthChartReading,
  ZodiacSign,
} from "@vibes/shared-types";

// Component Props Interfaces
export interface DashboardProps {
  profile: UserProfile;
  onClear: () => void;
  onEdit: () => void;
  // Daily prediction
  prediction: DailyPrediction | null;
  loading: boolean;
  error: string | null;
  onGetPrediction: () => void;
  onRefreshPrediction: () => void;
  // Weekly prediction
  weeklyPrediction: WeeklyPrediction | null;
  weeklyLoading: boolean;
  weeklyError: string | null;
  onGetWeeklyPrediction: () => void;
  onRefreshWeeklyPrediction: () => void;
  // Period selection
  predictionPeriod: PredictionPeriod;
  onPeriodChange: (period: PredictionPeriod) => void;
  // Numerology
  numerologyReading: NumerologyReading | null;
  numerologyLoading: boolean;
  onGetNumerology: () => void;
  onRefreshNumerology: () => void;
  // Tarot
  tarotReading: TarotReading | null;
  tarotLoading: boolean;
  tarotShuffling: boolean;
  tarotRevealing: boolean;
  tarotRevealedCards: {
    situation: boolean;
    challenge: boolean;
    outcome: boolean;
  };
  canDrawTarot: boolean;
  onGetTarot: () => void;
  onRefreshTarot: () => void;
  // Chinese Zodiac
  chineseZodiacReading: ChineseZodiacReading | null;
  chineseZodiacLoading: boolean;
  chineseZodiacYear: string | null;
  chineseZodiacElement: string | null;
  onGetChineseZodiac: () => void;
  onRefreshChineseZodiac: () => void;
  // Moon Phase
  moonPhaseData: import("@vibes/shared-types").MoonPhaseData | null;
  moonZodiacSign: import("@vibes/shared-types").ZodiacSign | null;
  moonPhaseRituals: import("@vibes/shared-types").MoonRitual[];
  moonPhaseInfluence: import("@vibes/shared-types").ZodiacMoonInfluence | null;
  moonPhaseLoading: boolean;
  onGetMoonPhase: () => void;
  onRefreshMoonPhase: () => void;
  // Birth Chart (Advanced Mode)
  birthChartReading: BirthChartReading | null;
  birthChartLoading: boolean;
  onGetBirthChart: () => void;
  onRefreshBirthChart: () => void;
  // Compatibility
  compatibilityReading: CompatibilityReading | null;
  compatibilityPartnerSign: ZodiacSign | null;
  compatibilityLoading: boolean;
  onSelectCompatibilityPartner: (sign: ZodiacSign) => void;
  onClearCompatibility: () => void;
  // Affirmation
  affirmation: DailyAffirmation | null;
  affirmationLoading: boolean;
  onGetAffirmation: () => void;
  onRefreshAffirmation: () => void;
}

export interface OnboardingFormProps {
  onSave: (profile: UserProfile) => void;
  initialData?: UserProfile | null;
  onCancel?: () => void;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
