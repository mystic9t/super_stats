"use client";

import { ChineseZodiacReading, ChineseZodiacSign } from "@vibes/shared-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ChineseZodiacCardProps {
  reading: ChineseZodiacReading | null;
  chineseYear: string | null;
  element: string | null;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

// Get element color based on the specific element
const getElementColor = (element: string | null): string => {
  switch (element?.toLowerCase()) {
    case "wood":
      return "text-emerald-500";
    case "fire":
      return "text-red-500";
    case "earth":
      return "text-yellow-600";
    case "metal":
      return "text-slate-400";
    case "water":
      return "text-blue-500";
    default:
      return "text-primary";
  }
};

// Get element bg color
const getElementBgColor = (element: string | null): string => {
  switch (element?.toLowerCase()) {
    case "wood":
      return "bg-emerald-500/20";
    case "fire":
      return "bg-red-500/20";
    case "earth":
      return "bg-yellow-600/20";
    case "metal":
      return "bg-slate-400/20";
    case "water":
      return "bg-blue-500/20";
    default:
      return "bg-primary/20";
  }
};

// Get all zodiac emojis for the circle
const ZODIAC_ORDER = [
  { sign: ChineseZodiacSign.RAT, emoji: "🐭", position: 0 },
  { sign: ChineseZodiacSign.OX, emoji: "🐂", position: 30 },
  { sign: ChineseZodiacSign.TIGER, emoji: "🐯", position: 60 },
  { sign: ChineseZodiacSign.RABBIT, emoji: "🐰", position: 90 },
  { sign: ChineseZodiacSign.DRAGON, emoji: "🐉", position: 120 },
  { sign: ChineseZodiacSign.SNAKE, emoji: "🐍", position: 150 },
  { sign: ChineseZodiacSign.HORSE, emoji: "🐴", position: 180 },
  { sign: ChineseZodiacSign.GOAT, emoji: "🐐", position: 210 },
  { sign: ChineseZodiacSign.MONKEY, emoji: "🐵", position: 240 },
  { sign: ChineseZodiacSign.ROOSTER, emoji: "🐓", position: 270 },
  { sign: ChineseZodiacSign.DOG, emoji: "🐕", position: 300 },
  { sign: ChineseZodiacSign.PIG, emoji: "🐷", position: 330 },
];

export function ChineseZodiacCard({
  reading,
  chineseYear,
  element,
  isLoading,
}: ChineseZodiacCardProps) {
  const elementColorClass = getElementColor(element);
  const elementBgClass = getElementBgColor(element);

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      {/* Zodiac Circle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Outer circle with zodiac animals */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
          {/* Circle border */}
          <div className="absolute inset-0 rounded-full border-2 border-border/30" />

          {/* Zodiac emojis positioned in circle */}
          {ZODIAC_ORDER.map((zodiac) => {
            const angle = (zodiac.position - 90) * (Math.PI / 180); // Start from top
            const radius = 220; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = reading?.sign === zodiac.sign;

            return (
              <motion.div
                key={zodiac.sign}
                className={`absolute text-xl transition-all duration-300 ${
                  isActive ? "text-3xl scale-150 z-10" : "opacity-30 text-lg"
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={
                  isActive
                    ? {
                        scale: [1.2, 1.4, 1.2],
                        rotate: [0, 10, -10, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {zodiac.emoji}
              </motion.div>
            );
          })}

          {/* Inner decorative circles */}
          <div className="absolute inset-8 rounded-full border border-border/20" />
          <div className="absolute inset-16 rounded-full border border-border/10" />

          {/* Center element symbol */}
          {element && (
            <motion.div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl ${elementColorClass}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {element === "Wood" && "🌳"}
              {element === "Fire" && "🔥"}
              {element === "Earth" && "🌍"}
              {element === "Metal" && "⚜️"}
              {element === "Water" && "💧"}
            </motion.div>
          )}
        </div>

        {/* Floating stars */}
        <motion.div
          className="absolute top-8 right-16 w-2 h-2 bg-orange-400 rounded-full"
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
          className="absolute top-20 right-8 w-1.5 h-1.5 bg-accent rounded-full"
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
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {reading?.symbolEmoji || "🐉"}
            </motion.span>
            <div>
              <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {reading?.title || "Chinese Zodiac"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                <span className="font-semibold text-accent">
                  {chineseYear || "..."}
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {isLoading ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-orange-500" />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Reading the zodiac...
            </p>
          </motion.div>
        ) : reading ? (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base leading-relaxed text-foreground italic"
            >
              &ldquo;{reading.description}&rdquo;
            </motion.p>

            {/* Lucky Numbers and Colors */}
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
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Lucky Numbers
                </p>
                <div className="flex gap-2">
                  {reading.luckyNumbers?.map((num, index) => (
                    <motion.span
                      key={num}
                      className="text-xl font-bold text-accent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {num}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Lucky Colors
                </p>
                <div className="flex gap-2 flex-wrap">
                  {reading.luckyColors?.map((color, index) => (
                    <motion.span
                      key={color}
                      className="text-xs font-semibold text-accent"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {color}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Traits & Compatible Signs */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 text-sm"
            >
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Traits
                </p>
                <motion.div
                  className="flex flex-wrap gap-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {reading.traits?.map((trait) => (
                    <motion.span
                      key={trait}
                      variants={tagVariants}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded cursor-default"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Compatible
                </p>
                <motion.div
                  className="flex flex-wrap gap-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {reading.compatibility?.map((sign) => (
                    <motion.span
                      key={sign}
                      variants={tagVariants}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded cursor-default"
                    >
                      {sign}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Element - Now showing the specific calculated element */}
            <motion.div
              variants={itemVariants}
              className={`p-4 rounded-xl ${elementBgClass} border border-border relative overflow-hidden group`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Element
                  </p>
                  <p className={`font-bold text-lg ${elementColorClass}`}>
                    {element || "Unknown"}
                  </p>
                </div>
                <div className={`text-3xl ${elementColorClass} opacity-80`}>
                  {element === "Wood" && "🌳"}
                  {element === "Fire" && "🔥"}
                  {element === "Earth" && "🌍"}
                  {element === "Metal" && "⚜️"}
                  {element === "Water" && "💧"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-muted-foreground py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Unable to load zodiac reading.
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
