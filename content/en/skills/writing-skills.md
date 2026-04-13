---
title: "Writing Skills"
source: "~/.claude/skills/writing-skills/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:7cc2872192aae3e9d230ae9d002fa8bb4c204a233b637d951e0722cb7f98c0da"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["skill-writing", "TDD", "meta-skill", "CSO", "SKILL.md"]
category: "Meta"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Writing Skills

## Core Concepts

The core idea of the original is that **"TDD can be applied to process documents too"**. It maps the Red → Green → Refactor cycle of test-driven development to skill writing.

1. **Red (Test First)**: Write down first "what observable results should appear if this skill works correctly?" This becomes the skill's acceptance criteria.
2. **Green (Minimal Implementation)**: Write the **minimal** SKILL.md that satisfies the acceptance criteria. Do not write verbosely.
3. **Refactor (Polish)**: Run the skill in an actual Claude session and verify whether it passes the acceptance criteria. If it fails, refine the skill.

Skills are classified into three types.

- **Technique**: Documents the usage of a specific technology/tool. Example: "Using Next.js Server Actions Safely"
- **Pattern**: Documents recurring design patterns. Example: "Brainstorming", "TDD"
- **Reference**: Checklists or lookup tables. Example: "Supabase RLS Anti-Pattern List"

The original also emphasizes the **CSO (Concise Self-descriptive Opening)** principle. The `description` field of SKILL.md must clarify "what this skill solves" in the first sentence, and this serves as the criterion for whether Claude automatically "pulls out" the skill.

## One-Line Summary

A meta-skill that teaches how to design and verify new Claude Code skills (SKILL.md) or modify existing ones using a **TDD approach** (test first). It treats the skill itself as a "process document" and enforces quality.

## Getting Started

```bash
/writing-skills
```

**SKILL.md location**: `~/.claude/skills/writing-skills/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: While working on this project (`Claude-Code-Study`) itself, the problem of "forgetting to update the README every time" keeps recurring. Let's turn this into **our own skill**. We'll name it `update-readme-on-push`.

### Step 1 — Red: Write Acceptance Criteria

```markdown
# Acceptance criteria for the update-readme-on-push skill
1. Activates when the user says "check the README before pushing".
2. Scans the current diff to detect the following change categories:
   - New script added (package.json changed)
   - New directory/package added
   - CI workflow changed
   - Deployment URL changed
3. Finds the README section corresponding to each detected category
   and reports whether an update is needed.
4. Only modifies the README with user approval. No automatic commits.
```

### Step 2 — Green: Write Minimal SKILL.md

```markdown
---
name: update-readme-on-push
description: Scans the diff immediately before pushing and finds sections
  of the README that need updating. Detects new scripts/packages/CI/deployment URL
  changes. Does not auto-commit.
preamble-tier: 2
---

# update-readme-on-push

## When to use
When the user says "check README before push", or mentions "push" right after git commit.

## Process
1. Check change scope with `git diff --cached` + `git diff HEAD...origin/main`
2. Match the following categories:
   - `package.json` scripts → README "Commands" section
   - New `packages/*/` or `apps/*/` → README "Directory Structure" section
   - `.github/workflows/*.yml` → README CI badge
   - `base` change in `apps/docs/.vitepress/config.ts` → README deployment URL
3. Find matched sections in `README.md` and output "these changes may need to be reflected" suggestions
4. Modify README with Edit tool upon user approval

## What NOT to do
- No auto-commit of README (without user approval)
- Do not scan files that haven't changed (token waste)
```

### Step 3 — Refactor: Verification

```bash
# After saving the new skill to ~/.claude/skills/update-readme-on-push/SKILL.md
# Restart the Claude Code session

# Test 1: When there are no changes, does the skill respond "no changes"?
> check README before push
# Expected: "No changes, no update needed"

# Test 2: After adding a package.json script
> check README before push
# Expected: "Suggestion to add 'pnpm <new script>' in the Commands section"
```

When all four acceptance criteria pass, it's Green. If any criteria fail, modify the SKILL.md and run again.

```ts
// This skill itself is a markdown file, not a code file,
// but by defining testable observation points ("what input → what output") in advance,
// you gain the same safety net as code TDD.
```

## Learning Points / Common Pitfalls

- **The question "TDD for documents?"**: Skills are prompt fragments, not code, but writing down in advance "what observable things should happen when this skill runs" dramatically improves quality. Without writing it down, skills just become increasingly verbose.
- **Practical utility of the CSO rule**: If the `description` in SKILL.md is vague, Claude won't know when to pull out this skill. If you create a skill you'll use frequently (e.g., "Supabase RLS check"), put **"when / why / what"** all in the first sentence of the description.
- **The principle of minimalism**: Good skills are short. Faithfully following one line close to the original's Iron Law works far better than listing 20 rules.
- **Next.js 15 tip**: Next.js project-specific repetitive tasks (Server Action safety checks, RSC-client boundary validation, environment variable naming conventions) are all excellent candidates for extraction into skills.
- **Connection to this project**: In Phase P2 of this `Claude-Code-Study` project, `@claude-code-study/cli` will automate "SKILL.md parsing/validation/deployment". It could become a tool that automatically enforces the principles of the writing-skills skill.

## Related Resources

- [using-superpowers](./using-superpowers.md) — Using the skill catalog (meta-skill)
- [test-driven-development](./test-driven-development.md) — TDD principles (applicable to skill writing too)
- [verification-before-completion](./verification-before-completion.md) — Verification principle before completing a skill

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
