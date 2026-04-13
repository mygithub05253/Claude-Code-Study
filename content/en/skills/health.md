---
title: "Code Quality Dashboard (Health)"
source: "~/.claude/skills/health/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["health", "code quality", "dashboard", "tsc", "eslint", "vitest", "knip"]
category: "Meta"
---

# Code Quality Dashboard (Health)

## Core Concepts

### Tools That Are Executed

The Health skill **auto-detects** tools present in the project and runs them. It skips tools that are absent and only runs what is available.

| Tool Category | Example Tools | Weight |
|---|---|---|
| Type checker | `tsc --noEmit` | 30% |
| Linter | `eslint`, `biome` | 25% |
| Test runner | `vitest`, `jest` | 25% |
| Unused code detection | `knip`, `ts-prune` | 10% |
| Shell linter | `shellcheck` | 10% |

### When to Use

- When you want to quickly understand "how healthy is the codebase right now?"
- When you want to see a comprehensive status with **a single command** instead of running individual tools (tsc, eslint, vitest, etc.) one by one
- Before starting new feature development, to assess current technical debt level and set priorities
- When tracking code quality trends alongside weekly retrospectives
- When asking Claude with expressions like "health check", "code quality", "quality score", or "run all checks"

### Score Calculation Method

Each tool's result is normalized to a 0–10 scale, then a weighted average is calculated for the overall score.

```
Overall score = Σ(tool score × weight)

Example:
- tsc: 0 errors → 10 × 0.30 = 3.0
- eslint: 2 warnings → 8 × 0.25 = 2.0
- vitest: 65% coverage → 6.5 × 0.25 = 1.625
- knip: 3 unused → 7 × 0.10 = 0.7
- shellcheck: N/A → excluded (remaining weights redistributed)
Overall: ~8.2
```

### Trend Tracking

Scores are saved with timestamps in `.health-history.json` (or a similar file). This allows tracking questions like "has the number of type errors decreased compared to 3 weeks ago?" and "did test coverage drop right before deployment?"

## One-Line Summary

A code quality dashboard skill that runs type checkers, linters, test runners, unused code detectors, and shell linters already in the project all at once, providing a **weighted 0–10 overall score** and time-based trends.

## Getting Started

```bash
/health
```

**SKILL.md file location**: `~/.claude/skills/health/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: Next.js 15 + TypeScript "Student Club Notice Board" project. You developed the notice features quickly and started feeling uneasy about code quality. Run the health skill before the weekly retrospective.

```bash
# In a Claude Code session
> Use the health skill to check current code quality
```

**Commands the health skill runs**

```bash
# Type checker
pnpm tsc --noEmit

# Linter
pnpm eslint . --max-warnings 0

# Tests (with coverage)
pnpm vitest run --coverage

# Unused code detection
pnpm knip
```

**Example output**

```
╔══════════════════════════════════════════════════════╗
║       Code Quality Dashboard — 2026-04-12            ║
╠══════════════════════════════════════════════════════╣
║ Overall score:  7.4 / 10.0   (last week: 6.9 ↑ +0.5) ║
╠══════════════════════════════════════════════════════╣
║ tsc          10.0      0 errors                      ║
║ eslint        8.0      2 warnings                    ║
║ vitest        6.0      coverage 38% (target: 70%)    ║
║ knip          7.0      3 unused exports              ║
║ shellcheck    N/A  --  no shell scripts              ║
╠══════════════════════════════════════════════════════╣
║ Trend (last 3 weeks)                                 ║
║   W13: 6.2  W14: 6.9  W15: 7.4                      ║
╚══════════════════════════════════════════════════════╝

Improvement priorities
1. [High] vitest coverage 38% → target 70%
   Uncovered core file: app/notices/create/actions.ts
2. [Medium] eslint 2 warnings
   - no-unused-vars: NoticeList.tsx:34
   - @typescript-eslint/no-floating-promises: page.tsx:12
3. [Low] knip 3 unused exports
   - lib/utils/formatDate.ts: formatRelativeDate
   - types/notice.ts: NoticeStatus (recommend marking as deprecated)
```

**Project configuration example (`package.json` scripts)**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "check:unused": "knip",
    "health": "pnpm type-check && pnpm lint && pnpm test:coverage && pnpm check:unused"
  }
}
```

**ESLint warning fix examples**

```typescript
// Warning 1: no-unused-vars
// NoticeList.tsx:34
const NoticeList = ({ notices, onDelete }: NoticeListProps) => {
  // onDelete is defined but not used inside the component
  return <ul>{notices.map(n => <NoticeItem key={n.id} notice={n} />)}</ul>;
};

// Fix: actually use it or remove from props
const NoticeList = ({ notices }: Pick<NoticeListProps, "notices">) => {
  return <ul>{notices.map(n => <NoticeItem key={n.id} notice={n} />)}</ul>;
};

// Warning 2: @typescript-eslint/no-floating-promises
// page.tsx:12 — calling a Promise without await
prefetchNotices(); // ← Calling Promise as fire-and-forget, not catching errors

// Fix: explicitly mark with void or use await
void prefetchNotices(); // explicitly indicates intentional fire-and-forget
```

**Trend history storage example**

```typescript
// .health-history.json (auto-generated, recommended to commit to git)
interface HealthSnapshot {
  date: string;       // "2026-04-12"
  score: number;      // 7.4
  tsc: number | null; // 10.0
  eslint: number | null; // 8.0
  vitest: number | null; // 6.0
  knip: number | null;   // 7.0
  shellcheck: number | null; // null
}
```

## Learning Points / Common Pitfalls

- **The overall score is a compass, not a destination**: A perfect 10 is not the goal — a declining trend is a signal that "something is going wrong". Even a score of 7, if maintained consistently or rising, indicates a healthy state.
- **Adjust weights to suit the project's nature**: For projects where type safety is critical, raise the tsc weight; for projects where user-facing features are critical, raise the test weight. Don't blindly follow the defaults.
- **Common mistake — Score gaming**: Actions like renaming unused variables to `_` or intentionally skipping tests to raise the score are meaningless. The score shows whether the team is paying attention to code quality — it is not a game where you get rewarded for a high score.
- **Next.js 15 tip**: `tsc --noEmit` validates type safety of App Router, but some type errors in passing props between Server Components and Client Components may only appear at runtime. Even with a high health score, continue to directly test actual page behavior in parallel.
- **Integrate into CI**: Adding the `pnpm health` script to GitHub Actions automatically verifies that quality criteria are met on every PR. Consider a policy of blocking PR merges if the score drops below 7.

## Related Resources

- [canary](./canary.md) — Post-deployment runtime health check (complementary tool to Health)
- [cso](./cso.md) — Security audit (strengthens the security dimension of Health)
- [benchmark](./benchmark.md) — Performance measurement (extends the performance dimension of Health)

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
