import { NextResponse } from "next/server";
import { type BirthChartReading, UserProfile } from "@vibes/shared-types";
import {
  calculateBirthChart,
  generateBirthChartReading,
} from "@vibes/shared-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = body as Partial<UserProfile>;

    if (!profile?.dateOfBirth) {
      return NextResponse.json(
        {
          success: false,
          error: "Date of birth is required",
          timestamp: new Date(),
        },
        { status: 400 },
      );
    }

    const birthDate = new Date(profile.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date of birth format",
          timestamp: new Date(),
        },
        { status: 400 },
      );
    }

    const chart = calculateBirthChart(
      birthDate,
      profile.birthTime,
      profile.latitude,
      profile.longitude,
    );

    const reading: BirthChartReading = generateBirthChartReading(chart);

    return NextResponse.json({
      success: true,
      data: reading,
      timestamp: new Date(),
    });
  } catch (error: unknown) {
    console.error("Birth chart calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to calculate birth chart",
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
