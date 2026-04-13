---
title: "Auto Test Hook (auto-test)"
lang: en
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (based on documentation)"
last_reviewed: "2026-04-12"
tags: ["hooks", "automation", "vitest", "testing", "TDD", "PostToolUse"]
---

# Auto Test Hook (auto-test)

## One-Line Summary

Automatically runs Vitest every time Claude modifies a source file or test file, making it easy to practice the TDD cycle alongside Claude.

## When Should You Use This?

- When you want to immediately verify that tests pass while having Claude implement a feature
- When you want to embed the TDD (Red → Green → Refactor) cycle into Claude's workflow
- When you want to verify in real time that existing tests don't break when Claude refactors code
- When you want to feed test results back to Claude immediately and build an automatic fix loop

## Core Concepts / How It Works

The `PostToolUse` hook runs Vitest after file-modifying tools (`Write`, `Edit`, `MultiEdit`) execute. Test results (pass/fail) can influence Claude's next response, allowing a loop where Claude automatically fixes code upon test failure.

TDD automation flow:
```
User → "Implement the notice list API with tests"
  → Claude: Write test file first (Red stage)
    → PostToolUse hook: pnpm test --run
      → Deliver test failure result to Claude
  → Claude: Write implementation file (Green stage)
    → PostToolUse hook: pnpm test --run
      → Confirm tests pass
  → Claude: Refactor (Refactor stage)
    → PostToolUse hook: pnpm test --run
      → Confirm tests still pass
```

How hook results are delivered to Claude:
- The stdout/stderr content of the hook is added to Claude's context
- When a test failure message is delivered, Claude recognizes it and may attempt a fix

## Practical Example

**Scenario**: Implementing a notice API utility function using TDD in the Next.js 15 "Student Club Notice Board" project

### `.claude/settings.json` Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/auto-test.sh \"$CLAUDE_TOOL_INPUT_PATH\""
          }
        ]
      }
    ]
  }
}
```

### `scripts/auto-test.sh` Script

```bash
#!/usr/bin/env bash
# PostToolUse hook: automatically run related Vitest tests after file modification
# Argument: $1 = modified file path

set -e

FILE="$1"
PROJECT_ROOT="/workspace"  # Change to your project root path

# Check file path
if [ -z "$FILE" ]; then
  exit 0
fi

# Determine whether to run tests
should_run_test() {
  local file="$1"
  case "$file" in
    # The test file itself was modified
    *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx)
      return 0
      ;;
    # Source file modified → check if related test exists
    *.ts|*.tsx)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Exit if not a test target
if ! should_run_test "$FILE"; then
  echo "[auto-test] Not a test target, skipping: $FILE"
  exit 0
fi

echo "[auto-test] Running tests... (modified file: $FILE)"
echo "────────────────────────────────────"

# Find related test files for the modified file
BASENAME=$(basename "$FILE" | sed 's/\.[^.]*$//')  # Remove extension
DIRNAME=$(dirname "$FILE")

# Related test file path candidates
TEST_CANDIDATES=(
  "${DIRNAME}/${BASENAME}.test.ts"
  "${DIRNAME}/${BASENAME}.test.tsx"
  "${DIRNAME}/__tests__/${BASENAME}.test.ts"
  "${DIRNAME}/__tests__/${BASENAME}.test.tsx"
)

# If a related test file exists, run only that file (faster)
for TEST_FILE in "${TEST_CANDIDATES[@]}"; do
  if [ -f "$TEST_FILE" ]; then
    echo "[auto-test] Related test file found: $TEST_FILE"
    cd "$PROJECT_ROOT" && pnpm test --run "$TEST_FILE" 2>&1
    TEST_EXIT=$?
    if [ $TEST_EXIT -eq 0 ]; then
      echo "────────────────────────────────────"
      echo "[auto-test] Tests passed"
    else
      echo "────────────────────────────────────"
      echo "[auto-test] Tests failed (exit: $TEST_EXIT)"
    fi
    exit $TEST_EXIT
  fi
done

# If no related test file, run full test suite
echo "[auto-test] No related test file found → running full test suite"
cd "$PROJECT_ROOT" && pnpm test --run 2>&1
TEST_EXIT=$?

echo "────────────────────────────────────"
if [ $TEST_EXIT -eq 0 ]; then
  echo "[auto-test] All tests passed"
else
  echo "[auto-test] All tests failed (exit: $TEST_EXIT)"
fi

exit $TEST_EXIT
```

### Real Usage Scenario

Request to Claude:
```
Write a formatNoticeDate() function using TDD that converts
a notice date to "YYYY/MM/DD" format.
```

Claude execution order:
```
1. Write packages/utils/formatNoticeDate.test.ts
   → auto-test.sh runs → Tests fail (Red)
   → Claude: "Tests are failing. Writing the implementation now."

2. Write packages/utils/formatNoticeDate.ts
   → auto-test.sh runs → Tests pass (Green)
   → Claude: "All tests are passing."

3. Cleanup code (Refactor)
   → auto-test.sh runs → Still passing confirmed
```

### Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use --run mode instead of watch mode in auto-test hooks
    // Run in the same environment as CI
    reporters: ['verbose'],
    // Timeout: configure so hooks don't run too long
    testTimeout: 10000,
  },
})
```

## Learning Points / Common Pitfalls

- **`--run` flag is required**: Vitest's default mode is watch mode. When running from a hook, you must append `--run` so it exits after a single run. Without it, the hook will run forever.
- **Full suite vs. related tests**: Running the full test suite on every file modification is slow. It's more efficient to find the related test file by the modified file's name and run only that.
- **Test failure does not block Claude**: Even if the `PostToolUse` hook exits with code 1, Claude's task is not fully interrupted. Only exit code 2 blocks tool execution. Test failure is delivered to Claude as feedback.
- **Large test suites**: If you have hundreds of tests, every file save could take several minutes. Lower `testTimeout`, separate slow tests, or make the related-test-only logic more precise.
- **Paths in monorepos**: In a pnpm workspace monorepo, you may need to navigate to the relevant package directory before running: `cd packages/utils && pnpm test --run`.

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| License | CC BY 4.0 |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
