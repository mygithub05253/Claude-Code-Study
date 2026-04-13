---
title: "Ship — 배포 워크플로우 (Ship)"
source: "~/.claude/skills/ship/SKILL.md"
sourceHash: "sha256:198e2e06814d668a0ec0f2feba318d4b88cfddc33375e070ada90f0e1d9e4e98"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic (gstack 생태계)"
---

# Ship — 배포 워크플로우 (Ship)

## 핵심 개념 / 작동 원리

`ship`은 gstack 생태계의 일부로, 로컬 완성 작업을 PR까지 끌어올리는 6단계 자동화 체크리스트다.

```mermaid
flowchart TD
    A[/ship 호출] --> B[Base 브랜치 감지 + 병합]
    B --> C{충돌?}
    C -->|충돌 발생| D[⛔ 즉시 중단 - 충돌 해결 요청]
    C -->|충돌 없음| E[테스트 실행]
    E --> F{테스트 통과?}
    F -->|실패| G[⛔ 중단 - 테스트 수정 요청]
    F -->|통과| H[Diff 리뷰 스캔]
    H --> I[VERSION 범프 + CHANGELOG 갱신]
    I --> J[커밋 + Remote Push]
    J --> K[gh pr create - PR 생성]
    K --> L[PR URL 반환]
```

각 단계 설명:
1. **Base 브랜치 감지 + 병합**: `main` 또는 `master`를 자동 감지, 최신 base를 현재 브랜치에 병합
2. **테스트 실행**: 프로젝트의 테스트 명령 실행 — 실패 시 즉시 중단
3. **Diff 리뷰**: SQL 안전성, LLM 신뢰 경계, 조건부 부작용 등 자동 스캔
4. **VERSION 범프 + CHANGELOG**: 시맨틱 버저닝 + 사용자 친화적 변경 이력 기록
5. **커밋 + 푸시**: 한국어 Conventional Commits 형태로 커밋 후 Remote 푸시
6. **PR 생성**: `gh pr create`로 PR 생성 + URL 반환

## 한 줄 요약

로컬 작업을 PR까지 끌어올리는 일련의 작업(테스트, 리뷰, 버전 업, 체인지로그, 커밋, 푸시, PR)을 한 번에 자동화하는 배포 워크플로우 스킬이다.

## 프로젝트에 도입하기

```bash
# Claude Code 세션에서 슬래시 명령어로 호출
/ship
```

**SKILL.md 파일 위치**: `~/.claude/skills/ship/SKILL.md`

사전 준비사항:
```bash
# 1. GitHub CLI 설치 및 인증 확인
gh auth status

# 2. 프로젝트에 테스트 명령 확인
pnpm test    # 또는 npm test / yarn test

# 3. 빌드 명령 확인
pnpm build

# 4. CHANGELOG.md 파일 존재 확인 (없으면 생성)
touch CHANGELOG.md
```

ship 스킬은 이 명령들이 동작하지 않으면 해당 단계에서 중단한다. 미리 세팅해 두는 것이 중요하다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 MVP 1~4번 태스크 완료, `feature/notices-mvp` 브랜치에 커밋까지 마쳤다. PR 생성 시점.

```bash
# Claude Code 세션에서
> ship 스킬로 feature/notices-mvp 브랜치를 PR로 올려 줘.
```

Claude가 내부적으로 실행하는 흐름:

```bash
# 1. base 감지 + 병합
git fetch origin main && git merge origin/main

# 2. 테스트 + 빌드 확인
pnpm test && pnpm build && pnpm typecheck

# 3. diff 스캔 (SQL 안전성, 환경변수 노출 등 점검)
git diff origin/main...HEAD | ...

# 4. CHANGELOG 갱신
# CHANGELOG.md에 항목 추가:
# - 공지 게시판 MVP: 목록/작성/권한 분리 (#12)

# 5. 커밋 + 푸시
git commit -m "feat: 공지 게시판 MVP 구현"
git push -u origin feature/notices-mvp

# 6. PR 생성
gh pr create --title "feat: 공지 게시판 MVP" --body "..."
# → https://github.com/.../pull/12 반환
```

## 학습 포인트 / 흔한 함정

- **"완성의 정의"를 자동화한다**: 개발자가 "다 됐다"고 느끼는 순간과 "정말 다 됐다"의 격차를 자동 체크리스트로 메운다. 빌드 한 번, 테스트 한 번이 제출 품질을 크게 바꾼다.
- **"멈춤"은 실패가 아니다**: 테스트 실패나 충돌로 스킬이 중간에 멈추는 건 "배포하지 말라"는 신호다. 억지로 진행하지 말자.
- **gstack 없이도 개념 적용 가능**: 원본은 gstack 특유의 헬퍼를 전제하지만, 핵심은 "PR 만들기 전 체크리스트"다. gstack 없이도 순서대로 수동 실행하면 동일한 효과를 얻는다.
- **Conventional Commits 준비**: 한국어 Conventional Commits(feat:, fix:, chore:)를 미리 프로젝트 규칙으로 정해두면 커밋 메시지 품질이 일관되게 유지된다.

## 관련 리소스

- [개발 브랜치 완료 (finishing-a-development-branch)](/skills/finishing-a-development-branch) — 머지 방법 결정
- [랜딩 & 배포 (land-and-deploy)](/skills/land-and-deploy) — ship 이후 프로덕션 배포
- [PR 리뷰 (review)](/skills/review) — ship 내부 Diff 리뷰 스킬
- [배포 설정 (setup-deploy)](/skills/setup-deploy) — 배포 플랫폼 초기 설정

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic (gstack 생태계) |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
