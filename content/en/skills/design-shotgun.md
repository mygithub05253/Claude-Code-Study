---
title: "Design Multiple Variant Exploration (Design Shotgun)"
source: "~/.claude/skills/design-shotgun/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["design-shotgun", "design exploration", "variants", "UI", "Tailwind"]
category: "Design"
---

# Design Multiple Variant Exploration (Design Shotgun)

## Core Concepts

### What Is the Shotgun Approach?

The "shotgun approach" is a strategy that fires broadly in multiple directions simultaneously rather than digging deep into a single solution, finding the direction that resonates most. Applying this to design exploration offers the following benefits:

- Avoids getting stuck on the first idea (prevents fixation)
- Even when "good design" is difficult to describe in words, you can see and choose
- Trade-offs between variants can be compared visually

### When to Use

- When the visual direction has not been decided yet, like "what should this UI look like? show me a few options"
- When you have wireframes but are dissatisfied with the actual design and want to explore again
- When you need to present options to teammates or professors saying "there's this feel and that feel"
- When planning a new feature's UI and wanting to quickly see visual drafts before implementation
- When requesting with keywords like "design variants", "explore designs", or "visual brainstorm"

Claude **proactively suggests** this skill when a user describes a UI feature but hasn't yet said how they want it to look.

### Skill Execution Flow

1. **Variant generation**: Claude generates multiple variants (usually 3–5) with different styles, layouts, and interactions for the same UI element.
2. **Comparison board**: Presents a comparison view where generated variants can be seen side by side.
3. **Structured feedback collection**: Collects feedback not just "like it or not" but dimension by dimension — color, layout, typography, interactions, etc.
4. **Iterative refinement**: Converges in the selected direction by incorporating feedback.

### Relationship with the design-html Skill

While the `design-html` skill is a tool for concretizing a single design into HTML, `design-shotgun` is a tool for exploring "which design direction to take" in the preceding stage. The typical flow is:

```
design-shotgun → direction selection → design-html → implementation
```

## One-Line Summary

An exploration skill that **simultaneously generates multiple design variants** for a single UI element, opens a comparison board to collect structured feedback, and iteratively refines toward a direction — starting from "I don't know yet what design I want" to quickly finding direction.

## Getting Started

```bash
/design-shotgun
```

**SKILL.md file location**: `~/.claude/skills/design-shotgun/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: You need to create a new Notice Card component for a Student Club Notice Board Next.js 15 + TypeScript project. You have no idea what style to go with, so you want to explore multiple variants first.

### Step 1: Request Design Variants

```
> Show me 3 different styles for the notice card component of the student club notice board.
  - Information: title, author, date, view count, important notice badge
  - Style direction: clean university club app feel
```

Example of 3 variants Claude generates:

**Variant A — Minimal Card**
```tsx
// Variant A: borderless minimal list style
function NoticeCardA({ notice }: { notice: Notice }) {
  return (
    <div className="py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {notice.isPinned && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Important
          </span>
        )}
        <h3 className="font-medium text-gray-900 text-sm">{notice.title}</h3>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>{notice.author}</span>
        <span>{notice.createdAt}</span>
        <span>Views {notice.viewCount}</span>
      </div>
    </div>
  );
}
```

**Variant B — Elevated Card**
```tsx
// Variant B: card grid with shadow
function NoticeCardB({ notice }: { notice: Notice }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {notice.isPinned && (
        <div className="flex items-center gap-1.5 text-amber-600 mb-3">
          <PinIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Important Notice</span>
        </div>
      )}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {notice.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Avatar size="xs" name={notice.author} />
          <span>{notice.author}</span>
        </div>
        <span>{notice.createdAt}</span>
      </div>
    </div>
  );
}
```

**Variant C — Colorful Tag**
```tsx
// Variant C: category color distinction emphasis
function NoticeCardC({ notice }: { notice: Notice }) {
  const categoryColor = {
    general: "bg-gray-100 text-gray-700",
    event: "bg-purple-100 text-purple-700",
    urgent: "bg-red-100 text-red-700",
  }[notice.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="flex gap-3 py-3 border-b border-gray-50">
      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full h-fit ${categoryColor}`}>
        {notice.categoryLabel}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{notice.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {notice.author} · {notice.createdAt}
        </p>
      </div>
    </div>
  );
}
```

### Step 2: Structured Feedback Collection

Feedback questions Claude presents:

```
Please share your preferences for each item below:
1. Layout: A (list) / B (card grid) / C (inline tag)
2. Density: information packed densely / with generous spacing
3. Important notice emphasis: color badge / pin icon / color distinction
4. Overall tone: clean minimal / with depth / colorful
```

### Step 3: Direction Convergence and Iteration

```
> Take variant B's card form as the base, mix in variant A's minimal typography style.
  For important notices, differentiate by color like C but not overpowering.
```

## Learning Points / Common Pitfalls

- **"Perfect design from the start" is a waste of time**: The design shotgun approach is a strategy for "locking in direction with minimum time". Time spent seeing and choosing multiple variants is far less than time spent deliberating.
- **Use in team presentations**: Asking teammates "which do you prefer, option A or option B?" gets much more productive feedback than vaguely asking "what should we do with the UI?" Having concrete options is more effective.
- **Well-suited for Tailwind CSS variant exploration**: Tailwind's class-based styling lets you quickly create variants of the same component by just changing class combinations. Design Shotgun makes maximum use of this characteristic.
- **Common pitfall — Variants that are too similar**: If 3 variants are essentially the same layout with only different colors, the exploration is meaningless. Initially, intentionally set different layout directions (list vs card grid), information density (concise vs detailed), and emphasis methods (color vs size vs position) to request sufficiently differentiated variants.
- **Next.js 15 tip**: In Server Components, Tailwind or CSS Modules fit better with server-side rendering than CSS-in-JS (styled-components, etc.). Keep this in mind when implementing the variants explored with Design Shotgun.

## Related Resources

- [design-html](./design-html.md) — Final HTML implementation of the selected design (stage after Shotgun)
- [design-consultation](./design-consultation.md) — Establishing the overall design system
- [design-review](./design-review.md) — Visual quality review of a completed site

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
