import { NextResponse } from "next/server";
import { type DailyPrediction, ZodiacSign } from "@vibes/shared-types";
import { generateDailyHoroscope } from "@vibes/shared-utils";

const VALID_SIGNS = new Set(Object.values(ZodiacSign));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");
  const date = searchParams.get("date");

  if (!sign) {
    return NextResponse.json(
      { success: false, error: "Sign is required", timestamp: new Date() },
      { status: 400 },
    );
  }

  if (!VALID_SIGNS.has(sign.toLowerCase() as ZodiacSign)) {
    return NextResponse.json(
      { success: false, error: "Invalid zodiac sign", timestamp: new Date() },
      { status: 400 },
    );
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      {
        success: false,
        error: "Date is required in YYYY-MM-DD format",
        timestamp: new Date(),
      },
      { status: 400 },
    );
  }

  try {
    const externalUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}&date=${date}`;
    console.log("[Daily Prediction] Fetching from:", externalUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(externalUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Vibes-App/1.0",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(
      "[Daily Prediction] Response status:",
      response.status,
      response.statusText,
    );

    if (response.ok) {
      const data = await response.json();
      console.log(
        "[Daily Prediction] Received data:",
        JSON.stringify(data).substring(0, 200),
      );

      if (data?.data?.horoscope_data) {
        const seedStr = `${data.data.date}-${sign}`;
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

        const luckyTimes = [
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
        ];
        const moods = [
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
        ];

        const prediction: DailyPrediction = {
          current_date: data.data.date,
          description: data.data.horoscope_data,
          compatibility: compatibility[seed % compatibility.length],
          lucky_number: (seed % 9) + 1,
          lucky_time: luckyTimes[(seed >> 4) % luckyTimes.length],
          color: colors[seed % colors.length],
          mood: moods[(seed >> 2) % moods.length],
          date_range: [data.data.date],
        };

        return NextResponse.json({
          success: true,
          data: prediction,
          timestamp: new Date(),
          isFallback: false,
        });
      }
    }

    console.log(
      "[Daily Prediction] External API failed, using fallback generator",
    );

    const generated = generateDailyHoroscope(
      sign.toUpperCase() as ZodiacSign,
      date,
    );

    const prediction: DailyPrediction = {
      current_date: date,
      description: generated.description,
      compatibility: generated.compatibility,
      lucky_number: generated.lucky_number,
      lucky_time: generated.lucky_time,
      color: generated.color,
      mood: generated.mood,
      date_range: [date],
    };

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date(),
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("Prediction fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch prediction",
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
