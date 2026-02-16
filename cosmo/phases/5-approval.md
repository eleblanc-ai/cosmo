# Phase 5: User Approval

**⚠️ You are in Phase 5. ONLY present the slice and handle user feedback. Do NOT implement new work or respond to requests outside this phase.**

## Purpose
Present completed slice to user and handle their decision.

## When to Use
- After Phase 4 (Review) passes all checks

## Scope
- **May create**: Files in `cosmo/slices/` directory (SLICE-NNN-*.md)
- **May read**: Any files to check completion status
- **May run**: Git commands (`git add`, `git commit`, `git push`)
- **Must NOT modify**: `cosmo/spec.md`, source code, or existing slice files

**This phase records approved slices, commits them to version control, and directs to the next phase.**

## Process
1. **Present the slice** with:
   - Slice name (1-3 words)
   - Summary of what was implemented
   - Files created/modified
   - Review results (tests passed, lint clean, etc.)
   - Link to relevant files with line numbers if helpful

2. **Create manual verification checklist** (REQUIRED for all slices):
   - **Always provide a checklist**, even for backend/non-UI changes
   - Make it actionable and specific to what you implemented
   - User should be able to complete each item in under 2 minutes
   - Format as a numbered checklist with checkboxes

   **For UI/Frontend slices:**
   - "[ ] Open the app at http://localhost:5173"
   - "[ ] Click the [Button Name] button"
   - "[ ] Verify [expected behavior] appears"
   - "[ ] Test edge case: [specific scenario]"
   - "[ ] Check responsive design on mobile width"

   **For Backend/Logic slices:**
   - "[ ] Run `npm run verify` and confirm all tests pass"
   - "[ ] Check console for any errors or warnings"
   - "[ ] Verify [specific behavior] by [action]"
   - "[ ] Test edge case: [specific scenario]"

   **Include:**
   - Exact steps to reproduce/test
   - Expected results for each step
   - Edge cases to verify (empty states, errors, etc.)
   - Keep it focused (3-8 items max)

3. **Ask for approval**: "Approve this slice?"

4. **Wait for user response**

## User Response Handling

### If User Approves
1. **Record the slice**:
   - Create `cosmo/slices/SLICE-NNN-description.md`
   - Use 1-3 word description
   - Include:
     - Date completed
     - What was implemented
     - Files created/modified
     - Review results

2. **Commit and push the slice** (required):
   - Run `npm run type-check && npm run lint` to verify before committing
   - Stage all changes: `git add .`
   - Create commit with format:
     ```
     Slice NNN: description

     [2-3 sentence summary from slice doc]
     ```
   - Subject line must be ≤72 characters, imperative mood (e.g., "Add login form", not "Added login form")
   - Push to main branch: `git push origin main`
   - If push fails: Warn user but continue (don't block workflow)
   - Example failure message: "⚠️ Warning: Failed to push to remote. You may need to pull changes first or check your connection."

3. **Check if spec is complete**:
   - Read cosmo/spec.md
   - Review all completed slices
   - If all core flows implemented → celebrate and confirm with user
   - If more work remains → continue to step 4

4. **Ask about next slice**:
   - "What would you like to do next?"
   - Options:
     - User lets Cosmo decide → Proceed to Phase 2 (plan next logical slice)
     - User specifies next slice → Handle as "side quest" (see below)

### If User Approves + Specifies Next Feature

When user approves AND wants specific functionality added before continuing:

1. **Go to Phase 1 (Spec Writer)**:
   - Ask clarifying questions
   - Update `cosmo/spec.md` with new requirement
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
- Always commit and push approved slices before proceeding
- Always ask "What would you like to do next?" after approval
- User can specify next feature (update spec first)

## Recording Slices

### Filename Format
`cosmo/slices/SLICE-NNN-description.md`

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

## Manual Verification Checklist

Complete each item to verify this slice works correctly:

[ ] [Specific verification step 1]
[ ] [Specific verification step 2]
[ ] [Specific verification step 3]
[ ] [Edge case test]

## Notes
Any relevant context for future reference.
```

## When Spec is Complete
After all core flows implemented:
1. Summarize what was built
2. Confirm with user that spec is complete
3. Ask: "Would you like to add new features?"
4. If yes → Go to Phase 1 to add new core flows to `cosmo/spec.md`, then resume from Phase 2
5. If no → Project complete

## Communication Tips
- Professional but friendly
- Show your work (test results, file paths)
- **Always provide a manual verification checklist** - this helps the user verify your work
- Make checklist items actionable and specific (not vague)
- Include the URL/command to run the app if applicable
- Make it easy to approve or request changes
- Acknowledge user feedback

