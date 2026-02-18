/** Timeout for external horoscope API calls (ms) */
export const EXTERNAL_API_TIMEOUT_MS = 10_000;

export const LUCKY_COLORS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "White",
  "Gold",
  "Silver",
  "Indigo",
  "Emerald",
  "Turquoise",
  "Ruby",
] as const;

export const ZODIAC_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const LUCKY_TIMES = [
  "6:00 AM",
  "7:30 AM",
  "9:00 AM",
  "10:15 AM",
  "11:30 AM",
  "12:00 PM",
  "1:45 PM",
  "3:00 PM",
  "4:30 PM",
  "6:00 PM",
  "7:15 PM",
  "9:00 PM",
] as const;

export const MOODS = [
  "Optimistic",
  "Reflective",
  "Energetic",
  "Calm",
  "Creative",
  "Focused",
  "Adventurous",
  "Grounded",
  "Passionate",
  "Thoughtful",
  "Social",
  "Independent",
] as const;

/** Simple deterministic hash for seeding pseudo-random selections */
export function seedHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
