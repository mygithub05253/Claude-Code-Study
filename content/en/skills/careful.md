---
title: "Destructive Command Safety Guard (Careful)"
source: "~/.claude/skills/careful/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["careful", "safety", "destructive commands", "production", "guard"]
category: "Quality/Safety"
---

# Destructive Command Safety Guard (Careful)

## Core Concepts / How It Works

### List of Monitored Commands

Careful mode intercepts commands in the following categories before they execute.

| Category | Example Commands | Risk |
|------|------------|------|
| **File system** | `rm -rf`, `rmdir /s`, `truncate` | Permanent deletion of files/directories |
| **Database** | `DROP TABLE`, `DELETE FROM` (no WHERE), `TRUNCATE` | Permanent data deletion |
| **Git** | `git push --force`, `git reset --hard`, `git clean -f` | Permanent removal of commits/changes |
| **Containers/Clusters** | `kubectl delete`, `docker system prune` | Service shutdown, image deletion |
| **Processes** | `kill -9 PID`, `pkill -f` | Forced process termination |

### When to Use

- When accessing a production server or production database
- When debugging a live system directly or deploying a hotfix
- When working in a shared environment (shared staging, shared branch)
- Before a large data migration or schema change operation
- When you want a safety net before delegating to Claude in a situation where "a mistake would be really bad"

### Warning → User Choice Flow

```
Claude: This command cannot be undone:
        rm -rf ./uploads/
        Do you want to continue? [y/N/explain reason]

User: y  → Execute
User: N  → Cancel
User: "I actually only want to delete the temp folder" → Suggest command modification
```

### User Override Allowed

A warning is a **confirmation request**, not a "forced stop." If the user knows they are intentionally performing a dangerous operation, they can individually override (y) each warning. The skill trusts the user but acts as a safety net to reduce the chance of mistakes.

### How to Activate Careful Mode

```bash
# Activate Careful mode for this session
> be careful  # or
> careful mode  # or
> safety mode  # or
> prod mode (explicitly stating it's a production environment)
```

## One-Line Summary

A safety guard skill that displays a warning and requires user confirmation before executing **commands that are difficult or impossible to undo**, such as `rm -rf`, `DROP TABLE`, `git reset --hard`, `force push`, and `kubectl delete`.

## Getting Started

```bash
/careful
```

**SKILL.md location**: `~/.claude/skills/careful/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: You deployed a "Student Club Notice Board" project built with Next.js 15 + TypeScript to Supabase. Test data got mixed into the production DB, and you want to clean it up before delegating to Claude, so you turned on Careful mode.

### Scenario 1: Deleting Test Data from Production DB

```bash
> Turn on careful mode. I want to delete test notice data from the production Supabase DB.
```

Claude's behavior:

```
Warning: Careful mode activated. I will confirm before any destructive operation.

About to execute the following query:
DELETE FROM notices WHERE title LIKE '%test%';

Important:
- This operation cannot be undone.
- Affected rows: approximately 12 (from SELECT COUNT(*) result)
- Targeting the production DB.

It is recommended to back up before proceeding.
Do you want to continue? [y/N]
```

### Scenario 2: Accidentally Dangerous Git Command

```bash
> Revert the latest commit on the main branch.
```

Claude's behavior:

```
Warning: Destructive Git operation detected:
git reset --hard HEAD~1

This command permanently removes the last commit from the main branch.
reset --hard on a shared branch (main) affects team members.

Safe alternative:
  git revert HEAD  (adds a new reverting commit, preserves history)

Do you want to use the alternative? [y(original command)/r(use revert)/N(cancel)]
```

### Scenario 3: Deleting the Entire Uploads Folder

```ts
// Code Claude was about to execute
import { execSync } from 'child_process'
execSync('rm -rf ./public/uploads/test-*')
```

When Careful mode is active:

```
Warning: Destructive file system operation:
rm -rf ./public/uploads/test-*

List of files to be deleted:
  - test-notice-001.jpg (2.3MB)
  - test-banner.png (1.1MB)
  - ... and 8 more files

11 files will be permanently deleted.
Do you want to continue? [y/N]
```

## Learning Points / Common Pitfalls

- **The trap of "I don't make mistakes"**: Everyone makes mistakes when working in production while tired or losing focus. Careful mode provides a systematic safety net instead of relying on personal concentration.
- **Avoid the habit of ignoring warnings**: If warnings appear too frequently, they get ignored. It is better to turn off Careful mode in the development environment and only turn it on when accessing production/staging environments.
- **Utilize the safe alternative suggestion feature**: The core value of the Careful skill is not simply "don't do it" but suggesting safe alternatives like `git revert`. Reading the alternative is itself a learning opportunity.
- **Common mistake**: `git push --force` may be acceptable on a personal feature branch, but must never be used on `main`. Careful mode weighs risk based on the branch name.
- **Next.js 15 perspective**: Clearing the build cache (`rm -rf .next/`) is safe in development but can cause temporary service downtime when run on a production server. Careful mode catches this kind of context.

## Related Resources

- [guard](./guard.md) — Activate Careful + Freeze simultaneously (maximum safety mode)
- [freeze](./freeze.md) — Restrict edit scope (block file modifications outside a directory)
- [cso](./cso.md) — Security audit (OWASP, STRIDE threat modeling)

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
