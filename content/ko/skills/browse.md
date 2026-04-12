---
title: "헤드리스 브라우저 테스트 (Browse)"
source: "~/.claude/skills/browse/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 헤드리스 브라우저 테스트 (Browse)

## 한 줄 요약

URL을 열고 클릭·입력·스크린샷·레이아웃 검증까지 ~100ms 단위로 실행하는 **빠른 헤드리스 브라우저 QA 도구**다. 배포 직후 사이트를 직접 "사람처럼" 돌아다니며 버그를 증거와 함께 잡아낸다.

## 언제 사용하나요?

- 새 기능을 배포한 직후 "실제로 화면에 잘 나오는지" 육안으로 확인하고 싶을 때
- 폼 제출, 파일 업로드, 다이얼로그 같은 상호작용 흐름을 자동으로 테스트할 때
- 모바일/태블릿 반응형 레이아웃이 깨지지 않는지 확인할 때
- 버그를 발견했을 때 재현 단계와 스크린샷을 함께 담은 버그 리포트를 만들 때
- "브라우저에서 열어 봐", "사이트 스크린샷 찍어 줘", "이 기능 직접 써 봐" 같은 요청을 받았을 때

## 핵심 개념

Browse 스킬의 핵심은 **헤드리스 브라우저(headless browser)** 를 Claude가 직접 조종한다는 점이다. 일반 Playwright/Puppeteer 스크립트와 달리 테스트 코드를 사전에 작성할 필요 없이, 자연어 명령으로 브라우저를 제어한다.

주요 기능은 다음과 같다.

- **Navigate**: 임의의 URL로 이동, SPA 라우팅 포함
- **Interact**: 버튼 클릭, 텍스트 입력, 드롭다운 선택, 파일 첨부, 다이얼로그 처리
- **Assert**: 특정 요소가 화면에 있는지, 텍스트가 맞는지, 상태가 올바른지 검증
- **Diff**: 액션 전후 DOM 상태를 비교해 의도치 않은 변화 탐지
- **Screenshot**: 주석(annotation)이 달린 스크린샷으로 어디가 문제인지 시각적으로 표시
- **Responsive check**: 뷰포트 크기를 바꿔 모바일/태블릿 레이아웃 검증

각 명령은 약 100ms 내외로 실행되므로, 여러 단계를 연속으로 실행해도 빠르게 결과를 얻을 수 있다. gstack 생태계 스킬로 제공되며, QA-Only 스킬이나 ship 스킬과 함께 사용하면 배포 파이프라인에 자연스럽게 통합된다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트를 Vercel에 배포했다. 공지 작성 폼과 공지 목록 페이지가 잘 동작하는지, 그리고 모바일 화면에서 레이아웃이 깨지지 않는지 확인하고 싶다.

### 1단계: 배포 URL 접속 및 목록 페이지 확인

```
> browse 스킬로 https://my-club-board.vercel.app/notices 를 열고
  공지 목록이 화면에 렌더링되는지 확인해 줘.
```

Claude가 수행하는 작업:
- URL 접속 후 `<ul>` 또는 공지 카드 컴포넌트가 DOM에 존재하는지 assert
- 공지가 0건인지, 실제 데이터가 있는지 스크린샷으로 캡처

### 2단계: 공지 작성 폼 제출 테스트

```
> /notices/new 에서 제목 "4월 정기 모임 안내", 내용 "4월 15일 오후 6시..."를
  입력하고 제출 버튼을 클릭한 뒤 /notices 로 리다이렉트되는지 확인해 줘.
```

Claude가 자동으로 처리하는 것들:

```ts
// Browse 스킬이 내부적으로 수행하는 흐름 (의사 코드)
await page.goto("/notices/new");
await page.fill('[name="title"]', "4월 정기 모임 안내");
await page.fill('[name="body"]', "4월 15일 오후 6시...");
// 제출 전 스크린샷 (before)
await page.screenshot({ annotate: true });
await page.click('button[type="submit"]');
// 제출 후 상태 diff (after)
await page.assertURL("/notices");
// 목록에 새 공지가 나타나는지 assert
await page.assertText("4월 정기 모임 안내");
```

### 3단계: 모바일 반응형 레이아웃 검증

```
> 뷰포트를 375x812(iPhone 14)로 설정하고 /notices 페이지를 열어서
  공지 카드가 가로로 넘치지 않는지 확인하고 스크린샷을 찍어 줘.
```

만약 overflow가 발생하면 Claude는 주석이 달린 스크린샷과 함께 구체적인 CSS 클래스명을 지목해 리포트한다.

### 4단계: 버그 재현 리포트 생성

```
> /notices/[id]/edit 에서 저장 버튼을 눌렀을 때 가끔 "500 Internal Server Error"가
  발생한다고 보고됐어. 직접 재현해 보고 스크린샷 + 재현 단계를 정리해 줘.
```

Browse 스킬은 재현 단계, 발생 URL, 오류 메시지, 스크린샷을 묶어 구조화된 버그 리포트를 출력한다.

## 학습 포인트

- **Playwright 스크립트를 미리 짤 필요가 없다**: 전통적인 E2E 테스트는 테스트 코드를 먼저 작성해야 하지만, Browse 스킬은 자연어 명령으로 바로 실행된다. 학기 말 데모 직전에 빠르게 "동작 확인"이 필요할 때 특히 유용하다.
- **스크린샷 = 버그 증거**: 팀원에게 버그를 설명할 때 "화면이 이렇게 됐어요"라는 말 대신 주석 달린 스크린샷을 첨부하면 소통이 훨씬 명확해진다.
- **Next.js 15 Server Action과 조합**: `createNotice` Server Action 이후 리다이렉트가 올바르게 동작하는지, `revalidatePath`가 실제로 캐시를 무효화하는지 Browse 스킬로 직접 확인할 수 있다. 단위 테스트만으로는 "실제 브라우저에서의 동작"을 보장할 수 없기 때문에 이 조합이 강력하다.
- **흔한 함정 — localhost와 배포 환경의 차이**: Browse 스킬은 실제 URL을 대상으로 동작한다. 로컬 `localhost:3000`도 가능하지만, 환경 변수(`.env.local` vs Vercel 환경 변수)에 따라 동작이 달라질 수 있다. 반드시 어느 환경을 테스트하는지 명시하자.
- **QA-Only 스킬과의 차이**: Browse 스킬은 단일 시나리오를 빠르게 검증하는 도구다. 전체 사이트를 체계적으로 스캔하고 헬스 스코어와 구조화된 리포트를 원한다면 QA-Only 스킬을 사용해야 한다.

## 원본과의 차이

- 원본은 gstack 생태계 스킬로 `qa`, `qa-only`, `ship` 스킬과 파이프라인으로 연결된다. 본 해설은 독립적으로 Browse 스킬을 사용하는 시나리오에 집중했다.
- 원본에서 언급하는 "annotated screenshots"와 "diff before/after" 기능은 본 해설에서도 강조했다.
- 원본의 "dogfood a user flow" 개념을 한국 대학생 맥락의 "배포 후 직접 사용해 보기" 관점으로 재해석했다.
- Next.js 15 Server Action, Vercel 배포, 반응형 레이아웃 검증 등 한국 대학생이 자주 쓰는 스택 기준으로 예제를 재구성했다.

> 원본: `~/.claude/skills/browse/SKILL.md`
