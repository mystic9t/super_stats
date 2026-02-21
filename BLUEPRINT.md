# BLUEPRINT.md — Vibes

**Project:** Vibes  
**Generated:** 2026-02-22  
**Type:** Web Application (Next.js Monorepo)

---

## 1. Project Summary

**Vibes** is a personal astrology, numerology, and spirituality web application. It provides daily cosmic guidance through tarot readings, horoscopes, numerology charts, moon phases, Chinese zodiac, birth charts, and affirmations — all without requiring user accounts.

**Core Philosophy:** No accounts. No noise. Just vibes. Dark mode by default, smooth animations, no clutter, no ads.

**Current State:** Feature-complete MVP with 8 core features implemented. Data persisted via localStorage only.

---

## 2. Tech Stack with Reasoning

| Layer           | Technology                        | Reasoning                                                      |
| --------------- | --------------------------------- | -------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router)           | Modern React SSR with Server Components, excellent performance |
| Package Manager | Bun                               | Fast installs, native workspaces, built-in TypeScript          |
| UI Library      | React 19                          | Latest React with concurrent features                          |
| Styling         | Tailwind CSS 4                    | Utility-first, built-in dark mode, rapid development           |
| Components      | shadcn/ui (Radix)                 | Accessible primitives, no vendor lock-in, custom styling       |
| Animations      | Framer Motion                     | Declarative animations, gesture support                        |
| Icons           | Lucide React                      | Clean, consistent icon set                                     |
| State           | React Hooks + localStorage        | No backend required, instant persistence                       |
| Analytics       | Vercel Analytics + Speed Insights | Zero-config performance monitoring                             |

### Monorepo Structure (Bun Workspaces)

```
@vibes/shared-types  — Canonical TypeScript interfaces
@vibes/shared-utils   — Core logic (calculators, generators)
@vibes/api-client     — Type-safe fetch wrapper
```

---

## 3. Top-Level Folder Structure

```
super_stats/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (predictions, numerology, birth-chart)
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx           # Main dashboard
│   │   ├── globals.css        # Global styles
│   │   ├── loading.tsx        # Loading state
│   │   ├── error.tsx          # Error boundary
│   │   └── global-error.tsx   # Global error handler
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (button, card, input, label)
│   │   ├── Header.tsx        # App header
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── favicon-switcher.tsx
│   │   └── Tarot*.tsx        # Tarot components
│   ├── features/
│   │   ├── auth/             # OnboardingForm
│   │   ├── dashboard/        # Dashboard
│   │   ├── predictions/      # DailyHoroscopeCard, WeeklyHoroscopeCard
│   │   ├── moon-phase/       # MoonPhaseCard
│   │   ├── numerology/       # NumerologySection
│   │   ├── compatibility/    # CompatibilityCard
│   │   ├── birth-chart/      # BirthChartCard
│   │   └── affirmation/      # AffirmationCard
│   ├── hooks/                # React hooks (useUserProfile, useTarotReading, etc.)
│   ├── services/             # Service layer (tarotService, predictionService, profileService)
│   ├── types/                # Re-exports from @vibes/shared-types
│   └── lib/                  # Utilities (utils.ts)
├── packages/
│   ├── shared-types/src/     # All TypeScript interfaces
│   ├── shared-utils/src/    # Calculation logic (tarot, numerology, zodiac, etc.)
│   ├── shared-types/        # Package config
│   └── shared-utils/        # Package config
├── public/                   # Static assets
├── tarot_assets_raw/         # Tarot card images (78 cards)
├── HEARTBEAT/               # Session logs
├── AGENTS.md                # Agent guidance
├── package.json             # Root workspace config
├── tsconfig.json            # Base TypeScript config
└── next.config.ts           # Next.js configuration
```

---

## 4. Core Data Models & Key Types

All types defined in `packages/shared-types/src/index.ts`:

### User & Profile

- **`UserProfile`** — name, dateOfBirth, sunSign, advancedMode, birthTime, birthLocation, latitude, longitude

### Predictions

- **`DailyPrediction`** — current_date, compatibility, lucky_number, lucky_time, color, date_range, mood, description
- **`WeeklyPrediction`** — week, description, compatibility, lucky_number, color, mood

### Tarot

- **`TarotCard`** — id, name, shortName, uprightMeaning, reversedMeaning, description, imageUrl
- **`DrawnCard`** — card, position (situation/challenge/outcome), isReversed
- **`TarotReading`** — cards (3-card tuple), date, summary

### Numerology

- **`NumerologyReading`** — lifePath, destiny, soulUrge, personality, birthday, personalYear, currentYear

### Zodiac & Moon

- **`ChineseZodiacReading`** — sign, title, description, traits, compatibility, luckyNumbers, luckyColors, element, symbolEmoji, yearRange
- **`MoonPhaseData`** — phase, phaseName, illumination, age, nextNewMoon, nextFullMoon, emoji
- **`MoonRitual`** — title, description, actions, zodiacFocus
- **`ZodiacMoonInfluence`** — sign, moonPhase, influence, focus, avoid

### Birth Chart

- **`BirthChart`** — sunSign, moonSign, risingSign, all planet signs, planets[], houses[], ascendantDegree, midheavenDegree
- **`BirthChartReading`** — chart, interpretations (per planet), houseMeanings, aspects, summary

### Compatibility & Affirmations

- **`CompatibilityReading`** — sign1, sign2, scores (overall/love/friendship/work), summary, strengths, challenges, tip
- **`DailyAffirmation`** — affirmation, mantra, cosmicTheme, element, chakra, color, crystal, journalPrompt, date, sign

### Enums

- **`ZodiacSign`** — 12 Western zodiac signs
- **`ChineseZodiacSign`** — 12 Chinese zodiac animals
- **`MoonPhase`** — 8 moon phases
- **`Planet`** — 10 celestial bodies (Sun through Pluto)
- **`PredictionPeriod`** — daily/weekly/moon/match

---

## 5. Top 5 Features to Build First

> Priority order based on user value, feasibility, and product differentiation.

### 1. Birth Chart Visualizer (Priority: HIGH)

**What:** Visual wheel/circle display of birth chart instead of text-only.

- Create SVG-based birth chart wheel component
- Show all 10 planet positions in zodiac signs
- Indicate houses and aspects visually
- Interactive: hover for details
  **Why:** Birth charts are text-heavy; visualization dramatically improves UX and shareability.

### 2. Data Export/Import (Priority: HIGH)

**What:** Allow users to backup and restore their profile and readings.

- Export all localStorage data as JSON file
- Import from JSON file
- One-click "download my vibes" button
  **Why:** Users fear losing data; this builds trust and enables future migration.

### 3. Tarot Card Detail View (Priority: MEDIUM)

**What:** Expanded card view with full meanings and history.

- Tap card to see full upright/reversed meanings
- Show past readings history (last 7 days)
- Save favorite cards to a collection
  **Why:** Increases engagement time and provides deeper value.

### 4. Rising Sign Calculator (Priority: MEDIUM)

**What:** Calculate and display rising sign (Ascendant) based on birth time/location.

- Input: birth time (required) + location (optional)
- Output: accurate rising sign in birth chart
- If no birth time, show placeholder in UI
  **Why:** Birth charts without rising sign are incomplete; this is high-value for advanced users.

### 5. Reading Share as Image (Priority: MEDIUM)

**What:** Generate shareable image of any reading.

- Use html-to-image or similar library
- Create "Share" button on each card/section
- Generate beautiful image with cosmic branding
  **Why:** Social sharing = free organic growth; users love sharing spiritual insights.

---

## 6. Definition of a Successful Overnight Cycle

A successful overnight cycle means:

| Metric             | Target                                     |
| ------------------ | ------------------------------------------ |
| **Build**          | `bun run build` completes without errors   |
| **Type Check**     | `bun run type-check` passes with no errors |
| **Runtime**        | Page loads without console errors          |
| **Performance**    | First Contentful Paint < 2s on 3G          |
| **Functionality**  | All existing features work as before       |
| **No Regressions** | No removed features or broken flows        |

**Process:**

1. Make incremental changes
2. Run type-check after each change
3. Verify build passes
4. Test in browser (manual verification)
5. Commit only after all checks pass

---

## 7. Free External APIs / Libraries

### Already Used (No Additional Cost)

| Library               | Purpose                | Cost       |
| --------------------- | ---------------------- | ---------- |
| Vercel Analytics      | Traffic analytics      | Free       |
| Vercel Speed Insights | Performance monitoring | Free       |
| date-fns              | Date manipulation      | Free (MIT) |

### Potential Future Additions

| Library       | Purpose                     | Cost       |
| ------------- | --------------------------- | ---------- |
| html-to-image | Generate shareable images   | Free (MIT) |
| suncalc       | Accurate sun/moon positions | Free (ISC) |

### No Plans to Add

- **Paid APIs** — All calculations are performed client-side using existing algorithms
- **AI Services** — Content is algorithmically generated, not AI-powered
- **External Horoscope APIs** — Predictions are generated internally using custom logic

---

## 8. Must NOT Build in This Cycle

> List of features explicitly deferred to avoid scope creep.

| Feature                            | Reason                                                          |
| ---------------------------------- | --------------------------------------------------------------- |
| **User Accounts / Auth**           | Violates "no accounts" philosophy; adds complexity              |
| **Push Notifications**             | Requires service workers, permissions, backend; out of scope    |
| **Mobile Native App**              | Separate project; web PWA sufficient for now                    |
| **Paid Features / Subscriptions**  | Not a business priority; violates free/no-ads ethos             |
| **AI-Generated Readings**          | Current algorithmic content is sufficient; adds cost/complexity |
| **Social Feed / Community**        | Adds noise; violates minimalism                                 |
| **Gamification (streaks, badges)** | Distracts from core purpose                                     |
| **Email Marketing**                | Requires backend; out of scope                                  |
| **Multiple Readings per Day**      | Violates the "one reading per day" design philosophy            |
| **Real-time Notifications**        | Requires WebSocket/backend                                      |

---

## 9. Notes

- **Build Command:** `bun run build` (includes package builds + Next.js build)
- **Type Check:** `bun run type-check`
- **Dev Server:** `bun dev`
- **Vercel Deployment:** Automatic on push to `dev` branch

---

_This BLUEPRINT.md serves as the architectural constitution for all future sessions._
