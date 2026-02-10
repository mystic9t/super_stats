import { NextResponse } from 'next/server';
import { type DailyPrediction } from '@vibes/shared-types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign');
    const date = searchParams.get('date');

    if (!sign) {
        return NextResponse.json(
            { success: false, error: 'Sign is required', timestamp: new Date() },
            { status: 400 }
        );
    }

    if (!date) {
        return NextResponse.json(
            { success: false, error: 'Date is required in YYYY-MM-DD format', timestamp: new Date() },
            { status: 400 }
        );
    }

    try {
        // External API call with explicit date
        const response = await fetch(
            `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}&date=${date}`
        );

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map external API response to our DailyPrediction interface
        // External API returns: { data: { date: string, horoscope_data: string }, ... }
        // Generate deterministic elements based on date and sign
        const seedStr = `${data.data.date}-${sign}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const seed = Math.abs(hash);

        const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "White", "Gold", "Silver", "Indigo", "Emerald", "Turquoise", "Ruby"];
        const compatibility = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

        const prediction: DailyPrediction = {
            current_date: data.data.date,
            description: data.data.horoscope_data,
            // Dynamic deterministic fields
            compatibility: compatibility[seed % compatibility.length],
            lucky_number: (seed % 9) + 1,
            lucky_time: '12:00 PM', // Keep as placeholder for now or randomize similarly if needed
            color: colors[seed % colors.length],
            mood: 'Optimistic', // Keep placeholder
            date_range: [data.data.date],
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
