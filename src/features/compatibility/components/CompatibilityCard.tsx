"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Briefcase,
  Sparkles,
  ChevronRight,
  Lightbulb,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { ZodiacSign, CompatibilityReading } from "@vibes/shared-types";
import { getZodiacSymbol, getZodiacDisplay } from "@vibes/shared-utils";
import { motion, AnimatePresence } from "framer-motion";

interface CompatibilityCardProps {
  userSign: ZodiacSign;
  reading: CompatibilityReading | null;
  partnerSign: ZodiacSign | null;
  isLoading: boolean;
  onSelectPartner: (sign: ZodiacSign) => void;
}

const ALL_SIGNS = Object.values(ZodiacSign);

function ScoreBar({
  label,
  score,
  icon: Icon,
  delay,
}: {
  label: string;
  score: number;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "from-emerald-500 to-emerald-400";
    if (s >= 60) return "from-amber-500 to-amber-400";
    if (s >= 40) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <motion.span
          className="text-sm font-bold text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {score}%
        </motion.span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function SignSelector({
  userSign,
  selectedSign,
  onSelect,
}: {
  userSign: ZodiacSign;
  selectedSign: ZodiacSign | null;
  onSelect: (sign: ZodiacSign) => void;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {ALL_SIGNS.filter((s) => s !== userSign).map((sign) => {
        const isSelected = sign === selectedSign;
        return (
          <motion.button
            key={sign}
            onClick={() => onSelect(sign)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                : "border-border bg-muted/50 hover:border-amber-400/50 hover:bg-muted"
            }`}
          >
            <span className="text-xl">{getZodiacSymbol(sign)}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide ${
                isSelected ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {getZodiacDisplay(sign).slice(0, 3)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function CompatibilityCard({
  userSign,
  reading,
  partnerSign,
  isLoading,
  onSelectPartner,
}: CompatibilityCardProps) {
  const userSymbol = getZodiacSymbol(userSign);
  const userName = getZodiacDisplay(userSign);

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-10 right-16 w-2 h-2 bg-pink-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 left-12 w-1.5 h-1.5 bg-accent rounded-full"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {userSymbol}
          </motion.span>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-pink-500 to-accent bg-clip-text text-transparent">
              {userName} Compatibility
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a sign to check your cosmic connection
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {/* Sign Selector */}
        <SignSelector
          userSign={userSign}
          selectedSign={partnerSign}
          onSelect={onSelectPartner}
        />

        {/* Results */}
        <AnimatePresence mode="wait">
          {reading && partnerSign && (
            <motion.div
              key={partnerSign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Pair Header */}
              <div className="flex items-center justify-center gap-3 py-3">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-3xl">{getZodiacSymbol(userSign)}</span>
                  <span className="text-xs font-bold text-muted-foreground mt-1">
                    {getZodiacDisplay(userSign)}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <Heart className="h-6 w-6 text-pink-500" />
                  <span className="text-lg font-black text-accent mt-0.5">
                    {reading.scores.overall}%
                  </span>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-3xl">
                    {getZodiacSymbol(partnerSign)}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground mt-1">
                    {getZodiacDisplay(partnerSign)}
                  </span>
                </motion.div>
              </div>

              {/* Summary */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm leading-relaxed text-foreground italic text-center"
              >
                &ldquo;{reading.summary}&rdquo;
              </motion.p>

              {/* Score Bars */}
              <div className="space-y-3">
                <ScoreBar
                  label="Love"
                  score={reading.scores.love}
                  icon={Heart}
                  delay={0.3}
                />
                <ScoreBar
                  label="Friendship"
                  score={reading.scores.friendship}
                  icon={Users}
                  delay={0.4}
                />
                <ScoreBar
                  label="Work"
                  score={reading.scores.work}
                  icon={Briefcase}
                  delay={0.5}
                />
              </div>

              {/* Category Summaries */}
              <div className="space-y-3">
                {[
                  {
                    icon: Heart,
                    label: "Love",
                    text: reading.loveSummary,
                    color: "text-pink-500",
                  },
                  {
                    icon: Users,
                    label: "Friendship",
                    text: reading.friendshipSummary,
                    color: "text-blue-400",
                  },
                  {
                    icon: Briefcase,
                    label: "Work",
                    text: reading.workSummary,
                    color: "text-emerald-400",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-3 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Strengths & Challenges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                      Strengths
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {reading.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <ChevronRight className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                      Challenges
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {reading.challenges.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <ChevronRight className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Cosmic Tip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-pink-500/10 border border-accent/20"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
                      Cosmic Tip
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {reading.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
