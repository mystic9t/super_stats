"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCw, Star, AlertTriangle } from "lucide-react";
import { MonthlyPrediction, ZodiacSign } from "@vibes/shared-types";
import { getZodiacSymbol, getZodiacDisplay } from "@vibes/shared-utils";

interface MonthlyHoroscopeCardProps {
  prediction: MonthlyPrediction;
  sunSign: ZodiacSign;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function MonthlyHoroscopeCard({
  prediction,
  sunSign,
  onRefresh,
  isRefreshing,
}: MonthlyHoroscopeCardProps) {
  const zodiacSymbol = getZodiacSymbol(sunSign);
  const zodiacName = getZodiacDisplay(sunSign);

  const standoutDays = prediction.standout_days
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  const challengingDays = prediction.challenging_days
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl">
        {zodiacSymbol}
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{zodiacSymbol}</span>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {zodiacName}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {prediction.month}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-primary hover:text-accent hover:bg-accent/10"
            title="Refresh monthly prediction"
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-base leading-relaxed text-foreground italic">
          "{prediction.description}"
        </p>

        {/* Standout Days - Cosmic Vibes */}
        {standoutDays.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-bold text-amber-500 uppercase tracking-wider">
                Peak Days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {standoutDays.map((day, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500/20 to-accent/20 border border-border text-amber-500"
                >
                  ✨ {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Challenging Days - Gentle Warning */}
        {challengingDays.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <p className="text-sm font-bold text-accent uppercase tracking-wider">
                Reflection Days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {challengingDays.map((day, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-accent/20 to-primary/20 border border-border text-accent"
                >
                  🌙 {day}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Lucky Number
            </p>
            <p className="text-3xl font-bold text-primary">
              {prediction.lucky_number}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Power Color
            </p>
            <p className="text-3xl font-bold text-accent">{prediction.color}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-400/10 to-accent/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Connection Energy
            </p>
            <p className="text-lg font-bold text-cyan-400 capitalize">
              {prediction.compatibility}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
