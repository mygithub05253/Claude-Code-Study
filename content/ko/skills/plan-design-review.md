---
title: "디자인 관점 계획 검토 (Plan Design Review)"
source: "~/.claude/skills/plan-design-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["기획", "디자인", "UI", "UX", "계획검토"]
category: "기획/설계"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 디자인 관점 계획 검토 (Plan Design Review)

## 핵심 개념

### 0~10 디자인 차원 평가 시스템

Plan Design Review는 계획의 각 디자인 측면을 독립적인 차원으로 분류하고 0~10점으로 평가한다. 점수와 함께 "10점이 되려면 무엇이 필요한가"를 명확히 설명하고, 그 개선 사항을 계획에 반영한다.

평가하는 주요 디자인 차원:

| 차원 | 설명 | 흔한 문제 |
|------|------|----------|
| 정보 위계 (Information Hierarchy) | 사용자 시선이 자연스럽게 흐르는가 | 모든 텍스트가 같은 크기 |
| 색상 시스템 | 일관된 팔레트와 의미 있는 색 사용 | 임의적 색상 혼재 |
| 여백 시스템 | 8px 그리드 기반 일관된 spacing | p-3, p-4, p-5 혼재 |
| 상호작용 (Interaction) | 호버, 포커스, 활성 상태 명확성 | 피드백 없는 버튼 |
| 접근성 (Accessibility) | 색상 대비, 포커스 링, 스크린 리더 | WCAG AA 미충족 |
| 반응형 (Responsive) | 모바일-태블릿-데스크톱 레이아웃 전환 | 모바일 레이아웃 미설계 |
| 타이포그래피 | 폰트 크기, 줄 간격, 굵기 체계 | 시스템 폰트 혼재 |

### 대화형 검토 방식 (Interactive Mode)

Plan Design Review는 단방향 피드백 리포트가 아니라 **CEO Review, Eng Review와 같은 방식의 대화형 검토**다. Claude가 점수를 제시하면 사용자가 맥락을 추가하고, Claude가 그에 맞게 제안을 조정하는 식으로 진행된다. "예산이 없어서 폰트 구매가 어렵다"처럼 제약 조건을 알려주면 그 안에서 최선의 방안을 찾는다.

### Plan Design Review vs /design-review 차이

| 구분 | Plan Design Review | /design-review |
|------|-------------------|----------------|
| 대상 | 구현 전 설계 계획서 | 이미 운영 중인 사이트 |
| 결과물 | 수정된 계획서 | 수정된 소스 코드 + 커밋 |
| 시점 | 코딩 전 | 코딩 후 QA |
| 브라우저 필요 | 없음 | 있음 (스크린샷) |

## 한 줄 요약

디자이너의 눈으로 **구현 전 계획 단계에서** UI/UX 설계를 검토하여, 각 디자인 차원을 0~10점으로 평가하고 10점에 도달하기 위해 계획을 직접 수정하는 대화형 계획 검토 스킬이다.

## 프로젝트에 도입하기

```bash
/plan-design-review
```

**SKILL.md 파일 위치**: `~/.claude/skills/plan-design-review/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + Tailwind CSS로 "동아리 공지 게시판"을 만들기 전에 UI 설계 계획서를 작성했다. Plan Design Review로 구현 전에 설계 품질을 끌어올린다.

### 1단계 — 초기 UI 설계 계획서 (검토 전)

```markdown
# 동아리 공지 게시판 UI 계획

## 공지 목록 페이지
- 공지 카드 리스트
- 작성 버튼 (오른쪽 상단)
- 페이지네이션

## 공지 카드 컴포넌트
- 제목, 작성자, 날짜, 카테고리 뱃지
- 고정 공지는 배경색 변경

## 색상
- 메인: 파란색
- 뱃지: 회색, 빨간색, 초록색

## 폰트
- 시스템 기본 폰트 사용
```

### 2단계 — Plan Design Review 요청 및 결과

```bash
> plan-design-review 스킬로 아래 동아리 공지 게시판 UI 계획을 검토해 줘
```

```
[Plan Design Review] 검토 결과

정보 위계:     5/10
색상 시스템:   4/10
여백 시스템:   3/10
상호작용:      4/10
접근성:        5/10
반응형:        3/10
타이포그래피:  4/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
점수별 10점 도달 조건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[여백 시스템 3→10]
현재 여백 계획이 없음. 8px 그리드 시스템 정의 필요:
  xs: 4px  |  sm: 8px  |  md: 16px  |  lg: 24px  |  xl: 32px
  카드 내부 패딩: md(16px), 카드 간격: lg(24px), 섹션 간격: xl(32px)

[색상 시스템 4→10]
"파란색", "회색", "빨간색"은 너무 모호함. 구체적인 팔레트 필요:
  primary:   #2563EB (Tailwind blue-600)
  neutral:   #6B7280 (Tailwind gray-500)
  danger:    #DC2626 (Tailwind red-600)
  success:   #16A34A (Tailwind green-600)
  + 다크 모드 토큰 계획 추가 권장

[반응형 3→10]
모바일 레이아웃이 전혀 계획되지 않음. 공지 카드는 모바일에서:
  - 한 줄 전체 너비 사용
  - 날짜/카테고리를 제목 아래로 이동
  - 글씨 크기 최소 16px (모바일 가독성)
```

### 3단계 — 수정된 UI 계획 및 컴포넌트 설계

Design Review 결과를 반영한 컴포넌트 계획:

```typescript
// types/design-tokens.ts — Design Review에서 권고한 디자인 토큰 명세
export const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  colors: {
    primary: 'blue-600',    // #2563EB
    neutral: 'gray-500',   // #6B7280
    danger: 'red-600',     // #DC2626
    success: 'green-600',  // #16A34A
  },
} as const;
```

```tsx
// components/NoticeCard.tsx — Plan Design Review 기반 설계
interface NoticeCardProps {
  title: string;
  author: string;
  date: string;
  category: 'GENERAL' | 'IMPORTANT' | 'EVENT';
  isPinned: boolean;
  preview: string;
}

// 디자인 토큰 적용, 반응형 고려, 상호작용 상태 명확화
export function NoticeCard({ title, author, date, category, isPinned, preview }: NoticeCardProps) {
  return (
    // 여백 시스템: 카드 내부 md(p-4), 카드 간격은 부모의 space-y-6(lg)
    <article
      className={`
        rounded-xl border p-4
        ${isPinned
          ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
          : 'border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900'
        }
        shadow-none hover:shadow-md
        transition-shadow duration-150
        cursor-pointer
        focus-within:ring-2 focus-within:ring-blue-500
      `}
    >
      {/* 정보 위계: 제목 최우선 → 카테고리 → 메타 정보 → 미리보기 */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2">
          {title}
        </h2>
        <CategoryBadge category={category} />
      </div>

      {/* 타이포그래피: 미리보기는 neutral-500으로 계층화 */}
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
        {preview}
      </p>

      {/* 메타 정보: 가장 낮은 시각적 위계 */}
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
        <span>{author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={date}>{date}</time>
      </div>
    </article>
  );
}
```

## 학습 포인트 / 흔한 함정

- **구현 전 검토의 비용 절감 효과**: 코드를 100줄 쓰고 나서 "여백 시스템이 없다"는 걸 깨닫는 것보다, 계획 단계에서 설계 토큰을 정의하는 것이 수정 비용이 10배 이상 저렴하다. Plan Design Review는 이 사전 투자를 도와준다.
- **흔한 실수 — 색상에만 집중**: 디자인 검토를 "색상이 예쁜가?"로만 이해하는 경우가 많다. Plan Design Review는 여백, 타이포그래피, 접근성, 반응형까지 7개 차원을 균형 있게 다룬다.
- **흔한 실수 — 다크 모드를 나중으로 미루기**: Tailwind CSS를 사용하면 `dark:` 클래스로 다크 모드를 지원하기 쉽다. 설계 단계부터 `dark:` 색상 토큰을 정의하지 않으면 나중에 전체 컴포넌트를 다시 손봐야 한다.
- **Next.js 15 팁 — CSS 변수로 디자인 토큰 관리**: 디자인 토큰을 TypeScript 상수로만 관리하면 Tailwind의 JIT와 충돌할 수 있다. `globals.css`에 CSS 변수로 정의하고, `tailwind.config.ts`에서 참조하는 방식이 Next.js 15에서 권장된다.
- **`/design-review`와의 구분**: Plan Design Review는 구현 전 설계 검토, `/design-review`는 구현 후 시각적 QA다. 두 스킬 모두 사용하면 설계-구현-검증의 완전한 디자인 품질 루프를 완성할 수 있다.

## 관련 리소스

- [plan-ceo-review](./plan-ceo-review.md) — CEO 관점 계획 검토
- [plan-eng-review](./plan-eng-review.md) — 엔지니어링 관점 계획 검토
- [design-review](./design-review.md) — 구현 후 시각적 QA

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
