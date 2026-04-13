---
title: "Verification Before Completion"
source: "~/.claude/skills/verification-before-completion/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["verification", "build", "test", "quality", "evidence-first"]
category: "Quality/Safety"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
---

# Verification Before Completion

## Core Concepts / How It Works

### Why This Skill Is Needed

AI has a tendency to write code and then confidently say "this should work." However, claims made without actually running the code are merely **reasoning-based assertions**. Type errors, runtime errors, missing dependencies, and environment differences cause failures more often than expected.

The Verification Before Completion skill enforces **a single principle** to avoid this trap.

> **Show the execution result before making a claim.**

### Obligation to Run Verification Commands

Before declaring success, the appropriate command from the following list **must be executed and its output confirmed**.

| Claim Type | Example Verification Command |
|-----------|-------------------------------|
| "Build succeeded" | `pnpm build`, `tsc --noEmit` |
| "Tests pass" | `pnpm test`, `vitest run` |
| "No type errors" | `tsc --noEmit`, `pnpm typecheck` |
| "Lint passes" | `pnpm lint`, `eslint src/` |
| "Server running correctly" | `curl -I http://localhost:3000` |
| "Migration succeeded" | Verify schema with DB query |

### The "No Evidence, No Completion" Principle

```
Wrong approach:
  Claude: "I added the validation logic. Now submitting with an empty title
           will return a 400 error."

Correct approach:
  Claude: "I added the validation logic. Let me verify."

  $ pnpm build
  Compiled successfully

  $ curl -X POST http://localhost:3000/api/notices \
    -H "Content-Type: application/json" \
    -d '{"title":"","content":"test"}'
  → {"error":"Please enter a title."} (400)

  Verification complete. Submitting with an empty title correctly returns a 400 error.
```

## One-Line Summary

This skill enforces the principle that **before making any success claim** such as "it's done," "I fixed it," or "the tests pass," you must actually run the verification command and confirm its output. **Evidence before assertions.**

## Getting Started

```bash
/verification-before-completion
```

**SKILL.md file location**: `~/.claude/skills/verification-before-completion/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You implemented a notice creation Server Action in a "Student Club Notice Board" project based on Next.js 15 + TypeScript. Before committing, apply the Verification Before Completion skill.

### Example 1: TypeScript Build Verification

```ts
// app/notices/actions.ts — newly written Server Action
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface CreateNoticeInput {
  title: string
  content: string
  isPinned: boolean
}

export async function createNotice(input: CreateNoticeInput) {
  const supabase = createServerActionClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { error } = await supabase
    .from('notices')
    .insert({
      title: input.title.trim(),
      content: input.content,
      is_pinned: input.isPinned,
      author_id: user.id,
    })

  if (error) throw new Error(error.message)

  revalidatePath('/notices')
}
```

Run verification before declaring "implementation complete."

```bash
# Step 1: Type check
$ pnpm typecheck

app/notices/actions.ts:18:5
Type error: Object literal may only specify known properties,
and 'isPinned' does not exist in type 'Database["public"]["Tables"]["notices"]["Insert"]'.
Did you mean to write 'is_pinned'?

# Type error found. Caught before making the claim.
```

After fixing the error, verify again:

```bash
$ pnpm typecheck
No errors found.

$ pnpm build
Compiled successfully in 4.2s

# Verification complete. Now "implementation complete" can be declared and committed.
```

### Example 2: Check Test Results Before Creating PR

```bash
# Run full verification before creating PR
$ pnpm test

 PASS  __tests__/notices.test.ts
  Fetch notice list (23ms)
  Create notice — valid input (31ms)
  FAIL Create notice — reject empty title (12ms)
    Expected: 400
    Received: 201

# Test failure found. Claiming "tests pass" is prohibited.
# Must fix the failure and re-run.
```

After fixing:

```bash
$ pnpm test
 PASS  __tests__/notices.test.ts
  Fetch notice list (23ms)
  Create notice — valid input (29ms)
  Create notice — reject empty title (11ms)

Tests: 3 passed, 3 total
# Now the "tests pass" claim is backed by evidence.
```

### Example 3: Resisting the Temptation for a Quick Check

```bash
# Wrong pattern: commit without building
> I implemented the notice delete feature. Please commit it.
Claude: Wait, let me check the build before committing.
$ pnpm build
...
Error: Cannot find module '@/lib/deleteNotice'
# Import path error. Found before committing.
```

## Learning Points / Common Pitfalls

- **"Should work" and "works" are different**: When AI writes code and says "this should work," that is reasoning, not fact. Only the execution result is fact.
- **Verification commands are short and fast**: `tsc --noEmit` takes only a few seconds. It is far faster than discovering a build failure in CI after committing and then fixing and re-pushing.
- **Make "no evidence, no completion" a team rule**: The goal of this skill is not to ask "did you run tests?" in code review, but to build a culture where verification results are attached to the PR description from the start.
- **Common mistake**: Thinking "CI will catch the build failure later." The cycle of CI failure → fix → re-push → reviewer re-checks wastes more time and energy than expected.
- **Next.js 15 perspective tip**: `pnpm build` catches not only type errors but also static generation errors, image optimization issues, and Server Component rendering errors. It is the most reliable way to find build-time errors that don't appear in dev mode (`pnpm dev`).

## Related Resources

- [test-driven-development](./test-driven-development.md) — Development philosophy of writing tests first
- [systematic-debugging](./systematic-debugging.md) — Fix after confirming the cause of failure
- [requesting-code-review](./requesting-code-review.md) — Pattern for requesting PR after verification is complete

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
