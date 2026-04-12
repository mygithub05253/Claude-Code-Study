---
title: "배포 후 카나리 모니터링 (Canary)"
source: "~/.claude/skills/canary/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 배포 후 카나리 모니터링 (Canary)

## 한 줄 요약

배포 직후 Browse 데몬으로 실제 운영 환경을 주기적으로 감시하며, 콘솔 에러·성능 회귀·페이지 실패를 **배포 전 기준선과 자동 비교해 이상 징후를 즉시 감지**하는 스킬이다.

## 언제 사용하나요?

- "배포는 성공했는데 실제로 잘 돌고 있는지 확인"하고 싶을 때
- 새 기능을 일부 사용자에게만 점진적으로 배포(카나리 배포)한 뒤 이상을 조기에 잡을 때
- 자동화된 포스트-배포 스모크 테스트가 필요할 때
- 프로덕션 콘솔 에러가 언제 발생했는지 타임라인을 알고 싶을 때
- "monitor deploy", "canary", "post-deploy check", "watch production", "verify deploy" 키워드가 등장하는 작업을 받았을 때

## 핵심 개념

### 카나리 모니터링이란?

"카나리"는 광부들이 탄광에 가지고 들어간 카나리아 새에서 유래한 개념이다. 일산화탄소에 민감한 카나리아가 먼저 쓰러지면 광부들이 탄광을 빠져나왔다. 소프트웨어에서는 **새 배포가 이상이 없는지를 가장 먼저 감지하는 자동화된 감시 체계**를 의미한다.

### Browse 데몬을 활용한 감시

Canary 스킬은 Browse 데몬을 주기적으로 실행하며 다음 항목을 검사한다.

1. **콘솔 에러 감지**: `console.error`, `unhandledrejection`, 네트워크 4xx/5xx 응답
2. **성능 회귀 감지**: LCP, TTFB, Lighthouse 점수가 기준선 대비 임계값(예: ±20%)을 초과하는지
3. **페이지 실패 감지**: 빈 페이지, 404, 서버 에러 500 화면 렌더링 여부
4. **스크린샷 비교**: 배포 전 스크린샷과 현재 스크린샷을 픽셀 단위로 비교해 시각적 회귀(레이아웃 깨짐 등) 감지

### 기준선(Baseline)과 비교

Canary는 **배포 직전** 상태를 기준선으로 캡처해 둔다. 배포 후 감시 결과를 기준선과 비교해 이상 징후를 판단한다. 이 방식 덕분에 "원래부터 있던 문제"와 "이번 배포가 만든 문제"를 구분할 수 있다.

### 알림과 에스컬레이션

이상 감지 시 Claude는 다음을 수행한다.

- 어떤 페이지에서 어떤 에러가 발생했는지 상세 리포트 출력
- 의심 커밋이나 PR 링크 제안
- 롤백 명령어 제안 (예: `git revert HEAD`, `vercel rollback`)

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판에 "이미지 업로드" 기능을 추가하고 Vercel로 배포했다. 배포 후 몇 시간 동안 실제 페이지가 잘 작동하는지 자동으로 감시하고 싶다.

### 1단계 — 배포 전 기준선 캡처

```bash
# 배포 전 main 브랜치 상태에서
> canary 스킬로 /notices 페이지 기준선을 캡처해 줘
# URL: https://club-notice.vercel.app/notices
```

```
[Canary] 기준선 캡처 완료
- 페이지: /notices, /notices/1, /notices/new
- LCP 기준: 1.82 s
- 콘솔 에러: 0건
- 스크린샷 저장: .canary/baseline/
```

### 2단계 — 배포 후 감시 시작

```bash
# Vercel 배포 완료 후
> canary 스킬로 https://club-notice.vercel.app 을 30분 간격으로 감시해 줘
```

Claude는 Browse 데몬을 주기적으로 실행하며 결과를 스트리밍한다.

```
[Canary] 10:00 — 정상. 콘솔 에러 0, LCP 1.91 s (+5%), 스크린샷 일치
[Canary] 10:30 — ⚠ 이상 감지!
  - /notices/new: console.error "Failed to fetch presigned URL" (3회)
  - 원인 의심: NEXT_PUBLIC_S3_BUCKET 환경 변수가 프로덕션에 미설정
  - 영향 범위: 이미지 업로드 기능 전체 불가
  - 권장 조치: Vercel 대시보드 > Environment Variables 확인
```

### 3단계 — 원인 수정 및 재배포

```ts
// app/notices/new/actions.ts
// 이미지 업로드 전 환경 변수 검사 추가
'use server'

export async function getPresignedUrl(filename: string) {
  const bucket = process.env.S3_BUCKET_NAME
  if (!bucket) {
    // 환경 변수 누락 시 명확한 에러 메시지
    throw new Error('S3_BUCKET_NAME 환경 변수가 설정되지 않았습니다.')
  }
  // ... presigned URL 생성 로직
}
```

```bash
# 수정 배포 후 Canary 재감시
[Canary] 11:00 — 정상 복구 확인. 콘솔 에러 0, LCP 1.88 s
[Canary] 결과: 이상 없음. 모니터링 계속 중...
```

### 환경 변수 체크리스트 자동화 예시

```ts
// lib/env.ts — 서버 시작 시 필수 환경 변수 일괄 검증
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'S3_BUCKET_NAME',
  'NEXTAUTH_SECRET',
] as const

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key]
  )
  if (missing.length > 0) {
    throw new Error(
      `필수 환경 변수 누락: ${missing.join(', ')}`
    )
  }
}
```

## 학습 포인트

- **"배포 = 완료"가 아니다**: 빌드 성공, 배포 성공과 "사용자가 실제로 기능을 쓸 수 있음"은 다르다. Canary는 이 갭을 자동으로 메워 준다.
- **흔한 실수 — 환경 변수 누락**: 로컬에서는 `.env.local`로 잘 동작하던 기능이 프로덕션에서는 환경 변수 미설정으로 즉시 실패하는 경우가 매우 흔하다. Canary의 콘솔 에러 감지가 이를 배포 30분 이내에 잡아 준다.
- **Next.js 15 팁 — Server Actions 에러 추적**: Server Action 내부에서 throw된 에러는 클라이언트 콘솔에 `Error: An error occurred in the Server Components render` 형태로만 노출된다. Canary는 이 패턴을 감지해 "Server Action 실패 의심"으로 분류한다.
- **감시 주기 설정**: 트래픽이 낮은 서비스라면 5~30분 간격이 적당하다. 배포 후 첫 1시간은 짧게(5분), 이후에는 30분으로 완화하는 전략이 효율적이다.
- **롤백 기준 명확화**: "LCP +50% 이상" 또는 "에러율 1% 초과"처럼 수치 기준을 미리 정해 두면 감정적 판단 없이 빠르게 롤백을 결정할 수 있다.

## 원본과의 차이

- 원본은 gstack 내부 Browse 데몬과 Pretext 패턴에 의존한다. 본 해설은 Vercel + Next.js 15 배포 맥락으로 재구성했다.
- 원본에서 다루는 픽셀 단위 스크린샷 비교 기능은 본 해설에서 개념만 설명하고, 실제 구현 세부 사항은 원본을 참조하도록 안내했다.
- 대학생 프로젝트에서 가장 빈번한 "환경 변수 누락" 패턴을 Canary 활용 예제로 추가했다.

> 원본: `~/.claude/skills/canary/SKILL.md`
