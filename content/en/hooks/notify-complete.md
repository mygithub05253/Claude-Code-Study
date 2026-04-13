---
title: "Task Completion Notification Hook (notify-complete)"
lang: en
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (based on documentation)"
last_reviewed: "2026-04-12"
tags: ["hooks", "automation", "notification", "notify", "stop", "windows"]
---

# Task Completion Notification Hook (notify-complete)

## One-Line Summary

When Claude finishes a long task, the `Stop` hook instantly notifies you via a Windows notification or console message.

## When Should You Use This?

- When you miss the completion of a long refactoring or bulk file generation that you delegated to Claude while working on something else
- When you want to run the terminal in the background and receive a signal when it's done
- When you need to check results immediately after a time-consuming task like test execution or a build
- When you are in Focus Mode and only want notifications for Claude task completions

## Core Concepts / How It Works

The `Stop` hook runs when Claude has **fully finished responding and stopped**. It is the last point in the agent loop.

Operation flow:
```
Claude → All tool executions complete → Final response output
  → Stop hook triggered
    → Notification command runs (Windows Toast / sound / message)
  → Notification shown to user
```

Characteristics of the `Stop` hook:
- Runs in both cases: when Claude completes normally and when it stops due to an error
- The hook's exit code is ignored (blocking is not possible since execution is already complete)
- Content printed to stderr is not shown in the Claude session (for logging purposes only)

## Practical Example

**Scenario**: Receive a notification when Claude completes a large-scale component refactoring in the Next.js 15 "Student Club Notice Board" project

### `.claude/settings.json` Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/notify-complete.sh"
          }
        ]
      }
    ]
  }
}
```

### `scripts/notify-complete.sh` Script (Windows Git Bash Environment)

```bash
#!/usr/bin/env bash
# Stop hook: Send Windows notification when Claude task completes
# For Windows 11 + Git Bash environment

TITLE="Claude Code Complete"
MESSAGE="Task finished! Please return to the terminal."

# ─────────────────────────────────────────────
# Method 1: Windows Toast notification via PowerShell
# ─────────────────────────────────────────────
notify_windows_toast() {
  powershell.exe -NoProfile -Command "
    \$ErrorActionPreference = 'SilentlyContinue'
    Add-Type -AssemblyName System.Windows.Forms
    \$balloon = New-Object System.Windows.Forms.NotifyIcon
    \$balloon.Icon = [System.Drawing.SystemIcons]::Information
    \$balloon.BalloonTipIcon = 'Info'
    \$balloon.BalloonTipTitle = '${TITLE}'
    \$balloon.BalloonTipText = '${MESSAGE}'
    \$balloon.Visible = \$true
    \$balloon.ShowBalloonTip(5000)
    Start-Sleep -Seconds 1
  " 2>/dev/null
}

# ─────────────────────────────────────────────
# Method 2: Windows msg command (simple, always works)
# ─────────────────────────────────────────────
notify_msg() {
  msg.exe "%USERNAME%" "${TITLE}: ${MESSAGE}" 2>/dev/null || true
}

# ─────────────────────────────────────────────
# Method 3: Beep + console output (fallback when notifications fail)
# ─────────────────────────────────────────────
notify_beep() {
  # Terminal bell sound
  echo -e "\a"
  # Print completion message to console (with timestamp)
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[notify-complete] ${TIMESTAMP} — Claude task complete"
}

# ─────────────────────────────────────────────
# Execute: Toast → fallback to msg → final fallback bell
# ─────────────────────────────────────────────
if notify_windows_toast; then
  echo "[notify-complete] Windows Toast notification sent"
elif notify_msg; then
  echo "[notify-complete] msg notification sent"
else
  notify_beep
fi

exit 0
```

### Simpler PowerShell-Only Version

If Git Bash is inconvenient, you can call PowerShell directly from `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NoProfile -WindowStyle Hidden -Command \"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.ShowBalloonTip(4000, 'Claude Code', 'Task complete!', 'Info')\""
          }
        ]
      }
    ]
  }
}
```

### Real Usage Scenario

```
# User: "Refactor all components in the notice board (estimated 15 minutes)"
# → Claude starts working
# → User switches to another window and works on something else
# → 15 minutes later, Claude finishes
# → Windows notification popup: "Claude Code Complete - Task finished!"
# → User returns to the terminal and checks the results
```

## Learning Points / Common Pitfalls

- **`Stop` vs `PostToolUse` difference**: `PostToolUse` runs after each individual tool execution, while `Stop` runs only once when the entire Claude session ends. `Stop` is the right choice for completion notifications.
- **Windows msg.exe restrictions**: `msg.exe` works on Windows Home editions too, but may not function in Remote Desktop sessions or certain environments. It is recommended to try the Toast notification method first.
- **Runs even on interruption**: The `Stop` hook may run even when Claude is interrupted with `Ctrl+C` or terminates with an error, not just when it completes normally. You can check the exact completion status via the `CLAUDE_STOP_REASON` environment variable.
- **WSL (Windows Subsystem for Linux) environment**: Calling `powershell.exe` from WSL bash will trigger Windows GUI notifications. Works the same way as Git Bash.
- **macOS/Linux alternatives**: On macOS, replace with `osascript -e 'display notification "Done!" with title "Claude Code"'`; on Linux, use `notify-send "Claude Code" "Task complete"`.

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| License | CC BY 4.0 |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
