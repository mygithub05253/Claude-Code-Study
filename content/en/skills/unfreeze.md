---
title: "Edit Scope Release (Unfreeze)"
source: "~/.claude/skills/unfreeze/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["edit scope", "freeze", "unfreeze", "gstack", "safety"]
category: "Safety"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
---

# Edit Scope Release (Unfreeze)

## Core Concepts / How It Works

### The Relationship Between Freeze and Unfreeze

Freeze and Unfreeze form a pair that **dynamically adjusts** the edit scope within the same session.

```
Session start
  │
  ├─ (when task scope is narrow) /freeze app/notices
  │       │
  │       ├─ Only files inside app/notices/ can be edited
  │       │
  │       └─ (when scope expansion is needed) /unfreeze
  │               │
  │               └─ All directories can be edited (session continues)
  │
Session end (Freeze is automatically released when session ends)
```

### How Unfreeze Works

After running `/unfreeze`:
- Previously set Freeze boundaries are **all removed**
- Edit and Write tools become available again for **all paths**
- Careful warnings (activated via `/careful` or `/guard`) are **maintained as-is**

**Important**: Unfreeze only releases Freeze. The Careful setting (dangerous command warnings) activated via Guard mode is not released by Unfreeze. A separate command is needed to release Careful.

### When Unfreeze Is Needed

During debugging or focused work, two situations arise.

**Situation A: The cause of the bug is in another module**
While debugging the notice page bug, you discover the actual cause is in the common authentication module. Now `app/lib/auth.ts` also needs to be modified.

**Situation B: Related refactoring is needed**
While refactoring the notice component, you realize that also improving the common `Button` component would make things much cleaner. Now the scope needs to expand.

In these situations, you don't need to end the session and start again. Just release the scope with Unfreeze.

## One-Line Summary

This skill releases the edit scope restriction set by `/freeze` **without ending the session**, returning to a state where files can be modified in all directories.

## Getting Started

```bash
/unfreeze
```

**SKILL.md file location**: `~/.claude/skills/unfreeze/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You had applied Freeze to the `app/notices/` directory in a "Student Club Notice Board" project based on Next.js 15 + TypeScript and were debugging a notice pagination bug. After debugging, you discovered that the actual cause of the problem is in the `app/lib/pagination.ts` utility function. Now you need to release Freeze and modify that file as well.

```bash
# Current state: Freeze active (only app/notices/ can be edited)

# Confirm bug cause
> I think there's a problem with the calculateOffset function in app/lib/pagination.ts.
> I need to modify this function but freeze is currently active. Please unfreeze.
```

**Executing Unfreeze**

```
Freeze released

Previous allowed scope: app/notices/
Current state: All directories can be edited

Careful mode: maintained (if it was in Guard mode)
```

**Example work after Unfreeze**

```typescript
// Modifying app/lib/pagination.ts — now possible

// calculateOffset function with the bug
export function calculateOffset(page: number, pageSize: number): number {
  return page * pageSize; // page=1: offset=20 (skips page 1!)
}

// Fixed function
export function calculateOffset(page: number, pageSize: number): number {
  // page starts from 1, so we must multiply (page - 1)
  const safePage = Math.max(1, page);
  return (safePage - 1) * pageSize;
}
```

**Using the utility in the notice page after modification**

```typescript
// app/notices/page.tsx — Can also check the impact of utility changes after Unfreeze

import { calculateOffset } from "@/lib/pagination";

interface SearchParams {
  page?: string;
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");

  // Use the fixed calculateOffset
  const offset = calculateOffset(page, PAGE_SIZE);

  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  return <NoticeList notices={notices ?? []} />;
}
```

**Full workflow example**

```bash
# 1. Start task: lock scope narrow
> freeze app/notices/

# 2. Analyze and modify files inside app/notices/
[Debugging in progress...]

# 3. Discover the bug cause is in an external module
> Checking app/lib/pagination.ts — calculateOffset is wrong.

# 4. Release scope
> unfreeze

# 5. Now app/lib/pagination.ts can also be modified
[Modify lib/pagination.ts...]

# 6. Re-lock scope if needed
> freeze app/notices/ app/lib/

# Automatically released when session ends
```

**Re-verification example after Unfreeze**

```typescript
// Confirm with unit tests after fix — tests/lib/pagination.test.ts
// Test files can also be modified after Unfreeze

import { describe, it, expect } from "vitest";
import { calculateOffset } from "@/lib/pagination";

describe("calculateOffset", () => {
  it("offset for page 1 should be 0", () => {
    expect(calculateOffset(1, 20)).toBe(0);
  });

  it("offset for page 2 should be 20", () => {
    expect(calculateOffset(2, 20)).toBe(20);
  });

  it("page numbers of 0 or less are treated as 1", () => {
    expect(calculateOffset(0, 20)).toBe(0);
    expect(calculateOffset(-1, 20)).toBe(0);
  });
});
```

## Learning Points / Common Pitfalls

- **Unfreeze is a natural flow from Freeze**: Debugging → finding the cause → expanding scope → fixing happens within one session. Unfreeze allows this flow to continue smoothly without restarting the session.
- **Freeze → work → Unfreeze → expanded work pattern**: Starting narrow and expanding when needed is the safe way to work. Expanding scope when necessary reduces mistakes compared to opening everything from the start.
- **Common mistake — forgetting Unfreeze when trying to modify another file**: When a file modification outside the Freeze scope is blocked, you may be briefly confused. In a "why can't I modify this?" situation, first check the Freeze state. Claude always informs you of the current Freeze state so it is easy to identify.
- **Next.js 15 tip**: Common utilities (`app/lib/`), common components (`components/`), and feature-specific pages (`app/[feature]/`) often depend on each other. The pattern of initially Freezing only the feature directory and then Unfreezing when common layer modifications become necessary is effective.
- **When used with Guard mode**: Guard = Careful + Freeze. By removing only the Freeze layer with Unfreeze, Careful (dangerous command warnings) remains active, allowing you to maintain production safety while expanding only the edit scope.

## Related Resources

- [freeze](./freeze.md) — Edit scope restriction skill (pair of Unfreeze)
- [guard](./guard.md) — Integrated safety mode combining Careful + Freeze
- [systematic-debugging](./systematic-debugging.md) — Debugging after Freeze, expanding fix scope with Unfreeze

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
