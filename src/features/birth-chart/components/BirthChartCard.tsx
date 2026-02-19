"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Sparkles,
  Star,
} from "lucide-react";
import { BirthChartReading, ZodiacSign, Planet } from "@vibes/shared-types";
import { getZodiacDisplay, getZodiacSymbol } from "@vibes/shared-utils";
import { motion, AnimatePresence } from "framer-motion";

interface BirthChartCardProps {
  reading: BirthChartReading | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const PLANET_ICONS: Record<Planet, React.ReactNode> = {
  sun: <Sun className="h-4 w-4 text-amber-400" />,
  moon: <Moon className="h-4 w-4 text-slate-300" />,
  mercury: <Sparkles className="h-4 w-4 text-cyan-400" />,
  venus: <Star className="h-4 w-4 text-pink-400" />,
  mars: <Star className="h-4 w-4 text-red-500" />,
  jupiter: <Star className="h-4 w-4 text-orange-400" />,
  saturn: <Star className="h-4 w-4 text-amber-600" />,
  uranus: <Star className="h-4 w-4 text-cyan-300" />,
  neptune: <Star className="h-4 w-4 text-blue-400" />,
  pluto: <Star className="h-4 w-4 text-purple-600" />,
};

const SIGN_COLORS: Record<ZodiacSign, string> = {
  [ZodiacSign.ARIES]: "text-red-500",
  [ZodiacSign.TAURUS]: "text-green-600",
  [ZodiacSign.GEMINI]: "text-yellow-500",
  [ZodiacSign.CANCER]: "text-slate-300",
  [ZodiacSign.LEO]: "text-orange-500",
  [ZodiacSign.VIRGO]: "text-emerald-600",
  [ZodiacSign.LIBRA]: "text-pink-400",
  [ZodiacSign.SCORPIO]: "text-red-700",
  [ZodiacSign.SAGITTARIUS]: "text-purple-500",
  [ZodiacSign.CAPRICORN]: "text-amber-700",
  [ZodiacSign.AQUARIUS]: "text-cyan-500",
  [ZodiacSign.PISCES]: "text-indigo-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function BirthChartCard({
  reading,
  onRefresh,
  isRefreshing,
}: BirthChartCardProps) {
  const [expandedPlanet, setExpandedPlanet] = useState<Planet | null>("sun");

  if (!reading) {
    return (
      <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-8 right-8 w-2 h-2 bg-primary rounded-full"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Birth Chart
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          {isRefreshing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-12 w-12 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-center">
                Calculating your birth chart...
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sun className="h-12 w-12 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-center">
                👆 Enable Advanced Mode and add birth details to unlock your
                birth chart
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const { chart, interpretations, aspects, summary } = reading;

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-12 right-12 w-1.5 h-1.5 bg-primary rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-24 right-6 w-1 h-1 bg-accent rounded-full"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.4, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Birth Chart
            </span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-primary hover:text-accent hover:bg-accent/10"
            title="Refresh birth chart"
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl">{getZodiacSymbol(chart.sunSign)}</div>
              <div className="text-xs font-semibold text-muted-foreground">
                Sun
              </div>
              <div
                className={`text-sm font-bold ${SIGN_COLORS[chart.sunSign]}`}
              >
                {getZodiacDisplay(chart.sunSign)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl">{getZodiacSymbol(chart.moonSign)}</div>
              <div className="text-xs font-semibold text-muted-foreground">
                Moon
              </div>
              <div
                className={`text-sm font-bold ${SIGN_COLORS[chart.moonSign]}`}
              >
                {getZodiacDisplay(chart.moonSign)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl">⬆</div>
              <div className="text-xs font-semibold text-muted-foreground">
                Rising
              </div>
              <div
                className={`text-sm font-bold ${SIGN_COLORS[chart.risingSign]}`}
              >
                {getZodiacDisplay(chart.risingSign)}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground italic text-center"
        >
          {summary}
        </motion.div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wide">
            Planetary Positions
          </h4>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border rounded-xl border border-border overflow-hidden"
          >
            {chart.planets.map((pos) => (
              <motion.div key={pos.planet} variants={itemVariants}>
                <button
                  onClick={() =>
                    setExpandedPlanet(
                      expandedPlanet === pos.planet ? null : pos.planet,
                    )
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {PLANET_ICONS[pos.planet]}
                    <span className="font-semibold text-sm capitalize">
                      {pos.planet}
                    </span>
                    {pos.isRetrograde && (
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded">
                        R
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${SIGN_COLORS[pos.sign]}`}>
                      {getZodiacSymbol(pos.sign)} {getZodiacDisplay(pos.sign)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {pos.degree.toFixed(0)}°{pos.minutes}&apos;
                    </span>
                    {expandedPlanet === pos.planet ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedPlanet === pos.planet && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-muted/50"
                    >
                      <p className="text-sm text-muted-foreground p-3 leading-relaxed">
                        {interpretations[pos.planet]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {aspects.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wide">
              Key Aspects
            </h4>
            <div className="flex flex-wrap gap-2">
              {aspects.map((aspect, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                >
                  {aspect}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
