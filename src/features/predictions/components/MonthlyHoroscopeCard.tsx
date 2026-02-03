"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCw, Star, AlertTriangle } from "lucide-react";
import { MonthlyPrediction } from "@super-stats/shared-types";

interface MonthlyHoroscopeCardProps {
  prediction: MonthlyPrediction;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function MonthlyHoroscopeCard({
  prediction,
  onRefresh,
  isRefreshing,
}: MonthlyHoroscopeCardProps) {
  // Parse standout and challenging days into arrays
  const standoutDays = prediction.standout_days
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  const challengingDays = prediction.challenging_days
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Calendar className="h-32 w-32" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <span className="text-lg">{prediction.month}</span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-purple-500 hover:text-purple-600 hover:bg-purple-50/10"
            title="Refresh monthly prediction"
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

        {/* Standout Days - Badge Chips */}
        {standoutDays.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Standout Days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {standoutDays.map((day, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Challenging Days - Badge Chips */}
        {challengingDays.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Challenging Days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {challengingDays.map((day, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lucky Number
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {prediction.lucky_number}
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Color
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {prediction.color}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Compatibility
            </p>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 capitalize">
              {prediction.compatibility}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
