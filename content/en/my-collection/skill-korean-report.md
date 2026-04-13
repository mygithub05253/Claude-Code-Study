---
title: "Korean Report Writing Custom Skill"
category: "my-collection"
tags: ["Skills", "report", "custom", "university students"]
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study Community"
license: "MIT"
last_reviewed: "2026-04-13"
lang: en
---

# Korean Report Writing Custom Skill

## Core Concepts / How It Works

```mermaid
flowchart TD
  A[/korean-report skill invocation] --> B[Analyze project context]
  B --> C{Detect report type}
  C --> D[Technical report]
  C --> E[Meeting minutes]
  C --> F[Project progress report]
  D --> G[Structured Korean Markdown]
  E --> G
  F --> G
  G --> H[Include tables/charts/code blocks]
  H --> I[Final report output]
```

This skill, saved as `~/.claude/skills/korean-report.md`, uses Claude Code's custom skill feature. Invoking `/korean-report` automatically generates a Korean-language report tailored to the current project context.

## One-Line Summary

A single `/korean-report` skill call automatically generates project status updates, technical documentation, and meeting minutes in Korean Markdown format, supporting university assignments and team communication.

## Getting Started

Create the `~/.claude/skills/korean-report.md` file:

```markdown
---
name: korean-report
description: Write project status/technical reports/meeting minutes in Korean Markdown
---

Analyze the current project context and write the requested type of Korean report.

## Report Writing Rules
1. All content written in **Korean**
2. Use Markdown format (GitHub Flavored Markdown)
3. Headings start from ## (h2)
4. Code blocks with language specified (```typescript, ```java, etc.)
5. Numbers/dates clearly stated

## Supported Report Types
- **Technical report**: implementation details, tech stack, architecture diagrams
- **Progress report**: completed items, in-progress, next plans
- **Meeting minutes**: date/time, attendees, discussion, decisions, action items

## Output Format Example (Progress Report)
---
**Project Name**: [Project Name]
**Report Date**: [KST Date]
**Author**: [Author Name]

### This Week's Completed Items
- [ ] Item 1
- [x] Item 2 ✅

### Next Week's Plan
1. Plan 1
2. Plan 2

### Issues/Risks
| Issue | Impact | Resolution |
|-------|--------|-----------|
| ... | High/Medium/Low | ... |
---

Please tell me the report type you need and any additional information.
```

## Practical Example

**Generating a weekly report for the Student Club Notice Board project**:

```
User: /korean-report write this week's development progress report

Claude output:
---
**Project Name**: Student Club Notice Board
**Report Date**: 2026-04-13 (KST)
**Author**: Development Team

### This Week's Completed Items
- [x] Notice CRUD API implementation (Spring Boot) ✅
- [x] Next.js 15 notice list page implementation ✅
- [x] Supabase Auth social login integration ✅

### In Progress
- [ ] Image upload feature (Supabase Storage)
- [ ] Real-time notifications (Supabase Realtime)

### Next Week's Plan
1. Complete image upload
2. Implement admin dashboard
3. Configure deployment environment (Vercel + Railway)

### Issues
| Issue | Impact | Resolution |
|-------|--------|-----------|
| N+1 query | High | Plan to apply Fetch Join |
---
```

## Learning Points / Common Pitfalls

**Skill file location**:
- Global: `~/.claude/skills/korean-report.md`
- Project-specific: `.claude/skills/korean-report.md` (project root)

**Common pitfalls**:
- Skill names cannot have spaces → use hyphens (-)
- Skill files that are too long → wasted prompt tokens
- Calling without project context → report content becomes too generic

## Related Resources

- [Custom Skill Writing Prompt](/en/prompts/write-custom-skill.md)
- [Next.js CLAUDE.md Template](/en/my-collection/custom-claude-md-nextjs.md)
- [Skills Hub](/en/skills/)

## Source & Attribution

| Field | Value |
|-------|-------|
| Source URL | https://github.com/mygithub05253/Claude-Code-Study |
| Author | Claude-Code-Study Community |
| License | MIT |
| Translation Date | 2026-04-13 |
| Category | my-collection / custom skills |
