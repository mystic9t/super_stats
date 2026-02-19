import { NextResponse } from "next/server";
import { type DailyPrediction, ZodiacSign } from "@vibes/shared-types";
import { generateDailyHoroscope } from "@vibes/shared-utils";
import {
  EXTERNAL_API_TIMEOUT_MS,
  LUCKY_COLORS,
  ZODIAC_NAMES,
  LUCKY_TIMES,
  MOODS,
  seedHash,
} from "./constants";

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
        const seed = seedHash(`${data.data.date}-${sign}`);

        const prediction: DailyPrediction = {
          current_date: data.data.date,
          description: data.data.horoscope_data,
          compatibility: ZODIAC_NAMES[seed % ZODIAC_NAMES.length],
          lucky_number: (seed % 9) + 1,
          lucky_time: LUCKY_TIMES[(seed >> 4) % LUCKY_TIMES.length],
          color: LUCKY_COLORS[seed % LUCKY_COLORS.length],
          mood: MOODS[(seed >> 2) % MOODS.length],
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
