---
title: "Work Log Hook (work-log)"
lang: en
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (based on documentation)"
last_reviewed: "2026-04-12"
tags: ["hooks", "automation", "logging", "audit", "tracking", "PostToolUse"]
---

# Work Log Hook (work-log)

## One-Line Summary

Automatically records all tool usage by Claude with timestamps into `.claude/work.log`, enabling work history tracking.

## When Should You Use This?

- When you need to track which files Claude modified and when
- When you want to review "what did Claude do?" after a long session
- When you need to keep an audit trail of AI-made changes in a team project
- When Claude's work doesn't match expectations and you want to investigate the cause by reviewing logs

## Core Concepts / How It Works

The `PostToolUse` hook is called whenever Claude executes any tool. When the hook runs, Claude provides the current tool name (`CLAUDE_TOOL_NAME`), input values (`CLAUDE_TOOL_INPUT_*`), and other details as environment variables. Appending these to a file builds up the complete work history.

Example log structure:
```
2026-04-12T14:23:05+09:00 | Write       | frontend/components/NoticeList.tsx
2026-04-12T14:23:12+09:00 | Bash        | pnpm test --run
2026-04-12T14:23:45+09:00 | Edit        | frontend/components/NoticeList.tsx
2026-04-12T14:24:01+09:00 | Read        | frontend/components/NoticeCard.tsx
```

Writing to the log file does not affect Claude's actual work. It operates purely for observation purposes.

## Practical Example

**Scenario**: Keeping a log of all file operations and command executions that occur during a Claude session in the Next.js 15 "Student Club Notice Board" project

### `.claude/settings.json` Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/work-log.sh"
          }
        ]
      }
    ]
  }
}
```

`matcher: ".*"` is a pattern that responds to all tools. To log only specific tools, narrow it down like `"Write|Edit|Bash"`.

### `scripts/work-log.sh` Script

```bash
#!/usr/bin/env bash
# PostToolUse hook: Record all Claude tool executions in work.log

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
LOG_DIR="/workspace/.claude"
LOG_FILE="${LOG_DIR}/work.log"
MAX_LOG_SIZE_MB=10  # Maximum log file size (MB)

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# ─────────────────────────────────────────────
# Extract information from environment variables
# ─────────────────────────────────────────────
TOOL_NAME="${CLAUDE_TOOL_NAME:-unknown}"
TIMESTAMP=$(date '+%Y-%m-%dT%H:%M:%S%z')  # ISO 8601

# Extract key info by tool type
case "$TOOL_NAME" in
  Write|Edit|MultiEdit)
    DETAIL="${CLAUDE_TOOL_INPUT_PATH:-}"
    ;;
  Bash)
    # Entire command may be long — record only the first 80 characters
    RAW_CMD="${CLAUDE_TOOL_INPUT_COMMAND:-}"
    DETAIL="${RAW_CMD:0:80}"
    if [ ${#RAW_CMD} -gt 80 ]; then
      DETAIL="${DETAIL}..."
    fi
    ;;
  Read)
    DETAIL="${CLAUDE_TOOL_INPUT_PATH:-}"
    ;;
  Glob|Grep)
    DETAIL="${CLAUDE_TOOL_INPUT_PATTERN:-}  [in: ${CLAUDE_TOOL_INPUT_PATH:-}]"
    ;;
  *)
    DETAIL=""
    ;;
esac

# ─────────────────────────────────────────────
# Check log file size (log rotation)
# ─────────────────────────────────────────────
if [ -f "$LOG_FILE" ]; then
  LOG_SIZE_MB=$(du -m "$LOG_FILE" | cut -f1)
  if [ "${LOG_SIZE_MB:-0}" -ge "$MAX_LOG_SIZE_MB" ]; then
    # Back up existing log as .old and start a new file
    mv "$LOG_FILE" "${LOG_FILE}.old"
    echo "[work-log] Log file rotated: moved to ${LOG_FILE}.old" >> "$LOG_FILE"
  fi
fi

# ─────────────────────────────────────────────
# Write log entry
# ─────────────────────────────────────────────
printf "%-35s | %-15s | %s\n" \
  "$TIMESTAMP" \
  "$TOOL_NAME" \
  "$DETAIL" >> "$LOG_FILE"

exit 0
```

### Log Viewing Script (`scripts/show-work-log.sh`)

```bash
#!/usr/bin/env bash
# View only today's work log

LOG_FILE="/workspace/.claude/work.log"
TODAY=$(date '+%Y-%m-%d')

echo "=== Claude Work Log ($TODAY) ==="
echo ""

if [ -f "$LOG_FILE" ]; then
  grep "^${TODAY}" "$LOG_FILE" || echo "(No entries for today)"
else
  echo "Log file not found: $LOG_FILE"
fi
```

### Example Log Output

```
2026-04-12T14:20:01+0900    | Read            | frontend/app/page.tsx
2026-04-12T14:20:05+0900    | Glob            | **/*.tsx  [in: frontend/]
2026-04-12T14:20:15+0900    | Write           | frontend/components/notices/NoticeList.tsx
2026-04-12T14:20:22+0900    | Write           | frontend/components/notices/NoticeCard.tsx
2026-04-12T14:20:35+0900    | Bash            | pnpm test --run packages/...
2026-04-12T14:20:50+0900    | Edit            | frontend/components/notices/NoticeList.tsx
2026-04-12T14:21:03+0900    | Bash            | git add frontend/components/notices/
```

### `.gitignore` Configuration

```
# Claude work logs (may differ per local environment)
.claude/work.log
.claude/work.log.old
```

If your team wants a shared audit log, you can remove these from `.gitignore` and commit them.

## Learning Points / Common Pitfalls

- **Verify environment variable names**: The exact variable names such as `CLAUDE_TOOL_NAME` and `CLAUDE_TOOL_INPUT_PATH` must be checked in the Hooks reference section of the Claude Code official documentation. Variable names may change across versions.
- **Manage log file size**: Logs can grow to tens of megabytes in large sessions. Design log rotation or per-date file splitting from the start.
- **Watch for sensitive information**: API keys or passwords may appear in Bash command logs. When logging full commands, make sure environment variable values are not included, and add the log file to `.gitignore`.
- **Minimize performance impact**: File I/O occurs on every tool execution, so keep the script as lightweight as possible. A single `printf` append per line has virtually no overhead.
- **`matcher: ".*"` scope**: Logging all tools includes read-only tools like `Read` and `Glob`. If you only want to log modification tools, narrow to `"Write|Edit|MultiEdit|Bash"` for a cleaner log.

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| License | CC BY 4.0 |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
