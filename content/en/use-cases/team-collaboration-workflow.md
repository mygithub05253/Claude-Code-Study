---
title: "Team Collaboration Workflow: Using Claude Code Together in 3–5 Person Team Projects"
category: use-cases
source_url: "https://docs.anthropic.com/en/docs/claude-code"
source_author: "Anthropic & Community"
license: "CC BY 4.0"
last_reviewed: "2026-04-12"
lang: en
tags: ["use-cases", "team-collaboration", "workflow", "git-worktree", "student", "branch-strategy"]
---

# Team Collaboration Workflow: Using Claude Code Together in 3–5 Person Team Projects

## One-Line Summary
Share team rules via CLAUDE.md, develop in parallel without conflicts using Git worktree, and elevate the whole team's Claude Code proficiency together through weekly retrospectives and a standardized deployment process.

## Target Audience
- Students assigned as team leader in a 3–5 person project who need to establish a collaboration system
- Team members in a situation where "everyone uses Claude Code differently so code style is inconsistent"
- Developers who want to eliminate overtime caused by Git conflicts
- Students who are the only ones using Claude Code because their teammates don't know how

---

## Core Workflow

### 4 Pillars of Team Collaboration

```
1. CLAUDE.md      → Share team rules and conventions (set once, maintain continuously)
2. Git Worktree   → Conflict-free parallel development (for each feature)
3. Weekly retro   → Improve team speed and quality (repeat every week)
4. Deployment standardization → setup-deploy + land-and-deploy (consistent deployment)
```

### Step 1 — Share Team Rules via CLAUDE.md (One-Time Setup)

At the start of the team project, the team leader writes CLAUDE.md and commits it to the repo.
After that, when team members run Claude Code, this file is automatically read and the same rules are applied.

```bash
# Create CLAUDE.md in project root
claude

> Organize the following team rules as CLAUDE.md:
> - Language: Korean comments, English variable names
> - Style: TypeScript strict, no any, 2 spaces
> - Stack: Next.js 15 App Router, Supabase, Tailwind CSS, shadcn/ui
> - Branch strategy: main (protected), develop, feature/[name]-[feature]
> - Commit messages: Korean Conventional Commits (feat/fix/chore/docs)
> - PR: 1 reviewer approval required before merge
> - Prohibited: console.log in production code, hardcoded CSS colors, magic numbers
```

**Example of generated CLAUDE.md core sections**:

```markdown
# Student Club Notice Board Team Project Rules

## Tech Stack
- Next.js 15 (App Router, Server Component priority)
- TypeScript 5 (strict mode, no any)
- Supabase (use SSR client pattern)
- Tailwind CSS + shadcn/ui (use className utilities only)

## Code Conventions
- Indentation: 2 spaces
- Variables/functions: camelCase
- Components: PascalCase
- Constants: UPPER_SNAKE_CASE
- File names: camelCase.ts, PascalCase.tsx

## Branch Strategy
- main: Production (no direct push)
- develop: Integration testing
- feature/[name]-[feature]: Individual development branch
  e.g.: feature/minsu-notice-crud

## Commit Messages (Korean)
- feat: new feature
- fix: bug fix
- refactor: refactoring (no functional change)
- docs: documentation
- chore: build/configuration

## Prohibited
- any types
- console.log (production code)
- Hardcoded color values (#fff, rgb(...))
- Direct push to main branch
```

### Step 2 — Conflict-Free Parallel Development with Git Worktree (using-git-worktrees)

When each team member develops different features simultaneously, using Git worktree allows development in independent working directories without switching branches.

```bash
# Team leader guides worktree setup per feature
> /skill using-git-worktrees
> Set up worktrees so that a 4-person team can simultaneously develop the following features:
> - Minsu: Notice CRUD
> - Jisu: Comment feature
> - Junhyuk: File attachment
> - Taeri: Authentication page
```

**Worktree setup commands**:

```bash
# Create each feature branch from develop branch
git checkout develop

# Create feature branch + worktree for each team member
git worktree add ../club-board-notice feature/minsu-notice-crud
git worktree add ../club-board-comment feature/jisu-comment
git worktree add ../club-board-upload feature/junhyuk-file-upload
git worktree add ../club-board-auth feature/taeri-auth-page

# Each team member works in their own worktree directory
cd ../club-board-notice
claude
> Implement the notice CRUD feature. (CLAUDE.md rules auto-applied)
```

**Advantages of Worktree**:
- Each feature branch has an independent directory → no `git stash` needed
- Multiple Claude Code sessions can run simultaneously
- Build errors in one feature don't affect development of other features
- Easy to compare with base branch (`git diff develop...HEAD`)

**Check Worktree status**:

```bash
git worktree list
# Example output:
# /c/Users/team/club-board          abc1234  [develop]
# /c/Users/team/club-board-notice   def5678  [feature/minsu-notice-crud]
# /c/Users/team/club-board-comment  ghi9012  [feature/jisu-comment]
```

### Step 3 — Resume Sessions with Checkpoints (checkpoint)

Use the checkpoint skill when handing off a session between team members or resuming work the next day.

```bash
# Save checkpoint before leaving
> /skill checkpoint
> Save today's work as a checkpoint:
> - Completed: Notice list GET API, NoticeCard component basic structure
> - In progress: Notice detail page (app/notices/[id]/page.tsx 50% done)
> - Tomorrow's tasks: Comment API + notice deletion permission check
> - Blocker: Supabase join query types don't match
```

Session summary generated by the checkpoint skill:

```markdown
## Session Checkpoint - 2026-04-12

### Completed Items
- [x] GET /api/notices (with pagination)
- [x] NoticeCard component (type-safe, with date format)

### In Progress
- [ ] app/notices/[id]/page.tsx — Supabase join query type issue
  Current code: `supabase.from('notices').select('*, users(name)')`
  Problem: `users` is inferred as an array in the return type

### Tomorrow's Tasks
1. Fix join query types (rerun supabase-js v2 type generation)
2. DELETE /api/notices/[id] (with author permission check)
3. Start comment API

### Team Member Handoff Notes
- Need to run `pnpm supabase gen types` and update `lib/supabase/types.ts`
- Verify SUPABASE_SERVICE_ROLE_KEY in `.env.local`
```

### Step 4 — Weekly Retrospective (retro)

Every Friday or at the end of a sprint, the whole team runs a retrospective with the retro skill.

```bash
> /skill retro
> Conduct this week's team retrospective.
>
> This week's completed work:
> - Notice CRUD API completed
> - Comment feature 60% done
> - Vercel staging deployment succeeded
>
> Problems that occurred:
> - 2 hours wasted on merge conflict on Thursday
> - Build error was merged into main (not caught because there's no CI)
> - Notice deletion permission check missing (found in QA)
>
> Team morale:
> - Progress is going well
> - Code review takes too long (average 1.5 hours)
```

Retrospective report generated by the retro skill:

```markdown
## Weekly Retrospective - 2026-04-08 ~ 04-12

### Well (What went well)
- First successful Vercel staging deployment → CI foundation established
- Notice CRUD API completed one day ahead of schedule

### Problem (What went wrong)
1. **Merge Conflict** (Severity: High)
   Cause: 3 days of independent development without syncing with develop branch
   → Solution: Add rule to run `git rebase develop` every morning

2. **Main merge without CI** (Severity: High)
   Cause: Manual merge without GitHub Actions
   → Solution: Add `pnpm build` CI pipeline by next week

3. **Missing permission check** (Severity: Medium)
   Cause: Authentication testing skipped during CRUD implementation
   → Solution: Add "authentication test" item to API route PR checklist

### Try (Try next week)
- [ ] Add GitHub Actions CI pipeline (build + type check)
- [ ] Daily morning standup 5 minutes + develop rebase
- [ ] PR size limit: 10 files or fewer
```

### Step 5 — Standardize Deployment Process (setup-deploy + land-and-deploy)

In a team project, standardize deployment so anyone can do it, not just one person.

```bash
# Initial deployment environment setup (team leader, once)
> /skill setup-deploy
> Set up an automated deployment pipeline with Vercel + GitHub Actions.
> - main branch push → automatic production deployment
> - develop branch push → automatic staging deployment
> - PR creation → auto-generated Preview deployment URL
> Also create a Vercel dashboard registration guide with the environment variable list.
```

```bash
# Deployment execution (any team member)
> /skill land-and-deploy
> After merging develop → main, run the production deployment checklist.
> Pre-deployment check: pnpm build success, staging smoke test passed
> Post-deployment check: main pages respond 200, notice CRUD works
```

**Standardized deployment checklist** (setup-deploy output):

```markdown
## Production Deployment Checklist

### Before Deployment (Required)
- [ ] `pnpm build` succeeds locally
- [ ] `pnpm tsc --noEmit` no type errors
- [ ] Staging URL smoke test passed
- [ ] At least 1 team member PR approval
- [ ] Environment variable changes reflected in Vercel

### Deployment Execution
```bash
git checkout main
git merge develop --no-ff -m "chore: develop → main merge (deployment)"
git push origin main
# GitHub Actions auto-deployment triggered
```

### After Deployment (Within 10 minutes)
- [ ] No errors in Vercel deployment log
- [ ] https://club-board.vercel.app/notices → 200 response
- [ ] Login → write notice → comment → logout smoke test
- [ ] Supabase dashboard Active Connections in normal range
```

---

## Practical Scenario

**Situation**: Role assignment, branch strategy, and weekly review cycle for a 4-person team (Minsu, Jisu, Junhyuk, Taeri)

### Team Composition and Role Assignment

| Member | Role | Assigned Feature | Worktree Path |
|---|---|---|---|
| Minsu (Team Leader) | Full-stack | Notice CRUD + Deployment | `../club-board-notice` |
| Jisu | Frontend | Comments + File UI | `../club-board-comment` |
| Junhyuk | Backend | File API + Storage | `../club-board-upload` |
| Taeri | Full-stack | Authentication + Permissions | `../club-board-auth` |

### Week 1: Foundation Setup

```bash
# Minsu (Team Leader) — Kickoff session
claude

# 1. Write CLAUDE.md
> Create team rules CLAUDE.md. (see content above)

# 2. Initial project scaffolding
> /skill setup-deploy
> Set up initial deployment environment with Vercel + Supabase + Next.js 15.

# 3. Write developer guide for team members
> Create CONTRIBUTING.md.
> Content: local setup instructions, Worktree usage, PR procedures, commit rules
```

### Week 2: Parallel Development

```bash
# Each team member develops independently in their own worktree

# In Minsu's worktree
cd ../club-board-notice
claude
> /skill executing-plans
> Implement the notice CRUD items from PLAN.md in order.

# In Jisu's worktree (simultaneously)
cd ../club-board-comment
claude
> Implement the comment API and CommentList component.
> Strictly follow TypeScript strict rules from CLAUDE.md.

# In Junhyuk's worktree (simultaneously)
cd ../club-board-upload
claude
> Implement a file upload API using Supabase Storage.
> Allowed file types: PDF, images (max 10MB)
```

### Every Friday: Weekly Review Cycle

```bash
# Whole team session (one team member runs as representative)
claude

# 1. Review this week's completed/incomplete items
> /skill retro
> Review this week's team work status and problems. [Input current status]

# 2. Adjust next week's plan
> /skill writing-plans
> Update next week's PLAN.md reflecting the retrospective results.

# 3. Decide whether to merge develop → main
> /skill ship
> Check if the current develop branch is ready for deployment.
```

### Final Sprint Before Deadline

```bash
# D-7: Full feature integration testing
> /skill verification-before-completion
> After merging each feature branch into develop, run full integration tests.
> Expected conflict points: lib/supabase/types.ts, tailwind.config.ts

# D-3: Staging deployment
> /skill ship
> Run staging deployment checklist.

# D-1: Production deployment
> /skill land-and-deploy
> Run production deployment checklist.

# D-0: Presentation materials
> /skill document-release
> Create presentation document with team member contribution section.
```

---

## Recommended Skill Combinations

| Purpose | Skill | Timing |
|---|---|---|
| Team rule setup | `CLAUDE.md writing` | Project start (once) |
| Parallel development | `using-git-worktrees` | For each feature development |
| Session handoff | `checkpoint` | Before leaving / session end |
| Weekly retrospective | `retro` | Every Friday |
| Deployment setup | `setup-deploy` | Initial deployment setup (once) |
| Deployment execution | `land-and-deploy` | Each deployment |
| Comprehensive review | `review` | Before PR merge |

---

## Cautions

### Common Mistakes

1. **Not informing team members about CLAUDE.md**: If you just create the file without telling team members "Claude Code automatically applies this file when you open it," team members still write code with their own rules.

2. **Drifting too far from the base branch while using Worktree**: Working in a worktree for more than 3 days increases the diff with develop. Make `git rebase develop` every morning mandatory.

3. **Deployment authority held only by the team leader**: A situation where "only Minsu knows how to deploy" makes deployment impossible when the team leader is absent. Create deployment guides with setup-deploy so all team members can deploy.

4. **Skipping retrospectives**: "We're busy so let's skip retro this week" accumulating leads to team problems piling up. Even a 5-minute Friday retrospective must be held.

5. **Running long sessions without checkpoints**: Running Claude Code sessions for more than 2 hours lengthens the context window and reduces response quality. Save a checkpoint every hour and continue in a new session.

### Tips

- **Limit PR size to 10 files or fewer**: Large PRs are slow to review and have many conflicts. Split features into small pieces and open PRs frequently.
- **Automate Worktree cleanup**: Not cleaning up with `git worktree remove ../club-board-notice` after completing a feature wastes disk space. Clean up immediately after merge is complete.
- **Version control team CLAUDE.md**: When team rules change, update CLAUDE.md and leave a `chore: CLAUDE.md team rules update` commit message. Team members can track the change history.
- **Use Claude Code as a "twin reviewer"**: When team members use Claude Code independently, they each learn different patterns. Sharing "I tried this skill this way and it worked well" examples during weekly retrospectives elevates the whole team's proficiency.

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code |
| License | CC BY 4.0 |
| Explanation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
