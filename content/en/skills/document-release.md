---
title: "Document Release"
source: "~/.claude/skills/document-release/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
tags: ["document-release", "docs", "CHANGELOG", "README", "release"]
category: "Deployment"
---

# Document Release

## Core Concepts / How It Works

### Document Drift

Code changes quickly, but documentation can't keep up. This is called **document drift**. Common symptoms include:

- The README's "Installation" section still lists deleted environment variables
- `ARCHITECTURE.md` describes the structure from 6 months ago
- The PR process in `CONTRIBUTING.md` differs from the actual branching strategy
- The CHANGELOG has unfinished entries like "TODO: add description"

Document Release reads the diff and automatically resolves this drift.

### When to Use It

- When you receive requests like "update the docs," "sync the docs," or "clean up the docs after deployment"
- When called automatically (proactively suggested) right after a PR is merged
- When CHANGELOG writing style is inconsistent or "placeholder" entries remain
- When you notice README feature descriptions no longer match the actual code
- When you want to handle the pre-release documentation checklist without missing anything

### Documents Processed

| Document | What Is Updated |
|----------|-----------------|
| `README.md` | Feature list, installation steps, environment variables, API endpoints |
| `ARCHITECTURE.md` | Component/module structure diagrams and descriptions |
| `CONTRIBUTING.md` | Branch strategy, PR rules, code style guide |
| `CLAUDE.md` | Project-specific Claude instructions |
| `CHANGELOG.md` | Add new version entries, unify writing style, remove TODOs |
| `VERSION` | Optionally bump following Semantic Versioning rules |

### Diff-based Precise Updates

The skill reads `git diff [base]...HEAD` and **only reflects actually changed content** into the documentation. Sections that haven't changed are left untouched. This approach is faster than rewriting docs from scratch and preserves existing context.

### CHANGELOG Voice Polish

A CHANGELOG written by multiple people tends to have an inconsistent writing style. Document Release applies consistent narrative rules:

- Start with a verb in imperative form (`Add:`, `Fix:`, `Remove:`)
- Describe user impact ("Fix login button not clickable on mobile" ← "Bug fix")
- Remove internal implementation details ("Fix useEffect dependency array" → remove or summarize)

## One-Line Summary

A skill that runs immediately after a PR is merged or code is deployed, **automatically synchronizing all project documentation (README, ARCHITECTURE, CONTRIBUTING, CLAUDE.md, CHANGELOG) against actual changes**, and also handling version bumps and TODO cleanup.

## Getting Started

```bash
/document-release
```

**SKILL.md location**: `~/.claude/skills/document-release/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: A PR adding an "image upload" feature to the Student Club Notice Board has been merged. Now the README feature list, CHANGELOG, and the environment variables section of CLAUDE.md all need updating.

### Step 1 — Run Document Release

```bash
# After merging the PR
> Use the document-release skill to reflect the changes from the just-merged PR in the documentation
```

### Step 2 — Example diff analysis output

```
[Document Release] Diff analysis complete

Changed files (12):
  - app/notices/new/actions.ts — S3 presigned URL added
  - components/ImageUploader.tsx — new component
  - lib/s3.ts — S3 client utility
  - prisma/schema.prisma — Notice.imageUrls field added
  - .env.example — S3_BUCKET_NAME, AWS_REGION added
  ... 7 more

Documentation items requiring updates:
  ✗ README.md > Features section: "image upload" not mentioned
  ✗ README.md > Environment variables section: S3_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID not listed
  ✗ CHANGELOG.md: No 0.3.0 entry
  ✗ CLAUDE.md > Key libraries: @aws-sdk/client-s3 not mentioned
```

### Step 3 — Automatic update results

```markdown
<!-- README.md — Features section after update -->
## Features
- Notice CRUD
- Club member authentication (email login)
- **Image upload** — up to 5 images per notice, stored in S3 (added in v0.3.0)
```

```markdown
<!-- README.md — Environment variables section after update -->
## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | ✓ | PostgreSQL connection string |
| NEXTAUTH_SECRET | ✓ | NextAuth signing key |
| S3_BUCKET_NAME | ✓ (v0.3.0+) | S3 bucket name for image storage |
| AWS_REGION | ✓ (v0.3.0+) | S3 bucket region (e.g., ap-northeast-2) |
| AWS_ACCESS_KEY_ID | ✓ (v0.3.0+) | AWS IAM access key |
| AWS_SECRET_ACCESS_KEY | ✓ (v0.3.0+) | AWS IAM secret key |
```

```markdown
<!-- CHANGELOG.md — New version entry added -->
## [0.3.0] — 2026-04-12

### Added
- Image upload when creating notices (up to 5 images, stored in S3)
- ImageUploader component: supports drag-and-drop + click upload
- `imageUrls` field added to the Notice data model

### Changed
- Notice creation form: integrated image attachment UI

### Infrastructure
- AWS S3 integration (ap-northeast-2 region)
- 3 new required environment variables (S3_BUCKET_NAME, AWS_REGION, AWS_*KEY)
```

### Step 4 — VERSION bump (optional)

```bash
[Document Release] Is a version bump needed?
Current: 0.2.1
Suggestion: 0.3.0 (new feature added → minor version bump)
            0.2.2 (small improvement only → patch version bump)

> Bump to 0.3.0
```

```
[Document Release] Update complete
  ✓ README.md — Features section, environment variables section updated
  ✓ CHANGELOG.md — 0.3.0 entry added, writing style unified
  ✓ CLAUDE.md — @aws-sdk/client-s3 library mention added
  ✓ VERSION — 0.2.1 → 0.3.0
  ✓ Commit: "docs: v0.3.0 release documentation sync"
```

## Learning Points / Common Pitfalls

- **Documentation is part of the code**: Adding a feature without updating the docs is like writing only half the code. In particular, an outdated environment variable list will cause new team members to waste hours wondering "why doesn't this work?"
- **Common mistake — writing the CHANGELOG all at once at the end**: When multiple PRs accumulate before the CHANGELOG is written, content gets omitted or the order gets confused. The important habit is to run Document Release after each PR to record changes immediately.
- **Applying to this project (Claude-Code-Study)**: This project's `CLAUDE.md` has the rule "README.md must be updated on push." Using the Document Release skill prevents you from forgetting this rule.
- **Next.js 15 tip — `.env.example` management**: Keep the actual `.env.local` in `.gitignore`, and commit only key names and example values to `.env.example`. Document Release detects changes to `.env.example` and automatically updates the environment variable table in README.
- **Semantic Versioning reminder**: MAJOR (breaking change) / MINOR (new feature added) / PATCH (bug fix). In student projects, you typically only use MINOR and PATCH within the 0.x.y range.

## Related Resources

- [finishing-a-development-branch](./finishing-a-development-branch.md) — Post-branch integration (paired with Document Release)
- [ship](./ship.md) — Deployment pipeline (includes automatic Document Release suggestion)
- [land-and-deploy](./land-and-deploy.md) — Post-deployment verification pipeline

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
