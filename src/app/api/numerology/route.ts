import { NextResponse } from "next/server";
import { ApiResponse, NumerologyReading } from "@vibes/shared-types";
import {
  getMeaning,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBirthdayNumber,
  calculatePersonalYearNumber,
} from "@vibes/shared-utils";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const birthdate = searchParams.get("birthdate");

  if (!name || !birthdate) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing name or birthdate parameters",
        timestamp: new Date(),
      },
      { status: 400 },
    );
  }

  try {
    const dateOfBirth = new Date(birthdate);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid birthdate format",
          timestamp: new Date(),
        },
        { status: 400 },
      );
    }

    if (dateOfBirth > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "Birthdate cannot be in the future",
          timestamp: new Date(),
        },
        { status: 400 },
      );
    }

    const currentYear = new Date().getFullYear();

    // Calculate all 6 numerology numbers
    const lifePathNum = calculateLifePathNumber(dateOfBirth);
    const destinyNum = calculateDestinyNumber(name);
    const soulUrgeNum = calculateSoulUrgeNumber(name);
    const personalityNum = calculatePersonalityNumber(name);
    const birthdayNum = calculateBirthdayNumber(dateOfBirth);
    const personalYearNum = calculatePersonalYearNumber(dateOfBirth);

    // Build the complete reading
    const reading: NumerologyReading = {
      lifePath: {
        number: lifePathNum,
        title: "Life Path Number",
        meaning: getMeaning(lifePathNum, "lifePath"),
        description:
          "Your life's purpose and core personality traits that guide your journey",
      },
      destiny: {
        number: destinyNum,
        title: "Destiny Number",
        meaning: getMeaning(destinyNum, "destiny"),
        description:
          "Your natural talents, abilities, and life mission revealed through your name",
      },
      soulUrge: {
        number: soulUrgeNum,
        title: "Soul Urge Number",
        meaning: getMeaning(soulUrgeNum, "soulUrge"),
        description:
          "Your innermost desires, motivations, and what your heart truly wants",
      },
      personality: {
        number: personalityNum,
        title: "Personality Number",
        meaning: getMeaning(personalityNum, "personality"),
        description:
          "How others perceive you and the first impression you make on people",
      },
      birthday: {
        number: birthdayNum,
        title: "Birthday Number",
        meaning: getMeaning(birthdayNum, "birthday"),
        description:
          "Special gifts and talents you were born with based on your birth day",
      },
      personalYear: {
        number: personalYearNum,
        title: "Personal Year Number",
        meaning: getMeaning(personalYearNum, "personalYear"),
        description: `The theme and energy influencing your life during ${currentYear}`,
      },
      currentYear,
    };

    const response: ApiResponse<NumerologyReading> = {
      success: true,
      data: reading,
      timestamp: new Date(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Numerology calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate numerology reading",
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
