---
title: "Project Learning Management (Learn)"
source: "~/.claude/skills/learn/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["memory", "learning-management", "session-continuity", "retrospective"]
category: "Meta"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
---

# Project Learning Management (Learn)

## Core Concepts / How It Works

### What is "Learning" Here?

Here, "learning" is not just a simple note. It refers to knowledge that remains valid across sessions — **reproducible patterns discovered during a session, root causes of resolved bugs, reasons for decisions, and pitfalls to watch out for**.

Examples:
- "If `auth.uid()` is incorrectly referenced in Supabase RLS policies, INSERT silently fails."
- "In Next.js 15, if `dynamic = 'force-dynamic'` is omitted, notices won't update due to caching issues."
- "In pnpm workspace, running install without `--filter` only installs root dependencies."

### 4 Core Features

| Feature | Description |
|---------|-------------|
| **Review** | View all accumulated learnings in chronological or category order |
| **Search** | Find relevant learnings by keyword (e.g., "RLS", "cache") |
| **Prune** | Clean up outdated learning items that are no longer valid |
| **Export** | Export learning history as a Markdown file (for team sharing, documentation) |

### Storage Location

Learning items accumulate in Claude Code's memory files. In this project, they are synced with files in the `C:\Users\kik32\.claude\projects\...\memory\` directory.

## One-Line Summary

A memory management skill that lets you **review, search, prune, and export project learnings** accumulated across multiple sessions — preventing wasted time re-debugging "I fixed this bug before..."

## Getting Started

```bash
/learn
```

**SKILL.md file location**: `~/.claude/skills/learn/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You're 3 weeks into developing a "Student Club Notice Board" project based on Next.js 15 + TypeScript. You opened a new session today, and while you recall fixing a Supabase-related bug last time, you can't quite remember exactly what you learned.

### Reviewing Learning History

```bash
# In a Claude Code session
> Show me what we've learned so far in this project.
# Or
> show learnings
> what have we learned
```

Example of what Claude returns:

```markdown
## Project Learning History (Student Club Notice Board)

### Database / Supabase
- [2026-04-05] In Supabase RLS, the service_role key bypasses RLS, so
  it must never be exposed in client-side code. Use only the anon key.
- [2026-04-07] Without an `auth.uid() = author_id` condition in the
  INSERT policy of the `notices` table, anyone can write without logging in.

### Next.js 15
- [2026-04-06] If `revalidatePath('/notices')` is not called in a Server Action,
  the notice list won't update after creating a notice. Always call it.
- [2026-04-08] Using `generateStaticParams` fixes notice IDs at build time,
  making it unsuitable for dynamic notices. Use `dynamic = 'force-dynamic'` instead.
```

### Searching for a Specific Topic

```bash
> Search for learnings related to "cache".
# Or
> search learnings: cache
```

### Pruning Outdated Learnings

```bash
> Clean up outdated learning items. (Next.js 14-era learnings may no longer apply)
# Or
> prune stale learnings
```

Claude will ask for confirmation: "This item is based on library v14 and may no longer be valid for v15. Would you like to delete it?"

### Exporting Learnings

```bash
> Export the learning history as a Markdown file. I want to share it with teammates.
# Or
> export learnings
```

Example of using learnings as code comments:

```ts
// [Learning 2026-04-07] revalidatePath is required — omitting causes cache issues
export async function createNotice(formData: FormData) {
  'use server'
  await supabase.from('notices').insert({ ... })
  revalidatePath('/notices') // Never omit this line
}
```

## Learning Points / Common Pitfalls

- **Session-to-session memory continuity**: Claude Code fundamentally loses context when a session ends. The Learn skill is a core tool to compensate for this limitation. Its value grows the longer a project runs.
- **Building a learning recording habit**: Whenever you fix a bug, discover unexpected behavior, or think "next time this situation comes up, I'll do it this way" — ask Claude to record it as a learning.
- **Pruning cadence**: After major library version upgrades and after architecture refactoring, you must run prune. Outdated learnings leading you in the wrong direction is worse than having no records.
- **Common mistake**: Thinking "I already know all this" and not recording it. After experiencing the same bug re-debugged a month later, the recording habit tends to stick.
- **Next.js 15 perspective tip**: The caching behavior of App Router (fetch cache, Full Route Cache, Router Cache) is often counter-intuitive when first encountered. Keeping this "pitfall knowledge" as learnings prevents falling into the same traps in future sessions.

## Related Resources

- [retro](./retro.md) — Weekly engineering retrospective skill
- [health](./health.md) — Codebase health check
- [using-superpowers](./using-superpowers.md) — Skills meta guide

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
