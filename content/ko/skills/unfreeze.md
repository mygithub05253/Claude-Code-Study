---
title: "편집 범위 해제 (Unfreeze)"
source: "~/.claude/skills/unfreeze/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack 생태계)"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["편집범위", "freeze", "unfreeze", "gstack", "안전성"]
category: "안전성"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 편집 범위 해제 (Unfreeze)

## 핵심 개념

### Freeze와 Unfreeze의 관계

Freeze와 Unfreeze는 같은 세션 내에서 편집 범위를 **동적으로 조정**하는 쌍을 이룬다.

```
세션 시작
  │
  ├─ (작업 범위가 좁을 때) /freeze app/notices
  │       │
  │       ├─ app/notices/ 내부만 편집 가능
  │       │
  │       └─ (범위 확장 필요) /unfreeze
  │               │
  │               └─ 모든 디렉토리 편집 가능 (세션 지속)
  │
세션 종료 (Freeze는 세션 종료 시 자동 해제)
```

### Unfreeze의 동작

`/unfreeze` 실행 후:
- 이전에 설정된 Freeze 경계가 **모두 제거**된다
- Edit, Write 도구가 **모든 경로**에서 다시 사용 가능해진다
- Careful 경고(`/careful` 또는 `/guard`로 활성화된)는 **그대로 유지**된다

**중요**: Unfreeze는 Freeze만 해제한다. Guard 모드로 활성화된 Careful(위험 명령어 경고)은 Unfreeze로 해제되지 않는다. Careful을 해제하려면 별도 명령이 필요하다.

### 언제 Unfreeze가 필요한가

디버깅 또는 집중 작업을 하다 보면 두 가지 상황이 발생한다.

**상황 A: 버그의 원인이 다른 모듈에 있을 때**
공지 페이지 버그를 디버깅하다가 실제 원인이 공통 인증 모듈에 있음을 발견했다. 이제 `app/lib/auth.ts`도 수정해야 한다.

**상황 B: 연관 리팩토링이 필요할 때**
공지 컴포넌트를 리팩토링하다 보니, 공통 `Button` 컴포넌트도 함께 개선하면 훨씬 깔끔해진다는 것을 알게 됐다. 이제 범위를 넓혀야 한다.

이런 상황에서 세션을 종료하고 다시 시작하지 않아도 된다. Unfreeze로 바로 범위를 해제하면 된다.

## 한 줄 요약

`/freeze`로 설정한 편집 범위 제한을 **세션을 종료하지 않고** 해제하여, 다시 모든 디렉토리에서 파일을 수정할 수 있게 되돌리는 스킬이다.

## 프로젝트에 도입하기

```bash
/unfreeze
```

**SKILL.md 파일 위치**: `~/.claude/skills/unfreeze/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"에서 `app/notices/` 디렉토리에 Freeze를 걸고 공지 페이지네이션 버그를 디버깅하고 있었다. 디버깅 결과, 문제의 원인이 `app/lib/pagination.ts` 유틸리티 함수에 있음을 발견했다. 이제 Freeze를 해제하고 해당 파일도 수정해야 한다.

```bash
# 현재 상태: Freeze 활성화 (app/notices/ 만 편집 가능)

# 버그 원인 확인
> app/lib/pagination.ts 파일의 calculateOffset 함수에 문제가 있는 것 같아.
> 이 함수를 수정해야 하는데 현재 freeze가 걸려 있어. unfreeze 해 줘.
```

**Unfreeze 실행**

```
Freeze 해제

이전 허용 범위: app/notices/
현재 상태: 모든 디렉토리 편집 허용

Careful 모드: 유지 중 (Guard 모드였다면)
```

**Unfreeze 후 작업 예시**

```typescript
// app/lib/pagination.ts 수정 — 이제 가능

// 버그 있는 calculateOffset 함수
export function calculateOffset(page: number, pageSize: number): number {
  return page * pageSize; // page=1일 때 offset=20 (1페이지 건너뜀!)
}

// 수정된 함수
export function calculateOffset(page: number, pageSize: number): number {
  // page는 1부터 시작하므로 (page - 1)을 곱해야 함
  const safePage = Math.max(1, page);
  return (safePage - 1) * pageSize;
}
```

**수정 후 공지 페이지에서 유틸리티 사용**

```typescript
// app/notices/page.tsx — Freeze 해제 후 유틸리티 변경의 영향도 확인 가능

import { calculateOffset } from "@/lib/pagination";

interface SearchParams {
  page?: string;
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");

  // 수정된 calculateOffset 사용
  const offset = calculateOffset(page, PAGE_SIZE);

  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  return <NoticeList notices={notices ?? []} />;
}
```

**작업 흐름 전체 예시**

```bash
# 1. 작업 시작: 범위를 좁게 고정
> freeze app/notices/

# 2. app/notices/ 내 파일들을 분석하고 수정
[디버깅 진행...]

# 3. 버그 원인이 외부 모듈에 있음을 발견
> app/lib/pagination.ts를 확인해 보니 calculateOffset이 잘못됐어.

# 4. 범위 해제
> unfreeze

# 5. 이제 app/lib/pagination.ts도 수정 가능
[lib/pagination.ts 수정...]

# 6. 필요하면 다시 범위 고정
> freeze app/notices/ app/lib/

# 세션 종료 시 자동 해제
```

**Unfreeze 후 재검증 예시**

```typescript
// 수정 후 단위 테스트로 확인 — tests/lib/pagination.test.ts
// Unfreeze 후 테스트 파일도 수정할 수 있음

import { describe, it, expect } from "vitest";
import { calculateOffset } from "@/lib/pagination";

describe("calculateOffset", () => {
  it("1페이지의 offset은 0이어야 한다", () => {
    expect(calculateOffset(1, 20)).toBe(0);
  });

  it("2페이지의 offset은 20이어야 한다", () => {
    expect(calculateOffset(2, 20)).toBe(20);
  });

  it("0 이하 페이지 번호는 1로 처리한다", () => {
    expect(calculateOffset(0, 20)).toBe(0);
    expect(calculateOffset(-1, 20)).toBe(0);
  });
});
```

## 학습 포인트 / 흔한 함정

- **Unfreeze는 Freeze의 자연스러운 흐름이다**: 디버깅 → 원인 발견 → 범위 확장 → 수정은 하나의 세션에서 이루어진다. Unfreeze는 이 흐름을 세션 재시작 없이 매끄럽게 이어준다.
- **Freeze → 작업 → Unfreeze → 확장 작업 패턴**: 처음에는 좁게 시작하고, 필요하면 넓히는 것이 안전한 작업 방식이다. 처음부터 모든 것을 열어두는 것보다 필요할 때 범위를 확장하는 것이 실수를 줄인다.
- **흔한 실수 — Unfreeze를 잊고 다른 파일 수정 시도**: Freeze 상태에서 범위 외 파일 수정이 차단되면, 잠깐 당황할 수 있다. "왜 수정이 안 되지?"라는 상황에서 가장 먼저 Freeze 상태를 확인한다. Claude가 현재 Freeze 상태를 항상 알려주기 때문에 쉽게 파악할 수 있다.
- **Next.js 15 팁**: 공통 유틸리티(`app/lib/`), 공통 컴포넌트(`components/`), 기능별 페이지(`app/[feature]/`)는 서로 의존하는 경우가 많다. 처음엔 기능 디렉토리만 Freeze하고, 공통 레이어 수정이 필요해지면 Unfreeze하여 확장하는 패턴이 효과적이다.
- **Guard 모드와 함께 사용 시**: Guard = Careful + Freeze다. Unfreeze로 Freeze 레이어만 제거하면, Careful(위험 명령어 경고)은 계속 활성화된 채로 프로덕션 안전성을 유지하면서 편집 범위만 확장할 수 있다.

## 관련 리소스

- [freeze](./freeze.md) — 편집 범위 제한 스킬 (Unfreeze의 쌍)
- [guard](./guard.md) — Careful + Freeze 통합 안전 모드
- [systematic-debugging](./systematic-debugging.md) — Freeze 후 디버깅, Unfreeze로 수정 범위 확장

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic (gstack 생태계) |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
