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
import { NumerologyReading, NumerologyNumber } from "@vibes/shared-types";

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
    const colorMap: Record<SectionKey, string> = {
      lifePath: "text-accent",
      destiny: "text-primary",
      soulUrge: "text-accent",
      personality: "text-amber-500",
      birthday: "text-cyan-400",
      personalYear: "text-accent",
    };

    return (
      <div className="border-b border-border last:border-0">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className={`text-4xl font-bold min-w-[3rem] ${colorMap[key]}`}>
              {numberData.number}
            </span>
            <div className="text-left">
              <p className="font-bold text-foreground">
                {numberData.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {numberData.description}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-primary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-primary" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200 bg-primary/5">
            <p className="text-foreground leading-relaxed pl-[3.5rem]">
              {numberData.meaning}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!reading) {
    return (
      <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Numerology Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Sparkles className="h-12 w-12 text-primary animate-float" />
          <p className="text-muted-foreground text-center">
            👆 Click the Numerology button to reveal your cosmic numbers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Numerology Reading</span>
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
        <div className="divide-y divide-border">
          {renderSection("lifePath", reading.lifePath, "")}
          {renderSection("destiny", reading.destiny, "")}
          {renderSection("soulUrge", reading.soulUrge, "")}
          {renderSection("personality", reading.personality, "")}
          {renderSection("birthday", reading.birthday, "")}
          {renderSection("personalYear", reading.personalYear, "")}
        </div>

        <p className="mt-4 text-xs text-center text-muted-foreground">
          ✨ Based on your name and birthdate for {reading.currentYear}
        </p>
      </CardContent>
    </Card>
  );
}
