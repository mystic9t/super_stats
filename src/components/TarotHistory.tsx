"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TarotReading, UserProfile } from "@vibes/shared-types";
import { getReadingHistory } from "@vibes/shared-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History, Sparkles } from "lucide-react";
import Image from "next/image";

interface TarotHistoryProps {
  profile: UserProfile | null;
}

export function TarotHistory({ profile }: TarotHistoryProps) {
  const [history, setHistory] = useState<TarotReading[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (profile) {
      const readings = getReadingHistory(profile);
      setHistory(readings);
    }
  }, [profile]);

  if (!profile || history.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
            <History className="h-5 w-5" />
            Past Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm text-center py-4">
            No past readings yet. Your tarot history will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedReading = history[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
          <History className="h-5 w-5" />
          Past Readings
          <span className="text-xs text-slate-400 ml-auto">
            {history.length} {history.length === 1 ? "reading" : "readings"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Navigation */}
        {history.length > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={selectedIndex === 0}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-slate-300">
              {formatDate(selectedReading.date)}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={selectedIndex === history.length - 1}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Cards Preview */}
        <div className="flex justify-center gap-3">
          {selectedReading.cards.map((drawnCard, index) => (
            <div
              key={`${selectedReading.date}-${index}`}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`
                  relative w-16 h-24 rounded overflow-hidden
                  bg-gradient-to-br from-amber-700 to-amber-800
                  ${drawnCard.isReversed ? "rotate-180" : ""}
                `}
              >
                <Image
                  src={drawnCard.card.imageUrl}
                  alt={drawnCard.card.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-slate-400 capitalize">
                {drawnCard.position}
              </span>
            </div>
          ))}
        </div>

        {/* Summary Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
        >
          {isExpanded ? "Hide" : "Show"} Summary
        </Button>

        {/* Expanded Summary */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-slate-900/50"
          >
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;{selectedReading.summary}&rdquo;
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
