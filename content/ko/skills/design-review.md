---
title: "디자인 시각 품질 검수 (Design Review)"
source: "~/.claude/skills/design-review/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["design-review", "UI 검수", "AI 슬롭", "여백", "정보 위계", "시각 품질"]
category: "디자인"
---

# 디자인 시각 품질 검수 (Design Review)

## 핵심 개념

### "AI 슬롭(AI Slop)" 패턴

AI가 생성한 UI 코드에는 기술적으로는 동작하지만 디자이너 눈에는 어색해 보이는 패턴이 반복적으로 등장한다. 대표적인 예시는 다음과 같다.

- 모든 곳에 `rounded-lg` — 버튼, 입력창, 카드, 심지어 표까지 똑같은 모서리 반경
- 일관성 없는 여백 — `p-3` 쓰다가 `p-4`, `p-5`가 뒤섞임
- 텍스트 색상 일관성 없음 — `text-gray-500`, `text-gray-600`, `text-neutral-500`이 혼재
- 그림자 과다 사용 — `shadow-sm`부터 `shadow-2xl`까지 이유 없이 혼재
- 정보 위계 부재 — 제목과 본문의 크기 차이가 없어 시선이 어디로 가야 할지 모름

### 언제 사용하나요?

- "디자인 감사해 줘", "시각적으로 이상한 부분 찾아 줘", "디자인 폴리시해 줘" 같은 요청을 받았을 때
- 개발 완료 후 "완성도 높게 다듬기(polish)" 단계에서
- AI가 생성한 UI 코드를 사람 디자이너 수준으로 끌어올리고 싶을 때
- 팀원이 "왜 이게 어색해 보이지?"라는 피드백을 주는데 무엇이 문제인지 모를 때
- 배포 직전 최종 시각 품질 검수가 필요할 때

구현 전 디자인 리뷰(설계 단계)가 필요하다면 `/plan-design-review`를 사용한다. Design Review는 **이미 구현된 사이트**에 대한 QA다.

### 반복적 수정 루프 (Iterative Fix Loop)

Design Review는 단순히 문제를 나열하는 것이 아니라 **발견 → 수정 → 스크린샷 재촬영 → 검증**을 반복한다.

1. Browse 데몬으로 현재 상태 스크린샷 캡처
2. 시각적 문제 목록 작성 (우선순위순)
3. 가장 영향이 큰 문제부터 소스 코드 수정
4. 수정 후 스크린샷 재촬영, Before/After 비교
5. 각 수정을 **원자적 커밋(atomic commit)**으로 저장
6. 모든 문제가 해소될 때까지 반복

### Before/After 스크린샷 비교

각 수정 전후에 스크린샷을 찍어 나란히 표시함으로써 수정이 실제로 시각적 개선을 가져왔는지 확인한다. 이 과정이 없으면 수정이 오히려 새 문제를 만들었는지 알 수 없다.

## 한 줄 요약

디자이너의 눈으로 운영 중인 사이트를 감사하여 **시각적 불일치, 여백 문제, 정보 위계 오류, AI 슬롭 패턴, 느린 인터랙션**을 발견하고 소스 코드를 직접 수정한 뒤 커밋까지 수행하는 반복적 QA 스킬이다.

## 프로젝트에 도입하기

```bash
/design-review
```

**SKILL.md 파일 위치**: `~/.claude/skills/design-review/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Claude Code가 "동아리 공지 게시판" MVP를 구현해 줬는데, 전반적으로 "뭔가 어색하다"는 피드백이 들어왔다. Design Review로 문제를 체계적으로 발견하고 수정한다.

### 1단계 — Design Review 실행

```bash
> design-review 스킬로 http://localhost:3000 의 시각적 품질을 감사해 줘
```

### 2단계 — 감사 리포트 예시

```
[Design Review] 감사 완료 — 12개 문제 발견

우선순위 HIGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [정보 위계 없음] /notices — 제목(text-base)과 본문(text-sm)의 크기 차이가 작아
   시선이 흐름을 잡지 못함. 제목을 text-lg + font-semibold로 강조 필요.

2. [여백 불일치] 카드 내부 패딩이 p-3, p-4, p-5 혼재.
   DESIGN.md 기준 md(16px = p-4) 통일 필요.

3. [AI 슬롭] rounded-lg가 버튼/입력창/카드/뱃지 모두에 동일 적용.
   버튼은 rounded-full, 카드는 rounded-xl, 입력창은 rounded-lg로 차별화 필요.

우선순위 MEDIUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. [느린 인터랙션] 호버 전환이 duration-300으로 너무 느림. 150ms 권장.

5. [그림자 혼재] shadow-sm, shadow-md, shadow-lg가 규칙 없이 혼재.
   카드 기본: shadow-none, 호버: shadow-md 로 통일 필요.

우선순위 LOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6~12. [색상 일관성] text-gray-* 와 text-neutral-* 혼재 (8개소)
```

### 3단계 — 원자적 수정 커밋

Claude는 문제를 하나씩 수정하며 각각 커밋한다.

```bash
# fix 1: 정보 위계 수정
# Before
<h2 className="text-base">공지 제목</h2>
# After
<h2 className="text-lg font-semibold">공지 제목</h2>
# → git commit "fix: 공지 카드 제목 정보 위계 수정 (text-base → text-lg)"

# fix 2: 카드 패딩 통일
# Before: p-3, p-4, p-5 혼재
# After: 모두 p-4 통일
# → git commit "fix: 공지 카드 내부 패딩 p-4 통일"
```

### 4단계 — Before/After 확인

```
[Design Review] fix 1 검증 — Before/After 스크린샷 비교
Before: 제목과 본문이 거의 같은 크기, 시선 분산
After:  제목이 명확히 크고 굵어 시선이 자연스럽게 유도됨 ✓

[Design Review] fix 3 검증 — rounded 차별화
Before: 모든 요소가 rounded-lg로 단조로움
After:  버튼(pill), 카드(xl), 뱃지(full)로 각각 특성에 맞게 조정됨 ✓
```

### 수정 전후 코드 비교 예시

```tsx
// NoticeCard.tsx — Design Review 수정 전
<article className="rounded-lg bg-white p-3 shadow-md hover:shadow-lg transition-all duration-300">
  <h2 className="text-base text-gray-700">공지 제목</h2>
  <p className="text-sm text-gray-500">미리보기...</p>
</article>

// NoticeCard.tsx — Design Review 수정 후
<article className="
  rounded-xl                          // 카드는 xl
  bg-white dark:bg-neutral-800
  p-4                                 // md 여백 통일
  border border-neutral-100 dark:border-neutral-700
  shadow-none hover:shadow-md         // 기본 flat, 호버에만 그림자
  transition-shadow duration-150      // 빠른 전환 (150ms)
  cursor-pointer
">
  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
    공지 제목
  </h2>
  <p className="text-sm text-neutral-500 dark:text-neutral-400">
    미리보기...
  </p>
</article>
```

## 학습 포인트 / 흔한 함정

- **"동작한다 != 좋아 보인다"**: 기능 구현 후 "일단 됩니다"와 "사용하기 좋습니다"는 전혀 다른 수준이다. Design Review는 그 갭을 메운다.
- **흔한 실수 — AI 슬롭 방치**: Claude나 GitHub Copilot이 생성한 UI 코드를 그대로 사용하면 앞서 설명한 AI 슬롭 패턴이 반드시 남는다. 자동 생성 코드는 항상 Design Review로 한 번 더 검수해야 한다.
- **원자적 커밋의 중요성**: 한 번에 모든 것을 바꾸면 어떤 수정이 어떤 개선을 가져왔는지 추적이 불가능하다. 하나의 문제 = 하나의 커밋 원칙을 지키면 수정 이력이 명확해진다.
- **Next.js 15 팁 — 다크 모드 검수**: Design Review는 라이트 모드만 아니라 다크 모드(`dark:` 클래스)도 반드시 감사 대상에 포함해야 한다. 라이트에서 보기 좋아도 다크에서 색상 대비가 부족한 경우가 많다.
- **`/plan-design-review`와의 구분**: Design Review는 "이미 완성된 UI를 고친다". `/plan-design-review`는 "구현 전에 디자인 계획을 검토한다". 두 스킬은 보완 관계이며 함께 사용하면 효과가 극대화된다.

## 관련 리소스

- [design-consultation](./design-consultation.md) — 디자인 시스템 수립 (DESIGN.md 생성)
- [design-html](./design-html.md) — 디자인 구현 (Design Review의 전 단계)
- [browse](./browse.md) — 스크린샷 및 레이아웃 확인 (Design Review 내부에서 사용)

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
