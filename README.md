# Cosmo

Meet Cosmo (**Co**ordinated **S**lice **M**anagement **O**rchestrator)!

Cosmo is a software development identity for AI assistants that helps you build React web apps in your IDE through small, user-approved slices. Cosmo coordinates five phases (spec, plan, implement, review, approve) to keep work scoped, testable, and auditable.

Theoretically works in any IDE with an LLM assistant (tested with GitHub Copilot in VSCode).

## How It Works

Cosmo is defined by a set of markdown files that live in your project. Your LLM reads `cosmo.md` and loops through 5 phases:

1. **Interview** → The LLM asks you questions about your project and writes a product spec to `spec.md`. This file becomes the single source of truth for what you're building.

2. **Plan** → The LLM reads your spec and existing code, then proposes the next small increment (1-3 files). You approve or adjust before any code is written.

3. **Implement** → The LLM writes the code for the approved plan. It follows patterns from your existing codebase and the architecture rules in `architecture.md`.

4. **Review** → The LLM runs tests, checks for issues, and verifies the implementation works. If there are problems, it fixes them before showing you.

5. **Approve** → The LLM presents the completed slice to you. You can approve it (moves to next slice), request changes (iterates on current slice), or add to the spec (updates plan).

Each completed slice gets documented in `slices/SLICE-###-description.md` so there's a full audit trail of what was built and why.

## Getting Started

1. **Clone Cosmo into your project:**
   ```bash
   git clone https://github.com/eleblanc-ai/cosmo.git
   ```

2. **Open your project in an LLM-enabled IDE**

3. **Start a conversation and tell your AI assistant:**
   ```
   Read cosmo.md and follow those instructions
   ```

4. **The LLM reads `cosmo.md` and checks `spec.md`:**
   - If `spec.md` is empty → Cosmo interviews you to define your project, writes the spec, then starts planning the first slice
   - If `spec.md` exists → Cosmo reviews it and starts planning the next slice

5. **Stay in the same conversation** - Cosmo will loop through all slices until your project is complete. Each slice goes through plan → implement → review → approve.

After each slice, you can:
- **"Approve"** → Cosmo saves the slice and plans the next one
- **"Approve and add [feature]"** → Cosmo updates the spec, then plans that feature
- **"Change [something]"** → Cosmo iterates on the current slice

### Resuming After a Break

All state lives in files (spec, architecture, slices). No conversation history needed.

To resume in a new conversation:
1. Start a fresh conversation in your IDE
2. Say: "Read cosmo.md and follow those instructions"
3. The LLM reads `spec.md`, `slices/`, and your code, then continues where you left off

## Example Flow

```
You: "Read cosmo.md and follow those instructions"
Cosmo: "spec.md is empty. What is the goal of your project?"
You: "A markdown note-taking app"
Cosmo: [interviews, writes spec.md]
      "Spec complete. Planning first slice..."
      "Slice 1: Project setup. Approve?"
You: "Yes"
Cosmo: [implements, tests, presents]
      "Slice 1 complete. Tests passing. Approve?"
You: "Yes"
Cosmo: [records SLICE-001-project-setup.md]
      "Slice 2: Note list view. Approve?"
...
```

## Project Structure

```
cosmo.md            # LLM orchestrator instructions
architecture.md     # Architecture rules
spec.md             # Product specification
phases/             # Detailed phase instructions
  1-spec-writer.md
  2-planner.md
  3-implementer.md
  4-reviewer.md
  5-approval.md
slices/             # Completed work history
  SLICE-001-*.md
  SLICE-002-*.md
templates/          # Clean templates
reset.sh            # Restore templates
```
## Resetting

To clear and start fresh:
```bash
./reset.sh  # Restores templates, deletes slices
```

## Slice Philosophy

- **Small**: 1-3 files per slice
- **Shippable**: Each slice works and is testable
- **Sequential**: Build in logical order
- **Approved**: User signs off before moving on

## Files

- **cosmo.md** - High-level orchestrator instructions for the LLM
- **architecture.md** - Single source of truth for code organization
- **phases/** - Detailed rules for each phase
- **spec.md** - Product spec (the LLM fills out by interviewing you)
- **slices/** - History of completed work
