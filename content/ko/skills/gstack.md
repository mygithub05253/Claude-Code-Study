---
title: "GStack 헤드리스 브라우저 (GStack)"
source: "~/.claude/skills/gstack/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# GStack 헤드리스 브라우저 (GStack)

## 한 줄 요약

빠른 헤드리스 브라우저 기반의 **범용 QA 자동화 엔진**으로, 페이지 탐색·요소 조작·상태 검증·스크린샷 촬영·반응형 레이아웃 테스트·폼·파일 업로드·다이얼로그까지 처리하며 버그 증거를 캡처한다.

## 언제 사용하나요?

- "사이트 열어서 확인해 줘", "배포 검증해 줘" 같이 브라우저로 직접 확인이 필요할 때
- 신규 배포 직후 핵심 사용자 플로우를 dogfooding(직접 사용해 보기)할 때
- 폼 제출·파일 업로드·다이얼로그 처리를 자동화해 E2E 흐름을 검증할 때
- 버그를 발견했을 때 재현 단계와 스크린샷을 묶어 버그 리포트를 만들 때
- 모바일/태블릿 반응형 레이아웃을 여러 뷰포트에서 한 번에 확인할 때

## 핵심 개념

### GStack 생태계란?

GStack은 단순한 단일 도구가 아니라 **여러 Claude Code 스킬이 공유하는 브라우저 자동화 엔진**이다. 다음과 같은 스킬들이 GStack 위에 구축되어 있다.

| 스킬 | 역할 | GStack 의존도 |
|------|------|--------------|
| `gstack` | 범용 브라우저 자동화 엔진 | 기반 엔진 자체 |
| `browse` | 단일 시나리오 빠른 검증 특화 | gstack 위에 구축 |
| `qa` | 전체 사이트 품질 스코어링 | gstack 위에 구축 |
| `qa-only` | QA만 분리 실행 | gstack 위에 구축 |
| `canary` | 배포 후 헬스 체크 | gstack 위에 구축 |
| `land-and-deploy` | 프로덕션 배포 검증 | gstack 위에 구축 |

### gstack vs browse 스킬

두 스킬 모두 헤드리스 브라우저를 사용하지만 용도가 다르다.

| 비교 항목 | gstack | browse |
|-----------|--------|--------|
| 역할 | 범용 브라우저 자동화 엔진 | gstack 위에 구축된 특화 스킬 |
| 사용 범위 | 독립적으로 모든 브라우저 작업 | 단일 시나리오의 빠른 점검 |
| 호출 방식 | 직접 호출하거나 다른 스킬의 기반으로 사용 | 직접 호출 전용 |
| 복잡한 플로우 | 다단계 조건 분기 처리 가능 | 단순 직선 시나리오 최적화 |
| 비교 시점 | diff, 어노테이션, 반응형 등 풍부한 기능 | 필요한 핵심 기능만 |

**실용적 가이드라인**: "사이트 열어서 확인해 줘" 같은 간단한 요청은 `browse`로 충분하다. 여러 조건, 복잡한 상호작용 플로우, 다른 스킬과의 파이프라인 연계가 필요하면 `gstack`을 직접 사용하거나 gstack 기반 스킬(qa, canary 등)을 사용한다.

### 주요 기능

**Navigate**: 임의의 URL로 이동, SPA 클라이언트 라우팅 포함. Next.js App Router의 `Link` 컴포넌트로 이동하는 것도 추적한다.

**Interact**: 버튼 클릭, 텍스트 입력, 드롭다운 선택, 파일 첨부, 다이얼로그(alert/confirm/custom modal) 처리.

**Verify State**: 특정 요소 존재 여부, 텍스트 값, URL 변경, 네트워크 응답 상태 코드 등 다양한 단언(assertion).

**Diff**: 액션 전후의 DOM 상태를 비교해 의도치 않은 변화나 리렌더링 문제를 탐지.

**Annotated Screenshots**: 어디가 문제인지 화살표·하이라이트가 달린 스크린샷으로 버그 증거를 시각화.

**Responsive Layouts**: 지정 뷰포트(모바일 375px, 태블릿 768px, 데스크톱 1280px 등)에서 레이아웃을 검증.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판(Next.js 15 + TypeScript + Supabase)을 Vercel에 배포했다. 공지 작성 → 목록 확인 → 수정 → 삭제의 전체 CRUD 플로우를 배포 환경에서 자동으로 검증하고 싶다.

### 1단계: 전체 CRUD 플로우 자동 검증

```
> gstack으로 https://club-board.vercel.app 에서
  임원 계정(officer@club.ac.kr / password123)으로 로그인하고
  공지를 작성 → 목록에서 확인 → 수정 → 삭제하는 전체 흐름을 테스트해 줘.
  각 단계마다 스크린샷 찍어 줘.
```

GStack이 내부적으로 수행하는 흐름(의사 코드):

```ts
// GStack 내부 실행 흐름 (의사 코드, 직접 작성하는 코드가 아님)

// 1. 로그인
await gstack.navigate("https://club-board.vercel.app/login");
await gstack.fill('[name="email"]', "officer@club.ac.kr");
await gstack.fill('[name="password"]', "password123");
await gstack.click('button[type="submit"]');
await gstack.assertURL("/notices"); // 로그인 후 리다이렉트 확인
await gstack.screenshot({ label: "로그인_성공" });

// 2. 공지 작성
await gstack.navigate("/notices/new");
await gstack.fill('[name="title"]', "테스트 공지 — 자동화");
await gstack.fill('[name="body"]', "GStack 자동 테스트로 작성된 공지입니다.");
await gstack.click('[data-testid="submit-btn"]');
await gstack.assertURL(/\/notices\/\d+/); // 작성 후 상세 페이지 이동
await gstack.assertText("테스트 공지 — 자동화");
await gstack.screenshot({ label: "공지_작성_완료" });

// 3. 목록에서 새 공지 확인
await gstack.navigate("/notices");
await gstack.assertText("테스트 공지 — 자동화");
await gstack.screenshot({ label: "목록_확인" });

// 4. 수정
await gstack.click('[data-notice-title="테스트 공지 — 자동화"]');
await gstack.click('[data-testid="edit-btn"]');
await gstack.fill('[name="title"]', "테스트 공지 — 수정됨");
await gstack.click('button[type="submit"]');
await gstack.assertText("테스트 공지 — 수정됨");
await gstack.screenshot({ label: "수정_완료" });

// 5. 삭제
await gstack.click('[data-testid="delete-btn"]');
await gstack.clickDialog("확인"); // confirm 다이얼로그 처리
await gstack.assertURL("/notices");
await gstack.assertNotText("테스트 공지 — 수정됨");
await gstack.screenshot({ label: "삭제_완료" });
```

### 2단계: 파일 업로드 테스트

공지에 첨부파일 업로드 기능이 있다면:

```
> gstack으로 /notices/new 에서 첨부파일(test.pdf, 2MB)을 업로드하고
  파일 미리보기가 표시되는지, 제출 후 Supabase Storage URL이 응답에 포함되는지 확인해 줘.
```

### 3단계: 반응형 레이아웃 다중 뷰포트 검증

```
> gstack으로 /notices 페이지를 375px(모바일), 768px(태블릿), 1280px(데스크톱)에서
  각각 열어 스크린샷을 찍고 레이아웃 오버플로우가 없는지 확인해 줘.
```

### 4단계: 버그 리포트 자동 생성

```
> gstack으로 /notices/42/edit 에서 내용을 수정하고 저장할 때
  간헐적으로 500 에러가 발생한다는 제보가 있어. 10번 반복해서 재현 시도하고
  에러 발생 시 스크린샷 + 네트워크 응답을 묶어 버그 리포트 만들어 줘.
```

### Next.js 15에서 테스트 안정성 높이기

GStack을 Next.js 15 프로젝트에서 잘 쓰려면 `data-testid` 속성을 미리 추가해 두는 것이 좋다.

```tsx
// components/notice/NoticeForm.tsx
export function NoticeForm() {
  return (
    <form>
      <input
        name="title"
        data-testid="notice-title-input"
        // ...
      />
      <textarea
        name="body"
        data-testid="notice-body-input"
        // ...
      />
      <button
        type="submit"
        data-testid="notice-submit-btn"
        // ...
      >
        등록하기
      </button>
    </form>
  );
}
```

## 학습 포인트

- **GStack은 Playwright 사전 설정이 필요 없다**: 기존 Playwright 테스트는 테스트 파일을 직접 작성해야 하지만, GStack은 자연어 명령으로 바로 실행된다. 테스트 코드가 없는 프로젝트에서 즉시 사용할 수 있다.
- **`data-testid`는 선물이다**: 컴포넌트를 작성할 때 `data-testid` 속성을 달아 두면 GStack(과 미래의 Playwright 테스트)이 훨씬 안정적으로 요소를 찾는다. 클래스명이나 텍스트로 요소를 찾으면 스타일 변경 시 테스트가 깨진다.
- **배포 직후 5분 검증**: Vercel에 배포한 뒤 GStack으로 핵심 플로우 1~2개만 자동 검증해도 "배포 후 뭔가 깨진 것"을 즉시 발견할 수 있다. `canary` 스킬과 함께 CI 파이프라인에 넣으면 더 강력하다.
- **흔한 함정 — Next.js 서버 컴포넌트의 hydration 시간**: 서버 컴포넌트가 데이터를 가져오는 동안 GStack이 너무 빨리 요소를 클릭하면 에러가 날 수 있다. GStack은 내부적으로 요소가 인터랙션 가능한 상태가 될 때까지 대기하지만, Suspense boundary가 제대로 설정되어 있어야 안정적이다.
- **스크린샷 증거는 팀 소통의 언어다**: 버그를 말로 설명하는 대신 GStack이 촬영한 어노테이션 스크린샷을 슬랙/디스코드에 공유하면 팀원이 바로 이해한다. 대학교 팀 프로젝트에서 이슈 트래킹 없이 소통할 때 특히 유용하다.

## 원본과의 차이

- 원본은 gstack 엔진 자체의 내부 구현을 설명하지 않는다. 본 해설은 "GStack이 다른 스킬들의 기반 엔진"이라는 아키텍처적 위치를 명시적으로 표로 정리했다.
- `browse` 스킬과의 차이를 비교 표로 구체화했다. 원본의 설명만으로는 두 스킬의 용도 차이가 명확하지 않기 때문이다.
- 원본의 "dogfood a user flow" 개념을 "배포 후 전체 CRUD 플로우 검증"이라는 구체적인 Next.js 15 + Supabase 시나리오로 재해석했다.
- `data-testid` 패턴과 Next.js Suspense boundary 주의사항은 원본에 없는 내용으로, 한국 대학생의 실제 개발 환경에 맞춰 추가했다.

> 원본: `~/.claude/skills/gstack/SKILL.md`
