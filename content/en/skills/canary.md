---
title: "Post-Deploy Canary Monitoring (Canary)"
source: "~/.claude/skills/canary/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack ecosystem)"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
tags: ["canary", "monitoring", "deployment", "health-check", "gstack"]
category: "Meta"
---

# Post-Deploy Canary Monitoring (Canary)

## Core Concepts

### What is Canary Monitoring?

"Canary" is a concept derived from the canary birds that miners brought into coal mines. If the canary, sensitive to carbon monoxide, collapsed first, the miners evacuated the mine. In software, it refers to **an automated surveillance system that detects first whether a new deployment has any issues**.

### When to Use

- When you want to verify "the deployment succeeded, but is it actually running fine?"
- When rolling out a new feature progressively to a subset of users (canary deployment) and want to catch issues early
- When automated post-deployment smoke tests are needed
- When you want a timeline of when production console errors occurred
- When receiving tasks with keywords "monitor deploy", "canary", "post-deploy check", "watch production", "verify deploy"

### Surveillance Using the Browse Daemon

The Canary skill runs the Browse daemon periodically and checks the following items.

1. **Console error detection**: `console.error`, `unhandledrejection`, network 4xx/5xx responses
2. **Performance regression detection**: Whether LCP, TTFB, Lighthouse scores exceed a threshold (e.g., ±20%) compared to baseline
3. **Page failure detection**: Whether blank pages, 404s, or server error 500 screens are being rendered
4. **Screenshot comparison**: Comparing pre-deployment screenshots with current screenshots pixel by pixel to detect visual regressions (layout breaks, etc.)

### Baseline and Comparison

Canary captures the **pre-deployment** state as a baseline. It compares surveillance results after deployment against the baseline to judge anomalies. This approach allows distinguishing "problems that existed before" from "problems created by this deployment."

### Alerts and Escalation

Upon detecting an anomaly, Claude performs the following:

- Outputs a detailed report of which page had which error
- Suggests suspicious commit or PR links
- Suggests rollback commands (e.g., `git revert HEAD`, `vercel rollback`)

## One-Line Summary

A skill that periodically monitors the actual production environment with a Browse daemon immediately after deployment, **automatically comparing console errors, performance regressions, and page failures against a pre-deployment baseline to immediately detect anomalies**.

## Getting Started

```bash
/canary
```

**SKILL.md location**: `~/.claude/skills/canary/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Scenario**: You added an "image upload" feature to the Student Club Notice Board and deployed it to Vercel. You want to automatically monitor whether the actual pages work fine for a few hours after deployment.

### Step 1 — Capture Pre-Deployment Baseline

```bash
# From the main branch state before deployment
> Use the canary skill to capture the baseline for the /notices page
# URL: https://club-notice.vercel.app/notices
```

```
[Canary] Baseline capture complete
- Pages: /notices, /notices/1, /notices/new
- LCP baseline: 1.82 s
- Console errors: 0
- Screenshots saved: .canary/baseline/
```

### Step 2 — Start Post-Deployment Monitoring

```bash
# After Vercel deployment completes
> Use the canary skill to monitor https://club-notice.vercel.app at 30-minute intervals
```

Claude runs the Browse daemon periodically and streams the results.

```
[Canary] 10:00 — Normal. Console errors 0, LCP 1.91 s (+5%), screenshots match
[Canary] 10:30 — Warning: Anomaly detected!
  - /notices/new: console.error "Failed to fetch presigned URL" (3 times)
  - Suspected cause: NEXT_PUBLIC_S3_BUCKET environment variable not set in production
  - Impact scope: entire image upload feature unavailable
  - Recommended action: Check Vercel Dashboard > Environment Variables
```

### Step 3 — Fix the Cause and Redeploy

```ts
// app/notices/new/actions.ts
// Add environment variable check before image upload
'use server'

export async function getPresignedUrl(filename: string) {
  const bucket = process.env.S3_BUCKET_NAME
  if (!bucket) {
    // Clear error message when environment variable is missing
    throw new Error('S3_BUCKET_NAME environment variable is not configured.')
  }
  // ... presigned URL generation logic
}
```

```bash
# Canary re-monitoring after fix deployment
[Canary] 11:00 — Recovery confirmed. Console errors 0, LCP 1.88 s
[Canary] Result: No anomalies. Monitoring continues...
```

### Environment Variable Checklist Automation Example

```ts
// lib/env.ts — Validate all required environment variables at server startup
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'S3_BUCKET_NAME',
  'NEXTAUTH_SECRET',
] as const

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key]
  )
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}
```

## Learning Points / Common Pitfalls

- **"Deployment = Complete" is not true**: A successful build and successful deployment are different from "users can actually use the feature." Canary automatically bridges this gap.
- **Common mistake — Missing environment variables**: A feature that worked fine locally with `.env.local` immediately failing in production due to missing environment variables is extremely common. Canary's console error detection catches this within 30 minutes of deployment.
- **Next.js 15 tip — Server Actions error tracking**: Errors thrown inside a Server Action are only exposed to the client console as `Error: An error occurred in the Server Components render`. Canary detects this pattern and classifies it as "suspected Server Action failure."
- **Setting monitoring intervals**: For low-traffic services, intervals of 5~30 minutes are appropriate. A strategy of short intervals (5 minutes) for the first hour after deployment, then easing to 30 minutes afterward is efficient.
- **Clarifying rollback criteria**: Defining numeric thresholds in advance like "LCP +50% or more" or "error rate exceeds 1%" allows you to quickly decide on a rollback without emotional judgment.

## Related Resources

- [browse](./browse.md) — Quick validation of a single page (the foundation of Canary)
- [benchmark](./benchmark.md) — Establishing performance baselines and comparing performance per PR
- [land-and-deploy](./land-and-deploy.md) — Integrated deployment + post-deployment verification pipeline

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author / Source | Anthropic (gstack ecosystem) |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
