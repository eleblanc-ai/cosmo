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
- User can start a recipe two ways:
  1. **From sources** — paste one or more URLs or raw text directly
  2. **From scratch via chat** — describe what they want to make, AI searches the web and recommends candidate recipes, user selects which ones to use as references
- Sources are stored and attributed (URL + title if available)

### Source Comparison
- Before merging, show a side-by-side comparison of all selected source recipes
- Highlight similarities (shared ingredients, common techniques) and differences (varying quantities, conflicting methods, unique additions)
- User reviews the comparison before triggering the AI merge

### AI Recipe Generation
- AI (Claude) merges sources into a unified starting point recipe
- AI enriches the recipe with:
  - Flavor profile summary
  - Key technique highlights
  - Common pitfalls to avoid
  - Notes on ingredient choices from source variations
- Web search used to supplement Claude's knowledge where relevant

### AI Chat Refinement
- User can chat with AI about the recipe
- Recipe updates in response to chat (e.g. "reduce the salt", "make it spicier")
- Chat history persisted per recipe

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
