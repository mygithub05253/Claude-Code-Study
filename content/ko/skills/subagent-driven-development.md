---
title: "서브에이전트 주도 개발 (Subagent-Driven Development)"
source: "~/.claude/skills/subagent-driven-development/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["에이전트", "서브에이전트", "병렬실행", "오케스트레이터", "구현계획"]
category: "에이전트"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 서브에이전트 주도 개발 (Subagent-Driven Development)

## 핵심 개념

### 오케스트레이터와 서브에이전트의 역할

Subagent-Driven Development는 **오케스트레이터(orchestrator)** 와 **서브에이전트(subagent)** 의 두 계층으로 구성된다.

- **오케스트레이터**: 구현 계획 전체를 이해하고, 태스크를 서브에이전트에 할당하며, 진행 상태를 추적하고, 결과를 통합한다. 직접 코드를 작성하는 것이 아니라 "어떤 순서로, 누가, 무엇을 할지"를 관제한다.
- **서브에이전트**: 오케스트레이터로부터 단일하고 명확하게 정의된 태스크를 받아 독립적으로 처리한다. 다른 서브에이전트의 진행 상황을 알지 못하고, 자신의 태스크에만 집중한다.

### 현재 세션 내 실행이라는 특성

이 스킬이 dispatching-parallel-agents 스킬과 구별되는 핵심은 **"현재 세션 내(in the current session)"** 에서 동작한다는 점이다. 세션 외부로 독립 에이전트를 파견하는 것이 아니라, 동일한 Claude 세션 내에서 논리적으로 역할을 분리해 실행한다.

### 태스크 의존성 그래프

구현 계획의 태스크들을 실행하기 전에 의존성 그래프를 파악해야 한다.

```
[의존성 그래프 예시]

Task 1: Zod 스키마 정의
    │
    ├── Task 2: DB 모델 정의 (스키마 의존)
    │       │
    │       └── Task 4: API 라우트 구현 (DB 모델 의존)
    │
    └── Task 3: 폼 컴포넌트 구현 (스키마 의존)
            │
            └── Task 5: 페이지 통합 (폼 + API 의존)
```

이 그래프에서 Task 2와 Task 3은 Task 1이 완료되면 **병렬 실행 가능**하다.

## 한 줄 요약

**현재 세션 내에서** 구현 계획의 독립 태스크들을 서브에이전트에 위임해 순차·병렬로 실행하는 개발 패턴으로, 오케스트레이터 Claude가 전체 진행 상황을 관제하면서 복잡한 구현을 체계적으로 완성한다.

## 프로젝트에 도입하기

```bash
/subagent-driven-development
```

**SKILL.md 파일 위치**: `~/.claude/skills/subagent-driven-development/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트의 "공지 CRUD 기능 전체"를 구현해야 한다. writing-plans 스킬로 이미 구현 계획이 작성된 상태다.

### 사전 준비: 구현 계획 확인

```
[구현 계획: 공지 CRUD 기능]
Phase 1 (기반):
  - Task 1.1: lib/schemas/notice.ts - Zod 스키마 정의
  - Task 1.2: prisma/schema.prisma - Notice 모델 추가

Phase 2 (독립 실행 가능):
  - Task 2.1: app/api/notices/route.ts - GET/POST 구현
  - Task 2.2: app/api/notices/[id]/route.ts - PATCH/DELETE 구현
  - Task 2.3: components/NoticeForm.tsx - 폼 컴포넌트

Phase 3 (통합):
  - Task 3.1: app/notices/page.tsx - 목록 페이지
  - Task 3.2: app/notices/new/page.tsx - 작성 페이지
  - Task 3.3: app/notices/[id]/edit/page.tsx - 수정 페이지
```

### 서브에이전트 주도 개발 실행

```
> subagent-driven-development 스킬로 위 구현 계획을 실행해 줘.
  Phase 1이 완료된 후 Phase 2는 병렬로, Phase 3은 Phase 2 완료 후 실행해.
```

오케스트레이터가 수행하는 진행 관제:

```
[오케스트레이터 진행 상황]

✓ Task 1.1 완료: lib/schemas/notice.ts 생성
✓ Task 1.2 완료: prisma/schema.prisma Notice 모델 추가
  → Phase 1 완료. Phase 2 병렬 시작.

⚡ Task 2.1 실행 중: app/api/notices/route.ts
⚡ Task 2.2 실행 중: app/api/notices/[id]/route.ts
⚡ Task 2.3 실행 중: components/NoticeForm.tsx
  → Phase 2 모두 완료. Phase 3 시작.

⚡ Task 3.1 실행 중: app/notices/page.tsx
...
```

### 각 서브에이전트의 산출물 예시

**Task 2.1 서브에이전트 산출물:**

```ts
// app/api/notices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createNoticeSchema } from "@/lib/schemas/notice";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));

  const [notices, total] = await Promise.all([
    db.notice.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, author: { select: { name: true } } },
    }),
    db.notice.count(),
  ]);

  return NextResponse.json({ notices, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createNoticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const notice = await db.notice.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return NextResponse.json(notice, { status: 201 });
}
```

**Task 2.3 서브에이전트 산출물:**

```tsx
// components/NoticeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoticeSchema, type CreateNoticeInput } from "@/lib/schemas/notice";

interface NoticeFormProps {
  onSubmit: (data: CreateNoticeInput) => Promise<void>;
  defaultValues?: Partial<CreateNoticeInput>;
}

export function NoticeForm({ onSubmit, defaultValues }: NoticeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoticeInput>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          {...register("title")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="공지 제목을 입력해 주세요"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          내용
        </label>
        <textarea
          id="body"
          {...register("body")}
          rows={8}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="공지 내용을 입력해 주세요"
        />
        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "저장 중..." : "공지 등록"}
      </button>
    </form>
  );
}
```

### 부분 실패 처리

서브에이전트 중 하나가 실패해도 오케스트레이터가 처리한다:

```
[오케스트레이터 판단]
Task 2.2 실패: app/api/notices/[id]/route.ts
  → 원인: Prisma 타입 오류 (id가 string이 아닌 경우)
  → Task 2.1, 2.3은 영향 없음. 계속 진행.
  → Task 2.2 재시도: id 타입을 string으로 변환 추가
```

## 학습 포인트 / 흔한 함정

- **계획이 먼저다**: 서브에이전트 주도 개발은 이미 계획이 있는 상태에서 시작한다. writing-plans 스킬로 먼저 구현 계획을 만들고, 그 다음에 이 스킬로 실행하는 순서를 지키자.
- **오케스트레이터를 신뢰하되 결과를 확인하라**: 오케스트레이터가 진행 상황을 추적하고 실패를 처리한다고 해도, 모든 서브에이전트 작업이 끝난 후 `pnpm build`와 타입체크를 직접 실행해 통합이 정상인지 확인해야 한다.
- **Next.js 15 App Router와의 조합**: App Router의 파일 기반 라우팅은 태스크 단위를 파일 단위로 자연스럽게 분할하게 해 준다. 각 서브에이전트가 담당하는 파일 범위를 명확히 지정하면 충돌을 최소화할 수 있다.
- **흔한 함정 — 태스크 경계 불명확**: "공지 기능 구현해 줘"처럼 모호하게 요청하면 오케스트레이터도 태스크 경계를 제대로 잡지 못한다. "Task 1: lib/schemas/notice.ts 생성, Task 2: ..." 식으로 태스크를 명확하게 나열해야 서브에이전트가 예측 가능하게 동작한다.
- **Dispatching Parallel Agents와의 차이**: 이 스킬은 현재 세션 안에서 논리적으로 역할을 나누는 것이고, dispatching-parallel-agents는 별도 에이전트를 외부로 파견하는 것이다. 실제 사용에서는 이 두 스킬이 조합되는 경우가 많다.

## 관련 리소스

- [dispatching-parallel-agents](./dispatching-parallel-agents.md) — 외부 에이전트 파견 패턴
- [using-git-worktrees](./using-git-worktrees.md) — 에이전트별 격리 작업 공간
- [writing-plans](./writing-plans.md) — 구현 계획서 작성 스킬

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
