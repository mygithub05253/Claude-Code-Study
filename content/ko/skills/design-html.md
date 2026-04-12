---
title: "HTML/CSS 디자인 최종화 (Design HTML)"
source: "~/.claude/skills/design-html/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# HTML/CSS 디자인 최종화 (Design HTML)

## 한 줄 요약

승인된 목업이나 계획 문서를 바탕으로 **텍스트가 실제로 reflow되고 레이아웃이 동적으로 동작하는 프로덕션 품질의 HTML/CSS**를 30KB 오버헤드, 외부 의존성 없이 생성하는 스킬이다.

## 언제 사용하나요?

- `/design-shotgun`으로 승인된 목업을 실제 HTML로 구현할 때
- `/plan-ceo-review`나 `/plan-design-review`로 검토된 계획을 코드로 옮길 때
- 설명만으로 UI 페이지를 만들어 달라는 요청을 받았을 때
- "이 디자인을 HTML로 바꿔 줘", "이 페이지를 구현해 줘", "이 디자인을 최종화해 줘" 같은 요청을 받았을 때
- 기존 디자인 작업 단계(계획 스킬) 이후 구현 단계로 넘어갈 때

## 핵심 개념

### 프로덕션 품질 HTML/CSS의 의미

단순히 "화면에 비슷하게 보이는" 정적 목업과 달리, Design HTML은 다음 특성을 보장한다.

1. **텍스트 reflow**: 컨테이너 너비가 변해도 텍스트가 자연스럽게 흐른다. `overflow: hidden`으로 잘라내거나 고정 높이로 박아 놓지 않는다.
2. **동적 높이 계산**: 콘텐츠 길이에 따라 컨테이너 높이가 자동으로 결정된다. 픽셀 하드코딩 없이 `min-height`, `auto`, flexbox 등을 활용한다.
3. **동적 레이아웃**: 그리드와 flexbox로 반응형 레이아웃을 구현한다. 특정 화면 크기에서만 깨지는 "마법의 숫자" 없음.

### 30KB, 외부 의존성 없음

원본 스킬은 Pretext라는 경량 CSS 프레임워크를 기반으로 한다. 30KB 이하의 오버헤드와 외부 CDN 의존성 없음을 원칙으로 하여, 어느 환경에서도 즉시 동작하는 HTML을 생성한다.

Next.js 15 환경에서는 이 철학을 Tailwind CSS의 **JIT(Just-In-Time) 컴파일** + **CSS Modules** 조합으로 구현한다. 실제로 사용하는 클래스만 번들에 포함되므로 유사한 결과를 달성한다.

### 스마트 API 라우팅 (Smart API Routing)

Design HTML은 입력된 디자인 유형에 따라 최적의 레이아웃 패턴을 자동으로 선택한다.

- 리스트/피드 → `grid` + `auto-rows`
- 폼 페이지 → `flex column` + `gap`
- 대시보드 → `grid` + 고정/유동 컬럼 혼합
- 마케팅 랜딩 → `section` 스택 + 히어로 레이아웃

## 실전 예제 (대학생 관점)

**상황**: `/design-shotgun`으로 동아리 공지 게시판의 공지 목록 페이지 목업을 승인받았다. 이제 실제 Next.js 15 컴포넌트로 최종 구현해야 한다. Design HTML 스킬을 사용해 완성도 높은 코드를 생성한다.

### 1단계 — 목업 기반 구현 요청

```bash
> design-html 스킬로 아래 목업을 Next.js 15 + Tailwind CSS 컴포넌트로 구현해 줘.
> - 공지 카드 리스트 (제목, 날짜, 미리보기 2줄)
> - 상단 필터 탭 (전체/긴급/일반)
> - 무한 스크롤 대신 페이지네이션
> - 모바일: 1열, 태블릿+: 2열
```

### 2단계 — 생성된 컴포넌트 예시

```tsx
// app/notices/page.tsx
// Design HTML: 동아리 공지 게시판 — 공지 목록 페이지
// 반응형 그리드, 텍스트 reflow 보장, 동적 카드 높이

import { NoticeCard } from '@/components/NoticeCard'
import { NoticeFilter } from '@/components/NoticeFilter'
import { Pagination } from '@/components/Pagination'
import { fetchNotices } from '@/lib/notices'

interface NoticesPageProps {
  searchParams: { page?: string; type?: string }
}

export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const page = Number(searchParams.page ?? '1')
  const type = searchParams.type ?? 'all'

  const { notices, totalPages } = await fetchNotices({ page, type })

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 헤더 */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            공지사항
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            동아리 최신 소식을 확인하세요
          </p>
        </header>

        {/* 필터 탭 */}
        <NoticeFilter currentType={type} />

        {/* 공지 그리드 — 반응형, 동적 높이 */}
        <section
          className="
            mt-4
            grid gap-3
            grid-cols-1
            sm:grid-cols-2
          "
          aria-label="공지 목록"
        >
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </section>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  )
}
```

```tsx
// components/NoticeCard.tsx
// 텍스트 reflow 보장: line-clamp만 사용, 고정 높이 없음
// 동적 높이: 카드 높이는 콘텐츠에 따라 자동 결정

import Link from 'next/link'
import { formatKSTDate } from '@/lib/date'
import type { Notice } from '@/types/notice'

interface NoticeCardProps {
  notice: Notice
}

export function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <Link href={`/notices/${notice.id}`}>
      <article
        className="
          group
          flex flex-col gap-2
          rounded-xl
          bg-white dark:bg-neutral-800
          p-4
          border border-neutral-100 dark:border-neutral-700
          transition-all duration-150
          hover:shadow-md hover:border-primary/30
          cursor-pointer
        "
      >
        {/* 긴급 배지 — 조건부 렌더링, 레이아웃 shift 없음 */}
        {notice.isUrgent && (
          <span className="self-start rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
            긴급
          </span>
        )}

        {/* 제목 — 2줄까지 표시, reflow 보장 */}
        <h2 className="
          text-base font-semibold
          text-neutral-900 dark:text-white
          line-clamp-2
          group-hover:text-primary transition-colors duration-150
        ">
          {notice.title}
        </h2>

        {/* 미리보기 — 2줄까지 표시 */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {notice.preview}
        </p>

        {/* 메타 정보 — 하단 고정 (flex grow로 밀어내기) */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-neutral-400">
            {formatKSTDate(notice.createdAt)}
          </span>
          <span className="text-xs text-neutral-400">
            {notice.authorName}
          </span>
        </div>
      </article>
    </Link>
  )
}
```

```tsx
// components/NoticeFilter.tsx
// 필터 탭 — URL 파라미터 기반 상태 관리 (Server Component 친화적)

'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const FILTER_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '긴급', value: 'urgent' },
  { label: '일반', value: 'normal' },
] as const

interface NoticeFilterProps {
  currentType: string
}

export function NoticeFilter({ currentType }: NoticeFilterProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <nav className="flex gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
      {FILTER_OPTIONS.map(({ label, value }) => {
        const params = new URLSearchParams(searchParams)
        params.set('type', value)
        params.delete('page') // 필터 변경 시 1페이지로 리셋

        const isActive = currentType === value

        return (
          <Link
            key={value}
            href={`${pathname}?${params.toString()}`}
            className={`
              flex-1 rounded-md py-1.5 text-center text-sm font-medium
              transition-all duration-150
              ${isActive
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }
            `}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
```

## 학습 포인트

- **`line-clamp` vs 고정 높이**: 카드 높이를 `h-40`처럼 픽셀로 고정하면 긴 제목이 잘린다. `line-clamp-2`로 줄 수만 제한하고 높이는 `auto`로 두는 것이 Design HTML의 핵심 원칙이다.
- **흔한 실수 — `overflow: hidden` 남용**: 레이아웃이 깨져 보이면 `overflow-hidden`으로 가리는 방법을 택하는 경우가 많다. 이는 접근성 문제와 내용 손실을 유발한다. 근본적인 레이아웃 구조를 수정해야 한다.
- **Next.js 15 팁 — Server Component 데이터 fetch**: `page.tsx`는 서버 컴포넌트로 유지하고, 상호작용이 필요한 Filter와 같은 컴포넌트만 `'use client'`로 분리한다. 이 패턴이 성능과 SEO 양쪽에 최적이다.
- **`mt-auto` 패턴**: flex 컨테이너 내에서 하단 요소를 항상 아래에 고정할 때 `mt-auto`를 사용하면 카드 높이가 달라도 날짜/작성자가 항상 같은 위치에 온다.
- **URL 파라미터 기반 상태**: 필터 상태를 `useState`로 관리하는 대신 URL searchParams로 관리하면, 뒤로 가기/북마크/공유 링크가 모두 정상 동작하고 서버 컴포넌트에서 초기 상태를 읽을 수 있다.

## 원본과의 차이

- 원본은 Pretext라는 gstack 전용 HTML/CSS 프레임워크를 기반으로 한다. 본 해설은 Next.js 15 + Tailwind CSS + TypeScript 환경으로 완전히 재구성했다.
- 원본의 "30KB 오버헤드, 외부 의존성 없음" 원칙을 Tailwind JIT 컴파일 + CSS Modules로 구현하는 방식을 설명했다.
- 원본의 "스마트 API 라우팅" 개념을 Next.js 15 서버 컴포넌트/클라이언트 컴포넌트 분리 패턴으로 연결해 설명했다.

> 원본: `~/.claude/skills/design-html/SKILL.md`
