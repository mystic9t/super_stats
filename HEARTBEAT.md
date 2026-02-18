# Heartbeat - Autonomous Agent Session Log

## Session 1 - 2026-02-18 (Optimization)

**Branch:** `feature/auto`
**Type:** Optimization / Bug Fixes / Hardening

### Changes Made

1. **API Client Timeout** (`packages/api-client/src/index.ts`)
   - Added `AbortController`-based request timeout (15s default)
   - Prevents app from hanging indefinitely on unresponsive API calls
   - Clean error message on timeout

2. **External API Call Timeouts** (`src/app/api/predictions/route.ts`, `src/app/api/predictions/weekly/route.ts`)
   - Added 10s timeout to external horoscope API calls
   - Ensures fallback generator kicks in promptly when external API is slow

3. **Input Validation - Prediction Routes**
   - Added zodiac sign validation against `ZodiacSign` enum (daily + weekly routes)
   - Added date format validation (`YYYY-MM-DD`) on daily prediction route

4. **Input Validation - Numerology Route** (`src/app/api/numerology/route.ts`)
   - Added `isNaN` check on parsed birthdate
   - Added future date rejection

5. **Input Validation - Birth Chart Route** (`src/app/api/birth-chart/route.ts`)
   - Added `isNaN` check on parsed date of birth

6. **Fixed Hardcoded Values in Daily Prediction** (`src/app/api/predictions/route.ts`)
   - `lucky_time` was always "12:00 PM" - now seeded from 12 time options
   - `mood` was always "Optimistic" - now seeded from 12 mood options

7. **TarotCard Image Error Handling** (`src/components/TarotCard.tsx`)
   - Added `onError` fallback to show card back image when front image fails to load
   - Prevents broken image display

8. **OnboardingForm Validation** (`src/features/auth/components/OnboardingForm.tsx`)
   - Added comprehensive form validation (name length 2-50, valid date, not future, not >150 years ago)
   - Added `max` attribute on date input to prevent future dates in date picker
   - Added inline validation error display
   - Validation errors clear on input change

### Analysis Notes (Not Acted On)

- SSR localStorage guards: **Not needed** - all hooks are used in `"use client"` page, localStorage access only happens in event handlers/effects after mount
- `useMoonPhase` doesn't auto-trigger on mount (by design - user clicks to load)
- Birth location field stores text but doesn't geocode to lat/lng (would need external geocoding API - see TBD.md)

### Next Session Should

- **Add a new feature** (alternating pattern: this was optimization, next is feature)
- Potential features: skeleton loading states, accessibility improvements, or new cosmic feature
