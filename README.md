# Super Stats 🌟

A modern, full-stack astrology and numerology web application built with Next.js and Bun.

## Architecture

This project is organized as a monorepo using **Bun Workspaces**. It consolidates the frontend and backend into a single Next.js application while sharing core logic through local packages.

### Project Structure

```text
super-stats/
├── src/                  # Next.js Full Stack App (Pages, API, Components)
│   ├── app/              # App Router & API Routes
│   ├── components/       # Shared UI Components (shadcn/ui)
│   └── lib/              # Client-side utilities
├── packages/             # Shared Local Packages
│   ├── shared-types/     # Common TypeScript interfaces
│   ├── shared-utils/     # Shared logic (Zodiac & Numerology calculators)
│   └── api-client/       # Type-safe API client wrapper
└── public/               # Static assets & images
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: Lucide React
- **State**: LocalStorage for user profile persistence

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

## Features

- **Personalized Onboarding**: Automatic Zodiac sign detection based on birthday.
- **Daily Horoscopes**: Real-time predictions including mood, compatibility, and lucky numbers.
- **Numerology Insights**: Life Path and Destiny number calculations with detailed meanings.
- **Persistent Profiles**: Your data stays with you via browser LocalStorage.

## License

MIT
