"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, RotateCw, Sparkles } from "lucide-react";
import { WeeklyPrediction } from "@super-stats/shared-types";

interface WeeklyHoroscopeCardProps {
  prediction: WeeklyPrediction;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function WeeklyHoroscopeCard({
  prediction,
  onRefresh,
  isRefreshing,
}: WeeklyHoroscopeCardProps) {
  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <CalendarDays className="h-32 w-32" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            <span className="text-lg">Week of {prediction.week}</span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
            title="Refresh weekly prediction"
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
          "{prediction.description}"
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lucky Number
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {prediction.lucky_number}
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Color
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {prediction.color}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mood
            </p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {prediction.mood}
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Compatibility
            </p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">
              {prediction.compatibility}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
