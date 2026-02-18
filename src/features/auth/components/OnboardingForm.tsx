"use client";

import { useState } from "react";
import { UserProfile } from "@vibes/shared-types";
import { calculateSunSign } from "@vibes/shared-utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Star, Clock, MapPin, Settings2 } from "lucide-react";
import { OnboardingFormProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

/**
 * OnboardingForm Component
 * Form for creating or editing user profile with Advanced Mode toggle
 */
export function OnboardingForm({
  onSave,
  initialData,
  onCancel,
}: OnboardingFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [dob, setDob] = useState(
    initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : "",
  );
  const [advancedMode, setAdvancedMode] = useState(
    initialData?.advancedMode || false,
  );
  const [birthTime, setBirthTime] = useState(initialData?.birthTime || "");
  const [birthLocation, setBirthLocation] = useState(
    initialData?.birthLocation || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;

    setIsSubmitting(true);

    try {
      const date = new Date(dob);
      const sign = calculateSunSign(date);

      const profile: UserProfile = {
        name,
        dateOfBirth: date,
        sunSign: sign,
        advancedMode,
      };

      // Only add advanced fields if in advanced mode
      if (advancedMode) {
        profile.birthTime = birthTime || undefined;
        profile.birthLocation = birthLocation || undefined;
      }

      onSave(profile);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent opacity-10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="w-full max-w-md border border-border shadow-2xl bg-card/95 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
          {/* Animated icon */}
          <div className="mx-auto relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg opacity-75 blur animate-glow" />
            <div className="relative bg-card rounded-lg border border-border flex items-center justify-center h-full">
              <Sparkles className="h-8 w-8 text-accent animate-float" />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
              Vibes
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              ✨ Unlock your cosmic destiny ✨
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-accent" />
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Star Gazer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 text-base bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dob"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-accent" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-11 text-base bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Advanced Mode Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAdvancedMode(!advancedMode)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Advanced Mode</span>
                  <span className="text-xs text-muted-foreground">
                    (Birth Charts)
                  </span>
                </div>
                <div
                  className={`w-10 h-5 rounded-full transition-colors ${advancedMode ? "bg-primary" : "bg-muted-foreground/30"} relative`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${advancedMode ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
              </button>
            </div>

            {/* Advanced Fields */}
            <AnimatePresence>
              {advancedMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthTime"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-accent" />
                        Birth Time{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="h-11 text-base bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        For accurate rising sign and house calculations
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="birthLocation"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-accent" />
                        Birth Location{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="birthLocation"
                        placeholder="City, Country"
                        value={birthLocation}
                        onChange={(e) => setBirthLocation(e.target.value)}
                        className="h-11 text-base bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Needed for precise house calculations
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-background border-0"
            >
              {isSubmitting
                ? "Unlocking..."
                : initialData
                  ? "Update Destiny"
                  : "Begin Journey"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="w-full"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
