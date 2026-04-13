---
title: "Plan Design Review"
source: "~/.claude/skills/plan-design-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["planning", "design", "UI", "UX", "plan-review"]
category: "Planning/Design"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Plan Design Review

## Core Concepts / How It Works

### The 0–10 Design Dimension Scoring System

Plan Design Review classifies each design aspect of a plan as an independent dimension and scores it from 0 to 10. Along with the score, it clearly explains "what would it take to reach 10?" and then incorporates those improvements into the plan.

Key design dimensions evaluated:

| Dimension | Description | Common Issues |
|-----------|-------------|---------------|
| Information Hierarchy | Does the user's eye flow naturally? | All text the same size |
| Color System | Consistent palette with meaningful color use | Arbitrary color mixing |
| Spacing System | Consistent spacing based on 8px grid | Mixing p-3, p-4, p-5 |
| Interaction | Clear hover, focus, and active states | Buttons with no feedback |
| Accessibility | Color contrast, focus rings, screen reader support | Not meeting WCAG AA |
| Responsive | Mobile-tablet-desktop layout transitions | No mobile layout planned |
| Typography | Font size, line-height, and weight hierarchy | Mixed system fonts |

### Interactive Review Mode

Plan Design Review is not a one-way feedback report — it is an **interactive review, similar to CEO Review or Eng Review**. Claude provides scores, the user adds context, and Claude adjusts suggestions accordingly. If you share constraints like "we can't buy a font license," it will find the best solution within those constraints.

### Plan Design Review vs /design-review

| Item | Plan Design Review | /design-review |
|------|--------------------|----------------|
| Target | Design plan before implementation | A site already in production |
| Output | Revised plan document | Modified source code + commit |
| Timing | Before coding | Post-coding QA |
| Browser needed | No | Yes (screenshot) |

## One-Line Summary

An interactive plan review skill that evaluates UI/UX design **at the planning stage before implementation**, rating each design dimension from 0 to 10 and directly modifying the plan to reach a score of 10 — all through the eyes of a designer.

## Getting Started

```bash
/plan-design-review
```

**SKILL.md location**: `~/.claude/skills/plan-design-review/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: Before building a "Student Club Notice Board" with Next.js 15 + Tailwind CSS, a UI design plan has been written. Use Plan Design Review to raise the design quality before implementation.

### Step 1 — Initial UI Design Plan (Before Review)

```markdown
# Student Club Notice Board UI Plan

## Notice List Page
- Notice card list
- Write button (top right)
- Pagination

## Notice Card Component
- Title, author, date, category badge
- Pinned notices have a different background color

## Colors
- Primary: blue
- Badges: gray, red, green

## Fonts
- Use system default font
```

### Step 2 — Plan Design Review Request and Results

```bash
> Review the Student Club Notice Board UI plan below using the plan-design-review skill
```

```
[Plan Design Review] Review Results

Information Hierarchy:  5/10
Color System:           4/10
Spacing System:         3/10
Interaction:            4/10
Accessibility:          5/10
Responsive:             3/10
Typography:             4/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What it takes to reach 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Spacing System 3→10]
No spacing plan exists. Need to define an 8px grid system:
  xs: 4px  |  sm: 8px  |  md: 16px  |  lg: 24px  |  xl: 32px
  Card inner padding: md(16px), card gap: lg(24px), section gap: xl(32px)

[Color System 4→10]
"blue", "gray", "red" are too vague. A concrete palette is needed:
  primary:   #2563EB (Tailwind blue-600)
  neutral:   #6B7280 (Tailwind gray-500)
  danger:    #DC2626 (Tailwind red-600)
  success:   #16A34A (Tailwind green-600)
  + Adding dark mode token plan is recommended

[Responsive 3→10]
No mobile layout has been planned at all. The notice card on mobile should:
  - Use full width on a single row
  - Move date/category below the title
  - Minimum font size 16px (mobile readability)
```

### Step 3 — Revised UI Plan and Component Design

Component plan incorporating the Design Review results:

```typescript
// types/design-tokens.ts — Design token spec recommended by Design Review
export const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  colors: {
    primary: 'blue-600',    // #2563EB
    neutral: 'gray-500',   // #6B7280
    danger: 'red-600',     // #DC2626
    success: 'green-600',  // #16A34A
  },
} as const;
```

```tsx
// components/NoticeCard.tsx — Designed based on Plan Design Review
interface NoticeCardProps {
  title: string;
  author: string;
  date: string;
  category: 'GENERAL' | 'IMPORTANT' | 'EVENT';
  isPinned: boolean;
  preview: string;
}

// Apply design tokens, consider responsiveness, clarify interaction states
export function NoticeCard({ title, author, date, category, isPinned, preview }: NoticeCardProps) {
  return (
    // Spacing system: card inner md(p-4), card gap handled by parent space-y-6(lg)
    <article
      className={`
        rounded-xl border p-4
        ${isPinned
          ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
          : 'border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900'
        }
        shadow-none hover:shadow-md
        transition-shadow duration-150
        cursor-pointer
        focus-within:ring-2 focus-within:ring-blue-500
      `}
    >
      {/* Information hierarchy: title first → category → meta info → preview */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2">
          {title}
        </h2>
        <CategoryBadge category={category} />
      </div>

      {/* Typography: preview uses neutral-500 for visual hierarchy */}
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
        {preview}
      </p>

      {/* Meta info: lowest visual hierarchy */}
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
        <span>{author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={date}>{date}</time>
      </div>
    </article>
  );
}
```

## Learning Points / Common Pitfalls

- **Cost savings from pre-implementation review**: Realizing "there's no spacing system" after writing 100 lines of code costs more than 10x more to fix than defining design tokens at the planning stage. Plan Design Review helps with this upfront investment.
- **Common mistake — focusing only on colors**: Design reviews are often misunderstood as "are the colors pretty?" Plan Design Review covers 7 dimensions including spacing, typography, accessibility, and responsiveness in a balanced way.
- **Common mistake — deferring dark mode**: With Tailwind CSS, dark mode is easy to support using `dark:` classes. If you don't define `dark:` color tokens at the design stage, you'll have to rework every component later.
- **Next.js 15 tip — manage design tokens as CSS variables**: Managing design tokens as TypeScript constants alone can conflict with Tailwind's JIT. The recommended pattern in Next.js 15 is to define them as CSS variables in `globals.css` and reference them in `tailwind.config.ts`.
- **Distinction from `/design-review`**: Plan Design Review is a pre-implementation design review; `/design-review` is a post-implementation visual QA. Using both completes a full design quality loop of design → implement → verify.

## Related Resources

- [plan-ceo-review](./plan-ceo-review.md) — CEO perspective plan review
- [plan-eng-review](./plan-eng-review.md) — Engineering perspective plan review
- [design-review](./design-review.md) — Post-implementation visual QA

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
