# Cosmo Manual Testing Checklist

Use this checklist to verify that an LLM agent is correctly following Cosmo's 5-phase workflow and all architectural rules.

---

## ✅ Initial Startup Behavior

When you tell the agent "Read cosmo/cosmo.md and follow those instructions":

### Phase Detection
- [ ] Agent reads `cosmo/spec.md` to determine which phase to start in
- [ ] If `cosmo/spec.md` is empty → Starts in Phase 1 (Spec Writer)
- [ ] If `cosmo/spec.md` has content → Starts in Phase 2 (Planner)
- [ ] Agent explicitly states which phase it's starting in

### Communication Guidelines (ALL PHASES)
- [ ] **Phase indicator is VISIBLE**: Uses heading or bold with emoji (e.g., `## 📝 Phase 1: Writing Product Spec`)
- [ ] Phase indicator appears at the START of every response
- [ ] Agent ends with a CLEAR QUESTION that guides next step (except Phase 3 & 4 which proceed automatically)

---

## 📝 Phase 1: Spec Writer

**Purpose**: Interview user and create/update `cosmo/spec.md`

### Scope Compliance
- [ ] Agent ONLY modifies `cosmo/spec.md` (no code, tests, config, or slices)
- [ ] If asked to write code → Agent redirects to workflow
- [ ] If asked to plan → Agent redirects to workflow

### Interview Process (New Spec)
- [ ] Asks ONE question at a time (doesn't overwhelm user)
- [ ] Covers these areas:
  - [ ] Goal
  - [ ] Users
  - [ ] Core flows ("User can ___")
  - [ ] Data/entities (high-level)
  - [ ] Non-goals
  - [ ] Constraints/assumptions
- [ ] Doesn't invent requirements (asks if uncertain)
- [ ] Focuses on WHAT, not HOW

### Spec Output Format
- [ ] Writes to `cosmo/spec.md` (NOT root directory)
- [ ] Includes all required sections:
  - [ ] Goal
  - [ ] Users
  - [ ] Core flows
  - [ ] Data (high-level)
  - [ ] Non-goals
  - [ ] Constraints/Assumptions
  - [ ] Verification (testing framework, `npm run verify` command)
  - [ ] Architecture
- [ ] Spec is concise (~20-40 lines)
- [ ] Uses "User can ___" statements for core flows
- [ ] Documents that Vitest and verify script are already installed (if init.sh was run)

### Update Existing Spec
- [ ] Reads existing `cosmo/spec.md` first
- [ ] Asks clarifying questions about new functionality
- [ ] Adds new core flows (keeps completed flows intact)
- [ ] Makes features specific and testable

### Communication
- [ ] Starts with: `## 📝 Phase 1: Writing Product Spec`
- [ ] Ends with question like:
  - [ ] "What else should I know about [topic]?" (while gathering)
  - [ ] "Does this spec capture your vision?" (when presenting)
  - [ ] "Should I update the spec with these changes?" (after feedback)

### After Completion
- [ ] Confirms spec with user before proceeding
- [ ] States it's moving to Phase 2
- [ ] Actually proceeds to Phase 2 (doesn't wait for permission)

---

## 📋 Phase 2: Planner

**Purpose**: Plan the next smallest, shippable slice

### Scope Compliance
- [ ] Agent ONLY reads files and presents plans
- [ ] Does NOT modify any code files
- [ ] Does NOT modify `cosmo/spec.md`
- [ ] Does NOT modify `cosmo/slices/`
- [ ] If asked to implement → Agent redirects to workflow

### Required Reading (Before Planning)
Agent must read these files:
- [ ] `architecture.md` (FIRST)
- [ ] `cosmo/spec.md`
- [ ] Architecture section in `cosmo/spec.md`
- [ ] `cosmo/slices/` directory (what's completed)
- [ ] Current codebase (understand patterns)

### First Slice Detection
If no slices exist yet:
- [ ] First slice MUST include:
  - [ ] Project setup (folder structure, config)
  - [ ] Basic example component/function
  - [ ] Test for the example to verify test infrastructure works
  - [ ] Must achieve: `npm run verify` passes
- [ ] Agent acknowledges that Vitest and verify script are already installed

### Refactoring Detection
- [ ] Agent checks if slice will use code from a feature folder
- [ ] If yes → Plans separate refactoring slice FIRST
- [ ] Refactoring slice: Move component from `features/X` to `src/shared`
- [ ] Only promotes code when used by 2+ features

### Slice Planning
- [ ] Identifies next logical slice (not random)
- [ ] Slice is SMALL: 1-3 files
- [ ] Slice is FOCUSED: One clear purpose
- [ ] Builds in order (dependencies first)

### Plan Completeness
Plan includes ALL of these:
- [ ] **Name**: 1-3 word description
- [ ] **Goal**: One sentence
- [ ] **Why now**: Prerequisites, dependencies, logical order
- [ ] **Scope**:
  - [ ] In scope: What will be built
  - [ ] Out of scope: What won't be included
- [ ] **User-visible outcome**: "User can ___" statement
- [ ] **File map**: Files to create or modify
- [ ] **Data/API assumptions**: Brief notes (if relevant)
- [ ] **Tests**: What tests will be added/updated
- [ ] **Verification**: How to verify it works
- [ ] **Risks/Open decisions**: Any unknowns

### Architecture Considerations
- [ ] File placement follows bucket rules (features/shared/app)
- [ ] No forbidden import boundaries
- [ ] If creating shared code, it's actually used by 2+ features
- [ ] Maintains or improves architecture

### Stop Condition
Planning is finished when ALL of these are true:
- [ ] The slice is minimal and clear
- [ ] User-visible outcome is defined ("User can ___")
- [ ] Verification is defined (how to test/verify)
- [ ] No unanswered architectural conflicts remain
- [ ] Plan is complete and internally consistent
- [ ] Agent STOPS and presents to user (doesn't proceed without approval)

### Communication
- [ ] Starts with: `## 📋 Phase 2: Planning Next Slice`
- [ ] Ends with question like:
  - [ ] "Approve this plan?"
  - [ ] "Should I adjust the scope to [option]?"
  - [ ] "Does this revised plan work better?"

### After Approval
- [ ] States it's moving to Phase 3
- [ ] Proceeds to Phase 3 (Implementer)

### If User Requests Changes
- [ ] Adjusts plan based on feedback
- [ ] Re-presents for approval
- [ ] Stays in Phase 2 until approved

---

## 🔨 Phase 3: Implementer

**Purpose**: Implement exactly one slice from approved plan

### Scope Compliance
- [ ] Agent ONLY implements approved plan
- [ ] May modify: `src/**`, tests, config, dependencies (as specified in plan)
- [ ] Does NOT modify: `cosmo/spec.md` or `cosmo/slices/`
- [ ] Does NOT modify files outside approved plan scope
- [ ] If asked to do something else → Agent redirects to workflow

### Required Reading (Before Coding)
Agent must read:
- [ ] The approved plan from Phase 2
- [ ] `architecture.md`
- [ ] `cosmo/spec.md` (including Architecture section)
- [ ] Relevant existing code (understand patterns)

### Implementation Quality
- [ ] Follows the plan EXACTLY (no scope creep)
- [ ] Follows architecture rules from `architecture.md`
- [ ] Follows project-specific rules from `cosmo/spec.md` Architecture section
- [ ] Matches existing code patterns
- [ ] Keeps changes MINIMAL (only what's needed)

### Architecture Compliance
- [ ] Files placed in correct bucket (features/shared/app)
- [ ] Respects import boundaries:
  - [ ] Features DON'T import other features
  - [ ] Features MAY import from shared/app
  - [ ] Shared DOESN'T import from features
- [ ] Only creates shared code when used by 2+ features
- [ ] No premature abstraction
- [ ] New config is centralized (if applicable)

### Styling (if UI work)
- [ ] Uses ONLY Tailwind CSS utility classes
- [ ] NO CSS modules
- [ ] NO styled-components
- [ ] NO separate CSS files
- [ ] NO inline styles

### Testing Requirements
- [ ] Adds or updates tests for ALL new/changed behavior
- [ ] Tests match existing test patterns
- [ ] If first slice: Sets up test infrastructure
- [ ] Never removes tests (unless explicitly in plan)

### Verification (MANDATORY)
- [ ] Runs `npm run verify` before proceeding
- [ ] ALL checks must pass:
  - [ ] Type-check passes
  - [ ] Lint passes
  - [ ] Tests pass
- [ ] If fails: Fixes and reruns until passing
- [ ] Does NOT proceed to Phase 4 while verification fails
- [ ] NO manual verification (must be automated)

### Security
Checks for and avoids:
- [ ] Command injection vulnerabilities
- [ ] XSS vulnerabilities
- [ ] SQL injection
- [ ] Insecure authentication/authorization
- [ ] Exposed secrets or credentials (use .env files)
- [ ] OWASP Top 10 vulnerabilities

### Additional Standards
Code quality requirements:
- [ ] **Error handling**: Fails fast with clear messages, never swallows exceptions silently
- [ ] **Type checking**: All code passes strict type checking (Python: `mypy --strict`, TypeScript: `tsc --noEmit`)
- [ ] **Bash scripts**: Use strict mode (`#!/bin/bash` + `set -euo pipefail`), lint with `shellcheck` and `shfmt`
- [ ]  **Git commits**: Imperative mood, ≤72 char subject, one logical change per commit, never amend/rebase pushed commits
- [ ] **Secrets handling**: Never commit secrets, use gitignored `.env` files and environment variables
- [ ] **CI**: No scheduled runs without code changes

### Communication
- [ ] Starts with: `## 🔨 Phase 3: Implementing [slice name]`
- [ ] Does NOT end with question to user
- [ ] After completion: "Implementation complete. All tests passing with npm run verify."
- [ ] Immediately proceeds to Phase 4

### Common Pitfalls (Agent Should AVOID)
- [ ] NO refactoring code not in the plan
- [ ] NO features beyond the plan
- [ ] NO abstractions for one-time use
- [ ] NO config for hypothetical future needs
- [ ] NO unnecessary dependencies
- [ ] NO skipping tests
- [ ] NO changing architecture patterns without discussion

---

## 🔍 Phase 4: Reviewer

**Purpose**: Review implementation before presenting to user

### Scope Compliance
- [ ] Agent may modify code to fix QUALITY issues (unused imports, formatting)
- [ ] Agent may run verification commands
- [ ] Does NOT modify: `cosmo/spec.md`, `cosmo/slices/`, files outside slice scope
- [ ] Does NOT modify core functionality (must go back to Phase 3 if needed)

### Required Reading (Before Review)
Agent must read:
- [ ] `architecture.md`
- [ ] `cosmo/spec.md` (including Architecture section)
- [ ] The approved plan from Phase 2
- [ ] Git diff (all changed files)
- [ ] Test output from `npm run verify`

### Automated Checks (MANDATORY)
- [ ] Runs `npm run verify`
- [ ] Must pass COMPLETELY before proceeding
- [ ] If fails → Goes back to Phase 3 (doesn't ask user)

### Review Checklist - Scope
- [ ] Only implements what the approved plan requires
- [ ] No scope creep
- [ ] No "nice to have" additions
- [ ] File count matches plan (or close)

### Review Checklist - Architecture
- [ ] File placement correct (features/shared/app)
- [ ] No new top-level buckets without approval
- [ ] Import boundaries respected:
  - [ ] Runs: `grep -r "from ['\"].*features/" src/features/`
  - [ ] No violations found
- [ ] Tailwind styling only (no CSS files, styled-components, inline styles)
- [ ] Config is centralized (if applicable)
- [ ] Shared code only when used by 2+ features

### Review Checklist - Code Quality
- [ ] No unused imports, exports, or dead code
- [ ] No behavior regressions
- [ ] Edge cases considered
- [ ] No silent changes to public APIs
- [ ] Implementation matches the plan
- [ ] Follows existing code patterns

### Review Checklist - Tests
- [ ] Tests exist for ALL new/changed functionality
- [ ] Tests are meaningful (not just snapshots or no-ops)
- [ ] No tests deleted without plan approval
- [ ] Test patterns match existing codebase
- [ ] All tests pass

### Review Checklist - Cleanliness
- [ ] No unused exports or imports
- [ ] No dead code or commented-out code
- [ ] Naming is clear and descriptive

### Review Checklist - Documentation
- [ ] Exported components/hooks/utilities have concise doc comments
- [ ] Plan updated if scope changed
- [ ] Spec updated if requirements changed (requires user approval)

### Review Checklist - Configuration
- [ ] Defaults are centralized
- [ ] New options are documented
- [ ] New options are tested
- [ ] No hidden config scattered

### Review Checklist - Definition of Done
- [ ] Minimal diff (no unrelated changes)
- [ ] No unused code
- [ ] Docs updated if behavior/config changed
- [ ] Architecture boundaries respected
- [ ] Code follows existing patterns
- [ ] Verification passes

### Security Checklist
- [ ] No command injection
- [ ] No XSS vulnerabilities
- [ ] No SQL injection
- [ ] Authentication/authorization secure
- [ ] No exposed secrets
- [ ] OWASP Top 10 considered

### What Gets Auto-Fixed vs Escalated

**Auto-fix** (quality issues - agent fixes immediately):
- [ ] Unused imports/exports
- [ ] Lint errors
- [ ] Formatting issues
- [ ] Typos in variable names
- [ ] Simple doc comment additions

**Escalate to Phase 3** (behavior issues - must go back):
- [ ] Bugs or incorrect logic
- [ ] Missing tests
- [ ] Scope creep (features not in plan)
- [ ] Architecture violations
- [ ] Security vulnerabilities
- [ ] Breaking changes

### Decision Making
- [ ] If ALL checks pass → Proceeds to Phase 5
- [ ] If quality issues (imports, formatting) → Fixes immediately, reruns verify
- [ ] If behavior issues (bugs, missing tests, scope creep) → Goes back to Phase 3
- [ ] Does NOT ask user (handles internally)

### Communication
- [ ] Starts with: `## 🔍 Phase 4: Reviewing [slice name]`
- [ ] Does NOT end with question to user
- [ ] When passing: Lists all checks passed, proceeds to Phase 5
- [ ] When failing: Lists specific issues, returns to Phase 3

---

## ✅ Phase 5: Approval

**Purpose**: Present completed slice to user and record if approved

### Scope Compliance
- [ ] May create files in `cosmo/slices/` directory
- [ ] May read any files to check completion
- [ ] May run git commands (`git add`, `git commit`, `git push`)
- [ ] Does NOT modify: `cosmo/spec.md`, source code, or existing slice files

### Presentation
Presents with:
- [ ] Slice name (1-3 words)
- [ ] Summary of what was implemented
- [ ] Files created/modified (with line numbers if helpful)
- [ ] Review results (tests passed, lint clean, etc.)

### Manual Verification Checklist (REQUIRED)
- [ ] **Always provides a checklist** (even for backend/non-UI work)
- [ ] Actionable and specific to implementation
- [ ] User can complete each item in under 2 minutes
- [ ] Formatted as numbered checklist with checkboxes
- [ ] For UI slices: Includes URL, buttons to click, expected behavior
- [ ] For backend slices: Includes `npm run verify`, how to test behavior
- [ ] Includes edge cases to verify
- [ ] 3-8 items max (focused)

### Communication
- [ ] Starts with: `## ✅ Phase 5: Presenting Slice [N] for Approval`
- [ ] Ends with question:
  - [ ] "Approve this slice?"
  - [ ] "What would you like to do next?" (after approval)
  - [ ] "Does this address your feedback?" (if iterating)

### If User Approves

#### 1. Record the Slice
- [ ] Creates `cosmo/slices/SLICE-NNN-description.md`
- [ ] Filename format: `SLICE-001-project-setup.md` (zero-padded number, 1-3 word slug)
- [ ] Includes:
  - [ ] Date completed
  - [ ] What was implemented
  - [ ] Files created/modified
  - [ ] Review results
  - [ ] Manual verification checklist
  - [ ] Notes (if relevant)

#### 2. Commit and Push (REQUIRED)
- [ ] Runs `npm run type-check && npm run lint` before committing
- [ ] Stages all changes: `git add .`
- [ ] Creates commit with format:
  ```
  Slice NNN: description

  [2-3 sentence summary from slice doc]
  ```
- [ ] Subject line ≤72 characters
- [ ] Subject line uses imperative mood (e.g., "Add login form", not "Added")
- [ ] Pushes to main: `git push origin main`
- [ ] If push fails: Warns user but continues (doesn't block workflow)

#### 3. Check Spec Completion
- [ ] Reads `cosmo/spec.md`
- [ ] Reviews all completed slices
- [ ] If all core flows implemented → Celebrates, confirms with user
- [ ] If more work remains → Continues to step 4

#### 4. Ask About Next Slice
- [ ] "What would you like to do next?"
- [ ] If user lets Cosmo decide → Proceeds to Phase 2
- [ ] If user specifies feature → Goes to Phase 1 to update spec

### If User Approves + Specifies Next Feature
- [ ] Goes to Phase 1 (Spec Writer)
- [ ] Asks clarifying questions
- [ ] Updates `cosmo/spec.md`
- [ ] Confirms update with user
- [ ] Goes to Phase 2 to plan the slice

### If User Requests Changes
- [ ] Treats as iteration on current slice
- [ ] Goes back to Phase 3 (Implementer)
- [ ] Implements requested changes
- [ ] Goes through review and presents again
- [ ] Keeps same slice number (doesn't increment until approved)

---

## 🚫 Workflow Enforcement

**CRITICAL**: Agent must stay within the 5-phase loop

### Out-of-Workflow Request Handling
If user asks for something outside current phase:
- [ ] Acknowledges the request
- [ ] Explains where they are in workflow
- [ ] Guides them to right place:
  - [ ] "Want to add feature? → Let me finish this phase, then we'll update spec"
  - [ ] "Want to change something? → I'll note that for current/next slice"
  - [ ] "Want to skip ahead? → Cosmo works sequentially to ensure quality"
- [ ] Continues with current phase
- [ ] Does NOT break out of workflow to satisfy ad-hoc requests

### Phase Transitions
- [ ] Phase 1 → Phase 2 (after spec confirmed)
- [ ] Phase 2 → Phase 3 (after plan approved)
- [ ] Phase 3 → Phase 4 (automatic, after verification passes)
- [ ] Phase 4 → Phase 5 (automatic, after review passes)
- [ ] Phase 4 → Phase 3 (if issues found)
- [ ] Phase 5 → Phase 2 (after slice approved, plan next)
- [ ] Phase 5 → Phase 1 (if user wants to add feature to spec)
- [ ] Phase 5 → Phase 3 (if user requests changes to current slice)

### Phase Isolation
- [ ] Agent doesn't do planning work in Phase 3
- [ ] Agent doesn't do implementation work in Phase 2
- [ ] Agent doesn't ask user questions in Phase 3 or 4
- [ ] Agent doesn't skip phases

---

## 🏗️ Architecture Compliance

Verify throughout all implementation phases:

### File Organization
- [ ] Only three top-level buckets exist:
  - [ ] `src/features/`
  - [ ] `src/shared/`
  - [ ] `src/app/`
- [ ] No additional top-level directories without user approval
- [ ] Code used by 1 feature stays in that feature folder
- [ ] Code used by 2+ features is in `src/shared/`
- [ ] App-level concerns (routing, providers, layout) are in `src/app/`

### Import Boundaries
Run manually:
```bash
grep -r "from ['\"].*features/" src/features/
```
- [ ] Command returns NO results (no feature-to-feature imports)
- [ ] Features MAY import from `src/shared` and `src/app`
- [ ] Shared code DOESN'T import from `src/features`

### Styling
- [ ] ALL UI uses Tailwind CSS utility classes
- [ ] NO CSS module files (`.module.css`)
- [ ] NO styled-components
- [ ] NO separate CSS files
- [ ] NO inline styles (style={{...}})
- [ ] Custom styles only via `tailwind.config.js` if needed

### Configuration
- [ ] Config defaults live in ONE place (e.g., `src/shared/config`)
- [ ] Not scattered across codebase
- [ ] New options have default value
- [ ] New options are documented
- [ ] New options have tests

### Code Organization Principles
- [ ] Related code is colocated
- [ ] No premature abstractions
- [ ] Shared code only created when actually used by 2+ features
- [ ] Minimal abstractions (only when real duplication exists)

---

## 🔀 Git Integration

Verify git behavior:

### Initial Setup (init.sh)
- [ ] Prompts for project name (required)
- [ ] Prompts for repository visibility (public/private)
- [ ] Initializes git repository
- [ ] Creates initial commit: "Initial Cosmo project setup"
- [ ] Creates GitHub repository using `gh` CLI
- [ ] Pushes initial commit to remote
- [ ] Handles `gh` CLI not installed gracefully (warns, continues)
- [ ] Handles push failures gracefully (warns, continues)

### Per-Slice Commits (Phase 5)
- [ ] Runs type-check and lint before committing
- [ ] Stages all changes
- [ ] Commit message format correct:
  - [ ] Subject: "Slice NNN: description"
  - [ ] Subject ≤72 characters
  - [ ] Subject uses imperative mood
  - [ ] Body: 2-3 sentence summary
- [ ] Pushes to main branch
- [ ] If push fails: Warns but continues

---

## 📢 Communication Standards

Verify EVERY agent response:

### Phase Visibility
- [ ] **Every response** starts with phase indicator
- [ ] Uses markdown heading or bold with emoji
- [ ] Examples:
  - [ ] `## 📝 Phase 1: Writing Product Spec`
  - [ ] `## 📋 Phase 2: Planning Next Slice`
  - [ ] `## 🔨 Phase 3: Implementing [slice name]`
  - [ ] `## 🔍 Phase 4: Reviewing [slice name]`
  - [ ] `## ✅ Phase 5: Presenting Slice [N] for Approval`

### Ending Questions
- [ ] Phase 1: Ends with question ("Does this spec capture your vision?")
- [ ] Phase 2: Ends with question ("Approve this plan?")
- [ ] Phase 3: Does NOT end with question (proceeds to Phase 4)
- [ ] Phase 4: Does NOT end with question (proceeds to Phase 5)
- [ ] Phase 5: Ends with question ("Approve this slice?" or "What would you like to do next?")

### Tone
- [ ] Professional but friendly
- [ ] Shows work (test results, file paths, line numbers)
- [ ] Makes it easy to approve or request changes
- [ ] Acknowledges user feedback
- [ ] No emojis in code or file content (only in communication)

---

## 🧪 Quality Gates

Verify these automated checks happen:

### Every Implementation (Phase 3)
- [ ] `npm run verify` runs before Phase 4
- [ ] Includes: `npm run type-check && npm run lint && npm run test`
- [ ] All checks must pass
- [ ] If fails: Agent fixes and reruns
- [ ] Agent cannot proceed to Phase 4 while failing

### Every Review (Phase 4)
- [ ] `npm run verify` runs again
- [ ] Must pass completely
- [ ] Import boundary check runs: `grep -r "from ['\"].*features/" src/features/`
- [ ] If fails: Goes back to Phase 3

### Every Approval (Phase 5)
- [ ] `npm run type-check && npm run lint` runs before committing
- [ ] Must pass before git commit

---

## 📊 Testing Scenarios

Use these scenarios to verify behavior:

### Scenario 1: Brand New Project
1. Run `./cosmo/init.sh`
2. Tell agent: "Read cosmo/cosmo.md and follow those instructions"
3. Verify:
   - [ ] Starts in Phase 1 (spec.md is empty)
   - [ ] Interviews you about project
   - [ ] Creates spec in `cosmo/spec.md` (not root)
   - [ ] Proceeds to Phase 2
   - [ ] First slice includes project setup + test infrastructure
   - [ ] All phases show clear indicators
   - [ ] All automated checks run
   - [ ] Slice gets committed and pushed

### Scenario 2: Out-of-Workflow Request
1. During Phase 2 (planning), ask: "Can you implement this right now?"
2. Verify:
   - [ ] Agent acknowledges request
   - [ ] Explains it's in Phase 2 (planning only)
   - [ ] Redirects: "Let me finish planning, then I'll implement in Phase 3"
   - [ ] Continues planning (doesn't break workflow)

### Scenario 3: User Requests Changes
1. In Phase 5, after presentation, say: "Change X to Y"
2. Verify:
   - [ ] Agent goes back to Phase 3
   - [ ] Implements change
   - [ ] Goes through Phase 4 (review)
   - [ ] Presents again in Phase 5
   - [ ] Keeps same slice number

### Scenario 4: Architecture Violation
1. Agent implements feature that imports another feature
2. Verify:
   - [ ] Phase 4 catches it (import boundary check)
   - [ ] Goes back to Phase 3 to fix
   - [ ] Does NOT present to user with violation

### Scenario 5: Tests Missing
1. Agent implements code without tests
2. Verify:
   - [ ] Phase 4 rejects (tests required for all new functionality)
   - [ ] Goes back to Phase 3 to add tests
   - [ ] Does NOT present to user without tests

### Scenario 6: Adding New Feature Mid-Project
1. In Phase 5, after approving a slice, say: "Let's also add [new feature]"
2. Verify:
   - [ ] Agent goes to Phase 1
   - [ ] Updates `cosmo/spec.md` with new feature
   - [ ] Confirms update with user
   - [ ] Proceeds to Phase 2 to plan it

### Scenario 7: Resuming After Break
1. Close and reopen conversation
2. Tell agent: "Read cosmo/cosmo.md and follow those instructions"
3. Verify:
   - [ ] Reads `cosmo/spec.md`
   - [ ] Reads `cosmo/slices/`
   - [ ] Understands what's been completed
   - [ ] Starts in Phase 2 (planning next slice)
   - [ ] Doesn't lose context

---

## 🔄 Reset Script Behavior

Verify reset.sh functionality:

### Reset Script (`cosmo/reset.sh`)
- [ ] Restores clean `spec.md` from `templates/spec.md`
- [ ] Restores clean `architecture.md` from `templates/architecture.md`
- [ ] Deletes all `SLICE-*.md` files from `slices/` directory
- [ ] Keeps `slices/README.md` intact
- [ ] Provides confirmation messages for each action
- [ ] Allows starting fresh while preserving Cosmo structure

### When to Use Reset
- [ ] Starting a completely new project in the same repo
- [ ] Clearing all work to begin again
- [ ] Testing Cosmo from scratch

---

## 📝 Checklist Summary

**Minimum verification for each slice:**

1. **Phase visibility**: Every response has clear phase indicator
2. **Scope compliance**: Agent only does work allowed in current phase
3. **Architecture**: No import violations, correct file placement, Tailwind only
4. **Testing**: Tests exist for all new functionality
5. **Verification**: `npm run verify` passes before review
6. **Manual checklist**: Phase 5 includes actionable verification steps
7. **Git integration**: Slice committed and pushed with correct format
8. **Question ending**: Agent ends with question (except Phase 3 & 4)
9. **Workflow enforcement**: Agent stays in loop, redirects out-of-workflow requests
10. **Plan adherence**: Implementation matches approved plan exactly

---

## 🎯 Success Criteria

Cosmo is working correctly when:

- ✅ Every response clearly shows current phase
- ✅ Agent never does work outside current phase
- ✅ All automated checks pass before user sees code
- ✅ Architecture rules are never violated
- ✅ Tests exist for all functionality
- ✅ Each slice is small (1-3 files) and focused
- ✅ User approves before proceeding to next slice
- ✅ Git history shows clean slice-by-slice progression
- ✅ Agent handles out-of-workflow requests by redirecting
- ✅ Manual verification checklist helps user test the work

**If any of these fail, Cosmo's workflow is broken and needs fixing.**
