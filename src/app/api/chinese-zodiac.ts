import { NextResponse } from 'next/server';
import { ChineseZodiacReading } from '@vibes/shared-types';
import { getChineseZodiacReading, calculateChineseZodiac } from '@vibes/shared-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateOfBirth = searchParams.get('dateOfBirth');

  if (!dateOfBirth) {
    return NextResponse.json(
      { success: false, error: 'dateOfBirth is required', timestamp: new Date() },
      { status: 400 }
    );
  }

  try {
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format', timestamp: new Date() },
        { status: 400 }
      );
    }

    const chineseProfile = calculateChineseZodiac(date);
    const reading = getChineseZodiacReading(chineseProfile.sign);

    const response: ChineseZodiacReading & { chineseYear: string } = {
      ...reading,
      chineseYear: chineseProfile.chineseYear,
    };

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date(),
    });
  } catch (error: unknown) {
    console.error('Chinese zodiac fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Chinese zodiac',
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
