# Cosmo v3

**Coordinated Slice Management Orchestrator** - A framework for building software incrementally through a structured 4-phase development loop.

## What is Cosmo?

Cosmo is a workflow system that guides AI-assisted development through phases of interviewing, planning, implementing, and approving. It breaks large projects into manageable slices while maintaining quality and documentation.

**Note:** This framework is designed to work with AI coding assistants like Claude (via GitHub Copilot or VSCode extensions) or Codex agents in VSCode.

## Getting Started

To start working with Cosmo, tell your AI assistant:

```
read cosmo.md and start
```

Cosmo will either:
- Resume from your last saved state (if `cosmo/current-phase.md` exists)
- Continue from existing spec (if `cosmo/spec.md` has content)
- Start a new project at Phase 1 (Interview)

## The 4-Phase Workflow

1. **📋 Phase 1: Interview** - Gather requirements and write product specification
2. **📋 Phase 2: Plan** - Identify next small slice and create implementation plan
3. **🔨 Phase 3: Implement** - Write code, tests, and verify quality
4. **✅ Phase 4: Approval** - Review changes and decide to approve or iterate

## Directory Structure

```
cosmo/
├── cosmo.md           # Main orchestrator instructions
├── workflow.md        # 4-phase workflow details
├── spec.md            # Product specification
├── templates.md       # Templates for state and plans
├── current-phase.md   # Current work in progress (runtime, not committed)
├── current-plan.md    # Living plan for current slice (runtime, not committed)
└── slices/            # Historical record of completed work (not committed)
```

## Key Features

- **Incremental development**: Small, focused slices (1-3 files per iteration)
- **State persistence**: Save and resume work at any phase
- **Quality assurance**: Automated testing and build verification built into the workflow
- **Documentation**: Every slice is documented with goals, changes, and verification steps
- **Natural conversations**: Maintain phase structure while allowing flexible discussions

## Commands

- `read cosmo.md and start` - Start or resume work
- Tell Cosmo to "pause" or "save progress" to persist your current state
- Approve plans and implementations when prompted to move forward

## Philosophy

Cosmo emphasizes:
- Small, manageable increments over large changes
- Automated testing as part of the development cycle
- Clear documentation of decisions and progress
- Flexibility within structure
- User control at decision points
