---
title: "계획서 실행 (Executing Plans)"
source: "~/.claude/skills/executing-plans/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:fc92bc1e0c3695e2e8d3d3acf98c4b26b1e3e5030f481541f88c3d76faafca17"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["executing-plans", "계획 실행", "체크포인트", "순차 실행"]
category: "기획/설계"
---

# 계획서 실행 (Executing Plans)

## 핵심 개념

`writing-plans`로 만들어 둔 마크다운 계획서를 체크포인트를 두고 순차 실행하는 방법을 제공한다. 태스크 단위로 로드 → 실행 → 완료 표시 → 다음 태스크를 반복한다.

### 언제 사용하나요?

- 이미 작성된 계획서(.md)를 들고 와서 코드로 옮겨야 할 때
- 계획서가 너무 길어 한 세션에 다 못 끝내고 **다음 세션으로 이어야** 할 때
- 중간 리뷰 체크포인트를 원할 때 (각 태스크 완료 후 사용자 확인)
- 여러 태스크가 의존 관계를 갖고 있어, 순서 관리가 중요한 경우

반대로, 계획서가 없는 상태에서 이 스킬만 쓰면 맥락이 부족해 실패한다. 계획서 없이 바로 작업하고 싶다면 `subagent-driven-development` 쪽이 더 맞다.

### 3단계 실행 프로세스

원본은 실행 과정을 3단계로 정의한다.

1. **로드(Load)**: 계획서를 읽고, 맥락/스코프/현재까지 완료된 태스크를 파악한다. 체크박스 `[x]`가 붙은 태스크는 건너뛴다.
2. **실행(Execute)**: 다음 미완료 태스크 하나를 골라 구현한다. 한 번에 여러 태스크를 동시에 하지 않는다. "한 태스크 = 한 초점".
3. **완료(Complete)**: 검증 조건을 만족했는지 확인하고, 계획서의 체크박스를 `[x]`로 업데이트한 뒤 사용자에게 보고한다. 사용자가 "다음"이라고 하면 다시 로드 단계로 돌아간다.

핵심 원칙 두 가지를 추가로 강조한다.

- **멈춤 신호(When to Stop)**: 태스크 중간에 계획서에 없던 변수가 튀어나오면 즉시 멈추고 사용자에게 알린다. 예: "이 태스크에서 Supabase 마이그레이션이 필요한데 계획서에는 DB 설정이 없습니다. 진행 전에 확인이 필요합니다."
- **통합(Integration)**: 이 스킬은 `systematic-debugging`, `test-driven-development`, `review` 같은 다른 스킬과 자연스럽게 결합된다. 예를 들어 태스크 검증이 실패하면 즉시 investigate 스킬로 넘어갈 수 있다.

## 한 줄 요약

`writing-plans`로 만들어 둔 마크다운 계획서를 **체크포인트를 두고 순차 실행**하는 스킬이다. 태스크 단위로 로드 → 실행 → 완료 표시 → 다음 태스크를 반복한다.

## 프로젝트에 도입하기

```bash
/executing-plans
```

**SKILL.md 파일 위치**: `~/.claude/skills/executing-plans/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: writing-plans 해설 예제에서 만든 "동아리 공지 게시판 MVP 계획서"를 실제로 실행해 보자. 계획서 파일은 `docs/plans/notices-mvp.md`에 있다.

```bash
# 세션 1 — 태스크 1번만 실행
> docs/plans/notices-mvp.md를 executing-plans 스킬로 실행해 줘. 태스크 1번만.
```

Claude는 이렇게 동작한다.

1. **Load**: `docs/plans/notices-mvp.md`를 읽고, "Tasks" 섹션에서 첫 번째 미완료 태스크를 찾는다.
   ```
   - [ ] 1. Supabase 프로젝트 생성 + notices 테이블 스키마 작성
   ```
2. **Execute**: `supabase/migrations/0001_notices.sql` 파일을 작성하고, 계획서에 명시된 검증 조건(`supabase db push` 성공)을 확인한다.
   ```sql
   -- supabase/migrations/0001_notices.sql
   create type user_role as enum ('member', 'officer');

   create table notices (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     body text not null,
     author_id uuid references auth.users(id) not null,
     created_at timestamptz not null default now()
   );

   alter table notices enable row level security;

   create policy "notices_select_all" on notices
     for select using (auth.role() = 'authenticated');

   create policy "notices_insert_officer" on notices
     for insert with check (
       exists (
         select 1 from profiles
         where profiles.id = auth.uid() and profiles.role = 'officer'
       )
     );
   ```
3. **Complete**: 로컬에서 마이그레이션을 돌리고, 계획서의 체크박스를 업데이트한다.
   ```markdown
   - [x] 1. Supabase 프로젝트 생성 + notices 테이블 스키마 작성
   ```
   그리고 사용자에게 "1번 태스크 완료. 2번으로 넘어가도 될까요?"라고 묻는다.

**세션 2 (다음 날)**: 사용자가 `executing-plans`로 다시 돌아와 "2번부터 이어서"라고 하면, Claude는 이미 `[x]` 표시된 1번을 건너뛰고 2번 태스크(인증 미들웨어)부터 실행한다. 맥락을 다시 설명하지 않아도 된다는 것이 이 스킬의 핵심 가치다.

```ts
// 2번 태스크 실행 시 생성되는 파일의 형태
// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/notices/new/:path*"],
};
```

## 학습 포인트 / 흔한 함정

- **"한 태스크씩"의 위력**: 대학생 과제에서 제일 흔한 패착은 "어차피 비슷한 거니까 한꺼번에"이다. 여러 파일을 동시에 건드리면 실패 지점을 좁히기 어려워진다. 한 태스크 단위로 커밋까지 완료한 뒤 다음으로 가는 습관을 들이자.
- **체크박스는 거짓말하지 않는다**: 계획서의 체크박스가 실제 진척률이다. Claude에게 실행을 맡길 때도, 체크박스가 업데이트되지 않았다면 그 태스크는 아직 완료된 것이 아니다.
- **세션 간 연속성**: 이 스킬의 설계 목적 중 하나는 "세션이 바뀌어도 동일하게 이어갈 수 있게" 하는 것이다. 과제 작업을 여러 날에 나눠 하는 대학생에게 특히 유용하다.
- **멈춤의 용기**: 태스크 실행 중 "이건 계획서에 없는데?"라는 느낌이 들면, 억지로 진행하지 말고 Claude에게 멈추라고 말하자. 원본 스킬의 "When to Stop" 원칙을 지키는 것이다.

## 관련 리소스

- [writing-plans](./writing-plans.md) — 계획서 작성 (Executing Plans의 전 단계)
- [autoplan](./autoplan.md) — 계획 자동 생성 및 리뷰
- [subagent-driven-development](./subagent-driven-development.md) — 계획서 없이 즉시 작업 실행

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
