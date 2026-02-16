# Cosmo

**Coordinated Slice Management Orchestrator** - A single-agent, iterative development system that builds software in small, approved slices. Cosmo coordinates five phases (spec, plan, implement, review, approve) to deliver production-quality code incrementally.

## How It Works

Cosmo loops through 5 phases:
1. **Interview** → Define product spec
2. **Plan** → Identify next small increment
3. **Implement** → Write the code
4. **Review** → Run tests, check quality
5. **Approve** → Present for approval, then iterate or move to next slice

## Quick Start

Start a conversation with your AI assistant:

```
Read cosmo.md and follow those instructions.
```

Cosmo takes over from there.

## Using Cosmo

### Starting a Project

1. Tell your AI: "Read cosmo.md and follow those instructions"
2. Cosmo checks `spec.md`:
   - Empty → Cosmo interviews you to define your project
   - Complete → Cosmo starts planning the first slice
3. Stay in the same conversation - Cosmo loops through all slices until done

### During Development

Each slice:
1. Cosmo plans the next increment (1-3 files)
2. You approve or adjust
3. Cosmo implements
4. Cosmo reviews automatically
5. Cosmo presents results

Then you decide:
- **"Approve"** → Cosmo records slice and asks what's next
- **"Approve + add X"** → Cosmo updates spec, then plans that slice
- **"Change Y"** → Cosmo iterates on current slice

### Resuming After a Break

All progress lives in files (no conversational history).

To resume:
1. Start a new conversation
2. Say: "Read cosmo.md and follow those instructions"
3. Cosmo automatically reads `spec.md`, `slices/`, and your code, then continues

### Example Flow

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
cosmo.md             # Agent orchestrator
architecture.md      # Architecture rules
spec.md              # Product specification
phases/              # Detailed phase instructions
  1-spec-writer.md
  2-planner.md
  3-implementer.md
  4-reviewer.md
  5-approval.md
slices/              # Completed work history
  SLICE-001-*.md
  SLICE-002-*.md
templates/           # Clean templates
reset.sh             # Restore templates
```

## Using Cosmo

This repo contains the Cosmo framework. Working files (`spec.md`, `slices/`) are gitignored so you can use Cosmo directly here or clone for separate projects.

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

- **cosmo.md** - High-level orchestrator for the agent
- **architecture.md** - Single source of truth for code organization
- **phases/** - Detailed rules for each phase
- **spec.md** - Product spec (Cosmo fills out by interviewing you)
- **slices/** - History of completed work
