'use client';

import { useEffect, useState } from 'react';
import { UserProfile, ChineseZodiacReading } from '@vibes/shared-types';
import { calculateChineseZodiac, getChineseZodiacReading } from '@vibes/shared-utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ChineseZodiacCardProps {
  profile: UserProfile;
}

/**
 * ChineseZodiacCard Component
 * Displays Chinese zodiac insights based on user profile
 */
export function ChineseZodiacCard({ profile }: ChineseZodiacCardProps) {
  const [reading, setReading] = useState<ChineseZodiacReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [chineseYear, setChineseYear] = useState<string>('');

  useEffect(() => {
    const fetchChineseZodiac = async () => {
      setLoading(true);
      try {
        const chineseProfile = calculateChineseZodiac(new Date(profile.dateOfBirth));
        const zodiacReading = getChineseZodiacReading(chineseProfile.sign);
        setReading(zodiacReading);
        setChineseYear(chineseProfile.chineseYear);
      } catch (error) {
        console.error('Failed to fetch Chinese zodiac:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChineseZodiac();
  }, [profile.dateOfBirth]);

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl">
        {reading?.symbolEmoji}
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{reading?.symbolEmoji}</span>
            <div>
              <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {reading?.title}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Year: <span className="font-semibold text-accent">{chineseYear}</span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-muted-foreground">Reading the zodiac...</p>
          </div>
        ) : reading ? (
          <div className="space-y-4">
            {/* Description */}
            <p className="text-base leading-relaxed text-foreground italic">
              "{reading.description}"
            </p>

            {/* Lucky Numbers and Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Lucky Numbers
                </p>
                <div className="flex gap-2">
                  {reading.luckyNumbers.map((num) => (
                    <span key={num} className="text-xl font-bold text-accent">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Lucky Colors
                </p>
                <div className="flex gap-2 flex-wrap">
                  {reading.luckyColors.map((color) => (
                    <span key={color} className="text-xs font-semibold text-accent">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Traits & Compatible Signs */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Traits
                </p>
                <div className="flex flex-wrap gap-1">
                  {reading.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Compatible
                </p>
                <div className="flex flex-wrap gap-1">
                  {reading.compatibility.map((sign) => (
                    <span
                      key={sign}
                      className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded"
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Element */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Element
              </p>
              <p className="font-semibold text-foreground">{reading.element}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Unable to load zodiac reading.</div>
        )}
      </CardContent>
    </Card>
  );
}
