---
title: "주간 엔지니어링 회고 (Retro)"
source: "~/.claude/skills/retro/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["회고", "팀협업", "코드품질", "메트릭", "스프린트"]
category: "메타"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 주간 엔지니어링 회고 (Retro)

## 핵심 개념

Retro 스킬은 다음 세 가지 축으로 한 주를 분석한다.

### 1. 커밋 히스토리 분석 (What We Shipped)

- 이번 주 머지된 PR 목록과 각 PR의 변경 규모(파일 수, 라인 수)
- 기능 추가, 버그 수정, 리팩토링, 문서화, 테스트의 비율
- 배포된 기능 중 사용자에게 직접 영향을 주는 것 vs 내부 개선

### 2. 작업 패턴 분석 (How We Worked)

- 자주 수정된 파일/모듈: 핫스팟으로 기술 부채가 쌓이는 곳
- 커밋 시간대 분포: 야간 작업이 많으면 번아웃 신호
- PR 사이클 타임: PR 오픈 → 머지까지 걸린 시간

### 3. 코드 품질 트렌드 (Quality Metrics)

- 타입 오류, 린트 경고 증감
- 테스트 커버리지 변화
- 코드 복잡도(함수 크기, 중첩 깊이) 증감

### 팀 인식(Team Awareness)

팀원별로 기여를 세분화하며, 두 가지 관점을 균형 있게 다룬다.

- **칭찬(Praise)**: 이번 주 잘한 것, 팀에 기여한 것, 어려운 문제를 해결한 것
- **성장 포인트(Growth Areas)**: 앞으로 개선하면 좋을 것, 비판이 아닌 발전 방향으로 서술

회고 히스토리는 지속적으로 누적되어 **트렌드 추적**이 가능하다. "3주 전부터 테스트 커버리지가 낮아지고 있다"는 인사이트는 단기 회고로는 보이지 않는다.

## 한 줄 요약

한 주(또는 스프린트) 동안의 커밋 히스토리, 작업 패턴, 코드 품질 지표를 분석하고, 팀원별 기여를 칭찬과 성장 포인트로 정리하는 **주간 엔지니어링 회고** 스킬이다.

## 프로젝트에 도입하기

```bash
/retro
```

**SKILL.md 파일 위치**: `~/.claude/skills/retro/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판" 프로젝트 팀 3인(팀장 민준, 프론트엔드 서연, 백엔드 도현). 목요일 밤 스프린트 종료 후 금요일 오전에 회고를 진행한다.

```bash
# Claude Code 세션에서
> retro 스킬로 이번 주(2026-04-06 ~ 2026-04-12) 회고 진행해 줘.
> 팀원: 민준(minjun), 서연(seoyeon), 도현(dohyeon)
```

**회고 출력 예시**

```markdown
# 주간 엔지니어링 회고 (2026-04-06 ~ 2026-04-12)

## 배포한 것들 (What We Shipped)
- **feat: 공지 작성 기능** (PR #15, 서연) — 12파일, +340/-28줄
- **feat: 공지 상세 페이지** (PR #16, 민준) — 8파일, +210/-5줄
- **fix: 모바일 레이아웃 깨짐** (PR #17, 서연) — 2파일, +15/-8줄
- **feat: Supabase RLS 정책 설정** (PR #18, 도현) — 3파일, +90/-0줄
- **chore: pnpm 의존성 업데이트** (PR #19, 민준) — 1파일, +5/-5줄

기능 추가 60% / 버그 수정 20% / 설정 20% — 건강한 비율

## 작업 패턴
- 핫스팟: `app/notices/` (이번 주 전체 커밋의 68%)
  → 공지 기능이 집중 개발 중이므로 정상. 단, 이 폴더의 컴포넌트 크기가
    커지고 있으므로 다음 주에 분리 검토 필요.
- 커밋 시간대: 도현이 22:00~01:00 집중 (번아웃 주의)
- 평균 PR 사이클: 14시간 (목표: 8시간 이하)

## 코드 품질
- TypeScript 에러: 0건 유지 ✅
- ESLint 경고: 3건 → 1건 (개선) ✅
- 테스트 커버리지: 42% → 38% (주의) ⚠️
  → 공지 작성 Server Action에 테스트 없음

## 팀원별 기여

### 서연 (프론트엔드)
**칭찬**: 공지 작성 폼을 React Hook Form + Zod로 깔끔하게 구현했고,
에러 메시지 UX가 직관적입니다. 모바일 버그를 빠르게 수정한 것도 좋았습니다.
**성장 포인트**: NoticeForm 컴포넌트(240줄)가 커지고 있어요.
다음엔 폼 로직을 Custom Hook으로 분리해보는 것을 추천합니다.
```

**회고 히스토리 트렌드 예시 (3주 누적)**

```typescript
// 회고 히스토리를 JSON으로 관리하는 예시 (retro-history.json)
interface RetroWeek {
  week: string; // "2026-W15"
  testCoverage: number;
  lintWarnings: number;
  avgPrCycleHours: number;
  prCount: number;
}

const history: RetroWeek[] = [
  { week: "2026-W13", testCoverage: 52, lintWarnings: 5, avgPrCycleHours: 18, prCount: 3 },
  { week: "2026-W14", testCoverage: 42, lintWarnings: 3, avgPrCycleHours: 14, prCount: 5 },
  { week: "2026-W15", testCoverage: 38, lintWarnings: 1, avgPrCycleHours: 14, prCount: 5 },
];

// 트렌드: 린트 경고는 개선 중이지만 테스트 커버리지는 3주 연속 하락 중
// → 다음 주 최우선 과제: 테스트 추가
```

## 학습 포인트 / 흔한 함정

- **회고는 책임 추궁이 아니다**: "도현이 야간 작업을 왜 했냐"가 아니라 "야간 작업 패턴이 지속되면 번아웃이 올 수 있다"는 관찰이다. 회고의 톤은 항상 팀 전체의 성장을 위한 것이어야 한다.
- **숫자는 맥락과 함께**: 테스트 커버리지 38%는 좋을 수도, 나쁠 수도 있다. "공지 기능 집중 개발 기간이라 임시로 낮아진 것"인지, "지속적인 하락 추세"인지를 함께 봐야 한다.
- **흔한 실수 — 회고를 건너뜀**: 바쁠수록 회고가 생략된다. 하지만 방향이 잘못된 채로 바쁘게 달리면 나중에 더 많은 시간을 낭비한다. 30분의 회고가 다음 주 2-3시간을 아낄 수 있다.
- **Next.js 15 팁**: `generateStaticParams`, Server Action, Server Component 비율 같은 Next.js 특화 메트릭을 회고 항목에 추가하면 프레임워크를 올바르게 사용하고 있는지 주기적으로 확인할 수 있다.
- **gstack 생태계 팁**: retro 스킬은 `health` 스킬과 함께 사용하면 코드 품질 트렌드를 더 정밀하게 추적할 수 있다. 회고 전에 `health` 스킬로 현재 상태를 스냅샷으로 찍는 것을 권장한다.

## 관련 리소스

- [learn](./learn.md) — 프로젝트 학습 관리 (세션 연속성)
- [health](./health.md) — 코드베이스 건강 상태 점검
- [verification-before-completion](./verification-before-completion.md) — 완료 전 검증

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
