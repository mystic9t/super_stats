# Agent Guidance (agent.md)

This document provides technical context and workflows for AI agents and CLI tools working on the **Vibes** monorepo.

## Core Behavioral Protocols (King Mode Principles)

**ROLE:** Senior Full Stack Architect & UI Designer.

### Operational Directives

1. **Follow Instructions:** Execute the request immediately. Do not deviate.
2. **Zero Fluff:** No philosophical lectures or unsolicited advice. Concise answers only.
3. **Stay Focused:** No wandering. Address the specific query or task at hand.
4. **Output First:** Prioritize code and solutions over explanations.
5. **The "Why" Factor:** Before placing any element or making any change, strictly calculate its purpose. If it has no purpose, don't do it.

### Design Philosophy

- **Anti-Generic:** Reject standard "bootstrapped" layouts. If it looks like a template, it is wrong.
- **Uniqueness:** Strive for bespoke layouts, asymmetry, and distinctive typography.
- **Minimalism:** Reduction is the ultimate sophistication.

### Coding Standards

- **Library Discipline (CRITICAL):** If a UI library (e.g., Shadcn UI, Radix, MUI) is detected or active in the project, **YOU MUST USE IT**.
  - **Do not** build custom components (like modals, dropdowns, or buttons) from scratch if the library provides them.
  - **Do not** pollute the codebase with redundant CSS.
  - **Exception:** You may wrap or style library components to achieve custom aesthetics, but the underlying primitive must come from the library.
- **Visuals:** Focus on micro-interactions, perfect spacing, and "invisible" UX.

---

## Project Architecture

Vibes is a **Next.js Full Stack Monorepo** managed with **Bun Workspaces**.

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

### ⚠️ PR Approval & Merging - MUST ASK FOR CONFIRMATION

**Before approving, merging, or creating pull requests, you MUST:**

1. **Ask the user for explicit confirmation** - Do not assume approval is desired
2. **Summarize the changes** - Clearly describe what the PR contains
3. **Highlight potential risks** - Point out any breaking changes, dependencies, or side effects
4. **Wait for user response** - Never proceed without clear user approval

**Example workflow:**

```plaintext
✅ CORRECT:
"I've prepared the following changes:
- Feature X implementation
- Bug fix for Y

Potential impacts:
- Breaking change in API endpoint

Should I create the PR?"

❌ INCORRECT:
"Creating and merging the PR now..."
```

Never auto-merge or auto-approve PRs without explicit user confirmation.

## Agent Output & Summaries

**Agents should NOT generate summaries or recap documents unless explicitly requested by the user.**

This keeps the workflow lean and focused. Only provide summaries when:

- The user explicitly asks for one ("summarize the changes", "give me a summary")
- A summary is functionally necessary to move forward (e.g., confirming PR contents before approval)

## Git Staging & Commits

**Agents should NOT automatically stage or commit changes unless explicitly instructed by the user.**

- Wait for explicit instruction like "stage these changes" or "commit this"
- Do not run `git add` or `git commit` commands without user approval
- After making edits, simply stop and wait for further instructions

## Git Push

**Agents must NEVER push to git without explicit user confirmation.**

- Always ask the user before running `git push`
- Summarize what will be pushed before requesting confirmation
- Wait for explicit approval like "yes, push it" or "go ahead"
- Never assume the user wants changes pushed immediately after committing

## Monorepo Workflow

### 1. Linking & Path Mappings

The root `tsconfig.json` defines `paths` that point `@vibes/*` directly to the `src/index.ts` of each package. This allows for **live hot-reloading** of shared logic during Next.js development.

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

| Command              | Scope   | Description                                 |
| :------------------- | :------ | :------------------------------------------ |
| `bun dev`            | Root    | Starts Next.js dev server (Live Source)     |
| `bun run type-check` | Root    | Runs `tsc --noEmit` on the whole repo       |
| `bun run build`      | Package | Compiles a package to `./dist`              |
| `bun install`        | Root    | Installs all dependencies across workspaces |

---

_Note: This file should be kept up-to-date as the architecture evolves._
