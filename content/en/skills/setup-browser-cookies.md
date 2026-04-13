---
title: "Import Browser Cookies (Setup Browser Cookies)"
source: "~/.claude/skills/setup-browser-cookies/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["browser", "QA", "authentication", "cookies", "gstack"]
category: "Browser/QA"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# Import Browser Cookies (Setup Browser Cookies)

## Core Concepts

### Why Authentication Is a Problem in Headless Browsers

The headless browser (gstack's `/browse`) starts as a **completely isolated new session** separate from the user's real Chrome profile. This means:

- Sites already logged into in real Chrome are logged out in headless
- `document.cookie` is empty, causing 401/403 responses on authenticated API calls
- JWT tokens, session IDs, and CSRF tokens are all absent in the initial state

Previously, solving this problem required putting test account credentials in plain text in scripts, or writing complex scripts to bypass social login. Setup Browser Cookies solves this problem through **cookie transplantation**.

### Interactive Domain Selection UI

When Setup Browser Cookies runs, an interactive selection UI appears:

```
[Setup Browser Cookies] List of domains found in real Chromium:

  [ ] accounts.google.com
  [ ] github.com
  [x] localhost:3000         ← club board dev server
  [ ] notion.so
  [x] kakao.com              ← Kakao social login
  [ ] youtube.com
  ...

Selected domain cookies will be imported into the headless session.
[Enter] Confirm  [Space] Toggle  [a] Select all
```

The user selects only the domains they need, and only those cookies are copied into the headless session. Unnecessary cookies (YouTube, etc.) are not imported, maintaining privacy and test isolation.

### Session State After Cookie Transplantation

```
[Setup Browser Cookies] Complete

Imported cookies:
  localhost:3000  →  next-auth.session-token (expires: 2026-04-15)
  kakao.com       →  _kawlt, _kaot30 (expires: 2026-04-30)

Headless session status: Authenticated
You can now test pages requiring authentication with /browse or /qa skills.
```

### Security Considerations

- Cookies only move within the local machine and are not transmitted externally
- The headless session is automatically cleaned up after testing ends
- Real Chrome cookies are not modified (read-only copy)
- Per-domain selection allows selectively importing only work-related cookies

## One-Line Summary

A cookie transplantation skill that imports cookies stored in the real Chromium browser into the headless browser session through an **interactive domain selection UI**, enabling testing of login-authenticated pages even in a headless environment.

## Getting Started

```bash
/setup-browser-cookies
```

**SKILL.md file location**: `~/.claude/skills/setup-browser-cookies/SKILL.md`

To customize, copy the SKILL.md content and modify it.

## Practical Example

**Situation**: You want to automatically test an admin page (`/admin`) on a Next.js 15 + NextAuth.js "Student Club Notice Board" with Headless QA. You are already logged in via real Chrome, but the headless session is logged out.

### Step 1 — Attempt Headless Test Without Cookies (Failure Case)

```bash
> /browse check if the notice list on http://localhost:3000/admin is displayed correctly
```

```
[browse] Navigating to http://localhost:3000/admin
[browse] Warning: 302 redirect → /login
[browse] Moved to login page — authentication required

→ Cannot test authenticated page. Need to run setup-browser-cookies.
```

### Step 2 — Run Cookie Import

```bash
> Use setup-browser-cookies skill to import local dev server cookies into the headless session
```

```
[Setup Browser Cookies] Scanning cookies from real Chrome...

Discovered domains (Space to select, Enter to confirm):
  [ ] accounts.google.com
  [x] localhost:3000       ← selected with Space
  [ ] kakao.com

Confirming...
[Setup Browser Cookies] localhost:3000 cookie transplantation complete
  next-auth.session-token: eyJhbGci... (expires: 2026-04-15 23:59)
  next-auth.csrf-token: a3f9... (session bound)
Headless session authentication status: Complete
```

### Step 3 — Retry Headless QA After Authentication

```bash
> /qa test all notice CRUD features on http://localhost:3000/admin
```

```
[qa] Navigating to http://localhost:3000/admin...
[qa] Authentication check: logged in as admin ✓

Test items:
  ✓ Notice list display (10 notices confirmed)
  ✓ Create new notice (title/content/category input → save)
  ✓ Edit notice (edit existing notice → update)
  ✗ Delete notice — delete confirmation dialog button unresponsive
```

Immediate fix for discovered bug:

```tsx
// components/DeleteConfirmDialog.tsx — Bug fix

// Before: missing type="button" causing form submit
<button
  onClick={() => onConfirm()}
  className="rounded bg-red-600 px-4 py-2 text-white"
>
  Confirm Delete
</button>

// After (bug fix discovered via setup-browser-cookies QA)
<button
  type="button"       // explicit type added — prevents form submit
  onClick={() => onConfirm()}
  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2"
>
  Confirm Delete
</button>
```

### Integration Example with NextAuth.js

```typescript
// middleware.ts — NextAuth middleware configuration
// For identifying cookie names imported by setup-browser-cookies
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token !== null,
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/admin/:path*', '/my/:path*'],
};

// If next-auth.session-token cookie is present, above paths are accessible
// Importing this cookie via setup-browser-cookies enables access from headless too
```

## Learning Points / Common Pitfalls

- **Real-world problem with social login**: Kakao, Google, GitHub social login OAuth redirect flows are very complex and extremely difficult to reproduce with automation scripts. Setup Browser Cookies lets you skip this complexity and directly use an already-authenticated state.
- **Common mistake — Re-test failure after cookie expiry**: If the session expires after importing cookies, the headless session also becomes logged out again. If a QA session is long, cookies need to be re-imported midway.
- **Common mistake — Production environment cookie contamination**: Be careful not to confuse dev server (`localhost:3000`) cookies with staging/production environment cookies. Always select the correct domain in the domain selection UI.
- **Next.js 15 Tip — NextAuth session token name**: In NextAuth.js v5 (Auth.js), the session cookie name differs between `next-auth.session-token` (HTTP) and `__Secure-next-auth.session-token` (HTTPS). For a local dev server using HTTP, select `next-auth.session-token`.
- **QA automation workflow**: The sequence `setup-browser-cookies` → `/qa` → review results is the standard headless QA workflow for pages requiring authentication. Mastering this pattern enables automatic testing of features hidden behind login.

## Related Resources

- [qa](./qa.md) — QA skill that discovers bugs + auto-fixes them
- [qa-only](./qa-only.md) — QA skill that only generates reports
- [browse](./browse.md) — Headless browser navigation skill

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
