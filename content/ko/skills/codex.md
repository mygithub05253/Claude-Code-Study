---
title: "Codex 코드 리뷰 (Codex)"
source: "~/.claude/skills/codex/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["codex", "코드 리뷰", "보안", "적대적 검증"]
category: "코드 리뷰"
---

# Codex 코드 리뷰 (Codex)

## 핵심 개념

Codex 스킬은 세 가지 모드로 작동한다.

### 모드 1: Code Review (`codex review`)

현재 브랜치의 diff 또는 특정 파일을 Codex CLI로 독립적으로 리뷰한다. 중요한 점은 이 리뷰가 **pass/fail 게이트** 역할을 한다는 것이다. Codex가 "fail"을 판정하면 해당 diff는 문제가 있다고 간주되며, ship 스킬 파이프라인에서 자동으로 블로킹된다.

### 모드 2: Challenge (`codex challenge`)

코드를 "적대적"으로 분석한다. "이 코드를 어떻게 하면 깰 수 있는가?"라는 관점에서 엣지 케이스, 경쟁 조건(race condition), 보안 취약점, 잘못된 가정 등을 적극적으로 찾는다. 단순 리뷰보다 훨씬 공격적이다.

### 모드 3: Consult (`codex consult`)

Codex와 **대화형 세션**을 열어 기술 자문을 구한다. 세션 연속성(session continuity)이 지원되므로 이전 대화 맥락을 유지하면서 후속 질문을 할 수 있다. "방금 말한 패턴을 우리 프로젝트에 어떻게 적용하면 돼?"와 같은 이어지는 질문이 가능하다.

### 언제 사용하나요?

- PR diff를 올리기 전 Claude 리뷰와는 다른 시각으로 **두 번째 의견(second opinion)** 을 얻고 싶을 때 (`codex review`)
- "내 코드를 최대한 공격해 봐 — 버그를 찾아내 봐" 식의 **적대적 검증**이 필요할 때 (`codex challenge`)
- 특정 구현 방식의 장단점, 알고리즘 선택, 라이브러리 추천 등 **기술 자문**이 필요할 때 (`codex consult`)
- Claude Code가 스스로 생성한 코드를 외부 관점에서 교차 검증하고 싶을 때
- "codex 리뷰 해줘", "두 번째 의견 줘", "codex에 물어봐" 같은 요청을 받았을 때

### "200 IQ 자폐 개발자"라는 의미

원본 스킬에서 사용하는 이 표현은 Codex의 특성을 압축한 것이다. 감정 없이, 사회적 눈치 없이, 오직 코드의 논리적 정확성과 안전성만을 기준으로 판단한다는 뜻이다. 팀원 리뷰는 "감정을 고려한 부드러운 피드백"이 될 수 있지만, Codex는 그렇지 않다.

## 한 줄 요약

OpenAI Codex CLI를 Claude Code 내에서 래핑해 **코드 리뷰, 적대적 공격 테스트, 자유 질문**을 지원하는 "두 번째 두뇌" 스킬이다. "200 IQ 자폐 개발자"라는 별명처럼 감정 없이 논리적으로 코드의 약점을 찾아낸다.

## 프로젝트에 도입하기

```bash
/codex
```

**SKILL.md 파일 위치**: `~/.claude/skills/codex/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트에서 공지 작성 Server Action을 구현했다. Claude Code로 1차 리뷰를 마쳤지만, 팀 발표 전 한 번 더 외부 관점에서 검증하고 싶다.

### 시나리오 A: 코드 리뷰 모드

```
> codex review 스킬로 현재 브랜치 diff를 점검해 줘.
  통과/실패 판정도 포함해서 알려줘.
```

리뷰 대상 코드:

```ts
// app/actions/notice.ts
"use server";

export async function createNotice(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  // TODO: 입력 검증 추가 예정
  const result = await db.notices.insert({
    title,
    body,
    authorId: getCurrentUserId(),
    createdAt: new Date(),
  });

  revalidatePath("/notices");
  redirect(`/notices/${result.id}`);
}
```

Codex가 판정할 수 있는 문제들:

- `title`과 `body`에 대한 입력 검증 없음 → FAIL (XSS/빈 공지 가능)
- `getCurrentUserId()`가 인증되지 않은 사용자에서도 호출 가능한지 불명확 → FAIL
- `redirect()`가 `try-catch` 외부에 있어 DB 오류 시 처리 경로가 없음 → WARNING

### 시나리오 B: 적대적 공격 모드

```
> codex challenge 스킬로 notices API 라우트를 최대한 공격해 봐.
  어떤 방법으로 이 코드를 망가뜨릴 수 있는지 모두 찾아줘.
```

```ts
// app/api/notices/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const notices = await db.notices.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(notices);
}
```

Codex가 찾아낼 수 있는 공격 벡터:

- `page=-999999`나 `limit=99999`를 넣으면? → 음수 offset 또는 DB 과부하
- `page=abc`를 넣으면 `NaN`이 되어 Prisma 오류 발생 → 비정상 응답 또는 500
- `limit=0`이면 `take: 0` → 항상 빈 배열 반환, 무한 로딩 UI 버그 가능
- 인증 없이 모든 공지에 접근 가능 → 비공개 공지 노출 위험

### 시나리오 C: 기술 자문 모드

```
> codex consult: 공지에 "좋아요" 기능을 추가하려는데
  낙관적 업데이트(optimistic update)를 Next.js 15에서 어떻게 구현하는 게 최선이야?
```

후속 질문 (세션 연속성 활용):

```
> 방금 말한 useOptimistic 패턴을 우리 공지 게시판의
  createNotice Server Action에 어떻게 붙이면 돼?
```

## 학습 포인트 / 흔한 함정

- **Claude 리뷰와 Codex 리뷰는 상호 보완적이다**: Claude Code는 프로젝트 전체 컨텍스트를 알고 있어 "이 코드가 우리 아키텍처에 맞는가"를 잘 판단한다. 반면 Codex는 독립적으로 diff만 보므로 "이 코드 자체가 안전한가"를 다른 시각으로 본다. 두 리뷰를 모두 통과한 코드가 훨씬 안전하다.
- **Challenge 모드는 발표 전 필수**: 팀 프로젝트 발표나 해커톤 제출 직전에 "가장 나쁜 시나리오로 내 코드를 부숴봐"라고 요청하면 예상치 못한 버그를 미리 발견할 수 있다.
- **pass/fail 게이트를 CI에 통합하는 방향 고려**: 원본 스킬은 `codex review`를 ship 파이프라인의 블로킹 단계로 사용한다. GitHub Actions에서 `pnpm codex review`를 PR 체크로 추가하는 것을 목표로 삼자.
- **흔한 함정 — Codex CLI 설치 여부 확인**: 이 스킬은 OpenAI Codex CLI가 로컬에 설치되어 있어야 동작한다. `codex --version`으로 먼저 확인하고, 없다면 `npm install -g @openai/codex`로 설치해야 한다.
- **Next.js 15 관점**: Server Action에서 입력 검증이 빠진 경우, 인증 누락, `async/await` 오류 전파 패턴은 Codex Challenge 모드가 특히 잘 잡아낸다.

## 관련 리소스

- [review](./review.md) — Claude 기반 코드 리뷰 (Codex와 상호 보완)
- [requesting-code-review](./requesting-code-review.md) — 코드 리뷰 요청 방법
- [cso](./cso.md) — 보안 감사 (OWASP, STRIDE 위협 모델링)

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
