---
title: "Writing Plans"
source: "~/.claude/skills/writing-plans/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:860c03363e5ad80a5d42de2a61fa5a569ba49bc23fa24af83e78aeff56ae62d0"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["plans", "tasks", "BiteSized", "NoPlaceholders", "ExecutionHandoff"]
category: "Planning/Design"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# Writing Plans

## Core Concepts / How It Works

The original skill has four core rules.

1. **Scope Check**: A plan must target a single goal. If "let's also do this" comes up, split it into a new plan.
2. **Bite-Sized Tasks**: Each task must be completable within one session, resulting in either "done" or "handed off to the next task." Ambiguous tasks are prohibited.
3. **No Placeholders**: Never leave holes like "TODO", "add something here", or "fill in later." If something is unknown, create a separate task labeled "research needed."
4. **Execution Handoff**: The plan is a document handed off to the executing-plans skill. It must be immediately executable by the recipient without additional context.

A plan document generally has these sections:

- `# Plan Title`
- `## Context` — Why is this being done?
- `## Scope` — Included / Excluded
- `## Tasks` — Checkbox list with file paths
- `## Verification` — Completion criteria
- `## Risks` — Failure modes and responses

## One-Line Summary

A skill for writing a markdown plan broken into **minimum executable task units** before starting multi-step work. It locks in "what / in what order / how to verify" in a document before touching any code.

## Getting Started

```bash
/writing-plans
```

**SKILL.md location**: `~/.claude/skills/writing-plans/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: With intent clarified through brainstorming, write a plan for "a Next.js 15 notice page used by logged-in club members (read) and officers (write)."

```markdown
# Student Club Notice Board MVP Plan

## Context
For a class assignment. Build a notice page with Next.js 15 App Router + Supabase
that separates read/write permissions. Notifications and comments excluded from MVP.

## Scope
- In: Login, notice CRUD, role separation (member/officer)
- Out: Notifications, comments, file attachments, markdown rendering

## Tasks
- [ ] 1. Create Supabase project + write notices table schema
      File: `supabase/migrations/0001_notices.sql`
      Done: `supabase db push` succeeds + SELECT works locally
- [ ] 2. Write authentication middleware
      Files: `middleware.ts`, `lib/auth.ts`
      Done: Unauthenticated users accessing /notices/new are redirected to /login
- [ ] 3. Notice list server component
      File: `app/notices/page.tsx`
      Done: Latest 10 notices fetched server-side from Supabase and rendered
- [ ] 4. Notice creation form (officers only)
      Files: `app/notices/new/page.tsx`, `app/notices/new/actions.ts`
      Done: Insert succeeds via Server Action + non-officers receive 403

## Verification
- `pnpm build` succeeds
- Regular account login → /notices accessible / /notices/new blocked
- Officer account login → both pages accessible, creation succeeds
- Lighthouse accessibility score 90+

## Risks
- Supabase RLS policy bug → double-protect table policy so only `officer` role can INSERT
- Next.js 15 Server Actions syntax changes → bookmark official docs link
```

The key here is that **each task specifies the file path and completion criteria**. The executing-plans skill receives this plan and executes tasks sequentially starting from task 1.

```ts
// The shape of code Claude will write when executing task 3
// app/notices/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function NoticesPage() {
  const supabase = createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, created_at, author_name")
    .order("created_at", { ascending: false })
    .limit(10);

  return <NoticeList notices={notices ?? []} />;
}
```

## Learning Points / Common Pitfalls

- **A plan is a "compile error check" before execution**: Things may seem logically consistent in your head, but writing them down reveals contradictions. If "how do I verify this task?" has no answer, the task is too large or the intent is unclear.
- **Bite-Sized principle**: In student projects, if a single task takes more than 4 hours, reconsider whether it can be split. Long tasks make it easy to lose direction mid-way.
- **No Placeholders**: Writing "handle something here" and planning to fill it in later means future-you has already forgotten the context. If unknown, create a separate "research needed" task.
- **Next.js 15 tip**: Plans for App Router projects must include the decision of "server component / client component / Server Action." Any task where this is unclear will inevitably stall during execution.
- **Plan → Execution Handoff**: After finishing the plan, ask yourself: "Could someone else execute this just from reading this plan?" If not, context is missing.

## Related Resources

- [executing-plans](./executing-plans.md) — Plan execution skill (next step after writing-plans)
- [subagent-driven-development](./subagent-driven-development.md) — Sub-agent execution based on plans
- [plan-eng-review](./plan-eng-review.md) — Engineering review of plans

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
