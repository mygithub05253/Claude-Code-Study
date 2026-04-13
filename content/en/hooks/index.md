---
title: "Hooks"
lang: en
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "Official documentation"
last_reviewed: "2026-04-12"
tags: ["hooks", "automation", "index"]
---

# Hooks Recipes

> **Hooks** is a feature that automatically executes shell commands on specific Claude Code events (before/after tool execution, notifications, etc.). Configured via the `hooks` field in `.claude/settings.json`.

<CardGrid>
  <CardItem
    title="Auto Formatting"
    tag="Code Quality"
    summary="Automatically run Prettier after file edits — using PostToolUse(Edit) event"
    link="/en/hooks/auto-format"
  />
  <CardItem
    title="Block Dangerous Commands"
    tag="Safety"
    summary="Block destructive commands like rm -rf, DROP TABLE, force-push via PreToolUse"
    link="/en/hooks/block-dangerous"
  />
  <CardItem
    title="Completion Notification"
    tag="Productivity"
    summary="Desktop notification on task completion — check results after working on something else"
    link="/en/hooks/notify-complete"
  />
  <CardItem
    title="Auto Test"
    tag="Code Quality"
    summary="Automatically run tests when test files change — using PostToolUse(Write)"
    link="/en/hooks/auto-test"
  />
  <CardItem
    title="Work Log"
    tag="Productivity"
    summary="Automatically record file modification history to a log file — useful for audit trails and recovery"
    link="/en/hooks/work-log"
  />
</CardGrid>

## Basic Hooks Configuration Structure

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "prettier --write $CLAUDE_FILE_PATH" }
        ]
      }
    ]
  }
}
```

Event types: `PreToolUse`, `PostToolUse`, `Notification`, `Stop`

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| License | Anthropic Official Documentation (reference only) |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |

> Hooks automatically execute shell commands, so misconfiguration can have destructive consequences. Always test in a safe environment first.
