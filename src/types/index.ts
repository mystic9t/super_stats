import {
  UserProfile,
  DailyPrediction,
  WeeklyPrediction,
  MonthlyPrediction,
  TarotReading,
  NumerologyReading,
  ChineseZodiacReading,
  PredictionPeriod,
} from "@vibes/shared-types";

// Component Props Interfaces
export interface NumerologyCardProps {
  profile: UserProfile;
}

export interface DashboardProps {
  profile: UserProfile;
  onClear: () => void;
  onEdit: () => void;
  // Daily prediction
  prediction: DailyPrediction | null;
  loading: boolean;
  onGetPrediction: () => void;
  onRefreshPrediction: () => void;
  // Weekly prediction
  weeklyPrediction: WeeklyPrediction | null;
  weeklyLoading: boolean;
  onGetWeeklyPrediction: () => void;
  onRefreshWeeklyPrediction: () => void;
  // Monthly prediction
  monthlyPrediction: MonthlyPrediction | null;
  monthlyLoading: boolean;
  onGetMonthlyPrediction: () => void;
  onRefreshMonthlyPrediction: () => void;
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
  onGetChineseZodiac: () => void;
  onRefreshChineseZodiac: () => void;
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

export interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface PredictionContextType {
  prediction: DailyPrediction | null;
  isLoading: boolean;
  error: string | null;
}

export interface TarotContextType {
  reading: TarotReading | null;
  isLoading: boolean;
  canDraw: boolean;
  error: string | null;
}
