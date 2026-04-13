---
title: "Ship — Deployment Workflow"
source: "~/.claude/skills/ship/SKILL.md"
sourceHash: "sha256:198e2e06814d668a0ec0f2feba318d4b88cfddc33375e070ada90f0e1d9e4e98"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
---

# Ship — Deployment Workflow

## Core Concepts / How It Works

`ship` is part of the gstack ecosystem — a 6-step automated checklist that takes locally completed work all the way to a PR.

```mermaid
flowchart TD
    A[/ship invoked] --> B[Detect base branch + merge]
    B --> C{Conflicts?}
    C -->|Conflicts found| D[Stop immediately - request conflict resolution]
    C -->|No conflicts| E[Run tests]
    E --> F{Tests pass?}
    F -->|Fail| G[Stop - request test fix]
    F -->|Pass| H[Scan diff review]
    H --> I[Bump VERSION + update CHANGELOG]
    I --> J[Commit + Remote Push]
    J --> K[gh pr create - create PR]
    K --> L[Return PR URL]
```

Step-by-step description:
1. **Detect base branch + merge**: Auto-detects `main` or `master`, merges the latest base into the current branch
2. **Run tests**: Executes the project's test command — stops immediately on failure
3. **Diff review**: Auto-scans for SQL safety, LLM trust boundaries, conditional side effects, etc.
4. **VERSION bump + CHANGELOG**: Semantic versioning + user-friendly changelog entry
5. **Commit + push**: Commits in Conventional Commits format, then pushes to remote
6. **Create PR**: Creates a PR with `gh pr create` and returns the URL

## One-Line Summary

A deployment workflow skill that automates the entire sequence of tasks (test, review, version bump, changelog, commit, push, PR) needed to take local work up to a PR — all in one step.

## Getting Started

```bash
# Invoke as a slash command in a Claude Code session
/ship
```

**SKILL.md location**: `~/.claude/skills/ship/SKILL.md`

Prerequisites:
```bash
# 1. Verify GitHub CLI installation and authentication
gh auth status

# 2. Confirm the project's test command
pnpm test    # or npm test / yarn test

# 3. Confirm the build command
pnpm build

# 4. Confirm CHANGELOG.md exists (create if missing)
touch CHANGELOG.md
```

The ship skill will stop at any step if these commands are not working. It is important to set them up in advance.

## Practical Example

**Scenario**: Tasks 1–4 for the Student Club Notice Board MVP are complete and committed on the `feature/notices-mvp` branch. Time to create a PR.

```bash
# In a Claude Code session
> Use the ship skill to open a PR from the feature/notices-mvp branch.
```

The flow Claude executes internally:

```bash
# 1. Detect base + merge
git fetch origin main && git merge origin/main

# 2. Run tests + build check
pnpm test && pnpm build && pnpm typecheck

# 3. Diff scan (check SQL safety, env var exposure, etc.)
git diff origin/main...HEAD | ...

# 4. Update CHANGELOG
# Add an entry to CHANGELOG.md:
# - Notice Board MVP: list/create/permission separation (#12)

# 5. Commit + push
git commit -m "feat: implement notice board MVP"
git push -u origin feature/notices-mvp

# 6. Create PR
gh pr create --title "feat: Notice Board MVP" --body "..."
# → https://github.com/.../pull/12 returned
```

## Learning Points / Common Pitfalls

- **Automates the definition of "done"**: Bridges the gap between when a developer feels "I'm done" and when they're actually done. One build run and one test run significantly improve submission quality.
- **"Stopping" is not failure**: When the skill stops mid-way due to a test failure or conflict, it's a signal saying "don't deploy this." Don't force it through.
- **Applicable even without gstack**: The original skill assumes gstack-specific helpers, but the core idea is a "pre-PR checklist." The same effect can be achieved by running the steps manually in order without gstack.
- **Prepare Conventional Commits**: Setting up Conventional Commits (feat:, fix:, chore:) as a project-wide rule in advance keeps commit message quality consistent.

## Related Resources

- [Finishing a Development Branch (finishing-a-development-branch)](/skills/finishing-a-development-branch) — Deciding how to merge
- [Land and Deploy (land-and-deploy)](/skills/land-and-deploy) — Production deployment after ship
- [PR Review (review)](/skills/review) — Diff review skill used inside ship
- [Setup Deploy (setup-deploy)](/skills/setup-deploy) — Initial deployment platform setup

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
