'use client';

import { TarotReading as TarotReadingType } from '@super-stats/shared-types';
import { TarotCard } from './TarotCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCw } from 'lucide-react';

interface TarotReadingProps {
    reading: TarotReadingType;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function TarotReading({ reading, onRefresh, isRefreshing }: TarotReadingProps) {
    const [situation, challenge, outcome] = reading.cards;

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden relative">
            {/* Starry Night inspired background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Swirling stars effect */}
                <div className="absolute top-4 left-8 w-2 h-2 bg-amber-300 rounded-full animate-pulse opacity-60" />
                <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-8 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
                <div className="absolute top-20 right-1/4 w-1.5 h-1.5 bg-amber-100 rounded-full animate-pulse opacity-50" style={{ animationDelay: '1.5s' }} />
                <div className="absolute bottom-20 left-12 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-32 right-8 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.8s' }} />

                {/* Swirl decorative element */}
                <div className="absolute -top-20 -right-20 w-64 h-64 border-2 border-indigo-800/30 rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 border border-indigo-900/20 rounded-full" />
            </div>

            <CardHeader className="relative z-10 text-center pb-2">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <CardTitle className="text-amber-400">
                        <span className="text-xl font-bold">Your Daily Tarot Reading</span>
                    </CardTitle>
                    <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <CardDescription className="text-slate-400">
                        Reading for {new Date(reading.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </CardDescription>
                    {onRefresh && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="text-amber-400 hover:text-amber-500 hover:bg-amber-50/10"
                            title="Redraw cards"
                        >
                            <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6 sm:space-y-8 pb-6 sm:pb-8 px-3 sm:px-8">
                {/* 3-Card Spread - Horizontal Layout */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 pt-4 overflow-x-auto w-full">
                    <TarotCard drawnCard={situation} />
                    <TarotCard drawnCard={challenge} />
                    <TarotCard drawnCard={outcome} />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                    <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-amber-500 flex-shrink-0" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                </div>

                {/* Combined Narrative Summary */}
                <div className="px-2 sm:px-6">
                    <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-2 sm:mb-3 text-center">
                        Your Reading
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center italic">
                        "{reading.summary}"
                    </p>
                </div>

                {/* Guidance Note */}
                <div className="text-center px-3 sm:px-4">
                    <p className="text-xs sm:text-sm text-slate-500">
                        Remember: The cards offer guidance, but you hold the power to shape your destiny.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
