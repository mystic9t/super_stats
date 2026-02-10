import { ZodiacSign } from '@vibes/shared-types';

export const ZODIAC_DATE_RANGES = [
  { sign: ZodiacSign.CAPRICORN, start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: ZodiacSign.AQUARIUS, start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: ZodiacSign.PISCES, start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { sign: ZodiacSign.ARIES, start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: ZodiacSign.TAURUS, start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: ZodiacSign.GEMINI, start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: ZodiacSign.CANCER, start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: ZodiacSign.LEO, start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: ZodiacSign.VIRGO, start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: ZodiacSign.LIBRA, start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: ZodiacSign.SCORPIO, start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: ZodiacSign.SAGITTARIUS, start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
] as const;

export function calculateSunSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const range of ZODIAC_DATE_RANGES) {
    const { start, end } = range;
    let inRange = false;

    if (start.month === end.month) {
      inRange = month === start.month && day >= start.day && day <= end.day;
    } else {
      inRange =
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day);
    }

    if (inRange) {
      return range.sign;
    }
  }

  return ZodiacSign.CAPRICORN;
}

export function getZodiacDisplay(sign: ZodiacSign): string {
  const displayNames: Record<ZodiacSign, string> = {
    [ZodiacSign.ARIES]: 'Aries',
    [ZodiacSign.TAURUS]: 'Taurus',
    [ZodiacSign.GEMINI]: 'Gemini',
    [ZodiacSign.CANCER]: 'Cancer',
    [ZodiacSign.LEO]: 'Leo',
    [ZodiacSign.VIRGO]: 'Virgo',
    [ZodiacSign.LIBRA]: 'Libra',
    [ZodiacSign.SCORPIO]: 'Scorpio',
    [ZodiacSign.SAGITTARIUS]: 'Sagittarius',
    [ZodiacSign.CAPRICORN]: 'Capricorn',
    [ZodiacSign.AQUARIUS]: 'Aquarius',
    [ZodiacSign.PISCES]: 'Pisces',
  };
  return displayNames[sign];
}
