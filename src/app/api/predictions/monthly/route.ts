import { NextResponse } from "next/server";
import { type MonthlyPrediction } from "@vibes/shared-types";

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

    // Map external API response to our MonthlyPrediction interface
    // External API returns: { data: { month: string, horoscope_data: string, standout_days: string, challenging_days: string }, ... }
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
