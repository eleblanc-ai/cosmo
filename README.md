# Emma

A single-agent, iterative development system that builds software in small, approved slices.

## How It Works

Emma is one AI agent that loops through:
1. **Interview** → Define product spec (`spec.md`)
2. **Plan Slice** → Identify next small increment
3. **Implement** → Write the code
4. **Review** → Run tests, check quality automatically
5. **Approve** → Present to you for approval
6. **Iterate** → If changes needed, fix them; if approved, plan next slice

## Quick Start

Start a conversation with your AI assistant and say:

```
Read emma.md and follow those instructions.
```

That's it. Emma takes over from there.

## How to Use

### Starting a Project

1. **Tell your AI**: "Read emma.md and follow those instructions"
2. **Emma checks `spec.md`**:
   - If empty → Emma interviews you with questions to define your project
   - If complete → Emma starts planning the first slice
3. **Stay in the same conversation** - Emma will loop through all slices until done

### During Development

**Each slice follows this flow:**

1. **Emma plans** the next small increment (1-3 files)
2. **You approve or adjust** the plan
3. **Emma implements** the code
4. **Emma reviews** automatically (runs tests, checks quality)
5. **Emma presents** the results

**Then you decide:**
- **"Approve"** → Emma records the slice and asks what you want next
- **"Approve + specify next"** → Emma adds it to the spec, then plans that slice (side quest)
- **"Change X"** → Emma iterates on the current slice with your changes
- Keep iterating until you approve, then move to the next slice

### Resuming After a Break

Emma is **stateless** - all progress lives in files, not in conversation history.

If your conversation gets too long or you need to start fresh:

1. **Start a new conversation**
2. **Say the same thing**: "Read emma.md and follow those instructions"
3. **Emma will automatically**:
   - Read `spec.md` to see what needs to be built
   - Check `slices/` to see what's been completed
   - Look at your code to see the current state
   - Plan the next slice from where you left off

**The files ARE the state.** No special resume command needed - just start a new conversation and Emma picks up seamlessly.

### Example Flow

```
You: "Read emma.md and follow those instructions"

Emma: "spec.md is empty. Let me interview you.
       What is the goal of your project?"

You: "A markdown note-taking app"

Emma: [asks about users, features, data...]
      [writes spec.md]
      "Spec complete. Planning first slice..."

Emma: "Slice 1: Project setup (React + TypeScript). Approve?"
You: "Yes"

Emma: [implements, tests]
      "Slice 1 complete. Tests passing. Approve?"
You: "Yes"

Emma: [records SLICE-001-project-setup.md]
      "Slice 2: Note list view. Approve?"
You: "Make it a table instead"

Emma: [adjusts implementation]
      "Slice 2 updated with table view. Approve?"
You: "Yes"

Emma: [records SLICE-002-note-list.md]
      "Slice 3: Create note form..."
```

### Side Quest Example

You can specify the next slice instead of letting Emma decide:

```
Emma: "Slice 2: Note list view. Tests passing. Approve?"
You: "Approve. Now add markdown preview to the editor."

Emma: [records SLICE-002-note-list.md]
      [updates spec.md with markdown preview requirement]
      "Slice 3: Markdown preview in editor. Approve?"
You: "Yes"

Emma: [implements, tests]
      "Slice 3: Markdown preview complete. Approve?"
You: "Yes"

Emma: [records SLICE-003-markdown-preview.md]
      "What would you like to do next?"
You: "Continue with the main spec"

Emma: [plans next logical slice from spec]
      "Slice 4: Note creation form. Approve?"
```

All in one continuous conversation.

## Project Structure

```
emma.md              # Agent orchestrator (high-level overview)
architecture.md      # Architecture rules (buckets, imports, patterns)
spec.md              # Product specification (what to build)
phases/              # Detailed rules for each phase
  1-spec-writer.md   # Interview and create spec
  2-planner.md       # Plan next slice
  3-implementer.md   # Write code
  4-reviewer.md      # Run tests, check quality
  5-approval.md      # Present and handle approval
slices/              # History of completed slices
  SLICE-001-*.md
  SLICE-002-*.md
templates/           # Clean template files (never modified)
  spec.md
  architecture.md
reset.sh             # Script to restore templates
your-project/        # Your actual code goes here
```

## Development vs Distribution Repos

**This repo** (`emma-playground/`) is for framework development:
- Experiment with agent architecture
- Test changes with real specs and slices
- Working files (`spec.md`, `architecture.md`, `slices/SLICE-*.md`) are gitignored

**Distribution repo** (`emma/`) is for starting new projects:
- Clean framework files only
- Clone this to start new projects
- Sync updates from playground repo

### Syncing Changes

After making framework improvements in this repo, run:

```bash
./sync-template.sh
```

This will automatically:
- Copy framework files to `emma/`
- Commit changes with timestamp
- Push to remote (if configured)

## Resetting Emma

To clear your test run and start fresh:

```bash
./reset.sh
```

This will:
- Restore `spec.md` and `architecture.md` to clean templates
- Delete all completed slice files (`SLICE-*.md`)
- Leave the Emma framework files untouched

## The Loop

```
spec.md exists?
  No  → Interview user → Write spec.md
  Yes → Check slices/ → Plan next slice

Plan slice → Get approval → Implement → Review → Present
  ↓                                              ↓
  Approved? ───────────────────────────────────→ Next slice
  Changes?  ───→ Implement changes → Review → Present (loop)
```

## Slice Philosophy

- **Small**: 1-3 files per slice
- **Shippable**: Each slice should work and be testable
- **Sequential**: Build in logical order (dependencies first)
- **Approved**: User signs off before moving on

## Files

- **emma.md** - High-level orchestrator. Tells Emma which phase to be in.
- **architecture.md** - Architecture rules and patterns. Single source of truth for code organization.
- **phases/** - Detailed rules for each phase (spec writing, planning, implementing, reviewing, approval).
- **spec.md** - Product spec template. Emma fills this out by interviewing you.
- **slices/** - History of completed work. Emma creates SLICE-NNN-description.md files here.

## Philosophy

Emma keeps you in control:
- You approve every slice before moving on
- You can request changes at any time (becomes the next slice)
- Emma handles planning, implementation, and testing
- You handle product decisions and approval
