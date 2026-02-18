import { MoonPhase, MoonPhaseData, ZodiacSign } from "@vibes/shared-types";

/**
 * Calculate moon phase for a given date
 * Uses a simplified astronomical algorithm based on known new moon reference
 */
export function calculateMoonPhase(date: Date = new Date()): MoonPhaseData {
  // Known new moon: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const synodicMonth = 29.53058867; // Average lunar cycle in days

  // Calculate days since known new moon
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Calculate age of moon (0-29.5 days)
  const age = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  // Calculate illumination (0-100%)
  const illumination = Math.round(
    ((1 - Math.cos((age / synodicMonth) * 2 * Math.PI)) / 2) * 100,
  );

  // Determine phase
  let phase: MoonPhase;
  let phaseName: string;
  let emoji: string;

  if (age < 1) {
    phase = MoonPhase.NEW_MOON;
    phaseName = "New Moon";
    emoji = "🌑";
  } else if (age < 6.5) {
    phase = MoonPhase.WAXING_CRESCENT;
    phaseName = "Waxing Crescent";
    emoji = "🌒";
  } else if (age < 8.5) {
    phase = MoonPhase.FIRST_QUARTER;
    phaseName = "First Quarter";
    emoji = "🌓";
  } else if (age < 14) {
    phase = MoonPhase.WAXING_GIBBOUS;
    phaseName = "Waxing Gibbous";
    emoji = "🌔";
  } else if (age < 16) {
    phase = MoonPhase.FULL_MOON;
    phaseName = "Full Moon";
    emoji = "🌕";
  } else if (age < 21.5) {
    phase = MoonPhase.WANING_GIBBOUS;
    phaseName = "Waning Gibbous";
    emoji = "🌖";
  } else if (age < 23.5) {
    phase = MoonPhase.LAST_QUARTER;
    phaseName = "Last Quarter";
    emoji = "🌗";
  } else if (age < 28.5) {
    phase = MoonPhase.WANING_CRESCENT;
    phaseName = "Waning Crescent";
    emoji = "🌘";
  } else {
    phase = MoonPhase.NEW_MOON;
    phaseName = "New Moon";
    emoji = "🌑";
  }

  // Calculate next new moon and full moon
  const daysToNextNewMoon = synodicMonth - age;
  const daysToNextFullMoon = age < 14 ? 14 - age : synodicMonth - age + 14;

  const nextNewMoon = new Date(
    date.getTime() + daysToNextNewMoon * 24 * 60 * 60 * 1000,
  );
  const nextFullMoon = new Date(
    date.getTime() + daysToNextFullMoon * 24 * 60 * 60 * 1000,
  );

  return {
    phase,
    phaseName,
    illumination,
    age: Math.round(age * 10) / 10,
    nextNewMoon,
    nextFullMoon,
    emoji,
  };
}

/**
 * Get zodiac sign the moon is currently in
 * Simplified calculation - moon changes sign every ~2.5 days
 */
export function getMoonZodiacSign(date: Date = new Date()): ZodiacSign {
  // Known reference: Moon was in Cancer on January 1, 2000
  const referenceDate = new Date("2000-01-01T00:00:00Z");

  const daysSinceRef =
    (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const moonCycleDays = 27.32; // Sidereal month (moon returns to same zodiac position)

  // Calculate position in zodiac cycle
  const position =
    ((daysSinceRef % moonCycleDays) + moonCycleDays) % moonCycleDays;
  const signIndex = Math.floor((position / moonCycleDays) * 12);

  // Order of signs starting from Cancer (reference point)
  const zodiacOrder = [
    ZodiacSign.CANCER,
    ZodiacSign.LEO,
    ZodiacSign.VIRGO,
    ZodiacSign.LIBRA,
    ZodiacSign.SCORPIO,
    ZodiacSign.SAGITTARIUS,
    ZodiacSign.CAPRICORN,
    ZodiacSign.AQUARIUS,
    ZodiacSign.PISCES,
    ZodiacSign.ARIES,
    ZodiacSign.TAURUS,
    ZodiacSign.GEMINI,
  ];

  return zodiacOrder[signIndex] || ZodiacSign.CANCER;
}

/**
 * Get SVG path for moon phase visualization
 */
export function getMoonPhaseSVG(
  phase: MoonPhase,
  illumination: number,
): string {
  const radius = 50;
  const center = 50;

  switch (phase) {
    case MoonPhase.NEW_MOON:
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`; // Full dark circle

    case MoonPhase.FULL_MOON:
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`; // Full light circle

    case MoonPhase.FIRST_QUARTER:
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 0 1 ${radius * 2} 0 a ${radius} ${radius} 0 0 0 -${radius * 2} 0`; // Right half lit

    case MoonPhase.LAST_QUARTER:
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 0 0 ${radius * 2} 0 a ${radius} ${radius} 0 0 1 -${radius * 2} 0`; // Left half lit

    case MoonPhase.WAXING_CRESCENT:
    case MoonPhase.WAXING_GIBBOUS:
      // Waxing - right side lit, varying amount
      const waxingSweep = illumination > 50 ? 1 : 0;
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 0 1 ${radius * 2} 0 a ${radius} ${radius} 0 0 ${waxingSweep} -${radius * 2} 0`;

    case MoonPhase.WANING_GIBBOUS:
    case MoonPhase.WANING_CRESCENT:
      // Waning - left side lit, varying amount
      const waningSweep = illumination > 50 ? 0 : 1;
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 0 ${waningSweep} ${radius * 2} 0 a ${radius} ${radius} 0 0 1 -${radius * 2} 0`;

    default:
      return "";
  }
}

/**
 * Format date to readable string
 */
export function formatMoonDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get moon phase description
 */
export function getMoonPhaseDescription(phase: MoonPhase): string {
  const descriptions: Record<MoonPhase, string> = {
    [MoonPhase.NEW_MOON]:
      "The moon is between Earth and Sun. Time for new beginnings, setting intentions, and planting seeds.",
    [MoonPhase.WAXING_CRESCENT]:
      "The moon is growing. Time for taking action, building momentum, and moving forward.",
    [MoonPhase.FIRST_QUARTER]:
      "Half the moon is illuminated. Time for challenges, decisions, and overcoming obstacles.",
    [MoonPhase.WAXING_GIBBOUS]:
      "Almost full moon. Time for refinement, adjustment, and preparing for culmination.",
    [MoonPhase.FULL_MOON]:
      "The moon is fully illuminated. Time for culmination, celebration, release, and clarity.",
    [MoonPhase.WANING_GIBBOUS]:
      "The moon is decreasing. Time for gratitude, sharing wisdom, and giving back.",
    [MoonPhase.LAST_QUARTER]:
      "Half moon waning. Time for release, letting go, and forgiveness.",
    [MoonPhase.WANING_CRESCENT]:
      "The moon is nearly dark. Time for rest, reflection, and surrender.",
  };

  return descriptions[phase];
}
