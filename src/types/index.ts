import { UserProfile, DailyPrediction, TarotReading, NumerologyPrediction } from '@super-stats/shared-types';

// Component Props Interfaces
export interface NumerologyCardProps {
  profile: UserProfile;
}

export interface DashboardProps {
  profile: UserProfile;
  onClear: () => void;
  prediction: DailyPrediction | null;
  loading: boolean;
  onGetPrediction: () => void;
  onRefreshPrediction: () => void;
  onEdit: () => void;
  tarotReading: TarotReading | null;
  tarotLoading: boolean;
  canDrawTarot: boolean;
  onGetTarot: () => void;
  onRefreshTarot: () => void;
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
