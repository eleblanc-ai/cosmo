# Cosmo Workflow: 4-Phase Loop

## State Management

**Update `cosmo/current-phase.md` regularly** to enable resuming work:
- When starting a phase, create/update with current phase number
- During Phase 1: Save questions asked and remaining questions
- During Phase 2: Save files examined, approaches considered, draft plans
- During Phase 3: Save progress checklist, files modified, test status
- During Phase 4: Save what's ready for approval
- When user says "pause" or "save": Update state with current progress
- When completing a phase: Clear the state file (delete it) before moving to next phase

**Use State Template from `cosmo/templates.md`** for the state file structure. Only fill in the section relevant to current phase.

## Plan Management

**Maintain `cosmo/current-plan.md` to capture the full scope of each slice:**
- Phase 2 (on approval): Write approved plan to `cosmo/current-plan.md`
- Phase 4 (on "more work needed"): Append iteration details to `cosmo/current-plan.md`
- Phase 4 (on approval): Copy `cosmo/current-plan.md` content into slice report
- Phase 2 (next slice): Overwrite `cosmo/current-plan.md` with new plan

**Use Plan Template from `cosmo/templates.md`** for the plan file structure.

---

## Phase 1: Interview

### Say
"📋 Phase 1: Interview - Writing spec"

### Do
Ask questions one at a time. Gather: goals, users, core features, constraints. Write to `cosmo/spec.md`.

**If updating existing spec:** Review current spec, ask what features to add, append to existing requirements.

### File Rules
**Must reference:** `cosmo/spec.md` (check if exists)
**Can modify:** `cosmo/spec.md` (create or update)
**Cannot modify:** Implementation files, test files, config files, slice files

### Then Ask
"Does this spec capture your vision? (yes/no)"

### Routing
- No → Phase 1 (continue, update state)
- Yes → Clear `current-phase.md`, then Phase 2

---

## Phase 2: Plan

### Say
"📋 Phase 2: Plan - Planning next slice"

### Do
1. Read `cosmo/spec.md` and `cosmo/slices/*` to understand requirements and what's been completed
2. **Check if spec is complete:**
   - If all spec features are implemented → Ask user: "All spec features are complete! What would you like to work on next?"
   - Wait for user input (new features, polish, optimizations, etc.)
   - If major new features → Suggest updating spec first
   - If enhancements/polish → Proceed with planning
3. Identify next small slice (1-3 files)
4. Write plan with: goal, files, outcome, verification

### File Rules
**Must reference:** `cosmo/spec.md` (read requirements), `cosmo/slices/*` (confirm what's already done, avoid rework)
**Can modify:** None (planning only, no file modifications)
**Cannot modify:** All files (this is planning phase)

### Then Ask
"Approve this plan? (yes/no)"

### Routing
- No → Phase 2 (continue, update state)
- Yes → Write approved plan to `cosmo/current-plan.md`, clear `current-phase.md`, then Phase 3

---

## Phase 3: Implement

### Say
"🔨 Phase 3: Implement - Writing code and verifying quality"

### Do
1. Write code per approved plan
2. Write automated tests covering core functionality:
   - Unit tests for functions and components
   - Integration tests for user interactions
   - Test happy paths and edge cases (empty inputs, validation, etc.)
3. Run tests until all passing
4. Run build to verify no errors
5. Review code quality:
   - Check scope aligns with approved plan
   - Verify tests cover key functionality
   - Ensure code follows project patterns
   - Fix any obvious issues

### File Rules
**Must reference:** Approved plan from Phase 2
**Can modify:** Source files (`src/**/*`), test files (`src/**/*.test.*`), config files (`vite.config.js`, `package.json`), test setup (`src/test/setup.js`)
**Cannot modify:** `cosmo/**/*` (spec, workflow, slices, guidelines)

### Testing Framework (React)
- **Tool**: Vitest + React Testing Library
- **Setup**: Test environment configuration in `src/test/setup.js`
- **Config**: Vitest config in `vite.config.js`
- **Tests**: Place in `src/*.test.jsx` alongside components

### Test Planning Strategy

Before writing tests, identify **full user workflows** rather than isolated operations:

**Think in complete cycles:**
- Don't just test: "save works" and "load works" separately
- Test the full cycle: save → close app → reopen app → data appears
- Example: localStorage persistence requires testing unmount/remount, not just save and render

**Identify what the app must survive:**
- Page reloads (component unmount/remount)
- Browser restarts (localStorage/sessionStorage)
- Network failures (API calls)
- Invalid data (corrupted storage, bad API responses)

**Watch for test gaps:**
- Tests that check React state display but not underlying persistence
- Tests that mock away the exact thing you need to verify
- Tests that start with pre-populated data but never test the initialization path
- Tests that verify individual operations but miss cumulative effects

**Example: localStorage testing**
```javascript
// ❌ Weak: Tests save and load separately
it('saves to localStorage', () => { /* add item, check localStorage */ })
it('loads from localStorage', () => { /* pre-fill storage, render, check screen */ })
// Problem: Load test sets storage before render, checks screen, but save
// effect might corrupt storage afterward. Test passes but app fails.

// ✅ Strong: Tests the full cycle
it('persists data across remounts', () => {
  // 1. Render component (starts empty)
  const { unmount } = render(<App />)
  // 2. Add item (triggers save)
  userEvent.click(screen.getByText('Add'))
  // 3. Unmount (simulates closing app)
  unmount()
  // 4. Remount (simulates reopening app)
  render(<App />)
  // 5. Verify data survived
  expect(screen.getByText('Item')).toBeInTheDocument()
})
```

**Questions to ask yourself:**
- If the user closes and reopens the app, does my test verify data survives?
- If the component unmounts and remounts, do my tests simulate this?
- Am I testing what the user experiences or just what React state displays?
- Does this test actually exercise the full code path from start to finish?

### Test Coverage
Write tests that cover:
- Rendering and initial state
- User interactions (clicks, form submissions, keyboard events)
- State changes and updates
- Edge cases (empty inputs, validation)
- Multiple items/operations
- **Complete workflows** (especially for persistence, navigation, multi-step processes)

### Quality Checks
Before proceeding:
- ✅ All tests passing
- ✅ Build succeeds with no errors
- ✅ Code matches approved plan scope
- ✅ No obvious bugs or issues

### Then
Update state with progress, then → Phase 4 (auto-proceed)

---

## Phase 4: Approval

### Say
"✅ Phase 4: Approval - Presenting slice for final approval"

### Do
Show what changed. Show test results. Provide verification steps.

### Then Ask
"What next? (1/2)"
1. Approve
2. More work needed

### Routing
- 1 or "approve" → Record slice using Slice Template from `cosmo/templates.md` (increment number, fill in all sections, copy plan from `cosmo/current-plan.md`), clear `current-phase.md`, then Phase 2
- 2 or "more work" → Update `cosmo/current-plan.md` with iteration details, update state, then Phase 3 (ask what's needed if they haven't said)
