'use client';

import { useEffect, useState } from 'react';
import { UserProfile, NumerologyPrediction } from '@super-stats/shared-types';
import { calculateLifePathNumber, calculateDestinyNumber } from '@super-stats/shared-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Loader2 } from 'lucide-react';
import { NumerologyCardProps } from '@/types';

/**
 * NumerologyCard Component
 * Displays numerology insights based on user profile
 */
export function NumerologyCard({ profile }: NumerologyCardProps) {
  const [prediction, setPrediction] = useState<NumerologyPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNumerology = async () => {
      setLoading(true);
      const lifePath = calculateLifePathNumber(new Date(profile.dateOfBirth));
      const destiny = calculateDestinyNumber(profile.name);

      try {
        const res = await fetch(`/api/numerology?lifePath=${lifePath}&destiny=${destiny}`);
        const data = await res.json();
        if (data.success) {
          setPrediction(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch numerology:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNumerology();
  }, [profile.name, profile.dateOfBirth]);

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative min-h-[400px]">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Calculator className="h-32 w-32" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-violet-500" />
          <span className="text-lg">Numerology Insights</span>
        </CardTitle>
        <CardDescription>
          Your cosmic blueprint based on {profile.name} and {new Date(profile.dateOfBirth).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Consulting the numbers...</p>
          </div>
        ) : prediction ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-violet-100 dark:border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Life Path Number
                </p>
                <span className="text-4xl font-bold text-slate-800 dark:text-white">{prediction.lifePath}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {prediction.lifePathMeaning}
              </p>
            </div>

            <div className="p-5 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-pink-100 dark:border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                  Destiny Number
                </p>
                <span className="text-4xl font-bold text-slate-800 dark:text-white">{prediction.destiny}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {prediction.destinyMeaning}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Unable to load predictions.</div>
        )}
      </CardContent>
    </Card>
  );
}
