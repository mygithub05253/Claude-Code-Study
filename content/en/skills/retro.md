---
title: "Weekly Engineering Retrospective (Retro)"
source: "~/.claude/skills/retro/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["retrospective", "team-collaboration", "code-quality", "metrics", "sprint"]
category: "Meta"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Weekly Engineering Retrospective (Retro)

## Core Concepts / How It Works

The Retro skill analyzes the past week across three axes.

### 1. Commit History Analysis (What We Shipped)

- List of PRs merged this week, and the change volume (file count, line count) for each
- Ratio of feature additions, bug fixes, refactoring, documentation, and tests
- Deployed features that directly affect users vs. internal improvements

### 2. Work Pattern Analysis (How We Worked)

- Most frequently modified files/modules: hotspots where technical debt accumulates
- Commit time distribution: late-night work is a burnout signal
- PR cycle time: time elapsed from PR open to merge

### 3. Code Quality Trends (Quality Metrics)

- Increase/decrease in type errors and lint warnings
- Changes in test coverage
- Increase/decrease in code complexity (function size, nesting depth)

### Team Awareness

Team member contributions are broken down individually, with two perspectives covered in balance:

- **Praise**: What went well this week, contributions to the team, difficult problems solved
- **Growth Areas**: Things that would be good to improve going forward, framed as development direction rather than criticism

The retrospective history accumulates continuously, enabling **trend tracking**. Insights like "test coverage has been declining for the past 3 weeks" are invisible from short-term retrospectives alone.

## One-Line Summary

A **weekly engineering retrospective** skill that analyzes commit history, work patterns, and code quality metrics over a week (or sprint), and summarizes each team member's contributions as praise and growth areas.

## Getting Started

```bash
/retro
```

**SKILL.md location**: `~/.claude/skills/retro/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: A 3-person team (team lead Minjun, frontend Seoyeon, backend Dohyeon) working on a Next.js 15 + TypeScript "Student Club Notice Board" project. The sprint ends Thursday night and the retrospective is held Friday morning.

```bash
# In a Claude Code session
> Run a retro for this week (2026-04-06 ~ 2026-04-12) using the retro skill.
> Team members: Minjun (minjun), Seoyeon (seoyeon), Dohyeon (dohyeon)
```

**Example retro output**

```markdown
# Weekly Engineering Retrospective (2026-04-06 ~ 2026-04-12)

## What We Shipped
- **feat: notice creation feature** (PR #15, Seoyeon) — 12 files, +340/-28 lines
- **feat: notice detail page** (PR #16, Minjun) — 8 files, +210/-5 lines
- **fix: mobile layout broken** (PR #17, Seoyeon) — 2 files, +15/-8 lines
- **feat: Supabase RLS policy setup** (PR #18, Dohyeon) — 3 files, +90/-0 lines
- **chore: pnpm dependency update** (PR #19, Minjun) — 1 file, +5/-5 lines

Features 60% / Bug fixes 20% / Configuration 20% — healthy ratio

## Work Patterns
- Hotspot: `app/notices/` (68% of all commits this week)
  → Normal as notice features are in active development. However, component sizes
    in this folder are growing, so consider splitting them next week.
- Commit time distribution: Dohyeon concentrated 22:00–01:00 (watch for burnout)
- Average PR cycle time: 14 hours (target: under 8 hours)

## Code Quality
- TypeScript errors: 0 maintained ✅
- ESLint warnings: 3 → 1 (improved) ✅
- Test coverage: 42% → 38% (caution) ⚠️
  → Notice creation Server Action has no tests

## Individual Contributions

### Seoyeon (Frontend)
**Praise**: Implemented the notice creation form cleanly with React Hook Form + Zod,
and the error message UX is intuitive. Great work fixing the mobile bug quickly too.
**Growth Area**: NoticeForm component (240 lines) is growing.
Consider extracting the form logic into a Custom Hook next time.
```

**Example retro history trend (3-week accumulation)**

```typescript
// Example of managing retro history as JSON (retro-history.json)
interface RetroWeek {
  week: string; // "2026-W15"
  testCoverage: number;
  lintWarnings: number;
  avgPrCycleHours: number;
  prCount: number;
}

const history: RetroWeek[] = [
  { week: "2026-W13", testCoverage: 52, lintWarnings: 5, avgPrCycleHours: 18, prCount: 3 },
  { week: "2026-W14", testCoverage: 42, lintWarnings: 3, avgPrCycleHours: 14, prCount: 5 },
  { week: "2026-W15", testCoverage: 38, lintWarnings: 1, avgPrCycleHours: 14, prCount: 5 },
];

// Trend: lint warnings are improving, but test coverage has been declining for 3 consecutive weeks
// → Top priority for next week: add tests
```

## Learning Points / Common Pitfalls

- **Retrospectives are not about assigning blame**: It's not "why did Dohyeon work late?" but rather "if the late-night work pattern continues, there's a risk of burnout." The tone of a retrospective must always be aimed at growth for the entire team.
- **Numbers need context**: Test coverage at 38% could be good or bad. You need to consider whether it's "temporarily low due to a notice feature development sprint" or "a continuing downward trend."
- **Common mistake — skipping the retrospective**: The busier you are, the more likely retrospectives get skipped. But running hard in the wrong direction leads to wasting far more time later. A 30-minute retro can save 2–3 hours the following week.
- **Next.js 15 tip**: Adding Next.js-specific metrics like `generateStaticParams`, Server Action, and Server Component ratios to the retro items lets you periodically verify that the framework is being used correctly.
- **gstack ecosystem tip**: The retro skill works with the `health` skill for more precise tracking of code quality trends. It is recommended to take a snapshot of the current state with the `health` skill before running a retrospective.

## Related Resources

- [learn](./learn.md) — Project learning management (session continuity)
- [health](./health.md) — Codebase health check
- [verification-before-completion](./verification-before-completion.md) — Pre-completion verification

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
