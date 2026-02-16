# Cosmo Observable Behaviors Checklist

**Use this checklist during a live Cosmo session to verify the system is working correctly.**

This is a practical, observation-focused checklist. If you see these behaviors, Cosmo is working as designed.

---

## 🎬 Starting a New Project

### What to Do
1. Run `./cosmo/init.sh`
2. Start your LLM IDE
3. Say: "Read cosmo/cosmo.md and follow those instructions"

### What to Look For

**✅ Init Script Works:**
- [ ] Prompts you for project name
- [ ] Prompts you for public/private repository
- [ ] Shows "✅ Initialization complete!"
- [ ] Lists what was set up (Vite, Vitest, verify script, git)

**✅ Agent Starts in Correct Phase:**
- [ ] Agent says something like: `## 📝 Phase 1: Writing Product Spec`
- [ ] Explains it's checking `cosmo/spec.md` and found it empty
- [ ] Asks you ONE question about your project (not a wall of questions)

**🚩 RED FLAGS:**
- Agent starts writing code immediately
- Agent doesn't mention which phase it's in
- Agent asks 10 questions at once
- No phase indicator with emoji visible

---

## 📝 Phase 1: Spec Writer Observable Behaviors

### What to Look For

**✅ Agent Asks Good Questions:**
- [ ] ONE question at a time (not overwhelming)
- [ ] Asks about: Goal, Users, Core flows, Data, Non-goals
- [ ] Doesn't invent answers - asks when unclear
- [ ] Focuses on WHAT not HOW

**✅ Agent Creates Spec:**
- [ ] Shows you the spec before writing it
- [ ] Spec is in `cosmo/spec.md` (NOT root directory)
- [ ] Spec includes these sections: Goal, Users, Core flows, Data, Non-goals, Constraints, Verification, Architecture
- [ ] Spec is concise (~20-40 lines, not a novel)

**✅ Agent Ends Correctly:**
- [ ] Asks: "Does this spec capture your vision?" (or similar)
- [ ] After you approve, says: "Moving to Phase 2" or similar
- [ ] Doesn't wait for permission - automatically proceeds

**🚩 RED FLAGS:**
- Agent writes code during this phase
- Agent creates spec in wrong location (root directory)
- Agent doesn't ask for confirmation before proceeding
- Spec is missing key sections

---

## 📋 Phase 2: Planner Observable Behaviors

### What to Look For

**✅ Agent Shows Phase Clearly:**
- [ ] Says: `## 📋 Phase 2: Planning Next Slice`
- [ ] Mentions it's reading spec, architecture, and existing code

**✅ First Slice is Special:**
- [ ] If no slices exist yet, first slice MUST include project setup + test verification
- [ ] Agent acknowledges that Vitest is already installed
- [ ] Plan includes creating example test to verify test infrastructure

**✅ Plan is Complete:**
- [ ] Plan includes:
  - Slice name (1-3 words)
  - Goal (one sentence)
  - Why now (explains order)
  - In scope / Out of scope
  - User-visible outcome ("User can ___")
  - Files to create/modify
  - Tests to add
  - How to verify it works
- [ ] Slice is SMALL (1-3 files max)

**✅ Agent Ends Correctly:**
- [ ] Asks: "Approve this plan?"
- [ ] Waits for your approval
- [ ] Doesn't start implementing automatically

**🚩 RED FLAGS:**
- Agent starts implementing without approval
- Plan is huge (10+ files)
- Plan doesn't include tests
- No clear "User can ___" outcome
- Agent doesn't ask for approval

---

## 🔨 Phase 3: Implementer Observable Behaviors

### What to Look For

**✅ Agent Shows Phase Clearly:**
- [ ] Says: `## 🔨 Phase 3: Implementing [slice name]`
- [ ] Mentions reading existing code to understand patterns

**✅ Agent Implements Correctly:**
- [ ] Creates/modifies ONLY files mentioned in plan
- [ ] Code matches existing patterns in codebase
- [ ] Includes tests (doesn't skip them)
- [ ] Uses Tailwind for styling (no CSS files or styled-components)

**✅ Agent Runs Verification:**
- [ ] Runs `npm run verify` before proceeding
- [ ] Shows you the output
- [ ] If it fails: Fixes and reruns (doesn't give up)
- [ ] Tells you: "Implementation complete. All tests passing."

**✅ Agent Proceeds Automatically:**
- [ ] Does NOT ask you a question
- [ ] Says: "Proceeding to Phase 4 (Review)..."
- [ ] Immediately moves to Phase 4

**🚩 RED FLAGS:**
- Agent asks you questions (should be automatic)
- Agent skips running `npm run verify`
- Agent proceeds to Phase 4 while tests are failing
- Agent creates files not in the plan
- No tests written

---

## 🔍 Phase 4: Reviewer Observable Behaviors

### What to Look For

**✅ Agent Shows Phase Clearly:**
- [ ] Says: `## 🔍 Phase 4: Reviewing [slice name]`
- [ ] Mentions running automated checks

**✅ Agent Reviews Thoroughly:**
- [ ] Runs `npm run verify` again
- [ ] Checks architecture boundaries (mentions running grep command)
- [ ] Lists what it's checking: scope, architecture, tests, code quality

**✅ If Issues Found:**
- [ ] Agent says: "Found issues, returning to Phase 3"
- [ ] Lists specific issues
- [ ] Goes back and fixes them
- [ ] Does NOT ask you about the issues

**✅ If All Checks Pass:**
- [ ] Agent says: "Review complete. All checks passed:"
- [ ] Shows checklist: ✓ verify passed, ✓ architecture respected, ✓ tests exist
- [ ] Says: "Proceeding to Phase 5 (Approval)..."

**✅ Agent Proceeds Automatically:**
- [ ] Does NOT ask you a question (unless going back to Phase 3)
- [ ] Automatically moves to Phase 5

**🚩 RED FLAGS:**
- Agent asks you to review the code
- Agent proceeds to Phase 5 with failing tests
- Agent skips architecture checks
- Agent presents code with obvious bugs

---

## ✅ Phase 5: Approval Observable Behaviors

### What to Look For

**✅ Agent Shows Phase Clearly:**
- [ ] Says: `## ✅ Phase 5: Presenting Slice [N] for Approval`
- [ ] Shows slice name and number

**✅ Presentation is Complete:**
- [ ] Summarizes what was implemented
- [ ] Lists files created/modified (with line numbers if helpful)
- [ ] Shows review results (tests passed, lint clean)

**✅ Manual Verification Checklist:**
- [ ] **ALWAYS provides a checklist** (this is required)
- [ ] Checklist has checkboxes: `[ ]`
- [ ] Items are specific and actionable
- [ ] For UI: Includes URL to open, specific things to click/verify
- [ ] For backend: Includes commands to run and expected results
- [ ] 3-8 items (focused, not overwhelming)

**✅ Agent Ends Correctly:**
- [ ] Asks: "Approve this slice?"
- [ ] Waits for your response

**✅ After You Approve:**
- [ ] Creates file: `cosmo/slices/SLICE-001-description.md`
- [ ] Runs type-check and lint
- [ ] Commits changes with message: "Slice 001: description\n\n[summary]"
- [ ] Pushes to main branch
- [ ] If push fails: Warns but continues (doesn't crash)
- [ ] Asks: "What would you like to do next?"

**✅ If You Request Changes:**
- [ ] Agent says: "Going back to Phase 3 to implement changes"
- [ ] Keeps same slice number (doesn't increment)
- [ ] Goes through phases 3 → 4 → 5 again

**🚩 RED FLAGS:**
- No manual verification checklist provided
- Checklist is vague ("test the feature")
- Agent doesn't commit and push after approval
- Agent increments slice number before approval
- Commit message doesn't follow format

---

## 🚫 Workflow Enforcement Observable Behaviors

### What to Look For

**✅ Agent Stays in Workflow:**
- [ ] If asked to do something outside current phase, agent:
  - Acknowledges your request
  - Explains what phase it's in
  - Suggests when it will handle it
  - Continues with current phase

**Example:**
- **You (during Phase 2):** "Can you implement this now?"
- **Agent:** "I'm currently in Phase 2 (planning). Let me finish this plan, get your approval, then I'll implement it in Phase 3. Approve this plan?"

**✅ Phase Transitions are Correct:**
- [ ] Phase 1 → Phase 2 (after spec confirmed)
- [ ] Phase 2 → Phase 3 (after plan approved)
- [ ] Phase 3 → Phase 4 (automatic)
- [ ] Phase 4 → Phase 5 (automatic)
- [ ] Phase 5 → Phase 2 (after slice approved)
- [ ] Never skips phases

**🚩 RED FLAGS:**
- Agent breaks out of workflow to satisfy requests
- Agent skips phases
- Agent does planning during implementation
- Agent asks questions during Phase 3 or 4

---

## 🏗️ Architecture Observable Behaviors

### What to Look For During Any Phase

**✅ File Organization:**
- [ ] Only these folders exist: `src/features/`, `src/shared/`, `src/app/`
- [ ] No random top-level folders
- [ ] Code used by 1 feature stays in that feature
- [ ] Code used by 2+ features is in `src/shared/`

**✅ Styling:**
- [ ] All UI uses Tailwind classes
- [ ] No `.css` or `.module.css` files
- [ ] No styled-components imports
- [ ] No inline styles like `style={{...}}`

**✅ Testing:**
- [ ] Every slice with code changes includes tests
- [ ] Tests are in `*.test.ts` or `*.test.tsx` files
- [ ] Tests actually test behavior (not just empty)

**Manual Check (Phase 4/5):**
```bash
# Run this to check for architecture violations:
grep -r "from ['\"].*features/" src/features/
```
- [ ] Should return nothing (no results = good)
- [ ] If it finds matches, architecture is violated

**🚩 RED FLAGS:**
- CSS files appear
- styled-components being used
- Features importing other features directly
- No tests being written

---

## 📢 Communication Observable Behaviors

### Every Single Response Should:

**✅ Clear Phase Indicators:**
- [ ] Response starts with heading or bold text
- [ ] Includes emoji: 📝 (Phase 1), 📋 (Phase 2), 🔨 (Phase 3), 🔍 (Phase 4), ✅ (Phase 5)
- [ ] Easy to scan and see current phase

**✅ Clear Next Steps:**
- [ ] Phase 1: Ends with question
- [ ] Phase 2: Ends with question
- [ ] Phase 3: Ends with "proceeding to Phase 4" (no question)
- [ ] Phase 4: Ends with "proceeding to Phase 5" (no question)
- [ ] Phase 5: Ends with question

**✅ Tone:**
- [ ] Professional but friendly
- [ ] Shows work (test results, file paths)
- [ ] Uses line numbers when referencing code
- [ ] No emojis IN code (only in communication)

**🚩 RED FLAGS:**
- Can't tell what phase agent is in
- Response doesn't guide you to next step
- Agent rambles without structure

---

## 🎯 Quick Success Check (After Each Slice)

After each slice is approved, verify these 10 things:

1. **Phase visible** - You could immediately tell what phase the agent was in
2. **Stayed in phase** - Agent didn't do work outside current phase
3. **Architecture clean** - No CSS files, correct folder structure
4. **Tests exist** - New functionality has tests
5. **npm run verify passed** - Agent showed you it passed before review
6. **Manual checklist provided** - Phase 5 included actionable steps
7. **Git commit made** - Slice was committed with correct format
8. **Question asked** - Agent ended with question (except Phase 3/4)
9. **No violations** - Agent redirected out-of-workflow requests
10. **Plan matched** - Implementation was exactly what was approved

**If all 10 ✅ = Cosmo is working correctly**
**If any ❌ = Something is broken**

---

## 🔥 Critical Failure Modes to Watch For

These behaviors indicate Cosmo is broken:

### ⚠️ Agent Breaks Workflow
- Starts writing code during Phase 1 or 2
- Plans without approval in Phase 3
- Asks user questions during Phase 3 or 4
- **Fix:** Agent needs to re-read phase files

### ⚠️ No Testing
- Implements code without tests
- Proceeds to Phase 5 without tests
- Tests are missing or trivial
- **Fix:** Phase 4 should reject and go back to Phase 3

### ⚠️ Architecture Violations
- Creates CSS files
- Features import other features
- Random folders appear
- **Fix:** Phase 4 should catch and fix

### ⚠️ Phase Confusion
- Can't tell what phase agent is in
- No clear phase indicator
- Jumps between phases randomly
- **Fix:** Agent needs to follow communication guidelines

### ⚠️ No User Control
- Agent doesn't ask for approval
- Agent proceeds without permission
- Agent ignores your feedback
- **Fix:** Agent needs to respect phase boundaries

---

## 📝 Testing New Projects: Step-by-Step

Use this when starting a brand new Cosmo project:

### Step 1: Init (5 minutes)
```bash
./cosmo/init.sh
```
- [ ] Enter project name when prompted
- [ ] Choose public or private
- [ ] See "✅ Initialization complete!"
- [ ] Check that `git log` shows "Initial Cosmo project setup"

### Step 2: Start Cosmo (2 minutes)
Tell agent: "Read cosmo/cosmo.md and follow those instructions"

- [ ] Agent says `## 📝 Phase 1: Writing Product Spec`
- [ ] Agent asks ONE question about your project
- [ ] You can see the phase clearly

### Step 3: Spec Phase (5-10 minutes)
Answer the agent's questions about your project.

- [ ] Agent asks questions one at a time
- [ ] Agent shows you complete spec
- [ ] Spec is in `cosmo/spec.md`
- [ ] Agent asks: "Does this spec capture your vision?"
- [ ] After approval, agent proceeds to Phase 2

### Step 4: First Slice Planning (2-3 minutes)
- [ ] Agent says `## 📋 Phase 2: Planning Next Slice`
- [ ] Plan includes project setup + example test
- [ ] Plan is small (1-3 files)
- [ ] Agent asks: "Approve this plan?"
- [ ] You say yes

### Step 5: Implementation (3-5 minutes)
- [ ] Agent says `## 🔨 Phase 3: Implementing [name]`
- [ ] Agent creates files
- [ ] Agent runs `npm run verify`
- [ ] Agent says: "Proceeding to Phase 4"

### Step 6: Review (1-2 minutes)
- [ ] Agent says `## 🔍 Phase 4: Reviewing [name]`
- [ ] Agent runs checks
- [ ] Agent says: "Review complete, proceeding to Phase 5"

### Step 7: Approval (2-3 minutes)
- [ ] Agent says `## ✅ Phase 5: Presenting Slice 001 for Approval`
- [ ] Agent shows manual verification checklist
- [ ] Agent asks: "Approve this slice?"
- [ ] You say yes
- [ ] Agent creates `cosmo/slices/SLICE-001-*.md`
- [ ] Agent commits and pushes
- [ ] Agent asks: "What would you like to do next?"

### Step 8: Verify (2 minutes)
Run the manual verification checklist provided in Step 7.

- [ ] Follow each step
- [ ] Everything works as described

### Step 9: Check Git (1 minute)
```bash
git log --oneline
```
- [ ] See two commits: Initial setup + Slice 001
- [ ] Commit message follows format: "Slice 001: description"

**Total time for first slice: ~25-35 minutes**

If you made it through all 9 steps successfully, **Cosmo is working correctly!**

---

## 🎯 What Success Looks Like

**You know Cosmo is working when:**

✅ Every response clearly shows the current phase
✅ Agent never does work outside its current phase
✅ Agent always asks for approval before implementing
✅ Tests are always included
✅ Architecture rules are always followed
✅ Agent handles your questions professionally and redirects gracefully
✅ Each slice is small, focused, and builds on the previous one
✅ Git history is clean with descriptive commits
✅ You feel in control of the process
✅ Manual verification checklists help you test the work

**If any of these are missing, something is broken.**

---

## 🚨 When Things Go Wrong

If the agent violates any of these behaviors:

1. **Stop and point it out:** "You're in Phase 2 but you're writing code. Please stay in planning mode."

2. **Reference the files:** "Please re-read cosmo/phases/2-planner.md"

3. **Start over if needed:** Close conversation, start fresh with "Read cosmo/cosmo.md and follow those instructions"

4. **Report the issue:** If behavior persists, it's a bug in Cosmo's instructions

---

**This checklist focuses on what you can actually SEE and VERIFY during a Cosmo session.**

**If you see these behaviors → Cosmo works ✅**
**If you don't see these behaviors → Cosmo is broken ❌**
