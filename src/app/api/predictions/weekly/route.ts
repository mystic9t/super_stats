import { NextResponse } from "next/server";
import { type WeeklyPrediction, ZodiacSign } from "@vibes/shared-types";
import { generateWeeklyHoroscope } from "@vibes/shared-utils";

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

  try {
    const externalUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${sign.toLowerCase()}`;
    console.log("[Weekly Prediction] Fetching from:", externalUrl);

    const response = await fetch(externalUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Vibes-App/1.0",
      },
    });

    console.log(
      "[Weekly Prediction] Response status:",
      response.status,
      response.statusText,
    );

    if (response.ok) {
      const data = await response.json();
      console.log(
        "[Weekly Prediction] Received data:",
        JSON.stringify(data).substring(0, 200),
      );

      if (data?.data?.horoscope_data) {
        const seedStr = `${data.data.week}-${sign}`;
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

        const prediction: WeeklyPrediction = {
          week: data.data.week,
          description: data.data.horoscope_data,
          compatibility: compatibility[seed % compatibility.length],
          lucky_number: (seed % 9) + 1,
          color: colors[seed % colors.length],
          mood: moods[seed % moods.length],
        };

        return NextResponse.json({
          success: true,
          data: prediction,
          timestamp: new Date(),
        });
      }
    }

    console.log(
      "[Weekly Prediction] External API failed, using fallback generator",
    );

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
