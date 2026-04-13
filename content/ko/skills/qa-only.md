---
title: "QA 버그 보고서 전용 (QA-Only)"
source: "~/.claude/skills/qa-only/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack 생태계)"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["QA", "테스트", "버그리포트", "헬스스코어", "gstack"]
category: "품질/안전"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# QA 버그 보고서 전용 (QA-Only)

## 핵심 개념

### QA-Only vs QA의 차이

QA-Only 스킬과 일반 QA 스킬(`/qa`)은 근본적으로 다른 목적을 가진다.

| | QA-Only | QA |
|------|---------|-----|
| 목적 | 버그 발견 + 리포트만 | 버그 발견 + 수정 + 검증 |
| 코드 변경 | 절대 없음 | 있음 |
| 산출물 | 구조화된 리포트 | 수정된 코드 + 검증 결과 |
| 사용 시점 | 현황 파악, 리포트 생성 | 즉시 수정이 필요한 경우 |

QA-Only는 "탐정처럼 증거만 수집"하는 역할이다. 코드에 손을 대지 않기 때문에 다음과 같은 상황에서 특히 적합하다.

- **코드를 수정할 권한이 없는 경우** (다른 사람 코드를 검토할 때)
- **수정 전 기준선(baseline) 문서가 필요한 경우** (리팩토링 전 현재 버그 목록 확보)
- **이해관계자 보고** (교수님, PM, 팀 리더에게 현황 보고 시)

### 리포트 구성 요소

QA-Only 스킬이 생성하는 리포트는 다음 항목을 포함한다.

- **헬스 스코어(Health Score)**: 전체 페이지/기능 중 정상 동작 비율 (예: 78/100)
- **발견된 버그 목록**: 심각도(Critical/High/Medium/Low)로 분류
- **스크린샷**: 각 버그의 시각적 증거, 문제 영역에 주석 표시
- **재현 단계(Repro Steps)**: 버그를 재현하기 위한 단계별 절차
- **영향 범위**: 어떤 사용자, 어떤 플로우에 영향을 미치는지

### 체계적 테스트 방법론

QA-Only는 단순히 몇 개 페이지를 클릭하는 게 아니라 **체계적인 커버리지**를 목표로 한다.

1. 모든 페이지 라우트 순회
2. 핵심 사용자 플로우(happy path) 실행
3. 엣지 케이스 및 오류 경로 테스트
4. 반응형 레이아웃 (모바일/태블릿/데스크탑) 확인
5. 접근성 기본 항목 확인

## 한 줄 요약

웹 애플리케이션을 체계적으로 테스트하고 **헬스 스코어, 스크린샷, 재현 단계**가 담긴 구조화된 리포트를 생성하되, **절대 코드를 수정하지 않는** 리포트 전용 QA 스킬이다.

## 프로젝트에 도입하기

```bash
/qa-only
```

**SKILL.md 파일 위치**: `~/.claude/skills/qa-only/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트를 Vercel에 배포했다. 교수님 최종 발표까지 3일이 남았고, 팀장이 "전체 버그 현황 리포트를 만들어서 팀 회의에서 공유해 줘"라고 요청했다. 직접 고칠 시간은 없고, 우선 무엇이 문제인지 파악해야 한다.

### 전체 사이트 QA 리포트 요청

```
> qa-only 스킬로 https://my-club-board.vercel.app 전체를 테스트하고
  구조화된 버그 리포트를 만들어 줘.
  코드는 수정하지 말고 리포트만 작성해.
```

### 생성되는 리포트 예시

```markdown
# 동아리 공지 게시판 QA 리포트
날짜: 2026-04-12
테스트 환경: Vercel 배포 (https://my-club-board.vercel.app)
헬스 스코어: 71/100

---

## 요약

| 심각도 | 건수 |
|-------|------|
| Critical | 1 |
| High | 3 |
| Medium | 4 |
| Low | 2 |

---

## Critical 버그

### BUG-001: 로그인하지 않은 사용자도 공지 작성 가능
**심각도**: Critical
**영향**: 모든 미인증 사용자
**재현 단계**:
1. 로그아웃 상태에서 `/notices/new` 직접 접속
2. 제목과 내용 입력 후 "공지 등록" 클릭
3. → 공지가 정상 등록됨 (인증 없이)

**스크린샷**: [BUG-001-screenshot.png]
**예상 동작**: 로그인 페이지로 리다이렉트되어야 함
```

### GitHub Issues 연동

```
> qa-only 리포트의 Critical/High 버그를
  GitHub Issues 형식으로 각각 정리해 줘.
  레이블은 "bug", 심각도별 레이블(critical/high/medium/low) 추가.
```

```ts
// GitHub Issues API로 자동 생성할 수도 있음
const issues = qaReport.bugs
  .filter(bug => bug.severity === "Critical" || bug.severity === "High")
  .map(bug => ({
    title: `[${bug.severity}] ${bug.title}`,
    body: `## 재현 단계\n${bug.reproSteps}\n\n## 예상 동작\n${bug.expected}`,
    labels: ["bug", bug.severity.toLowerCase()],
  }));
```

## 학습 포인트 / 흔한 함정

- **코드를 고치지 않는다는 원칙을 지켜라**: QA-Only 스킬의 핵심 가치는 "수정 없는 객관적 리포트"다. 버그를 발견했을 때 "잠깐만, 이것도 고쳐 줘"라는 유혹을 느끼면 스킬의 의도가 흐려진다. 수정이 필요하면 별도 세션에서 `/qa` 스킬을 사용하거나 수동으로 처리하자.
- **발표 전 기준선 확보**: 팀 프로젝트 발표 1~2주 전에 QA-Only를 돌려서 헬스 스코어를 기록해 두자. 이후 버그를 수정하면서 헬스 스코어가 어떻게 개선되는지 추적할 수 있다. 발표 시 "초기 71점 → 현재 94점"처럼 개선 과정을 보여주면 강한 인상을 준다.
- **Browse 스킬과의 차이**: Browse 스킬은 단일 시나리오를 빠르게 확인하는 도구다. QA-Only는 전체 사이트를 체계적으로 스캔하고 구조화된 리포트를 생성하는 데 특화되어 있다. 규모와 목적이 다르다.
- **흔한 함정 — 환경 의존성**: QA-Only는 실제 배포된 URL을 대상으로 테스트한다. 로컬 `localhost:3000`과 Vercel 배포 환경에서 동작이 다를 수 있다 (환경 변수, CORS 설정, Edge Runtime 차이 등). 어느 환경을 기준으로 할지 명확히 지정하자.
- **Next.js 15 관점**: Server Action의 응답, `revalidatePath` 동작, Suspense 경계의 로딩 상태 등은 단위 테스트로 확인하기 어렵다. QA-Only로 실제 배포 환경에서 확인하면 이런 통합 이슈를 발견할 수 있다.

## 관련 리소스

- [qa](./qa.md) — 버그 발견 + 자동 수정 QA 스킬
- [browse](./browse.md) — 단일 시나리오 Headless 브라우저 테스트
- [setup-browser-cookies](./setup-browser-cookies.md) — 인증 쿠키 세팅

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic (gstack 생태계) |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
