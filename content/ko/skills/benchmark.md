---
title: "성능 회귀 감지 (Benchmark)"
source: "~/.claude/skills/benchmark/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 성능 회귀 감지 (Benchmark)

## 한 줄 요약

Browse 데몬을 활용해 페이지 로드 시간, Core Web Vitals, 번들 크기 등의 **성능 기준선(baseline)을 수립하고, PR마다 이전/이후를 비교하여 성능 회귀를 자동으로 감지**하는 스킬이다.

## 언제 사용하나요?

- "이 페이지가 왜 이렇게 느리지?" 라는 의문이 생겼을 때
- PR을 머지하기 전에 성능 영향을 수치로 확인하고 싶을 때
- Lighthouse 점수, LCP·FID·CLS 같은 Core Web Vitals를 정기적으로 추적할 때
- 번들 사이즈(bundle size)가 배포마다 몰래 커지고 있는지 감시할 때
- "performance", "benchmark", "page speed", "lighthouse", "web vitals", "bundle size", "load time" 키워드가 등장하는 작업을 받았을 때

## 핵심 개념

### 성능 기준선(Baseline) 수립

Benchmark 스킬은 가장 먼저 현재 상태의 성능을 측정해 **기준선**으로 저장한다. 기준선 없이는 "빨라졌다/느려졌다"를 판단할 수 없기 때문이다. 측정 대상은 보통 다음과 같다.

- **페이지 로드 시간**: Time to First Byte(TTFB), First Contentful Paint(FCP), Largest Contentful Paint(LCP)
- **Core Web Vitals**: LCP / FID(Interaction to Next Paint, INP) / CLS
- **리소스 크기**: 번들 JS, CSS, 이미지, 폰트 합산
- **Lighthouse 점수**: Performance / Accessibility / Best Practices / SEO 각 항목

### Browse 데몬 연동

이 스킬은 **Browse 데몬**을 내부적으로 사용한다. Browse 데몬은 헤드리스 브라우저를 제어해 실제 사용자 환경을 시뮬레이션하며 스크린샷과 성능 지표를 수집한다. CLI 명령어나 WebSocket 메시지로 측정을 자동화할 수 있다.

### PR별 비교(Before/After)

기준선이 있으면, PR 브랜치를 배포할 때마다 같은 측정을 다시 실행해 **수치 변화를 표(diff table)로 출력**한다. 예를 들어 LCP가 1.8 s → 2.4 s로 늘었다면 해당 PR에서 회귀가 발생한 것으로 표시된다.

### 추세(Trend) 추적

단일 비교에서 나아가 측정 이력을 시계열로 저장하면, 어느 커밋부터 성능이 꺾였는지 그래프로 파악할 수 있다. CI 파이프라인에 통합하면 main 브랜치의 성능 추세를 지속적으로 모니터링할 수 있다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript로 만든 "동아리 공지 게시판"의 공지 목록 페이지(`/notices`)가 배포 후 체감상 느려졌다는 동아리원 피드백이 들어왔다. 어떤 PR이 원인인지 파악해야 한다.

### 1단계 — 기준선 측정

```bash
# Claude Code 세션에서
> benchmark 스킬로 /notices 페이지의 현재 성능 기준선을 측정해 줘
```

Claude는 Browse 데몬을 기동하고 다음과 같은 측정 결과를 반환한다.

```
[Benchmark] 기준선 수립: /notices
┌─────────────────────┬──────────┐
│ 지표                │ 현재값   │
├─────────────────────┼──────────┤
│ TTFB                │ 312 ms   │
│ FCP                 │ 890 ms   │
│ LCP                 │ 1 820 ms │
│ CLS                 │ 0.04     │
│ JS 번들 (gzipped)   │ 142 KB   │
│ Lighthouse Perf     │ 78       │
└─────────────────────┴──────────┘
baseline 저장 완료 → .benchmark/baseline-notices.json
```

### 2단계 — 의심 PR 체크아웃 후 비교

```bash
git checkout feature/add-realtime-notifications
pnpm build && pnpm start &
# Claude Code 세션에서
> 방금 빌드한 브랜치와 baseline을 비교해 줘
```

```
[Benchmark] 비교 결과: /notices (baseline vs feature/add-realtime-notifications)
┌─────────────────────┬──────────┬──────────┬──────────────────┐
│ 지표                │ baseline │ PR       │ 변화             │
├─────────────────────┼──────────┼──────────┼──────────────────┤
│ LCP                 │ 1 820 ms │ 2 490 ms │ +37% ⚠ 회귀     │
│ JS 번들 (gzipped)   │ 142 KB   │ 218 KB   │ +53% ⚠ 심각     │
│ Lighthouse Perf     │ 78       │ 61       │ -17 pts ⚠ 회귀  │
└─────────────────────┴──────────┴──────────┴──────────────────┘
원인 의심: socket.io-client (76 KB) 번들 포함 확인 필요
```

### 3단계 — 코드 수정 및 개선

```ts
// app/notices/page.tsx — 서버 컴포넌트에서 불필요한 클라이언트 import 제거
// Before: 소켓 클라이언트를 서버 컴포넌트에서 임포트
// After: dynamic import + ssr: false 로 분리

import dynamic from 'next/dynamic'

// 소켓 연결은 클라이언트에서만 필요 → 코드 스플리팅
const RealtimeNotifier = dynamic(
  () => import('@/components/RealtimeNotifier'),
  { ssr: false }
)

export default async function NoticesPage() {
  const notices = await fetchNotices() // 서버에서 초기 데이터 fetch
  return (
    <>
      <NoticeList notices={notices} />
      <RealtimeNotifier />  {/* 클라이언트 전용, 번들 분리 */}
    </>
  )
}
```

## 학습 포인트

- **"체감"을 수치로 바꿔야 논의가 가능하다**: 동아리원이 "느리다"고 할 때 LCP가 몇 ms인지 모르면 개선 여부도 확인할 수 없다. Benchmark는 주관적 피드백을 객관적 데이터로 전환하는 첫 단계다.
- **흔한 실수 — 개발 환경에서만 측정**: `pnpm dev`의 HMR 모드는 프로덕션 번들 최적화가 적용되지 않아 측정값이 왜곡된다. 반드시 `pnpm build && pnpm start`(또는 스테이징 URL)에서 측정한다.
- **Next.js 15 팁 — `next/bundle-analyzer`**: 번들 크기 회귀가 감지되면 즉시 `ANALYZE=true pnpm build`로 번들 분석을 실행해 어떤 패키지가 커졌는지 시각적으로 확인한다.
- **CI 통합 팁**: GitHub Actions에서 PR마다 Benchmark를 돌리고, LCP +20% 초과 시 PR 체크를 실패로 표시하면 성능 회귀를 사람이 놓치지 않는다.
- **Core Web Vitals 기준**: Google 기준으로 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 이 "Good" 등급이다. 이 수치를 threshold로 활용하면 합격/불합격 판정이 명확해진다.

## 원본과의 차이

- 원본은 gstack 환경의 Browse 데몬 연동을 전제로 한다. 본 해설은 그 개념을 유지하되, Next.js 15 로컬 환경에서 재현 가능한 방식으로 예제를 재구성했다.
- 원본에서 언급되는 "Pretext 패턴"이나 gstack 전용 CLI는 본 해설에서 제외하고, 범용적인 Lighthouse / bundle-analyzer 워크플로우로 대체했다.
- 대학생 프로젝트에서 자주 발생하는 "소켓 클라이언트를 SSR에서 불필요하게 번들링"하는 패턴을 실전 예제로 추가했다.

> 원본: `~/.claude/skills/benchmark/SKILL.md`
