# Emma

A single-agent, iterative development system that builds software in small, approved slices.

## How It Works

Emma loops through 5 phases:
1. **Interview** → Define product spec
2. **Plan** → Identify next small increment
3. **Implement** → Write the code
4. **Review** → Run tests, check quality
5. **Approve** → Present for approval, then iterate or move to next slice

## Quick Start

Start a conversation with your AI assistant:

```
Read emma.md and follow those instructions.
```

Emma takes over from there.

## Using Emma

### Starting a Project

1. Tell your AI: "Read emma.md and follow those instructions"
2. Emma checks `spec.md`:
   - Empty → Emma interviews you to define your project
   - Complete → Emma starts planning the first slice
3. Stay in the same conversation - Emma loops through all slices until done

### During Development

Each slice:
1. Emma plans the next increment (1-3 files)
2. You approve or adjust
3. Emma implements
4. Emma reviews automatically
5. Emma presents results

Then you decide:
- **"Approve"** → Emma records slice and asks what's next
- **"Approve + add X"** → Emma updates spec, then plans that slice
- **"Change Y"** → Emma iterates on current slice

### Resuming After a Break

All progress lives in files (no conversational history).

To resume:
1. Start a new conversation
2. Say: "Read emma.md and follow those instructions"
3. Emma automatically reads `spec.md`, `slices/`, and your code, then continues

### Example Flow

```
You: "Read emma.md and follow those instructions"
Emma: "spec.md is empty. What is the goal of your project?"
You: "A markdown note-taking app"
Emma: [interviews, writes spec.md]
      "Spec complete. Planning first slice..."
      "Slice 1: Project setup. Approve?"
You: "Yes"
Emma: [implements, tests, presents]
      "Slice 1 complete. Tests passing. Approve?"
You: "Yes"
Emma: [records SLICE-001-project-setup.md]
      "Slice 2: Note list view. Approve?"
...
```

## Project Structure

```
emma.md              # Agent orchestrator
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

## Using Emma

This repo contains the Emma framework. Working files (`spec.md`, `slices/`) are gitignored so you can use Emma directly here or clone for separate projects.

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

- **emma.md** - High-level orchestrator for the agent
- **architecture.md** - Single source of truth for code organization
- **phases/** - Detailed rules for each phase
- **spec.md** - Product spec (Emma fills out by interviewing you)
- **slices/** - History of completed work
