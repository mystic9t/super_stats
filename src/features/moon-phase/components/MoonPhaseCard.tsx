"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, Sparkles, Moon, Calendar } from "lucide-react";
import {
  MoonPhaseData,
  MoonRitual,
  ZodiacMoonInfluence,
  ZodiacSign,
} from "@vibes/shared-types";
import { getZodiacDisplay, getZodiacSymbol } from "@vibes/shared-utils";
import { motion, AnimatePresence } from "framer-motion";

interface MoonPhaseCardProps {
  moonData: MoonPhaseData | null;
  moonZodiacSign: ZodiacSign | null;
  rituals: MoonRitual[];
  influence: ZodiacMoonInfluence | null;
  sunSign: ZodiacSign;
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * Animated Moon Phase Visualizer
 * Shows a realistic moon based on current illumination
 */
function AnimatedMoon({
  phase,
  illumination,
}: {
  phase: string;
  illumination: number;
}) {
  // Calculate shadow position based on illumination
  // The shadow overlay covers the dark portion of the moon
  const getShadowPosition = () => {
    if (phase.includes("waxing")) {
      // Waxing: illuminated portion grows from right edge
      // Shadow is on the left, so clip from right to reveal shadow on left
      // At 3% illumination: shadow covers 97% on left, thin crescent on right
      return illumination;
    } else if (phase.includes("waning")) {
      // Waning: illuminated portion shrinks from right edge
      // Shadow is on the right, so clip from left to reveal shadow on right
      // At 3% illumination: shadow covers 97% on right, thin crescent on left
      return illumination;
    } else if (phase === "full-moon") {
      return 0;
    } else {
      return 100;
    }
  };

  const shadowPosition = getShadowPosition();
  const isWaxing = phase.includes("waxing");
  const isWaning = phase.includes("waning");

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-400/10 blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Moon base */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-300 overflow-hidden shadow-2xl shadow-amber-500/20">
        {/* Moon texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-8 w-4 h-4 rounded-full bg-slate-400/50" />
          <div className="absolute bottom-6 right-6 w-6 h-6 rounded-full bg-slate-400/40" />
          <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-slate-400/30" />
        </div>

        {/* Shadow overlay */}
        <motion.div
          className="absolute inset-0 bg-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: (100 - illumination) / 100 }}
          style={{
            clipPath: isWaxing
              ? `inset(0 ${shadowPosition}% 0 0)`
              : isWaning
                ? `inset(0 0 0 ${shadowPosition}%)`
                : phase === "new-moon"
                  ? "inset(0)"
                  : "inset(100%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * MoonPhaseCard Component
 * Displays current moon phase with rituals and personalized influence
 */
export function MoonPhaseCard({
  moonData,
  moonZodiacSign,
  rituals,
  influence,
  sunSign,
  isLoading,
  onRefresh,
}: MoonPhaseCardProps) {
  if (!moonData || !influence) {
    return (
      <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Moon className="h-16 w-16 text-muted-foreground opacity-50" />
          </motion.div>
          <p className="text-muted-foreground">Loading moon phase...</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{moonData.emoji}</span>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Moon Phase
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Current lunar energy
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-accent hover:text-primary hover:bg-primary/10"
          >
            <RotateCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Moon Visual */}
        <div className="text-center space-y-3">
          <AnimatedMoon
            phase={moonData.phase}
            illumination={moonData.illumination}
          />
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {moonData.phaseName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {moonData.illumination}% illuminated • Day{" "}
              {Math.round(moonData.age)} of 29.5
            </p>
          </div>
        </div>

        {/* Moon in Zodiac */}
        {moonZodiacSign && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50">
            <span className="text-xl">{getZodiacSymbol(moonZodiacSign)}</span>
            <span className="text-sm text-muted-foreground">Moon in</span>
            <span className="font-semibold text-foreground">
              {getZodiacDisplay(moonZodiacSign)}
            </span>
          </div>
        )}

        {/* Upcoming Moon Events */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Next New Moon
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDate(moonData.nextNewMoon)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Next Full Moon
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDate(moonData.nextFullMoon)}
            </p>
          </div>
        </div>

        {/* Personalized Influence */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-foreground">
              For {getZodiacDisplay(sunSign)}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {influence.influence}
          </p>

          <div className="space-y-2">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Focus On:
              </span>
              <ul className="mt-1 space-y-1">
                {influence.focus.slice(0, 3).map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
                Avoid:
              </span>
              <ul className="mt-1 space-y-1">
                {influence.avoid.slice(0, 2).map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Rituals Section */}
        {rituals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Moon className="h-4 w-4 text-accent" />
              Recommended Rituals
            </h4>
            <AnimatePresence>
              {rituals.slice(0, 2).map((ritual, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-xl bg-muted/50 border border-border hover:border-accent/50 transition-colors"
                >
                  <h5 className="font-medium text-foreground mb-1">
                    {ritual.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    {ritual.description}
                  </p>
                  <ul className="space-y-1">
                    {ritual.actions.slice(0, 2).map((action, actionIdx) => (
                      <li
                        key={actionIdx}
                        className="text-xs text-foreground flex items-center gap-2"
                      >
                        <span className="text-accent">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
