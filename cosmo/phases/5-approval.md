# Phase 5: User Approval

## Purpose
Present completed slice to user and handle their decision.

## When to Use
- After Phase 4 (Review) passes all checks

## Scope
- **May create**: Files in `slices/` directory (SLICE-NNN-*.md)
- **May read**: Any files to check completion status
- **Must NOT modify**: `spec.md`, source code, or existing slice files

**This phase records approved slices and directs to the next phase.**

## Process
1. **Present the slice** with:
   - Slice name (1-3 words)
   - Summary of what was implemented
   - Files created/modified
   - Review results (tests passed, lint clean, etc.)
   - Link to relevant files with line numbers if helpful
   - **Manual test checklist** (when applicable):
     - If the slice includes UI/interface elements, user interactions, or visual features
     - Create a numbered checklist of specific things the user should verify
     - Make it actionable: "Click X", "Verify Y appears", "Check Z works"
     - Include edge cases to test (empty states, error states, etc.)
     - Keep it focused (3-8 items max)

2. **Ask for approval**: "Approve this slice?"

3. **Wait for user response**

## User Response Handling

### If User Approves
1. **Record the slice**:
   - Create `slices/SLICE-NNN-description.md`
   - Use 1-3 word description
   - Include:
     - Date completed
     - What was implemented
     - Files created/modified
     - Review results

2. **Check if spec is complete**:
   - Read spec.md
   - Review all completed slices
   - If all core flows implemented → celebrate and confirm with user
   - If more work remains → continue to step 3

3. **Ask about next slice**:
   - "What would you like to do next?"
   - Options:
     - User lets Cosmo decide → Proceed to Phase 2 (plan next logical slice)
     - User specifies next slice → Handle as "side quest" (see below)

### If User Approves + Specifies Next Feature

When user approves AND wants specific functionality added before continuing:

1. **Go to Phase 1 (Spec Writer)**:
   - Ask clarifying questions
   - Update `spec.md` with new requirement
   - Confirm update with user

2. **Go to Phase 2 (Planner)** to plan the requested slice

3. **Continue normal flow**: Implement → Review → Approve

4. **After completion**: Resume planning remaining core flows

### If User Requests Changes
1. **Treat changes as iteration on current slice**
2. **Go back to Phase 3 (Implementer)**
   - Read `phases/3-implementer.md`
   - Implement the requested changes
3. **Continue through review and present again**
4. **Keep the same slice number** - don't increment until approved

## Rules
- Clear, concise presentation with evidence (test results)
- One slice at a time
- Accept feedback gracefully - changes are normal
- Keep iterating until user approves
- Always ask "What would you like to do next?" after approval
- User can specify next feature (update spec first)

## Recording Slices

### Filename Format
`slices/SLICE-NNN-description.md`

Where:
- `NNN` = zero-padded number (001, 002, 003, etc.)
- `description` = 1-3 word slug (e.g., "project-setup", "task-list", "add-form")

### File Contents
```markdown
# Slice NNN: Description

**Date**: YYYY-MM-DD
**Status**: Approved

## What Was Implemented
- Bullet list of what was built
- Be specific about functionality added

## Files Changed
- `path/to/file.ts` (created/modified)
- `path/to/test.ts` (created)

## Review Results
- ✓ Tests passing
- ✓ Lint clean
- ✓ Build successful
- ✓ Architecture compliance verified

## Manual Testing (if applicable)
Checklist used for user verification:
1. [Test item that was verified]
2. [Another test item]
3. [Edge case that was checked]

## Notes
Any relevant context for future reference.
```

## When Spec is Complete
After all core flows implemented:
1. Summarize what was built
2. Confirm with user that spec is complete
3. Ask: "Would you like to add new features?"
4. If yes → Go to Phase 1 to add new core flows to `spec.md`, then resume from Phase 2
5. If no → Project complete

## Communication Tips
- Professional but friendly
- Show your work (test results, file paths)
- Make it easy to approve or request changes
- Acknowledge user feedback

