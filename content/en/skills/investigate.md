---
title: "Investigate"
source: "~/.claude/skills/investigate/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:b7d27181a411a66c6f34c0eedd187f776e7aaa97c95d1fa04ce30cfcab407705"
lang: en
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
tags: ["investigate", "debugging", "root-cause", "hypothesis", "bug-investigation"]
category: "Quality / Safety"
---

# Investigate

## Core Concepts

The original's **Iron Law** is a single line.

> **Make no fix until the root cause is confirmed.**

To maintain this rule, go through 4 phases.

1. **Investigate**: Collect error messages, logs, reproduction steps, and related code. Do not form hypotheses at this stage. Gather facts only.
2. **Analyze**: Weave together the collected facts and describe "what is happening." Example: "Function A returns null, and component B accesses that value with `.length`."
3. **Hypothesize**: List possible causes and form a **verifiable hypothesis** for each. "The reason A returns null is one of: (a) the request parameter is empty, (b) there is no record in the DB, (c) it is blocked by an RLS policy."
4. **Implement**: Fix one confirmed cause. Do not fix multiple hypotheses simultaneously "just in case."

The key is **the distinction between "patching a symptom" and "fixing a cause."** Tools like try/catch, `?? 0`, and type casting often mask the root cause.

### When to Use

- When you encounter a bug where the cause is not clear
- When tests suddenly turn red and you don't know "what changed"
- Errors that only occur in production, or intermittent errors
- When a bandaid fix like "just wrap it in try/catch" comes to mind
- When you are experiencing the same symptom repeatedly

Conversely, this skill is overkill for a typo or simple mistake where the cause is already 100% clear. Just fix it directly.

## One-Line Summary

A debugging skill that enforces the order of **"confirm root cause → fix"** rather than "symptom → hypothesis → fix" when encountering bugs/failures/abnormal behavior. Proceeds in 4 phases: `investigate → analyze → hypothesize → implement`.

## Getting Started

```bash
/investigate
```

**SKILL.md location**: `~/.claude/skills/investigate/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: After deploying the Student Club Notice Board, even when logged in with an officer account, a "No Permission" page appears at `/notices/new`. It worked fine locally. The cause is unknown.

**1) Investigate — Fact Collection**

```bash
# Fact collection checklist
- Browser Network tab: /notices/new request redirects with 403
- Vercel logs: "User role check failed: role = null"
- Local DB profiles table: the user's row exists, role = 'officer'
- Production DB profiles table: ??? (not checked yet)
```

At this stage, do **not form hypotheses**. Suppress guesses like "maybe it's a Supabase bug?"

**2) Analyze — Weaving the Facts**

```
Locally, profiles.role reads as 'officer'.
In production, 'role = null' is printed in the logs.
→ "There is a point where the role column is being read as null"
```

**3) Hypothesize — List Possible Causes**

| # | Hypothesis | Verification Method |
|---|-----------|---------------------|
| H1 | The user's profiles row does not exist in the production DB (FK mismatch) | Run `select * from profiles where id = ?` in the production DB |
| H2 | The profiles table in the production DB does not have the role column (missing migration) | Check production DB schema |
| H3 | Middleware is not reading SSR cookies correctly (missing environment variable) | Check SUPABASE_URL, ANON_KEY in Vercel environment variables |
| H4 | RLS policies behave differently in the production build | Run query directly in Supabase SQL Editor |

Hypotheses can be many. The important thing is that **each hypothesis must have a verifiable procedure**.

**4) Implement — Fix Only the Confirmed Cause**

Checking the production DB shows that the `profiles` table has a row, but `role` is `null`. Locally, the seed had inserted `'officer'` during development, but the seed was never run in production. **H1 confirmed as the cause.**

```sql
-- Run in production DB (better to manage this as a migration file)
update profiles set role = 'officer'
where email = 'leader@example.com';
```

And to prevent recurrence, create a separate task to add a **trigger that automatically inserts the default role of 'member' at signup**.

```sql
-- supabase/migrations/0002_profile_defaults.sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

**Important**: A symptom patch like "treat role as member if it's null" was not added to `middleware.ts` or `auth.ts`. That would only hide the root problem (missing seed).

## Learning Points / Common Pitfalls

- **Don't skip the phase of collecting facts without hypotheses**: Humans (and LLMs) want to interpret at the same time as observing. The value of the investigate skill lies in consciously separating this impulse.
- **The temptation of symptom patches**: "Just wrap it in try/catch to clear the red light for now" is the most common pitfall in student assignments. The same bug comes back the next week in a different form.
- **Next.js 15 tip**: Bugs caused by differences between local and production are extremely common in Next.js projects. Environment variables, build mode, cache, RSC serialization — put these four on the suspect list always.
- **Hypotheses must come paired with verification procedures**: "It seems like it might be ~" is not a hypothesis, it's a guess. A hypothesis must be accompanied by a concrete procedure like "this can be verified by running this query."

## Related Resources

- [systematic-debugging](./systematic-debugging.md) — In-depth debugging methodology (complementary to Investigate)
- [freeze](./freeze.md) — Gain focus by restricting edit scope during debugging
- [health](./health.md) — Comprehensive code quality check (tracking bug frequency)

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
