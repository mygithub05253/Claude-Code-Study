---
title: "디자인 시스템 컨설팅 (Design Consultation)"
source: "~/.claude/skills/design-consultation/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 디자인 시스템 컨설팅 (Design Consultation)

## 한 줄 요약

제품을 이해하고 디자인 환경을 조사한 뒤, **색상·타이포그래피·레이아웃·여백·모션을 포함한 완전한 디자인 시스템을 제안하고 `DESIGN.md`를 프로젝트 디자인 단일 진실 공급원(SSOT)으로 생성**하는 스킬이다.

## 언제 사용하나요?

- 새 프로젝트를 시작할 때 기존 `DESIGN.md`나 디자인 시스템이 없는 경우
- "디자인 시스템을 만들어 줘", "브랜드 가이드라인이 필요해" 같은 요청을 받았을 때
- 프론트엔드 개발 전에 시각적 언어(visual language)를 미리 확정하고 싶을 때
- Tailwind CSS의 `tailwind.config.ts`에 반영할 색상 토큰과 폰트 스케일을 체계적으로 정의하고 싶을 때
- 팀원들이 "어떤 색을 써야 해?", "버튼 크기가 몇 px이야?" 같은 질문을 반복하고 있을 때

기존 사이트가 있고 현재 디자인 시스템을 **역추론**해야 한다면 `/plan-design-review`를 대신 사용한다.

## 핵심 개념

### 디자인 시스템의 구성 요소

Design Consultation 스킬이 생성하는 디자인 시스템은 다음 6가지 영역을 포함한다.

1. **미학(Aesthetic)**: 브랜드 성격 — 모던/미니멀, 따뜻한/친근한, 전문적/신뢰감 등
2. **타이포그래피(Typography)**: 폰트 패밀리, 크기 스케일(xs~5xl), 행간, 자간
3. **색상(Color)**: Primary / Secondary / Neutral / Semantic(success, warning, error, info) 팔레트와 다크 모드 토큰
4. **레이아웃(Layout)**: 그리드 시스템, 최대 너비, 반응형 브레이크포인트
5. **여백(Spacing)**: 4px 기반 spacing scale, 컴포넌트 내부/외부 여백 규칙
6. **모션(Motion)**: 전환 지속 시간, 이징 곡선, 애니메이션 원칙

### DESIGN.md — 디자인 SSOT

스킬 실행 결과물은 프로젝트 루트의 `DESIGN.md` 파일이다. 이 파일은 다음 역할을 한다.

- 팀 내 디자인 결정의 단일 진실 공급원(Single Source of Truth)
- `tailwind.config.ts` 커스터마이징의 근거 문서
- 신규 팀원 온보딩 시 "우리 UI는 이렇게 생겼다"를 1분 안에 전달하는 참조 문서
- Claude Code에게 UI 작업을 지시할 때 "DESIGN.md를 참고해서 만들어 줘"라고 하면 일관된 결과물이 나온다

### 폰트·색상 미리보기 페이지

스킬은 `DESIGN.md` 외에도 `/design-preview` 경로에 렌더링 가능한 HTML 미리보기 페이지를 생성해 실제 폰트와 색상 조합을 시각적으로 확인할 수 있게 한다.

## 실전 예제 (대학생 관점)

**상황**: "동아리 공지 게시판"을 Next.js 15로 처음 구축한다. 디자인은 "대학 동아리 느낌 — 친근하고 깔끔하며, 모바일 우선"으로 잡고 싶다. `DESIGN.md`와 Tailwind 설정을 함께 만들자.

### 1단계 — Design Consultation 시작

```bash
> design-consultation 스킬로 동아리 공지 게시판 디자인 시스템을 만들어 줘.
> 느낌: 친근하고 깔끔한 대학 동아리 분위기, 모바일 우선, 다크 모드 지원
```

### 2단계 — 생성된 DESIGN.md 예시

```markdown
# DESIGN.md — 동아리 공지 게시판 디자인 시스템

## 미학
- 성격: Friendly & Clean (친근하고 깔끔한)
- 영감: 카카오 오픈채팅 + Notion 사이드바
- 원칙: 정보 위계 명확, 여백으로 숨 쉬기, 터치 친화적

## 타이포그래피
- 헤딩: Pretendard (한국어 최적화)
- 본문: Pretendard Regular
- 코드: JetBrains Mono
- 스케일: 12/14/16/18/20/24/30/36/48px

## 색상
### Light 모드
- Primary: #3B82F6 (blue-500) — 주요 액션, 링크
- Primary Dark: #1D4ED8 (blue-700) — 호버
- Neutral-50: #F8FAFC — 배경
- Neutral-900: #0F172A — 기본 텍스트

### Dark 모드
- Primary: #60A5FA (blue-400)
- Background: #0F172A

### Semantic
- Success: #22C55E, Warning: #F59E0B, Error: #EF4444

## 여백 (4px 기반)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

## 레이아웃
- 최대 너비: 768px (모바일 중심)
- 그리드: 4컬럼(모바일) / 8컬럼(태블릿 이상)
- 브레이크포인트: sm 640px / md 768px / lg 1024px

## 모션
- 기본 전환: 150ms ease-in-out
- 페이지 전환: 200ms ease-out
- 원칙: 기능적 모션만 사용, 과도한 애니메이션 지양
```

### 3단계 — Tailwind 설정에 반영

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        // DESIGN.md의 색상 토큰을 그대로 반영
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // 4px 기반 커스텀 스케일 (기본 Tailwind와 병행)
        'xs': '4px',
        'sm': '8px',
      },
    },
  },
}

export default config
```

### 4단계 — 컴포넌트에서 DESIGN.md 참조

```tsx
// components/NoticeCard.tsx
// DESIGN.md: Primary 색상, md 여백, 150ms 전환 적용
export function NoticeCard({ title, date, preview }: NoticeCardProps) {
  return (
    <article className="
      rounded-xl
      bg-white dark:bg-neutral-800
      p-4                      // md 여백 (16px)
      transition-shadow duration-150  // 150ms 전환
      hover:shadow-md
      cursor-pointer
    ">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h2>
      <time className="text-sm text-neutral-500">{date}</time>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
        {preview}
      </p>
    </article>
  )
}
```

## 학습 포인트

- **디자인 시스템 없이 시작하면 나중에 두 배 고생한다**: UI를 임시방편으로 만들다 보면 버튼 색이 7가지, 폰트 크기가 11가지가 된다. DESIGN.md 하나가 이 혼돈을 막는다.
- **흔한 실수 — Tailwind 기본값에만 의존**: `text-blue-500` 같은 하드코딩 색상을 컴포넌트에 직접 쓰면 나중에 색상 테마를 바꿀 때 전부 수작업으로 교체해야 한다. `tailwind.config.ts`에 토큰을 정의하고 `text-primary`처럼 의미적 이름을 쓰는 것이 옳다.
- **한국어 폰트 고려**: Pretendard는 한국어 웹 프로젝트에서 사실상 표준이다. `next/font`로 불러오면 FOUT 없이 최적화된다.
- **DESIGN.md는 살아있는 문서다**: 스킬 실행 후 생성된 `DESIGN.md`는 출발점이다. 실제 디자인을 보면서 계속 수정해 나가는 것이 정상적인 과정이다.
- **`/plan-design-review`와의 구분**: 이미 UI가 있는 상황에서 "현재 디자인 시스템이 무엇인지"를 분석할 때는 `/plan-design-review`를 사용한다. Design Consultation은 0에서 1을 만드는 작업이다.

## 원본과의 차이

- 원본은 gstack의 Pretext HTML/CSS 프레임워크와 연동된다. 본 해설은 Next.js 15 + Tailwind CSS 4 환경으로 재구성했다.
- 원본에서 생성하는 "폰트·색상 미리보기 페이지"는 Pretext 컴포넌트 기반이다. 본 해설은 그 개념을 Tailwind 설정 파일과 Next.js 컴포넌트로 대체했다.
- 한국어 프로젝트에서 중요한 **Pretendard 폰트 적용** 방법을 추가로 설명했다.

> 원본: `~/.claude/skills/design-consultation/SKILL.md`
