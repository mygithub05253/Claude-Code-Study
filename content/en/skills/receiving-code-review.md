---
title: "Receiving Code Review"
source: "~/.claude/skills/receiving-code-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["code review", "collaboration", "feedback handling", "technical verification"]
category: "Code Review"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
---

# Receiving Code Review

## Core Concepts / How It Works

The core principle of receiving code review is **"technical rigor" over "performative agreement."**

Even if the reviewer is an authority figure, their suggestion can be wrong. Conversely, even if the reviewer is a junior, they can make sharp observations. The value of feedback depends not on the proposer's status but on **technical reasoning**.

This skill processes feedback in three steps.

### Step 1: Categorize Feedback

Divide received feedback into the following three categories.

- **Clear Wins**: Issues already known, type errors, convention violations, etc. Reflect these immediately.
- **Needs Discussion**: Design philosophy differences, suggestions with trade-offs, suggestions made without knowledge of project context. Discussion is needed before reflecting.
- **Technically Incorrect**: Suggestions that would introduce bugs, worsen performance, or break an intentional pattern. Politely push back.

### Step 2: Verify

Validate each piece of feedback with the following questions.

- "What behavior changes if I follow this suggestion?"
- "Is the change safe in all edge cases?"
- "Does the context the suggestion assumes match the actual codebase?"
- "Is the reviewer looking at the latest code, or are they suggesting based on an older version?"

### Step 3: Respond

- If you agree: After making the fix, specify "how it was reflected" in a comment.
- If you have questions: Ask what is unclear, quoting specific code.
- When pushing back: Without emotion, explain using technical grounds (test results, official documentation, code references).

## One-Line Summary

This skill, upon receiving code review feedback, **verifies technical accuracy and project context first instead of unconditional acceptance**, then decides whether to reflect the feedback.

## Getting Started

```bash
/receiving-code-review
```

**SKILL.md file location**: `~/.claude/skills/receiving-code-review/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You submitted a `NoticeCard` component PR for a "Student Club Notice Board" project based on Next.js 15 + TypeScript, and two review comments were added.

**Review Comment A (Clear Win)**

```typescript
// Code the reviewer pointed out: NoticeCard.tsx
// Current code
interface Props {
  data: any; // ← Reviewer: "Don't use any, define a type"
}

// After reflection
interface NoticeCardProps {
  data: {
    id: string;
    title: string;
    content: string;
    authorName: string;
    createdAt: Date;
    isPinned: boolean;
  };
}
```

Example response:
> You're right. Using `any` also violates the CLAUDE.md rule. I replaced it with a `NoticeCardProps` interface.

---

**Review Comment B (Technically Questionable)**

```typescript
// Code change suggested by reviewer
// Reviewer suggestion: "Since it's a Server Component, you can use async/await directly"
// Existing code (Client Component, using Zustand state)
"use client";
export function NoticeCard({ data }: NoticeCardProps) {
  const { selectedId, setSelected } = useNoticeStore();
  return (
    <div onClick={() => setSelected(data.id)}>
      {data.title}
    </div>
  );
}
```

Verification process:

```bash
# In Claude Code session
> This component uses a Zustand store so it needs to be a Client Component.
> Please verify if the suggestion "can be changed to Server Component" is technically correct.
```

Example pushback comment:
> This component uses `useNoticeStore()` (Zustand) and has a click event handler, so the `"use client"` directive is required. Converting to a Server Component would cause a runtime error. A design change to move the selection state to a URL parameter would be needed first, which is outside the scope of this PR. We can discuss it in the next PR.

## Learning Points / Common Pitfalls

- **"Thank you, I'll fix it" is not always the right response**: In student team projects, there is a tendency to reflexively accept reviews from seniors or professors. However, reflecting a wrong suggestion introduces bugs, and the responsibility for those bugs falls on the person who wrote the code.
- **Pushing back is not rudeness**: Sharing opinions politely with code evidence and official documentation is a core skill of collaboration. The format "I might be misunderstanding, but for X reason, Y behavior is expected in this part" is effective.
- **Common mistake — reviews based on outdated context**: Reviewers sometimes suggest based on a version before the PR. Always confirm "is this suggestion based on the current code?"
- **Next.js 15 tip**: In App Router, the boundary between Server Components and Client Components is a point where misunderstandings often occur in reviews. You should be able to clearly explain based on the presence of the `"use client"` directive, hook usage, and event handler presence.
- **Keep a feedback log**: Leaving a record in the PR comment thread of which feedback was reflected and why, and which was not reflected and why, improves the code review culture going forward.

## Related Resources

- [requesting-code-review](./requesting-code-review.md) — Code review request skill
- [review](./review.md) — Pre-PR self-review skill
- [codex](./codex.md) — Coding style guide

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
