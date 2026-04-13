---
title: "Performance Regression Detection (Benchmark)"
source: "~/.claude/skills/benchmark/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["benchmark", "performance", "Core Web Vitals", "Lighthouse", "bundle size", "gstack"]
category: "Browser/QA"
---

# Performance Regression Detection (Benchmark)

## Core Concepts / How It Works

### Establishing a Performance Baseline

The Benchmark skill first measures the current state of performance and saves it as a **baseline**. Without a baseline, there's no way to judge whether something is "faster" or "slower." Typical measurement targets include:

- **Page load time**: Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP)
- **Core Web Vitals**: LCP / FID (Interaction to Next Paint, INP) / CLS
- **Resource size**: Total bundle JS, CSS, images, and fonts
- **Lighthouse score**: Performance / Accessibility / Best Practices / SEO

### When to Use

- When you wonder "why is this page so slow?"
- When you want to verify the performance impact of a PR in numbers before merging
- When you want to regularly track Lighthouse scores and Core Web Vitals like LCP, FID, and CLS
- When monitoring whether bundle size is silently growing with each deployment
- When you receive tasks containing keywords like "performance", "benchmark", "page speed", "lighthouse", "web vitals", "bundle size", "load time"

### Browse Daemon Integration

This skill uses a **Browse daemon** internally. The Browse daemon controls a headless browser to simulate a real user environment and collects screenshots and performance metrics. Measurements can be automated via CLI commands or WebSocket messages.

### Per-PR Comparison (Before/After)

Once you have a baseline, you can run the same measurements again each time a PR branch is deployed and **output a diff table of numerical changes**. For example, if LCP increases from 1.8s to 2.4s, a regression is flagged for that PR.

### Trend Tracking

Beyond single comparisons, storing measurement history as a time series lets you see which commit caused a performance drop on a graph. Integrating into a CI pipeline enables continuous monitoring of main branch performance trends.

## One-Line Summary

A skill that uses the Browse daemon to **establish performance baselines** (page load time, Core Web Vitals, bundle size, etc.) and **automatically detect performance regressions by comparing before/after for each PR**.

## Getting Started

```bash
/benchmark
```

**SKILL.md file location**: `~/.claude/skills/benchmark/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: Club members have reported that the notice list page (`/notices`) of a "Student Club Notice Board" built with Next.js 15 + TypeScript feels slower after deployment. You need to identify which PR caused it.

### Step 1 — Measuring the Baseline

```bash
# In a Claude Code session
> Use the benchmark skill to measure the current performance baseline of the /notices page
```

Claude starts the Browse daemon and returns measurements like this:

```
[Benchmark] Baseline established: /notices
┌─────────────────────┬──────────┐
│ Metric              │ Current  │
├─────────────────────┼──────────┤
│ TTFB                │ 312 ms   │
│ FCP                 │ 890 ms   │
│ LCP                 │ 1 820 ms │
│ CLS                 │ 0.04     │
│ JS bundle (gzipped) │ 142 KB   │
│ Lighthouse Perf     │ 78       │
└─────────────────────┴──────────┘
Baseline saved → .benchmark/baseline-notices.json
```

### Step 2 — Checking Out the Suspect PR and Comparing

```bash
git checkout feature/add-realtime-notifications
pnpm build && pnpm start &
# In a Claude Code session
> Compare the branch I just built with the baseline
```

```
[Benchmark] Comparison result: /notices (baseline vs feature/add-realtime-notifications)
┌─────────────────────┬──────────┬──────────┬──────────────────────┐
│ Metric              │ baseline │ PR       │ Change               │
├─────────────────────┼──────────┼──────────┼──────────────────────┤
│ LCP                 │ 1 820 ms │ 2 490 ms │ +37% ⚠ Regression    │
│ JS bundle (gzipped) │ 142 KB   │ 218 KB   │ +53% ⚠ Critical      │
│ Lighthouse Perf     │ 78       │ 61       │ -17 pts ⚠ Regression │
└─────────────────────┴──────────┴──────────┴──────────────────────┘
Suspected cause: socket.io-client (76 KB) included in bundle — needs investigation
```

### Step 3 — Code Fix and Improvement

```ts
// app/notices/page.tsx — Remove unnecessary client-side import in Server Component
// Before: socket client imported in a server component
// After: split with dynamic import + ssr: false

import dynamic from 'next/dynamic'

// Socket connection only needed on client → code splitting
const RealtimeNotifier = dynamic(
  () => import('@/components/RealtimeNotifier'),
  { ssr: false }
)

export default async function NoticesPage() {
  const notices = await fetchNotices() // fetch initial data on server
  return (
    <>
      <NoticeList notices={notices} />
      <RealtimeNotifier />  {/* client-only, bundle separated */}
    </>
  )
}
```

## Learning Points / Common Pitfalls

- **"Gut feel" must be converted to numbers before discussion is possible**: If a club member says "it's slow" but you don't know what the LCP is in ms, you can't verify whether it's improved. Benchmark is the first step in converting subjective feedback into objective data.
- **Common mistake — measuring only in development environment**: HMR mode in `pnpm dev` doesn't apply production bundle optimizations, distorting measurements. Always measure using `pnpm build && pnpm start` (or a staging URL).
- **Next.js 15 tip — `next/bundle-analyzer`**: When a bundle size regression is detected, immediately run `ANALYZE=true pnpm build` to visually identify which package grew.
- **CI integration tip**: Running Benchmark for every PR in GitHub Actions and marking the PR check as failed when LCP exceeds +20% ensures performance regressions aren't missed by humans.
- **Core Web Vitals thresholds**: By Google's standard, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 is "Good." Using these numbers as thresholds makes pass/fail judgments clear.

## Related Resources

- [browse](./browse.md) — Quick browser validation for a single scenario (the engine behind Benchmark)
- [qa](./qa.md) — Full site quality scoring
- [canary](./canary.md) — Real-time post-deployment performance regression detection

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
