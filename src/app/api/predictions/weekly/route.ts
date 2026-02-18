import { NextResponse } from "next/server";
import { type WeeklyPrediction, ZodiacSign } from "@vibes/shared-types";
import { generateWeeklyHoroscope } from "@vibes/shared-utils";
import {
  EXTERNAL_API_TIMEOUT_MS,
  LUCKY_COLORS,
  ZODIAC_NAMES,
  MOODS,
  seedHash,
} from "../constants";

const VALID_SIGNS = new Set(Object.values(ZodiacSign));

function getCurrentWeekStr(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
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

  if (!VALID_SIGNS.has(sign.toLowerCase() as ZodiacSign)) {
    return NextResponse.json(
      { success: false, error: "Invalid zodiac sign", timestamp: new Date() },
      { status: 400 },
    );
  }

  try {
    const externalUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${sign.toLowerCase()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      EXTERNAL_API_TIMEOUT_MS,
    );

    const response = await fetch(externalUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Vibes-App/1.0",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      if (data?.data?.horoscope_data) {
        const seed = seedHash(`${data.data.week}-${sign}`);

        const prediction: WeeklyPrediction = {
          week: data.data.week,
          description: data.data.horoscope_data,
          compatibility: ZODIAC_NAMES[seed % ZODIAC_NAMES.length],
          lucky_number: (seed % 9) + 1,
          color: LUCKY_COLORS[seed % LUCKY_COLORS.length],
          mood: MOODS[seed % MOODS.length],
        };

        return NextResponse.json({
          success: true,
          data: prediction,
          timestamp: new Date(),
          isFallback: false,
        });
      }
    }

    const weekStr = getCurrentWeekStr();
    const generated = generateWeeklyHoroscope(
      sign.toUpperCase() as ZodiacSign,
      weekStr,
    );

    const prediction: WeeklyPrediction = {
      week: weekStr,
      description: generated.description,
      compatibility: generated.compatibility,
      lucky_number: generated.lucky_number,
      color: generated.color,
      mood: generated.mood,
    };

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date(),
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("Weekly prediction fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch weekly prediction",
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
