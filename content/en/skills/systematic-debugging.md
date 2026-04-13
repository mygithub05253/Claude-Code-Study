---
title: "Systematic Debugging"
source: "~/.claude/skills/systematic-debugging/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:4c5294b035bc51b4f9c3c268f1d6acf6883cf2ef6547fe5a6fabd860967bcf20"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["debugging", "root-cause", "bug-fix", "quality", "iron-law"]
category: "Quality / Safety"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Systematic Debugging

## Core Concepts

The original's **Iron Law** is clear.

> **Make no fix until the root cause is confirmed.**

The 4 phases to uphold this:

1. **Phase 1 — Investigation**: Collect facts only. Error messages, stack traces, logs, reproduction steps, related commits, environment differences. No interpretation or hypotheses at this stage.
2. **Phase 2 — Pattern Analysis**: Find **recurring patterns** in the collected facts. "This error always occurs after X", "Only happens in state Y". This phase still involves interpretation, but forming hypotheses comes next.
3. **Phase 3 — Hypothesis & Testing**: List possible causes and write each hypothesis with a **verifiable procedure**. Verify one hypothesis at a time.
4. **Phase 4 — Implementation**: Fix one confirmed cause. No "fixing others just in case." One cause, one fix.

The temptation of bandaid fixes (covering with try/catch, `?? 0`, type casting, "just reload and it works") is almost always the **result of skipping Phases 1~3**.

This skill overlaps in content with the `investigate` skill. The difference is in emphasis — while `investigate` is a workflow skill used as an "entry point" in real situations, `systematic-debugging` is closer to a **textbook skill** that teaches the principles themselves.

## One-Line Summary

A debugging textbook skill that enforces **no fix before root cause is confirmed** across every bug/test failure/abnormal behavior, through a 4-phase process (Investigation → Pattern Analysis → Hypothesis/Testing → Implementation).

## Getting Started

```bash
/systematic-debugging
```

**SKILL.md location**: `~/.claude/skills/systematic-debugging/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: After deploying the Student Club Notice Board, there are reports that the list page sometimes appears as a blank screen. "It goes back to normal when you refresh," they say. It cannot be reproduced locally.

**Phase 1 — Investigation**

Fact collection checklist:

```
- Report times: 2026-04-05 10:13, 10:47, 14:22 (mainly during daytime)
- Browsers: mix of Chrome/Safari → not a browser issue
- Network tab: /notices response is 200 but body is "[]"
- Vercel logs: no separate error logs at those times
- DB query logs: normal response, returned 5 rows
- Recent commits: changed structure to create Supabase client directly in Server Component (3 days ago)
- Related files: app/notices/page.tsx, lib/supabase/server.ts
```

At this stage, do **not** write hypotheses like "hmm, is Supabase acting weird?". Collect facts only.

**Phase 2 — Pattern Analysis**

```
- Response is 200 but body is "[]" (not a network error)
- Data exists in DB (confirmed via direct query)
- → Pattern: "the server can see the DB, but the Next.js response contains an empty array"
- Reproduction: unrelated to time, browser, user. Only "intermittently"
- → Is Next.js's caching layer getting involved at certain times? Or Vercel's edge cache?
```

A pattern emerges: **response 200 + empty body + server code is normal**. This smells like a "cached empty response."

**Phase 3 — Hypothesis & Testing**

| # | Hypothesis | Verification Method |
|---|-----------|---------------------|
| H1 | Next.js `fetch` default cache cached an initial empty response | Add `cache: "no-store"` or `dynamic = "force-dynamic"` in `app/notices/page.tsx` and redeploy |
| H2 | Vercel Edge Network is serving a stale response | Check Edge Requests statistics in Vercel dashboard, verify cache hits at those times |
| H3 | Supabase client is sharing state between requests causing cookie entanglement | Dump Supabase session info in server logs |
| H4 | Old RSC payload cache from right after the first deploy remains empty | Check correlation between deploy time and report times |

**Phase 4 — Implementation**

Verify H1 and H2 first. Looking at the logs shows Edge Cache Hits in the first few minutes right after deployment, and exactly during that period the empty responses are occurring. **H1 confirmed as the cause.**

```ts
// Fix based on root cause
// app/notices/page.tsx
export const dynamic = "force-dynamic"; // or revalidate: 0

import { createClient } from "@/lib/supabase/server";

export default async function NoticesPage() {
  const supabase = createClient();
  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error; // do not hide the symptom

  return <NoticeList notices={notices ?? []} />;
}
```

**What a bandaid fix would have looked like**:

```ts
// app/notices/page.tsx
export default async function NoticesPage() {
  const data = await fetchNotices();
  if (data.length === 0) {
    // "It might be a cache issue, let's try again"
    return redirect("/notices?t=" + Date.now());
  }
  return <NoticeList notices={data} />;
}
```

This bandaid hides the symptom, but the same "empty response cache" issue will reappear in a different page later. If Phases 1~3 had been followed, there would be no reason to write code like this.

## Learning Points / Common Pitfalls

- **"No fix without root cause" is the hardest part**: In the reality of student assignments, "just get it working first" is tempting when a deadline is looming. But every time you give in to this temptation, the cost of bug management compounds.
- **Training to separate fact collection from interpretation**: The human brain wants to interpret simultaneously with observation. When "there's 'null' in the error message so let's add a null check" pops up, pause for a beat and first ask "why is it null?"
- **`investigate` vs `systematic-debugging`**: The two skills share the same philosophy. In practice, use `investigate` as the "entry point" and `systematic-debugging` as the "textbook." Experienced developers unconsciously run both as the same routine.
- **Next.js 15 tip**: App Router's cache layers (Full Route Cache, Data Cache, Router Cache) are a go-to cause of "intermittently empty response" type bugs. Systematically memorize the usage of `dynamic`, `revalidate`, `cache: "no-store"`.
- **Three smells of bandaid fixes**: (1) "Let's just do X for now and fix it later", (2) swallowing errors with `try/catch`, (3) "just avoid this part" — when any of these three comes to mind, go back to Phase 1.

## Related Resources

- [investigate](./investigate.md) — Real-world entry point debugging workflow
- [test-driven-development](./test-driven-development.md) — Prevent recurrence with bug reproduction tests
- [verification-before-completion](./verification-before-completion.md) — Verification before marking fix complete

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
