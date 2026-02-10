import { useEffect, useState, useRef } from 'react';
import { TarotReading, UserProfile } from '@vibes/shared-types';
import { tarotService } from '@/services';

interface UseTarotReadingReturn {
  reading: TarotReading | null;
  isLoading: boolean;
  isDrawing: boolean;
  canDraw: boolean;
  error: string | null;
  drawCards: (profile: UserProfile) => Promise<void>;
  refreshCards: (profile: UserProfile) => Promise<void>;
  getLastReading: (profile: UserProfile) => void;
  clear: () => void;
}

/**
 * Hook to manage tarot reading state and operations
 * Handles drawing cards with optional delay and checking draw eligibility
 */
export function useTarotReading(drawDelayMs: number = 1500): UseTarotReadingReturn {
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canDraw, setCanDraw] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const drawCards = async (profile: UserProfile) => {
    setIsDrawing(true);
    setError(null);

    // Check if user can draw today
    const canDrawToday = tarotService.canDrawToday(profile);
    if (!canDrawToday) {
      const lastResult = tarotService.getLastReading(profile);
      if (lastResult.success && lastResult.data) {
        setReading(lastResult.data);
        setCanDraw(false);
        setError(null);
      } else {
        setError('Unable to draw cards today and no previous reading found');
      }
      setIsDrawing(false);
      return;
    }

    // Simulate delay for dramatic effect
    timeoutRef.current = setTimeout(() => {
      const result = tarotService.drawTarotCards(profile);
      if (result.success && result.data) {
        setReading(result.data);
        setCanDraw(false);
        setError(null);
      } else {
        setError(result.error || 'Failed to draw cards');
      }
      setIsDrawing(false);
    }, drawDelayMs);
  };

  const getLastReading = (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);

    const result = tarotService.getLastReading(profile);
    if (result.success && result.data) {
      setReading(result.data);
      setCanDraw(false);
    } else {
      setError(result.error || 'No previous reading found');
    }

    setIsLoading(false);
  };

  const refreshCards = async (profile: UserProfile) => {
    setIsDrawing(true);
    setError(null);

    // Simulate delay for dramatic effect
    timeoutRef.current = setTimeout(() => {
      const result = tarotService.forceRedrawTarotCards(profile);
      if (result.success && result.data) {
        setReading(result.data);
        setCanDraw(false);
        setError(null);
      } else {
        setError(result.error || 'Failed to refresh cards');
      }
      setIsDrawing(false);
    }, drawDelayMs);
  };

  const clear = () => {
    setReading(null);
    setError(null);
    setCanDraw(true);
  };

  return {
    reading,
    isLoading,
    isDrawing,
    canDraw,
    error,
    drawCards,
    refreshCards,
    getLastReading,
    clear,
  };
}
