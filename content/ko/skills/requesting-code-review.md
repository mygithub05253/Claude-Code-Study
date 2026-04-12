---
title: "코드 리뷰 요청 (Requesting Code Review)"
source: "~/.claude/skills/requesting-code-review/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 코드 리뷰 요청 (Requesting Code Review)

## 한 줄 요약

작업 완료 후, 주요 기능 구현 후, 또는 main 브랜치 머지 직전에 **요구사항 충족 여부를 체계적으로 검증**하는 코드 리뷰 요청 스킬이다.

## 언제 사용하나요?

- 구현을 완료했다고 판단했을 때, PR을 올리기 전 마지막 자가 검증이 필요할 때
- 주요 기능(로그인, 결제, 알림 등)을 구현한 후 "이게 요구사항을 다 만족하는가?"를 확인하고 싶을 때
- main 브랜치에 머지하기 전, 동료에게 리뷰를 요청하기 위한 PR 설명을 작성할 때
- 기능 구현 후 테스트 커버리지, 에러 핸들링, 엣지 케이스를 빠뜨린 곳이 없는지 점검할 때
- 팀원에게 리뷰를 요청할 때 "어디를 중점적으로 봐달라"는 컨텍스트를 명확히 전달하고 싶을 때

## 핵심 개념

코드 리뷰 요청의 목표는 단순히 "PR 만들기"가 아니라 **"리뷰어가 효과적으로 리뷰할 수 있도록 준비하는 것"**이다.

### 자가 검증 체크리스트

PR을 올리기 전에 다음 항목을 스스로 점검한다.

**기능 완성도**
- 원래 요구사항(이슈, 티켓, 설계 문서)을 모두 구현했는가?
- 해피 패스(정상 흐름)뿐 아니라 엣지 케이스도 처리했는가?
- 사용자가 마주칠 수 있는 에러 상황에서 적절한 피드백이 있는가?

**코드 품질**
- TypeScript strict 모드 위반, `any` 사용, 불필요한 `console.log`는 없는가?
- 복잡한 로직에는 한국어 주석이 있는가?
- 컴포넌트/함수 크기가 적절한가? (단일 책임 원칙)

**테스트**
- 핵심 로직에 대한 유닛 테스트가 있는가?
- 테스트가 실제 요구사항을 검증하는가, 아니면 구현 세부사항만 검증하는가?

**보안**
- 사용자 입력을 적절히 검증/이스케이프하는가?
- 인증/권한 체크를 빠뜨린 엔드포인트는 없는가?

### 좋은 PR 설명 구조

리뷰어가 빠르게 컨텍스트를 파악할 수 있도록 PR 설명을 구조화한다.

```
## 변경 사항
- 무엇을 왜 변경했는가

## 테스트 방법
- 어떻게 검증했는가, 직접 테스트해볼 수 있는 방법

## 중점 리뷰 요청
- 리뷰어가 특히 집중해서 봐주었으면 하는 부분

## 스크린샷 (UI 변경 시)
- Before/After 이미지
```

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"에서 "공지 작성" 기능을 구현했다. Server Action + Supabase를 사용하며, 인증된 사용자만 작성할 수 있어야 한다.

**자가 검증 단계**

```bash
# Claude Code 세션에서
> requesting-code-review 스킬로 feature/create-notice 브랜치를 검증해 줘.
> 원래 요구사항: 로그인한 동아리 회원만 공지를 작성할 수 있고,
> 제목 1~100자, 본문 10~2000자 제한이 있어야 해.
```

**구현 코드 예시**

```typescript
// app/notices/create/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 입력 검증 스키마
const createNoticeSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(100, "제목은 100자 이하"),
  content: z
    .string()
    .min(10, "본문은 10자 이상")
    .max(2000, "본문은 2000자 이하"),
});

export async function createNotice(formData: FormData) {
  // 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 입력 검증
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const result = createNoticeSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  // DB 저장
  const { error } = await supabase.from("notices").insert({
    title: result.data.title,
    content: result.data.content,
    author_id: user.id,
  });

  if (error) {
    return { error: { _root: ["공지 저장에 실패했습니다."] } };
  }

  revalidatePath("/notices");
  redirect("/notices");
}
```

**PR 설명 예시**

```markdown
## 변경 사항
공지 작성 기능을 구현했습니다 (#12).
- Server Action(`createNotice`)으로 폼 처리
- Zod 스키마로 서버 사이드 검증 (제목 1~100자, 본문 10~2000자)
- Supabase `auth.getUser()`로 인증 확인 후 미인증 시 /login 리다이렉트

## 테스트 방법
1. `pnpm dev` 실행 후 http://localhost:3000/notices/create 접속
2. 미로그인 상태 → /login 리다이렉트 확인
3. 로그인 후 빈 제목 제출 → 에러 메시지 확인
4. 정상 입력 후 제출 → /notices로 이동하며 목록에 새 공지 표시 확인

## 중점 리뷰 요청
- Server Action에서 에러를 반환하는 방식이 적절한지 (return vs throw)
- Supabase RLS 정책과 `author_id` 저장 방식이 충돌 없는지

## 스크린샷
[공지 작성 폼 이미지 첨부]
```

**자가 검증 결과 — Claude의 피드백 예시**

```
✅ 인증 확인: auth.getUser() 사용, 미인증 시 redirect 처리
✅ 입력 검증: Zod 스키마, 제목/본문 길이 제한 모두 구현
⚠️  에러 처리: DB 에러를 return으로 반환하지만,
    redirect()는 에러가 있어도 실행됩니다.
    `if (error) return {...}` 이후 redirect()가 항상 실행되는 버그가 있습니다.
❌ 테스트 없음: createNotice Server Action에 대한 유닛/통합 테스트가 없습니다.
```

**수정 후 버그 수정 예시**

```typescript
// ❌ 버그 있는 코드
if (error) {
  return { error: { _root: ["공지 저장에 실패했습니다."] } };
}
revalidatePath("/notices");
redirect("/notices"); // error return 이후에도 실행될 수 있음

// ✅ 수정 후
if (error) {
  return { error: { _root: ["공지 저장에 실패했습니다."] } };
}
// 여기까지 오면 성공이 확실함
revalidatePath("/notices");
redirect("/notices");
```

## 학습 포인트

- **PR = 의사소통 문서다**: 코드만 올리는 PR은 리뷰어에게 불친절하다. 왜 이 변경을 했는지, 어디를 봐달라는지 명시하는 것이 팀 생산성을 높인다.
- **자가 검증은 리뷰 전에**: 리뷰어가 "테스트는 돌려봤어요?"라고 물어보는 상황을 만들지 말자. 자가 검증 체크리스트를 PR 설명에 포함하면 신뢰도가 올라간다.
- **흔한 실수 — "완성했다"고 착각**: 기능이 동작하는 것과 요구사항을 모두 만족하는 것은 다르다. 요구사항 문서를 다시 읽고, 각 항목이 실제로 구현되었는지 확인한다.
- **Next.js 15 팁**: Server Action에서 `return`과 `redirect()`의 순서를 꼭 확인한다. `redirect()`는 내부적으로 예외를 던지므로 `try-catch` 안에 넣으면 예상치 못한 동작이 생긴다. `try` 블록 밖에서 호출하는 것이 안전하다.
- **리뷰 요청 타이밍**: "완성됐다고 생각할 때"와 "실제로 완성됐을 때"는 다르다. 자가 검증 스킬을 돌린 후 피드백을 반영하고 나서 리뷰를 요청하는 것이 효율적이다.

## 원본과의 차이

- 원본 스킬은 작업 완료, 주요 기능 구현, main 머지 전 세 시점을 명시한다. 본 해설은 이를 구체적인 체크리스트와 PR 설명 템플릿으로 확장했다.
- 원본에 없는 "자가 검증 → PR 설명 → 리뷰 요청"의 흐름을 명시적으로 구조화했다.
- Next.js 15 Server Action의 `redirect()` 관련 흔한 버그를 대학생 맥락에 맞게 추가했다.
- 원본에서 다루지 않는 Zod 검증, Supabase 인증 패턴을 실전 예제로 포함했다.

> 원본: `~/.claude/skills/requesting-code-review/SKILL.md`
