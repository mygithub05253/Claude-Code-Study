---
title: "HTML/CSS Design Finalization (Design HTML)"
source: "~/.claude/skills/design-html/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["design-html", "HTML", "CSS", "responsive", "Tailwind", "production quality"]
category: "Design"
---

# HTML/CSS Design Finalization (Design HTML)

## Core Concepts / How It Works

### What Production-Quality HTML/CSS Means

Unlike a static mockup that merely "looks similar on screen," Design HTML guarantees the following properties.

1. **Text reflow**: Text flows naturally even as container width changes. No truncation via `overflow: hidden` or fixed heights.
2. **Dynamic height calculation**: Container height is automatically determined by content length. No pixel hardcoding — uses `min-height`, `auto`, flexbox, etc.
3. **Dynamic layout**: Implements responsive layout with grid and flexbox. No "magic numbers" that only break at specific screen sizes.

### When to Use

- When implementing an approved mockup from `/design-shotgun` as actual HTML
- When translating a plan reviewed by `/plan-ceo-review` or `/plan-design-review` into code
- When asked to build a UI page from a description alone
- When receiving requests like "convert this design to HTML," "implement this page," or "finalize this design"
- When moving from the planning stage (plan skills) to the implementation stage

### 30KB, No External Dependencies

The original skill is based on a lightweight CSS framework called Pretext. It generates HTML that works immediately in any environment, with less than 30KB of overhead and no external CDN dependencies.

In a Next.js 15 environment, this philosophy is realized through **Tailwind CSS JIT (Just-In-Time) compilation** + **CSS Modules**. Only classes actually used are included in the bundle, achieving a similar result.

### Smart API Routing

Design HTML automatically selects the optimal layout pattern based on the type of design input.

- List/feed → `grid` + `auto-rows`
- Form page → `flex column` + `gap`
- Dashboard → `grid` + mixed fixed/fluid columns
- Marketing landing → `section` stack + hero layout

## One-Line Summary

A skill that generates **production-quality HTML/CSS where text actually reflows and layouts behave dynamically**, based on approved mockups or plan documents, with 30KB overhead and no external dependencies.

## Getting Started

```bash
/design-html
```

**SKILL.md location**: `~/.claude/skills/design-html/SKILL.md`

To customize, copy and modify the SKILL.md content.

## Practical Example

**Scenario**: A mockup for the notice list page of the Student Club Notice Board was approved via `/design-shotgun`. Now it needs to be finalized as actual Next.js 15 components. Use the Design HTML skill to generate high-quality code.

### Step 1 — Request Implementation Based on Mockup

```bash
> Use the design-html skill to implement the following mockup as a Next.js 15 + Tailwind CSS component.
> - Notice card list (title, date, 2-line preview)
> - Top filter tabs (All / Urgent / General)
> - Pagination instead of infinite scroll
> - Mobile: 1 column, Tablet+: 2 columns
```

### Step 2 — Example of Generated Component

```tsx
// app/notices/page.tsx
// Design HTML: Student Club Notice Board — Notice List Page
// Responsive grid, guaranteed text reflow, dynamic card height

import { NoticeCard } from '@/components/NoticeCard'
import { NoticeFilter } from '@/components/NoticeFilter'
import { Pagination } from '@/components/Pagination'
import { fetchNotices } from '@/lib/notices'

interface NoticesPageProps {
  searchParams: { page?: string; type?: string }
}

export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const page = Number(searchParams.page ?? '1')
  const type = searchParams.type ?? 'all'

  const { notices, totalPages } = await fetchNotices({ page, type })

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Notices
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Check the latest club announcements
          </p>
        </header>

        {/* Filter tabs */}
        <NoticeFilter currentType={type} />

        {/* Notice grid — responsive, dynamic height */}
        <section
          className="
            mt-4
            grid gap-3
            grid-cols-1
            sm:grid-cols-2
          "
          aria-label="Notice list"
        >
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </section>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  )
}
```

```tsx
// components/NoticeCard.tsx
// Text reflow guaranteed: line-clamp only, no fixed height
// Dynamic height: card height is automatically determined by content

import Link from 'next/link'
import { formatKSTDate } from '@/lib/date'
import type { Notice } from '@/types/notice'

interface NoticeCardProps {
  notice: Notice
}

export function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <Link href={`/notices/${notice.id}`}>
      <article
        className="
          group
          flex flex-col gap-2
          rounded-xl
          bg-white dark:bg-neutral-800
          p-4
          border border-neutral-100 dark:border-neutral-700
          transition-all duration-150
          hover:shadow-md hover:border-primary/30
          cursor-pointer
        "
      >
        {/* Urgent badge — conditional render, no layout shift */}
        {notice.isUrgent && (
          <span className="self-start rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
            Urgent
          </span>
        )}

        {/* Title — show up to 2 lines, reflow guaranteed */}
        <h2 className="
          text-base font-semibold
          text-neutral-900 dark:text-white
          line-clamp-2
          group-hover:text-primary transition-colors duration-150
        ">
          {notice.title}
        </h2>

        {/* Preview — show up to 2 lines */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {notice.preview}
        </p>

        {/* Meta info — pinned to bottom (pushed down by flex grow) */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-neutral-400">
            {formatKSTDate(notice.createdAt)}
          </span>
          <span className="text-xs text-neutral-400">
            {notice.authorName}
          </span>
        </div>
      </article>
    </Link>
  )
}
```

## Learning Points / Common Pitfalls

- **`line-clamp` vs fixed height**: Fixing card height with pixels like `h-40` cuts off long titles. The core principle of Design HTML is to limit only the number of lines with `line-clamp-2` and leave height as `auto`.
- **Common mistake — overusing `overflow: hidden`**: When layouts look broken, many reach for `overflow-hidden` to hide the problem. This causes accessibility issues and content loss. The underlying layout structure needs to be fixed.
- **Next.js 15 tip — Server Component data fetch**: Keep `page.tsx` as a server component, and separate only components that need interaction, like filters, into `'use client'`. This pattern is optimal for both performance and SEO.
- **`mt-auto` pattern**: Using `mt-auto` inside a flex container to always pin bottom elements keeps the date/author at the same position regardless of card height variation.
- **URL parameter-based state**: Managing filter state via URL searchParams instead of `useState` makes back navigation/bookmarks/shared links all work correctly, and the server component can read initial state from the server.

## Related Resources

- [design-shotgun](./design-shotgun.md) — Explore design direction before implementation (step before Design HTML)
- [design-consultation](./design-consultation.md) — Establish overall design system (generates DESIGN.md)
- [design-review](./design-review.md) — Visual quality inspection after implementation is complete

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
