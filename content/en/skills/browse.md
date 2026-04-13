---
title: "Headless Browser Testing (Browse)"
source: "~/.claude/skills/browse/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["browse", "headless browser", "QA", "screenshot", "gstack"]
category: "Browser/QA"
---

# Headless Browser Testing (Browse)

## Core Concepts

The essence of the Browse skill is that Claude directly controls a **headless browser**. Unlike traditional Playwright/Puppeteer scripts, no test code needs to be written in advance — the browser is controlled through natural language commands.

### When to Use

- Right after deploying a new feature, when you want to visually verify "is it actually showing on screen correctly"
- When automatically testing interaction flows like form submissions, file uploads, and dialogs
- When checking that mobile/tablet responsive layouts are not broken
- When you've found a bug and want to create a bug report with reproduction steps and screenshots
- When you receive requests like "open it in a browser", "take a screenshot of the site", or "try this feature yourself"

### Key Features

- **Navigate**: Go to any URL, including SPA routing
- **Interact**: Click buttons, type text, select dropdowns, attach files, handle dialogs
- **Assert**: Verify that specific elements are on screen, text is correct, and state is valid
- **Diff**: Compare DOM state before and after an action to detect unintended changes
- **Screenshot**: Visually indicate problems with annotated screenshots
- **Responsive check**: Validate mobile/tablet layouts by changing viewport size

Each command executes in roughly 100ms, so running multiple steps in sequence yields fast results. Provided as a gstack ecosystem skill, it integrates naturally into deployment pipelines when used with the QA-Only or ship skills.

## One-Line Summary

A **fast headless browser QA tool** that opens URLs and executes clicks, inputs, screenshots, and layout validations in ~100ms increments — browsing a site "like a person" right after deployment to catch bugs with visual evidence.

## Getting Started

```bash
/browse
```

**SKILL.md file location**: `~/.claude/skills/browse/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: You have deployed a Next.js 15 + TypeScript "Student Club Notice Board" project to Vercel. You want to verify that the notice creation form and notice list page work correctly, and that the layout is not broken on mobile.

### Step 1: Access Deployment URL and Check List Page

```
> Use the browse skill to open https://my-club-board.vercel.app/notices
  and verify that the notice list renders on screen.
```

What Claude does:
- Navigates to the URL and asserts that `<ul>` or notice card components exist in the DOM
- Captures a screenshot showing whether there are 0 notices or actual data

### Step 2: Test Notice Creation Form Submission

```
> On /notices/new, enter the title "April Regular Meeting", content "April 15 at 6 PM...",
  click the submit button, and verify that it redirects to /notices.
```

What Claude handles automatically:

```ts
// Flow the Browse skill executes internally (pseudocode)
await page.goto("/notices/new");
await page.fill('[name="title"]', "April Regular Meeting");
await page.fill('[name="body"]', "April 15 at 6 PM...");
// Screenshot before submission (before)
await page.screenshot({ annotate: true });
await page.click('button[type="submit"]');
// State diff after submission (after)
await page.assertURL("/notices");
// Assert that the new notice appears in the list
await page.assertText("April Regular Meeting");
```

### Step 3: Validate Mobile Responsive Layout

```
> Set the viewport to 375x812 (iPhone 14), open /notices,
  and check that notice cards don't overflow horizontally. Take a screenshot.
```

If overflow occurs, Claude reports the specific CSS class name along with an annotated screenshot.

### Step 4: Generate Bug Reproduction Report

```
> It was reported that clicking the save button on /notices/[id]/edit
  sometimes causes a "500 Internal Server Error". Reproduce it and summarize
  the steps and a screenshot.
```

The Browse skill outputs a structured bug report containing reproduction steps, the URL where it occurred, the error message, and a screenshot.

## Learning Points / Common Pitfalls

- **No need to write Playwright scripts in advance**: Traditional E2E tests require writing test code first, but the Browse skill runs immediately with natural language commands. Especially useful for quick "sanity checks" right before a semester-end demo.
- **Screenshot = bug evidence**: Instead of telling teammates "the screen looked like this", attaching an annotated screenshot makes communication much clearer.
- **Combine with Next.js 15 Server Actions**: You can directly verify with Browse whether the redirect after `createNotice` Server Action works correctly, and whether `revalidatePath` actually invalidates the cache.
- **Common Pitfall — Difference between localhost and production**: The Browse skill operates against real URLs. `localhost:3000` is possible, but behavior may differ based on environment variables (`.env.local` vs Vercel environment variables). Always specify which environment you are testing.
- **Difference from QA-Only skill**: The Browse skill is a tool for quickly validating a single scenario. If you want to systematically scan the entire site and get a health score with a structured report, use the QA-Only skill.

## Related Resources

- [gstack](./gstack.md) — The underlying engine for Browse (used for complex multi-step flows)
- [qa-only](./qa-only.md) — Systematic quality scan of the entire site
- [connect-chrome](./connect-chrome.md) — When you need real-time observation in an actual Chrome window

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
