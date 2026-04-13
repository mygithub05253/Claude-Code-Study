---
title: "Security Audit (CSO - Chief Security Officer)"
source: "~/.claude/skills/cso/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "Commentary MIT, original for reference only"
last_reviewed: "2026-04-12"
tags: ["cso", "security", "OWASP", "STRIDE", "vulnerability", "secrets"]
category: "Quality/Safety"
---

# Security Audit (CSO - Chief Security Officer)

## Core Concepts / How It Works

The CSO skill switches Claude into the role of "Chief Security Officer" to perform systematic security audits.

### Two Execution Modes

**Daily Mode (default, confidence gate 8/10)**
- Reports only high-confidence findings with minimal noise.
- Suitable for routine PR reviews or weekly checkups.
- Only reports vulnerabilities with 80%+ certainty, so false positives are rare.

**Comprehensive Mode (monthly deep scan, confidence gate 2/10)**
- Lists all suspicious items (low bar).
- Use for quarterly security audits, before switching to production, or before external investor/customer demos.
- Since findings are numerous, you must judge priorities yourself.

### When to Use

- When you want to "run a security audit" or "create a threat model" for a codebase
- When you want to check for known vulnerabilities (CVEs) in dependency packages
- When auditing security of CI/CD pipeline configurations (GitHub Actions, Dockerfile, etc.)
- When systematically reviewing web application vulnerabilities based on OWASP Top 10
- When a "pentest review" is needed before exposing a team project externally or transitioning to a real service
- When checking for prompt injection and trust boundary vulnerabilities in AI/LLM projects

### Audit Domains

| Domain | Description |
|--------|-------------|
| Secrets Archaeology | Scanning `.env` files, git history, and hardcoded API keys/tokens/passwords in code |
| Dependency Supply Chain | Known CVEs, malicious packages, and outdated packages in `package.json` and lock files |
| CI/CD Pipeline Security | Permission scopes in GitHub Actions workflows, secret injection methods, self-hosted runner risks |
| LLM/AI Security | Prompt injection, model trust boundaries, risks of directly executing AI output |
| Skills Supply Chain Scan | Verification status of external skills in `~/.claude/skills/` |
| OWASP Top 10 | Top 10 web app vulnerabilities: XSS, SQL injection, authentication flaws, IDOR, etc. |
| STRIDE Threat Modeling | 6 threat categories: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation |

### Trend Tracking

Audit results are accumulated and compared against previous runs. You can see progress like "2 CVEs resolved since last month, new XSS risk discovered."

## One-Line Summary

A **virtual CISO role skill** that performs infrastructure-first security audits, checking for secret exposure, dependency supply chain issues, CI/CD pipelines, OWASP Top 10, and STRIDE threat modeling in two modes (daily/comprehensive).

## Getting Started

```bash
/cso
```

**SKILL.md file location**: `~/.claude/skills/cso/SKILL.md`

Copy and modify the SKILL.md content if customization is needed.

## Practical Example

**Situation**: You want a security review of your Student Club Notice Board project (Next.js 15 + TypeScript + Supabase) before going live. You've set up automatic deployment to Vercel via GitHub Actions and are managing environment variables including the Supabase URL and Anon Key.

### Step 1: Run the Daily Security Audit

```
> Run a security audit of this project using the CSO skill.
```

Actions Claude performs (partial pseudocode):

```ts
// 1. Secrets Archaeology — scan .env files and git logs
// Risk: NEXT_PUBLIC_* prefix env vars are exposed to the browser
// Finding: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY exposure is critical

// 2. Dependency CVE scan
// package.json → interpret npm audit / pnpm audit results
// Example: if next@14.1.0 has a known CVE, immediate upgrade recommended

// 3. CI/CD check
// Verify permissions scope in .github/workflows/deploy.yml
// Check if GITHUB_TOKEN has unnecessarily granted write permissions

// 4. OWASP A01 - Broken Access Control
// Check if POST to notices API Route is possible without login
// Verify presence of auth middleware in app/api/notices/route.ts
```

### Step 2: Code Fix Example for Discovered Vulnerability

Assuming the CSO skill discovers the following vulnerability:

```ts
// app/api/notices/route.ts — vulnerable version (no authentication)
export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("notices")
    .insert(body); // Vulnerability: anyone can create a notice!
  return Response.json({ data, error });
}
```

Fixed version after CSO recommendation:

```ts
// app/api/notices/route.ts — fixed version
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Authentication check (OWASP A01 mitigation)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Officer role check (IDOR prevention)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "officer") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("notices")
    .insert({ ...body, author_id: user.id }); // author_id injected server-side

  return Response.json({ data, error });
}
```

### Step 3: Hardening GitHub Actions Security

```yaml
# .github/workflows/deploy.yml — before (excessive permissions)
permissions:
  contents: write
  deployments: write
  pull-requests: write  # unnecessary

# After CSO recommendation — least privilege principle applied
permissions:
  contents: read
  deployments: write
```

### Step 4: STRIDE Threat Model Example

A portion of the threat model table generated by the CSO skill:

| Threat | Scenario | Mitigation |
|--------|----------|------------|
| Spoofing | Creating a notice under someone else's name | JWT-based server auth, `author_id` inserted server-side |
| Tampering | Unauthorized modification of notice content | Apply RLS (Row Level Security) policies |
| Info Disclosure | Viewing unpublished notices | `is_published` field + RLS filter |
| Elevation | Regular member accessing admin features | RBAC `profiles.role` check |

## Learning Points / Common Pitfalls

- **Security is "now," not "later"**: Students often think about security last. Running the CSO skill habitually during PR reviews prevents vulnerabilities from entering the main branch.
- **The danger of the `NEXT_PUBLIC_` prefix**: Next.js `NEXT_PUBLIC_` variables are included in the browser bundle. Never attach this prefix to sensitive variables like `SERVICE_ROLE_KEY`. The CSO skill instantly detects this pattern.
- **Include `pnpm audit` in CI**: CVEs in `package.json` dependencies are newly discovered daily even without code changes. Adding a `pnpm audit --audit-level=high` step to GitHub Actions catches them automatically.
- **Common pitfall — secrets left in git history**: Even if you add a `.env` file to `.gitignore` after committing it, it remains in git history. If the CSO skill detects this, you need to clean the entire history with `git filter-repo`.
- **STRIDE is "flipping your code upside down"**: STRIDE threat modeling is a practice of "viewing your system through an attacker's eyes." Even non-security experts can think systematically with the CSO skill guiding them through the 6 threat categories.

## Related Resources

- [careful](./careful.md) — Safety check before executing destructive commands
- [guard](./guard.md) — Maximum safety mode (Careful + Freeze)
- [verification-before-completion](./verification-before-completion.md) — Final verification before completion

---

| Field | Value |
|---|---|
| Original URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference only |
| Translation Date | 2026-04-13 |
