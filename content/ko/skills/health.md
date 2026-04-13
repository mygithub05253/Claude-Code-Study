---
title: "코드 품질 대시보드 (Health)"
source: "~/.claude/skills/health/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["health", "코드 품질", "대시보드", "tsc", "eslint", "vitest", "knip"]
category: "메타"
---

# 코드 품질 대시보드 (Health)

## 핵심 개념

### 실행하는 도구들

Health 스킬은 프로젝트에 존재하는 도구를 **자동으로 감지**하여 실행한다. 없는 도구는 건너뛰고, 있는 것만 실행한다.

| 도구 범주 | 예시 도구 | 가중치 |
|---|---|---|
| 타입 체커 | `tsc --noEmit` | 30% |
| 린터 | `eslint`, `biome` | 25% |
| 테스트 러너 | `vitest`, `jest` | 25% |
| 사용하지 않는 코드 감지 | `knip`, `ts-prune` | 10% |
| 셸 린터 | `shellcheck` | 10% |

### 언제 사용하나요?

- "지금 코드베이스가 얼마나 건강한가?"를 빠르게 파악하고 싶을 때
- 개별 도구(tsc, eslint, vitest 등)를 하나씩 돌리는 대신 **한 번의 명령**으로 종합 상태를 보고 싶을 때
- 새 기능 개발 전, 현재 기술 부채 수준을 파악하고 우선순위를 정할 때
- 주간 회고(retro)와 함께 코드 품질 트렌드를 추적할 때
- "health check", "code quality", "quality score", "run all checks" 등의 표현으로 Claude에게 요청할 때

### 점수 계산 방식

각 도구의 결과를 0~10점으로 정규화한 뒤, 가중 평균으로 종합 점수를 계산한다.

```
종합 점수 = Σ(도구 점수 × 가중치)

예시:
- tsc: 에러 0개 → 10점 × 0.30 = 3.0
- eslint: 경고 2개 → 8점 × 0.25 = 2.0
- vitest: 커버리지 65% → 6.5점 × 0.25 = 1.625
- knip: 미사용 3개 → 7점 × 0.10 = 0.7
- shellcheck: 해당 없음 → 제외(나머지 가중치 재분배)
종합: 약 8.2점
```

### 트렌드 추적

점수는 `.health-history.json`(또는 유사한 파일)에 타임스탬프와 함께 저장된다. 이를 통해 "3주 전보다 타입 에러가 줄었나?", "배포 직전 테스트 커버리지가 떨어졌나?"를 추적할 수 있다.

## 한 줄 요약

프로젝트에 이미 있는 타입 체커, 린터, 테스트 러너, 사용하지 않는 코드 감지기, 셸 린터를 한꺼번에 실행하고, **가중치 기반 0~10점 종합 점수**와 시간별 트렌드를 제공하는 코드 품질 대시보드 스킬이다.

## 프로젝트에 도입하기

```bash
/health
```

**SKILL.md 파일 위치**: `~/.claude/skills/health/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판" 프로젝트. 공지 기능을 빠르게 개발하다 보니 코드 품질이 어떤지 불안해졌다. 주간 회고 전에 health 스킬을 먼저 실행한다.

```bash
# Claude Code 세션에서
> health 스킬로 현재 코드 품질 점검해 줘
```

**health 스킬이 실행하는 명령들**

```bash
# 타입 체커
pnpm tsc --noEmit

# 린터
pnpm eslint . --max-warnings 0

# 테스트 (커버리지 포함)
pnpm vitest run --coverage

# 사용하지 않는 코드 감지
pnpm knip
```

**출력 예시**

```
╔══════════════════════════════════════════════════════╗
║          코드 품질 대시보드 — 2026-04-12             ║
╠══════════════════════════════════════════════════════╣
║ 종합 점수:  7.4 / 10.0   (지난주: 6.9 ↑ +0.5)      ║
╠══════════════════════════════════════════════════════╣
║ tsc          10.0      에러 0개                      ║
║ eslint        8.0      경고 2개                      ║
║ vitest        6.0      커버리지 38% (목표: 70%)      ║
║ knip          7.0      미사용 export 3개             ║
║ shellcheck    N/A  --  셸 스크립트 없음              ║
╠══════════════════════════════════════════════════════╣
║ 트렌드 (최근 3주)                                    ║
║   W13: 6.2  W14: 6.9  W15: 7.4                      ║
╚══════════════════════════════════════════════════════╝

개선 우선순위
1. [높음] vitest 커버리지 38% → 70% 목표
   미커버 핵심 파일: app/notices/create/actions.ts
2. [중간] eslint 경고 2개
   - no-unused-vars: NoticeList.tsx:34
   - @typescript-eslint/no-floating-promises: page.tsx:12
3. [낮음] knip 미사용 export 3개
   - lib/utils/formatDate.ts: formatRelativeDate
   - types/notice.ts: NoticeStatus (deprecated 처리 권장)
```

**프로젝트 설정 예시 (`package.json` 스크립트)**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "check:unused": "knip",
    "health": "pnpm type-check && pnpm lint && pnpm test:coverage && pnpm check:unused"
  }
}
```

**ESLint 경고 수정 예시**

```typescript
// 경고 1: no-unused-vars
// NoticeList.tsx:34
const NoticeList = ({ notices, onDelete }: NoticeListProps) => {
  // onDelete가 정의되어 있지만 컴포넌트 내부에서 사용되지 않음
  return <ul>{notices.map(n => <NoticeItem key={n.id} notice={n} />)}</ul>;
};

// 수정: 실제로 사용하거나 props에서 제거
const NoticeList = ({ notices }: Pick<NoticeListProps, "notices">) => {
  return <ul>{notices.map(n => <NoticeItem key={n.id} notice={n} />)}</ul>;
};

// 경고 2: @typescript-eslint/no-floating-promises
// page.tsx:12 — await 없이 Promise를 호출
prefetchNotices(); // ← Promise를 fire-and-forget으로 호출, 에러를 잡지 않음

// 수정: void로 명시하거나 await 사용
void prefetchNotices(); // 의도적 fire-and-forget임을 명시
```

**트렌드 히스토리 저장 예시**

```typescript
// .health-history.json (자동 생성, git 커밋 권장)
interface HealthSnapshot {
  date: string;       // "2026-04-12"
  score: number;      // 7.4
  tsc: number | null; // 10.0
  eslint: number | null; // 8.0
  vitest: number | null; // 6.0
  knip: number | null;   // 7.0
  shellcheck: number | null; // null
}
```

## 학습 포인트 / 흔한 함정

- **종합 점수는 나침반이지 목적지가 아니다**: 10점 만점이 목표가 아니라, 점수가 낮아지는 트렌드가 "뭔가 잘못되고 있다"는 신호다. 7점이라도 꾸준히 유지되거나 올라간다면 건강한 상태다.
- **가중치는 프로젝트 성격에 맞게 조정**: 타입 안정성이 중요한 프로젝트는 tsc 가중치를 높이고, 사용자 대면 기능이 중요한 프로젝트는 테스트 가중치를 높인다. 기본값을 맹목적으로 따르지 말자.
- **흔한 실수 — 점수 게임**: 미사용 변수를 `_`로 이름 바꾸거나, 의도적으로 테스트를 skip해서 점수를 높이는 행동은 무의미하다. 점수는 팀이 코드 품질에 주의를 기울이고 있는지를 보여주는 것이지, 높으면 보상을 받는 게임이 아니다.
- **Next.js 15 팁**: `tsc --noEmit`은 App Router의 타입 안전성을 검증하지만, Server Component와 Client Component 간 props 전달에서 발생하는 일부 타입 에러는 런타임에서만 나타날 수 있다. health 점수가 높아도 실제 페이지 동작을 직접 테스트하는 것을 병행한다.
- **CI에 통합**: `pnpm health` 스크립트를 GitHub Actions에 추가하면 PR마다 자동으로 품질 기준을 통과하는지 확인할 수 있다. 7점 이하면 PR 머지를 차단하는 정책도 고려해볼 수 있다.

## 관련 리소스

- [canary](./canary.md) — 배포 후 런타임 헬스 체크 (Health의 보완 도구)
- [cso](./cso.md) — 보안 감사 (Health의 보안 측면 강화)
- [benchmark](./benchmark.md) — 성능 측정 (Health의 성능 차원 확장)

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
