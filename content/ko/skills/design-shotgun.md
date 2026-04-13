---
title: "디자인 다중 변형 탐색 (Design Shotgun)"
source: "~/.claude/skills/design-shotgun/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["design-shotgun", "디자인 탐색", "변형", "UI", "Tailwind"]
category: "디자인"
---

# 디자인 다중 변형 탐색 (Design Shotgun)

## 핵심 개념

### 샷건(Shotgun) 방식이란?

"샷건 접근법"은 단일 해결책을 깊게 파는 대신, 여러 방향을 동시에 넓게 쏘아 가장 공명하는 방향을 찾는 전략이다. 디자인 탐색에 이를 적용하면 다음과 같은 이점이 있다.

- 첫 번째 아이디어에 갇히지 않는다 (고착화 방지)
- "좋은 디자인"을 언어로 설명하기 어려운 경우에도 보고 고를 수 있다
- 변형들 사이의 트레이드오프를 시각적으로 비교할 수 있다

### 언제 사용하나요?

- "이 UI 어떻게 생겼으면 좋겠어? 몇 가지 보여 줘" 같이 시각적 방향을 아직 정하지 못했을 때
- 와이어프레임은 있는데 실제 디자인이 마음에 들지 않아 다시 탐색하고 싶을 때
- 팀원이나 교수님에게 "이런 느낌도 있고 저런 느낌도 있어요"라고 옵션을 제시해야 할 때
- 신기능 UI를 기획하면서 구현 전에 빠르게 시각적 초안을 확인하고 싶을 때
- "design variants", "explore designs", "visual brainstorm" 같은 키워드로 요청할 때

Claude는 사용자가 UI 기능을 설명하는데 아직 어떻게 생겼으면 좋겠는지 말하지 않았을 때 이 스킬을 **능동적으로 제안**한다.

### 스킬 실행 흐름

1. **변형 생성**: Claude가 동일한 UI 요소에 대해 스타일·레이아웃·인터랙션이 다른 여러 변형(보통 3~5개)을 생성한다.
2. **비교 보드**: 생성된 변형들을 나란히 볼 수 있는 비교 뷰를 제시한다.
3. **구조화된 피드백 수집**: 단순 "마음에 드냐 아니냐"가 아니라 색상, 레이아웃, 타이포그래피, 인터랙션 등 차원별로 피드백을 수집한다.
4. **반복 개선**: 피드백을 반영해 선택된 방향으로 수렴한다.

### design-html 스킬과의 관계

`design-html` 스킬이 단일 디자인을 HTML로 구체화하는 도구라면, `design-shotgun`은 그 전 단계에서 "어떤 디자인으로 갈지" 방향을 탐색하는 도구다. 일반적인 흐름은 다음과 같다.

```
design-shotgun → 방향 선택 → design-html → 구현
```

## 한 줄 요약

하나의 UI 요소에 대해 **여러 디자인 변형을 동시에 생성**하고 비교 보드를 열어 구조화된 피드백을 수집한 뒤 반복 개선하는 탐색 스킬이다. "아직 어떤 디자인인지 모르겠다"는 상태에서 출발해 방향을 빠르게 잡아준다.

## 프로젝트에 도입하기

```bash
/design-shotgun
```

**SKILL.md 파일 위치**: `~/.claude/skills/design-shotgun/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 Next.js 15 + TypeScript 프로젝트에서 공지 카드(Notice Card) 컴포넌트를 새로 만들어야 한다. 어떤 스타일로 가야 할지 감이 없어서 여러 변형을 먼저 탐색하고 싶다.

### 1단계: 디자인 변형 요청

```
> 동아리 공지 게시판의 공지 카드 컴포넌트 디자인을 3가지 다른 스타일로 보여 줘.
  - 정보: 제목, 작성자, 날짜, 조회수, 중요 공지 뱃지
  - 스타일 방향: 깔끔한 대학교 동아리 앱 느낌
```

Claude가 생성하는 3가지 변형의 예시:

**변형 A — Minimal Card (미니멀 카드)**
```tsx
// 변형 A: 테두리 없는 간결한 목록형
function NoticeCardA({ notice }: { notice: Notice }) {
  return (
    <div className="py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {notice.isPinned && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            중요
          </span>
        )}
        <h3 className="font-medium text-gray-900 text-sm">{notice.title}</h3>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>{notice.author}</span>
        <span>{notice.createdAt}</span>
        <span>조회 {notice.viewCount}</span>
      </div>
    </div>
  );
}
```

**변형 B — Elevated Card (입체형 카드)**
```tsx
// 변형 B: 그림자 있는 카드 그리드
function NoticeCardB({ notice }: { notice: Notice }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {notice.isPinned && (
        <div className="flex items-center gap-1.5 text-amber-600 mb-3">
          <PinIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">중요 공지</span>
        </div>
      )}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {notice.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Avatar size="xs" name={notice.author} />
          <span>{notice.author}</span>
        </div>
        <span>{notice.createdAt}</span>
      </div>
    </div>
  );
}
```

**변형 C — Colorful Tag (색상 태그형)**
```tsx
// 변형 C: 카테고리 색상 구분 강조
function NoticeCardC({ notice }: { notice: Notice }) {
  const categoryColor = {
    general: "bg-gray-100 text-gray-700",
    event: "bg-purple-100 text-purple-700",
    urgent: "bg-red-100 text-red-700",
  }[notice.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="flex gap-3 py-3 border-b border-gray-50">
      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full h-fit ${categoryColor}`}>
        {notice.categoryLabel}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{notice.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {notice.author} · {notice.createdAt}
        </p>
      </div>
    </div>
  );
}
```

### 2단계: 구조화된 피드백 수집

Claude가 제시하는 피드백 질문:

```
다음 항목별로 선호도를 알려 주세요:
1. 레이아웃: A(목록형) / B(카드 그리드) / C(인라인 태그형)
2. 밀도: 정보를 빽빽하게 / 여유 있게
3. 중요 공지 강조: 색상 뱃지 / 핀 아이콘 / 색상 구분
4. 전반적인 톤: 깔끔 미니멀 / 입체감 있게 / 컬러풀하게
```

### 3단계: 방향 수렴 및 반복

```
> B의 카드 형태를 기본으로, A의 미니멀한 타이포그래피 스타일을 섞어서 다시 보여 줘.
  중요 공지는 C처럼 색상으로 구분하되 과하지 않게.
```

## 학습 포인트 / 흔한 함정

- **"완벽한 디자인을 처음부터"는 시간 낭비다**: 디자인 샷건 접근법은 "최소한의 시간으로 방향을 잡는" 전략이다. 고민하는 시간보다 여러 변형을 보고 고르는 시간이 훨씬 짧다.
- **팀 프레젠테이션에서 활용하기**: 팀원에게 "A안과 B안 중 어느 게 좋아요?"라고 물으면 훨씬 생산적인 피드백을 받을 수 있다. 막연히 "UI 어떻게 할까요?"라고 묻는 것보다 구체적인 선택지가 있는 편이 효과적이다.
- **Tailwind CSS 변형 탐색에 적합**: 클래스 기반 스타일링인 Tailwind는 같은 컴포넌트를 클래스 조합만 바꿔 빠르게 변형을 만들 수 있다. Design Shotgun은 이 특성을 최대한 활용한다.
- **흔한 함정 — 변형이 너무 비슷한 경우**: 3개 변형이 사실상 같은 레이아웃에 색상만 다르면 탐색의 의미가 없다. 처음에는 의도적으로 레이아웃 방향(목록형 vs 카드형), 정보 밀도(간결 vs 상세), 강조 방식(색상 vs 크기 vs 위치)을 다르게 설정해 충분히 차별화된 변형을 요청하자.
- **Next.js 15 팁**: Server Component에서는 CSS-in-JS(styled-components 등) 대신 Tailwind나 CSS Module을 쓰는 것이 서버 렌더링과 잘 맞는다. Design Shotgun으로 탐색한 변형을 구현할 때 이 점을 고려하자.

## 관련 리소스

- [design-html](./design-html.md) — 선택된 디자인을 HTML로 최종 구현 (Shotgun 이후 단계)
- [design-consultation](./design-consultation.md) — 디자인 시스템 전반 수립
- [design-review](./design-review.md) — 완성된 사이트 시각적 품질 검수

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
