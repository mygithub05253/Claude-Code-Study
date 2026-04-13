---
title: "Plan Eng Review"
source: "~/.claude/skills/plan-eng-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: en
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["planning", "architecture", "plan-review", "testing", "performance"]
category: "Planning/Design"
license: "Commentary MIT, original for reference"
last_reviewed: "2026-04-12"
---

# Plan Eng Review

## Core Concepts / How It Works

### The 5 Review Areas of Eng Review

**1. Architecture**

Reviews whether the layered structure, dependency direction, and module separation are correct. Verifies that the "Controller → Service → Repository" pattern is followed and that unidirectional data flow is maintained.

**2. Data Flow**

Represents the entire flow of how requests come in and responses go out as a diagram, and reviews the consistency of each step. Checks for race conditions and data consistency issues.

**3. Edge Cases**

Enumerates all exceptional situations beyond the "happy path" and incorporates handling plans for each into the design.
- When the list is empty
- When an unauthorized user attempts access
- When a file size is exceeded
- When the same data is modified concurrently

**4. Test Coverage**

Plans what tests to write, at which layer, and with which tools. Defines the scope of unit tests, integration tests, and E2E tests in advance.

**5. Performance**

Reviews N+1 queries, unnecessary re-renders, large file handling, and caching strategies at the planning stage. The approach of "implement first, optimize when it gets slow" is fatal in complex projects.

### The "Lock In" Principle

The goal of Eng Review is to **lock in** the plan. After the review, you should reach a state where "you no longer need to think about how to implement it." From this point on, you can focus entirely on implementation.

### Opinionated Recommendations

Eng Review does not offer neutral advice like "there's this way and that way." Like an engineering manager, it provides opinionated recommendations: "this approach is better, and here's why."

## One-Line Summary

A technical plan review skill that operates in engineering manager mode to interactively review **architecture, data flow, edge cases, test coverage, and performance**, and then lock in the plan before implementation.

## Getting Started

```bash
/plan-eng-review
```

**SKILL.md location**: `~/.claude/skills/plan-eng-review/SKILL.md`

To customize, copy the contents of SKILL.md and modify as needed.

## Practical Example

**Scenario**: You plan to add file attachment + image resizing functionality to a Next.js 15 + TypeScript "Student Club Notice Board". Use Plan Eng Review to lock in the technical plan before implementation.

### Step 1 — Initial Technical Plan (Before Review)

```markdown
# File Attachment Feature Technical Plan

## API
- POST /api/notices — handle notice creation + file upload simultaneously
- Files stored directly on the server (public/uploads/)

## Image Processing
- Resize to 1200px using sharp on upload
- Keep original as well

## DB
- Add fileUrl column to the Notice table

## Testing
- To be written later
```

### Step 2 — Plan Eng Review Request and Results

```bash
> Review and finalize the file attachment feature technical plan using the plan-eng-review skill
```

```
[Plan Eng Review] Review Results — 3 architecture issues found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue 1: Mixed notice creation and file upload (Severity: HIGH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Handling both notice data storage + file upload in a single
         POST /api/notices endpoint means that if the file upload fails,
         the notice remains saved, or only the file remains.

Recommendation: Separate the upload (opinionated)
  Step 1: POST /api/uploads → upload file → return uploadId
  Step 2: POST /api/notices → reference { uploadId } to create notice
  Reason: Each step can fail/retry independently. Transaction boundary is clear.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue 2: Server-local file storage (Severity: HIGH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: In serverless/container environments like Vercel/Render,
         public/uploads/ is reset after each deployment. All files lost on redeploy.

Recommendation: Use Vercel Blob or AWS S3
  Reason: Persistent storage, CDN acceleration, separated from server capacity
  Next.js 15: @vercel/blob package is the simplest to integrate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue 3: No test plan (Severity: MEDIUM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recommendation: Write at least the following 3 test cases before implementation
  1. Normal file upload → 200 + uploadId returned
  2. File exceeding allowed size → 413 returned
  3. Disallowed file type → 400 returned
```

### Step 3 — Finalized Technical Plan (After Revision)

```typescript
// File upload API including edge case handling
// app/api/uploads/route.ts

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define allowed conditions as constants (reflecting Eng Review recommendation)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadParamsSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().max(MAX_FILE_SIZE, 'File size cannot exceed 10MB'),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const parseResult = UploadParamsSchema.safeParse({
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  // Upload to Vercel Blob (reflecting the ban on server-local storage)
  const blob = await put(`notices/${Date.now()}-${file.name}`, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ uploadId: blob.url, url: blob.url }, { status: 201 });
}
```

## Learning Points / Common Pitfalls

- **"Write tests later" almost always means never**: The reason Eng Review includes test cases in the plan is that once implementation is complete, tests tend to be skipped with the excuse "it works already." Specifying test cases at the planning stage makes the definition of done clear.
- **Common mistake — server-local file storage**: Code that stores files in `public/uploads/` or `/tmp/` works locally but is reset on every deployment in serverless or container environments like Vercel, Render, or Railway. This is one of the most common issues Eng Review catches.
- **Common mistake — ignoring transaction boundaries**: Bundling notice storage + file upload + notification sending in a single API handler leads to inconsistent state when it fails partway through. Clearly separating each operation's boundaries is the core lesson of Eng Review.
- **Next.js 15 tip — Zod + Server Actions**: Using Zod `safeParse` in Next.js 15 Server Actions lets you share the same schema for validation on both client and server. The `useActionState` + Zod combination is the recommended pattern in Next.js 15.
- **The value of data flow diagrams**: A written plan is less clear than actually drawing the flow "Client → API Route → Service → Repository → DB." It makes it much clearer where bottlenecks or bugs might occur. Eng Review enforces creating this diagram.

## Related Resources

- [plan-ceo-review](./plan-ceo-review.md) — CEO perspective plan review
- [plan-design-review](./plan-design-review.md) — Design perspective plan review
- [writing-plans](./writing-plans.md) — Writing implementation plans

---

| Field | Value |
|---|---|
| Source URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| Author/Source | Anthropic |
| License | Commentary MIT, original for reference |
| Translation Date | 2026-04-13 |
