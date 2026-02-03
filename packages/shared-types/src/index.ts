export enum ZodiacSign {
  ARIES = "aries",
  TAURUS = "taurus",
  GEMINI = "gemini",
  CANCER = "cancer",
  LEO = "leo",
  VIRGO = "virgo",
  LIBRA = "libra",
  SCORPIO = "scorpio",
  SAGITTARIUS = "sagittarius",
  CAPRICORN = "capricorn",
  AQUARIUS = "aquarius",
  PISCES = "pisces",
}

export interface UserProfile {
  name: string;
  dateOfBirth: Date;
  sunSign: ZodiacSign;
}

export interface DailyPrediction {
  current_date: string;
  compatibility: string;
  lucky_number: number;
  lucky_time: string;
  color: string;
  date_range: string[];
  mood: string;
  description: string;
}

export interface WeeklyPrediction {
  week: string;
  description: string;
  compatibility: string;
  lucky_number: number;
  color: string;
  mood: string;
}

export interface HoroscopeSection {
  date: string;
  text: string;
}

export interface MonthlyPrediction {
  month: string;
  description: string;
  sections: HoroscopeSection[];
  standout_days: string;
  challenging_days: string;
  compatibility: string;
  lucky_number: number;
  color: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PredictionRequest {
  sign: ZodiacSign;
  day?: "yesterday" | "today" | "tomorrow";
}

export interface HealthCheckResponse {
  status: string;
}

export interface NumerologyNumber {
  number: number;
  title: string;
  meaning: string;
  description: string;
}

export interface NumerologyReading {
  lifePath: NumerologyNumber;
  destiny: NumerologyNumber;
  soulUrge: NumerologyNumber;
  personality: NumerologyNumber;
  birthday: NumerologyNumber;
  personalYear: NumerologyNumber;
  currentYear: number;
}

// Legacy interface for backward compatibility
export interface NumerologyPrediction {
  lifePath: number;
  destiny: number;
  lifePathMeaning: string;
  destinyMeaning: string;
}

// Tarot Types
export type TarotPosition = "situation" | "challenge" | "outcome";

export interface TarotCard {
  id: number;
  name: string;
  shortName: string;
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  imageUrl: string;
}

export interface DrawnCard {
  card: TarotCard;
  position: TarotPosition;
  isReversed: boolean;
}

export interface TarotReading {
  cards: [DrawnCard, DrawnCard, DrawnCard];
  date: string; // YYYY-MM-DD format
  summary: string; // Combined narrative
}

export interface TarotState {
  lastReading: TarotReading | null;
  lastDrawDate: string | null; // YYYY-MM-DD format
}

export type PredictionPeriod = "daily" | "weekly" | "monthly";
