# Vibes 🌟

A modern, full-stack astrology and numerology web application built with Next.js and Bun. Get personalized cosmic insights including horoscopes, numerology readings, and tarot divination.

## Architecture

This project is organized as a monorepo using **Bun Workspaces** with a refactored, feature-based architecture. It consolidates the frontend and backend into a single Next.js application while sharing core logic through local packages.

### Project Structure

```text
vibes/
├── src/
│   ├── app/                    # App Router & API Routes
│   │   ├── page.tsx            # Main entry point (108 lines - simplified)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/                # Backend routes
│   │       ├── predictions/
│   │       └── numerology/
│   ├── features/               # Feature-based components
│   │   ├── numerology/
│   │   │   └── components/
│   │   │       └── NumerologyCard.tsx
│   │   ├── dashboard/
│   │   │   └── components/
│   │   │       └── Dashboard.tsx
│   │   └── auth/
│   │       └── components/
│   │           └── OnboardingForm.tsx
│   ├── components/             # Shared UI Components (shadcn/ui, TarotCard, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useUserProfile.ts
│   │   ├── useDailyPrediction.ts
│   │   ├── useTarotReading.ts
│   │   └── useLocalStorage.ts
│   ├── services/               # Business logic & API integration
│   │   ├── profileService.ts
│   │   ├── predictionService.ts
│   │   └── tarotService.ts
│   ├── types/                  # TypeScript interfaces
│   │   └── index.ts
│   └── lib/                    # Client-side utilities
├── packages/                   # Shared Local Packages
│   ├── shared-types/           # Common TypeScript interfaces
│   ├── shared-utils/           # Shared logic (Zodiac, Numerology, Tarot calculators)
│   └── api-client/             # Type-safe API client wrapper
├── public/                     # Static assets & images
└── next.config.ts              # Next.js configuration
```

### Architecture Improvements

**Before**: Monolithic `page.tsx` with inline components (481 lines)  
**After**: Clean component composition with services and hooks (108 lines)

- **Feature-Based Organization**: Related components grouped by domain
- **Custom Hooks**: Reusable state management logic (`useUserProfile`, `useDailyPrediction`, `useTarotReading`, `useLocalStorage`)
- **Service Layer**: Centralized business logic with error handling
- **Type Safety**: Comprehensive TypeScript interfaces for all components and services

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: Lucide React
- **State**: LocalStorage for user profile persistence
- **UI Enhancements**: Next Themes, Sonner (Toasts)
- **Observability**: Vercel Analytics & Speed Insights

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
bun install
```

### Development

Start the Next.js development server:

```bash
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Type Checking

Run type checking across the entire monorepo:

```bash
bun run type-check
```

### Build

Build all packages and the Next.js application:

```bash
bun run build
```

## Features

### ✨ Core Features

- **Personalized Onboarding**: Automatic Zodiac sign detection based on birthday
- **Daily Horoscopes**: Real-time predictions including mood, compatibility, and lucky numbers from the Horoscope API
- **Numerology Insights**:
  - Life Path number calculations
  - Destiny number calculations
  - Detailed interpretations and meanings
- **Tarot Divination**:
  - Three-card readings (Situation, Challenge, Outcome)
  - Daily draw limitations for authenticity
  - Beautiful card visualizations with meanings
- **Persistent Profiles**: User data persists via browser LocalStorage

### 🎨 UI/UX Features

- **Dark Mode Support**: Full dark/light theme toggle with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Tailwind CSS animations and transitions
- **Toast Notifications**: User feedback via Sonner toasts
- **Accessible Components**: shadcn/ui components built on Radix UI

### 🏗️ Code Quality Features

- **Feature-Based Architecture**: Clear separation of concerns with domain-organized components
- **Custom Hooks**: Reusable state management and API logic
- **Service Layer**: Centralized business logic with consistent error handling
- **Type Safety**: Comprehensive TypeScript interfaces throughout the codebase
- **Clean Composition**: Simplified main page component (77% reduction: 481 → 108 lines)

### 📊 Observability

- **Vercel Analytics**: Track page views and user interactions
- **Vercel Speed Insights**: Monitor Core Web Vitals and performance metrics

## License

MIT
