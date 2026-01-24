'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, RotateCcw, Sparkles, Star, Moon, Calendar, RotateCw } from 'lucide-react';
import { NumerologyCard } from '@/features/numerology/components/NumerologyCard';
import { TarotReading } from '@/components/TarotReading';
import { DashboardProps } from '@/types';

/**
 * Dashboard Component
 * Main dashboard displaying predictions and tarot readings
 */
export function Dashboard({
  profile,
  onClear,
  prediction,
  loading,
  onGetPrediction,
  onRefreshPrediction,
  onEdit,
  tarotReading,
  tarotLoading,
  canDrawTarot,
  onGetTarot,
  onRefreshTarot,
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'prediction' | 'tarot' | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-switch to newly loaded content only on first load
  useEffect(() => {
    if (prediction && !hasInteracted) {
      setActiveSection('prediction');
    }
  }, [prediction, hasInteracted]);

  // Handle manual section changes
  const handleSectionChange = (section: 'prediction' | 'tarot' | null) => {
    setActiveSection(section);
    setHasInteracted(true);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome, {profile.name}!
            </CardTitle>
            <CardDescription>
              Sun Sign: <span className="font-semibold text-indigo-500 capitalize">{profile.sunSign}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="text-red-500 hover:text-red-600 hover:bg-red-50/10"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Prediction Button */}
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === 'prediction') {
                  handleSectionChange(null);
                } else {
                  onGetPrediction();
                  handleSectionChange('prediction');
                }
              }}
              variant={activeSection === 'prediction' ? 'default' : 'outline'}
              disabled={loading}
              className={`sm:flex-1 w-full font-semibold py-4 sm:py-6 px-3 sm:px-4 text-sm sm:text-base rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                activeSection === 'prediction'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-slate-900 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  <span className="hidden sm:inline">Divining...</span>
                  <span className="sm:hidden">Divining</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Star className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span className="hidden sm:inline">
                    {activeSection === 'prediction' ? 'Hide Prediction' : 'Daily Prediction'}
                  </span>
                  <span className="sm:hidden">{activeSection === 'prediction' ? 'Hide' : 'Predict'}</span>
                </span>
              )}
            </Button>

            {/* Tarot Button */}
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === 'tarot') {
                  handleSectionChange(null);
                } else {
                  onGetTarot();
                  handleSectionChange('tarot');
                }
              }}
              variant={activeSection === 'tarot' ? 'default' : 'outline'}
              disabled={tarotLoading}
              className={`sm:flex-1 w-full font-semibold py-4 sm:py-6 px-3 sm:px-4 text-sm sm:text-base rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                activeSection === 'tarot'
                  ? 'bg-gradient-to-r from-indigo-900 to-purple-900 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-slate-900 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-white'
              }`}
            >
              {tarotLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Moon className="h-4 sm:h-5 w-4 sm:w-5 animate-pulse" />
                  <span className="hidden sm:inline">Drawing...</span>
                  <span className="sm:hidden">Drawing</span>
                </span>
              ) : !canDrawTarot && !tarotReading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Moon className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span className="hidden sm:inline">View Tarot</span>
                  <span className="sm:hidden">Tarot</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Moon className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span className="hidden sm:inline">
                    {activeSection === 'tarot' ? 'Hide Tarot' : 'Daily Tarot'}
                  </span>
                  <span className="sm:hidden">{activeSection === 'tarot' ? 'Hide' : 'Tarot'}</span>
                </span>
              )}
            </Button>
          </div>

          {!canDrawTarot && tarotReading && activeSection !== 'tarot' && (
            <p className="text-xs text-center text-slate-500 mt-2">Tarot reading ready to view.</p>
          )}
        </CardContent>
      </Card>

      {/* Content Area - Collapsible Sections */}
      <div className="space-y-6">
        {prediction && activeSection === 'prediction' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="h-32 w-32" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span className="text-lg">Forecast for {prediction.current_date}</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRefreshPrediction}
                    disabled={loading}
                    className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/10"
                    title="Refresh prediction"
                  >
                    <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
                  "{prediction.description}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lucky Number</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {prediction.lucky_number}
                    </p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {prediction.color}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <NumerologyCard profile={profile} />
          </div>
        )}

        {tarotReading && activeSection === 'tarot' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <TarotReading reading={tarotReading} onRefresh={onRefreshTarot} isRefreshing={tarotLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
