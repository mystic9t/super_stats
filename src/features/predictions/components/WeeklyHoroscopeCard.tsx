"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, RotateCw, Sparkles } from "lucide-react";
import { WeeklyPrediction } from "@vibes/shared-types";

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
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-accent" />
            <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Week of {prediction.week}
            </CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-accent hover:text-primary hover:bg-primary/10"
            title="Refresh weekly prediction"
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
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Lucky Number</p>
            <p className="text-3xl font-bold text-accent">{prediction.lucky_number}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Power Color</p>
            <p className="text-3xl font-bold text-accent">{prediction.color}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-accent/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Vibe</p>
            <p className="text-lg font-bold text-amber-500 capitalize">{prediction.mood}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-400/10 to-primary/10 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Connection</p>
            <p className="text-lg font-bold text-cyan-400 capitalize">{prediction.compatibility}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
