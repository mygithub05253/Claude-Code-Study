---
title: "Autoplan"
source: "~/.claude/skills/autoplan/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["autoplan", "planning", "review", "orchestrator", "gstack"]
category: "Planning/Design"
---

# Autoplan

## Core Concepts / How It Works

Autoplan is an **orchestrator** skill that reads three review skills (CEO review, design review, engineering review) from disk and runs them sequentially.

### When to Use

- When you already have a plan file and want to run the full review process in one go
- When running CEO (direction) / design (UX) / engineering (implementation) reviews separately feels tedious
- When you want to delegate with **"review it for me and just tell me the result"** rather than "please review"
- Immediately after finishing a plan file, to quickly check quality before full implementation
- When there are multiple approaches to choose from and you want to automatically narrow them down using defined criteria

### 6 Automatic Decision Principles

Principles Claude uses to make judgments on its own without asking mid-process questions.

1. **Simplicity-first**: If two approaches yield the same result, choose the simpler one.
2. **Scope discipline**: Features that are "nice to have" are excluded from MVP.
3. **Reuse patterns**: Prioritize patterns already existing in the codebase over new ones.
4. **Risk-minimizing**: Choose technology the team knows over unproven technology.
5. **Reversibility**: Do not automatically make hard-to-reverse decisions — escalate them to an approval gate.
6. **Intent-aligned**: Prioritize constraints the user has explicitly stated (deadlines, tech stack, etc.).

### Final Approval Gate

Items that are difficult to judge even with the automatic decision principles — **aesthetic taste decisions, borderline scope items, Codex opinion conflicts** — are collected and presented to the user all at once at the end. The key is not interrupting mid-process, but gathering everything at the end.

### Processing Flow

```
Load plan file
    → CEO review (direction, priority, business value)
    → Design review (UX, user flow, information architecture)
    → Engineering review (feasibility, technical debt, dependencies)
    → Apply 6-principle automatic decisions
    → Unresolved items collected at approval gate
    → User final approval
    → Output reviewed plan
```

## One-Line Summary

A **fully automated plan review pipeline** that runs CEO, design, and engineering review skills in sequence, makes judgments using 6 decision principles without 15–30 mid-process questions, and presents only the key choices to the user at the final approval gate.

## Getting Started

```bash
/autoplan
```

**SKILL.md location**: `~/.claude/skills/autoplan/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: You have already written an implementation plan (`plan.md`) for a "Student Club Notice Board" project with Next.js 15 + TypeScript. Running CEO, design, and engineering reviews separately would likely generate over 20 questions, so you want to process everything at once with autoplan.

```bash
# In a Claude Code session
> Run a full automatic review of plan.md with the autoplan skill.
```

Suppose the plan contains the following:

```markdown
<!-- Excerpt from plan.md -->
## Notice List Page
- Approach A: SSR rendering with server component
- Approach B: Client component + SWR real-time update

## Image Attachment Feature
- MVP inclusion pending decision
```

Examples of decisions Autoplan makes automatically:

```
[Auto Decision] Notice list rendering:
  → Choose Approach A (Simplicity-first + reuse existing Next.js SSR pattern)
  Reason: No real-time update requirements stated in the plan; SSR already proven by the team.

[Auto Decision] Image attachments:
  → Exclude from MVP (Scope discipline principle)
  Reason: Feature not listed in the MVP requirements.
```

Items presented to the user at the final approval gate are compressed as follows:

```
[Approval Gate — 3 items]

1. [Taste decision] Notice card design: list view vs. grid view (design review conflict)
2. [Borderline scope] Pinned notices (sticky posts): include or exclude from MVP?
3. [Codex conflict] Auth middleware: next-auth v5 vs. custom implementation (two reviewers disagree)
```

Answer just these three and the full review is complete.

```ts
// Example of refined structure after approval
// app/notices/page.tsx — SSR server component (reflecting auto decision)
export default async function NoticesPage() {
  const notices = await fetchNotices() // Server-side fetch
  return <NoticeList notices={notices} />
}
```

## Learning Points / Common Pitfalls

- **A tool to reduce "review fatigue"**: Answering 20 questions one by one makes it easy to lose context. Autoplan lets users focus only on items that genuinely require judgment, by specifying decision principles and delegating the rest.
- **Customize the 6 principles to fit your project**: The principles are not fixed. Adding team conventions like "our team only uses Prisma" improves the quality of automatic decisions.
- **Next.js 15 perspective**: Repetitive decisions like server vs. client component choice, App Router layout structure, and whether to add `loading.tsx`/`error.tsx` are perfectly suited for automation under the "Reuse patterns" principle.
- **Common mistake**: Autoplan is a tool for finishing reviews "faster," not for "skipping" reviews. Always verify the reasoning behind automatic decisions.
- **Plan file quality determines output quality**: The more ambiguous the plan, the weaker the automatic decision rationale and the more items appear at the approval gate. Refining the plan with the `writing-plans` skill first is the best way to maximize Autoplan's effectiveness.

## Related Resources

- [writing-plans](./writing-plans.md) — Plan writing skill (required before running Autoplan)
- [plan-ceo-review](./plan-ceo-review.md) — CEO-perspective plan review (called internally by Autoplan)
- [plan-design-review](./plan-design-review.md) — Design-perspective plan review

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
