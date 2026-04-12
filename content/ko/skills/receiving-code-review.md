---
title: "코드 리뷰 수신 (Receiving Code Review)"
source: "~/.claude/skills/receiving-code-review/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 코드 리뷰 수신 (Receiving Code Review)

## 한 줄 요약

코드 리뷰 피드백을 수신했을 때, **무조건 수용하는 대신** 기술적 정확성과 프로젝트 맥락을 먼저 검증하고 반영 여부를 판단하는 스킬이다.

## 언제 사용하나요?

- PR에 대한 리뷰 코멘트가 달렸을 때, 바로 수정하기 전에 피드백 내용을 검증하고 싶을 때
- 리뷰어의 제안이 불명확하거나 기술적으로 의문스러울 때
- 여러 리뷰어가 서로 상충하는 의견을 줬을 때 어느 쪽을 따를지 정리하고 싶을 때
- "이 제안을 따르면 오히려 코드가 나빠질 것 같다"는 직관이 들 때, 그 판단을 체계화하고 싶을 때
- 팀 프로젝트에서 선배/교수님의 리뷰를 무조건 따르는 습관에서 벗어나 **기술적 근거 기반 대화**를 하고 싶을 때

## 핵심 개념

코드 리뷰 수신의 핵심 원칙은 **"수행적 동의(performative agreement)"가 아닌 "기술적 엄밀성(technical rigor)"**이다.

리뷰어가 권위자라도, 제안이 잘못될 수 있다. 반대로 리뷰어가 주니어라도 날카로운 지적을 할 수 있다. 피드백의 가치는 제안자의 지위가 아니라 **기술적 논거**에 달려 있다.

이 스킬은 피드백을 세 단계로 처리한다.

### 1단계: 피드백 분류

수신한 피드백을 아래 세 범주로 나눈다.

- **명확하게 옳은 것(Clear Wins)**: 이미 알고 있던 문제, 타입 오류, 규약 위반 등. 바로 반영한다.
- **논의가 필요한 것(Needs Discussion)**: 설계 철학 차이, 트레이드오프가 있는 제안, 프로젝트 맥락을 모르는 상태의 제안. 반영 전에 대화가 필요하다.
- **기술적으로 틀린 것(Technically Incorrect)**: 제안대로 하면 버그가 생기거나, 성능이 나빠지거나, 이미 의도된 패턴을 깨는 것. 정중하게 반박한다.

### 2단계: 검증

각 피드백에 대해 다음 질문으로 검증한다.

- "이 제안을 따르면 어떤 동작이 바뀌는가?"
- "변경이 모든 엣지 케이스에서 안전한가?"
- "이 제안이 전제하는 컨텍스트가 실제 코드베이스와 일치하는가?"
- "리뷰어가 최신 코드를 보고 있는가, 아니면 오래된 버전을 기반으로 제안하고 있는가?"

### 3단계: 응답

- 동의하면: 수정 후 "어떻게 반영했는지" 코멘트로 명시한다.
- 질문이 있으면: 구체적인 코드를 인용하며 무엇이 불명확한지 묻는다.
- 반박할 때: 감정 없이, 기술적 근거(테스트 결과, 공식 문서, 코드 레퍼런스)를 들어 설명한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판" 프로젝트에서 `NoticeCard` 컴포넌트 PR을 올렸더니, 두 가지 리뷰 코멘트가 달렸다.

**리뷰 코멘트 A (명확하게 옳은 것)**

```typescript
// 리뷰어가 지적한 코드: NoticeCard.tsx
// ❌ 현재 코드
interface Props {
  data: any; // ← 리뷰어: "any 쓰지 말고 타입 정의하세요"
}

// ✅ 반영 후
interface NoticeCardProps {
  data: {
    id: string;
    title: string;
    content: string;
    authorName: string;
    createdAt: Date;
    isPinned: boolean;
  };
}
```

응답 예시:
> 맞습니다. `any` 사용은 CLAUDE.md 규칙 위반이기도 합니다. `NoticeCardProps` 인터페이스로 교체했습니다.

---

**리뷰 코멘트 B (기술적으로 의문스러운 것)**

```typescript
// 리뷰어가 제안한 코드 변경
// ❌ 리뷰어 제안: "Server Component니까 async/await 직접 써도 돼요"
// 기존 코드 (Client Component, Zustand 상태 사용)
"use client";
export function NoticeCard({ data }: NoticeCardProps) {
  const { selectedId, setSelected } = useNoticeStore();
  return (
    <div onClick={() => setSelected(data.id)}>
      {data.title}
    </div>
  );
}
```

검증 과정:

```bash
# Claude Code 세션에서
> 이 컴포넌트는 Zustand 스토어를 쓰고 있어서 Client Component여야 해.
> "Server Component로 바꿔도 된다"는 제안이 기술적으로 맞는지 검증해 줘.
```

반박 코멘트 예시:
> 이 컴포넌트는 `useNoticeStore()`(Zustand)를 사용하고, 클릭 이벤트 핸들러가 있어서 `"use client"` 지시자가 필요합니다. Server Component로 전환하면 런타임 에러가 발생합니다. 선택 상태를 URL 파라미터로 옮기는 설계 변경이 먼저 필요한데, 이번 PR 범위 밖입니다. 다음 PR에서 논의할 수 있습니다.

## 학습 포인트

- **"감사합니다, 수정하겠습니다"가 항상 옳은 것은 아니다**: 대학생 팀 프로젝트에서 선배나 교수님의 리뷰를 반사적으로 수용하는 경향이 있다. 하지만 잘못된 제안을 반영하면 버그가 생기고, 그 버그의 책임은 코드를 쓴 사람에게 돌아온다.
- **반박은 무례함이 아니다**: 코드 근거와 공식 문서를 들어 정중하게 의견을 나누는 것은 협업의 핵심 기술이다. "제가 잘못 이해한 걸 수도 있는데, 이 부분에서 X 이유로 Y 동작이 예상됩니다" 형식이 효과적이다.
- **흔한 실수 — 오래된 맥락 기반 리뷰**: 리뷰어가 PR 이전 버전을 기반으로 제안하는 경우가 있다. 항상 "이 제안이 현재 코드 기반인지" 확인한다.
- **Next.js 15 팁**: App Router에서 Server Component와 Client Component 경계는 리뷰에서 자주 오해가 생기는 지점이다. `"use client"` 지시자 유무, 훅 사용 여부, 이벤트 핸들러 존재 여부를 근거로 명확히 설명할 수 있어야 한다.
- **피드백 로그 남기기**: PR 코멘트 스레드를 통해 어떤 피드백을 왜 반영했고, 왜 반영하지 않았는지 기록을 남기면 이후 코드 리뷰 문화가 좋아진다.

## 원본과의 차이

- 원본 스킬은 "performative agreement"와 "blind implementation"을 명시적으로 금지한다. 본 해설은 이 핵심 원칙을 세 단계 처리 프로세스(분류 → 검증 → 응답)로 구체화했다.
- 원본은 기술적 엄밀성을 강조하지만 구체적인 예제는 포함하지 않는다. 본 해설은 Next.js 15 + Zustand 맥락의 실제 대화 예제를 추가했다.
- 원본에는 없는 "반박 코멘트 작성법"을 대학생 협업 맥락에 맞게 추가했다.
- 원본의 "requires technical rigor and verification" 원칙은 "검증 4개 질문"으로 풀어서 설명했다.

> 원본: `~/.claude/skills/receiving-code-review/SKILL.md`
