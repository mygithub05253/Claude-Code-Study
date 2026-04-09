---
title: "Ship — 배포 워크플로우 (Ship)"
source: "~/.claude/skills/ship/SKILL.md"
sourceHash: "sha256:198e2e06814d668a0ec0f2feba318d4b88cfddc33375e070ada90f0e1d9e4e98"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
---

# Ship — 배포 워크플로우 (Ship)

## 한 줄 요약

로컬 작업을 **PR까지 끌어올리는 일련의 작업**(테스트 실행, 리뷰, 버전 업, 체인지로그 작성, 커밋, 푸시, PR 생성)을 한 번에 실행하는 워크플로우 스킬이다. "배포까지 가는 모든 귀찮은 단계"를 자동화한다.

## 언제 사용하나요?

- 작업이 끝나 "이제 main에 올려야겠다"고 판단한 순간
- PR을 수동으로 만드는 대신 체크리스트 기반 자동화를 원할 때
- CHANGELOG 업데이트, VERSION 범프 등 반복 작업을 잊지 않고 싶을 때
- `main` / `master` 같은 기본 브랜치에 직접 push 하는 대신 항상 PR을 만들고 싶을 때

반대로, 여전히 개발 중이거나 테스트가 불안정한 상태에서는 쓰지 않는다. 이 스킬은 "완성도 검증"까지 포함하므로 도중에 돌리면 실패한다.

## 핵심 개념

원본은 gstack 생태계(gstack는 `ship`, `review`, `investigate` 같은 스킬을 묶은 도구 모음)의 일부다. 배포 워크플로우를 다음 단계로 구조화한다.

1. **Base 브랜치 감지 + 병합**: `main` 또는 `master`를 자동 감지하고, 현재 브랜치에 최신 base를 병합한다. 충돌이 있으면 즉시 멈춘다.
2. **테스트 실행**: 프로젝트의 테스트 명령을 실행한다. 실패하면 멈춘다.
3. **Diff 리뷰**: `review` 스킬과 유사한 방식으로 변경 사항을 스캔해 명백한 문제(SQL 안전성, LLM 신뢰 경계, 조건부 부작용 등)를 표시한다.
4. **VERSION 범프 + CHANGELOG 갱신**: 시맨틱 버저닝 규칙에 따라 버전을 올리고, 사용자 친화적인 문장으로 체인지로그에 기록한다.
5. **커밋 + 푸시**: 지금까지의 변경을 한국어 Conventional Commits 형태로 커밋하고 remote에 푸시한다.
6. **PR 생성**: `gh pr create`로 PR을 만들고 URL을 반환한다.

원본은 또한 PR 메시지와 CHANGELOG에 **특정 톤(Garry Tan/YC 분위기의 간결·직설 스타일)**을 적용한다. 이는 gstack 특유의 컨벤션으로, 개인 프로젝트에서는 선택적으로 적용할 수 있다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 MVP 계획서의 1~4번 태스크를 모두 끝내고 `feature/notices-mvp` 브랜치에 커밋까지 마쳤다. 이제 main에 올리기 위해 PR을 만들려 한다. 원본 스킬은 gstack 전용이지만, 본질은 "PR을 만들기 전 체크리스트"이므로 대학생 과제 흐름에도 그대로 적용할 수 있다.

```bash
# Claude Code 세션에서
> ship 스킬로 feature/notices-mvp 브랜치를 PR로 올려 줘.
```

Claude가 내부적으로 실행하는 흐름은 다음과 같다.

```bash
# 1. base 감지 + 병합
git fetch origin main
git merge origin/main    # 충돌 없으면 통과

# 2. 테스트
pnpm test                # 모든 테스트 통과 확인
pnpm build               # 빌드 확인 (Next.js 프로젝트는 필수)

# 3. diff 스캔 (review 스킬과 유사)
git diff origin/main...HEAD | ...   # SQL 안전성, 환경변수 노출 등 점검

# 4. CHANGELOG 갱신
# CHANGELOG.md에 다음 같은 항목 추가:
# - 공지 게시판 MVP: 목록/작성/권한 분리 (#12)

# 5. 커밋 + 푸시
git add CHANGELOG.md
git commit -m "feat: 공지 게시판 MVP 구현

- notices 테이블 + RLS 정책
- 로그인 미들웨어
- 목록 페이지(서버 컴포넌트)
- 작성 페이지(임원진 전용)"
git push -u origin feature/notices-mvp

# 6. PR 생성
gh pr create --title "feat: 공지 게시판 MVP" --body "..."
```

결과로 Claude는 PR URL을 출력한다. 대학생 레포에서는 팀원(또는 교수님)이 이 PR을 리뷰하거나, 본인이 merge 버튼을 누르는 것으로 마무리한다.

```ts
// 이 스킬은 코드를 생성하지 않고, 이미 작성된 코드와 커밋을 "PR까지" 옮기는 역할이다.
// 따라서 대학생이 이 스킬로 얻는 가장 큰 이득은 "잊기 쉬운 체크리스트를 자동화"하는 것이다.
// 예: CHANGELOG를 까먹는 일, 빌드를 안 돌리는 일, 커밋 메시지 컨벤션 깨는 일 등.
```

## 학습 포인트

- **"완성의 정의"를 자동화한다**: 이 스킬이 가치 있는 이유는, 개발자가 "다 됐다"고 느끼는 순간과 "정말 다 됐다"의 격차를 자동 체크리스트로 메워 주기 때문이다. 대학생 과제에서도 제출 직전에 빌드 한 번, 테스트 한 번 돌려보는 습관이 핵심이다.
- **Conventional Commits와 CHANGELOG**: 원본은 커밋 메시지와 체인지로그에 일관된 톤을 요구한다. 한국어 Conventional Commits(예: `feat:`, `fix:`, `chore:`)로 번역해 쓰면 본 프로젝트의 운영 원칙(CLAUDE.md)과도 맞는다.
- **"멈춤"은 실패가 아니다**: 테스트 실패나 충돌로 스킬이 중간에 멈추는 건 "배포하지 말라"는 신호다. 멈췄을 때 억지로 진행하지 말자.
- **Next.js 15 프로젝트 팁**: `ship` 같은 워크플로우 스킬을 쓰려면, 프로젝트에 `pnpm test`, `pnpm build`, 그리고 가능하면 `pnpm typecheck` 명령이 정상 동작하도록 미리 세팅해 두는 것이 중요하다. 이 명령들이 없으면 스킬이 "무엇을 돌려야 할지" 알 수 없다.

## 원본과의 차이

- 원본은 **gstack이라는 특정 도구 모음**의 일부이며, 전용 헬퍼(base 감지, diff 스캔)가 존재한다고 가정한다. 본 해설은 gstack 없이도 개념을 이해할 수 있도록 "일반 개발자의 PR 체크리스트"로 풀어 설명했다.
- 원본의 "Voice" 섹션(Garry Tan/YC 스타일의 간결·직설 커밋 메시지/체인지로그 톤)은 본 해설에서는 참고 사항으로만 언급했다. 한국어 Conventional Commits로 대체해도 본 프로젝트 기준으로는 충분하다.
- 원본은 일부 단계에서 `/land-and-deploy` 같은 후속 스킬과 이어지는 것을 전제로 한다. 본 해설은 "PR 생성까지"로 범위를 한정했다.
- 원본에서 언급되는 세부 내부 훅/매처 구조는 본 해설에서 생략했다 — 원본에서 명시되지 않은 부분까지 추측하지 않기 위함이다.

> 원본: `~/.claude/skills/ship/SKILL.md`
