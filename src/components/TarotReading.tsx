"use client";

import { TarotReading as TarotReadingType } from "@vibes/shared-types";
import { TarotCard } from "./TarotCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCw, Wand2 } from "lucide-react";

interface TarotReadingProps {
  reading: TarotReadingType;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function TarotReading({
  reading,
  onRefresh,
  isRefreshing,
}: TarotReadingProps) {
  const [situation, challenge, outcome] = reading.cards;

  return (
    <Card className="border border-border shadow-2xl bg-gradient-to-br from-card via-card/95 to-card overflow-hidden relative">
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-10 left-8 w-3 h-3 bg-primary rounded-full animate-pulse opacity-70" />
        <div
          className="absolute top-20 right-16 w-2 h-2 bg-accent rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-12 left-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-12 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-32 right-8 w-2 h-2 bg-accent rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-80 h-80 border border-primary/20 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 border border-accent/20 rounded-full" />
      </div>

      <CardHeader className="relative z-10 text-center pb-4">
        <div className="flex items-center justify-center gap-3">
          <Wand2 className="h-5 w-5 text-accent animate-bounce" />
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
              Your Cosmic Reading
            </span>
          </CardTitle>
          <Wand2
            className="h-5 w-5 text-primary animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
        </div>
        <div className="flex items-center justify-between mt-1 px-4">
          <CardDescription className="text-muted-foreground">
            ✨{" "}
            {new Date(reading.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            ✨
          </CardDescription>
          {onRefresh && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-accent hover:text-amber-500 hover:border-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 text-xs"
              title="Redraw cards"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Redraw</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4 pb-6 px-4">
        {/* Card Spread Labels */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Situation
            </span>
            <TarotCard drawnCard={situation} />
          </div>
          <div className="hidden sm:flex text-primary/40">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Challenge
            </span>
            <TarotCard drawnCard={challenge} />
          </div>
          <div className="hidden sm:flex text-accent/40">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Outcome
            </span>
            <TarotCard drawnCard={outcome} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <Wand2 className="h-4 w-4 text-accent" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        {/* Reading Summary */}
        <div className="px-4 py-4 rounded-2xl bg-muted/50 border border-border backdrop-blur-sm">
          <h3 className="text-sm font-bold text-accent mb-3 uppercase tracking-wider text-center">
            ✨ Your Message
          </h3>
          <p className="text-sm text-foreground leading-relaxed text-center italic">
            "{reading.summary}"
          </p>
        </div>

        {/* Guidance */}
        <div className="text-center px-3 py-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            🌙 The cards guide, you decide 🌙
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
