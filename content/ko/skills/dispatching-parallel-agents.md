---
title: "병렬 에이전트 디스패치 (Dispatching Parallel Agents)"
source: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 병렬 에이전트 디스패치 (Dispatching Parallel Agents)

## 한 줄 요약

공유 상태나 순서 의존성이 없는 **2개 이상의 독립 태스크**를 여러 서브에이전트에 동시에 분배해 실행 시간을 단축하는 멀티에이전트 패턴이다.

## 언제 사용하나요?

- 여러 기능을 독립적으로 구현해야 하는데 순서에 상관없는 경우 (예: 회원가입 페이지 + 공지 목록 페이지 + API 라우트 동시 개발)
- 복수의 파일을 동시에 수정해야 하지만 서로 의존하지 않는 경우 (예: 컴포넌트 A 리팩토링 + 컴포넌트 B 리팩토링)
- 테스트 작성, 문서화, 번역처럼 독립적인 반복 작업 다수를 빠르게 처리하고 싶을 때
- 구현 계획(implementation plan)에서 병렬 실행 가능한 태스크 블록이 식별된 경우
- 단일 에이전트로 순서대로 처리하면 너무 오래 걸리는 대규모 작업을 나눌 때

## 핵심 개념

### 병렬성의 전제 조건

Dispatching Parallel Agents 스킬은 단순히 "여러 일을 동시에 시키는 것"이 아니다. 반드시 **두 가지 조건**을 만족해야 안전하게 병렬 실행이 가능하다.

1. **공유 상태 없음(No Shared State)**: 두 에이전트가 같은 파일을 동시에 수정하거나, 같은 DB 레코드를 동시에 변경하면 충돌이 발생한다. 각 태스크는 서로 다른 파일 또는 독립된 데이터를 다뤄야 한다.

2. **순서 의존성 없음(No Sequential Dependency)**: 태스크 A의 결과가 태스크 B의 입력이 되는 경우, 이 둘은 병렬로 실행할 수 없다. "로그인 기능 구현 후 → 로그인 상태를 쓰는 보호 라우트 구현"은 순서 의존성이 있으므로 병렬 불가다.

### 디스패치 패턴

에이전트를 파견(dispatch)할 때의 흐름은 다음과 같다.

```
[오케스트레이터 (Claude)]
       │
       ├── Agent A: notices/page.tsx 구현
       ├── Agent B: notices/new/page.tsx 구현
       └── Agent C: app/api/notices/route.ts 구현
       │
       ▼
[결과 수집 및 통합]
```

오케스트레이터(메인 Claude)는 각 에이전트에게 독립적인 태스크를 할당하고, 모든 에이전트가 완료되면 결과를 통합한다. 에이전트들은 서로 통신하지 않고 각자 맡은 일만 처리한다.

### Git Worktree와의 연계

병렬 에이전트는 종종 **Git Worktree**와 함께 사용된다. 각 에이전트가 서로 다른 워크트리에서 작업하면 파일 충돌 없이 안전하게 병렬 개발이 가능하다. using-git-worktrees 스킬을 먼저 학습하면 이 패턴을 더 효과적으로 활용할 수 있다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트의 MVP를 한 번에 빠르게 완성해야 한다. 구현해야 할 기능이 많은데 각각 독립적이다.

### 태스크 분석: 병렬 가능 여부 판단

```
[병렬 가능 O]
- 공지 목록 페이지 (app/notices/page.tsx)
- 공지 작성 폼 컴포넌트 (components/NoticeForm.tsx)
- 공지 목록 API 라우트 (app/api/notices/route.ts)
- Zod 스키마 정의 (lib/schemas/notice.ts)

[병렬 가능 X - 순서 의존성 있음]
- 공지 DB 스키마 정의 → 공지 CRUD API → 공지 목록 페이지
  (스키마가 먼저 있어야 API를, API가 있어야 페이지를 만들 수 있음)
```

### 디스패치 명령 예시

```
> 다음 4개 태스크는 서로 독립적이야.
  병렬 에이전트 디스패치 스킬을 사용해서 동시에 처리해 줘:

  1. app/notices/page.tsx: 공지 목록 페이지 구현
     - 공지를 최신순으로 카드 형태로 표시
     - 로딩 상태(Suspense)와 빈 목록 상태 처리

  2. components/NoticeForm.tsx: 공지 작성/수정 폼 컴포넌트 구현
     - React Hook Form + Zod validation
     - title(최대 100자), body(최대 5000자) 필드

  3. app/api/notices/route.ts: GET/POST 라우트 구현
     - GET: 목록 조회 (페이지네이션)
     - POST: 새 공지 생성 (인증 필요)

  4. lib/schemas/notice.ts: Zod 스키마 정의
     - CreateNoticeSchema, UpdateNoticeSchema
     - 공통 타입 export
```

### 각 에이전트가 독립적으로 생성하는 코드

**Agent 1 산출물 (app/notices/page.tsx):**

```tsx
import { Suspense } from "react";
import { NoticeList } from "@/components/NoticeList";
import { NoticeListSkeleton } from "@/components/NoticeListSkeleton";

export default function NoticesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">동아리 공지사항</h1>
      <Suspense fallback={<NoticeListSkeleton />}>
        <NoticeList />
      </Suspense>
    </main>
  );
}
```

**Agent 4 산출물 (lib/schemas/notice.ts):**

```ts
import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요").max(100, "제목은 100자 이하로 입력해 주세요"),
  body: z.string().min(1, "내용을 입력해 주세요").max(5000, "내용은 5000자 이하로 입력해 주세요"),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
```

이 두 에이전트는 서로 다른 파일을 만들기 때문에 동시에 실행해도 충돌이 없다.

### 결과 통합 단계

모든 에이전트가 완료되면 오케스트레이터가 통합 작업을 수행한다.

```
> 4개 에이전트 작업이 모두 완료됐어.
  이제 NoticeForm에서 notice.ts의 Zod 스키마를 import해서 연결하고,
  타입 불일치가 없는지 확인해 줘.
```

## 학습 포인트

- **"독립성 체크"가 핵심이다**: 병렬 디스패치를 사용하기 전에 반드시 태스크 간 의존 관계를 그래프로 그려보자. 의존 관계가 있는 태스크를 억지로 병렬 실행하면 한 에이전트의 결과물이 다른 에이전트를 깨뜨릴 수 있다.
- **통합 단계를 잊지 말자**: 병렬로 만들어진 파일들은 서로 연결되지 않은 섬처럼 존재한다. 오케스트레이터가 통합 단계에서 import 연결, 타입 정합성, 네이밍 컨벤션을 맞춰 줘야 완성된 기능이 된다.
- **Next.js 15 App Router와의 궁합**: App Router에서 페이지, 레이아웃, API 라우트, Server Action, 컴포넌트는 대부분 독립된 파일로 관리된다. 이 구조 자체가 병렬 에이전트와 잘 맞는다. 반면 `prisma/schema.prisma` 같은 단일 파일을 여러 에이전트가 동시에 수정하면 반드시 충돌이 난다.
- **흔한 실수 — 공유 설정 파일**: `tailwind.config.ts`, `tsconfig.json`, `package.json` 같은 설정 파일은 절대 병렬로 수정하면 안 된다. 이런 파일 변경이 필요한 태스크는 순서대로 처리해야 한다.
- **Subagent-Driven Development와의 차이**: 이 스킬은 세션 간(현재 세션 외부)에 독립 에이전트를 파견하는 개념이다. 현재 세션 내에서 계획을 실행하는 것은 subagent-driven-development 스킬이다.

## 원본과의 차이

- 원본은 "2개 이상의 독립 태스크"라는 조건만 명시하며 간결하다. 본 해설은 그 조건의 의미(공유 상태 없음, 순서 의존성 없음)를 풀어서 설명했다.
- Git Worktree와의 연계 패턴은 본 해설에서 추가로 설명했다. 원본에서 직접 언급하지 않았지만 실제 사용 시 중요한 컨텍스트다.
- Next.js 15 App Router의 파일 구조가 병렬 에이전트와 자연스럽게 맞는다는 관점은 본 해설에서 추가한 내용이다.
- 태스크 의존성 분석 방법(병렬 가능 O/X 판단)을 예제로 명시적으로 보여주었다. 원본에서는 이 판단 과정이 사용자에게 위임되어 있다.

> 원본: `~/.claude/skills/dispatching-parallel-agents/SKILL.md`
