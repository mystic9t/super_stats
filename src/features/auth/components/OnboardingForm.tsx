'use client';

import { useState } from 'react';
import { UserProfile } from '@vibes/shared-types';
import { calculateSunSign } from '@vibes/shared-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Star } from 'lucide-react';
import { OnboardingFormProps } from '@/types';

/**
 * OnboardingForm Component
 * Form for creating or editing user profile
 */
export function OnboardingForm({ onSave, initialData, onCancel }: OnboardingFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [dob, setDob] = useState(
    initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;

    setIsSubmitting(true);

    try {
      const date = new Date(dob);
      const sign = calculateSunSign(date);

      onSave({ name, dateOfBirth: date, sunSign: sign });
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
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
              <Label htmlFor="dob" className="text-sm font-semibold text-foreground flex items-center gap-2">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-base font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-background border-0"
            >
              {isSubmitting
                ? 'Unlocking...'
                : initialData
                  ? 'Update Destiny'
                  : 'Begin Journey'}
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
