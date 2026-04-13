---
title: "Setup Deploy"
source: "~/.claude/skills/setup-deploy/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["deploy", "CI/CD", "gstack", "Vercel", "configuration"]
category: "Deployment"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Setup Deploy

## Core Concepts / How It Works

### Supported Deployment Platforms

Setup Deploy automatically detects and configures the following platforms.

| Platform | Detection Method | Key Configuration Items |
|----------|------------------|------------------------|
| Vercel | `vercel.json` or `.vercel/` directory | Project ID, Team ID, deploy hook URL |
| Netlify | `netlify.toml` or `.netlify/` | Site ID, deploy hook URL |
| Fly.io | `fly.toml` | App name, region, health check path |
| Render | `render.yaml` | Service ID, environment variables |
| Heroku | `Procfile` or `heroku.yml` | App name, stack |
| GitHub Actions | `.github/workflows/` | Workflow file name, trigger branch |
| Custom | Manual input | Deploy command, health check URL |

### Why Configuration Is Stored in CLAUDE.md

The core of Setup Deploy is **persistently saving configuration to CLAUDE.md**. This allows every Claude Code session to automatically read the deployment configuration, so `/land-and-deploy` never has to ask "where and how do I deploy?" each time it runs.

```markdown
<!-- Example of a deploy configuration section automatically added to CLAUDE.md -->
## Deploy Configuration
- Platform: Vercel
- Production URL: https://club-notice.vercel.app
- Health Check: https://club-notice.vercel.app/api/health
- Deploy Command: vercel --prod
- Status Command: vercel ls --scope=my-team
- Branch: main
- Last configured: 2026-04-12
```

### Relationship with land-and-deploy

Setup Deploy is a **one-time configuration tool**, while `/land-and-deploy` is a **repeatedly executed deployment tool**.

```
Setup Deploy (once) → Save configuration to CLAUDE.md
                    ↓
/land-and-deploy (every time) → Read configuration → Execute automated deployment
```

Once Setup Deploy is run, all subsequent deployments are automated with just `/land-and-deploy`.

### The Role of the Health Check Endpoint

The health check URL configured by Setup Deploy is used by `/land-and-deploy` to confirm deployment completion. After executing the deploy command, it waits until the health check URL returns 200 to determine deployment success or failure.

## One-Line Summary

A one-time configuration skill that automatically detects the project's deployment platform and saves the production URL, health check endpoint, and deployment status commands to **CLAUDE.md**, enabling the `/land-and-deploy` skill to perform deployments automatically.

## Getting Started

```bash
/setup-deploy
```

**SKILL.md location**: `~/.claude/skills/setup-deploy/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: You want to deploy a Next.js 15 + TypeScript "Student Club Notice Board" to Vercel and configure CI/CD with GitHub Actions at the same time. Use Setup Deploy to save the deployment configuration to CLAUDE.md, then enable automatic deployment with `/land-and-deploy`.

### Step 1 — Create the Health Check API

Before running Setup Deploy, first create the health check endpoint.

```typescript
// app/api/health/route.ts — health check endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  // Check DB connection status
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'ok';

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'unknown',
      db: dbStatus,
    },
    { status: isHealthy ? 200 : 503 },
  );
}
```

### Step 2 — Run Setup Deploy

```bash
> Configure Vercel + GitHub Actions deployment settings for this project using the setup-deploy skill
```

Claude's auto-detection and interactive configuration:

```
[Setup Deploy] Analyzing project structure...

Detected platforms:
  ✓ Vercel (vercel.json found)
  ✓ GitHub Actions (.github/workflows/deploy.yml found)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Configuration Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Production URL [auto-detected: https://club-notice.vercel.app]: (Enter)
Health check path [suggestion: /api/health]: (Enter)
Deploy branch [detected: main]: (Enter)
Vercel team slug [required]: my-university-club

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Setup Deploy] Deploy configuration added to CLAUDE.md
[Setup Deploy] /land-and-deploy is now ready for automated deployment
```

### Step 3 — Auto-generated GitHub Actions Workflow

Setup Deploy automatically generates `.github/workflows/deploy.yml` if it doesn't exist.

```yaml
# .github/workflows/deploy.yml — auto-generated by setup-deploy
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check + lint
        run: pnpm typecheck && pnpm lint

      - name: Test
        run: pnpm test

      - name: Deploy to Vercel
        run: |
          pnpm dlx vercel pull --yes --environment=production
          pnpm dlx vercel build --prod
          pnpm dlx vercel deploy --prebuilt --prod

      - name: Health check verification
        run: |
          for i in {1..18}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://club-notice.vercel.app/api/health)
            if [ "$STATUS" = "200" ]; then
              echo "Health check passed"
              exit 0
            fi
            echo "Waiting for health check... ($i/18)"
            sleep 10
          done
          echo "Health check failed — please verify the deployment"
          exit 1
```

## Learning Points / Common Pitfalls

- **The value of one-time configuration**: Deployment configuration rarely changes. Running Setup Deploy once means all subsequent deployments are done with a single `/land-and-deploy`. This upfront investment saves a lot of time.
- **Common mistake — judging deployment complete without a health check**: Even if a deploy command succeeds, only a health check can confirm that the app is actually functioning normally. `vercel --prod` can succeed while the app is down due to a runtime error. A health check endpoint is essential.
- **Common mistake — running GitHub Actions without secrets**: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` must be registered in the repository's Settings → Secrets. Without these, Actions will fail.
- **Next.js 15 tip — vercel.json configuration**: The `rewrites` and `headers` settings in `vercel.json` must be verified before deployment. In particular, Next.js 15 App Router caching headers (`Cache-Control`) may conflict with Vercel's defaults.
- **Monorepo deployment note**: In a pnpm workspace monorepo like this project, when deploying `apps/docs/` to Vercel, set "Root Directory" to `apps/docs` in the Vercel dashboard or specify `rootDirectory` in `vercel.json`.

## Related Resources

- [land-and-deploy](./land-and-deploy.md) — PR merge + deployment automation
- [ship](./ship.md) — PR creation skill
- [canary](./canary.md) — Production health check

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
