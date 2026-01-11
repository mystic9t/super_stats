export enum ZodiacSign {
  ARIES = 'aries',
  TAURUS = 'taurus',
  GEMINI = 'gemini',
  CANCER = 'cancer',
  LEO = 'leo',
  VIRGO = 'virgo',
  LIBRA = 'libra',
  SCORPIO = 'scorpio',
  SAGITTARIUS = 'sagittarius',
  CAPRICORN = 'capricorn',
  AQUARIUS = 'aquarius',
  PISCES = 'pisces'
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PredictionRequest {
  sign: ZodiacSign;
  day?: 'yesterday' | 'today' | 'tomorrow';
}

export interface HealthCheckResponse {
  status: string;
}

export interface NumerologyPrediction {
  lifePath: number;
  destiny: number;
  lifePathMeaning: string;
  destinyMeaning: string;
}
