# Slice 2: Auth

**Timestamp:** 2026-02-17
**Status:** Approved

---

## Plan

**Goal:** Add Supabase Auth (email/password) with sign-up, sign-in, sign-out, and a session-gated app shell.

**Files:**
- `src/shared/config/supabase.ts` (create) — Supabase client, reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- `.env.local` (create) — credential placeholders (gitignored)
- `src/vite-env.d.ts` (create) — TypeScript types for env vars
- `src/features/auth/auth-provider.tsx` (create) — session context, `signIn` / `signUp` / `signOut`
- `src/features/auth/auth-form.tsx` (create) — email/password form, sign-in/sign-up toggle
- `src/features/auth/auth-form.test.tsx` (create) — 3 tests
- `src/app/main.tsx` (modify) — wrap app in `AuthProvider`
- `src/app/App.tsx` (modify) — show loading → auth form → authenticated shell

**Outcome:** User can sign up, sign in, see authenticated shell with email + sign out, and sign out. Unauthenticated users see the auth form.

**Verification:** `npm run verify` passes

---

## User Interactions

### Phase 2: Planning
```
Cosmo: Proposed Slice 2: Auth — Supabase client, auth context, sign-in/sign-up form, session-gated shell
User: yes, and walk me through the steps to set up supabase in the app and to sql to create any needed tables
```

### Phase 3: Implementation
```
(No issues — 6/6 tests passing on first run)
```

### Phase 4: Approval
```
User: ok slice approved
```

---

## Build & Test Results

### Build
```
> recipe-lab@0.0.0 verify
> tsc -b && eslint . && vitest run

 ✓ src/app/theme-provider.test.tsx (3 tests)
 ✓ src/features/auth/auth-form.test.tsx (3 tests)

 Test Files  2 passed (2)
      Tests  6 passed (6)
```

**Status:** ✅ Success

### Tests

**Status:** ✅ All Passing

**Test Details:**

| # | File | Test name | Status | What it verifies |
|---|------|-----------|--------|-----------------|
| 1 | `src/features/auth/auth-form.test.tsx` | renders email and password fields | ✅ Pass | Form renders email input, password input, and sign-in button in default mode |
| 2 | `src/features/auth/auth-form.test.tsx` | calls signIn with email and password on submit | ✅ Pass | Filling and submitting the form calls `signIn` with the entered credentials |
| 3 | `src/features/auth/auth-form.test.tsx` | toggles to sign-up mode | ✅ Pass | Clicking the toggle button switches from "Sign in" to "Create account" mode |

---

## Manual Verification Tasks

- [x] Add Supabase URL and anon key to `.env.local`
- [x] Run SQL in Supabase SQL Editor to create tables + RLS policies
- [x] `npm run dev` → auth form appears
- [x] Sign up → authenticated shell with email + sign out visible
- [x] Sign out → back to auth form
- [x] Refresh while signed in → session persists

**Expected Results:**
- Auth form: saffron submit button, inputs with saffron focus border, sign-in/sign-up toggle
- Authenticated shell: email shown in header, sign out and theme toggle visible

---

## Summary

Supabase Auth wired up end to end. `AuthProvider` manages session state via `onAuthStateChange`. All future features can call `useAuth()` to get the current session and `user_id`. Database tables (`recipes`, `recipe_versions`, `chat_messages`) and RLS policies created in Supabase.
