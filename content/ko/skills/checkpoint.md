---
title: "작업 상태 체크포인트 (Checkpoint)"
source: "~/.claude/skills/checkpoint/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["checkpoint", "작업 상태", "세션", "재개", "에이전트"]
category: "에이전트"
---

# 작업 상태 체크포인트 (Checkpoint)

## 핵심 개념

### 체크포인트에 저장되는 정보

체크포인트는 단순한 "메모"가 아니라 재개에 필요한 모든 맥락을 구조적으로 저장한다.

```
체크포인트 스냅샷 구성:
  ├─ Git 상태
  │   ├─ 현재 브랜치 이름
  │   ├─ 최신 커밋 해시 + 메시지
  │   ├─ 스테이지된/수정된 파일 목록
  │   └─ 스태시(stash) 여부
  ├─ 내린 결정 목록
  │   ├─ "공지 목록은 SSR로 결정 (이유: 실시간 불필요)"
  │   └─ "이미지 업로드는 MVP에서 제외"
  ├─ 남은 작업 목록 (체크박스)
  │   ├─ [ ] 공지 작성 폼 유효성 검사
  │   ├─ [ ] 임원진 권한 미들웨어
  │   └─ [ ] 페이지네이션 구현
  └─ 현재 막힌 지점 / 다음 첫 번째 액션
```

### 언제 사용하나요?

- 세션을 끝내기 직전, 다음번에 어디서부터 시작해야 할지 기록하고 싶을 때
- 긴 작업 중간에 다른 일로 컨텍스트를 전환해야 할 때 (급한 버그픽스, 미팅 등)
- 며칠간 이어지는 작업에서 오늘의 진행 상황을 저장하고 싶을 때
- 새 세션을 열었을 때 "어디까지 했더라?"를 빠르게 복기하고 싶을 때
- Conductor 워크스페이스나 브랜치 간 작업 인수인계가 필요할 때

### 저장 vs 재개

```bash
# 저장
> checkpoint  # 또는
> save progress  # 또는
> 오늘 여기까지, 체크포인트 저장해 줘.

# 재개
> where was I  # 또는
> resume  # 또는
> what was I working on  # 또는
> 어디까지 했지?
```

### 저장 위치

체크포인트는 메모리 파일(`MEMORY.md` 또는 별도 `checkpoint.md`)에 저장되어 세션이 완전히 종료되어도 유지된다. 이 프로젝트에서는 `C:\Users\kik32\.claude\projects\...\memory\` 경로에 저장된다.

## 한 줄 요약

현재 Git 상태, 내린 결정들, 남은 작업 목록을 **스냅샷으로 저장**하여 세션이 끊기거나 컨텍스트가 전환되어도 정확히 멈춘 지점부터 재개할 수 있게 해주는 작업 상태 관리 스킬이다.

## 프로젝트에 도입하기

```bash
/checkpoint
```

**SKILL.md 파일 위치**: `~/.claude/skills/checkpoint/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트에서 임원진 권한 미들웨어를 구현하다가 수업 알림이 울렸다. 2시간 후 돌아올 때 정확히 어디서부터 이어서 해야 할지 기록해 두고 싶다.

### 체크포인트 저장

```bash
> 지금 수업 가야 해. 체크포인트 저장해 줘.
# 또는
> checkpoint — save progress
```

Claude가 생성하는 체크포인트 예시:

```markdown
## 체크포인트 — 2026-04-12 14:30 KST

### Git 상태
- 브랜치: feat/auth-middleware
- 최신 커밋: a3f91c2 "feat: 기본 인증 미들웨어 스캐폴딩"
- 수정 중인 파일:
  - middleware.ts (미완성 — 임원진 역할 체크 로직 절반)
  - app/notices/new/page.tsx (권한 가드 연결 전)

### 완료된 결정
- 인증 방식: Supabase Auth + next-auth 아닌 자체 세션 쿠키
- 역할 모델: 'member' | 'officer' | 'admin' (Enum 확정)
- 미들웨어 위치: 루트 middleware.ts (matcher 패턴 사용)

### 남은 작업
- [ ] middleware.ts: officer/admin 역할 체크 로직 완성
- [ ] app/notices/new/page.tsx: 미들웨어 연결 및 리다이렉트 처리
- [ ] Supabase profiles 테이블에 role 컬럼 마이그레이션 실행
- [ ] 역할 변경 API 엔드포인트 (관리자용)

### 다음 첫 번째 액션
middleware.ts를 열고 TODO 주석이 있는 51번째 줄에서 재개.
`auth.uid()`로 profiles 테이블 조회 후 role을 반환하는 함수 완성 필요.
```

### 체크포인트 재개

```bash
# 2시간 후 수업에서 돌아와서
> 어디까지 했더라? 체크포인트 복기해 줘.
# 또는
> resume
```

Claude의 응답:

```
마지막 체크포인트 (2026-04-12 14:30 KST) 복기:

브랜치: feat/auth-middleware
수정 중이던 파일: middleware.ts (51번째 줄에서 멈춤)

다음 첫 번째 액션:
middleware.ts 51번째 줄 → auth.uid()로 역할 조회 함수 완성

남은 작업 (4개):
  [ ] middleware.ts 역할 체크 로직
  [ ] app/notices/new/page.tsx 권한 가드
  [ ] Supabase role 컬럼 마이그레이션
  [ ] 관리자 역할 변경 API

바로 middleware.ts 열어드릴까요?
```

미완성 파일의 컨텍스트 예시:

```ts
// middleware.ts — 체크포인트에서 재개하는 위치
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // TODO: 여기서 재개 — profiles 테이블에서 role 조회 후 officer/admin 체크
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single()
  // ...
}
```

## 학습 포인트 / 흔한 함정

- **"내가 기억하면 되지"의 함정**: 2시간 후, 또는 다음날 아침에 돌아오면 "어디까지 했더라, 왜 이 결정을 내렸더라"를 떠올리는 데 생각보다 많은 시간을 쓰게 된다. 체크포인트는 이 복기 시간을 거의 0으로 만들어 준다.
- **결정 이유를 함께 저장**: 단순히 "뭘 했는가"가 아니라 "왜 그렇게 결정했는가"까지 저장하는 것이 핵심이다. 결정 이유를 잃으면 나중에 같은 문제를 다시 검토하는 일이 생긴다.
- **세션 종료 전 루틴화**: 작업을 마무리할 때마다 checkpoint를 마지막 명령으로 실행하는 습관을 들이면, Learn 스킬의 학습 기록과도 자연스럽게 연동된다.
- **흔한 실수**: 체크포인트를 저장하지 않고 세션을 종료하는 것이다. 특히 갑작스럽게 세션이 끊기는 경우를 대비해 장시간 작업 시에는 중간중간 체크포인트를 저장해 두자.
- **Next.js 15 관점 팁**: feature 브랜치 작업 중에 `git stash`로 임시 저장한 변경이 있다면, 체크포인트에 stash 목록도 함께 기록해 두는 것이 좋다.

## 관련 리소스

- [using-git-worktrees](./using-git-worktrees.md) — 브랜치별 독립 작업 환경 (체크포인트와 함께 사용)
- [dispatching-parallel-agents](./dispatching-parallel-agents.md) — 병렬 에이전트 작업 상태 관리
- [subagent-driven-development](./subagent-driven-development.md) — 서브에이전트 기반 개발

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
