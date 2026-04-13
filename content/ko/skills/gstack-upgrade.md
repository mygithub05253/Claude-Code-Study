---
title: "GStack 업그레이드 (GStack Upgrade)"
source: "~/.claude/skills/gstack-upgrade/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack 생태계)"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["gstack-upgrade", "GStack", "업그레이드", "브라우저 자동화", "gstack"]
category: "브라우저/QA"
---

# GStack 업그레이드 (GStack Upgrade)

## 핵심 개념

### 스킬의 동작

이 스킬 자체는 매우 단순하다. 두 가지 설치 형태를 자동 감지하고 그에 맞는 업그레이드 방식을 선택한다.

| 설치 형태 | 감지 기준 | 업그레이드 방법 |
|-----------|-----------|----------------|
| 전역 설치 (Global) | `npm list -g gstack` 또는 `which gstack`으로 전역 경로 감지 | `npm install -g gstack@latest` |
| 벤더 설치 (Vendored) | 프로젝트의 `package.json` 또는 `node_modules/.bin/gstack` 존재 | `npm install gstack@latest` (또는 `pnpm`, `yarn`) |

업그레이드 완료 후에는 변경사항(새 버전, 주요 기능, 버그 수정)을 요약해 출력한다.

### 언제 사용하나요?

- "gstack 업그레이드 해 줘", "gstack 최신 버전으로 올려 줘" 같이 명시적으로 요청할 때
- 새로운 QA·브라우저·배포 스킬을 사용하려는데 gstack 버전이 너무 낮다는 에러가 날 때
- 정기적으로 gstack 생태계 스킬들을 최신 상태로 유지하고 싶을 때

### GStack 생태계 이해하기

GStack 업그레이드 스킬을 이해하려면 GStack이 어떤 생태계인지 알아야 한다.

**GStack은 Claude Code 스킬들의 기반 브라우저 자동화 엔진이다.** 다음 스킬들이 GStack에 의존한다.

- `browse` — 단일 시나리오 빠른 검증
- `qa` / `qa-only` — 전체 사이트 품질 스코어링
- `canary` — 배포 후 헬스 체크
- `land-and-deploy` — 프로덕션 배포 후 검증
- `gstack` — 범용 브라우저 자동화 직접 사용

GStack을 업그레이드하면 이 모든 스킬의 기반 엔진이 함께 업데이트된다. 따라서 하나의 스킬만 업그레이드하는 것이 아니라 GStack 생태계 전체를 최신 상태로 유지하는 효과가 있다.

**버전 관리 원칙**:
- GStack 마이너 업데이트는 일반적으로 하위 호환성을 유지한다.
- 메이저 업데이트는 스킬 동작이나 API가 변경될 수 있으므로 팀 공유 환경에서는 주의가 필요하다.
- 프로젝트 단위로 버전을 고정하고 싶다면 벤더 설치 형태로 `package.json`에 명시하는 것이 좋다.

## 한 줄 요약

GStack을 최신 버전으로 업그레이드하는 단순 유틸리티 스킬로, 전역 설치와 벤더(vendored) 설치를 자동으로 감지해 알맞은 업그레이드 명령을 실행하고 변경사항을 요약해 보여준다.

## 프로젝트에 도입하기

```bash
/gstack-upgrade
```

**SKILL.md 파일 위치**: `~/.claude/skills/gstack-upgrade/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 프로젝트에서 `canary` 스킬을 처음 사용하려는데, "gstack 버전이 낮다"는 경고가 떴다. GStack을 업그레이드하고 변경사항을 확인한 뒤 프로젝트의 CI 파이프라인에도 반영하고 싶다.

### 1단계: GStack 업그레이드 실행

```
> gstack 업그레이드 해 줘.
```

스킬이 실행하는 내용:

```bash
# 전역 설치 감지 시
npm list -g gstack
# → gstack@2.1.0 이 감지됨

# 업그레이드 실행
npm install -g gstack@latest

# 변경사항 출력
# gstack 2.1.0 → 2.4.0
# 변경사항:
#   - canary 스킬 지원 추가
#   - 파일 업로드 다이얼로그 처리 안정화
#   - Windows 경로 처리 버그 수정
#   - 스크린샷 어노테이션 품질 개선
```

### 2단계: 프로젝트 벤더 설치 업데이트 (선택)

팀 프로젝트에서 모든 팀원이 같은 버전을 쓰고 싶다면 프로젝트에 고정한다.

```bash
# pnpm 프로젝트
pnpm add -D gstack@latest

# package.json 확인
# "devDependencies": {
#   "gstack": "^2.4.0"
# }
```

### 3단계: GitHub Actions CI에 gstack 버전 반영

```yaml
# .github/workflows/qa.yml
name: QA 검증

on:
  push:
    branches: [main]
  pull_request:

jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: 의존성 설치
        run: pnpm install

      # gstack이 devDependencies에 있으면 자동 설치됨
      # 전역 설치가 필요하다면:
      # - name: gstack 전역 설치
      #   run: npm install -g gstack@latest

      - name: 배포 후 canary 검증
        run: |
          # canary 스킬은 gstack 기반
          claude run canary --url ${{ secrets.VERCEL_URL }}
```

## 학습 포인트 / 흔한 함정

- **GStack 업그레이드 = 생태계 전체 업그레이드**: 이 스킬 하나로 browse, qa, canary, land-and-deploy 등 GStack 기반 스킬 모두의 기반 엔진이 업데이트된다. 새로운 스킬을 사용하기 전에 GStack부터 최신 버전인지 확인하는 습관을 갖자.
- **팀 프로젝트에서는 버전 고정**: 전역 설치로 사용하면 팀원마다 다른 버전이 설치될 수 있다. `package.json`의 `devDependencies`에 gstack 버전을 명시해 두면 `pnpm install` 한 번으로 팀 전체가 같은 버전을 쓸 수 있다.
- **변경사항 요약 읽기**: 업그레이드 후 출력되는 변경사항 요약에서 "deprecated" 또는 "breaking change" 항목이 있는지 확인하자. 특히 메이저 버전 업데이트 시 기존에 쓰던 스킬 옵션이 바뀔 수 있다.
- **Windows 환경 주의**: 이 프로젝트처럼 Windows에서 개발하는 경우, GStack 업그레이드 후 경로 처리나 스크린샷 저장 경로가 올바르게 동작하는지 간단히 확인해 보자. GStack 패치 버전에서 Windows 관련 버그 수정이 자주 포함된다.

## 관련 리소스

- [gstack](./gstack.md) — GStack 헤드리스 브라우저 범용 QA 자동화 엔진
- [browse](./browse.md) — GStack 기반 단일 시나리오 빠른 검증
- [canary](./canary.md) — GStack 기반 배포 후 헬스 체크

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic (gstack 생태계) |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
