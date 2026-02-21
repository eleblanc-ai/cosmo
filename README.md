# Cosmo

Cosmo is a software development "identity" for Claude — a persona it takes on to build React apps incrementally through a disciplined 4-phase loop. It interviews you to write a spec, plans one small slice at a time, implements with tests, and gets your approval before moving on — keeping you in control at every step.

*Currently optimized for React 18, TypeScript, Vite, Tailwind CSS, and Supabase. Support for additional stacks is planned.*

---

## How it works

Cosmo operates in four phases, cycling through them until your product is complete.

```
Phase 1: Interview   →  Write the spec together
Phase 2: Plan        →  Identify the next slice
Phase 3: Implement   →  Build it, test it, verify it
Phase 4: Approval    →  Review, approve, or iterate
```

Each slice is small and focused — typically 1–3 files. Every slice must pass tests and build before it's considered done. The cycle keeps feedback tight and the codebase clean.

---

## Getting started

Cosmo runs inside [Claude Code](https://claude.ai/code) using project instructions.

**1. Add Cosmo as your project instructions**

In Claude Code, set your project instructions to:

```
Read cosmo/cosmo.md and follow it.
```

**2. Start a session**

```
start cosmo
```

Cosmo checks for saved state and picks up exactly where you left off, or starts Phase 1 if you're new.

**3. Pause and resume**

```
stop cosmo
```

Cosmo saves its phase context so the next session resumes without losing anything.

---

## Workspace structure

`cosmo-workspace` is the root of everything — it holds the Cosmo framework and all the projects you build with it. Each project lives in its own subfolder with its own git repo, completely separate from this one.

```
cosmo-workspace/
├── cosmo/
│   ├── cosmo.md           ← Identity instructions (read-only)
│   ├── workflow.md        ← The 4-phase loop (read-only)
│   ├── architecture.md    ← Universal architecture principles (read-only)
│   ├── templates.md       ← Document templates (read-only)
│   ├── spec.md            ← Your product spec (Phase 1 output)
│   ├── current-phase.md   ← Resume point when pausing
│   ├── current-plan.md    ← Active slice plan
│   └── slices/            ← Completed slice records
│       ├── slice-1-project-setup.md
│       ├── slice-2-auth.md
│       └── ...
├── recipe-lab/            ← Your app (its own git repo)
│   ├── .git/
│   ├── src/
│   └── ...
└── my-other-app/          ← Another app (its own git repo)
```

Framework files (`cosmo.md`, `workflow.md`, `architecture.md`, `templates.md`) are read-only — Cosmo never edits them. When starting a new project, Cosmo scaffolds it into a subfolder, initializes a fresh git repo there, and helps you push it to GitHub.

---

## Philosophy

**One slice at a time.** No big bang rewrites. Every slice is small enough to review in a single conversation.

**Spec first.** Cosmo won't write a line of code until the spec is agreed on. The spec lives in `cosmo/spec.md` and is the source of truth throughout the build.

**Always resumable.** Work can stop at any point. State is saved to `current-phase.md` so the next session continues exactly where you left off.

**Quality gates.** A slice isn't done until tests pass and the build verifies. No skipping.

**User in control.** Cosmo proposes, you decide. Every slice requires explicit approval before code is written, and again before it's recorded as complete.

---

## Example session

```
You:    start cosmo
Cosmo:  Phase 1: Interview — Writing spec
        Tell me about the product you want to build.

You:    A recipe app where AI helps you craft recipes from sources around the web.
Cosmo:  Great. A few questions...
        [interviews you, writes spec.md]
        Does this spec capture your vision? (yes/no)

You:    yes
Cosmo:  Phase 2: Plan — Planning next slice
        [reads spec, examines codebase, proposes Slice 1]
        Approve this plan? (yes/no)

You:    yes
Cosmo:  Phase 3: Implement — Writing code and verifying quality
        [builds, tests, verifies]
        Phase 4: Approval — Presenting slice
        All 12 tests pass. Here's what was built...
        What next? (1) Next slice  (2) More work needed

You:    1
Cosmo:  Phase 2: Plan...
```
