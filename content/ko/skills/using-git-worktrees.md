---
title: "Git Worktree 활용 (Using Git Worktrees)"
source: "~/.claude/skills/using-git-worktrees/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["git", "worktree", "브랜치격리", "병렬개발", "에이전트"]
category: "에이전트"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# Git Worktree 활용 (Using Git Worktrees)

## 핵심 개념

### Git Worktree란?

Git Worktree는 하나의 Git 저장소에서 **여러 브랜치를 동시에 체크아웃**할 수 있는 기능이다. 일반적으로 브랜치를 바꾸려면 `git checkout`으로 전환해야 하지만, Worktree를 사용하면 서로 다른 브랜치를 서로 다른 디렉토리에서 동시에 열어 둘 수 있다.

```
프로젝트 루트/
├── .git/                   ← 공유 Git 저장소
├── (main 브랜치 작업 중)
│
└── .worktrees/             ← 워크트리 디렉토리
    ├── feature-notices/    ← feature/notices 브랜치 체크아웃
    └── feature-auth/       ← feature/auth 브랜치 체크아웃
```

### 스킬이 자동으로 처리하는 것들

Using Git Worktrees 스킬은 단순히 `git worktree add` 명령을 실행하는 것이 아니다. 다음 세 가지를 자동으로 처리한다.

1. **스마트 디렉토리 선택**: 프로젝트 루트를 기준으로 `.worktrees/` 또는 `../worktrees/` 같은 적절한 위치에 워크트리를 생성한다. 워크트리가 프로젝트 내부에 포함되어 빌드 도구나 번들러에 의해 스캔되는 상황을 방지한다.

2. **안전성 검증(Safety Verification)**: 워크트리를 만들기 전에 현재 작업 공간의 상태를 확인한다. 커밋되지 않은 중요한 변경이 있으면 경고하거나, 워크트리 생성 전에 스태시(stash)할 것을 제안한다.

3. **브랜치 초기화**: 지정한 이름으로 새 브랜치를 생성하고, 워크트리와 연결하며, 초기 환경 설정(예: `pnpm install`)을 실행할 수 있다.

### Worktree vs 브랜치 전환 vs 클론

| 방법 | 동시 작업 | 속도 | 디스크 사용 |
|------|---------|------|------------|
| `git checkout` | 불가 | 빠름 | 1x |
| Git Worktree | 가능 | 빠름 | 1.x (공유 objects) |
| `git clone` | 가능 | 느림 | 2x |

Worktree는 `.git/objects`를 공유하므로 전체 클론보다 훨씬 적은 디스크를 사용하면서도 완전히 독립된 작업 공간을 제공한다.

## 한 줄 요약

현재 작업 공간을 보전하면서 **격리된 Git 워크트리**를 생성해 새 기능 개발을 안전하게 시작하는 스킬로, 스마트한 디렉토리 선택과 안전성 검증이 자동으로 수행된다.

## 프로젝트에 도입하기

```bash
/using-git-worktrees
```

**SKILL.md 파일 위치**: `~/.claude/skills/using-git-worktrees/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트에서 `main` 브랜치는 현재 안정적으로 배포된 상태다. 새로운 "공지 좋아요 기능(feature/notice-likes)"을 시작하려는데, 기존 작업을 건드리지 않고 격리된 환경에서 개발하고 싶다.

### 기본 워크트리 생성

```
> using-git-worktrees 스킬을 사용해서 feature/notice-likes 브랜치로
  새 워크트리를 만들어 줘.
```

스킬이 수행하는 단계:

```bash
# 1. 현재 상태 안전성 검증
git status
# → 커밋되지 않은 변경 없음. 안전.

# 2. 워크트리 생성
git worktree add .worktrees/notice-likes -b feature/notice-likes

# 3. 의존성 설치 (pnpm workspace 인식)
cd .worktrees/notice-likes && pnpm install

# 4. 상태 확인
git worktree list
```

출력 결과:

```
C:/Users/kik32/workspace/claude-code-study              [main]
C:/Users/kik32/workspace/claude-code-study/.worktrees/notice-likes  [feature/notice-likes]
```

### 워크트리 내부 개발

워크트리는 완전히 독립된 작업 공간이므로 모든 파일 작업이 격리된다.

```bash
# 워크트리에서 개발
cd .worktrees/notice-likes

# 새 파일 생성
touch app/api/notices/[id]/likes/route.ts

# 커밋
git add .
git commit -m "feat: 공지 좋아요 API 라우트 추가"
```

이 커밋은 `feature/notice-likes` 브랜치에만 반영되고, `main` 브랜치에는 영향을 주지 않는다.

### 병렬 에이전트와 함께 사용

```
> using-git-worktrees 스킬로 다음 세 가지 기능을 위한 워크트리를 각각 만들어 줘:
  1. feature/notice-likes — 공지 좋아요
  2. feature/notice-comments — 댓글 기능
  3. feature/notice-search — 검색 기능

  그 다음 dispatching-parallel-agents로 세 에이전트를 각 워크트리에 배치해 줘.
```

스킬 실행 결과:

```
.worktrees/
├── notice-likes/      ← Agent 1 작업 공간 (feature/notice-likes)
├── notice-comments/   ← Agent 2 작업 공간 (feature/notice-comments)
└── notice-search/     ← Agent 3 작업 공간 (feature/notice-search)
```

각 에이전트가 자신의 워크트리에서 독립적으로 작업하므로 파일 충돌이 발생하지 않는다.

### 워크트리 정리

기능 개발이 완료되면 워크트리를 정리한다.

```bash
# main으로 돌아와 PR 머지 후 워크트리 제거
git worktree remove .worktrees/notice-likes

# 병합이 완료된 브랜치 삭제
git branch -d feature/notice-likes
```

### Next.js 15 프로젝트에서의 주의사항

```ts
// .gitignore에 워크트리 디렉토리가 없다면 추가 권장
// .gitignore
.worktrees/
```

```json
// next.config.ts — 워크트리 디렉토리가 빌드 대상에 포함되지 않도록
{
  "experimental": {
    "outputFileTracingIgnores": [".worktrees/**"]
  }
}
```

## 학습 포인트 / 흔한 함정

- **`main`은 항상 배포 가능한 상태여야 한다**: 대학 프로젝트에서 "일단 main에서 작업하고 나중에 정리하자"는 생각은 팀 협업에서 반드시 문제를 일으킨다. Worktree 패턴을 습관화하면 `main`의 안정성을 자연스럽게 유지할 수 있다.
- **디스크 공간 효율**: 클론 대신 워크트리를 사용하면 `.git/objects`를 공유하므로 디스크 사용량이 거의 증가하지 않는다. 여러 기능을 동시에 개발하는 해커톤 상황에서도 부담 없이 사용할 수 있다.
- **흔한 함정 — `node_modules` 중복**: 각 워크트리는 독립된 작업 디렉토리를 가지므로 `node_modules`가 중복될 수 있다. pnpm workspace를 사용하면 패키지를 공유 캐시에서 하드 링크로 연결하므로 실제 디스크 사용량은 훨씬 적다.
- **워크트리는 `.git` 내부에 등록된다**: `git worktree list`로 현재 활성 워크트리를 확인할 수 있다. 워크트리 디렉토리를 단순히 삭제하면 Git은 여전히 그 워크트리를 "locked" 상태로 기억한다. 반드시 `git worktree remove` 또는 `git worktree prune`으로 정리해야 한다.
- **Next.js 15 관점**: App Router의 `dev` 서버를 워크트리마다 별도로 실행하면 각 기능을 독립적으로 확인할 수 있다. 포트가 겹치지 않도록 `package.json`의 dev 스크립트에 `--port 3001` 같은 옵션을 각 워크트리별로 지정하자.

## 관련 리소스

- [dispatching-parallel-agents](./dispatching-parallel-agents.md) — 워크트리에 병렬 에이전트 배치
- [subagent-driven-development](./subagent-driven-development.md) — 세션 내 서브에이전트 실행
- [using-superpowers](./using-superpowers.md) — 워크트리 도입 전 스킬 선택 가이드

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
