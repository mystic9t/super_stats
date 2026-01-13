# Agent Guidance (agent.md)

This document provides technical context and workflows for AI agents and CLI tools working on the **Super Stats** monorepo.

## Project Architecture

Super Stats is a **Next.js Full Stack Monorepo** managed with **Bun Workspaces**.

- **`/src`**: The primary Next.js application (App Router).
  - `/app/api`: Backend logic and proxy routes.
  - `/app/(pages)`: UI routes.
  - `/components/ui`: Design system (shadcn/ui).
- **`/packages`**: Local shared packages.
  - `shared-types`: Canonical TypeScript interfaces.
  - `shared-utils`: Core logic (Zodiac/Numerology calculators).
  - `api-client`: Type-safe fetch wrapper for internal APIs.

## Git Workflow & Branching

- **`master`**: Production branch. Linked to the live environment. Only stable, reviewed code should be merged here.
- **`dev`**: Main development branch. All new features and fixes should be merged here first.
- **Vercel Previews**: Every push to `dev` (or any feature branch) will automatically generate a **Preview Deployment** on Vercel, allowing you to test changes before they go to production.

## Monorepo Workflow

### 1. Linking & Path Mappings

The root `tsconfig.json` defines `paths` that point `@super-stats/*` directly to the `src/index.ts` of each package. This allows for **live hot-reloading** of shared logic during Next.js development.

### 2. Package Compilation

Each package has its own `tsconfig.json` that overrides `paths` to `{}`. This ensures that:

- Packages build in isolation using their own boundaries.
- Packages reference the `dist` folders of siblings (via workspace links) rather than reaching into sibling `src` folders.

### 3. Build & Type-Check

- **Global**: Use `bun run type-check` in the root to validate the entire project.
- **Local**: Use `bun run build` within a package to regenerate its `dist` and `.d.ts` files.

## Coding Standards

- **Types First**: Always define/update shared interfaces in `packages/shared-types` before implementation.
- **Logic Sharing**: Move any reusable calculation or data-munging logic to `packages/shared-utils`.
- **API Consistency**: All internal API responses should follow the `ApiResponse<T>` interface from `shared-types`.
- **Aesthetics**: Follow the "Rich Aesthetics" guidelines (HSL tailored colors, smooth gradients, micro-animations).

## CLI Tools & Commands

| Command | Scope | Description |
| :--- | :--- | :--- |
| `bun dev` | Root | Starts Next.js dev server (Live Source) |
| `bun run type-check` | Root | Runs `tsc --noEmit` on the whole repo |
| `bun run build` | Package | Compiles a package to `./dist` |
| `bun install` | Root | Installs all dependencies across workspaces |

---
*Note: This file should be kept up-to-date as the architecture evolves.*
