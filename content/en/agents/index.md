---
title: "Agents"
category: agents
lang: en
source_url: "https://docs.anthropic.com/en/docs/claude-code/sub-agents"
source_author: "Anthropic & Community"
license: "Varies by agent"
last_reviewed: "2026-04-12"
tags: ["agents", "sub-agent", "index"]
---

# Agent Pattern Guide

> This guide explains **Sub-agent / Multi-agent patterns** in Claude Code through the context of student projects. It covers how to separate complex tasks into isolated agents and process them in parallel for greater efficiency.

<CardGrid>
  <CardItem
    title="Explore Agent"
    tag="Exploration"
    summary="Specialized agent for quickly exploring a codebase — file pattern search, keyword analysis, structure understanding"
    link="/en/agents/explore-agent"
  />
  <CardItem
    title="Plan Agent"
    tag="Planning"
    summary="Agent dedicated to creating implementation plans — step-by-step planning, key file identification, architecture trade-offs"
    link="/en/agents/plan-agent"
  />
  <CardItem
    title="Parallel Dispatch"
    tag="Parallelization"
    summary="Distribute multiple independent tasks to concurrent agents for processing — maximizing speed and parallelism"
    link="/en/agents/parallel-dispatch"
  />
  <CardItem
    title="GSTACK Role Agents"
    tag="Role-Based"
    summary="Separate agents by role: frontend, backend, QA — automating large-scale full-stack projects"
    link="/en/agents/gstack-roles"
  />
</CardGrid>

## Sub-agent Basic Pattern

```text
# Main agent prompt example
Process the following 3 independent tasks in parallel:
1. [Task A] — Use Explore agent to understand code structure
2. [Task B] — Use Plan agent to create implementation plan
3. [Task C] — Auto-generate test code
Combine each result to create the final implementation plan.
```

Related skills: [Dispatching Parallel Agents](/skills/dispatching-parallel-agents), [Subagent-Driven Development](/skills/subagent-driven-development)

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/sub-agents |
| License | Varies by agent |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
