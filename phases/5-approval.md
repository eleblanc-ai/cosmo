# Phase 5: User Approval

## Purpose
Present completed slice to user and handle their decision.

## When to Use This Phase
- After Phase 4 (Review) passes all checks
- Ready to get user's approval on the completed slice

## Allowed Changes
- May create:
  - Files in `slices/` directory (SLICE-NNN-description.md)

- May read:
  - Any files to check completion status

- Must NOT modify:
  - `spec.md` (only Phase 1 can modify)
  - `src/**` or any code files (use Phase 3 for that)
  - Existing files in `slices/` (they are immutable)

**This phase only records approved slices and directs to the next phase.**

## Process (required)
1. **Present the slice** with:
   - Slice name (1-3 words)
   - Summary of what was implemented
   - Files created/modified
   - Review results (tests passed, lint clean, etc.)
   - Link to relevant files with line numbers if helpful

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
     - User lets Emma decide → Proceed to Phase 2 (plan next logical slice)
     - User specifies next slice → Handle as "side quest" (see below)

### If User Approves AND Specifies Next Slice ("Side Quest")

When user approves but wants to add/extend functionality before moving on:

**Example:** "Approve. Now add a rating system to the recipe card."

1. **Go to Phase 1 (Spec Writer)** to document the request:
   - Read `phases/1-spec-writer.md`
   - Ask clarifying questions about the new functionality
   - Update `spec.md` by adding the new requirement to relevant core flows
   - Mark it clearly (e.g., "User can rate recipes (1-5 stars)")
   - Confirm the spec update with user

2. **Go to Phase 2 (Planner)** to plan the requested slice:
   - Read `phases/2-planner.md`
   - Plan the specific functionality user requested
   - Present plan for approval

3. **Continue normal flow**: Implement → Review → Approve → Resume

4. **After side quest complete**:
   - The new functionality is now part of the spec
   - Review can validate against the updated spec
   - Resume planning remaining core flows

### If User Requests Changes
1. **Treat changes as iteration on current slice**
2. **Go back to Phase 3 (Implementer)**
   - Read `phases/3-implementer.md`
   - Implement the requested changes
3. **Continue through review and present again**
4. **Keep the same slice number** - don't increment until approved

## Rules
- **Clear presentation**: Be concise but complete
- **Show evidence**: Include test results, not just claims
- **One slice at a time**: Don't present multiple slices together
- **Accept feedback gracefully**: Changes are normal and expected
- **Keep iterating**: Stay on current slice until user approves
- **Ask about next slice**: After approval, always ask "What would you like to do next?"
- **Side quests are okay**: User can specify the next slice instead of following the original spec order
- **Update spec for side quests**: New functionality must be added to spec.md first

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

## Notes
Any relevant context for future reference.
```

## When Spec is Complete
After all core flows are implemented:
1. **Summarize what was built** - recap all completed slices
2. **Confirm with user** that the spec is complete
3. **Celebrate the completion** 🎉

4. **Ask about next steps**:
   - "The spec is complete! Would you like to add new features?"

5. **If user wants more features**:
   - **Go back to Phase 1 (Spec Writer)**
   - Read `phases/1-spec-writer.md`
   - Interview user about new requirements
   - **Add** the new core flows to `spec.md` (keep existing flows)
   - Resume the loop from Phase 2 (Planner)

6. **If user is done**:
   - Project complete! Thank the user and wrap up.

## Communication Tips
- Be professional but friendly
- Show your work (test results, file paths)
- Make it easy for user to say yes or ask for changes
- Don't be defensive about change requests
- Acknowledge user feedback

## Example: Side Quest Flow

```
Emma: "Slice 3: Recipe card display. Tests passing. Approve?"
You: "Approve. Now add a rating system to the recipe card before moving on."

Emma: [Phase 5 → records SLICE-003-recipe-card.md]
      [Phase 5 → detects side quest request]
      [Phase 1 - Spec Writer]
      "I'll add rating functionality to the spec.
       What should users be able to do with ratings?"

You: "Users can rate recipes from 1-5 stars and see average rating"

Emma: [asks clarifying questions]
      [updates spec.md with: "User can rate recipes (1-5 stars)"]
      [updates spec.md with: "User can see average rating on recipe card"]
      "Updated spec.md. Confirm?"

You: "Yes"

Emma: [Phase 2 - Planner]
      "Slice 4: Recipe rating system
       - Add rating component (1-5 stars)
       - Store ratings in database
       - Calculate and display average
       Approve?"

You: "Yes"

Emma: [Phase 3 - Implementer] ...
      [Phase 4 - Reviewer] ...
      [Phase 5 - Approval]
      "Slice 4: Rating system complete. Tests passing. Approve?"

You: "Approve"

Emma: [records SLICE-004-rating-system.md]
      "What would you like to do next?"

You: "Continue with the main spec"

Emma: [Phase 2 - Planner]
      [reads spec, sees slices 1-4 done, plans next logical slice]
      "Slice 5: Recipe search functionality. Approve?"
```

The rating functionality is now part of the spec, so future reviews validate against it.
```

