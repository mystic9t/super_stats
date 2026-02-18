"use client";

import { useState, useEffect, startTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  RotateCcw,
  Star,
  Moon,
  RotateCw,
  Calculator,
  ChevronDown,
  AlertCircle,
  Sun,
  Rabbit,
} from "lucide-react";
import { DailyHoroscopeCard } from "@/features/predictions/components/DailyHoroscopeCard";
import { WeeklyHoroscopeCard } from "@/features/predictions/components/WeeklyHoroscopeCard";
import { NumerologySection } from "@/features/numerology/components/NumerologySection";
import { ChineseZodiacCard } from "@/features/ChineseZodiacCard";
import { TarotReading } from "@/components/TarotReading";
import { MoonPhaseCard } from "@/features/moon-phase/components/MoonPhaseCard";
import { BirthChartCard } from "@/features/birth-chart/components/BirthChartCard";
import { DashboardProps } from "@/types";
import { PredictionPeriod } from "@vibes/shared-types";

interface Section {
  id:
    | "prediction"
    | "numerology"
    | "tarot"
    | "chinese-zodiac"
    | "moon-phase"
    | "birth-chart";
  label: string;
  loadingLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isLoading: boolean;
}

function SectionButton({
  section,
  isActive,
}: {
  section: Section;
  isActive: boolean;
}) {
  const Icon = section.icon;
  return (
    <Button
      size="lg"
      onClick={section.onClick}
      variant={isActive ? "default" : "outline"}
      disabled={section.isLoading}
      className={`relative overflow-hidden group h-16 font-bold text-sm rounded-xl flex-1 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50 scale-105"
          : "bg-muted border-2 border-border text-amber-600 dark:text-amber-400 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{section.isLoading ? section.loadingLabel : section.label}</span>
      </div>
    </Button>
  );
}

function SectionDropdown({
  sections,
  visibleSections,
  activeSection,
  onSectionClick,
}: {
  sections: Section[];
  visibleSections: Section[];
  activeSection: string | null;
  onSectionClick: (section: Section) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-none">
      <Button
        size="lg"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 font-bold text-sm rounded-xl bg-muted border-2 border-border text-amber-600 dark:text-amber-400 hover:border-amber-400 ${isOpen ? "border-amber-400" : ""}`}
      >
        <div className="flex items-center gap-1">
          <span>More</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </Button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-card border-2 border-border rounded-xl shadow-xl z-50 space-y-1 min-w-40">
          {sections.slice(visibleSections.length).map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                size="sm"
                variant="ghost"
                onClick={() => {
                  onSectionClick(section);
                  setIsOpen(false);
                }}
                className="w-full justify-start text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileSectionButtons({
  sections,
  activeSection,
  onSectionClick,
  isPredictionLoading,
}: {
  sections: Section[];
  activeSection: string | null;
  onSectionClick: (section: Section) => void;
  isPredictionLoading: () => boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const activeSectionData = sections.find((s) => s.id === activeSection);
  const inactiveSections = sections.filter((s) => s.id !== activeSection);

  return (
    <div className="flex sm:hidden gap-3">
      {activeSectionData ? (
        <Button
          size="lg"
          onClick={() => onSectionClick(activeSectionData)}
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
          onClick={() => onSectionClick(sections[0])}
          variant="default"
          disabled={isPredictionLoading()}
          className="flex-[3] relative overflow-hidden group h-14 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-accent to-amber-500 text-background shadow-lg shadow-accent/50"
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4" />
            <span>{isPredictionLoading() ? "Divining..." : "Horoscope"}</span>
          </div>
        </Button>
      )}

      <div className="flex-1 relative">
        <Button
          size="lg"
          variant="outline"
          onClick={() => setShowMenu(!showMenu)}
          className="w-full h-14 font-bold text-xs rounded-xl bg-muted border-2 border-border text-amber-600 dark:text-amber-400 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span>More</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showMenu ? "rotate-180" : ""}`}
            />
          </div>
        </Button>

        {showMenu && (
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
                      onSectionClick(section);
                      setShowMenu(false);
                    }}
                    disabled={section.isLoading}
                    className="w-full justify-start gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-500 px-2"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs truncate overflow-hidden">
                      {section.isLoading ? section.loadingLabel : section.label}
                    </span>
                  </Button>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  error,
  onGetPrediction,
  onRefreshPrediction,
  // Weekly prediction
  weeklyPrediction,
  weeklyLoading,
  weeklyError,
  onGetWeeklyPrediction,
  onRefreshWeeklyPrediction,
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
  tarotShuffling,
  tarotRevealing,
  tarotRevealedCards,
  // canDrawTarot is intentionally not used in this component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canDrawTarot: _canDrawTarot,
  onGetTarot,
  onRefreshTarot,
  // Chinese Zodiac
  chineseZodiacReading,
  chineseZodiacLoading,
  chineseZodiacYear,
  chineseZodiacElement,
  onGetChineseZodiac,
  // onRefreshChineseZodiac is intentionally not used in this component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRefreshChineseZodiac: _onRefreshChineseZodiac,
  // Moon Phase
  moonPhaseData,
  moonZodiacSign,
  moonPhaseRituals,
  moonPhaseInfluence,
  moonPhaseLoading,
  onGetMoonPhase,
  onRefreshMoonPhase,
  // Birth Chart
  birthChartReading,
  birthChartLoading,
  onGetBirthChart,
  onRefreshBirthChart,
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState<
    | "prediction"
    | "numerology"
    | "tarot"
    | "chinese-zodiac"
    | "moon-phase"
    | "birth-chart"
    | null
  >(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Auto-switch to newly loaded content only on first load
  useEffect(() => {
    if (hasInteracted) return;

    if (profile.advancedMode && birthChartReading) {
      startTransition(() => {
        setActiveSection("birth-chart");
      });
    } else if (prediction) {
      startTransition(() => {
        setActiveSection("prediction");
      });
    }
  }, [prediction, birthChartReading, hasInteracted, profile.advancedMode]);

  // Handle manual section changes
  const handleSectionChange = (
    section:
      | "prediction"
      | "numerology"
      | "tarot"
      | "chinese-zodiac"
      | "moon-phase"
      | "birth-chart"
      | null,
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
        case "moon":
          onGetMoonPhase();
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
      default:
        return loading;
    }
  };

  // Define all sections
  const standardSections = [
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
            case "moon":
              onGetMoonPhase();
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
      icon: Rabbit,
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

  const birthChartSection = profile.advancedMode
    ? [
        {
          id: "birth-chart" as const,
          label: "Birth Chart",
          loadingLabel: "Calculating...",
          icon: Sun,
          onClick: () => {
            if (activeSection === "birth-chart") {
              handleSectionChange(null);
            } else {
              onGetBirthChart();
              handleSectionChange("birth-chart");
            }
          },
          isLoading: birthChartLoading,
        },
      ]
    : [];

  // Birth Chart first for advanced mode, standard order otherwise
  const sections = profile.advancedMode
    ? [...birthChartSection, ...standardSections]
    : standardSections;

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 sm:pb-1 pt-1 sm:pt-2 px-3 sm:px-6">
              <div className="flex flex-col">
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                  Welcome, {profile.name}! ✨
                </CardTitle>
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

          {/* Action Buttons - Desktop Layout */}

          {/* Desktop Layout */}
          <div className="hidden xl:flex xl:flex-row gap-3">
            {sections.map((section) => (
              <SectionButton
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
              />
            ))}
          </div>

          {/* LG: 4 tabs + More */}
          <div className="hidden lg:flex xl:hidden gap-3">
            {sections.slice(0, 4).map((section) => (
              <SectionButton
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
              />
            ))}
            <SectionDropdown
              sections={sections}
              visibleSections={sections.slice(0, 4)}
              activeSection={activeSection}
              onSectionClick={(s) => s.onClick()}
            />
          </div>

          {/* MD: 3 tabs + More */}
          <div className="hidden md:flex lg:hidden gap-3">
            {sections.slice(0, 3).map((section) => (
              <SectionButton
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
              />
            ))}
            <SectionDropdown
              sections={sections}
              visibleSections={sections.slice(0, 3)}
              activeSection={activeSection}
              onSectionClick={(s) => s.onClick()}
            />
          </div>

          {/* SM: 2 tabs + More */}
          <div className="hidden sm:flex md:hidden gap-3">
            {sections.slice(0, 2).map((section) => (
              <SectionButton
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
              />
            ))}
            <SectionDropdown
              sections={sections}
              visibleSections={sections.slice(0, 2)}
              activeSection={activeSection}
              onSectionClick={(s) => s.onClick()}
            />
          </div>

          {/* Mobile Layout */}
          <MobileSectionButtons
            sections={sections}
            activeSection={activeSection}
            onSectionClick={(section) => section.onClick()}
            isPredictionLoading={isPredictionLoading}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mt-3 sm:mt-6 space-y-4 sm:space-y-6 min-h-0 pr-2 custom-scrollbar">
          {/* Horoscope Section */}
          {activeSection === "prediction" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 sm:space-y-6">
              {/* Period Selector - 3 tabs in one row */}
              <div className="flex gap-1 sm:gap-2 p-1 bg-muted border border-border rounded-xl backdrop-blur-sm">
                {(["daily", "weekly", "moon"] as PredictionPeriod[]).map(
                  (period) => (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap ${
                        predictionPeriod === period
                          ? "bg-gradient-to-r from-primary to-accent text-background shadow-lg shadow-primary/50"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {period === "moon" ? "🌙 Moon" : period}
                    </button>
                  ),
                )}
              </div>

              {/* Daily Prediction */}
              {predictionPeriod === "daily" && prediction && (
                <DailyHoroscopeCard
                  prediction={prediction}
                  sunSign={profile.sunSign}
                  isLoading={loading}
                  onRefresh={onRefreshPrediction}
                />
              )}

              {/* Daily Error State */}
              {predictionPeriod === "daily" &&
                !prediction &&
                !loading &&
                error && (
                  <Card className="border border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-destructive mb-2">
                        Unable to Load Horoscope
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The cosmic energies are cloudy right now. Please try
                        again.
                      </p>
                      <Button
                        onClick={onRefreshPrediction}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                )}

              {/* Weekly */}
              {predictionPeriod === "weekly" && weeklyPrediction && (
                <WeeklyHoroscopeCard
                  prediction={weeklyPrediction}
                  sunSign={profile.sunSign}
                  onRefresh={onRefreshWeeklyPrediction}
                  isRefreshing={weeklyLoading}
                />
              )}

              {/* Weekly Error State */}
              {predictionPeriod === "weekly" &&
                !weeklyPrediction &&
                !weeklyLoading &&
                weeklyError && (
                  <Card className="border border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-destructive mb-2">
                        Unable to Load Weekly Horoscope
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The stars are aligning. Please try again in a moment.
                      </p>
                      <Button
                        onClick={onRefreshWeeklyPrediction}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
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
          {activeSection === "tarot" && (tarotReading || tarotShuffling) && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <TarotReading
                reading={tarotReading}
                onRefresh={onRefreshTarot}
                isRefreshing={tarotLoading}
                isShuffling={tarotShuffling}
                isRevealing={tarotRevealing}
                revealedCards={tarotRevealedCards}
              />
            </div>
          )}

          {/* Chinese Zodiac Section */}
          {activeSection === "chinese-zodiac" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <ChineseZodiacCard
                reading={chineseZodiacReading}
                chineseYear={chineseZodiacYear}
                element={chineseZodiacElement}
                isLoading={chineseZodiacLoading}
              />
            </div>
          )}

          {/* Birth Chart Section - Advanced Mode only */}
          {activeSection === "birth-chart" && profile.advancedMode && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <BirthChartCard
                reading={birthChartReading}
                onRefresh={onRefreshBirthChart}
                isRefreshing={birthChartLoading}
              />
            </div>
          )}

          {/* Moon Phase Section - now under Horoscope */}
          {activeSection === "prediction" && predictionPeriod === "moon" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <MoonPhaseCard
                moonData={moonPhaseData}
                moonZodiacSign={moonZodiacSign}
                rituals={moonPhaseRituals}
                influence={moonPhaseInfluence}
                sunSign={profile.sunSign}
                isLoading={moonPhaseLoading}
                onRefresh={onRefreshMoonPhase}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
