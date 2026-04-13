---
title: "CEO-Perspective Plan Review (Plan CEO Review)"
source: "~/.claude/skills/plan-ceo-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["planning", "plan review", "strategy", "scope setting"]
category: "Planning/Design"
license: "Commentary MIT, original reference only"
last_reviewed: "2026-04-12"
---

# CEO-Perspective Plan Review (Plan CEO Review)

## Core Concepts / How It Works

### 4 Review Modes

Plan CEO Review reviews a plan by selecting one of four modes depending on the situation.

**1. SCOPE EXPANSION**

Under the principle of "think 10x bigger," boldly expands the scope of the current plan. Discards all existing assumptions and first asks "what product would solve this problem best in an ideal world?" The small notice board could become a hub for the entire university's clubs.

**2. SELECTIVE EXPANSION**

Maintains the core scope but selectively adds only certain expansion items that greatly increase overall value. An approach like "it's hard to expand everything, but adding just this one thing makes it 10x better."

**3. HOLD SCOPE**

Keeps the current scope as-is and maximizes the execution quality of each detail. Focuses on how robustly each feature is implemented rather than the feature list itself.

**4. SCOPE REDUCTION**

Removes everything except the essence of the MVP. Asks "what is the single most important thing users want?" and boldly removes the remaining items to focus exclusively on that.

### The "10-star Product" Thinking Approach

The core question of CEO mode is not "how many points out of 10 is the current plan?" but **"what does a 10-point product look like?"** First define the ideal 10-point product, then revise the plan in the direction of closing the gap with the current plan.

### Challenge Premises

The most powerful tool in CEO-perspective review is questioning the premises of the current plan.

- "Why do we need to build this as a board?"
- "What users really want — is it to 'post' notices or to 'not miss' them?"
- "If solved through Slack/KakaoTalk integration, isn't the board unnecessary?"

Even if these questions feel uncomfortable, they must be asked before starting implementation.

## One-Line Summary

This is a strategic plan review skill that reviews a plan in CEO/founder mode to **redefine the problem itself, find a bigger-picture product, challenge premises, and boldly expand scope if a better product can be built**.

## Getting Started

```bash
/plan-ceo-review
```

**SKILL.md file location**: `~/.claude/skills/plan-ceo-review/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You have a plan to implement a "Student Club Notice Board" based on Next.js 15 + TypeScript. You plan to implement basic CRUD + authentication + file attachment features. Review this plan with Plan CEO Review.

### Step 1 — Request CEO Review

```bash
> Use the plan-ceo-review skill to review the following plan:
  - Student Club Notice Board (Next.js 15 + TypeScript)
  - Features: notice CRUD, login/logout, file attachments, comments
  - Users: 50 club members
  - Goal: Replace KakaoTalk group chat notices
```

### Step 2 — Example CEO Review Result (SCOPE EXPANSION mode)

```
[Plan CEO Review] SCOPE EXPANSION mode applied

Current plan: 8/10 points
Gap to 10-point product:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Challenge Premises
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: Why are you trying to "replace" KakaoTalk group chat?
→ Problem with KakaoTalk: notices get buried in messages and are hard to find
→ Actual need: "not missing" important notices
→ Implication: "KakaoTalk integration + notice archive" may be a better solution than replacement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10-point product concept
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: Notice board for one club
10-point: Hub for all university clubs
  - Club join/leave management
  - Event calendar + attendance check
  - Integrated management of recruitment announcements
  - KakaoTalk channel auto-integration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recommendation: SELECTIVE EXPANSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full expansion exceeds scope. Adding just this one thing triples the value:
  → "KakaoTalk notification integration" (Webhook)
  Auto-send to KakaoTalk when a notice is posted → maintain existing habits + searchable archive
```

### Step 3 — Reflect the Revised Plan

```typescript
// Plan before revision — NoticeService (CRUD only)
export class NoticeService {
  async create(dto: CreateNoticeDto): Promise<Notice> {
    return this.noticeRepository.save(dto);
  }
}

// Plan after revision — NoticeService (KakaoTalk notification added)
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly kakaoNotifier: KakaoNotifierService, // added
  ) {}

  async create(dto: CreateNoticeDto): Promise<Notice> {
    const notice = await this.noticeRepository.save(dto);
    // Key expansion suggested by CEO Review: KakaoTalk auto notification
    await this.kakaoNotifier.sendNotice(notice);
    return notice;
  }
}
```

```typescript
// app/api/notices/route.ts — Next.js 15 App Router
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notice = await noticeService.create(body);

  // Reflecting CEO Review suggestion: trigger KakaoTalk webhook
  await fetch(process.env.KAKAO_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `[Club Notice] ${notice.title}\n${notice.content.slice(0, 100)}...`,
    }),
  });

  return NextResponse.json(notice, { status: 201 });
}
```

## Learning Points / Common Pitfalls

- **"Even a plan already made can change its premises"**: Students tend to take the approach of "just implement it first and fix it later." CEO Review is a stage to validate direction before implementation, and the cost of correcting direction early is much lower than working hard in the wrong direction.
- **Common mistake — always expanding without choosing a mode**: The strength of CEO Review is choosing from 4 modes depending on the situation. If you always do SCOPE EXPANSION, you won't meet deadlines. If it's 3 days before the presentation, SCOPE REDUCTION is the best choice.
- **Common mistake — feeling uncomfortable with premise questions**: The question "why do we need to build this?" can feel rude. However, without this question, you can't know if you're solving the right problem. The premise challenges in CEO Review are not an attack but a tool to make the product better.
- **Next.js 15 tip — Server Actions and CEO Review**: When CEO Review suggests KakaoTalk notification integration, using Next.js 15's Server Actions allows calling the Webhook directly from the server without an API route, making the code cleaner.
- **Relationship with `/plan-eng-review` and `/plan-design-review`**: The three skills are three perspectives for plan review. Running them in the order CEO Review (direction/strategy) → Design Review (UX/visual) → Eng Review (implementation/architecture) is ideal.

## Related Resources

- [office-hours](./office-hours.md) — Idea validation (preceding step)
- [plan-design-review](./plan-design-review.md) — Plan review from a design perspective
- [plan-eng-review](./plan-eng-review.md) — Plan review from an engineering perspective

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original reference only |
| Translation Date | 2026-04-13 |
