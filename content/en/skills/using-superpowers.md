---
title: "Using Superpowers"
source: "~/.claude/skills/using-superpowers/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:4dc43d08e757761109d460afe20f183a5a9be9466162eaadbd8e8f1124ef903f"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["meta-skill", "skill-selection", "priority", "RedFlags", "skill-catalog"]
category: "Meta"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Using Superpowers

## Core Concepts

The original presents the following concepts.

1. **The 1% Rule**: If there's even a slight doubt about whether a skill might be needed, open that skill. The skill catalog is Claude's "task manual" — consult it immediately when doubt arises.
2. **Instruction Priority**: When instructions from different sources conflict, follow this order:
   - The user's current message
   - Project-specific `CLAUDE.md`
   - Global `~/.claude/CLAUDE.md`
   - Skill body
   - General best practices
3. **How to Access Skills**: In the Claude Code environment, skills are automatically injected "like tools". Claude calls the relevant skill via the `Skill` tool at the moment it judges it to be necessary.
4. **Red Flags**: When certain words/situations appear, a specific skill must be activated.

   | Signal | Skill to Activate |
   |--------|-------------------|
   | "debug", "bug", "why isn't it working" | `investigate` / `systematic-debugging` |
   | "new feature", "build this", "add this" | `brainstorming` |
   | "plan", "steps", "TODO list" | `writing-plans` |
   | "review", "PR check" | `review` |
   | "deploy", "ship", "open a PR" | `ship` |

5. **Skill Types**:
   - **Rigid**: Skills with fixed steps and checklists. Examples: `test-driven-development`, `brainstorming`.
   - **Flexible**: Skills centered on principles and guidelines. Examples: `writing-skills`, `using-superpowers` itself.

## One-Line Summary

A meta-skill that tells you **when and how to invoke** the other skills provided by Claude Code. It governs instructions to use skills, priority between skills, Red Flags, and which skill to use in which situation.

## Getting Started

```bash
/using-superpowers
```

**SKILL.md location**: `~/.claude/skills/using-superpowers/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: You open Claude Code in the morning to continue working on a Student Club Notice Board assignment. The user says:

> "Let's continue the notice board work from yesterday. The Supabase migration keeps failing."

This single sentence contains **multiple skill signals**. The `using-superpowers` skill reasons as follows:

1. "continue from yesterday ..." → **executing-plans** skill candidate. If there was a plan, it should be resumed.
2. "migration keeps failing" → **investigate** or **systematic-debugging** skill candidate. A bug/failure signal.
3. "Supabase" + "failing" → Could be a simple config error, a permissions issue, or a network issue. The symptom alone doesn't tell us.

Conclusion: Claude first uses the **investigate** skill to confirm the root cause, then returns to **executing-plans** to continue the remaining tasks once resolved. Both skills are needed simultaneously, but order matters.

```bash
# Claude's internal reasoning (pseudocode)
if (userMessage.includes("failing") || userMessage.includes("error")) {
  activateSkill("investigate");
}
if (userMessage.includes("continue") && existsPlan("docs/plans/")) {
  queueSkill("executing-plans");
}
```

**Another scenario**: The user says "Now make the login UI look nicer." This might look like a "simple styling" task at first glance, but `using-superpowers` detects a red flag.

- "now ... make the UI nicer" → There are no clear requirements (specifically what? color? layout? mobile?).
- → Run the **brainstorming** skill first to agree on the intent. Don't change any code before that.

```ts
// Without brainstorming, this kind of code tends to appear
// Style changes without clear intent
<button className="bg-blue-500 hover:bg-blue-700 rounded-lg shadow-lg">
  Login
</button>

// After brainstorming to decide "student club tone" + "accessibility AA"
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-400">
  Login
</button>
```

## Learning Points / Common Pitfalls

- **The existence of a meta-skill itself is important**: Claude Code has 50+ skills. It is hard to remember every skill at all times. `using-superpowers` functions as a map of "what to pull out when" for this catalog.
- **Practical effect of the 1% rule**: In student assignments, the 0.5-second doubt of "is this a situation to use systematic-debugging?" saves 30 minutes later.
- **Instruction priority**: If the user says "answer in English" but the global CLAUDE.md says "write in Korean", the user's message takes priority. Knowing this priority makes decisions in conflict situations much easier.
- **You can also directly tell Claude to "use" a skill**: When Claude doesn't automatically pull out a skill, the user can directly specify it like "use the brainstorming skill to agree on the intent first." That authority belongs to the user.
- **Next.js 15 tip**: Frontend tasks ("create a component", "add a form") almost always work well with the brainstorming → writing-plans → executing-plans chain. Remember this pattern.

## Related Resources

- [writing-skills](./writing-skills.md) — Creating your own skills
- [learn](./learn.md) — Managing learning content across sessions
- [retro](./retro.md) — Retrospecting skill usage patterns

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
