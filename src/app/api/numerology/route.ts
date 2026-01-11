import { NextResponse } from 'next/server';
import { ApiResponse, NumerologyPrediction } from '@super-stats/shared-types';
import { getMeaning } from '@super-stats/shared-utils';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lifePath = parseInt(searchParams.get('lifePath') || '0');
    const destiny = parseInt(searchParams.get('destiny') || '0');

    if (!lifePath || !destiny) {
        return NextResponse.json(
            { success: false, error: 'Missing lifePath or destiny parameters', timestamp: new Date() },
            { status: 400 }
        );
    }

    // Simulate "standard API" delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const prediction: NumerologyPrediction = {
        lifePath,
        destiny,
        lifePathMeaning: getMeaning(lifePath, 'lifePath'),
        destinyMeaning: getMeaning(destiny, 'destiny'),
    };

    const response: ApiResponse<NumerologyPrediction> = {
        success: true,
        data: prediction,
        timestamp: new Date(),
    };

    return NextResponse.json(response);
}
