# Slice 1: Project Setup

**Timestamp:** 2026-02-17 
**Status:** Approved

---

## Plan

**Goal:** Scaffold the full project foundation — Vite + React + TypeScript + Tailwind v4 with design tokens, 3-bucket folder structure, Vitest, and a passing verify command.

**Files:**
- `package.json` — renamed to recipe-lab, added `test` and `verify` scripts
- `vite.config.ts` — `@tailwindcss/vite` plugin, Vitest config (uses `vitest/config` for `defineConfig`)
- `tsconfig.app.json` — added `vitest/globals` types
- `index.html` — Inter font via Google Fonts, entry point at `src/app/main.tsx`
- `src/index.css` — Tailwind v4 `@import`, `@source`, `@custom-variant dark`, `@theme` design tokens
- `src/test-setup.ts` — jest-dom + `matchMedia` mock
- `src/app/main.tsx` — app entry wrapping app in ThemeProvider
- `src/app/App.tsx` — root component with header, "Recipe Lab" heading, dark/light toggle button
- `src/app/theme-provider.tsx` — theme context, system preference detection, toggle, localStorage persistence
- `src/app/theme-provider.test.tsx` — 3 tests
- `src/shared/config/theme.ts` — color token constants
- `src/features/.gitkeep` — empty features bucket

**Outcome:** Running app with dark/light toggle, Inter font, saffron accent, design tokens, 3-bucket structure, and passing verify command.

**Verification:** `npm run verify` — tsc + eslint + vitest all pass

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Proposed Slice 1: Project Setup — scaffold React + Vite + TS + Tailwind v4 + Vitest + ThemeProvider
User: sounds good
```

### Phase 3: Implementation
```
User: i don't see the colors, font, or light mode dark mode
Cosmo: Identified two issues: (1) Tailwind v4 dark mode using @variant instead of @custom-variant,
       (2) @source not set so Tailwind wasn't scanning src/app/*.tsx
User: looks exactly the same
Cosmo: Fixed dark mode selector to @custom-variant dark (&:where(.dark, .dark *)); — still not working
       because Tailwind wasn't scanning any source files at all
User: afraid not, let's just fix this and move on
Cosmo: Confirmed via built CSS that no utility classes were being emitted. Added @source "../src" to
       index.css — CSS output jumped from 4.44 kB to 6.60 kB with all classes present
```

### Phase 4: Approval
```
User: there we go looks nice and works as expected. stop cosmo
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 RUN  v3.2.4 /Users/flavorbrain/Code/cosmo-v3

 ✓ src/app/theme-provider.test.tsx (3 tests) 74ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  22:19:17
   Duration  489ms
```

**Status:** ✅ Success

### Tests

**Status:** ✅ All Passing

**Test Details:**

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/app/theme-provider.test.tsx` | applies dark class on system dark preference | ✅ Pass | On mount, reads `window.matchMedia('(prefers-color-scheme: dark)')` and adds `dark` class to `<html>` |
| 2 | `src/app/theme-provider.test.tsx` | toggles theme on button click | ✅ Pass | Calling `toggleTheme` switches between `dark`/`light`, updating the `<html>` class accordingly |
| 3 | `src/app/theme-provider.test.tsx` | persists theme to localStorage | ✅ Pass | After toggle, `localStorage.getItem('theme')` reflects the new value so preference survives page reload |

---

## Manual Verification Tasks

- [x] Run `npm run dev` — app opens in browser
- [x] Toggle button switches between dark and light mode visually
- [x] Refresh the page — theme persists (saffron accent visible in both modes)
- [x] Check `<html>` element in devtools — `dark` class present/absent on toggle

**Expected Results:**
- Inter font loaded, saffron `#D97706` accent visible on toggle button
- Dark background `#1C1917`, light background `#FAFAF9`
- Toggle button works and preference survives reload

---

## Summary

Full project foundation scaffolded: React 19 + Vite + TypeScript + Tailwind v4 with `@theme` design tokens, 3-bucket folder structure (`src/app/`, `src/features/`, `src/shared/`), Vitest + React Testing Library, and a working dark/light ThemeProvider.

Key Tailwind v4 lessons: `@source` must be set explicitly (auto-detection missed `src/app/` in this config), and class-based dark mode requires `@custom-variant dark (&:where(.dark, .dark *))`.
