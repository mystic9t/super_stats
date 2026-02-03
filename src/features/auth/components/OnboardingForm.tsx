'use client';

import { useState } from 'react';
import { UserProfile } from '@super-stats/shared-types';
import { calculateSunSign } from '@super-stats/shared-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <Calculator className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Super Stats
          </CardTitle>
          <CardDescription className="text-lg">Unlock your cosmic potential</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Star Gazer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg bg-white/50"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-base">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 text-lg bg-white/50"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Saving...'
                : initialData
                  ? 'Update Profile'
                  : 'Get Started'}
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
