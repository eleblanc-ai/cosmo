# Recipe Lab — Product Spec

## Overview
An AI-enabled recipe lab where users collect source recipes from around the web, collaborate with AI to craft their own version, and track their cooking attempts over time. The AI merges sources into a starting point, enriches it with context (flavor profiles, pitfalls, technique highlights), and evolves the recipe through natural conversation. Each cook attempt is logged with notes and saved as a new version, with side-by-side diffs between versions.

## Goals
- Let users collect and merge multiple source recipes into a personal starting point
- Use AI (Claude) to enrich recipes with culinary context and guide refinement through chat
- Track cooking attempts with notes and versioned diffs
- Persist all data per-user in Supabase

## Non-Goals
- Image uploads or rich media
- Sharing or publishing recipes publicly
- Nutritional calculations
- Meal planning or shopping lists

## Users
- Multi-user — each user has their own account and recipe library
- Authentication via Supabase Auth (email/password)
- All data scoped to the authenticated user

## Core Features

### Recipe Collection
- User starts a recipe via search — describe a dish, AI searches the web and recommends candidate recipes, user selects which to use as sources
- Sources are stored and attributed (URL + title if available)

### Recipe Workshop
- After selecting sources, user enters the Workshop — a split-screen creation environment
- **Left panel**: analysis section (general flavor profile, technique highlights, pitfalls, ingredient notes) + per-source unique insights, above a live recipe draft that updates with every AI change
- **Right panel**: guided assistant chat — AI proactively leads with preference questions (flavor intensity, equipment, dietary restrictions) and offers structured quick-reply chips alongside free-form chat input; recipe draft updates live on every response
- Recipe auto-saves to the database when the workshop opens and after every AI-driven update (Google Docs style)
- User clicks "Done" to finish and navigate to the recipe detail view

### AI Recipe Generation
- Initial recipe draft is auto-generated when the workshop opens — no separate trigger
- AI merges source content into a unified recipe enriched with:
  - Flavor profile summary
  - Key technique highlights
  - Common pitfalls to avoid
  - Notes on ingredient choices from source variations
  - Per-source unique insights

### AI Chat Refinement
- Guided creation: assistant opens with a preference question and continues asking about flavors, equipment, and restrictions
- Each assistant response may include structured quick-reply option chips for fast input
- Recipe updates live in the left panel alongside the conversation
- Post-creation chat also available on the recipe detail view for ongoing refinement

### Version Tracking
- Every saved state of the recipe is a version (v1, v2, v3…)
- User can log cook notes against a version ("too salty", "texture was great")
- Side-by-side diff view between any two versions (ingredients + instructions)

### Recipe Management
- View recipe library (list of all recipes)
- Open a recipe and see current version + version history
- Delete a recipe

## Data Model

### Recipe
- `id` (uuid)
- `user_id` (uuid — Supabase auth)
- `title` (string)
- `sources`: array of `{ url?: string, raw_text?: string, title?: string }`
- `ai_context`: `{ flavor_profile, highlights, pitfalls, notes }` (generated once, editable)
- `current_version_id` (uuid)
- `created_at`, `updated_at`

### RecipeVersion
- `id` (uuid)
- `recipe_id` (uuid)
- `version_number` (int)
- `ingredients`: array of `{ name, quantity, unit?, note? }`
- `instructions`: array of strings (steps)
- `cook_notes` (string, optional — logged after cooking)
- `created_at`

### ChatMessage
- `id` (uuid)
- `recipe_id` (uuid)
- `role`: `user` | `assistant`
- `content` (string)
- `created_at`

## Architecture
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS utility classes only
- Auth + DB: Supabase (Postgres + Supabase Auth)
- AI: Claude API (Anthropic) via Supabase Edge Function proxy (keeps API key server-side)
- Web search: Brave Search API (or similar) called from Edge Function
- Folder structure: 3-bucket pattern — `src/features/`, `src/shared/`, `src/app/`
- File naming: kebab-case for files, PascalCase for React components
- Testing: Vitest + React Testing Library, collocated `*.test.tsx`
- Config: centralized in `src/shared/config/`

## UX / Style

- **Aesthetic:** Bold and editorial — big typography, strong contrast, content-first layouts. More magazine than app.
- **Modes:** Light and dark, with toggle. Default to system preference.
- **Accent color:** Saffron `#D97706` (amber/orange) — warm, food-forward, distinctive
- **Light mode:** Off-white `#FAFAF9` backgrounds, near-black `#1C1917` text
- **Dark mode:** Near-black `#1C1917` backgrounds, off-white `#FAFAF9` text
- **Typography:** Heavy weight (700–900) for headings, clean sans-serif for body, generous sizing
- **Layout:** Intentional whitespace, strong grid, content speaks for itself
- **Components:** High contrast, minimal decoration, borders and dividers used sparingly

## Verification
- `npm run verify` (runs type-check, lint, and tests)

## Import Boundary Check
- `rg "from ['\"].*features/" src/features` (must find no cross-feature imports)
