---
title: "엔지니어링 관점 계획 검토 (Plan Eng Review)"
source: "~/.claude/skills/plan-eng-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["기획", "아키텍처", "계획검토", "테스트", "성능"]
category: "기획/설계"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 엔지니어링 관점 계획 검토 (Plan Eng Review)

## 핵심 개념

### Eng Review의 5가지 검토 영역

**1. 아키텍처 (Architecture)**

계층 구조, 의존성 방향, 모듈 분리가 올바른지 검토한다. "Controller → Service → Repository" 패턴이 지켜지는지, 단방향 데이터 흐름이 유지되는지 확인한다.

**2. 데이터 흐름 (Data Flow)**

요청이 어떻게 들어오고 어떻게 응답이 나가는지 전체 흐름을 다이어그램으로 표현하고 각 단계의 정합성을 검토한다. Race condition, 데이터 일관성 문제가 없는지 확인한다.

**3. 엣지 케이스 (Edge Cases)**

"정상 경로"가 아닌 모든 예외 상황을 열거하고 각각의 처리 방안을 계획에 반영한다.
- 빈 목록일 때
- 권한 없는 사용자가 접근할 때
- 파일 크기 초과 시
- 동시에 같은 데이터를 수정할 때

**4. 테스트 커버리지 (Test Coverage)**

어떤 테스트를 어느 계층에서 어떤 도구로 작성할지 계획한다. 단위 테스트(Unit), 통합 테스트(Integration), E2E 테스트의 범위를 미리 정한다.

**5. 성능 (Performance)**

N+1 쿼리, 불필요한 리렌더링, 대용량 파일 처리, 캐싱 전략을 계획 단계에서 검토한다. "일단 구현하고 느려지면 최적화한다"는 접근은 복잡한 프로젝트에서 치명적이다.

### "Lock In" 원칙

Eng Review의 목표는 계획을 **확정(lock in)**하는 것이다. 검토 후에는 "어떻게 구현할지 더 이상 고민하지 않아도 되는" 상태에 도달해야 한다. 이 단계 이후에는 구현에만 집중할 수 있다.

### 의견이 있는 권고 (Opinionated Recommendations)

Eng Review는 "이런 방법도 있고 저런 방법도 있습니다"식의 중립적 조언이 아니다. 엔지니어링 매니저처럼 "이 방법이 더 낫습니다, 이유는 X입니다"라는 의견 있는 권고를 제시한다.

## 한 줄 요약

엔지니어링 매니저 모드로 **아키텍처, 데이터 흐름, 엣지 케이스, 테스트 커버리지, 성능**을 대화형으로 검토하고 구현 전에 계획을 확정(lock in)하는 기술적 계획 검토 스킬이다.

## 프로젝트에 도입하기

```bash
/plan-eng-review
```

**SKILL.md 파일 위치**: `~/.claude/skills/plan-eng-review/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"에 파일 첨부 + 이미지 리사이징 기능을 추가하려 한다. Plan Eng Review로 구현 전에 기술 계획을 확정한다.

### 1단계 — 초기 기술 계획 (검토 전)

```markdown
# 파일 첨부 기능 기술 계획

## API
- POST /api/notices — 공지 생성 + 파일 업로드 동시 처리
- 파일은 서버에 직접 저장 (public/uploads/)

## 이미지 처리
- 업로드 시 sharp로 리사이징 (1200px)
- 원본도 함께 저장

## DB
- Notice 테이블에 fileUrl 컬럼 추가

## 테스트
- 나중에 작성 예정
```

### 2단계 — Plan Eng Review 요청 및 결과

```bash
> plan-eng-review 스킬로 파일 첨부 기능 기술 계획을 검토하고 확정해 줘
```

```
[Plan Eng Review] 검토 결과 — 3개 아키텍처 문제 발견

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
문제 1: 공지 생성과 파일 업로드 혼합 (심각도: HIGH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
문제: POST /api/notices 하나에서 공지 데이터 저장 + 파일 업로드를 동시에 처리하면
     파일 업로드 실패 시 공지가 저장된 채로 남거나 반대로 파일만 남는다.

권고: 업로드를 분리하라 (의견 있는 권고)
  Step 1: POST /api/uploads → 파일 업로드 → uploadId 반환
  Step 2: POST /api/notices → { uploadId } 참조하여 공지 생성
  이유: 각 단계가 독립적으로 실패/재시도 가능. 트랜잭션 경계 명확.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
문제 2: 서버 로컬 저장 (심각도: HIGH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
문제: Vercel/Render 같은 서버리스/컨테이너 환경에서 public/uploads/ 는
     배포 후 초기화된다. 재배포 시 파일 전체 소실.

권고: Vercel Blob 또는 AWS S3 사용
  이유: 영속적 스토리지, CDN 가속, 서버 용량 분리
  Next.js 15: @vercel/blob 패키지가 가장 통합이 간단함

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
문제 3: 테스트 계획 없음 (심각도: MEDIUM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
권고: 최소한 다음 3개 테스트 케이스를 구현 전에 작성하라
  1. 정상 파일 업로드 → 200 + uploadId 반환
  2. 허용 크기 초과 파일 → 413 반환
  3. 허용되지 않은 파일 형식 → 400 반환
```

### 3단계 — 확정된 기술 계획 (수정 후)

```typescript
// 엣지 케이스 처리를 포함한 파일 업로드 API
// app/api/uploads/route.ts

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 허용 조건 상수 정의 (Eng Review 권고 반영)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadParamsSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(ALLOWED_TYPES),
  size: z.number().max(MAX_FILE_SIZE, '파일 크기는 10MB를 초과할 수 없습니다'),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
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

  // Vercel Blob에 업로드 (서버 로컬 저장 금지 반영)
  const blob = await put(`notices/${Date.now()}-${file.name}`, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ uploadId: blob.url, url: blob.url }, { status: 201 });
}
```

## 학습 포인트 / 흔한 함정

- **"나중에 테스트 작성"은 대부분 영원히 나중**: Eng Review가 테스트 케이스를 계획에 포함시키는 이유는, 구현 완료 후에는 "일단 동작하니까"라는 이유로 테스트를 건너뛰는 일이 반복되기 때문이다. 계획 단계에서 테스트 케이스를 명세해두면 구현의 완성 기준이 명확해진다.
- **흔한 실수 — 서버 로컬 파일 저장**: `public/uploads/` 또는 `/tmp/`에 파일을 저장하는 코드는 로컬에서는 동작하지만 Vercel, Render, Railway 같은 서버리스 또는 컨테이너 환경에서는 배포 때마다 초기화된다. Eng Review가 가장 자주 잡아내는 문제 중 하나다.
- **흔한 실수 — 트랜잭션 경계 무시**: 공지 저장 + 파일 업로드 + 알림 전송을 하나의 API 핸들러에 묶으면 중간에 실패했을 때 일관되지 않은 상태가 된다. 각 작업의 경계를 명확히 분리하는 것이 Eng Review의 핵심 가르침이다.
- **Next.js 15 팁 — Zod + Server Actions**: Next.js 15의 Server Actions에서 Zod `safeParse`를 사용하면 클라이언트와 서버에서 동일한 스키마로 유효성 검사를 공유할 수 있다. `useActionState` + Zod 조합이 Next.js 15 권장 패턴이다.
- **데이터 흐름 다이어그램의 가치**: 글로 쓴 계획보다 "클라이언트 → API Route → Service → Repository → DB" 흐름을 직접 그려보면 어디서 병목이나 버그가 생길지 훨씬 명확하게 보인다. Eng Review는 이 다이어그램 작성을 강제한다.

## 관련 리소스

- [plan-ceo-review](./plan-ceo-review.md) — CEO 관점 계획 검토
- [plan-design-review](./plan-design-review.md) — 디자인 관점 계획 검토
- [writing-plans](./writing-plans.md) — 구현 계획서 작성

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
