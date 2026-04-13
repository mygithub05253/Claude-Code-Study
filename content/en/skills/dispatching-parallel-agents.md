---
title: "Dispatching Parallel Agents"
source: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["dispatching-parallel-agents", "parallel", "multi-agent", "subagent"]
category: "Agents"
---

# Dispatching Parallel Agents

## Core Concepts / How It Works

### Prerequisites for Parallelism

The Dispatching Parallel Agents skill is not simply "making multiple things happen at once." It requires **two conditions** to be satisfied for safe parallel execution.

1. **No Shared State**: If two agents modify the same file simultaneously, or change the same DB record at the same time, conflicts occur. Each task must deal with different files or independent data.

2. **No Sequential Dependency**: If task A's result becomes the input for task B, these two cannot be run in parallel. "Implement login feature → then implement protected routes that use login state" has sequential dependency and cannot be parallelized.

### When to Use

- When multiple features need to be implemented independently and order doesn't matter (e.g., signup page + notice list page + API route developed simultaneously)
- When multiple files need to be modified at once but don't depend on each other (e.g., refactoring component A + refactoring component B)
- When you want to quickly process many independent repetitive tasks like test writing, documentation, or translation
- When parallelizable task blocks have been identified in an implementation plan
- When breaking down large-scale work that would take too long if processed sequentially by a single agent

### Dispatch Pattern

The flow when dispatching agents is as follows:

```
[Orchestrator (Claude)]
       │
       ├── Agent A: implement notices/page.tsx
       ├── Agent B: implement notices/new/page.tsx
       └── Agent C: implement app/api/notices/route.ts
       │
       ▼
[Collect and Integrate Results]
```

The orchestrator (main Claude) assigns independent tasks to each agent, and integrates the results once all agents are complete. The agents don't communicate with each other — each processes only their assigned work.

### Integration with Git Worktrees

Parallel agents are often used together with **Git Worktrees**. When each agent works in a different worktree, parallel development is possible safely without file conflicts. Learning the using-git-worktrees skill first will help you use this pattern more effectively.

## One-Line Summary

A multi-agent pattern that distributes **2 or more independent tasks** with no shared state or sequential dependencies to multiple subagents simultaneously, reducing execution time.

## Getting Started

```bash
/dispatching-parallel-agents
```

**SKILL.md file location**: `~/.claude/skills/dispatching-parallel-agents/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You need to quickly complete the MVP of a "Student Club Notice Board" project based on Next.js 15 + TypeScript all at once. There are many features to implement, and they are each independent.

### Task Analysis: Determining Parallelizability

```
[Can be parallelized O]
- Notice list page (app/notices/page.tsx)
- Notice creation form component (components/NoticeForm.tsx)
- Notice list API route (app/api/notices/route.ts)
- Zod schema definition (lib/schemas/notice.ts)

[Cannot be parallelized X - has sequential dependency]
- Define notice DB schema → Notice CRUD API → Notice list page
  (schema must exist before API, API must exist before page)
```

### Dispatch Command Example

```
> The following 4 tasks are independent of each other.
  Use the dispatching-parallel-agents skill to process them simultaneously:

  1. app/notices/page.tsx: implement notice list page
     - Display notices in card format in reverse chronological order
     - Handle loading state (Suspense) and empty list state

  2. components/NoticeForm.tsx: implement notice creation/edit form component
     - React Hook Form + Zod validation
     - title (max 100 chars), body (max 5000 chars) fields

  3. app/api/notices/route.ts: implement GET/POST routes
     - GET: list retrieval (pagination)
     - POST: create new notice (authentication required)

  4. lib/schemas/notice.ts: define Zod schemas
     - CreateNoticeSchema, UpdateNoticeSchema
     - Export common types
```

### Code Each Agent Independently Generates

**Agent 1 output (app/notices/page.tsx):**

```tsx
import { Suspense } from "react";
import { NoticeList } from "@/components/NoticeList";
import { NoticeListSkeleton } from "@/components/NoticeListSkeleton";

export default function NoticesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Club Notices</h1>
      <Suspense fallback={<NoticeListSkeleton />}>
        <NoticeList />
      </Suspense>
    </main>
  );
}
```

**Agent 4 output (lib/schemas/notice.ts):**

```ts
import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "Please enter a title").max(100, "Title must be 100 characters or less"),
  body: z.string().min(1, "Please enter content").max(5000, "Content must be 5000 characters or less"),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
```

Since these two agents create different files, they can run simultaneously without conflicts.

### Integration Phase

Once all agents are complete, the orchestrator performs integration:

```
> All 4 agent tasks are done.
  Now connect NoticeForm to import the Zod schema from notice.ts,
  and verify there are no type mismatches.
```

## Learning Points / Common Pitfalls

- **"Independence check" is the key**: Before using parallel dispatch, always draw a dependency graph between tasks. Running tasks with dependencies in parallel can cause one agent's output to break another agent's work.
- **Don't forget the integration phase**: Files created in parallel exist like islands not connected to each other. The orchestrator must connect imports, align type consistency, and match naming conventions in the integration phase to make a complete feature.
- **Compatibility with Next.js 15 App Router**: In App Router, pages, layouts, API routes, Server Actions, and components are mostly managed as independent files. This structure itself is well-suited for parallel agents. On the other hand, if multiple agents modify a single file like `prisma/schema.prisma` simultaneously, conflicts will definitely occur.
- **Common mistake — shared configuration files**: Never modify configuration files like `tailwind.config.ts`, `tsconfig.json`, or `package.json` in parallel. Tasks requiring changes to these files must be processed sequentially.
- **Difference from Subagent-Driven Development**: This skill involves dispatching independent agents outside the current session. Running a plan within the current session is the subagent-driven-development skill.

## Related Resources

- [subagent-driven-development](./subagent-driven-development.md) — Subagent-based development within the session
- [using-git-worktrees](./using-git-worktrees.md) — Preventing file conflicts in parallel agents
- [checkpoint](./checkpoint.md) — Saving and resuming agent work state

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
