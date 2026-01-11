'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DailyPrediction, ZodiacSign, NumerologyPrediction } from '@super-stats/shared-types';
import { apiClient } from '@super-stats/api-client';
import { getUserProfile, saveUserProfile, clearUserProfile } from '@super-stats/shared-utils';
import { Toaster, toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Sparkles, User, Settings, Loader2, RotateCcw, Calendar, Star } from 'lucide-react';
import { calculateSunSign, calculateLifePathNumber, calculateDestinyNumber } from '@super-stats/shared-utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Pencil } from 'lucide-react';

// --- UI Components (Inline for speed, ideally separate) ---

function NumerologyCard({ profile }: { profile: UserProfile }) {
  const [prediction, setPrediction] = useState<NumerologyPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNumerology = async () => {
      setLoading(true);
      const lifePath = calculateLifePathNumber(new Date(profile.dateOfBirth));
      const destiny = calculateDestinyNumber(profile.name);

      try {
        const res = await fetch(`/api/numerology?lifePath=${lifePath}&destiny=${destiny}`);
        const data = await res.json();
        if (data.success) {
          setPrediction(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch numerology:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNumerology();
  }, [profile.name, profile.dateOfBirth]);

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative min-h-[400px]">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Calculator className="h-32 w-32" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-violet-500" />
          <span className="text-lg">Numerology Insights</span>
        </CardTitle>
        <CardDescription>
          Your cosmic blueprint based on {profile.name} and {new Date(profile.dateOfBirth).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Consulting the numbers...</p>
          </div>
        ) : prediction ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-violet-100 dark:border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Life Path Number</p>
                <span className="text-4xl font-bold text-slate-800 dark:text-white">{prediction.lifePath}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {prediction.lifePathMeaning}
              </p>
            </div>

            <div className="p-5 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-pink-100 dark:border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Destiny Number</p>
                <span className="text-4xl font-bold text-slate-800 dark:text-white">{prediction.destiny}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {prediction.destinyMeaning}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Unable to load predictions.</div>
        )}
      </CardContent>
    </Card>
  );
}

function Dashboard({
  profile,
  onClear,
  prediction,
  loading,
  onGetPrediction,
  onEdit
}: {
  profile: UserProfile;
  onClear: () => void;
  prediction: DailyPrediction | null;
  loading: boolean;
  onGetPrediction: () => void;
  onEdit: () => void;
}) {

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm dark:bg-zinc-900/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome, {profile.name}!
            </CardTitle>
            <CardDescription>
              Sun Sign: <span className="font-semibold text-indigo-500 capitalize">{profile.sunSign}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="text-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/10">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClear} className="text-red-500 hover:text-red-600 hover:bg-red-50/10">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={onGetPrediction}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-spin" /> Divining...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5" /> Get Daily Prediction
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {
        prediction && (
          <>
            <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="h-32 w-32" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <span className="text-lg">Forecast for {prediction.current_date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
                  "{prediction.description}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lucky Number</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{prediction.lucky_number}</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{prediction.color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <NumerologyCard profile={profile} />
          </>
        )
      }
    </div>
  );
}

function Onboarding({ onSave, initialData, onCancel }: {
  onSave: (p: UserProfile) => void;
  initialData?: UserProfile | null;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [dob, setDob] = useState(initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;

    const date = new Date(dob);
    const sign = calculateSunSign(date);

    onSave({ name, dateOfBirth: date, sunSign: sign });
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
          <CardDescription className="text-lg">
            Unlock your cosmic potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Your Name</Label>
              <Input
                id="name"
                placeholder="Star Gazer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg bg-white/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-base">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 text-lg bg-white/50"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg transition-transform hover:scale-[1.01]">
              {initialData ? 'Update Profile' : 'Get Started'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="w-full"
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

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = getUserProfile();
    if (saved) setProfile(saved);
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    setIsEditing(false);
    toast.success(profile ? "Profile updated!" : "Welcome aboard!");
  };

  const handleClear = () => {
    clearUserProfile();
    setProfile(null);
    setPrediction(null);
    toast.info("Profile cleared");
  };

  const handleGetPrediction = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await apiClient.getDailyPrediction(profile.sunSign);
      setPrediction(res);
      toast.success("Stars aligned!");
    } catch (err) {
      console.error(err);
      toast.error("Cloudy skies... try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-700 dark:opacity-60"
        style={{ backgroundImage: "url('/images/starry-night-stylized.png')" }}
      />

      <div className="relative z-10 p-4">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="pt-12">
          <Toaster position="top-center" richColors theme="system" />
          {profile && !isEditing ? (
            <Dashboard
              profile={profile}
              onClear={handleClear}
              prediction={prediction}
              loading={loading}
              onGetPrediction={handleGetPrediction}
              onEdit={() => setIsEditing(true)}
            />
          ) : (
            <Onboarding
              onSave={handleSaveProfile}
              initialData={profile}
              onCancel={profile ? () => setIsEditing(false) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
