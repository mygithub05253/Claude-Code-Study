---
title: "General-Purpose Prompt Collection"
category: prompts
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study Project"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["prompts", "templates", "index"]
lang: en
---

# Claude Code General-Purpose Prompt Collection

> **English prompt templates** you can copy and use immediately when working with external resources (MCP / repos / Skills / Hooks / Agents) in Claude Code.

<CardGrid>
  <CardItem
    title="Install New MCP Server"
    tag="MCP"
    summary="MCP server description → prerequisites → settings.json config → test commands → usage examples"
    link="#1-install-new-mcp-server"
  />
  <CardItem
    title="Analyze External GitHub Repo"
    tag="Repo"
    summary="Comprehensive prompt for analyzing repo purpose, stack, structure, usage steps, variation scenarios, and license"
    link="#2-analyze-external-github-repo"
  />
  <CardItem
    title="Write Custom Skill"
    tag="Skill"
    summary="Purpose-based SKILL.md writing → trigger conditions → step-by-step instructions → execution examples"
    link="#3-write-custom-skill"
  />
  <CardItem
    title="Configure Hooks"
    tag="Hooks"
    summary="Select event → set matcher → generate settings.json → verify behavior"
    link="#4-configure-hooks"
  />
  <CardItem
    title="Configure Sub-agent Pattern"
    tag="Agents"
    summary="Role separation → task scope → communication method → prompt chain → error recovery"
    link="#5-configure-sub-agent-pattern"
  />
  <CardItem
    title="Repo + MCP + Hooks Integrated Setup"
    tag="Integrated"
    summary="After clone: write CLAUDE.md → recommend MCP → configure Hooks → add skills → workflow"
    link="#6-repo--mcp--hooks-integrated-setup"
  />
</CardGrid>

---

## 1. Install New MCP Server

```text
I want to connect the [MCP server name] MCP server to Claude Code.
1. Explain in one line what this MCP server does
2. Tell me the prerequisites for installation
3. Show the exact JSON config to add to .claude/settings.json
4. Give me a test command to verify it works after installation
5. Give me examples of how to use it in a university project
```

## 2. Analyze External GitHub Repo

```text
Please analyze this GitHub repository: [repo URL]
1. Summarize the purpose and core features in one line
2. List the tech stack (language, framework, dependencies)
3. Explain the directory structure and key files
4. Provide a step-by-step guide for using it after cloning in Claude Code
5. Give 3 scenarios where a university student could modify this repo for their own use
6. Check the license and any points to be aware of
```

## 3. Write Custom Skill

```text
I want to create my own Claude Code Skill.
Purpose: [specific purpose]
1. Write a SKILL.md file in .claude/skills/
2. Clearly describe trigger conditions in the description
3. Include step-by-step instructions in the body
4. Provide 3 example execution prompts
5. Explain how to test it
```

## 4. Configure Hooks

```text
I want to configure Claude Code hooks.
Purpose: [specific purpose]
1. Select the appropriate hook event (PreToolUse/PostToolUse/Notification, etc.)
2. Set the matcher pattern
3. Generate the exact JSON to add to .claude/settings.json
4. How to test that it's working
5. Possible issues when misconfigured and how to resolve them
```

## 5. Configure Sub-agent Pattern

```text
I want to use the sub-agent pattern in Claude Code.
Project context: [project description]
1. Separate main/sub agent roles
2. Define each agent's task scope
3. Agent-to-agent communication / result passing method
4. Prompt chain for actual execution
5. Recovery strategy when errors occur
```

## 6. Repo + MCP + Hooks Integrated Setup

```text
I want to clone [GitHub repo URL] and develop with Claude Code.
Please set up an optimized Claude Code environment for this project:
1. Write a CLAUDE.md file tailored to the project
2. Recommend necessary MCP servers + settings.json configuration
3. Configure code quality hooks (formatting, linting, testing)
4. Suggest useful custom Skills to add
5. Step-by-step development workflow summary
```

---

| Field | Value |
|-------|-------|
| License | MIT |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |

> Replace the `[bracketed]` parts of each prompt with your own situation before using.
