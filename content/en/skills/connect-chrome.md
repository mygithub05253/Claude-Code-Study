---
title: "Connect to Real Chrome (Connect Chrome)"
source: "~/.claude/skills/connect-chrome/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["connect-chrome", "browser", "real-time QA", "Side Panel", "gstack"]
category: "Browser/QA"
---

# Connect to Real Chrome (Connect Chrome)

## Core Concepts

### Headless vs Real Chrome

To understand Connect Chrome, you first need to know the difference between two browser automation approaches.

| Field | Headless browser (`/browse`) | Real Chrome (`connect-chrome`) |
|------|-------------------------------|-------------------------------|
| Display | None (background) | Yes (shown on user's screen) |
| Real-time observation | Not possible (screenshots only) | Possible (all actions visible live) |
| Cookies/Session | Isolated new session | Can share existing browser session |
| Speed | Fast | Actual browser speed |
| Use case | Automated testing, scraping | Live supervision, tasks requiring auth |
| Side Panel | None | Yes (gstack extension auto-loaded) |

### When to Use

- When receiving requests like "connect Chrome", "open in real browser", or "launch Chrome"
- When you want to **directly watch Claude's browser actions in real time**
- When you need to test with an existing login session, cookies, and localStorage already in place
- When you need to observe dynamic interactions (drag-and-drop, animations, modal popups)
- When debugging rendering issues that are difficult to reproduce in a headless browser

### Side Panel Extension

gstack's Chrome extension is automatically loaded when Connect Chrome runs, displaying a **real-time activity feed** in Chrome's right side panel. It shows text logs of what elements Claude is clicking, what text it is entering, and what decisions it is making.

```
[Side Panel Activity Feed Example]
09:32:01  Navigating to notice list page...
09:32:02  Found "Create New Notice" button — clicking
09:32:03  Focused on title input field
09:32:04  Typing "Regular General Meeting Notice"
09:32:05  Moving to content editor
09:32:07  Clicking submit button
09:32:08  Success toast message confirmed ✓
```

### Advantages of Using Real Chrome

**1. Reuse existing session**

Connect Chrome runs from the user's existing Chrome profile, so it can directly use cookies and sessions from sites already logged into. You can test authenticated pages immediately without any separate authentication process.

**2. Rendering consistency**

It is 100% the same rendering environment that real users see. CSS animations, Web Font rendering, and GPU-accelerated effects that are difficult to reproduce in a headless browser are confirmed identically.

**3. Ability to intervene**

If Claude appears to be making a mistake, the user can immediately intervene and stop it. Real-time course corrections like "wait, click the other button" are possible.

## One-Line Summary

A browser automation skill that connects an **actual Chrome window** with gstack's Side Panel extension automatically loaded so Claude can directly control it, allowing users to observe all browser actions in real time right in front of them.

## Getting Started

```bash
/connect-chrome
```

**SKILL.md file location**: `~/.claude/skills/connect-chrome/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: You want to QA the notice creation flow of a Next.js 15 + TypeScript "Student Club Notice Board" by watching it directly. You observe Claude writing a notice in real time and discover UI/UX issues.

### Step 1 — Connect Chrome

```bash
> Use the connect-chrome skill to launch Chrome and navigate to http://localhost:3000
```

Claude response:

```
[connect-chrome] Chrome window opened
[connect-chrome] gstack Side Panel extension loaded
[connect-chrome] Navigating to http://localhost:3000...
[connect-chrome] Page load complete

Check the real-time activity feed in the Side Panel.
All actions will proceed in the Chrome window.
```

### Step 2 — Real-time QA Session

```bash
> Run the full notice creation flow: create new notice → enter title/content → select category → submit → verify result
```

At this point, the user watches the Chrome window directly and observes all of Claude's actions.

Example of issues you can discover in real time:

```
[Side Panel]
09:33:15  Clicking category dropdown
09:33:16  Warning: dropdown not opening — suspected missing click event
09:33:17  Alternative: trying Enter key
09:33:17  Warning: Enter key also unresponsive

→ User observes: "Oh, the category select component has no onClick!"
→ Immediate intervention: "Wait, fix that component's code"
```

### Step 3 — Fix Discovered Issues Immediately

```tsx
// Bug discovered through real-time observation
// components/CategorySelect.tsx — Before

// Problem: only onChange, no onKeyDown so keyboard accessibility impossible
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="rounded-lg border p-2"
>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>{cat.label}</option>
  ))}
</select>
```

```tsx
// components/CategorySelect.tsx — After (fixed after connect-chrome QA discovery)
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  onKeyDown={(e) => {
    // Keyboard accessibility: selectable with Enter/Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }}
  // Accessibility: explicit aria-label added
  aria-label="Select notice category"
  className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>{cat.label}</option>
  ))}
</select>
```

### When to Choose Headless vs Connect Chrome

```bash
# Headless browser use case
> /browse to scrape the notice list from https://example.com
# → Automated batch processing, no need for user observation, only quick screenshots needed

# Connect Chrome use case
> Use the connect-chrome skill to show the club board login + notice creation flow live
# → Authentication needed, real-time observation needed, interaction QA, ability to intervene needed
```

## Learning Points / Common Pitfalls

- **"Trust Claude but verify"**: Claude's browser automation is powerful but can click unexpected places or make wrong judgments. Connect Chrome allows real-time supervision of this process, increasing reliability.
- **Common mistake — Using Headless for important tasks**: Running tasks that modify real data (data submission, deletion, payments) with Headless makes it hard to verify the results. Such tasks should always be supervised in real time using Connect Chrome.
- **Common mistake — Cookie session issues**: Testing pages that require login with Headless results in an "unauthenticated state", failing to test actual behavior. Use `/setup-browser-cookies` or Connect Chrome instead.
- **Next.js 15 Tip — Connect to dev server**: Connecting Connect Chrome to a local development server running with `next dev` (`localhost:3000`) creates a real-time development loop where code changes via Hot Reload are immediately visible in the browser.
- **Observing AI thought process via Side Panel**: The Side Panel's activity feed shows how Claude understands the page. Observing this feed can help prevent Claude's mistakes in advance.

## Related Resources

- [browse](./browse.md) — Headless browser testing (fast automation)
- [gstack](./gstack.md) — General-purpose browser automation engine
- [setup-browser-cookies](./setup-browser-cookies.md) — Pre-configure cookies/sessions

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
