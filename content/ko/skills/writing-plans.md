---
title: "계획서 작성 (Writing Plans)"
source: "~/.claude/skills/writing-plans/SKILL.md"
sourceHash: "sha256:860c03363e5ad80a5d42de2a61fa5a569ba49bc23fa24af83e78aeff56ae62d0"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
---

# 계획서 작성 (Writing Plans)

## 한 줄 요약

여러 단계로 나뉘는 작업을 시작하기 전에, **실행 가능한 최소 단위 태스크**로 쪼갠 마크다운 계획서를 작성하는 스킬이다. 코드를 건드리기 전에 "무엇을 / 어떤 순서로 / 어떻게 검증하며" 진행할지를 문서로 고정한다.

## 언제 사용하나요?

- 브레인스토밍으로 의도가 명확해졌고, 이제 구체적인 실행 순서를 정리해야 할 때
- 한 번에 머리에 다 담기 어려운 **3단계 이상의 작업**일 때
- 나중에 executing-plans 스킬이나 다른 세션에서 이어서 진행해야 할 때
- 작업을 리뷰어/팀원에게 설명해야 할 때 (설사 혼자 하는 과제여도, 미래의 나에게 설명하는 용도)

반대로, 한 파일 한 줄짜리 고치는 작업에 계획서는 과하다. 규모가 작으면 바로 코드로 간다.

## 핵심 개념

원본 스킬의 핵심 규칙은 네 가지다.

1. **스코프 체크(Scope Check)**: 계획서는 하나의 목표를 향해야 한다. "이것도 같이 하자"가 튀어나오면 새 계획서로 분리한다.
2. **비트 사이즈드(Bite-Sized) 태스크**: 한 태스크는 한 세션 안에 마쳐서 "완료" 또는 "다음 태스크로 넘김" 둘 중 하나가 나와야 한다. 모호한 태스크는 금지.
3. **플레이스홀더 금지(No Placeholders)**: "TODO", "여기에 뭔가 추가", "나중에 채우기" 같은 구멍을 남기지 않는다. 모르는 건 "조사 필요"를 별도 태스크로 만든다.
4. **실행 핸드오프(Execution Handoff)**: 계획서는 executing-plans 스킬에게 넘기는 문서다. 넘겨받는 입장에서 맥락 추가 없이 바로 실행 가능해야 한다.

계획서 구조는 대략 다음 헤더를 갖는다.

- `# 계획서 제목`
- `## Context` — 왜 이걸 하는가
- `## Scope` — 포함 / 제외
- `## Tasks` — 체크박스 목록, 파일 경로 명시
- `## Verification` — 완료 조건
- `## Risks` — 실패 모드와 대응

## 실전 예제 (대학생 관점)

**상황**: 위 브레인스토밍 예제의 연장선. "로그인한 동아리원(읽기)과 임원진(쓰기)이 사용하는 Next.js 15 공지 페이지"를 만들기 위한 계획서를 써 보자.

```markdown
# 동아리 공지 게시판 MVP 계획서

## Context
동아리 과제용. Next.js 15 App Router + Supabase로 읽기/쓰기 권한을
구분한 공지 페이지를 만든다. 알림/댓글은 MVP 제외.

## Scope
- In: 로그인, 공지 CRUD, 역할 분리 (member/officer)
- Out: 알림, 댓글, 첨부파일, 마크다운 렌더링

## Tasks
- [ ] 1. Supabase 프로젝트 생성 + notices 테이블 스키마 작성
      파일: `supabase/migrations/0001_notices.sql`
      완료: `supabase db push` 성공 + 로컬에서 SELECT 가능
- [ ] 2. 인증 미들웨어 작성
      파일: `middleware.ts`, `lib/auth.ts`
      완료: 비로그인 사용자가 /notices/new 접근 시 /login으로 리다이렉트
- [ ] 3. 공지 목록 서버 컴포넌트
      파일: `app/notices/page.tsx`
      완료: Supabase에서 최신 10개 공지를 서버에서 fetch하여 렌더
- [ ] 4. 공지 작성 폼 (임원진만)
      파일: `app/notices/new/page.tsx`, `app/notices/new/actions.ts`
      완료: Server Action으로 insert 성공 + officer가 아니면 403

## Verification
- `pnpm build` 성공
- 일반 계정 로그인 → /notices 접근 가능 / /notices/new 접근 불가
- 임원진 계정 로그인 → 두 페이지 모두 접근 가능, 작성 성공
- Lighthouse 접근성 점수 90+

## Risks
- Supabase RLS 정책 버그 → 테이블 정책을 `officer` 역할만 INSERT 가능하도록 이중 방어
- Next.js 15 Server Actions 문법 변경 → 공식 문서 링크 북마크
```

여기서 중요한 건 **각 태스크마다 파일 경로와 완료 조건이 명시돼 있다**는 점이다. executing-plans 스킬이 이 계획서를 받아 1번 태스크부터 순차적으로 실행하게 된다.

```ts
// 3번 태스크 실행 시 Claude가 작성할 코드의 형태
// app/notices/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function NoticesPage() {
  const supabase = createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, created_at, author_name")
    .order("created_at", { ascending: false })
    .limit(10);

  return <NoticeList notices={notices ?? []} />;
}
```

## 학습 포인트

- **계획서는 실행 전의 "컴파일 에러 체크"다**: 머릿속에서 문법은 맞는 것 같아도, 글로 써 보면 모순이 드러난다. "이 태스크는 뭐로 검증하지?"가 안 나오면 태스크가 너무 크거나 의도가 불명확하다는 신호다.
- **Bite-Sized 원칙**: 대학생 프로젝트에서 한 태스크가 4시간 넘게 걸리면 쪼갤 수 있는지 다시 본다. 긴 태스크는 중간에 방향을 잃기 쉽다.
- **플레이스홀더 금지**: "여기서 뭔가 처리"라고 적고 나중에 채우려 하면, 미래의 나는 이미 맥락을 잊었다. 모르면 "조사 필요"를 별도 태스크로 분리한다.
- **Next.js 15 팁**: App Router 프로젝트의 계획서에는 반드시 "서버 컴포넌트 / 클라이언트 컴포넌트 / Server Action" 구분이 들어가야 한다. 이 결정이 불명확한 태스크는 실행 시 반드시 막힌다.

## 원본과의 차이

- 원본은 범용 소프트웨어 프로젝트를 가정한다. 본 해설은 Next.js 15 App Router와 Supabase 기반 대학생 과제 예제로 구체화했다.
- 원본에는 "Self-Review" 섹션(계획서를 제출 전 스스로 검토)이 있다. 본 해설에서는 지면상 간략화했지만, 실제 사용 시에는 "이 계획서를 다른 사람에게 넘겨도 실행 가능한가?"를 꼭 자문해 보자.
- 원본의 "Plan Document Header" 표준 형식은 본 해설 예제에 녹여 넣었다.
- 원본에서 언급되는 일부 세부 조항(예: 특정 프로젝트 컨벤션)은 본 해설에서는 생략했으며, 필요 시 원본을 참고하자.

> 원본: `~/.claude/skills/writing-plans/SKILL.md`
