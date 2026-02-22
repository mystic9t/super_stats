"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, Sparkles, Star, Calendar } from "lucide-react";
import { DailyPrediction, ZodiacSign } from "@vibes/shared-types";
import { getZodiacSymbol, getZodiacDisplay } from "@vibes/shared-utils";
import { motion } from "framer-motion";
import { ShareButton } from "@/components/ShareButton";

interface DailyHoroscopeCardProps {
  prediction: DailyPrediction;
  sunSign: ZodiacSign;
  isLoading: boolean;
  onRefresh: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function DailyHoroscopeCard({
  prediction,
  sunSign,
  isLoading,
  onRefresh,
}: DailyHoroscopeCardProps) {
  const zodiacSymbol = getZodiacSymbol(sunSign);
  const zodiacName = getZodiacDisplay(sunSign);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Card
      ref={cardRef}
      className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative"
    >
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating stars */}
        <motion.div
          className="absolute top-8 right-12 w-2 h-2 bg-amber-400 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-16 right-24 w-1.5 h-1.5 bg-accent rounded-full"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-12 left-16 w-1 h-1 bg-primary rounded-full"
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Floating zodiac symbol */}
      <motion.div
        className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {zodiacSymbol}
      </motion.div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {zodiacSymbol}
            </motion.span>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {zodiacName}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(prediction.current_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cardRef.current && (
              <ShareButton
                targetRef={cardRef}
                filename={`daily-horoscope-${sunSign}-${prediction.current_date}.png`}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              />
            )}
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
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-foreground italic"
          >
            &ldquo;{prediction.description}&rdquo;
          </motion.p>

          {/* Lucky Number & Color */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Lucky Number
                </p>
                <motion.p
                  className="text-3xl font-bold text-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {prediction.lucky_number}
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Star className="h-3 w-3 text-accent" />
                  Power Color
                </p>
                <motion.p
                  className="text-3xl font-bold text-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {prediction.color}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
