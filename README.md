
# Cosmo Workspace
![starry background with colorful clouds](/img/readme-cover.png)

Cosmo-workspace is a template repository for building React apps with Cosmo — a software development identity for Claude. Clone it once per project. Cosmo interviews you to write a spec, plans one small slice at a time, implements with tests, and gets your approval before moving on — keeping you in control at every step.

The `cosmo/` folder is a git submodule pointing at [github.com/eleblanc-ai/cosmo](https://github.com/eleblanc-ai/cosmo), the Cosmo framework. Your project files live alongside it in the workspace.

---

## Contents

- [How it works](#how-it-works)
- [Getting started](#getting-started)
- [Workspace structure](#workspace-structure)
- [Updating Cosmo](#updating-cosmo)
- [Philosophy](#philosophy)
- [Example session](#example-session)

---

## How it works

Cosmo operates in four phases, cycling through them until your product is complete.

```
Phase 1: Interview   →  Write the spec together
Phase 2: Plan        →  Identify the next slice
Phase 3: Implement   →  Build it, test it, verify it
Phase 4: Approval    →  Review, approve, or iterate
```

Each slice is small and focused. Before a slice is considered done, it must pass tests, build successfully, and pass a series of manual verification steps you perform in the browser or app. The cycle keeps feedback tight and the codebase clean.

*Currently optimized for React 18, TypeScript, Vite, Tailwind CSS, and Supabase. Support for additional stacks is planned.*

---

## Getting started

Cosmo runs inside an AI coding agent using project instructions.

**1. Clone the template**

```bash
git clone --recurse-submodules https://github.com/eleblanc-ai/cosmo-workspace my-project
```

The `--recurse-submodules` flag pulls in the `cosmo/` framework alongside the workspace.

**2. Open in your AI coding agent**

Open your cloned folder with a Claude coding agent that supports project-level instructions and tool use. Tested with GitHub Copilot agent mode in VS Code (with Claude).

**3. Start a session**

Set your agent's project instructions to:

```
Read cosmo/cosmo.md and follow it.
```

Cosmo checks for saved state and picks up exactly where you left off, or starts Phase 1 if you're new.

**4. Pause and resume**

```
pause cosmo
```

Cosmo saves its phase context so the next session resumes without losing anything.

If you have already activated and then paused it, you can restart with:

```
start cosmo
```

---

## Workspace structure

Each workspace holds exactly one project. The `cosmo/` folder is the framework (a git submodule); your app lives in a named subfolder alongside it.

```
cosmo-workspace/
├── cosmo/                 ← Cosmo framework (git submodule, read-only)
│   ├── cosmo.md           ← Identity instructions
│   ├── workflow.md        ← The 4-phase loop
│   ├── architecture.md    ← Universal architecture principles
│   ├── templates.md       ← Document templates
│   ├── stacks/            ← Stack-specific rules
│   └── VERSION            ← Framework version
├── .cosmo-state/          ← Project state (tracked by your workspace repo)
│   ├── spec.md            ← Your product spec (Phase 1 output)
│   ├── current-phase.md   ← Resume point when pausing
│   ├── current-plan.md    ← Active slice plan
│   ├── test-report.md     ← Cumulative test report
│   └── slices/            ← Completed slice records
│       ├── slice-1-project-setup.md
│       ├── slice-2-auth.md
│       └── ...
└── your-project/          ← Your app
    ├── src/
    └── ...
```

Cosmo never edits framework files. To start a new project, clone a fresh copy of this template.

---

## Updating Cosmo

Cosmo checks for updates at the start of each session and prompts you to apply them. If you prefer to update manually:

```bash
git submodule update --remote cosmo
```

---

## Philosophy

**One slice at a time.** No big bang rewrites. Every slice is small enough to review in a single conversation.

**Spec first.** Cosmo won't write a line of code until the spec is agreed on. The spec lives in `.cosmo-state/spec.md` and is the source of truth throughout the build.

**Always resumable.** Work can stop at any point. State is saved to `.cosmo-state/current-phase.md` so the next session continues exactly where you left off.

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
