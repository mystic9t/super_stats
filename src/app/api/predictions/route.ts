import { NextResponse } from 'next/server';
import { type DailyPrediction } from '@super-stats/shared-types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign');
    const day = searchParams.get('day') || 'today';

    if (!sign) {
        return NextResponse.json(
            { success: false, error: 'Sign is required', timestamp: new Date() },
            { status: 400 }
        );
    }

    try {
        // External API call
        const response = await fetch(
            `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}&day=${day}`
        );

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map external API response to our DailyPrediction interface
        // External API returns: { data: { date: string, horoscope_data: string }, ... }
        const prediction: DailyPrediction = {
            current_date: data.data.date,
            description: data.data.horoscope_data,
            // Mock missing fields
            compatibility: 'Taurus', // Placeholder
            lucky_number: 42, // Placeholder
            lucky_time: '12:00 PM', // Placeholder
            color: 'Blue', // Placeholder
            mood: 'Optimistic', // Placeholder
            date_range: [data.data.date], // Simplification
        };

        return NextResponse.json({
            success: true,
            data: prediction,
            timestamp: new Date(),
        });
    } catch (error: unknown) {
        console.error('Prediction fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch prediction',
                timestamp: new Date(),
            },
            { status: 500 }
        );
    }
}
