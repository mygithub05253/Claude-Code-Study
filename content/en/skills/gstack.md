---
title: "GStack Headless Browser (GStack)"
source: "~/.claude/skills/gstack/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["gstack", "headless browser", "QA automation", "E2E", "screenshot", "responsive"]
category: "Browser/QA"
---

# GStack Headless Browser (GStack)

## Core Concepts / How It Works

### What is the GStack Ecosystem?

GStack is not just a single tool — it is a **browser automation engine shared by multiple Claude Code skills**. The following skills are built on top of GStack:

| Skill | Role | GStack Dependency |
|-------|------|-------------------|
| `gstack` | General-purpose browser automation engine | The base engine itself |
| `browse` | Specialized quick validation for single scenarios | Built on gstack |
| `qa` | Full site quality scoring | Built on gstack |
| `qa-only` | QA run in isolation | Built on gstack |
| `canary` | Post-deployment health check | Built on gstack |
| `land-and-deploy` | Production deployment verification | Built on gstack |

### When to Use

- When direct browser verification is needed, like "open the site and check" or "verify the deployment"
- When dogfooding (testing firsthand) core user flows immediately after a new deployment
- When automating form submissions, file uploads, and dialog handling to verify E2E flows
- When you need to create a bug report bundling reproduction steps and screenshots
- When verifying responsive layouts across multiple viewports simultaneously (mobile/tablet)

### gstack vs browse Skill

Both skills use a headless browser, but for different purposes:

| Comparison | gstack | browse |
|------------|--------|--------|
| Role | General-purpose browser automation engine | Specialized skill built on gstack |
| Scope | All browser tasks independently | Quick check for a single scenario |
| Invocation | Called directly or as a base for other skills | Direct invocation only |
| Complex flows | Can handle multi-step conditional branching | Optimized for simple linear scenarios |
| Additional features | Diff, annotations, responsive, and rich features | Only the essential core features |

**Practical guideline**: For simple requests like "open the site and check," `browse` is sufficient. Use `gstack` directly (or gstack-based skills like qa, canary) when you need multiple conditions, complex interaction flows, or pipeline integration with other skills.

### Key Features

**Navigate**: Navigate to any URL, including SPA client-side routing. Tracks navigation via Next.js App Router's `Link` component.

**Interact**: Click buttons, text input, dropdown selection, file attachment, dialog (alert/confirm/custom modal) handling.

**Verify State**: Various assertions including element existence, text values, URL changes, and network response status codes.

**Diff**: Compares DOM state before and after actions to detect unintended changes or re-rendering issues.

**Annotated Screenshots**: Visualizes bug evidence with screenshots marked with arrows and highlights showing where the problem is.

**Responsive Layouts**: Validates layout at specified viewports (mobile 375px, tablet 768px, desktop 1280px, etc.).

## One-Line Summary

A fast headless browser-based **general-purpose QA automation engine** that handles page navigation, element interaction, state verification, screenshots, responsive layout testing, forms, file uploads, and dialogs — capturing bug evidence.

## Getting Started

```bash
/gstack
```

**SKILL.md file location**: `~/.claude/skills/gstack/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You've deployed the Student Club Notice Board (Next.js 15 + TypeScript + Supabase) to Vercel. You want to automatically verify the full CRUD flow of notice creation → list confirmation → edit → delete in the production environment.

### Step 1: Automated Full CRUD Flow Verification

```
> Use gstack to log into https://club-board.vercel.app
  with the officer account (officer@club.ac.kr / password123),
  and test the full flow of creating a notice → confirming on list → editing → deleting.
  Take a screenshot at each step.
```

Internal flow GStack performs (pseudocode):

```ts
// GStack internal execution flow (pseudocode, not code you write directly)

// 1. Login
await gstack.navigate("https://club-board.vercel.app/login");
await gstack.fill('[name="email"]', "officer@club.ac.kr");
await gstack.fill('[name="password"]', "password123");
await gstack.click('button[type="submit"]');
await gstack.assertURL("/notices"); // Verify redirect after login
await gstack.screenshot({ label: "login_success" });

// 2. Create notice
await gstack.navigate("/notices/new");
await gstack.fill('[name="title"]', "Test Notice — Automated");
await gstack.fill('[name="body"]', "This notice was created by GStack automation.");
await gstack.click('[data-testid="submit-btn"]');
await gstack.assertURL(/\/notices\/\d+/); // Navigate to detail page after creation
await gstack.assertText("Test Notice — Automated");
await gstack.screenshot({ label: "notice_created" });

// 3. Verify new notice on list
await gstack.navigate("/notices");
await gstack.assertText("Test Notice — Automated");
await gstack.screenshot({ label: "list_confirmed" });

// 4. Edit
await gstack.click('[data-notice-title="Test Notice — Automated"]');
await gstack.click('[data-testid="edit-btn"]');
await gstack.fill('[name="title"]', "Test Notice — Edited");
await gstack.click('button[type="submit"]');
await gstack.assertText("Test Notice — Edited");
await gstack.screenshot({ label: "edit_complete" });

// 5. Delete
await gstack.click('[data-testid="delete-btn"]');
await gstack.clickDialog("Confirm"); // Handle confirm dialog
await gstack.assertURL("/notices");
await gstack.assertNotText("Test Notice — Edited");
await gstack.screenshot({ label: "delete_complete" });
```

### Step 2: File Upload Testing

```
> Use gstack to upload an attachment (test.pdf, 2MB) at /notices/new,
  and verify that a file preview is shown and that a Supabase Storage URL
  is included in the response after submission.
```

### Step 3: Multi-Viewport Responsive Layout Verification

```
> Use gstack to open the /notices page at 375px (mobile), 768px (tablet),
  and 1280px (desktop), take screenshots at each, and verify there is
  no layout overflow.
```

### Improving Test Stability in Next.js 15

To use GStack reliably in Next.js 15 projects, it's good to add `data-testid` attributes in advance:

```tsx
// components/notice/NoticeForm.tsx
export function NoticeForm() {
  return (
    <form>
      <input
        name="title"
        data-testid="notice-title-input"
        // ...
      />
      <textarea
        name="body"
        data-testid="notice-body-input"
        // ...
      />
      <button
        type="submit"
        data-testid="notice-submit-btn"
        // ...
      >
        Submit
      </button>
    </form>
  );
}
```

## Learning Points / Common Pitfalls

- **GStack doesn't require Playwright setup**: Unlike traditional Playwright tests that require writing test files, GStack runs directly from natural language commands. It can be used immediately in projects without test code.
- **`data-testid` is a gift**: Adding `data-testid` attributes when writing components makes GStack (and future Playwright tests) find elements much more reliably. Finding elements by class name or text breaks tests when styles change.
- **5-minute verification right after deployment**: Even automatically verifying just 1-2 core flows with GStack after deploying to Vercel can immediately catch "something broke after deployment." Combined with the `canary` skill in a CI pipeline, it becomes even more powerful.
- **Common pitfall — Next.js Server Component hydration time**: If GStack clicks an element too quickly while server components are fetching data, errors can occur. GStack internally waits until elements are interactable, but Suspense boundaries need to be properly configured for stability.
- **Screenshot evidence is the language of team communication**: Instead of explaining bugs verbally, sharing annotated screenshots taken by GStack on Slack/Discord lets teammates understand immediately. Especially useful for university team projects when communicating without issue tracking.

## Related Resources

- [browse](./browse.md) — Quick single-scenario validation built on GStack (for simpler cases)
- [canary](./canary.md) — GStack-based post-deployment health check automation
- [gstack-upgrade](./gstack-upgrade.md) — Upgrade GStack engine to the latest version

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
