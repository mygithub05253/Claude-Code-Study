---
title: "테스트 주도 개발 (Test-Driven Development)"
source: "~/.claude/skills/test-driven-development/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:22d82b93807a2059ce34f1757beaa414b4ef09c40f3e8f35cd9931961e6777b0"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["TDD", "테스트", "Red-Green-Refactor", "Vitest", "품질"]
category: "품질/안전"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 테스트 주도 개발 (Test-Driven Development)

## 핵심 개념

원본의 **철칙(Iron Law)**은 한 줄이다.

> **실패하는 테스트를 한 번 본 적 없이는 그 어떤 프로덕션 코드도 쓰지 않는다.**

이를 지키기 위한 Red-Green-Refactor 사이클:

1. **Red — 실패하는 테스트 작성**: 원하는 동작을 서술하는 테스트를 먼저 쓴다. 이 단계의 핵심은 **테스트가 실제로 실패하는 것을 눈으로 확인**하는 것이다. "실행도 안 해 보고 통과했을 것"이라는 착각을 막는다.
2. **Green — 테스트를 통과시키는 최소 구현**: 테스트를 초록불로 만드는 가장 단순한 코드를 쓴다. 이 단계에서는 "미래를 위한 일반화"를 하지 않는다.
3. **Refactor — 중복 제거**: 테스트를 통과한 상태를 유지하면서 코드 품질을 높인다. 테스트가 있기 때문에 리팩토링이 안전하다.

**좋은 TDD 예**와 **나쁜 TDD 예**의 차이는 보통 "실패 확인"에 있다. `expect(add(2, 3)).toBe(5)`라고 쓴 뒤 실제로 실행해서 `ReferenceError: add is not defined`를 눈으로 본 뒤에야 `function add()` 작성으로 넘어가는 것이 진짜 TDD다.

## 한 줄 요약

**실패하는 테스트 없이는 프로덕션 코드를 한 줄도 쓰지 않는다**는 철칙(Iron Law)을 가진 스킬이다. Red(실패) → Green(통과) → Refactor(정제) 사이클로 구현을 진행한다.

## 프로젝트에 도입하기

```bash
/test-driven-development
```

**SKILL.md 파일 위치**: `~/.claude/skills/test-driven-development/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판에 "검색 기능"을 추가하려 한다. 사용자가 입력한 키워드로 공지 제목을 부분 일치 검색하는 함수다. TDD로 구현해 보자.

### 1단계 — Red: 실패하는 테스트 작성

```ts
// tests/search.test.ts
import { describe, it, expect } from "vitest";
import { filterNoticesByKeyword } from "@/lib/notices/search";

describe("filterNoticesByKeyword", () => {
  const notices = [
    { id: "1", title: "MT 공지", body: "..." },
    { id: "2", title: "회비 납부 안내", body: "..." },
    { id: "3", title: "정기 회의 MT 일정", body: "..." },
  ];

  it("제목에 키워드가 포함된 공지만 반환한다", () => {
    const result = filterNoticesByKeyword(notices, "MT");
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.id)).toEqual(["1", "3"]);
  });

  it("키워드가 비어 있으면 전체 목록을 반환한다", () => {
    expect(filterNoticesByKeyword(notices, "")).toHaveLength(3);
  });

  it("대소문자를 구분하지 않는다", () => {
    expect(filterNoticesByKeyword(notices, "mt")).toHaveLength(2);
  });
});
```

이 상태로 `pnpm test`를 돌리면 **모듈을 찾을 수 없음**이라는 에러로 실패한다. 이 실패를 눈으로 확인하는 것이 Red 단계의 핵심이다.

```bash
pnpm test
# FAIL tests/search.test.ts
# Cannot find module '@/lib/notices/search'
```

### 2단계 — Green: 최소 구현

```ts
// lib/notices/search.ts
interface Notice {
  id: string;
  title: string;
  body: string;
}

export function filterNoticesByKeyword(notices: Notice[], keyword: string): Notice[] {
  if (keyword === "") return notices;
  const needle = keyword.toLowerCase();
  return notices.filter((n) => n.title.toLowerCase().includes(needle));
}
```

다시 `pnpm test`를 돌리면 초록불이다.

```bash
pnpm test
# PASS tests/search.test.ts (3 tests)
```

### 3단계 — Refactor: 정제

세 번째 테스트를 통과시키기 위해 이미 `toLowerCase()`를 넣었다. 추가로 정리할 점이 있는가? `Notice` 타입을 전역 `types.ts`로 옮기는 정도의 소소한 정리만 하고, 과한 일반화(예: "body도 검색하도록 확장")는 하지 않는다. 그건 다음 Red 단계에서 테스트로 요구될 때 추가한다.

```ts
// lib/notices/search.ts (refactored)
import type { Notice } from "@/types/notice";

export function filterNoticesByKeyword(notices: Notice[], keyword: string): Notice[] {
  if (keyword === "") return notices;
  const needle = keyword.toLowerCase();
  return notices.filter((n) => n.title.toLowerCase().includes(needle));
}
```

### 버그 수정 시의 TDD

나중에 "제목에 공백이 양끝에 있는 키워드는 검색되지 않는다"는 버그 제보가 오면, **먼저 이 버그를 재현하는 실패 테스트**(`"  MT  "` 입력 시에도 공지 2개 반환)를 쓰고, 그다음 `keyword.trim()`을 추가한다. 이 순서가 중요하다.

## 학습 포인트 / 흔한 함정

- **"실패를 눈으로 보는 것"이 핵심**: TDD의 가장 흔한 오해는 "테스트 먼저 쓰면 된다"로 끝나는 것이다. 실제로는 **실패 확인 → 통과 확인**의 왕복이 핵심이다. 실패를 안 보고 넘어가면 "테스트가 애초에 잘못 작성돼서 항상 통과"하는 경우를 못 잡는다.
- **대학생 과제에서의 가치**: 과제 요구사항은 자연어로 주어지고, 해석의 여지가 많다. 테스트로 요구사항을 **실행 가능한 명세**로 고정하면 나중에 "이게 맞는 건가?"로 되돌아가는 시간이 줄어든다.
- **TDD ≠ 100% 커버리지**: 모든 코드를 테스트로 덮으라는 말이 아니다. "내가 의도한 동작이 실제로 구현됐는지" 확인할 수 있는 최소한의 테스트를 먼저 쓴다는 원칙이다.
- **Next.js 15 팁**: Server Component는 순수 함수에 가까운 부분(데이터 변환, 필터링)과 사이드 이펙트 부분(`fetch`, DB 쿼리)을 분리해 둘수록 TDD가 쉽다. 위 예제에서도 `filterNoticesByKeyword`는 순수 함수로 분리돼 테스트가 간단했다.
- **`systematic-debugging`과의 연결**: 버그 수정 시 TDD는 자연스럽게 "근본 원인 확정 후 테스트 작성 → 수정" 흐름과 결합된다. 두 스킬을 같이 쓰면 버그가 재발하지 않는다.

## 관련 리소스

- [systematic-debugging](./systematic-debugging.md) — 버그 근본 원인 확정 후 TDD와 결합
- [verification-before-completion](./verification-before-completion.md) — 완료 전 테스트 실행 검증
- [review](./review.md) — 테스트 커버리지 포함 코드 리뷰

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
