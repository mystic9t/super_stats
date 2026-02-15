import { useEffect, useState, useRef, useCallback } from "react";
import { TarotReading, UserProfile } from "@vibes/shared-types";
import { tarotService } from "@/services";

type AnimationPhase = "idle" | "shuffling" | "revealing" | "complete";
type RevealedCards = {
  situation: boolean;
  challenge: boolean;
  outcome: boolean;
};

interface UseTarotReadingReturn {
  reading: TarotReading | null;
  isLoading: boolean;
  isDrawing: boolean;
  isShuffling: boolean;
  isRevealing: boolean;
  revealedCards: RevealedCards;
  animationPhase: AnimationPhase;
  canDraw: boolean;
  error: string | null;
  drawCards: (profile: UserProfile) => Promise<void>;
  refreshCards: (profile: UserProfile) => Promise<void>;
  getLastReading: (profile: UserProfile) => void;
  clear: () => void;
}

/**
 * Hook to manage tarot reading state and operations
 * Handles drawing cards with animation phases (shuffling -> revealing)
 * Total animation time: ~2 seconds (800ms shuffle + 1200ms reveals)
 */
export function useTarotReading(): UseTarotReadingReturn {
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [revealedCards, setRevealedCards] = useState<RevealedCards>({
    situation: false,
    challenge: false,
    outcome: false,
  });
  const [canDraw, setCanDraw] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    revealTimeoutsRef.current.forEach(clearTimeout);
    revealTimeoutsRef.current = [];
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Start the reveal sequence after shuffling
  const startRevealSequence = useCallback(() => {
    setIsShuffling(false);
    setIsRevealing(true);
    setAnimationPhase("revealing");

    // Reveal cards one by one with staggered timing
    // Total reveal time: ~1200ms (400ms per card with 400ms stagger)
    const delays = [0, 400, 800];
    const positions: (keyof RevealedCards)[] = [
      "situation",
      "challenge",
      "outcome",
    ];

    delays.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setRevealedCards((prev) => ({
          ...prev,
          [positions[index]]: true,
        }));
      }, delay);
      revealTimeoutsRef.current.push(timeout);
    });

    // Complete the animation
    const completeTimeout = setTimeout(() => {
      setIsRevealing(false);
      setAnimationPhase("complete");
      setIsDrawing(false);
    }, 1200);
    revealTimeoutsRef.current.push(completeTimeout);
  }, []);

  const drawCards = async (profile: UserProfile) => {
    clearAllTimeouts();
    setIsDrawing(true);
    setIsShuffling(true);
    setIsRevealing(false);
    setAnimationPhase("shuffling");
    setRevealedCards({
      situation: false,
      challenge: false,
      outcome: false,
    });
    setError(null);

    // Check if user can draw today
    const canDrawToday = tarotService.canDrawToday(profile);
    if (!canDrawToday) {
      const lastResult = tarotService.getLastReading(profile);
      if (lastResult.success && lastResult.data) {
        setReading(lastResult.data);
        setCanDraw(false);
        setError(null);
        // Skip animation for cached reading
        setIsShuffling(false);
        setIsRevealing(false);
        setAnimationPhase("complete");
        setRevealedCards({ situation: true, challenge: true, outcome: true });
      } else {
        setError("Unable to draw cards today and no previous reading found");
      }
      setIsDrawing(false);
      return;
    }

    // Start shuffling animation (800ms)
    timeoutRef.current = setTimeout(() => {
      // Draw the cards
      const result = tarotService.drawTarotCards(profile);
      if (result.success && result.data) {
        setReading(result.data);
        setCanDraw(false);
        setError(null);
        // Start reveal sequence
        startRevealSequence();
      } else {
        setError(result.error || "Failed to draw cards");
        setIsShuffling(false);
        setIsRevealing(false);
        setAnimationPhase("idle");
        setIsDrawing(false);
      }
    }, 800);
  };

  const getLastReading = (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);

    const result = tarotService.getLastReading(profile);
    if (result.success && result.data) {
      setReading(result.data);
      setCanDraw(false);
    } else {
      setError(result.error || "No previous reading found");
    }

    setIsLoading(false);
  };

  const refreshCards = async (profile: UserProfile) => {
    clearAllTimeouts();
    setIsDrawing(true);
    setIsShuffling(true);
    setIsRevealing(false);
    setAnimationPhase("shuffling");
    setRevealedCards({
      situation: false,
      challenge: false,
      outcome: false,
    });
    setError(null);

    // Start shuffling animation (800ms)
    timeoutRef.current = setTimeout(() => {
      const result = tarotService.forceRedrawTarotCards(profile);
      if (result.success && result.data) {
        setReading(result.data);
        setCanDraw(false);
        setError(null);
        // Start reveal sequence
        startRevealSequence();
      } else {
        setError(result.error || "Failed to refresh cards");
        setIsShuffling(false);
        setIsRevealing(false);
        setAnimationPhase("idle");
        setIsDrawing(false);
      }
    }, 800);
  };

  const clear = () => {
    clearAllTimeouts();
    setReading(null);
    setError(null);
    setCanDraw(true);
    setIsShuffling(false);
    setIsRevealing(false);
    setAnimationPhase("idle");
    setRevealedCards({
      situation: false,
      challenge: false,
      outcome: false,
    });
  };

  return {
    reading,
    isLoading,
    isDrawing,
    isShuffling,
    isRevealing,
    revealedCards,
    animationPhase,
    canDraw,
    error,
    drawCards,
    refreshCards,
    getLastReading,
    clear,
  };
}
