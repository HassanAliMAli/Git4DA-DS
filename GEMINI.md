<!-- ======================================================================= -->
<!-- Git4Data — AGENTS.md                                                    -->
<!-- Tier: SENTINEL                                                         -->
<!-- Violation of any rule below is a HARD BLOCK. DO NOT IGNORE.            -->
<!-- ======================================================================= -->

# Git4Data — Agent Standing Orders

This file is the **single source of truth** for all AI coding agents operating on this repository. Read it completely before any task. These rules are non-negotiable. If you are unsure, re-read this file. If you are still unsure, ASK.

---

## 1. PROJECT IDENTITY

- **Project:** Git4Data (The "Legendary" Git Simulation for Data Professionals)
- **Vision:** High-fidelity simulation of world-class data engineering environments. A gamified, narrative-driven Git learning platform with a mentor character (Dr. Hassan).
- **Stack:** Next.js 15+ (App Router) — TypeScript strict mode — Vanilla CSS with CSS variables — Cloudflare D1 (Serverless SQL) — OpenNext Cloudflare Adapter
- **Rival Quality Bar:** Google-level UX, Anthropic-level polish, OpenAI-level reliability, NVIDIA-level performance.

---

## 2. MANDATORY PREFLIGHT — READ BEFORE ANY CODING

**BEFORE writing a single line of code, you MUST:**

1. Read the relevant Next.js docs from `node_modules/next/dist/docs/`. Your training data is outdated — the bundled docs are the source of truth.
2. Read the relevant existing files in this codebase to understand current patterns and conventions.
3. State your assumptions explicitly in your response before implementing.
4. If ANY ambiguity exists, ASK for clarification. DO NOT guess. DO NOT silently pick an interpretation.
5. Present multiple approaches when tradeoffs exist. DO NOT default to what you think is "standard."

---

## 3. ARCHITECTURE & DIRECTORY STRUCTURE

### 3.1 Mandatory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx
│   ├── page.tsx
│   └── (levels)/           # Route group for 20 levels
├── components/             # Shared UI components
│   ├── ui/                 # Primitive UI components (Button, Card, etc.)
│   └── features/           # Feature-specific components
├── contexts/               # React context providers (ProfileContext, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Core logic (NOT React-specific)
│   ├── git/                # Git simulation engine
│   │   ├── GitRepository.ts
│   │   ├── GitCommandProcessor.ts
│   │   └── types.ts
│   ├── vfs/                # Virtual File System
│   │   ├── FileSystem.ts
│   │   └── types.ts
│   └── narrative/          # Dr. Hassan dialogue engine
├── models/                 # TypeScript interfaces and types
│   └── Profile.ts
├── styles/                 # Global CSS and CSS variables
│   ├── variables.css
│   └── globals.css
└── utils/                  # Utility functions
```

### 3.2 Structure Rules

- Every file MUST have a single, clear responsibility.
- MAX file length: 300 lines. If a file exceeds this, REFACTOR.
- NEVER place business logic in components. Components render. Logic lives in `lib/`.
- NEVER place component code in `lib/`. Components render in `components/`.
- Route groups use parentheses. Private folders use underscore prefix.
- Colocate tests next to the file they test with `.test.ts` / `.test.tsx` suffix.

---

## 4. TECHNOLOGY RULES

### 4.1 Next.js (App Router)

- ALL components are **Server Components by default**. Only add `"use client"` when you ABSOLUTELY need: event handlers, browser APIs (`window`, `localStorage`, `IntersectionObserver`), or React state/effects (`useState`, `useEffect`, `useRef`).
- NEVER use `next/dynamic` with `{ ssr: false }` inside a Server Component. This WILL break.
- Use React Server Components for data fetching. NO `useEffect` for data fetching.
- Use the `metadata` export for SEO. NOT `next/head` or `<Head>`.
- Use `next/link` for client-side navigation. NEVER `<a>` for internal links.
- Use `next/image` with explicit `width`, `height`, and `alt` attributes. NEVER `<img>`.
- Server Actions (`"use server"`) for mutations, NOT separate API routes unless needed.
- Route handlers (`route.ts`) for webhook endpoints or external API consumption only.

### 4.2 TypeScript

- `strict: true` in tsconfig. This is non-negotiable.
- NEVER use `any`. Use `unknown` and narrow with type guards.
- Prefer `interface` over `type` for object shapes. Use `type` for unions, intersections, and primitives.
- EVERY function MUST have explicit return type annotations.
- EVERY prop interface MUST be defined and exported.
- Use `satisfies` operator for type validation without widening.
- No `// @ts-ignore` or `// @ts-expect-error` unless ABSOLUTELY unavoidable and documented with a reason.

### 4.3 React

- Functional components ONLY. NO class components.
- Hooks over HOCs and render props.
- Custom hooks MUST start with `use` and have a single responsibility.
- Keep `useEffect` dependencies explicit. Lint rules are not optional.
- NO `useMemo`/`useCallback` without measured need. Premature optimization is not optimization.
- All event handlers MUST use `useCallback` when passed as props.
- Forms: Use controlled components or Server Actions. NO uncontrolled forms unless third-party library requires it.

### 4.4 CSS & Styling

- **Vanilla CSS with CSS custom properties** — NO Tailwind, NO styled-components, NO CSS-in-JS.
- All design tokens MUST be CSS variables defined in `styles/variables.css`.
- Use a consistent 4px/8px spacing scale. NO arbitrary spacing values.
- Define a clear type scale: 12 / 14 / 16 / 20 / 24 / 32 / 40 / 48 px. Stick to it.
- Mobile-first responsive design. EVERY layout MUST work at 320px width.
- Use CSS Grid for page-level layouts. Use Flexbox for component-level layouts.
- NO inline styles under any circumstances. Use CSS classes and variables.

### 4.5 Cloudflare D1

- All database access through Cloudflare D1 (Serverless SQL).
- Use prepared statements. NO string concatenation for SQL.
- Define schema migrations in `src/lib/db/migrations/`.
- Wrap all mutations in transactions where data consistency matters.

---

## 5. FRONTEND QUALITY — ANTI-AI-SLOP DIRECTIVES

This section exists because AI agents systematically produce crappy frontends. These rules are MANDATORY and exist to prevent the most common failures. Violations will be rejected.

### 5.1 Design Philosophy

- **Every UI must have a BOLD, intentional aesthetic direction.** Generic "modern clean" design is FORBIDDEN. Before building ANY UI component, commit to a specific tone: brutalist, retro-futuristic, editorial/magazine, luxury/refined, industrial, terminal-native, or dark premium. Pick one and execute with precision.
- **Differentiation is mandatory.** Ask: "What makes this UNFORGETTABLE?" If the answer is "nothing," redesign.
- **Intentionality over intensity.** Bold maximalism and refined minimalism both work. The crime is being forgettable.

### 5.2 Forbidden Aesthetics (Zero Tolerance)

| Offense | Why It's Bad | Required Alternative |
|---------|--------------|---------------------|
| Purple gradient on white/dark background | The #1 hallmark of AI-generated slop | Use the DataPulse brand palette (Teal `#0D9488`, Dark `#0F172A`, Gold `#F59E0B`) or a contextually-justified alternative |
| Inter, Roboto, Arial, or system-ui as primary font | Every AI agent defaults to these | Choose distinctive fonts: pair a characterful display font with a refined body font. Use `@next/font` or `@fontsource` |
| Cookie-cutter SaaS layout (nav + hero + 3 columns + CTA) | Predictable, forgettable, unremarkable | Asymmetric grids, diagonal flows, bento layouts, overlapping elements, generous whitespace OR controlled density |
| Generic card components with rounded corners + shadow | Overused, zero identity | Vary border treatments: no radius for brutalist, frosted glass for glassmorphism, thick borders for neo-brutalism |
| Flat design with no texture or atmosphere | Feels cheap and unfinished | Add depth: gradient meshes, noise textures, geometric patterns, layered transparencies, subtle grain overlays |
| Identical light and dark themes (just inverted) | Lazy | Each theme should be independently designed with its own character |
| Centered-everything layout | Amateur | Use intentional asymmetry, grid-breaking elements, and unexpected composition |
| No micro-interactions or motion | Feels static, dead | Add hover states, staggered reveals, scroll-triggered animations, loading skeletons with animation |
| Border radius: 8px on everything | Lazy default | Vary corner treatments: 0px (brutalist), 4px (subtle), 12px (friendly), 999px (pill), or asymmetric |
| Emoji as icons | Unprofessional | Use inline SVGs, Unicode symbols (not emoji), or a minimal icon set |

### 5.3 Typography Rules

- Choose fonts purposefully. Document the choice and why.
- Font pairing required: one display/heading font + one body font. They must contrast.
- Minimum body text size: 16px. NEVER below.
- Maximum line length: 75 characters. Use `max-width` or `ch` units.
- Line-height: 1.5 for body, 1.2 for headings. Consistent across the app.
- Letter-spacing: use sparingly. UPPERCASE labels get `0.05em` tracking.
- Font loading: use `@next/font` with `display: swap`. NO FOUT/FOUT.

### 5.4 Color System

- The DataPulse brand palette is:
  - Teal (`#0D9488`) — Primary action, accents
  - Dark (`#0F172A`) — Backgrounds
  - Gold (`#F59E0B`) — Achievements, highlights
  - Slate (`#475569`) — Secondary text
  - Light (`#F8FAFC`) — Light mode backgrounds
  - Success (`#22C55E`) — Verified/Pass states
  - Danger (`#EF4444`) — Errors, warnings
- Every color MUST be defined as a CSS variable with a descriptive name.
- Follow WCAG AA contrast ratios minimum: 4.5:1 for body text, 3:1 for large text.
- Test all color combinations. DO NOT assume AI-chosen colors pass contrast checks.

### 5.5 Spacing & Layout

- Use an 8px base spacing grid. All margins, paddings, and gaps MUST be multiples of 4.
- Consistent padding: 16px (mobile), 24px (tablet), 32px (desktop) for container padding.
- Section spacing: 48px (mobile), 64px (tablet), 96px (desktop) between major sections.
- Content max-width: 1200px for pages, 720px for reading content.
- Grid columns: 12-column grid system using CSS Grid. No framework.

### 5.6 States EVERY Component Must Handle

| State | Implementation |
|-------|---------------|
| **Loading** | Skeleton screens (NOT spinners). Match layout shape. |
| **Empty** | Purposeful illustration + message that guides action. |
| **Error** | Recovery action + human-readable explanation. NOT "Something went wrong." |
| **Edge case** | Overflow (text truncation), missing data (graceful fallback), long lists (virtualization). |
| **Keyboard** | Full keyboard navigation. Visible focus rings (`outline: 2px solid`). |
| **Reduced motion** | Respect `prefers-reduced-motion`. NO autoplaying animations. |

### 5.7 Accessibility (WCAG AA — Mandatory)

- Semantic HTML: use `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`.
- EVERY `<img>` and `next/image` MUST have descriptive `alt` text.
- EVERY interactive element MUST be keyboard accessible.
- EVERY form input MUST have an associated `<label>`.
- ARIA: use when HTML semantics are insufficient. NEVER add ARIA that duplicates native semantics.
- Focus management: modals trap focus. Page navigation focuses `<h1>`.
- Color is NEVER the sole indicator of state or meaning.
- Test with a screen reader before considering a component complete.

---

## 6. AI AGENT BEHAVIORAL RULES

### 6.1 Think Before Acting

- **State assumptions explicitly.** Before implementing, list what you assume about the codebase, the data, and the user's intent. If uncertain, ASK.
- **Surface tradeoffs.** If multiple approaches exist, present them with pros/cons. DO NOT silently pick one.
- **Push back when warranted.** If the task describes something that conflicts with the existing architecture or would introduce technical debt, SAY SO.
- **Stop when confused.** If the requirements are ambiguous, incomplete, or contradictory, STOP and ask for clarification. DO NOT proceed on guesses.

### 6.2 Simplicity First

- **Minimum code that solves the problem.** NO speculative features, NO "nice-to-have" additions, NO future-proofing for requirements that don't exist yet.
- **NO unnecessary abstractions.** A function that's used once in one file does not need to be abstracted into a shared utility. Wait for the third occurrence.
- **NO premature optimization.** Don't add `useMemo`, `useCallback`, memoization, or caching without profiling that proves it's needed.
- **NO dead code.** Every line of code you write MUST be reachable and used. Remove unused imports, variables, functions, and exports.
- **Favor built-in browser APIs** over libraries. Use native `fetch`, `URL`, `IntersectionObserver`, etc. before reaching for a package.

### 6.3 Surgical Changes

- **Touch ONLY what the task requires.** If the task is "fix a bug in function X," DO NOT reformat adjacent code, rename variables, refactor related functions, or "improve" nearby code. Those are separate tasks.
- **Match existing code style exactly.** Do not reformat, reorder, or restructure existing code. Your job is to blend in, not "improve" the codebase.
- **Before editing ANY file, read at least 30 lines of surrounding context.** Understand the patterns, imports, and conventions already in use.
- **Side effects are forbidden.** Changing a comment, renaming a variable, deleting whitespace — if it's not part of the task, DO NOT DO IT.

### 6.4 Verification Mindset

- **Every change must be verifiable.** Before writing code, state how you will verify it works.
- **Run the relevant command** (build, lint, typecheck, test) after every change. DO NOT declare a task complete without verification.
- **Test edge cases**, not just the happy path. Empty states, null values, network failures, boundary conditions.
- **If tests exist, they must pass.** If tests don't exist for the changed code, consider whether they should.

### 6.5 Context Discipline

- DO NOT introduce duplicate code. Before writing utility functions, check if they already exist in `src/lib/`, `src/utils/`, or `src/hooks/`.
- DO NOT add a package without explicit approval. Every dependency is a liability.
- DO NOT rename, restructure, or refactor existing code without being explicitly asked.
- DO NOT leave TODO comments, console.log statements, or commented-out code.
- DO NOT modify configuration files (tsconfig, package.json, next.config, wrangler config) unless explicitly asked.

---

## 7. EXPLICITLY FORBIDDEN ANTI-PATTERNS

The following patterns are known AI coding agent failure modes. They are EXPLICITLY FORBIDDEN. If you detect yourself doing any of these, STOP and reconsider.

| # | Anti-Pattern | What Happens | Correct Approach |
|---|-------------|-------------|------------------|
| 1 | **Scope creep** — Adding features/fixes beyond the task | Touches 8 files when 1 was needed | Read the task boundaries. Touch ONLY the minimum. |
| 2 | **Silent assumption** — Picking an interpretation without stating it | Implements the wrong thing | State your interpretation first. Ask if ambiguous. |
| 3 | **Over-abstraction** — Creating utility/helper/hook for single-use code | Adds complexity with zero benefit | Inline it. Abstract only at the 3rd usage. |
| 4 | **Duplicate implementation** — Rewriting something that already exists | Wasted code, maintenance burden | Search the codebase FIRST. Reuse. |
| 5 | **AI-slop UI** — Defaulting to generic layouts, fonts, colors | Looks like every other AI-generated app | Follow Section 5. BOLD aesthetic direction required. |
| 6 | **Ignoring errors** — Only handling the happy path | Production crashes on edge cases | Every component handles: loading, empty, error, and edge case. |
| 7 | **Dead code** — Leaving unused imports, variables, exports | Littered codebase, confusing | Clean up after yourself. Remove unused code. |
| 8 | **Ghost imports** — Importing packages not in package.json | Build failures | Verify every import exists in dependencies. |
| 9 | **Wrong component boundary** — Making everything "use client" | Bloated JS bundle, poor performance | Default Server Component. Only "use client" when required. |
| 10 | **Hallucinated APIs** — Using methods/props that don't exist | Runtime errors | Check the actual API docs in `node_modules/next/dist/docs/`. |
| 11 | **Over-styling** — Borders + shadows + backgrounds on the same element | Visual clutter | Pick ONE visual treatment per element. Not all three. |
| 12 | **No visual hierarchy** — All text same size, weight, color | Flat, unreadable UI | Use the type scale. Create clear heading/body/caption hierarchy. |
| 13 | **Hardcoded strings** — Magic strings/numbers everywhere | Unmaintainable | Use constants, enums, or CSS variables. |
| 14 | **Ignoring mobile** — Only testing at 1440px | Broken on mobile | Mobile-first. Test at 320px, 768px, 1024px, 1440px. |
| 15 | **Sycophantic coding** — Agreeing to bad requirements without pushback | Bad architecture ships | Push back. Explain tradeoffs. Suggest better alternatives. |

---

## 8. COMMANDS & VERIFICATION

### 8.1 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint with strict config
npm run typecheck    # TypeScript strict check (if configured)
npm test             # Run test suite
```

### 8.2 Verification Protocol

After ANY code change, you MUST run in order:
1. `npm run typecheck` — TypeScript errors are BLOCKERS.
2. `npm run lint` — Lint errors are BLOCKERS.
3. `npm run build` — Build errors are BLOCKERS.
4. `npm test` — Test failures are BLOCKERS.

If ANY of these fail, fix the issue BEFORE proceeding. Do not pass go. Do not collect $200.

---

## 9. PROJECT-SPECIFIC KNOWLEDGE

### 9.1 Git Simulation Engine
- The core of the app is a simulated Git engine (`src/lib/git/GitRepository.ts`). It implements an in-memory object database (blobs, trees, commits), ref management, staging area, reflog, and GPG signature verification. NEVER break this abstraction.
- The Virtual File System (`src/lib/vfs/FileSystem.ts`) is a tree-based in-memory file system. It supports mkdir, rm, touch, write, read. It does NOT use the real filesystem.

### 9.2 Narrative Engine
- Dr. Hassan is the mentor. He has a "Sage" persona — philosophical, rigorous, occasionally stern.
- All narrative dialogue flows through the narrative engine. NO hardcoded strings in components.

### 9.3 Gamification
- XP, levels, badges, and coins are tracked through `ProfileContext`.
- Badges are earned by completing levels. Each badge has a unique ID and art.

### 9.4 Cloudflare D1
- Serverless SQL database. Used for persisting user profiles and progress.
- All database access uses the Cloudflare D1 adapter. NO raw SQLite.

---

## 10. FINAL WARNINGS

1. **You are forbidden from modifying this file without explicit user request.**
2. **You are forbidden from modifying .gitignore without explicit user request.**
3. **If a rule in this file contradicts your training data, THIS FILE WINS.**
4. **When in doubt, ASK. Silence is not consent. Assumptions are not facts.**
5. **These rules are not suggestions. They are constraints. They exist because every rule here was earned through the pain of previous failures.**

<!-- END OF AGENTS.md — Git4Data Sentinel Rules -->
