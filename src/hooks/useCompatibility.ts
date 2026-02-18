import { useState, useCallback } from "react";
import { ZodiacSign, CompatibilityReading } from "@vibes/shared-types";
import { calculateCompatibility } from "@vibes/shared-utils";

interface UseCompatibilityReturn {
  reading: CompatibilityReading | null;
  partnerSign: ZodiacSign | null;
  isLoading: boolean;
  fetchReading: (userSign: ZodiacSign, partnerSign: ZodiacSign) => void;
  setPartnerSign: (sign: ZodiacSign | null) => void;
  clear: () => void;
}

export function useCompatibility(): UseCompatibilityReturn {
  const [reading, setReading] = useState<CompatibilityReading | null>(null);
  const [partnerSign, setPartnerSignState] = useState<ZodiacSign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReading = useCallback(
    (userSign: ZodiacSign, partner: ZodiacSign) => {
      setIsLoading(true);
      setPartnerSignState(partner);
      try {
        const result = calculateCompatibility(userSign, partner);
        setReading(result);
      } catch (err) {
        console.error("Failed to calculate compatibility:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const setPartnerSign = useCallback((sign: ZodiacSign | null) => {
    setPartnerSignState(sign);
    if (!sign) {
      setReading(null);
    }
  }, []);

  const clear = useCallback(() => {
    setReading(null);
    setPartnerSignState(null);
  }, []);

  return {
    reading,
    partnerSign,
    isLoading,
    fetchReading,
    setPartnerSign,
    clear,
  };
}
