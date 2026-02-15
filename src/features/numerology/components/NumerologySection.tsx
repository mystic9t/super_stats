"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Hash,
} from "lucide-react";
import { NumerologyReading, NumerologyNumber } from "@vibes/shared-types";
import { motion, AnimatePresence } from "framer-motion";

interface NumerologySectionProps {
  reading: NumerologyReading | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

type SectionKey =
  | "lifePath"
  | "destiny"
  | "soulUrge"
  | "personality"
  | "birthday"
  | "personalYear";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function NumerologySection({
  reading,
  onRefresh,
  isRefreshing,
}: NumerologySectionProps) {
  // Default: Life Path expanded, rest collapsed
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    lifePath: true,
    destiny: false,
    soulUrge: false,
    personality: false,
    birthday: false,
    personalYear: false,
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (
    key: SectionKey,
    numberData: NumerologyNumber | undefined,
  ) => {
    if (!numberData) return null;

    const isExpanded = expandedSections[key];
    const colorMap: Record<SectionKey, string> = {
      lifePath: "text-accent",
      destiny: "text-primary",
      soulUrge: "text-accent",
      personality: "text-amber-500",
      birthday: "text-cyan-400",
      personalYear: "text-accent",
    };

    const iconMap: Record<SectionKey, React.ReactNode> = {
      lifePath: <Sparkles className="h-4 w-4" />,
      destiny: <Hash className="h-4 w-4" />,
      soulUrge: <Sparkles className="h-4 w-4" />,
      personality: <Hash className="h-4 w-4" />,
      birthday: <Hash className="h-4 w-4" />,
      personalYear: <Sparkles className="h-4 w-4" />,
    };

    return (
      <motion.div
        variants={itemVariants}
        className="border-b border-border last:border-0"
      >
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <motion.span
              className={`text-4xl font-bold min-w-[3rem] ${colorMap[key]}`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {numberData.number}
            </motion.span>
            <div className="text-left">
              <p className="font-bold text-foreground flex items-center gap-2">
                <span className="text-primary/60">{iconMap[key]}</span>
                {numberData.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {numberData.description}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
            )}
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden bg-primary/5"
            >
              <motion.p
                className="text-foreground leading-relaxed pl-[3.5rem] pr-4 py-4"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {numberData.meaning}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!reading) {
    return (
      <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-8 right-8 w-2 h-2 bg-primary rounded-full"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20"
              whileHover={{ scale: 1.05 }}
            >
              <Calculator className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Numerology Insights
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
          <p className="text-muted-foreground text-center">
            👆 Click the Numerology button to reveal your cosmic numbers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-12 right-12 w-1.5 h-1.5 bg-primary rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-24 right-6 w-1 h-1 bg-accent rounded-full"
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.4, 1],
          }}
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
              <Calculator className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Numerology Reading
            </span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-primary hover:text-accent hover:bg-accent/10"
            title="Refresh numerology reading"
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <motion.div
          className="divide-y divide-border"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderSection("lifePath", reading.lifePath)}
          {renderSection("destiny", reading.destiny)}
          {renderSection("soulUrge", reading.soulUrge)}
          {renderSection("personality", reading.personality)}
          {renderSection("birthday", reading.birthday)}
          {renderSection("personalYear", reading.personalYear)}
        </motion.div>

        <motion.p
          className="mt-4 text-xs text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ✨ Based on your name and birthdate for {reading.currentYear}
        </motion.p>
      </CardContent>
    </Card>
  );
}
