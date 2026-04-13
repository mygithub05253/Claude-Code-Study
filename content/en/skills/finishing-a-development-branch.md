---
title: "Finishing a Development Branch"
source: "~/.claude/skills/finishing-a-development-branch/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
tags: ["finishing-a-development-branch", "branch", "PR", "merge", "commit-cleanup"]
category: "Deployment"
---

# Finishing a Development Branch

## Core Concepts / How It Works

### Three Integration Paths

Finishing a Development Branch guides you through three paths depending on the situation.

#### Path A — Direct Merge

For small solo projects, or cases where sufficient review has already been done verbally.

```
feature/add-image-upload → main
Method: git merge --no-ff (clarify history with a merge commit)
        or git rebase + merge (maintain linear history)
```

#### Path B — Pull Request Creation

For team collaboration or cases where code review is required. The skill automates:

1. Generating a PR title and body draft (change summary + testing checklist)
2. Running `gh pr create`
3. Suggesting reviewer assignments
4. Deciding whether to open as a Draft PR first

#### Path C — Cleanup + Merge

For cases where the commit history is messy or WIP commits are mixed in. The skill guides:

1. Analysis of `git log --oneline` output
2. Identifying commits to squash ("WIP", "fix typo", "minor", etc.)
3. Cleaning up with `git rebase -i` before merging or creating a PR

### When to Use It

- When you receive requests like "I'm done, what now?" or "finish the branch"
- When feature implementation is complete and `pnpm test` passes entirely
- When working solo on a side project and you need to decide whether to direct-merge or create a PR
- When you want to handle PR creation, reviewer requests, and branch deletion all at once in a team project
- When `git log --oneline` output is too messy and you need to decide whether squash merge is needed

### Post-Completion Cleanup

Regardless of the integration method, there are common cleanup tasks performed after merging:

- **Delete branch**: `git branch -d feature/xxx` (local) + `git push origin --delete feature/xxx` (remote)
- **Close related issues**: Verify `Closes #123` keyword in PR body or close manually
- **Suggest Document Release**: If a new feature was added, suggest running `/document-release`
- **Next task snapshot**: Suggest updating MEMORY.md or project TODO

## One-Line Summary

After implementation is complete and all tests pass, a skill that **presents structured options for which integration method to choose (merge / PR creation / cleanup) and fully executes the chosen path**.

## Getting Started

```bash
/finishing-a-development-branch
```

**SKILL.md location**: `~/.claude/skills/finishing-a-development-branch/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: Work on the `feature/add-image-upload` branch for the "Student Club Notice Board" is complete. Both `pnpm test` and `pnpm typecheck` pass. Now the branch needs to be finished.

### Step 1 — Run the skill

```bash
> Use the finishing-a-development-branch skill to wrap up the feature/add-image-upload branch
```

### Step 2 — Situation assessment and options presented

```
[Finishing Branch] Situation Analysis

Branch: feature/add-image-upload
Base: main (3 commits behind)
Tests: ✓ All passing (47 tests)
Type check: ✓ No errors

Commit history (8):
  abc1234 feat: S3 integration for image upload
  def5678 feat: implement ImageUploader component
  ghi9012 WIP: temporary drag-and-drop save      ← WIP
  jkl3456 fix: S3 presigned URL expiry issue
  mno7890 fix typo in ImageUploader               ← cleanup candidate
  pqr1234 test: ImageUploader unit tests
  stu5678 docs: add S3 setup guide to README
  vwx9012 chore: install aws-sdk package

⚠ 1 WIP commit and 1 "fix typo" commit found → cleanup recommended

Please choose an integration method:
  A. Direct merge (solo work, fast integration)
  B. Create PR (team review, GitHub issue linking)
  C. Clean up commits then create PR (recommended — clean history)

> C
```

### Step 3 — Commit cleanup (Squash)

```bash
[Finishing Branch] Commit cleanup plan

The following commits will be squashed:
  ghi9012 WIP: temporary drag-and-drop save     ↘ squash into def5678
  mno7890 fix typo in ImageUploader             ↘ squash into def5678

Final commit history (6):
  abc1234 feat: S3 integration for image upload
  def5678 feat: implement ImageUploader component (including drag-and-drop)
  jkl3456 fix: fix S3 presigned URL expiry issue
  pqr1234 test: add ImageUploader unit tests
  stu5678 docs: add S3 environment variable setup to README
  vwx9012 chore: install @aws-sdk/client-s3 package

Proceed? (y/n) > y
```

### Step 4 — PR creation

Example PR body generated:

```markdown
## Changes
- Added image upload feature when creating notices (up to 5 images)
- ImageUploader component: supports drag-and-drop + click upload
- Safe direct upload based on AWS S3 presigned URL
- Added `imageUrls: string[]` field to the Notice data model

## How to Test
- [ ] Verify image drag-and-drop on the notice creation page
- [ ] Verify error message when uploading more than 5 images
- [ ] Verify uploaded images are visible on the notice detail page
- [ ] Verify error handling when S3_BUCKET_NAME environment variable is not set

## Related Issues
Closes #42

## Notes
- AWS S3 bucket creation and CORS configuration required in AWS Console
- See `.env.example`: S3_BUCKET_NAME, AWS_REGION, AWS_*KEY
```

### Step 5 — Post-merge cleanup

```bash
[Finishing Branch] PR #58 merged

Cleanup tasks performed:
  ✓ Local branch deleted: feature/add-image-upload
  ✓ Remote branch deleted
  ✓ Issue #42 automatically closed (Closes keyword)

Recommended next steps:
  → Run /document-release (README environment variables section needs updating)
  → Start .canary monitoring (monitor image upload feature after deployment)
```

## Learning Points / Common Pitfalls

- **WIP commits must be cleaned up before merging**: Commits like `git commit -m "WIP"`, `git commit -m "fix"`, or `git commit -m "a"` become noise in the main branch history with no information when you later trace changes with `git log`.
- **Common mistake — abusing `git push -f` just because it's faster**: Force push is sometimes necessary after squashing, but using `git push -f` on a shared branch (a branch others have checked out) will corrupt their history. Use it only on feature branches that only you are using.
- **A PR body is a guide for reviewers**: "What was changed" can be seen from the diff. What matters in a PR body is "why it was changed" and "how to test it."
- **Applying to this project**: This project's `CLAUDE.md` specifies the strategy "direct push to main for MVP, feature branch + PR from P1 onwards." The Finishing Branch skill clearly distinguishes between Path A (direct merge, MVP phase) and Path B (PR, from P1 onward) within this strategy.
- **Next.js 15 tip — `pnpm typecheck` is required**: Passing tests alone is not enough. Always run `pnpm typecheck` (= `tsc --noEmit`) before finishing a branch to confirm there are no type errors. Type errors sometimes don't surface at runtime and then suddenly appear after deployment.

## Related Resources

- [document-release](./document-release.md) — Post-merge documentation sync (step after finishing a branch)
- [ship](./ship.md) — Deployment pipeline automation
- [review](./review.md) — Pre-merge code review automation

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
