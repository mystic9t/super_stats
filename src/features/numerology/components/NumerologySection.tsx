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
} from "lucide-react";
import { NumerologyReading, NumerologyNumber } from "@super-stats/shared-types";

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
    colorClass: string,
  ) => {
    if (!numberData) return null;

    const isExpanded = expandedSections[key];

    return (
      <div
        className={`border-b border-violet-100 dark:border-zinc-700 last:border-0 ${colorClass}`}
      >
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 hover:bg-violet-50/50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-violet-600 dark:text-violet-400 min-w-[3rem]">
              {numberData.number}
            </span>
            <div className="text-left">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {numberData.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {numberData.description}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-violet-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-violet-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-[3.5rem]">
              {numberData.meaning}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!reading) {
    return (
      <Card className="border-none shadow-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Calculator className="h-32 w-32" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-violet-500" />
            <span className="text-lg">Numerology Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Sparkles className="h-12 w-12 text-violet-400 animate-pulse" />
          <p className="text-slate-500 dark:text-slate-400 text-center">
            Click the button below to reveal your cosmic numbers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Calculator className="h-32 w-32" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-violet-500" />
            <span className="text-lg">Your Numerology Reading</span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-violet-500 hover:text-violet-600 hover:bg-violet-50/10"
            title="Refresh numerology reading"
          >
            <RotateCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="divide-y divide-violet-100 dark:divide-zinc-700">
          {renderSection("lifePath", reading.lifePath, "")}
          {renderSection("destiny", reading.destiny, "")}
          {renderSection("soulUrge", reading.soulUrge, "")}
          {renderSection("personality", reading.personality, "")}
          {renderSection("birthday", reading.birthday, "")}
          {renderSection("personalYear", reading.personalYear, "")}
        </div>

        <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500">
          Based on your name and birthdate for {reading.currentYear}
        </p>
      </CardContent>
    </Card>
  );
}
