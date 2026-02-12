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
    <Card className="border-none shadow-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative min-h-[500px]">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl">
        {reading?.symbolEmoji}
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-3xl">{reading?.symbolEmoji}</span>
          <span className="text-lg">{reading?.title}</span>
        </CardTitle>
        <CardDescription>
          Chinese Zodiac: <span className="font-semibold text-orange-600">{chineseYear}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-muted-foreground">Reading the zodiac...</p>
          </div>
        ) : reading ? (
          <div className="space-y-4">
            {/* Description */}
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-zinc-700">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {reading.description}
              </p>
            </div>

            {/* Traits */}
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Key Traits
              </p>
              <div className="flex flex-wrap gap-2">
                {reading.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Lucky Numbers and Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-zinc-700">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                  Lucky Numbers
                </p>
                <div className="flex gap-2">
                  {reading.luckyNumbers.map((num) => (
                    <span key={num} className="text-lg font-bold text-orange-600 dark:text-orange-300">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-zinc-700">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                  Lucky Colors
                </p>
                <div className="flex gap-2 flex-wrap">
                  {reading.luckyColors.map((color) => (
                    <span key={color} className="text-xs font-semibold text-orange-600 dark:text-orange-300">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Compatibility */}
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Compatible Signs
              </p>
              <div className="flex flex-wrap gap-2">
                {reading.compatibility.map((sign) => (
                  <span
                    key={sign}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>

            {/* Element */}
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-orange-100 dark:border-zinc-700">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Element
              </p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{reading.element}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Unable to load zodiac reading.</div>
        )}
      </CardContent>
    </Card>
  );
}
