---
title: "Land and Deploy"
source: "~/.claude/skills/land-and-deploy/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["deploy", "CI/CD", "gstack", "merge", "health-check"]
category: "Deployment"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Land and Deploy

## Core Concepts / How It Works

### ship vs land-and-deploy: Two Stages of the Deployment Pipeline

In the gstack ecosystem, the deployment workflow is split into two skills.

```
[Development complete]
    ↓
  /ship
    ├── Run tests
    ├── Diff review
    ├── Update CHANGELOG
    ├── Commit + push
    └── Create PR ← ship ends here
         ↓
  /land-and-deploy
    ├── Merge PR
    ├── Wait for CI to complete
    ├── Wait for deployment to finish
    └── Production health check ← land-and-deploy ends here
         ↓
  [Production deployment complete]
```

This separation is intentional. Splitting PR creation (ship) from merging and deploying (land-and-deploy) allows:
- PR reviewers to have time to inspect code before merging.
- Explicit control over deployment timing (e.g., preventing weekend deploys).
- Prevention of accidentally merging when CI is red.

### Detailed Step Breakdown

**1. Merge PR**
- Merges the specified PR (or the PR for the current branch) on GitHub.
- Follows the project's configured strategy: squash merge / rebase merge / merge commit.

**2. Wait for CI to complete**
- Polls until all GitHub Actions workflows are green.
- Immediately stops and reports the failed step if any workflow turns red.

**3. Wait for deployment to finish**
- Waits for the deployment on the connected platform (Vercel, Railway, Fly.io, etc.) to complete.
- Has a timeout configured; outputs a warning if exceeded.

**4. Canary health check**
- Uses the `canary` skill (GStack-based) to access the production URL, verifying that key pages return 200 and that important UI elements render correctly.
- Outputs a rollback recommendation if the health check fails.

## One-Line Summary

A deployment pipeline completion skill that takes the PR created by `/ship` and automatically carries out **merge → wait for CI → deployment → production health check**. Finishes the deployment with a single command — "deploy this PR to production" — without touching the code directly.

## Getting Started

```bash
/land-and-deploy
```

**SKILL.md location**: `~/.claude/skills/land-and-deploy/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: A "favorite notices" feature was developed for the Student Club Notice Board. PR #17 was already created with the `ship` skill, and the team lead has finished their review. It's time to merge into main and complete the Vercel deployment.

### Step 1: Run land-and-deploy

```
> Use the land-and-deploy skill to merge PR #17 and complete the deployment.
```

The full flow the skill executes:

```bash
# 1. Check PR status
gh pr view 17 --json state,reviewDecision,statusCheckRollup

# Result: state=OPEN, reviewDecision=APPROVED, checks=PASSING
# All conditions pass → proceed with merge

# 2. Merge PR
gh pr merge 17 --squash --delete-branch
# → "PR #17 merged (squash merge)"

# 3. Wait for CI on main branch to complete
gh run list --branch main --limit 1
# → workflow: "CI Check" running...
# (polling)
# → workflow: "CI Check" complete ✓

# 4. Wait for Vercel deployment to finish
# → Deployment ID abc123 in progress...
# (polling)
# → Deployment complete: https://club-board.vercel.app ✓

# 5. Canary health check (GStack-based)
# → GET https://club-board.vercel.app → 200 ✓
# → GET https://club-board.vercel.app/notices → 200 ✓
# → Notice list rendering confirmed ✓
# → Favorite button UI present ✓

# Final result
# PR #17 "feat: favorite notice feature" deployed to production
# URL: https://club-board.vercel.app
# Deployed at: 2026-04-12 14:35 KST
```

### Step 2: Flow on CI failure

If CI turns red, the skill stops immediately and reports the cause.

```bash
# Example output on CI failure
# ✗ workflow "CI Check" failed
# Failed step: "TypeScript type check"
# Error message:
#   src/components/notice/FavoriteButton.tsx:23:5
#   Type 'string | null' is not assignable to type 'string'.
#
# Merge has been stopped. Please fix the type error and try again.
```

### Step 3: Flow on health check failure

If the deployment succeeds but a problem is found during the health check:

```bash
# Example output on health check failure
# ✗ Canary health check failed
# GET https://club-board.vercel.app/notices → 500 Internal Server Error
# Screenshot: [attached]
#
# Possible causes:
# - Database migration not applied (favorites table missing)
# - Missing environment variable
#
# Recommendation: Consider rolling back to the previous deployment.
# Vercel rollback command: vercel rollback [previous-deployment-id]
```

### Step 4: Database migration integration for a Next.js 15 project

It is important to apply Supabase migrations before running `land-and-deploy`.

```bash
# Pre-deployment migration checklist
# 1. Apply Supabase migration
npx supabase db push --linked

# 2. Verify application
npx supabase db diff --linked
# → "No schema changes" means ready to deploy

# 3. Then run land-and-deploy
```

To include migration automation in CI:

```yaml
# .github/workflows/deploy.yml
name: Deployment Pipeline

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Apply Supabase migration
        run: npx supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

## Learning Points / Common Pitfalls

- **"Merge = deployed" should be "merge → CI → deploy → verify" (4 steps)**: Many students hit Merge on GitHub and assume the deployment happened automatically. `land-and-deploy` teaches that these 4 steps must all be explicitly completed before calling it "deployed."
- **Canary checks are insurance**: Even just 30 seconds of health checking after deployment can catch obvious errors like "the database migration wasn't applied." It's far better to discover issues yourself before hearing bug reports from teammates.
- **Can be used without `ship`**: `land-and-deploy` doesn't only handle PRs created by `ship`. You can specify any manually created PR number directly and it will work.
- **Common pitfall — merging without review**: `land-and-deploy` checks that a PR has been approved before merging. In team projects where you create and merge your own PRs, you may need to configure the skill to skip this check. However, a proper review process is strongly recommended for real services.
- **Next.js 15 tip — database migration order**: In Next.js projects using Supabase, migrations must always be applied before deploying the code. If the code references a new table that doesn't exist yet, the Canary health check will return a 500 error. Follow the "migrate first, deploy second" principle.

## Related Resources

- [ship](./ship.md) — PR creation skill (prerequisite step for land-and-deploy)
- [setup-deploy](./setup-deploy.md) — Initial deployment environment setup
- [canary](./canary.md) — Production health check skill

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
