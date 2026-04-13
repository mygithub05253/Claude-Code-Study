---
title: "GStack Upgrade"
source: "~/.claude/skills/gstack-upgrade/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["gstack-upgrade", "GStack", "upgrade", "browser automation", "gstack"]
category: "Browser/QA"
---

# GStack Upgrade

## Core Concepts / How It Works

### How the Skill Works

This skill itself is very simple. It automatically detects two installation types and selects the appropriate upgrade method for each.

| Installation Type | Detection Criteria | Upgrade Method |
|-------------------|-------------------|----------------|
| Global Install | Global path detected via `npm list -g gstack` or `which gstack` | `npm install -g gstack@latest` |
| Vendored Install | `package.json` or `node_modules/.bin/gstack` exists in the project | `npm install gstack@latest` (or `pnpm`, `yarn`) |

After the upgrade is complete, a summary of changes (new version, key features, bug fixes) is printed.

### When to Use

- When explicitly requested: "upgrade gstack" or "update gstack to the latest version"
- When an error occurs saying the gstack version is too low when trying to use a new QA/browser/deployment skill
- When you want to keep gstack ecosystem skills up to date regularly

### Understanding the GStack Ecosystem

To understand the GStack Upgrade skill, you need to know what kind of ecosystem GStack is.

**GStack is the base browser automation engine for Claude Code skills.** The following skills depend on GStack:

- `browse` — Quick validation for a single scenario
- `qa` / `qa-only` — Full site quality scoring
- `canary` — Post-deployment health check
- `land-and-deploy` — Post-production deployment verification
- `gstack` — Direct use of general-purpose browser automation

Upgrading GStack updates the base engine for all these skills at once. This means it's not just upgrading one skill, but keeping the entire GStack ecosystem up to date.

**Version Management Principles**:
- GStack minor updates generally maintain backward compatibility.
- Major updates may change skill behavior or APIs, so caution is needed in shared team environments.
- If you want to pin the version per project, it's good to specify it in `package.json` as a vendored install.

## One-Line Summary

A simple utility skill that upgrades GStack to the latest version, automatically detecting global and vendored installations to run the appropriate upgrade command and summarizing the changes.

## Getting Started

```bash
/gstack-upgrade
```

**SKILL.md file location**: `~/.claude/skills/gstack-upgrade/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You're trying to use the `canary` skill for the first time in your Student Club Notice Board project, but a warning appeared saying "gstack version is too low." You want to upgrade GStack, review the changes, and then reflect them in the project's CI pipeline.

### Step 1: Run the GStack Upgrade

```
> Upgrade gstack.
```

What the skill executes:

```bash
# When global install is detected
npm list -g gstack
# → gstack@2.1.0 detected

# Run upgrade
npm install -g gstack@latest

# Print changes
# gstack 2.1.0 → 2.4.0
# Changes:
#   - Added canary skill support
#   - Stabilized file upload dialog handling
#   - Fixed Windows path handling bug
#   - Improved screenshot annotation quality
```

### Step 2: Update Project Vendored Install (Optional)

If all team members in a team project want to use the same version, pin it to the project:

```bash
# pnpm project
pnpm add -D gstack@latest

# Check package.json
# "devDependencies": {
#   "gstack": "^2.4.0"
# }
```

### Step 3: Reflect GStack Version in GitHub Actions CI

```yaml
# .github/workflows/qa.yml
name: QA Verification

on:
  push:
    branches: [main]
  pull_request:

jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      # If gstack is in devDependencies, it's automatically installed
      # If global install is needed:
      # - name: Install gstack globally
      #   run: npm install -g gstack@latest

      - name: Post-deployment canary verification
        run: |
          # canary skill is gstack-based
          claude run canary --url ${{ secrets.VERCEL_URL }}
```

## Learning Points / Common Pitfalls

- **GStack upgrade = upgrading the entire ecosystem**: This single skill updates the base engine for all GStack-based skills including browse, qa, canary, and land-and-deploy. Get in the habit of checking whether GStack is at the latest version before using any new skill.
- **Pin versions in team projects**: Using global install may result in different versions installed for different team members. Specifying the gstack version in `package.json`'s `devDependencies` allows the whole team to use the same version with a single `pnpm install`.
- **Read the change summary**: In the change summary printed after an upgrade, check for "deprecated" or "breaking change" items. Especially during major version updates, skill options you previously used may change.
- **Windows environment caution**: When developing on Windows like this project, briefly check that path handling and screenshot save paths work correctly after a GStack upgrade. GStack patch versions frequently include Windows-related bug fixes.

## Related Resources

- [gstack](./gstack.md) — GStack headless browser general-purpose QA automation engine
- [browse](./browse.md) — Quick single-scenario validation built on GStack
- [canary](./canary.md) — GStack-based post-deployment health check

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
