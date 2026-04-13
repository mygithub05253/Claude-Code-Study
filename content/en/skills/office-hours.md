---
title: "YC Office Hours (Office Hours)"
source: "~/.claude/skills/office-hours/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["planning", "idea-validation", "brainstorming", "startup", "YC"]
category: "Planning/Design"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# YC Office Hours (Office Hours)

## Core Concepts / How It Works

### Two Modes

#### Startup Mode

Applies the **6 forced questions** famous in YC partner sessions with founders. These questions serve as a filter for converting "cool ideas" into "businesses that actually work."

| Question Frame | Purpose | Example |
|----------------|---------|---------|
| Demand Reality | "Are there people who actually want this right now?" | Did you ask 10 people? Did they say they'd pay for it? |
| Status Quo | "How are they doing it right now?" | Do they manage it in Excel? Share via KakaoTalk? |
| Desperate Specificity | "Who is the one person suffering the most?" | The club president who suffers most from managing notices |
| Narrowest Wedge | "What's the smallest problem MVP can solve?" | Notice upload only, member registration later |
| Observation | "Have you ever watched someone actually use this?" | Have you actually watched how a president posts notices? |
| Future-Fit | "Will this direction still be meaningful 3 years from now?" | What's the reason Slack/Discord won't replace it? |

#### Builder Mode

For side projects, hackathons, and open-source contexts focused on **learning, building, and sharing** rather than startup revenue — brainstorming proceeds using a design thinking approach.

1. **Empathize**: Articulate the user's (or your own) pain points concretely.
2. **Define**: Clarify the problem to be solved in a single sentence.
3. **Ideate**: Explore ideas broadly without constraints.
4. **Prototype**: Sketch the smallest possible implementation plan.
5. **Test**: Decide who to validate with and how.

At the end of the session, a **design document** is saved for use as input for subsequent `/plan-ceo-review` and `/plan-eng-review`.

### Integration with Plan Skills

```
office-hours (idea validation)
    ↓
plan-ceo-review (business viability review)
    ↓
plan-eng-review (technical feasibility review)
    ↓
executing-plans (actual implementation)
```

`office-hours` is the **first gate** in this pipeline. If an idea doesn't pass here, you can avoid wasting time in later stages.

## One-Line Summary

An idea validation skill operating in two modes — **Startup Mode** and **Builder Mode** — that either explores demand reality, status quo, and the narrowest wedge using sharp Y Combinator (YC) office hours-style questions, or brainstorms side projects, hackathons, and open-source ideas using design thinking and saves a design document.

## Getting Started

```bash
/office-hours
```

**SKILL.md file location**: `~/.claude/skills/office-hours/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: While developing the Student Club Notice Board project, an idea came up to add a "club member survey feature." Validation is needed before starting development.

### Scenario 1: Demand Validation in Startup Mode

```
> I'm thinking of adding a member survey feature to the club notice board.
  Can you do an office hours session on whether it's worth building?
```

YC-style forced questions Claude asks:

```
[Demand Reality]
Q: How do you currently conduct surveys in your club?
A: We post a Google Form link on KakaoTalk...

→ Insight: There's already a "working" solution in Google Forms.
  There needs to be a clear reason why the new feature is better than Google Forms.

[Desperate Specificity]
Q: Who suffers the most from the current survey approach?
A: The treasurer. They have to re-organize Google Form results in Excel...

→ Insight: The core pain is not "survey creation" but "results aggregation and management."
  Solving this might be more valuable.

[Narrowest Wedge]
Q: What's the smallest feature you can build as MVP?
A: Yes/No voting feature (attached to a notice)

→ Insight: Not a "full survey platform" but a single "notice approve/reject vote" as MVP.
  Verify demand with this first.
```

### Scenario 2: Exploring Hackathon Ideas in Builder Mode

```
> I want to build a "campus lost and found app" at next week's hackathon.
  Can you help me organize the idea in builder mode?
```

Design thinking session Claude conducts:

```
[Empathize]
What do you do when you lose something on campus?
- Handwritten notice on the student services board
- Everytime/KakaoTalk group chat announcement
- Just give up

[Define]
"The problem that when you lose or find something on campus,
 reporting, searching, and connecting doesn't happen quickly in one place"

[Ideate]
Idea list:
1. Lost item report with photo + location tag
2. AI image matching (photo of lost item vs. found item)
3. QR code lost item tag
4. Anonymous contact channel (without number exposure)
5. Campus zone lost item hotspot map

[Prototype — 24-hour hackathon MVP]
- Reuse notice board codebase (Next.js 15 + Supabase)
- Core: photo upload + location (building) selection + contact method (open chat link)
- Remove: AI image matching (insufficient time), QR tag (requires physical item)

[Test]
- Share link in campus KakaoTalk group chat on hackathon day
- Success if 5 people post actual items within 24 hours
```

### Saving Design Document and Subsequent Integration

```ts
// Example design document saved by office-hours (design-doc.md)

/*
# Lost and Found App — Design Document
Created: 2026-04-12

## Problem Definition
When something is lost or found on campus, reporting, searching, and
connecting doesn't happen quickly in one place.

## Core Users
Students who lost something (high urgency, want quick resolution)
Students who found something (important to reduce friction)

## MVP Features
1. Lost item report (photo, building/location, description, contact info)
2. Found item report (photo, description, contact info)
3. List + search (keyword, building filter)

## Tech Stack
- Next.js 15 App Router (reuse notice board code)
- Supabase (DB + Storage for photos)
- Tailwind CSS + shadcn/ui

## Next Steps
→ Review technical implementation plan with /plan-eng-review
*/
```

## Learning Points / Common Pitfalls

- **"Validating" an idea is different from "executing" it**: Many students start coding as soon as they have an idea. The Office Hours skill builds the habit of "asking first." According to YC statistics, many startups fail because they "built something nobody wanted."
- **"Narrowest wedge" is the key**: When deciding MVP scope, always ask yourself "can I make this even smaller?" It's better to complete "one approve/reject button on a notice" than to fail trying to build "an entire survey platform" in 24 hackathon hours.
- **The existence of Google Forms is also a good sign**: The existence of existing solutions (status quo) proves the problem is real. If you can explain why your solution is "10x better" than the existing approach, there's value in it.
- **Choosing Builder Mode vs. Startup Mode**: Start with Builder Mode for school projects or hackathons without a revenue model. If you aim for monetization, investment, or actual service launch, validate more sharply with Startup Mode.
- **Common pitfall — "My friends said it was good"**: Positive feedback from acquaintances is not evidence of demand. The Office Hours skill requires more concrete evidence like "willingness to pay," "current alternatives," and "who suffers the most."

## Related Resources

- [plan-ceo-review](./plan-ceo-review.md) — Plan review from a CEO perspective
- [plan-eng-review](./plan-eng-review.md) — Plan review from an engineering perspective
- [writing-plans](./writing-plans.md) — Writing implementation plans

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
