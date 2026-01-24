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
            lucky_number: (seed % 99) + 1,
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
