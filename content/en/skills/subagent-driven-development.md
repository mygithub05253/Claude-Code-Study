---
title: "Subagent-Driven Development"
source: "~/.claude/skills/subagent-driven-development/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["agents", "subagent", "parallel-execution", "orchestrator", "implementation-plan"]
category: "Agents"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# Subagent-Driven Development

## Core Concepts / How It Works

### Roles of Orchestrator and Subagents

Subagent-Driven Development consists of two layers: the **orchestrator** and **subagents**.

- **Orchestrator**: Understands the entire implementation plan, assigns tasks to subagents, tracks progress, and integrates results. Rather than writing code directly, it controls "in what order, who does what."
- **Subagent**: Receives a single, clearly defined task from the orchestrator and processes it independently. It doesn't know what other subagents are doing and focuses only on its own task.

### The Characteristic of Running Within the Current Session

The key distinction of this skill from the dispatching-parallel-agents skill is that it operates **within the current session**. Rather than dispatching independent agents outside the session, roles are logically separated and executed within the same Claude session.

### Task Dependency Graph

Before executing tasks in an implementation plan, you need to understand the dependency graph.

```
[Dependency Graph Example]

Task 1: Zod schema definition
    │
    ├── Task 2: DB model definition (depends on schema)
    │       │
    │       └── Task 4: API route implementation (depends on DB model)
    │
    └── Task 3: Form component implementation (depends on schema)
            │
            └── Task 5: Page integration (depends on form + API)
```

In this graph, Task 2 and Task 3 can be **run in parallel** once Task 1 is complete.

## One-Line Summary

A development pattern that **within the current session** delegates independent tasks from an implementation plan to subagents and executes them sequentially or in parallel, with the orchestrator Claude controlling overall progress while systematically completing complex implementations.

## Getting Started

```bash
/subagent-driven-development
```

**SKILL.md file location**: `~/.claude/skills/subagent-driven-development/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You need to implement the "entire notice CRUD feature" for a "Student Club Notice Board" project based on Next.js 15 + TypeScript. An implementation plan has already been written with the writing-plans skill.

### Preparation: Reviewing the Implementation Plan

```
[Implementation Plan: Notice CRUD Feature]
Phase 1 (Foundation):
  - Task 1.1: lib/schemas/notice.ts - Zod schema definition
  - Task 1.2: prisma/schema.prisma - Add Notice model

Phase 2 (Can run independently):
  - Task 2.1: app/api/notices/route.ts - GET/POST implementation
  - Task 2.2: app/api/notices/[id]/route.ts - PATCH/DELETE implementation
  - Task 2.3: components/NoticeForm.tsx - Form component

Phase 3 (Integration):
  - Task 3.1: app/notices/page.tsx - List page
  - Task 3.2: app/notices/new/page.tsx - Create page
  - Task 3.3: app/notices/[id]/edit/page.tsx - Edit page
```

### Running Subagent-Driven Development

```
> Run the above implementation plan using the subagent-driven-development skill.
  After Phase 1 is complete, run Phase 2 in parallel, then run Phase 3 after Phase 2 completes.
```

Orchestrator's progress control:

```
[Orchestrator Progress]

✓ Task 1.1 complete: lib/schemas/notice.ts created
✓ Task 1.2 complete: prisma/schema.prisma Notice model added
  → Phase 1 complete. Starting Phase 2 in parallel.

⚡ Task 2.1 running: app/api/notices/route.ts
⚡ Task 2.2 running: app/api/notices/[id]/route.ts
⚡ Task 2.3 running: components/NoticeForm.tsx
  → All Phase 2 complete. Starting Phase 3.

⚡ Task 3.1 running: app/notices/page.tsx
...
```

### Examples of Each Subagent's Output

**Task 2.1 subagent output:**

```ts
// app/api/notices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createNoticeSchema } from "@/lib/schemas/notice";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));

  const [notices, total] = await Promise.all([
    db.notice.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, author: { select: { name: true } } },
    }),
    db.notice.count(),
  ]);

  return NextResponse.json({ notices, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createNoticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const notice = await db.notice.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return NextResponse.json(notice, { status: 201 });
}
```

**Task 2.3 subagent output:**

```tsx
// components/NoticeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoticeSchema, type CreateNoticeInput } from "@/lib/schemas/notice";

interface NoticeFormProps {
  onSubmit: (data: CreateNoticeInput) => Promise<void>;
  defaultValues?: Partial<CreateNoticeInput>;
}

export function NoticeForm({ onSubmit, defaultValues }: NoticeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoticeInput>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter notice title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="body"
          {...register("body")}
          rows={8}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter notice content"
        />
        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Post Notice"}
      </button>
    </form>
  );
}
```

### Handling Partial Failures

The orchestrator handles even if one subagent fails:

```
[Orchestrator Decision]
Task 2.2 failed: app/api/notices/[id]/route.ts
  → Cause: Prisma type error (id is not a string)
  → Tasks 2.1 and 2.3 are unaffected. Continue.
  → Retry Task 2.2: Add string conversion for id type
```

## Learning Points / Common Pitfalls

- **Plan first**: Subagent-driven development starts with a plan already in place. Keep the order: first create an implementation plan with the writing-plans skill, then execute it with this skill.
- **Trust the orchestrator but verify results**: Even though the orchestrator tracks progress and handles failures, after all subagent work is done, run `pnpm build` and type checking yourself to confirm the integration is correct.
- **Combination with Next.js 15 App Router**: App Router's file-based routing naturally divides tasks by file unit. Clearly specifying the file scope each subagent is responsible for minimizes conflicts.
- **Common pitfall — unclear task boundaries**: If you request vaguely like "implement the notice feature," the orchestrator can't properly define task boundaries either. Tasks must be listed clearly like "Task 1: create lib/schemas/notice.ts, Task 2: ..." for subagents to behave predictably.
- **Difference from Dispatching Parallel Agents**: This skill logically divides roles within the current session, while dispatching-parallel-agents dispatches separate agents externally. In practice, these two skills are often combined.

## Related Resources

- [dispatching-parallel-agents](./dispatching-parallel-agents.md) — External agent dispatch pattern
- [using-git-worktrees](./using-git-worktrees.md) — Isolated workspace per agent
- [writing-plans](./writing-plans.md) — Implementation plan writing skill

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
