---
title: "Edit Scope Lock (Freeze)"
source: "~/.claude/skills/freeze/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
tags: ["freeze", "edit scope", "file lock", "debugging", "safety"]
category: "Quality/Safety"
---

# Edit Scope Lock (Freeze)

## Core Concepts / How It Works

### How It Works

Freeze applies a software constraint to Claude's tool usage.

```
/freeze app/notices
```

After this command:
- Files inside `app/notices/`: Edit and Write tools **allowed**
- Files outside `app/notices/`: Edit and Write tools **blocked**
- Reading (Read, Grep, Glob, etc.): **unrestricted** (can read from anywhere)

**Important**: Freeze does not prevent **reading** files. It only prevents **writing** them. Reading files outside the scope to reference them or understand code remains possible.

### When to Use

- When you only want to fix a bug in a specific module (e.g., `app/notices/`) and want to prevent modifications from spreading to other modules
- When you want to explicitly give Claude the constraint "only touch this folder, don't touch the rest"
- When a teammate is working on a module and you want to prevent accidentally modifying it
- When you want to strictly limit the scope of a refactoring to one directory
- When you use expressions like "freeze," "restrict edits," "only edit this folder," or "lock down edits"

### Activation and Deactivation

```bash
# Allow only a specific directory
/freeze app/notices

# Allow multiple directories (may vary depending on gstack implementation)
/freeze app/notices app/components/notice

# Both relative and absolute paths are accepted
/freeze ./src/features/notice
```

```bash
# Deactivate freeze within the session → see /unfreeze skill
/unfreeze
```

Freeze is automatically deactivated when the session ends.

### Why Freeze Is Needed

During debugging, Claude tends to modify other related files while "finding the cause of the problem." For example, while looking for a bug in the notice list component, it might "improve" the common layout or authentication logic. These modifications are not necessarily bad, but going beyond the debugging scope can cause unexpected side effects.

Freeze creates a clear boundary of "the scope of this task ends here."

## One-Line Summary

This skill prevents unintended file modifications during debugging or focused work by blocking the Edit or Write tools from modifying files **outside the specified directory** in the current session.

## Getting Started

```bash
/freeze
```

**SKILL.md file location**: `~/.claude/skills/freeze/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You are debugging a pagination bug in the `app/notices/` directory of a "Student Club Notice Board" project based on Next.js 15 + TypeScript. You want to only modify files related to notices without touching the authentication logic or common components.

```bash
# At the start of the session
> Use the freeze skill to allow editing only the app/notices/ directory
```

**Output after Freeze activation**

```
Freeze activated
   Allowed path: app/notices/
   Blocked: Edit/Write operations on all other paths
   Read restriction: none
```

**Example of normal work**

```typescript
// Modifying app/notices/page.tsx — allowed

// Pagination bug: empty array returned on the last page
// Cause: offset calculation is wrong, exceeding the range

// Original code
const offset = (page - 1) * PAGE_SIZE; // page=1: offset=0 (correct)
                                         // page=0 input: offset=-20 (bug)

// Fixed code
const safePage = Math.max(1, page); // Guarantee minimum of 1
const offset = (safePage - 1) * PAGE_SIZE;
```

**Attempt to modify a file outside the scope — block example**

```bash
# When Claude tries to modify auth logic while debugging
> I'll improve the error handling of the getUser function in app/lib/auth.ts.
```

Freeze response:

```
[Freeze Blocked]

Requested file: app/lib/auth.ts
Allowed scope: app/notices/

The current session can only edit the app/notices/ directory.
If auth.ts improvements are needed, run /unfreeze first,
or handle it as a separate task after this debugging session ends.

Shall we continue fixing the notice pagination bug?
```

**Visualizing the directory structure and Freeze boundary**

```
app/
├── notices/          ← Freeze allowed scope
│   ├── page.tsx         (editable)
│   ├── [id]/
│   │   └── page.tsx     (editable)
│   └── create/
│       ├── page.tsx     (editable)
│       └── actions.ts   (editable)
├── auth/             ← Freeze blocked scope
│   └── callback/
│       └── route.ts     (not editable)
├── lib/              ← Freeze blocked scope
│   └── auth.ts          (not editable)
└── layout.tsx        ← Freeze blocked scope (not editable)
```

## Learning Points / Common Pitfalls

- **Freeze forces focus**: When the temptation arises during debugging to "fix this too," Freeze keeps you focused only on the current task. This prevents a bug fix from creating other bugs.
- **Think of reading and writing separately**: Freeze only blocks writing. Reading code outside the scope is always possible and is also a good debugging approach.
- **Common mistake — scope too narrow**: If you set Freeze to allow only `app/notices/[id]/page.tsx`, you can't touch `app/notices/page.tsx` either, even though it's also a notice-related file. It is practical to set the scope at the **directory** level rather than the file level.
- **Next.js 15 tip**: In App Router, it is convention to group files related to the same feature under `app/[feature]/`. Following this structure also makes Freeze scope setting natural. Allowing only `app/notices/` can include all pages, layouts, and actions for that feature.
- **Difference from Guard**: Freeze only restricts the edit scope. If you need warnings for dangerous commands (rm, DROP TABLE, etc.), use Guard. For debugging sessions without destructive operations, Freeze alone is sufficient.

## Related Resources

- [guard](./guard.md) — Maximum safety mode combining Careful + Freeze
- [careful](./careful.md) — Request confirmation before running dangerous commands
- [investigate](./investigate.md) — Systematic bug investigation (use with Freeze)

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
