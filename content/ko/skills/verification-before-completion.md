---
title: "완료 전 검증 (Verification Before Completion)"
source: "~/.claude/skills/verification-before-completion/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["검증", "빌드", "테스트", "품질", "증거우선"]
category: "품질/안전"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 완료 전 검증 (Verification Before Completion)

## 핵심 개념

### 왜 이 스킬이 필요한가

AI는 코드를 작성하고 나서 "이렇게 하면 됩니다"라고 자신 있게 말하는 경향이 있다. 그러나 실제로 실행해 보지 않고 한 주장은 **추론 기반 주장**일 뿐이다. 타입 오류, 런타임 에러, 빠진 의존성, 환경 차이로 인해 작동하지 않는 경우가 생각보다 많다.

Verification Before Completion 스킬은 이 함정을 피하기 위한 **단 하나의 원칙**을 강제한다.

> **주장하기 전에 실행 결과를 보여라.**

### 검증 명령어 실행 의무

성공 선언 전에 다음 중 해당하는 명령어를 **반드시 실행하고 출력을 확인**해야 한다.

| 주장 유형 | 검증 명령어 예시 |
|-----------|----------------|
| "빌드 성공" | `pnpm build`, `tsc --noEmit` |
| "테스트 통과" | `pnpm test`, `vitest run` |
| "타입 오류 없음" | `tsc --noEmit`, `pnpm typecheck` |
| "린트 통과" | `pnpm lint`, `eslint src/` |
| "서버 정상 동작" | `curl -I http://localhost:3000` |
| "마이그레이션 성공" | DB 쿼리로 스키마 확인 |

### "증거 없이 완료 없음" 원칙

```
잘못된 방식:
  Claude: "유효성 검사 로직을 추가했습니다. 이제 빈 제목으로 제출하면
           400 오류가 반환됩니다."

올바른 방식:
  Claude: "유효성 검사 로직을 추가했습니다. 확인해 보겠습니다."

  $ pnpm build
  Compiled successfully

  $ curl -X POST http://localhost:3000/api/notices \
    -H "Content-Type: application/json" \
    -d '{"title":"","content":"테스트"}'
  → {"error":"제목을 입력해 주세요."} (400)

  검증 완료. 빈 제목 제출 시 400 오류가 정상 반환됩니다.
```

## 한 줄 요약

"완성됐습니다", "고쳤습니다", "테스트 통과합니다" 같은 **성공 주장을 하기 전에** 반드시 실제 검증 명령어를 실행하고 그 출력 결과를 확인해야 한다는 원칙을 강제하는 스킬이다. **주장보다 증거를 먼저.**

## 프로젝트에 도입하기

```bash
/verification-before-completion
```

**SKILL.md 파일 위치**: `~/.claude/skills/verification-before-completion/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트에서 공지 작성 Server Action을 구현했다. 커밋하기 전에 Verification Before Completion 스킬을 적용한다.

### 예제 1: 타입스크립트 빌드 검증

```ts
// app/notices/actions.ts — 새로 작성한 Server Action
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface CreateNoticeInput {
  title: string
  content: string
  isPinned: boolean
}

export async function createNotice(input: CreateNoticeInput) {
  const supabase = createServerActionClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증 필요')

  const { error } = await supabase
    .from('notices')
    .insert({
      title: input.title.trim(),
      content: input.content,
      is_pinned: input.isPinned,
      author_id: user.id,
    })

  if (error) throw new Error(error.message)

  revalidatePath('/notices')
}
```

"구현 완료"를 선언하기 전에 검증을 실행한다.

```bash
# 1단계: 타입 검사
$ pnpm typecheck

app/notices/actions.ts:18:5
Type error: Object literal may only specify known properties,
and 'isPinned' does not exist in type 'Database["public"]["Tables"]["notices"]["Insert"]'.
Did you mean to write 'is_pinned'?

# 타입 오류 발견. 주장 전에 잡아냈음.
```

오류를 수정한 후 다시 검증:

```bash
$ pnpm typecheck
No errors found.

$ pnpm build
Compiled successfully in 4.2s

# 검증 완료. 이제 "구현 완료"를 선언하고 커밋할 수 있다.
```

### 예제 2: 테스트 결과 확인 후 PR 생성

```bash
# PR 생성 전 전체 검증 실행
$ pnpm test

 PASS  __tests__/notices.test.ts
  공지 목록 조회 (23ms)
  공지 작성 — 유효한 입력 (31ms)
  FAIL 공지 작성 — 빈 제목 거부 (12ms)
    Expected: 400
    Received: 201

# 테스트 실패 발견. "테스트 통과" 주장 금지.
# 실패 원인 수정 후 재실행 필요.
```

수정 후:

```bash
$ pnpm test
 PASS  __tests__/notices.test.ts
  공지 목록 조회 (23ms)
  공지 작성 — 유효한 입력 (29ms)
  공지 작성 — 빈 제목 거부 (11ms)

Tests: 3 passed, 3 total
# 이제 "테스트 통과" 주장이 증거로 뒷받침된다.
```

### 예제 3: 빠른 확인의 유혹 저항

```bash
# 잘못된 패턴: 빌드 없이 커밋
> 공지 삭제 기능 구현했어. 커밋해 줘.
Claude: 잠깐, 커밋 전에 빌드를 먼저 확인하겠습니다.
$ pnpm build
...
Error: Cannot find module '@/lib/deleteNotice'
# 임포트 경로 오류. 커밋 전에 발견됨.
```

## 학습 포인트 / 흔한 함정

- **"될 것 같다"와 "된다"는 다르다**: AI가 코드를 작성하고 "이렇게 하면 됩니다"라고 말할 때, 그것은 추론이지 사실이 아닐 수 있다. 실행 결과만이 사실이다.
- **검증 명령어는 짧고 빠르다**: `tsc --noEmit`은 몇 초면 끝난다. 커밋 후 CI에서 빌드 실패를 발견하고 재수정하는 것보다 훨씬 빠르다.
- **"증거 없이 완료 없음"을 팀 규칙으로**: 코드 리뷰에서 "테스트 돌렸어요?"를 묻는 것이 아니라, 처음부터 검증 결과를 PR 설명에 첨부하는 문화를 만드는 것이 이 스킬의 목표다.
- **흔한 실수**: "빌드는 나중에 CI가 잡으면 되지"라는 생각이다. CI 실패 → 수정 → 재푸시 → 리뷰어 다시 확인 사이클은 생각보다 많은 시간과 에너지를 낭비한다.
- **Next.js 15 관점 팁**: `pnpm build`는 단순 타입 검사 외에도 정적 생성, 이미지 최적화, Server Component 렌더링 오류까지 잡아준다. 개발 모드(`pnpm dev`)에서는 보이지 않던 빌드 타임 오류를 발견하는 가장 확실한 방법이다.

## 관련 리소스

- [test-driven-development](./test-driven-development.md) — 테스트를 먼저 쓰는 개발 철학
- [systematic-debugging](./systematic-debugging.md) — 실패 원인 확정 후 수정
- [requesting-code-review](./requesting-code-review.md) — 검증 완료 후 PR 요청 패턴

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
