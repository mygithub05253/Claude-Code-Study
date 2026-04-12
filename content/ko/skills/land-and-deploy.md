---
title: "배포 자동화 (Land and Deploy)"
source: "~/.claude/skills/land-and-deploy/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 배포 자동화 (Land and Deploy)

## 한 줄 요약

`/ship`이 생성한 PR을 받아 **머지 → CI 대기 → 배포 → 프로덕션 헬스 체크**까지 자동으로 완료하는 배포 파이프라인 완결 스킬이다. 코드를 직접 건드리지 않고 "이 PR을 프로덕션에 올려" 라는 명령 한 줄로 배포를 마무리한다.

## 언제 사용하나요?

- "머지해 줘", "배포해 줘", "main에 올려 줘", "ship it to production" 같이 PR을 실제로 배포까지 연결하고 싶을 때
- `ship` 스킬로 PR을 이미 만들었고 이제 프로덕션에 반영할 준비가 된 때
- CI/CD가 완료될 때까지 대기하다가 프로덕션 헬스를 자동으로 검증하고 싶을 때
- "머지하고 확인해 줘", "land it", "merge and verify" 같은 표현으로 요청할 때

## 핵심 개념

### ship vs land-and-deploy: 배포 파이프라인의 두 단계

gstack 생태계에서 배포 워크플로우는 두 스킬로 나뉜다.

```
[개발 완료]
    ↓
  /ship
    ├── 테스트 실행
    ├── diff 리뷰
    ├── CHANGELOG 갱신
    ├── 커밋 + 푸시
    └── PR 생성 ← 여기까지가 ship
         ↓
  /land-and-deploy
    ├── PR 머지
    ├── CI 완료 대기
    ├── 배포 완료 대기
    └── 프로덕션 헬스 체크 ← 여기까지가 land-and-deploy
         ↓
  [프로덕션 배포 완료]
```

이 분리 구조는 의도적이다. PR 생성(ship)과 머지·배포(land-and-deploy)를 분리하면:
- PR 리뷰어가 머지 전에 코드를 검토할 시간을 가질 수 있다.
- 배포 타이밍을 명시적으로 결정할 수 있다 (주말 배포 방지 등).
- CI가 빨간불일 때 실수로 머지하는 것을 방지할 수 있다.

### 실행 단계 상세

**1. PR 머지**
- 지정된 PR(또는 현재 브랜치의 PR)을 GitHub에서 머지한다.
- squash merge / rebase merge / merge commit 중 프로젝트 설정을 따른다.

**2. CI 완료 대기**
- GitHub Actions 워크플로우가 모두 초록불이 될 때까지 polling한다.
- 빨간불이 뜨면 즉시 중단하고 실패한 스텝을 리포트한다.

**3. 배포 완료 대기**
- Vercel, Railway, Fly.io 등 연결된 배포 플랫폼의 배포 완료를 대기한다.
- 타임아웃이 설정되어 있으며, 초과 시 경고를 출력한다.

**4. Canary 헬스 체크**
- `canary` 스킬(GStack 기반)을 통해 프로덕션 URL에 접속해 핵심 페이지가 200을 반환하는지, 주요 UI 요소가 올바르게 렌더링되는지 확인한다.
- 헬스 체크 실패 시 롤백 권고 메시지를 출력한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판에 "공지 즐겨찾기" 기능을 개발했다. `ship` 스킬로 이미 PR #17이 생성되어 있고, 팀장이 리뷰를 마쳤다. 이제 main에 머지하고 Vercel 배포까지 완료해야 한다.

### 1단계: land-and-deploy 실행

```
> land-and-deploy 스킬로 PR #17 머지하고 배포까지 완료해 줘.
```

스킬이 수행하는 전체 흐름:

```bash
# 1. PR 상태 확인
gh pr view 17 --json state,reviewDecision,statusCheckRollup

# 결과: state=OPEN, reviewDecision=APPROVED, checks=PASSING
# 모든 조건 통과 → 머지 진행

# 2. PR 머지
gh pr merge 17 --squash --delete-branch
# → "PR #17 머지 완료 (squash merge)"

# 3. main 브랜치의 CI 완료 대기
gh run list --branch main --limit 1
# → workflow: "CI 검증" 실행 중...
# (폴링)
# → workflow: "CI 검증" 완료 ✓

# 4. Vercel 배포 완료 대기
# → 배포 ID abc123 진행 중...
# (폴링)
# → 배포 완료: https://club-board.vercel.app ✓

# 5. Canary 헬스 체크 (GStack 기반)
# → GET https://club-board.vercel.app → 200 ✓
# → GET https://club-board.vercel.app/notices → 200 ✓
# → 공지 목록 렌더링 확인 ✓
# → 즐겨찾기 버튼 UI 존재 확인 ✓

# 최종 결과
# PR #17 "feat: 공지 즐겨찾기 기능" 프로덕션 배포 완료
# URL: https://club-board.vercel.app
# 배포 시각: 2026-04-12 14:35 KST
```

### 2단계: CI 실패 시 흐름

CI가 빨간불이면 스킬이 즉시 중단하고 원인을 리포트한다.

```bash
# CI 실패 시 출력 예시
# ✗ workflow "CI 검증" 실패
# 실패한 스텝: "TypeScript 타입 검사"
# 오류 메시지:
#   src/components/notice/FavoriteButton.tsx:23:5
#   Type 'string | null' is not assignable to type 'string'.
#
# 머지를 중단했습니다. 타입 오류를 수정한 뒤 다시 시도해 주세요.
```

### 3단계: 헬스 체크 실패 시 흐름

배포는 성공했지만 헬스 체크에서 문제가 발견되면:

```bash
# 헬스 체크 실패 시 출력 예시
# ✗ Canary 헬스 체크 실패
# GET https://club-board.vercel.app/notices → 500 Internal Server Error
# 스크린샷: [첨부]
#
# 가능한 원인:
# - 데이터베이스 마이그레이션 미실행 (favorites 테이블 없음)
# - 환경 변수 누락
#
# 권고: 이전 배포로 롤백을 고려하세요.
# Vercel 롤백 명령: vercel rollback [previous-deployment-id]
```

### 4단계: Next.js 15 프로젝트에서 데이터베이스 마이그레이션 연동

`land-and-deploy` 실행 전 Supabase 마이그레이션을 미리 적용하는 것이 중요하다.

```bash
# 배포 전 마이그레이션 체크리스트
# 1. Supabase 마이그레이션 적용
npx supabase db push --linked

# 2. 적용 확인
npx supabase db diff --linked
# → "No schema changes" 이면 배포 준비 완료

# 3. 그 후 land-and-deploy 실행
```

CI에 마이그레이션 자동화를 포함하려면:

```yaml
# .github/workflows/deploy.yml
name: 배포 파이프라인

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Supabase 마이그레이션 적용
        run: npx supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Vercel 배포
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

## 학습 포인트

- **"머지 = 배포"가 아닌 "머지 → CI → 배포 → 검증"의 4단계**: 많은 대학생이 GitHub에서 Merge 버튼을 누르고 배포가 자동으로 됐겠거니 넘어간다. `land-and-deploy`는 이 4단계를 명시적으로 완료해야 "배포 완료"임을 가르쳐 준다.
- **Canary 체크는 보험이다**: 배포 후 30초만 헬스 체크해도 "데이터베이스 마이그레이션을 안 했다"처럼 명백한 에러를 바로 잡을 수 있다. 팀원에게 버그 제보를 받기 전에 먼저 발견하는 것이 훨씬 낫다.
- **`ship` 없이도 사용 가능**: `land-and-deploy`는 `ship`이 만든 PR만 처리하는 게 아니다. 수동으로 만든 PR 번호를 직접 지정해도 동작한다.
- **흔한 함정 — 리뷰 없이 머지**: `land-and-deploy`는 PR이 승인됐는지 확인하고 머지한다. 팀 프로젝트에서 리뷰어 없이 본인이 만들고 본인이 머지하는 경우, 이 검사를 건너뛰는 설정이 필요하다. 하지만 실제 서비스에서는 반드시 리뷰 프로세스를 갖추는 것을 권장한다.
- **Next.js 15 팁 — 데이터베이스 마이그레이션 순서**: Supabase를 쓰는 Next.js 프로젝트에서는 배포 전에 반드시 마이그레이션을 먼저 적용해야 한다. 코드가 새 테이블을 참조하는데 테이블이 없으면 Canary 헬스 체크에서 500 에러가 난다. "migrate first, deploy second" 원칙을 지키자.

## 원본과의 차이

- 원본은 gstack 생태계의 일부로, `ship` 스킬 이후의 배포 완결 단계를 담당함을 명시한다. 본 해설에서는 `ship → land-and-deploy` 전체 흐름을 도식으로 시각화해 두 스킬의 관계를 명확히 했다.
- 원본의 "canary checks" 개념을 Vercel + Supabase 배포 환경에서 실제로 발생하는 시나리오(마이그레이션 누락으로 인한 500 에러)로 구체화했다.
- CI 실패 및 헬스 체크 실패 시의 출력 예시와 롤백 권고는 원본의 "verify production health" 개념을 한국 대학생이 경험할 실제 상황으로 재해석한 것이다.
- GitHub Actions 마이그레이션 연동 예시는 원본에 없는 내용으로, Next.js 15 + Supabase 조합에서 land-and-deploy를 안정적으로 사용하기 위한 실용적 추가 내용이다.

> 원본: `~/.claude/skills/land-and-deploy/SKILL.md`
