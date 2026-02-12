"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  RotateCcw,
  Sparkles,
  Star,
  Moon,
  Calendar,
  RotateCw,
  Calculator,
} from "lucide-react";
import { WeeklyHoroscopeCard } from "@/features/predictions/components/WeeklyHoroscopeCard";
import { MonthlyHoroscopeCard } from "@/features/predictions/components/MonthlyHoroscopeCard";
import { NumerologySection } from "@/features/numerology/components/NumerologySection";
import { ChineseZodiacCard } from "@/features/ChineseZodiacCard";
import { TarotReading } from "@/components/TarotReading";
import { DashboardProps } from "@/types";
import { PredictionPeriod } from "@vibes/shared-types";

/**
 * Dashboard Component
 * Main dashboard displaying predictions, numerology, and tarot readings
 */
export function Dashboard({
  profile,
  onClear,
  onEdit,
  // Daily prediction
  prediction,
  loading,
  onGetPrediction,
  onRefreshPrediction,
  // Weekly prediction
  weeklyPrediction,
  weeklyLoading,
  onGetWeeklyPrediction,
  onRefreshWeeklyPrediction,
  // Monthly prediction
  monthlyPrediction,
  monthlyLoading,
  onGetMonthlyPrediction,
  onRefreshMonthlyPrediction,
  // Period selection
  predictionPeriod,
  onPeriodChange,
  // Numerology
  numerologyReading,
  numerologyLoading,
  onGetNumerology,
  onRefreshNumerology,
  // Tarot
  tarotReading,
  tarotLoading,
  canDrawTarot,
  onGetTarot,
  onRefreshTarot,
  // Chinese Zodiac
  chineseZodiacReading,
  chineseZodiacLoading,
  chineseZodiacYear,
  onGetChineseZodiac,
  onRefreshChineseZodiac,
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState<
    "prediction" | "numerology" | "tarot" | "chinese-zodiac" | null
  >(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-switch to newly loaded content only on first load
  useEffect(() => {
    if (prediction && !hasInteracted) {
      setActiveSection("prediction");
    }
  }, [prediction, hasInteracted]);

  // Handle manual section changes
  const handleSectionChange = (
    section: "prediction" | "numerology" | "tarot" | "chinese-zodiac" | null,
  ) => {
    setActiveSection(section);
    setHasInteracted(true);
  };

  // Handle period change with automatic fetch
  const handlePeriodChange = (period: PredictionPeriod) => {
    onPeriodChange(period);
    // Auto-fetch if prediction section is active
    if (activeSection === "prediction") {
      switch (period) {
        case "daily":
          if (!prediction) onGetPrediction();
          break;
        case "weekly":
          if (!weeklyPrediction) onGetWeeklyPrediction();
          break;
        case "monthly":
          if (!monthlyPrediction) onGetMonthlyPrediction();
          break;
      }
    }
  };

  // Get the appropriate loading state based on period
  const isPredictionLoading = () => {
    switch (predictionPeriod) {
      case "daily":
        return loading;
      case "weekly":
        return weeklyLoading;
      case "monthly":
        return monthlyLoading;
      default:
        return loading;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="flex flex-col flex-1 min-h-0 container mx-auto max-w-4xl p-4">
        {/* Fixed Top Section - Profile & Buttons */}
        <div className="flex-none space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* User Profile Card */}
          <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                  Welcome, {profile.name}! ✨
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="text-muted-foreground">Sun Sign:</span>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-border font-semibold text-accent capitalize text-sm">
                    ♈ {profile.sunSign}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="text-accent hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Edit profile"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="text-accent hover:text-accent/80 hover:bg-accent/10 transition-colors"
                  title="Clear profile"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Action Buttons - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === "prediction") {
                  handleSectionChange(null);
                } else {
                  switch (predictionPeriod) {
                    case "daily":
                      onGetPrediction();
                      break;
                    case "weekly":
                      onGetWeeklyPrediction();
                      break;
                    case "monthly":
                      onGetMonthlyPrediction();
                      break;
                  }
                  handleSectionChange("prediction");
                }
              }}
              variant={activeSection === "prediction" ? "default" : "outline"}
              disabled={isPredictionLoading()}
              className={`relative overflow-hidden group h-20 font-bold text-base rounded-2xl transition-all duration-300 ${
                activeSection === "prediction"
                  ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
                  : "bg-muted border-2 border-border text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                <span>
                  {isPredictionLoading() ? "Divining..." : "Horoscope"}
                </span>
              </div>
            </Button>

            {/* Numerology Button */}
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === "numerology") {
                  handleSectionChange(null);
                } else {
                  onGetNumerology();
                  handleSectionChange("numerology");
                }
              }}
              variant={activeSection === "numerology" ? "default" : "outline"}
              disabled={numerologyLoading}
              className={`relative overflow-hidden group h-20 font-bold text-base rounded-2xl transition-all duration-300 ${
                activeSection === "numerology"
                  ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
                  : "bg-muted border-2 border-border text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>{numerologyLoading ? "Calc..." : "Numerology"}</span>
              </div>
            </Button>

            {/* Tarot Button */}
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === "tarot") {
                  handleSectionChange(null);
                } else {
                  onGetTarot();
                  handleSectionChange("tarot");
                }
              }}
              variant={activeSection === "tarot" ? "default" : "outline"}
              disabled={tarotLoading}
              className={`relative overflow-hidden group h-20 font-bold text-base rounded-2xl transition-all duration-300 ${
                activeSection === "tarot"
                  ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
                  : "bg-muted border-2 border-border text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Moon className="h-5 w-5" />
                <span>{tarotLoading ? "Drawing..." : "Tarot"}</span>
              </div>
            </Button>

            {/* Chinese Zodiac Button */}
            <Button
              size="lg"
              onClick={() => {
                if (activeSection === "chinese-zodiac") {
                  handleSectionChange(null);
                } else {
                  onGetChineseZodiac();
                  handleSectionChange("chinese-zodiac");
                }
              }}
              variant={
                activeSection === "chinese-zodiac" ? "default" : "outline"
              }
              disabled={chineseZodiacLoading}
              className={`relative overflow-hidden group h-20 font-bold text-base rounded-2xl transition-all duration-300 ${
                activeSection === "chinese-zodiac"
                  ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
                  : "bg-muted border-2 border-border text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                <span>{chineseZodiacLoading ? "Divining..." : "Zodiac"}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mt-6 space-y-6 min-h-0">
          {/* Horoscope Section */}
          {activeSection === "prediction" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
              {/* Period Selector */}
              <div className="flex gap-2 p-1 bg-muted border border-border rounded-xl backdrop-blur-sm">
                {(["daily", "weekly", "monthly"] as PredictionPeriod[]).map(
                  (period) => (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                        predictionPeriod === period
                          ? "bg-gradient-to-r from-primary to-accent text-background shadow-lg shadow-primary/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {period}
                    </button>
                  ),
                )}
              </div>

              {/* Daily Prediction */}
              {predictionPeriod === "daily" && prediction && (
                <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-accent" />
                        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {new Date(prediction.current_date).toLocaleDateString(
                            "en-US",
                            { weekday: "long", month: "short", day: "numeric" },
                          )}
                        </CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onRefreshPrediction}
                        disabled={loading}
                        className="text-accent hover:text-primary hover:bg-primary/10"
                      >
                        <RotateCw
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-base leading-relaxed text-foreground italic">
                      "{prediction.description}"
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          Lucky Number
                        </p>
                        <p className="text-3xl font-bold text-accent">
                          {prediction.lucky_number}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          Power Color
                        </p>
                        <p className="text-3xl font-bold text-accent">
                          {prediction.color}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weekly & Monthly */}
              {predictionPeriod === "weekly" && weeklyPrediction && (
                <WeeklyHoroscopeCard
                  prediction={weeklyPrediction}
                  onRefresh={onRefreshWeeklyPrediction}
                  isRefreshing={weeklyLoading}
                />
              )}

              {predictionPeriod === "monthly" && monthlyPrediction && (
                <MonthlyHoroscopeCard
                  prediction={monthlyPrediction}
                  onRefresh={onRefreshMonthlyPrediction}
                  isRefreshing={monthlyLoading}
                />
              )}
            </div>
          )}

          {/* Numerology Section */}
          {activeSection === "numerology" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <NumerologySection
                reading={numerologyReading}
                onRefresh={onRefreshNumerology}
                isRefreshing={numerologyLoading}
              />
            </div>
          )}

          {/* Tarot Section */}
          {tarotReading && activeSection === "tarot" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <TarotReading
                reading={tarotReading}
                onRefresh={onRefreshTarot}
                isRefreshing={tarotLoading}
              />
            </div>
          )}

          {/* Chinese Zodiac Section */}
          {activeSection === "chinese-zodiac" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <ChineseZodiacCard profile={profile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
