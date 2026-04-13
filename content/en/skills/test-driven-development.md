---
title: "Test-Driven Development"
source: "~/.claude/skills/test-driven-development/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:22d82b93807a2059ce34f1757beaa414b4ef09c40f3e8f35cd9931961e6777b0"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["TDD", "testing", "Red-Green-Refactor", "Vitest", "quality"]
category: "Quality / Safety"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Test-Driven Development

## Core Concepts

The original's **Iron Law** is a single line.

> **Never write any production code without first seeing a failing test.**

The Red-Green-Refactor cycle to uphold this:

1. **Red — Write a Failing Test**: Write a test that describes the desired behavior first. The key of this phase is **actually seeing the test fail with your own eyes**. It prevents the illusion that "it would have passed without running it."
2. **Green — Minimal Implementation to Pass the Test**: Write the simplest code that turns the test green. At this stage, do not attempt "generalization for the future."
3. **Refactor — Remove Duplication**: Improve code quality while maintaining the passing state of the tests. Refactoring is safe because there are tests.

The difference between **good TDD examples** and **bad TDD examples** usually lies in "confirming failure." Writing `expect(add(2, 3)).toBe(5)`, actually running it, seeing `ReferenceError: add is not defined` with your own eyes, and only then writing `function add()` — that is true TDD.

## One-Line Summary

A skill with an Iron Law: **never write a single line of production code without a failing test**. Implementation proceeds through the Red (fail) → Green (pass) → Refactor (polish) cycle.

## Getting Started

```bash
/test-driven-development
```

**SKILL.md location**: `~/.claude/skills/test-driven-development/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: You want to add a "search feature" to the Student Club Notice Board. It's a function that partial-match searches notice titles by keyword entered by the user. Let's implement it with TDD.

### Step 1 — Red: Write a Failing Test

```ts
// tests/search.test.ts
import { describe, it, expect } from "vitest";
import { filterNoticesByKeyword } from "@/lib/notices/search";

describe("filterNoticesByKeyword", () => {
  const notices = [
    { id: "1", title: "MT Announcement", body: "..." },
    { id: "2", title: "Club Dues Payment Notice", body: "..." },
    { id: "3", title: "Regular Meeting MT Schedule", body: "..." },
  ];

  it("returns only notices whose title contains the keyword", () => {
    const result = filterNoticesByKeyword(notices, "MT");
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.id)).toEqual(["1", "3"]);
  });

  it("returns the full list when the keyword is empty", () => {
    expect(filterNoticesByKeyword(notices, "")).toHaveLength(3);
  });

  it("is case-insensitive", () => {
    expect(filterNoticesByKeyword(notices, "mt")).toHaveLength(2);
  });
});
```

Running `pnpm test` at this point **fails with a module not found error**. Seeing this failure is the key of the Red phase.

```bash
pnpm test
# FAIL tests/search.test.ts
# Cannot find module '@/lib/notices/search'
```

### Step 2 — Green: Minimal Implementation

```ts
// lib/notices/search.ts
interface Notice {
  id: string;
  title: string;
  body: string;
}

export function filterNoticesByKeyword(notices: Notice[], keyword: string): Notice[] {
  if (keyword === "") return notices;
  const needle = keyword.toLowerCase();
  return notices.filter((n) => n.title.toLowerCase().includes(needle));
}
```

Running `pnpm test` again gives a green light.

```bash
pnpm test
# PASS tests/search.test.ts (3 tests)
```

### Step 3 — Refactor: Polish

To pass the third test, `toLowerCase()` was already added. Any additional cleanup? Just minor tidying like moving the `Notice` type to a global `types.ts`, without over-generalizing (e.g., "extend to also search body"). That gets added in the next Red phase when required by a test.

```ts
// lib/notices/search.ts (refactored)
import type { Notice } from "@/types/notice";

export function filterNoticesByKeyword(notices: Notice[], keyword: string): Notice[] {
  if (keyword === "") return notices;
  const needle = keyword.toLowerCase();
  return notices.filter((n) => n.title.toLowerCase().includes(needle));
}
```

### TDD When Fixing Bugs

Later, when a bug report comes in that "notices with leading/trailing spaces in the keyword aren't found," first write a **failing test that reproduces this bug** (input `"  MT  "` should still return 2 notices), then add `keyword.trim()`. This order matters.

## Learning Points / Common Pitfalls

- **"Seeing the failure" is the key point**: The most common misunderstanding of TDD is that it ends with "write the test first." In practice, the **round trip of confirming failure → confirming pass** is the key. Skipping the failure confirmation means missing cases where "the test was written incorrectly and always passes."
- **Value in student assignments**: Assignment requirements are given in natural language with a lot of room for interpretation. Fixing requirements as **executable specifications** with tests reduces the time spent revisiting "is this right?" later.
- **TDD ≠ 100% coverage**: This is not saying to cover all code with tests. It is a principle of writing the minimum tests needed to verify "has what I intended actually been implemented" first.
- **Next.js 15 tip**: The more you separate the pure function parts of a Server Component (data transformation, filtering) from the side-effect parts (`fetch`, DB queries), the easier TDD becomes. In the example above, `filterNoticesByKeyword` was separated as a pure function, making the test simple.
- **Connection with `systematic-debugging`**: When fixing bugs, TDD naturally combines with the "confirm root cause via test → fix" flow. Using both skills together prevents bug recurrence.

## Related Resources

- [systematic-debugging](./systematic-debugging.md) — Combine TDD with confirmed root cause when fixing bugs
- [verification-before-completion](./verification-before-completion.md) — Run test verification before marking completion
- [review](./review.md) — Code review including test coverage

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
