"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";
import {
  Sparkles,
  RotateCw,
  Gem,
  Palette,
  BookOpen,
  Flame,
  Droplets,
  Wind,
  Mountain,
} from "lucide-react";
import { DailyAffirmation, ZodiacSign } from "@vibes/shared-types";
import { getZodiacSymbol, getZodiacDisplay } from "@vibes/shared-utils";
import { motion, AnimatePresence } from "framer-motion";

interface AffirmationCardProps {
  affirmation: DailyAffirmation | null;
  sunSign: ZodiacSign;
  isLoading: boolean;
  onRefresh: () => void;
}

const ELEMENT_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    bgAccent: string;
    textAccent: string;
  }
> = {
  fire: {
    icon: Flame,
    gradient: "from-orange-500/20 via-red-500/10 to-amber-500/20",
    bgAccent: "bg-orange-500/10",
    textAccent: "text-orange-400",
  },
  earth: {
    icon: Mountain,
    gradient: "from-emerald-500/20 via-green-500/10 to-lime-500/20",
    bgAccent: "bg-emerald-500/10",
    textAccent: "text-emerald-400",
  },
  air: {
    icon: Wind,
    gradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    bgAccent: "bg-sky-500/10",
    textAccent: "text-sky-400",
  },
  water: {
    icon: Droplets,
    gradient: "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
    bgAccent: "bg-blue-500/10",
    textAccent: "text-blue-400",
  },
};

export function AffirmationCard({
  affirmation,
  sunSign,
  isLoading,
  onRefresh,
}: AffirmationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!affirmation) {
    return (
      <Card className="border border-border bg-card/95 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">
            Loading your cosmic affirmation...
          </p>
        </CardContent>
      </Card>
    );
  }

  const config = ELEMENT_CONFIG[affirmation.element];
  const ElementIcon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={affirmation.date + affirmation.sign}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          ref={cardRef}
          className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative"
        >
          {/* Floating element particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-gradient-radial ${config.gradient} rounded-full blur-3xl opacity-50`}
            />
            <div
              className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial ${config.gradient} rounded-full blur-3xl opacity-30`}
            />
          </div>

          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${config.bgAccent} backdrop-blur-sm`}
              >
                <Sparkles className={`h-5 w-5 ${config.textAccent}`} />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                  Daily Affirmation
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {getZodiacSymbol(sunSign)} {getZodiacDisplay(sunSign)} •{" "}
                  {affirmation.cosmicTheme}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {cardRef.current && (
                <ShareButton
                  targetRef={cardRef}
                  filename={`affirmation-${affirmation.date}.png`}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isLoading}
                className="text-accent hover:text-amber-400 hover:bg-amber-500/10 h-8 w-8"
                aria-label="Refresh affirmation"
              >
                <RotateCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-4 px-4 sm:px-6 pb-6">
            {/* Main Affirmation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`p-5 sm:p-6 rounded-2xl ${config.bgAccent} border border-border/50 backdrop-blur-sm`}
            >
              <p className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed text-center italic">
                &ldquo;{affirmation.affirmation}&rdquo;
              </p>
            </motion.div>

            {/* Mantra */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-muted/50 border border-border/30"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                Today&apos;s Mantra
              </p>
              <p className="text-sm sm:text-base text-foreground/90 font-medium">
                {affirmation.mantra}
              </p>
            </motion.div>

            {/* Cosmic Toolkit Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {/* Element */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/20">
                <ElementIcon
                  className={`h-5 w-5 mb-1.5 ${config.textAccent}`}
                />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Element
                </span>
                <span className="text-xs font-semibold text-foreground capitalize">
                  {affirmation.element}
                </span>
              </div>

              {/* Chakra */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/20">
                <div className="h-5 w-5 mb-1.5 rounded-full bg-gradient-to-br from-violet-400 to-purple-600" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Chakra
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {affirmation.chakra}
                </span>
              </div>

              {/* Color */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/20">
                <Palette className="h-5 w-5 mb-1.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Color
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {affirmation.color}
                </span>
              </div>

              {/* Crystal */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/20">
                <Gem className="h-5 w-5 mb-1.5 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Crystal
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {affirmation.crystal}
                </span>
              </div>
            </motion.div>

            {/* Journal Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Journal Prompt
                </p>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {affirmation.journalPrompt}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
