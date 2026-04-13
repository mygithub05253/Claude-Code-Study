---
title: "Requesting Code Review"
source: "~/.claude/skills/requesting-code-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["code review", "PR", "self-verification", "collaboration"]
category: "Code Review"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
---

# Requesting Code Review

## Core Concepts / How It Works

The goal of a code review request is not simply "creating a PR" but **"preparing for reviewers to review effectively."**

### Self-Verification Checklist

Check the following items yourself before submitting a PR.

**Feature completeness**
- Have all original requirements (issues, tickets, design documents) been implemented?
- Have edge cases as well as the happy path (normal flow) been handled?
- Is there appropriate feedback in error situations that users might encounter?

**Code quality**
- Are there no TypeScript strict mode violations, `any` usage, or unnecessary `console.log`?
- Are there comments for complex logic?
- Is the component/function size appropriate? (Single responsibility principle)

**Tests**
- Are there unit tests for core logic?
- Do the tests verify actual requirements, or only implementation details?

**Security**
- Is user input properly validated/escaped?
- Are there no endpoints missing authentication/authorization checks?

### Good PR Description Structure

Structure the PR description so reviewers can quickly grasp the context.

```
## Changes
- What was changed and why

## How to Test
- How it was verified, how to test it directly

## Review Focus
- Parts you want the reviewer to pay particular attention to

## Screenshots (if UI changes)
- Before/After images
```

## One-Line Summary

This is a code review request skill that **systematically verifies whether requirements are met** after completing work, after implementing major features, or immediately before merging into the main branch.

## Getting Started

```bash
/requesting-code-review
```

**SKILL.md file location**: `~/.claude/skills/requesting-code-review/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You implemented the "create notice" feature in a "Student Club Notice Board" based on Next.js 15 + TypeScript. It uses Server Action + Supabase, and only authenticated users should be able to create notices.

**Self-Verification Step**

```bash
# In Claude Code session
> Use the requesting-code-review skill to verify the feature/create-notice branch.
> Original requirements: Only logged-in club members can create notices,
> with title length 1~100 characters and body length 10~2000 characters.
```

**Implementation code example**

```typescript
// app/notices/create/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Input validation schema
const createNoticeSchema = z.object({
  title: z.string().min(1, "Please enter a title").max(100, "Title must be 100 characters or less"),
  content: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(2000, "Body must be 2000 characters or less"),
});

export async function createNotice(formData: FormData) {
  // Authentication check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Input validation
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const result = createNoticeSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  // Save to DB
  const { error } = await supabase.from("notices").insert({
    title: result.data.title,
    content: result.data.content,
    author_id: user.id,
  });

  if (error) {
    return { error: { _root: ["Failed to save notice."] } };
  }

  revalidatePath("/notices");
  redirect("/notices");
}
```

**PR description example**

```markdown
## Changes
Implemented the notice creation feature (#12).
- Form processing with Server Action (`createNotice`)
- Server-side validation with Zod schema (title 1~100 chars, body 10~2000 chars)
- Authentication check with Supabase `auth.getUser()`, redirect to /login if unauthenticated

## How to Test
1. Run `pnpm dev` and visit http://localhost:3000/notices/create
2. Not logged in → confirm redirect to /login
3. Logged in, submit empty title → confirm error message
4. Submit with valid input → confirm move to /notices and new notice displayed in list

## Review Focus
- Whether the approach of returning errors from Server Actions is appropriate (return vs throw)
- Whether the Supabase RLS policy conflicts with the `author_id` storage approach
```

**Self-verification result — Example Claude feedback**

```
✅ Authentication check: auth.getUser() used, redirect handling for unauthenticated
✅ Input validation: Zod schema, title/body length limits all implemented
⚠️  Error handling: DB error is returned, but
    redirect() also executes even when there is an error.
    There is a bug where redirect() always executes after `if (error) return {...}`.
❌ No tests: No unit/integration tests for the createNotice Server Action.
```

## Learning Points / Common Pitfalls

- **PR = communication document**: A PR that only has code is unfriendly to reviewers. Specifying why the change was made and what to look at raises team productivity.
- **Self-verification before review**: Don't create a situation where the reviewer asks "did you run the tests?" Including the self-verification checklist in the PR description increases credibility.
- **Common mistake — mistaking "it's complete"**: A feature working and satisfying all requirements are different. Re-read the requirements document and verify that each item has actually been implemented.
- **Next.js 15 tip**: Always check the order of `return` and `redirect()` in Server Actions. `redirect()` internally throws an exception, so putting it inside a `try-catch` causes unexpected behavior. It is safe to call it outside the `try` block.
- **Code review request timing**: "When you think it's done" and "when it's actually done" are different. It is efficient to run the self-verification skill, reflect the feedback, and then request a review.

## Related Resources

- [receiving-code-review](./receiving-code-review.md) — Code review reception skill
- [review](./review.md) — Pre-PR self-review skill
- [ship](./ship.md) — PR creation + review request automation

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
