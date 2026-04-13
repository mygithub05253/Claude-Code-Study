---
title: "Web App QA Testing + Auto-Fix (QA)"
source: "~/.claude/skills/qa/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["QA", "testing", "auto-fix", "health score", "gstack"]
category: "Quality/Safety"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# Web App QA Testing + Auto-Fix (QA)

## Core Concepts

### 3-Tier System

The QA skill is divided into three tiers based on inspection depth. Choosing the right tier saves time.

| Tier | Coverage | When to Use |
|------|----------|-----------|
| **Quick** | Critical + High severity bugs only | Fast smoke test, immediately after a hotfix |
| **Standard** | Quick + Medium severity bugs | After typical feature development completion |
| **Exhaustive** | Standard + Cosmetic issues | Final review before deployment, release preparation |

### Test-Fix-Commit Loop

The essence of the QA skill is not simply listing bugs, but automatically repeating the cycle of **discover a bug → fix → commit → re-verify**.

```
QA test run
  ├─ Bug found → severity classification
  ├─ Fix bugs in the selected tier (direct source code changes)
  ├─ Atomic commit ("fix: [bug description]")
  ├─ Re-verify (confirm bug is resolved)
  └─ Repeat for next bug
```

### Health Score

Before and after a QA run, the app's health score is calculated and quantified as improvement in the form "Before: 62% → After: 94%". This provides compelling evidence when submitting to professors or sharing with a team.

### Report-Only Mode

If you want a report without bug fixes, use `/qa-only` mode.

## One-Line Summary

An automated test-fix-commit skill that systematically tests a web application, fixes discovered bugs **one by one with atomic commits** directly in the source code, and repeats re-verification until done.

## Getting Started

```bash
/qa
```

**SKILL.md file location**: `~/.claude/skills/qa/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: You have completed initial feature implementation for a Next.js 15 + TypeScript "Student Club Notice Board" project. Notice listing, notice creation, and login/logout are supposedly working, but have never been properly tested. The presentation is in 3 days.

### Running Standard QA

```bash
# In a Claude Code session
> Use the QA skill to run a Standard tier test.
# or
> qa standard
> test this site
> find bugs and fix them
```

### Example of Claude's Work During QA

**Phase 1: Checking test items**

```
[QA - Standard] Starting Student Club Notice Board test

✅ Notice list page load (200 OK)
✅ Reading notices while logged out is possible
❌ Notice creation form — server error (500) when title is empty
❌ After login, redirect URL goes to / instead of /notices
⚠️ Notice list pagination — notices missing after page 2 (Medium)
```

**Phase 2: Bug fixes + atomic commits**

```ts
// Before: app/notices/new/route.ts
export async function POST(request: Request) {
  const { title, content } = await request.json()
  // No validation → causes 500
  await supabase.from('notices').insert({ title, content })
}

// After: validation added
export async function POST(request: Request) {
  const { title, content } = await request.json()

  // [QA Fix] Required title validation
  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: 'Please enter a title.' },
      { status: 400 }
    )
  }

  await supabase.from('notices').insert({ title: title.trim(), content })
  return NextResponse.json({ success: true })
}
```

```bash
# Auto-generated commit
git commit -m "fix: fix 500 error when notice title is empty — add validation"
```

**Phase 3: Final report**

```
[QA Complete] Health score: Before 61% → After 89%

Fixed (3 items):
  - fix: empty title 500 error → 400 + error message
  - fix: login redirect URL corrected to /notices
  - fix: pagination offset calculation bug fixed

Remaining (Exhaustive tier, not selected):
  - [Cosmetic] Notice card mobile padding inconsistency
  - [Cosmetic] Button color not supporting dark mode

Deployment readiness: ✅ Passed Standard criteria
```

## Learning Points / Common Pitfalls

- **Replaces "manual test checklists"**: Before QA skill, you had to open a browser and click through everything manually. QA skill structures and automates this process.
- **Importance of atomic commits**: When the rule of one bug = one commit is followed, it becomes easy to track "which commit fixed which bug" later. Also advantageous when using `git bisect` to find regressions.
- **Tier selection strategy**: When time is short, catch only critical bugs with Quick tier first, then finish with Exhaustive tier when time allows — this is the most efficient approach.
- **Common mistake**: "QA everything at once after building it all" is too late. Periodically running Standard tier per feature unit saves overall time.
- **Next.js 15 perspective tip**: Error handling in Server Actions, presence of `loading.tsx`/`error.tsx`, and cache invalidation (`revalidatePath`) omissions are Next.js-specific bug patterns that QA skill catches well. Exhaustive tier also detects minor issues like missing `<Suspense>` boundaries and hydration mismatches.

## Related Resources

- [qa-only](./qa-only.md) — Generate bug reports only, without fixes
- [setup-browser-cookies](./setup-browser-cookies.md) — QA preparation for pages requiring authentication
- [benchmark](./benchmark.md) — Performance measurement QA

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
