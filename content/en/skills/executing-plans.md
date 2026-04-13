---
title: "Executing Plans"
source: "~/.claude/skills/executing-plans/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:fc92bc1e0c3695e2e8d3d3acf98c4b26b1e3e5030f481541f88c3d76faafca17"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["executing-plans", "plan execution", "checkpoint", "sequential execution"]
category: "Planning/Design"
---

# Executing Plans

## Core Concepts / How It Works

Provides a method for executing a markdown plan created with `writing-plans` sequentially with checkpoints. The cycle of load → execute → mark complete → next task is repeated per task unit.

### When to Use

- When you have an existing plan (.md) and need to translate it into code
- When the plan is too long to finish in one session and needs to **continue in the next session**
- When you want mid-review checkpoints (user confirmation after each task is complete)
- When multiple tasks have dependencies, making order management important

Conversely, using this skill alone without a plan will fail due to lack of context. If you want to work directly without a plan, `subagent-driven-development` is a better fit.

### 3-Step Execution Process

The original defines the execution process in 3 steps.

1. **Load**: Read the plan and understand the context/scope/tasks completed so far. Skip tasks already marked `[x]`.
2. **Execute**: Pick the next incomplete task and implement it. Do not tackle multiple tasks simultaneously. "One task = one focus."
3. **Complete**: Verify the completion criteria are met, update the checkbox to `[x]` in the plan, and report to the user. When the user says "next," return to the Load step.

Two additional core principles are emphasized.

- **When to Stop**: If an unexpected variable arises mid-task that is not in the plan, stop immediately and notify the user. Example: "This task requires a Supabase migration but the plan doesn't include DB setup. Confirmation is needed before proceeding."
- **Integration**: This skill combines naturally with other skills like `systematic-debugging`, `test-driven-development`, and `review`. For example, if task verification fails, you can immediately switch to the investigate skill.

## One-Line Summary

A skill for **executing a markdown plan created with `writing-plans` sequentially with checkpoints**. The cycle of load → execute → mark complete → next task is repeated per task unit.

## Getting Started

```bash
/executing-plans
```

**SKILL.md location**: `~/.claude/skills/executing-plans/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: Execute the "Student Club Notice Board MVP Plan" from the writing-plans example. The plan file is at `docs/plans/notices-mvp.md`.

```bash
# Session 1 — Execute only task 1
> Execute docs/plans/notices-mvp.md with the executing-plans skill. Task 1 only.
```

Claude operates as follows:

1. **Load**: Read `docs/plans/notices-mvp.md` and find the first incomplete task in the "Tasks" section.
   ```
   - [ ] 1. Create Supabase project + write notices table schema
   ```
2. **Execute**: Write the `supabase/migrations/0001_notices.sql` file and verify the completion criteria (`supabase db push` success) stated in the plan.
   ```sql
   -- supabase/migrations/0001_notices.sql
   create type user_role as enum ('member', 'officer');

   create table notices (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     body text not null,
     author_id uuid references auth.users(id) not null,
     created_at timestamptz not null default now()
   );

   alter table notices enable row level security;

   create policy "notices_select_all" on notices
     for select using (auth.role() = 'authenticated');

   create policy "notices_insert_officer" on notices
     for insert with check (
       exists (
         select 1 from profiles
         where profiles.id = auth.uid() and profiles.role = 'officer'
       )
     );
   ```
3. **Complete**: Run the migration locally, update the checkbox in the plan.
   ```markdown
   - [x] 1. Create Supabase project + write notices table schema
   ```
   Then ask the user: "Task 1 complete. Ready to move to task 2?"

**Session 2 (next day)**: When the user returns with executing-plans and says "continue from task 2," Claude skips the already `[x]`-marked task 1 and starts from task 2 (auth middleware). Not having to re-explain the context is the core value of this skill.

```ts
// Shape of files generated when executing task 2
// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/notices/new/:path*"],
};
```

## Learning Points / Common Pitfalls

- **The power of "one task at a time"**: The most common mistake in student projects is "it's basically the same thing, let's do it all at once." Touching multiple files simultaneously makes it hard to narrow down failure points. Build the habit of committing after each task before moving on.
- **Checkboxes don't lie**: The checkboxes in the plan represent actual progress. Even when delegating to Claude, if a checkbox is not updated, that task is not complete.
- **Session continuity**: One of the design goals of this skill is "able to continue seamlessly even when the session changes." This is especially useful for students who split project work over multiple days.
- **Courage to stop**: If you get the feeling "this isn't in the plan" mid-task, don't force ahead — tell Claude to stop. This upholds the "When to Stop" principle of the original skill.

## Related Resources

- [writing-plans](./writing-plans.md) — Plan writing (the step before Executing Plans)
- [autoplan](./autoplan.md) — Automatic plan generation and review
- [subagent-driven-development](./subagent-driven-development.md) — Execute work immediately without a plan

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
