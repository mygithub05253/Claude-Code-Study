---
title: "Maximum Safety Mode (Guard)"
source: "~/.claude/skills/guard/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["guard", "safety", "destructive commands", "edit scope", "production", "careful", "freeze"]
category: "Quality/Safety"
---

# Maximum Safety Mode (Guard)

## Core Concepts / How It Works

The Guard skill combines two independent safety layers.

### Layer 1: Careful (Dangerous Command Warnings)

**Requires confirmation** before executing destructive operations such as the following.

| Command Pattern | Risk Level | Example |
|---|---|---|
| `rm -rf` | High | Force delete directory |
| `DROP TABLE` / `DELETE FROM` | High | Delete database records |
| `git push --force` | High | Overwrite remote branch history |
| `git reset --hard` | High | Permanent loss of work history |
| `UPDATE` (no WHERE) | High | Update all rows |
| `truncate` | Medium | Empty file/table |
| `chmod -R 777` | Medium | Excessive permission grant |

In Careful mode, when the above patterns are detected, Claude sends a **"This command will perform X. Shall I proceed?"** confirmation message before executing. It only executes when the user explicitly answers "yes" or "go ahead."

### Layer 2: Freeze (Edit Scope Restriction)

Blocks any attempt to modify files **outside** the specified directory using the Edit or Write tools.

```
Guard activated: Only app/notices/ directory edits allowed
→ Files inside app/notices/: editable
→ Files in app/auth/: blocked (outside scope)
→ package.json: blocked (outside scope)
```

When these two layers are combined:
- Accidentally **touching a teammate's code** is prevented
- Accidentally executing destructive SQL in a production environment is prevented
- Debugging scope is clearly limited, increasing focus

### When to Use

- When directly accessing a production database or touching a live server
- When there is a risk of accidentally running destructive commands like `rm -rf`, `DROP TABLE`, or `force-push`
- When debugging a specific module/directory and wanting to prevent accidentally modifying unrelated code
- When working on a teammate's computer or applying a hotfix in an unfamiliar codebase
- When asking Claude using expressions like "guard mode", "full safety", "lock it down", "maximum safety"

### Guard vs Careful vs Freeze Comparison

| Skill | Dangerous Command Warning | Edit Scope Restriction |
|---|---|---|
| `/careful` | Active | None |
| `/freeze [dir]` | None | Active |
| `/guard [dir]` | Active | Active |

## One-Line Summary

A skill that **simultaneously activates** `/careful` (dangerous command warnings) and `/freeze` (block edits outside the specified directory) to provide the maximum level of safety during production server access or live system debugging.

## Getting Started

```bash
/guard
```

**SKILL.md location**: `~/.claude/skills/guard/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: A Next.js 15 + TypeScript "Student Club Notice Board" project. A bug needs to be debugged in the production Supabase database. It seems incorrect data entered the notices table and needs direct SQL verification. You want to prevent accidentally touching other tables or deleting data.

```bash
# In a Claude Code session
> Enter guard mode. Only allow edits to the app/notices/ directory.
```

**Session behavior after Guard activation**

```
Guard mode activated
   - Careful: Request confirmation before executing dangerous commands
   - Freeze: Block edits outside app/notices/
```

**Scenario 1: SQL Inspection Query (Safe)**

```sql
-- Read-only query on notices table — no warning
SELECT id, title, created_at, author_id
FROM notices
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

In Guard mode, `SELECT` is not destructive so it runs without a warning.

**Scenario 2: Modifying Incorrect Data (Warning triggered)**

```sql
-- Query that triggers a Claude warning
UPDATE notices
SET is_pinned = false;
-- No WHERE clause! All notices' is_pinned will be set to false
```

Guard response:

```
[Careful Warning] Dangerous SQL detected

This UPDATE statement has no WHERE clause.
All rows (currently 47) in the notices table will have is_pinned set to false.

Shall I proceed? (yes/no)
> no

Cancelled. Please add a WHERE clause or re-confirm your intent.

// Safe version
UPDATE notices
SET is_pinned = false
WHERE id = 'notice-uuid-1234'; -- Only update a specific notice
```

**Scenario 3: Attempt to Edit a File Outside Scope (Blocked)**

```bash
# While debugging, trying to modify app/auth/actions.ts
> Modify the getUser function in app/auth/actions.ts
```

Guard response:

```
[Freeze Block] Edit access outside scope denied

Requested file: app/auth/actions.ts
Allowed scope: app/notices/

The app/auth/ directory is outside the edit scope of the current Guard mode.
To expand scope, first disable guard or update the scope.
```

**Example of Guard Usage in Next.js 15 Environment**

```typescript
// Specific scenario for preventing mistakes:
// Activate Guard while writing Supabase migration scripts

// Pattern easy to make mistakes with (Guard catches this)
const { error } = await supabase
  .from("notices")
  .delete(); // Attempt to delete all without .match()

// Pattern corrected after Guard warning
const { error } = await supabase
  .from("notices")
  .delete()
  .match({ id: noticeId }); // Delete only a specific ID
```

## Learning Points / Common Pitfalls

- **Guard is the last line of defense**: Having Guard does not mean you can be less careful. Guard "prevents mistakes" — it does not "think in place of you." Always verify in a staging environment before production work.
- **Guard must be deactivated after work**: Guard mode is automatically deactivated when the session ends. But if you forget Guard is still active during a long work session, normal operations can be unnecessarily blocked. Use `/unfreeze` to deactivate once the scope is clear.
- **Common mistake — "just pressing yes"**: The habit of pressing "yes" without reading Guard warnings renders Guard useless. When a warning appears, **always read what is dangerous** and verify it matches your intent.
- **Next.js 15 tip**: In Server Actions, calling `supabase.from(...).delete()` without `.match()` or `.eq()` can delete the entire table. Guard's "DELETE without WHERE" warning catches this pattern.
- **Team project tip**: When applying a hotfix in a module a teammate is working on, using Guard creates clear boundaries so that your changes do not accidentally touch that teammate's work scope.

## Related Resources

- [careful](./careful.md) — Activate dangerous command warnings alone
- [freeze](./freeze.md) — Activate edit scope restriction alone
- [cso](./cso.md) — Full security vulnerability audit (complements Guard)

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
