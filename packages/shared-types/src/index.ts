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
  advancedMode?: boolean;
  birthTime?: string; // HH:MM format
  birthLocation?: string;
  latitude?: number;
  longitude?: number;
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

export type PredictionPeriod = "daily" | "weekly" | "moon" | "match";

// Chinese Zodiac Types
export enum ChineseZodiacSign {
  RAT = "rat",
  OX = "ox",
  TIGER = "tiger",
  RABBIT = "rabbit",
  DRAGON = "dragon",
  SNAKE = "snake",
  HORSE = "horse",
  GOAT = "goat",
  MONKEY = "monkey",
  ROOSTER = "rooster",
  DOG = "dog",
  PIG = "pig",
}

export interface ChineseZodiacProfile {
  sign: ChineseZodiacSign;
  year: number;
  element: string; // Wood, Fire, Earth, Metal, Water
  chineseYear: string;
}

export interface ChineseZodiacReading {
  sign: ChineseZodiacSign;
  title: string;
  description: string;
  traits: string[];
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  element: string;
  symbolEmoji: string;
  yearRange: string;
}

// Moon Phase Types
export enum MoonPhase {
  NEW_MOON = "new-moon",
  WAXING_CRESCENT = "waxing-crescent",
  FIRST_QUARTER = "first-quarter",
  WAXING_GIBBOUS = "waxing-gibbous",
  FULL_MOON = "full-moon",
  WANING_GIBBOUS = "waning-gibbous",
  LAST_QUARTER = "last-quarter",
  WANING_CRESCENT = "waning-crescent",
}

export interface MoonPhaseData {
  phase: MoonPhase;
  phaseName: string;
  illumination: number; // 0-100%
  age: number; // Days since new moon (0-29.5)
  nextNewMoon: Date;
  nextFullMoon: Date;
  emoji: string;
}

export interface MoonRitual {
  title: string;
  description: string;
  actions: string[];
  zodiacFocus: ZodiacSign[];
}

export interface ZodiacMoonInfluence {
  sign: ZodiacSign;
  moonPhase: MoonPhase;
  influence: string;
  focus: string[];
  avoid: string[];
}

// Birth Chart Types
export type Planet =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number; // 0-29.99
  minutes: number;
  isRetrograde: boolean;
  house?: number; // 1-12
}

export interface BirthChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  mercurySign: ZodiacSign;
  venusSign: ZodiacSign;
  marsSign: ZodiacSign;
  jupiterSign: ZodiacSign;
  saturnSign: ZodiacSign;
  uranusSign: ZodiacSign;
  neptuneSign: ZodiacSign;
  plutoSign: ZodiacSign;
  planets: PlanetPosition[];
  houses: Record<number, ZodiacSign>;
  ascendantDegree: number;
  midheavenDegree: number;
}

export interface HouseReading {
  house: number;
  sign: ZodiacSign;
  meaning: string;
  areas: string[];
}

export interface BirthChartReading {
  chart: BirthChart;
  interpretations: Record<Planet, string>;
  houseMeanings: HouseReading[];
  aspects: string[];
  summary: string;
}

// Zodiac Compatibility Types
export interface CompatibilityScore {
  overall: number; // 0-100
  love: number; // 0-100
  friendship: number; // 0-100
  work: number; // 0-100
}

export interface CompatibilityReading {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  scores: CompatibilityScore;
  summary: string;
  loveSummary: string;
  friendshipSummary: string;
  workSummary: string;
  strengths: string[];
  challenges: string[];
  tip: string;
}

// Daily Affirmation Types
export interface DailyAffirmation {
  affirmation: string;
  mantra: string;
  cosmicTheme: string;
  element: "fire" | "earth" | "air" | "water";
  chakra: string;
  color: string;
  crystal: string;
  journalPrompt: string;
  date: string; // YYYY-MM-DD
  sign: ZodiacSign;
}
