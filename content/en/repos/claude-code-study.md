---
title: "Claude-Code-Study"
category: repos
lang: en
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "mygithub05253 and contributors"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["repos", "claude-code", "korean", "study", "hub", "vitepress", "open-source"]
---

# Claude-Code-Study

## One-Line Summary

An open-source learning hub that explains and customizes Claude Code's Skills, MCP, Agents, and use cases in English and Korean, from the perspective of Korean university students.

## Why Should You Pay Attention?

- **Korean-language Specialization**: In a situation where Korean-language references for Claude Code are extremely scarce, this is the only comprehensive guide written at the level of university students
- **Unified Student Club Notice Board Context**: Instead of abstract examples, all examples are connected through a single context — "Next.js 15 Student Club Notice Board" — making the learning flow natural
- **Includes VitePress Documentation Site**: Provided as a searchable documentation site (deployed on GitHub Pages), not just a simple README
- **Open-Source Contribution Environment**: All content additions, translations, and code improvements can be contributed via PR

## Core Features

### Content Structure

```
content/ko/
├── skills/          # Korean explanations of 48 official Skills
├── mcp/             # MCP server explanations
├── hooks/           # Hooks recipe collection
├── agents/          # Sub-agent / Multi-agent patterns
├── repos/           # GitHub repo curation (the category this file belongs to)
├── use-cases/       # Category-specific university student use cases
├── my-collection/   # User-modified custom resources
└── prompts/         # General-purpose prompt templates
```

### Tech Stack

- **Documentation site**: VitePress 1.x + i18n (Korean first, English/Japanese planned)
- **Parser**: TypeScript + gray-matter + zod + fast-glob (automatic Skills YAML parsing)
- **Commentary generation**: Manual generation based on Claude Code CLI sessions + incremental regeneration with hash cache
- **Deployment**: GitHub Pages (`/Claude-Code-Study/` sub-path)
- **Monorepo**: pnpm workspace (`apps/*`, `packages/*`)

### Standard Commentary Page Structure

All commentary pages follow a 7-section structure:
1. Core Concepts / How It Works
2. One-Line Summary
3. Getting Started
4. Practical Example (Student Club Notice Board context)
5. Learning Points / Common Pitfalls
6. Related Resources
7. Source & Attribution

### Progress Stages (as of 2026-04-12)

| Phase | Content | Status |
|---|---|---|
| Phase 0 | Repo setup, monorepo, CI | Complete |
| Phase 1 | SKILL.md parser (48/48 success) | Complete |
| Phase 2 | Korean commentary for 10 P0 Skills | Complete |
| Phase 3 | VitePress site MVP | Complete |
| Phase 4 | GitHub Pages deployment | Complete |
| Phase 5 (P1) | 38 remaining Skills + MCP + Agents | In progress |

## University Student Use Cases

**Scenario**: A student starting the Next.js 15 "Student Club Notice Board" project for the first time, or encountering Claude Code for the first time.

**Scenario 1: Use as a Starting Point for Learning**

If you're just starting to use Claude Code, read the most basic skills (`brainstorming`, `executing-plans`, `review`) from the Skills section of this site first. Understanding the concepts in English first makes it faster to absorb the original English documentation.

**Scenario 2: Use as a Project Setup Guide**

When starting a full-stack project like a club notice board, check the "Web Development" category of the `use-cases` section for recommended Skills + MCP combinations to save time.

**Scenario 3: First Experience Contributing to Open Source**

Writing Claude Code-related content in English/Korean and submitting a PR gives you the experience of contributing to documentation that real users read. External open-source contribution history is useful for academic portfolios and resumes.

How to contribute:
1. Fork the repo
2. Write a markdown file in the appropriate category under `content/ko/` or `content/en/`
3. Mandatory inclusion of the attribution section in the Frontmatter
4. Submit a PR

**Scenario 4: Introduce Claude Code to Team Members**

At a team project kickoff meeting, share this site link with team members who say "I don't know what Claude Code is." They can grasp the context much faster than with English official documentation.

## Reference Links

- GitHub: https://github.com/mygithub05253/Claude-Code-Study
- Deployed site: https://mygithub05253.github.io/Claude-Code-Study/
- Claude Code official docs: https://docs.anthropic.com/en/docs/claude-code
- Related repo: https://github.com/hesreallyhim/awesome-claude-code

---

| Field | Value |
|---|---|
| Source URL | https://github.com/mygithub05253/Claude-Code-Study |
| License | MIT |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
