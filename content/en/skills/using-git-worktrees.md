---
title: "Using Git Worktrees"
source: "~/.claude/skills/using-git-worktrees/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["git", "worktree", "branch-isolation", "parallel-development", "agents"]
category: "Agents"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Using Git Worktrees

## Core Concepts

### What is a Git Worktree?

A Git Worktree is a feature that lets you **check out multiple branches simultaneously** from a single Git repository. Normally you need `git checkout` to switch branches, but with worktrees you can have different branches open in different directories at the same time.

```
project root/
├── .git/                   ← shared Git repository
├── (working on main branch)
│
└── .worktrees/             ← worktree directory
    ├── feature-notices/    ← feature/notices branch checked out
    └── feature-auth/       ← feature/auth branch checked out
```

### What the Skill Handles Automatically

The Using Git Worktrees skill does much more than simply run `git worktree add`. It automatically handles the following three things.

1. **Smart Directory Selection**: Creates the worktree at an appropriate location such as `.worktrees/` or `../worktrees/` relative to the project root. This prevents the worktree from being included inside the project and getting scanned by build tools or bundlers.

2. **Safety Verification**: Checks the current workspace state before creating a worktree. If there are important uncommitted changes, it warns you or suggests stashing before creating the worktree.

3. **Branch Initialization**: Creates a new branch with the specified name, links it to the worktree, and can run initial environment setup (e.g., `pnpm install`).

### Worktree vs Branch Switching vs Clone

| Method | Concurrent Work | Speed | Disk Usage |
|--------|----------------|-------|------------|
| `git checkout` | Not possible | Fast | 1x |
| Git Worktree | Possible | Fast | 1.x (shared objects) |
| `git clone` | Possible | Slow | 2x |

Since worktrees share `.git/objects`, they use far less disk than a full clone while still providing a completely isolated workspace.

## One-Line Summary

A skill that creates an **isolated Git worktree** while preserving the current workspace, enabling safe development of new features with automatic smart directory selection and safety verification.

## Getting Started

```bash
/using-git-worktrees
```

**SKILL.md location**: `~/.claude/skills/using-git-worktrees/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: In a Next.js 15 + TypeScript "Student Club Notice Board" project, the `main` branch is currently deployed stably. You want to start a new "notice like feature (feature/notice-likes)" without touching the existing work, in an isolated environment.

### Creating a Basic Worktree

```
> Use the using-git-worktrees skill to create a new worktree
  for the feature/notice-likes branch.
```

Steps performed by the skill:

```bash
# 1. Safety verification of current state
git status
# → No uncommitted changes. Safe to proceed.

# 2. Create worktree
git worktree add .worktrees/notice-likes -b feature/notice-likes

# 3. Install dependencies (recognizes pnpm workspace)
cd .worktrees/notice-likes && pnpm install

# 4. Verify state
git worktree list
```

Output:

```
C:/Users/kik32/workspace/claude-code-study              [main]
C:/Users/kik32/workspace/claude-code-study/.worktrees/notice-likes  [feature/notice-likes]
```

### Development Inside the Worktree

Since the worktree is a completely isolated workspace, all file operations are isolated.

```bash
# Develop inside the worktree
cd .worktrees/notice-likes

# Create a new file
touch app/api/notices/[id]/likes/route.ts

# Commit
git add .
git commit -m "feat: add notice likes API route"
```

This commit is reflected only in the `feature/notice-likes` branch and does not affect the `main` branch.

### Using with Parallel Agents

```
> Use the using-git-worktrees skill to create separate worktrees
  for these three features:
  1. feature/notice-likes — notice likes
  2. feature/notice-comments — comment functionality
  3. feature/notice-search — search functionality

  Then use dispatching-parallel-agents to assign three agents
  to each worktree.
```

Result of skill execution:

```
.worktrees/
├── notice-likes/      ← Agent 1 workspace (feature/notice-likes)
├── notice-comments/   ← Agent 2 workspace (feature/notice-comments)
└── notice-search/     ← Agent 3 workspace (feature/notice-search)
```

Since each agent works independently in its own worktree, file conflicts do not occur.

### Cleaning Up Worktrees

Once feature development is complete, clean up the worktrees.

```bash
# Return to main, merge the PR, then remove the worktree
git worktree remove .worktrees/notice-likes

# Delete the merged branch
git branch -d feature/notice-likes
```

### Notes for Next.js 15 Projects

```ts
// Recommended to add the worktree directory to .gitignore
// .gitignore
.worktrees/
```

```json
// next.config.ts — prevent worktree directory from being included in the build
{
  "experimental": {
    "outputFileTracingIgnores": [".worktrees/**"]
  }
}
```

## Learning Points / Common Pitfalls

- **`main` should always be deployable**: In student projects, the mindset of "just work on main for now, clean it up later" will inevitably cause problems in team collaboration. Making the worktree pattern a habit naturally maintains the stability of `main`.
- **Disk space efficiency**: Using worktrees instead of clones means sharing `.git/objects`, so disk usage barely increases. This can be used freely even in hackathon situations where multiple features are being developed simultaneously.
- **Common Pitfall — `node_modules` duplication**: Since each worktree has its own independent working directory, `node_modules` can be duplicated. Using pnpm workspace links packages from a shared cache via hard links, so actual disk usage is much lower.
- **Worktrees are registered inside `.git`**: Use `git worktree list` to see currently active worktrees. Simply deleting a worktree directory leaves Git still remembering that worktree as "locked". Always clean up with `git worktree remove` or `git worktree prune`.
- **Next.js 15 perspective**: Running separate `dev` servers per worktree lets you verify each feature independently. Specify options like `--port 3001` in the dev script of each worktree's `package.json` to avoid port conflicts.

## Related Resources

- [dispatching-parallel-agents](./dispatching-parallel-agents.md) — Deploy parallel agents to worktrees
- [subagent-driven-development](./subagent-driven-development.md) — Run sub-agents within a session
- [using-superpowers](./using-superpowers.md) — Skill selection guide before introducing worktrees

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
