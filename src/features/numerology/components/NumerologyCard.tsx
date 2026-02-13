'use client';

import { useEffect, useState } from 'react';
import { UserProfile, NumerologyPrediction } from '@vibes/shared-types';
import { calculateLifePathNumber, calculateDestinyNumber } from '@vibes/shared-utils';
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
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Numerology Insights</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your cosmic blueprint revealed ✨
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Consulting the cosmic numbers...</p>
          </div>
        ) : prediction ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  Life Path Number
                </p>
                <span className="text-5xl font-bold text-accent">{prediction.lifePath}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                {prediction.lifePathMeaning}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold text-accent uppercase tracking-wider">
                  Destiny Number
                </p>
                <span className="text-5xl font-bold text-accent">{prediction.destiny}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium">
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
