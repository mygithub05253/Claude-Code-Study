---
title: "배포 설정 구성 (Setup Deploy)"
source: "~/.claude/skills/setup-deploy/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 배포 설정 구성 (Setup Deploy)

## 한 줄 요약

프로젝트의 배포 플랫폼을 자동으로 감지하고 운영 URL, 헬스체크 엔드포인트, 배포 상태 명령어를 구성하여 `/land-and-deploy` 스킬이 자동으로 배포를 수행할 수 있도록 **CLAUDE.md에 배포 설정을 저장**하는 일회성 설정 스킬이다.

## 언제 사용하나요?

- "배포 설정해 줘", "배포 구성해 줘", "land-and-deploy 어떻게 써요", "gstack으로 배포 설정하기" 같은 요청을 받았을 때
- 프로젝트를 처음 만들고 `/land-and-deploy` 스킬을 사용하기 전에 한 번만 실행
- 배포 플랫폼이 변경되었을 때 (Vercel → Render, 또는 GitHub Actions 추가 등)
- 기존 CLAUDE.md에 배포 설정이 없어서 `/land-and-deploy`가 동작하지 않을 때
- CI/CD 파이프라인을 처음 구성하는 팀 프로젝트에서 배포 설정을 표준화할 때

## 핵심 개념

### 지원하는 배포 플랫폼

Setup Deploy는 다음 플랫폼을 자동으로 감지하고 설정한다.

| 플랫폼 | 감지 방법 | 주요 설정 항목 |
|--------|-----------|---------------|
| Vercel | `vercel.json` 또는 `.vercel/` 디렉토리 | Project ID, Team ID, 배포 훅 URL |
| Netlify | `netlify.toml` 또는 `.netlify/` | Site ID, 배포 훅 URL |
| Fly.io | `fly.toml` | App 이름, 지역, 헬스체크 경로 |
| Render | `render.yaml` | Service ID, 환경 변수 |
| Heroku | `Procfile` 또는 `heroku.yml` | App 이름, 스택 |
| GitHub Actions | `.github/workflows/` | Workflow 파일 이름, 트리거 브랜치 |
| 커스텀 | 수동 입력 | 배포 명령어, 헬스체크 URL |

### CLAUDE.md에 설정을 저장하는 이유

Setup Deploy의 핵심은 설정을 **CLAUDE.md에 영속적으로 저장**하는 것이다. 이렇게 하면 모든 Claude Code 세션이 배포 설정을 자동으로 읽어, `/land-and-deploy` 실행 시 "어디에 어떻게 배포하나요?"를 매번 묻지 않아도 된다.

```markdown
<!-- CLAUDE.md에 자동으로 추가되는 배포 설정 섹션 예시 -->
## Deploy Configuration
- Platform: Vercel
- Production URL: https://club-notice.vercel.app
- Health Check: https://club-notice.vercel.app/api/health
- Deploy Command: vercel --prod
- Status Command: vercel ls --scope=my-team
- Branch: main
- Last configured: 2026-04-12
```

### land-and-deploy와의 관계

Setup Deploy는 **일회성 설정 도구**이고, `/land-and-deploy`는 **반복 실행 배포 도구**다.

```
Setup Deploy (한 번) → CLAUDE.md 설정 저장
                    ↓
/land-and-deploy (매번) → 설정 읽기 → 자동 배포 실행
```

한 번 Setup Deploy를 실행하면 이후 모든 배포는 `/land-and-deploy`만으로 자동화된다.

### 헬스체크 엔드포인트의 역할

Setup Deploy가 설정하는 헬스체크 URL은 `/land-and-deploy`가 배포 완료를 확인하는 데 사용된다. 배포 명령어 실행 후 헬스체크 URL이 200을 반환할 때까지 대기하여 배포 성공/실패를 판단한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"을 Vercel에 배포하고, GitHub Actions로 CI/CD를 함께 구성하려 한다. Setup Deploy로 배포 설정을 CLAUDE.md에 저장하고, 이후 `/land-and-deploy`로 자동 배포를 활성화한다.

### 1단계 — 헬스체크 API 생성

Setup Deploy 실행 전에 먼저 헬스체크 엔드포인트를 만든다.

```typescript
// app/api/health/route.ts — 헬스체크 엔드포인트
import { NextResponse } from 'next/server';

export async function GET() {
  // DB 연결 상태 확인
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    // Prisma 또는 Drizzle 등 DB 클라이언트로 ping
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'ok';

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'unknown',
      db: dbStatus,
    },
    { status: isHealthy ? 200 : 503 },
  );
}
```

### 2단계 — Setup Deploy 실행

```bash
> setup-deploy 스킬로 이 프로젝트의 Vercel + GitHub Actions 배포 설정을 구성해 줘
```

Claude의 자동 감지 및 대화형 설정:

```
[Setup Deploy] 프로젝트 구조 분석 중...

감지된 플랫폼:
  ✓ Vercel (vercel.json 발견)
  ✓ GitHub Actions (.github/workflows/deploy.yml 발견)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
설정 확인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
운영 URL [자동 감지: https://club-notice.vercel.app]: (Enter)
헬스체크 경로 [제안: /api/health]: (Enter)
배포 브랜치 [감지: main]: (Enter)
Vercel 팀 슬러그 [필요]: my-university-club

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Setup Deploy] CLAUDE.md 배포 설정 추가 완료
[Setup Deploy] 이후 /land-and-deploy로 자동 배포 가능
```

### 3단계 — CLAUDE.md에 자동으로 추가된 설정 확인

```markdown
## Deploy Configuration
<!-- setup-deploy로 자동 생성됨 — 2026-04-12 -->

- **Platform**: Vercel + GitHub Actions
- **Production URL**: https://club-notice.vercel.app
- **Health Check URL**: https://club-notice.vercel.app/api/health
- **Deploy Command**: `vercel --prod --scope=my-university-club`
- **CI Deploy**: `.github/workflows/deploy.yml` (push to main)
- **Status Command**: `vercel ls --scope=my-university-club`
- **Deploy Branch**: main
- **Expected Deploy Time**: 2-3분
```

### 4단계 — GitHub Actions 워크플로우 자동 생성

Setup Deploy는 `.github/workflows/deploy.yml`이 없으면 자동으로 생성한다.

```yaml
# .github/workflows/deploy.yml — setup-deploy로 자동 생성
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: pnpm 설정
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: 의존성 설치
        run: pnpm install --frozen-lockfile

      - name: 타입 검사 + 린트
        run: pnpm typecheck && pnpm lint

      - name: 테스트
        run: pnpm test

      - name: Vercel 배포
        run: |
          pnpm dlx vercel pull --yes --environment=production
          pnpm dlx vercel build --prod
          pnpm dlx vercel deploy --prebuilt --prod

      - name: 헬스체크 확인
        run: |
          # 배포 후 최대 3분 대기하며 헬스체크
          for i in {1..18}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://club-notice.vercel.app/api/health)
            if [ "$STATUS" = "200" ]; then
              echo "헬스체크 성공 ✓"
              exit 0
            fi
            echo "헬스체크 대기 중... ($i/18)"
            sleep 10
          done
          echo "헬스체크 실패 — 배포 확인 필요"
          exit 1
```

### 5단계 — /land-and-deploy로 자동 배포

설정 완료 후 이제 모든 배포는 한 명령으로 가능하다.

```bash
> /land-and-deploy 해 줘

# Claude가 자동으로:
# 1. CLAUDE.md에서 배포 설정 읽기
# 2. 현재 브랜치 확인 (main인지 검증)
# 3. vercel --prod 실행
# 4. https://club-notice.vercel.app/api/health 200 대기
# 5. 배포 완료 확인 및 URL 보고
```

## 학습 포인트

- **일회성 설정의 가치**: 배포 설정은 자주 바뀌지 않는다. Setup Deploy를 한 번 실행하면 이후 모든 배포가 `/land-and-deploy` 한 줄로 끝난다. 이 초기 투자로 긴 시간을 절약한다.
- **흔한 실수 — 헬스체크 없이 배포 완료 판단**: 배포 명령어가 성공해도 앱이 실제로 정상 동작하는지는 헬스체크로만 확인할 수 있다. `vercel --prod`가 성공해도 런타임 에러로 앱이 다운된 경우가 있다. 헬스체크 엔드포인트는 필수다.
- **흔한 실수 — secrets 없이 GitHub Actions 실행**: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`은 GitHub 레포지토리의 Settings → Secrets에 반드시 등록해야 한다. 이 값들이 없으면 Actions가 실패한다.
- **Next.js 15 팁 — vercel.json 설정**: `vercel.json`의 `rewrites`, `headers` 설정은 배포 전에 반드시 확인해야 한다. 특히 Next.js 15 App Router의 캐싱 헤더(`Cache-Control`)가 Vercel의 기본값과 충돌하는 경우가 있다.
- **모노레포 배포 주의사항**: 이 프로젝트처럼 pnpm workspace 모노레포에서 `apps/docs/`를 Vercel에 배포할 때는 Vercel 대시보드에서 "Root Directory"를 `apps/docs`로 설정하거나 `vercel.json`에 `rootDirectory`를 지정해야 한다.

## 원본과의 차이

- 원본은 gstack의 `/land-and-deploy` 스킬과 긴밀하게 연동되는 내부 설정 저장 메커니즘을 사용한다. 본 해설은 Vercel + GitHub Actions 맥락을 중심으로 실제 설정 파일과 워크플로우 YAML을 포함했다.
- 헬스체크 API 구현 코드와 GitHub Actions 헬스체크 루프를 추가하여, 배포 완료 확인이 왜 필요한지를 실제 코드로 설명했다.
- 모노레포 환경에서의 Vercel 배포 시 주의사항을 추가하여 이 프로젝트의 실제 구조에 맞는 적용 가이드를 제공했다.

> 원본: `~/.claude/skills/setup-deploy/SKILL.md`
