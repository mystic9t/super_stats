import { NextResponse } from "next/server";
import {
  type MonthlyPrediction,
  HoroscopeSection,
} from "@super-stats/shared-types";

/**
 * Parse monthly horoscope text and split into sections by date
 * Normalizes relative dates (e.g., "the third") to actual dates
 */
function parseMonthlyHoroscope(
  text: string,
  monthName: string,
  year: number,
): HoroscopeSection[] {
  const sections: HoroscopeSection[] = [];

  // Map of ordinal words to numbers
  const ordinalMap: Record<string, number> = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    twentieth: 20,
    "twenty-first": 21,
    "twenty-second": 22,
    "twenty-third": 23,
    "twenty-fourth": 24,
    "twenty-fifth": 25,
    "twenty-sixth": 26,
    "twenty-seventh": 27,
    "twenty-eighth": 28,
    "twenty-ninth": 29,
    thirtieth: 30,
    "thirty-first": 31,
  };

  // Patterns to match dates in the text
  const datePatterns = [
    // Match "February 1" or "January 15"
    { regex: /([A-Za-z]+)\s+(\d{1,2})/g, type: "month_day" },
    // Match "the third", "the tenth", "the seventeenth"
    {
      regex:
        /the\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty-first|twenty-second|twenty-third|twenty-fourth|twenty-fifth|twenty-sixth|twenty-seventh|twenty-eighth|twenty-ninth|thirtieth|thirty-first)/gi,
      type: "ordinal",
    },
  ];

  // Find all date matches with their positions
  const matches: { index: number; date: string; type: string }[] = [];

  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      let dateStr: string;

      if (pattern.type === "month_day") {
        // Already in format "Month Day"
        dateStr = `${match[1]} ${match[2]}`;
      } else {
        // Convert ordinal to actual date
        const ordinal = match[1].toLowerCase();
        const day = ordinalMap[ordinal];
        if (day) {
          dateStr = `${monthName} ${day}`;
        } else {
          continue;
        }
      }

      matches.push({
        index: match.index,
        date: dateStr,
        type: pattern.type,
      });
    }
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Remove duplicates (keep first occurrence)
  const uniqueMatches = matches.filter(
    (match, index, self) =>
      index === self.findIndex((m) => m.date === match.date),
  );

  // Split text into sections
  if (uniqueMatches.length === 0) {
    // No dates found, return entire text as one section
    sections.push({ date: monthName, text: text.trim() });
  } else {
    for (let i = 0; i < uniqueMatches.length; i++) {
      const current = uniqueMatches[i];
      const next = uniqueMatches[i + 1];

      const startIndex = current.index;
      const endIndex = next ? next.index : text.length;

      // Extract text for this section (skip the date mention itself)
      let sectionText = text.substring(startIndex, endIndex).trim();

      // Remove the date mention from the beginning of the section text
      const dateMentionPattern = new RegExp(
        `^(?:[A-Za-z]+\\s+\\d{1,2}|the\\s+(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty-first|twenty-second|twenty-third|twenty-fourth|twenty-fifth|twenty-sixth|twenty-seventh|twenty-eighth|twenty-ninth|thirtieth|thirty-first))`,
        "i",
      );
      sectionText = sectionText.replace(dateMentionPattern, "").trim();

      // Clean up any leading punctuation
      sectionText = sectionText.replace(/^[,.\s]+/, "").trim();

      if (sectionText) {
        sections.push({
          date: current.date,
          text: sectionText,
        });
      }
    }
  }

  return sections;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");

  if (!sign) {
    return NextResponse.json(
      { success: false, error: "Sign is required", timestamp: new Date() },
      { status: 400 },
    );
  }

  try {
    // External API call for monthly horoscope
    const response = await fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${sign.toLowerCase()}`,
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract month name and year from the month field (e.g., "February 2026")
    const monthMatch = data.data.month.match(/^([A-Za-z]+)\s+(\d{4})$/);
    const monthName = monthMatch ? monthMatch[1] : data.data.month;
    const year = monthMatch
      ? parseInt(monthMatch[2])
      : new Date().getFullYear();

    // Parse the horoscope text into sections
    const sections = parseMonthlyHoroscope(
      data.data.horoscope_data,
      monthName,
      year,
    );

    // Map external API response to our MonthlyPrediction interface
    // Generate deterministic elements based on month and sign
    const seedStr = `${data.data.month}-${sign}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const colors = [
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
    ];
    const compatibility = [
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
    ];

    const prediction: MonthlyPrediction = {
      month: data.data.month,
      description: data.data.horoscope_data,
      sections: sections,
      standout_days: data.data.standout_days,
      challenging_days: data.data.challenging_days,
      // Dynamic deterministic fields
      compatibility: compatibility[seed % compatibility.length],
      lucky_number: (seed % 9) + 1,
      color: colors[seed % colors.length],
    };

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date(),
    });
  } catch (error: unknown) {
    console.error("Monthly prediction fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch monthly prediction",
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
