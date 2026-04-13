---
title: "Skill Guide"
category: skills
lang: en
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic & Community"
license: "Varies by skill"
last_reviewed: "2026-04-12"
tags: ["skills", "index"]
---

# Claude Code Skill Guide

> English explanations of **48 official skills** built into Claude Code, from the perspective of university students. Invokable instantly via slash commands (`/skill-name`).

## Planning / Design

<CardGrid>
  <CardItem
    title="Brainstorming"
    tag="Planning/Design"
    summary="Explore user intent and requirements with structured questions before creative work"
    link="/skills/brainstorming"
  />
  <CardItem
    title="Writing Plans"
    tag="Planning/Design"
    summary="Systematically write an implementation plan before writing code"
    link="/skills/writing-plans"
  />
  <CardItem
    title="Executing Plans"
    tag="Planning/Design"
    summary="Step-by-step execution based on a plan + intermediate review checkpoints"
    link="/skills/executing-plans"
  />
  <CardItem
    title="CEO Review"
    tag="Planning/Design"
    summary="Identify plan problems + redefine scope from a CEO/founder perspective"
    link="/skills/plan-ceo-review"
  />
  <CardItem
    title="Design Review"
    tag="Planning/Design"
    summary="Evaluate and improve UI/UX plans from a designer's perspective"
    link="/skills/plan-design-review"
  />
  <CardItem
    title="Engineering Review"
    tag="Planning/Design"
    summary="Review architecture and execution plans from an engineering manager's perspective"
    link="/skills/plan-eng-review"
  />
  <CardItem
    title="Office Hours"
    tag="Planning/Design"
    summary="YC Office Hours-style startup/builder idea exploration in 2 modes"
    link="/skills/office-hours"
  />
  <CardItem
    title="Auto Plan Pipeline"
    tag="Planning/Design"
    summary="Automatically run CEO → Design → Eng reviews in sequence"
    link="/skills/autoplan"
  />
</CardGrid>

## Quality / Safety

<CardGrid>
  <CardItem
    title="Test-Driven Development"
    tag="Quality/Safety"
    summary="Tests first with Red-Green-Refactor cycle before implementing features"
    link="/skills/test-driven-development"
  />
  <CardItem
    title="Systematic Debugging"
    tag="Quality/Safety"
    summary="Systematic approach: identify root cause → validate hypothesis → fix"
    link="/skills/systematic-debugging"
  />
  <CardItem
    title="Investigate"
    tag="Quality/Safety"
    summary="4 stages: investigate → analyze → hypothesize → implement; no fix without root cause"
    link="/skills/investigate"
  />
  <CardItem
    title="Verification Before Completion"
    tag="Quality/Safety"
    summary="Must gather verification evidence with actual execution output before declaring completion"
    link="/skills/verification-before-completion"
  />
  <CardItem
    title="Careful Mode"
    tag="Quality/Safety"
    summary="Safety warning before destructive commands (rm -rf, DROP TABLE, force-push)"
    link="/skills/careful"
  />
  <CardItem
    title="Guard Mode"
    tag="Quality/Safety"
    summary="Full safety: directory restrictions + destructive command warnings applied simultaneously"
    link="/skills/guard"
  />
  <CardItem
    title="Freeze"
    tag="Quality/Safety"
    summary="Allow edits only in specific directories to block unintended file modifications"
    link="/skills/freeze"
  />
  <CardItem
    title="Unfreeze"
    tag="Quality/Safety"
    summary="Release edit restrictions set by freeze and restore full edit permissions"
    link="/skills/unfreeze"
  />
  <CardItem
    title="Security Auditor"
    tag="Quality/Safety"
    summary="Infrastructure-first security audit: secrets, dependencies, OWASP Top 10, STRIDE"
    link="/skills/cso"
  />
</CardGrid>

## Code Review / Feedback

<CardGrid>
  <CardItem
    title="PR Review"
    tag="Code Review"
    summary="Before merging: review SQL safety, LLM trust boundaries, and side effect structures"
    link="/skills/review"
  />
  <CardItem
    title="Requesting Code Review"
    tag="Code Review"
    summary="Self-validation + ensure technical rigor before requesting a code review"
    link="/skills/requesting-code-review"
  />
  <CardItem
    title="Receiving Code Review"
    tag="Code Review"
    summary="No blind acceptance after receiving feedback; implement after technical review"
    link="/skills/receiving-code-review"
  />
  <CardItem
    title="Codex CLI"
    tag="Code Review"
    summary="OpenAI Codex CLI 3 modes: review, adversarial testing, consult"
    link="/skills/codex"
  />
</CardGrid>

## Deployment / Release

<CardGrid>
  <CardItem
    title="Ship"
    tag="Deployment/Release"
    summary="Full automation: test → review → version bump → CHANGELOG → PR creation"
    link="/skills/ship"
  />
  <CardItem
    title="Finishing a Development Branch"
    tag="Deployment/Release"
    summary="After implementation, guide to the best integration method among merge, PR, and cleanup"
    link="/skills/finishing-a-development-branch"
  />
  <CardItem
    title="Land and Deploy"
    tag="Deployment/Release"
    summary="PR merge → wait for CI → deploy → verify production canary"
    link="/skills/land-and-deploy"
  />
  <CardItem
    title="Setup Deploy"
    tag="Deployment/Release"
    summary="Auto-detect and configure deployment platforms (Fly.io, Vercel, Netlify, etc.)"
    link="/skills/setup-deploy"
  />
  <CardItem
    title="Document Release"
    tag="Deployment/Release"
    summary="Update documentation (README, ARCHITECTURE, CHANGELOG, etc.) after release"
    link="/skills/document-release"
  />
</CardGrid>

## Browser / QA

<CardGrid>
  <CardItem
    title="Browse"
    tag="Browser/QA"
    summary="Headless browser navigation, element manipulation, screenshots, responsive testing"
    link="/skills/browse"
  />
  <CardItem
    title="GSTACK"
    tag="Browser/QA"
    summary="Browser QA: page navigation, state validation, before/after diff"
    link="/skills/gstack"
  />
  <CardItem
    title="GSTACK Upgrade"
    tag="Browser/QA"
    summary="Upgrade gstack to the latest version + check changes"
    link="/skills/gstack-upgrade"
  />
  <CardItem
    title="Connect Chrome"
    tag="Browser/QA"
    summary="Control actual Chrome with gstack, auto-load Side Panel extension"
    link="/skills/connect-chrome"
  />
  <CardItem
    title="Setup Browser Cookies"
    tag="Browser/QA"
    summary="Import Chromium cookies into headless session for authentication testing"
    link="/skills/setup-browser-cookies"
  />
  <CardItem
    title="QA Test + Fix"
    tag="Browser/QA"
    summary="Web app QA then iterative bug fixing and validation + atomic commits"
    link="/skills/qa"
  />
  <CardItem
    title="QA Report Only"
    tag="Browser/QA"
    summary="Report-only QA that generates bug reports without making fixes"
    link="/skills/qa-only"
  />
  <CardItem
    title="Performance Benchmark"
    tag="Browser/QA"
    summary="Detect performance regressions: page load, Core Web Vitals, resource size"
    link="/skills/benchmark"
  />
</CardGrid>

## Design

<CardGrid>
  <CardItem
    title="Design Consultation"
    tag="Design"
    summary="Product understanding → design system proposal → write DESIGN.md consulting"
    link="/skills/design-consultation"
  />
  <CardItem
    title="Design HTML Implementation"
    tag="Design"
    summary="Implement approved mockups as production-grade HTML/CSS"
    link="/skills/design-html"
  />
  <CardItem
    title="Design Review"
    tag="Design"
    summary="Find visual inconsistencies, spacing, and hierarchy issues → atomic fixes and validation"
    link="/skills/design-review"
  />
  <CardItem
    title="Design Shotgun"
    tag="Design"
    summary="Generate multiple AI design variants → comparison board → feedback and iteration"
    link="/skills/design-shotgun"
  />
</CardGrid>

## Agents / Parallelization

<CardGrid>
  <CardItem
    title="Dispatching Parallel Agents"
    tag="Agents"
    summary="Distribute 2 or more independent tasks to parallel agents for processing"
    link="/skills/dispatching-parallel-agents"
  />
  <CardItem
    title="Subagent-Driven Development"
    tag="Agents"
    summary="Run independent tasks in parallel as sub-agents from the current session"
    link="/skills/subagent-driven-development"
  />
  <CardItem
    title="Using Git Worktrees"
    tag="Agents"
    summary="Create and manage Git Worktrees for task isolation"
    link="/skills/using-git-worktrees"
  />
  <CardItem
    title="Checkpoint"
    tag="Agents"
    summary="Save task state → resume from exactly the same position later"
    link="/skills/checkpoint"
  />
</CardGrid>

## Meta / Workflow

<CardGrid>
  <CardItem
    title="Using Superpowers"
    tag="Meta"
    summary="At conversation start, find skills and check usage + mandatory Skill tool invocation"
    link="/skills/using-superpowers"
  />
  <CardItem
    title="Writing Skills"
    tag="Meta"
    summary="Create and edit new skills + guide to verifying behavior before deployment"
    link="/skills/writing-skills"
  />
  <CardItem
    title="Learn Management"
    tag="Meta"
    summary="Review, search, organize, and export project learnings"
    link="/skills/learn"
  />
  <CardItem
    title="Weekly Retrospective"
    tag="Meta"
    summary="Weekly engineering retrospective analyzing commit history, work patterns, and code quality"
    link="/skills/retro"
  />
  <CardItem
    title="Code Health"
    tag="Meta"
    summary="Comprehensive quality dashboard: type check, linter, tests, unused code"
    link="/skills/health"
  />
  <CardItem
    title="Canary Monitoring"
    tag="Meta"
    summary="Monitor live app after deployment: console errors, performance regressions, page failures"
    link="/skills/canary"
  />
</CardGrid>

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic & Community |
| License | Varies by skill |
| Translation Date | 2026-04-12 |

> Check the `/skill-name` slash command and project integration methods on each skill's detail page.
