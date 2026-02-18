# Cosmo v3

**Coordinated Slice Management Orchestrator** - A framework for building software incrementally through a structured 4-phase development loop.

## What is Cosmo?

Cosmo is a development workflow that guides LLM agents through disciplined software construction. It enforces architectural consistency, prevents scope creep, and maintains quality through mandatory testing and verification gates.

**Best suited for:** Projects with 5+ development iterations, complex architecture requirements, or work that requires resumability across sessions.

**Designed for:** Claude agents (Claude Code, GitHub Copilot with Claude, or any Claude-powered coding assistant). May work with other agents but is built and tested with Claude.

## Why Use Cosmo?

**Prevents expensive mistakes:**
- Upfront planning catches architectural conflicts before code is written
- Refactoring detection prevents tight coupling between modules
- Test planning strategy catches bugs that isolated unit tests miss

**Enforces quality:**
- Every slice must pass automated verification (tests + lint + build)
- Complete test coverage required before approval
- Code quality rules enforced (function size, complexity, naming)

**Handles interruptions:**
- Resume work from any point across sessions
- State management preserves context when switching tasks
- Complete audit trail of decisions and changes

**Maintains consistency:**
- Universal architecture principles apply across entire project
- Project-specific rules defined once in spec.md
- No drift from established patterns

**Technology-agnostic:**
- Works with any language or framework
- Adapts to your project structure
- Follows your existing conventions

## Trade-offs

**Higher per-session cost:**
- Reads ~4,000 tokens of framework documentation per session
- Best ROI for projects with 5+ slices

**Structured workflow:**
- Requires discipline in following phases
- Less flexible than ad-hoc prompting
- More overhead for simple tasks

**When not to use:**
- Single-file scripts or utilities
- Exploratory prototyping
- Projects under 500 lines of code

## Getting Started

Tell your AI assistant:

```
read cosmo/cosmo.md and start
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
├── cosmo.md           # Entry point - start here
├── workflow.md        # Complete 4-phase process reference
├── architecture.md    # Universal architecture principles
├── templates.md       # Document templates
├── spec.md            # Product specification (Phase 1 output)
├── current-phase.md   # Resume point (not committed)
├── current-plan.md    # Living plan for current slice (not committed)
└── slices/            # Historical record (not committed)
```

## Key Features

**Incremental development:**
- Small, focused slices (1-3 files per iteration)
- Clear "done" criteria for each slice
- User-visible value delivered frequently

**State persistence:**
- Save and resume work at any phase
- Handles context switches and interruptions
- No loss of progress or decisions

**Quality assurance:**
- Automated testing and build verification required
- Test planning guidance prevents common gaps
- Definition of Done checklist enforced

**Documentation:**
- Every slice documented with goals, changes, and verification steps
- Complete audit trail of architectural decisions
- Plan tracking captures iterations and scope changes

**Natural conversations:**
- Ask questions during any phase
- Discuss approaches and alternatives
- Workflow guides but doesn't restrict

## Commands

- `read cosmo/cosmo.md and start` - Start or resume work
- `cosmo stop` - Save current state and pause
- `cosmo start` - Resume from saved state
- Approve plans and implementations when prompted to move forward

## Architecture Principles

Cosmo enforces these universal principles:

- **Separation of concerns**: Features, shared code, and app shell organized clearly
- **Import boundaries**: No cross-feature dependencies (prevents coupling)
- **Rule of Three**: Only abstract after writing similar code 3 times
- **Test complete workflows**: Not just isolated operations
- **Minimal abstractions**: Avoid premature optimization

Your project defines specific rules (language, framework, structure) in `spec.md`.

## Philosophy

Cosmo emphasizes:
- Small, manageable increments over large changes
- Automated testing as part of the development cycle
- Clear documentation of decisions and progress
- Flexibility within structure
- User control at decision points
- Quality gates before shipping

## Example Projects

Cosmo has been tested with:
- React + Vite + Tailwind (recipe app - 4 slices, 26 tests)
- Other frameworks welcome - submit examples!

## Contributing

To improve Cosmo:
1. Use it on your project
2. Note what works and what doesn't
3. Submit issues or PRs with specific improvements
4. Keep changes backward-compatible

## License

MIT
