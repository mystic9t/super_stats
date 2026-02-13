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
  ChevronDown,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false);
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

  // Define all sections
  const sections = [
    {
      id: "prediction" as const,
      label: "Horoscope",
      loadingLabel: "Divining...",
      icon: Star,
      onClick: () => {
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
      },
      isLoading: isPredictionLoading(),
    },
    {
      id: "numerology" as const,
      label: "Numerology",
      loadingLabel: "Calc...",
      icon: Calculator,
      onClick: () => {
        if (activeSection === "numerology") {
          handleSectionChange(null);
        } else {
          onGetNumerology();
          handleSectionChange("numerology");
        }
      },
      isLoading: numerologyLoading,
    },
    {
      id: "tarot" as const,
      label: "Tarot",
      loadingLabel: "Drawing...",
      icon: Moon,
      onClick: () => {
        if (activeSection === "tarot") {
          handleSectionChange(null);
        } else {
          onGetTarot();
          handleSectionChange("tarot");
        }
      },
      isLoading: tarotLoading,
    },
    {
      id: "chinese-zodiac" as const,
      label: "Zodiac",
      loadingLabel: "Divining...",
      icon: Star,
      onClick: () => {
        if (activeSection === "chinese-zodiac") {
          handleSectionChange(null);
        } else {
          onGetChineseZodiac();
          handleSectionChange("chinese-zodiac");
        }
      },
      isLoading: chineseZodiacLoading,
    },
  ];

  const activeSectionData = sections.find((s) => s.id === activeSection);
  const inactiveSections = sections.filter((s) => s.id !== activeSection);

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
        <div className="flex-none space-y-3 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* User Profile Card */}
          <Card className="border border-border shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-4 pt-3 sm:pt-6 px-3 sm:px-6">
              <div className="flex flex-col space-y-1 sm:space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                  Welcome, {profile.name}! ✨
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground hidden sm:inline">
                    Sun Sign:
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-border font-semibold text-accent capitalize text-xs sm:text-sm">
                    ♈ {profile.sunSign}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="text-accent hover:text-amber-400 hover:bg-amber-500/10 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                  title="Edit profile"
                >
                  <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="text-accent hover:text-accent/80 hover:bg-accent/10 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                  title="Clear profile"
                >
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Action Buttons - Desktop Grid Layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  size="lg"
                  onClick={section.onClick}
                  variant={activeSection === section.id ? "default" : "outline"}
                  disabled={section.isLoading}
                  className={`relative overflow-hidden group h-20 font-bold text-base rounded-2xl transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
                      : "bg-muted border-2 border-border text-amber-600 dark:text-amber-400 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>
                      {section.isLoading ? section.loadingLabel : section.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Action Buttons - Mobile Single Row Layout */}
          <div className="flex sm:hidden gap-3">
            {/* Active Button - Takes 3/4 width */}
            {activeSectionData ? (
              <Button
                size="lg"
                onClick={activeSectionData.onClick}
                variant="default"
                disabled={activeSectionData.isLoading}
                className="flex-[3] relative overflow-hidden group h-14 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50"
              >
                <div className="flex items-center justify-center gap-2">
                  <activeSectionData.icon className="h-4 w-4" />
                  <span>
                    {activeSectionData.isLoading
                      ? activeSectionData.loadingLabel
                      : activeSectionData.label}
                  </span>
                </div>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => handleSectionChange("prediction")}
                variant="default"
                disabled={isPredictionLoading()}
                className="flex-[3] relative overflow-hidden group h-14 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50"
              >
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>
                    {isPredictionLoading() ? "Divining..." : "Horoscope"}
                  </span>
                </div>
              </Button>
            )}

            {/* More Button - Takes 1/4 width */}
            <div className="flex-1 relative">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="w-full h-14 font-bold text-xs rounded-xl bg-muted border-2 border-border text-amber-600 dark:text-amber-400 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span>More</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      showMobileMenu ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </Button>

              {/* Dropdown Menu */}
              {showMobileMenu && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-card border-2 border-border rounded-xl shadow-xl z-50 space-y-1 w-40 max-w-[calc(100vw-2rem)]">
                  {(activeSection ? inactiveSections : sections.slice(1)).map(
                    (section) => {
                      const Icon = section.icon;
                      return (
                        <Button
                          key={section.id}
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            section.onClick();
                            setShowMobileMenu(false);
                          }}
                          disabled={section.isLoading}
                          className="w-full justify-start gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-500 px-2"
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs truncate overflow-hidden">
                            {section.isLoading
                              ? section.loadingLabel
                              : section.label}
                          </span>
                        </Button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mt-3 sm:mt-6 space-y-4 sm:space-y-6 min-h-0 pr-2 custom-scrollbar">
          {/* Horoscope Section */}
          {activeSection === "prediction" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 sm:space-y-6">
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
