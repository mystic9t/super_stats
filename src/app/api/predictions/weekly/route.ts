import { NextResponse } from "next/server";
import { type WeeklyPrediction } from "@vibes/shared-types";

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
    // External API call for weekly horoscope
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Weekly Prediction] Error response:", errorText);
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log(
      "[Weekly Prediction] Received data:",
      JSON.stringify(data).substring(0, 200),
    );

    // Validate the response structure
    if (!data?.data?.horoscope_data) {
      console.error(
        "[Weekly Prediction] Invalid data structure:",
        JSON.stringify(data),
      );
      return NextResponse.json(
        {
          success: false,
          error: "Invalid horoscope data received from external API",
          timestamp: new Date(),
        },
        { status: 502 },
      );
    }

    // Map external API response to our WeeklyPrediction interface
    // External API returns: { data: { week: string, horoscope_data: string }, ... }
    // Generate deterministic elements based on week and sign
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
      // Dynamic deterministic fields
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
