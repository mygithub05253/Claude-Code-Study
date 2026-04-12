---
title: "웹 앱 QA 테스트 + 자동 수정 (QA)"
source: "~/.claude/skills/qa/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 웹 앱 QA 테스트 + 자동 수정 (QA)

## 한 줄 요약

웹 애플리케이션을 체계적으로 테스트하고, 발견된 버그를 소스 코드에서 **원자적(atomic) 커밋으로 하나씩 수정**하면서 재검증까지 반복하는, 테스트-픽스-커밋 자동화 스킬이다.

## 언제 사용하나요?

- 기능 구현을 마치고 배포 전 최종 품질 점검이 필요할 때
- "뭔가 깨진 것 같은데 어디가 문제인지 모를 때" 전체 QA를 한 번에 돌리고 싶을 때
- PR 생성 전에 자동으로 버그를 찾고 수정한 뒤 깔끔한 커밋 히스토리를 만들고 싶을 때
- 리팩토링 이후 기존 기능이 망가지지 않았는지 확인할 때
- 데모/발표 전날 밤, 앱의 현재 상태를 빠르게 점검하고 싶을 때

## 핵심 개념

### 3단계 티어

QA 스킬은 검사 깊이에 따라 세 가지 티어로 나뉜다. 상황에 맞는 티어를 선택하면 시간을 절약할 수 있다.

| 티어 | 커버리지 | 사용 상황 |
|------|----------|-----------|
| **Quick** | 치명적(Critical) + 높은(High) 심각도 버그만 | 빠른 스모크 테스트, 핫픽스 직후 |
| **Standard** | Quick + 중간(Medium) 심각도 버그 | 일반적인 기능 개발 완료 후 |
| **Exhaustive** | Standard + 경미한(Cosmetic) 문제 | 배포 전 최종 검수, 릴리즈 준비 |

### 테스트-픽스-커밋 루프

QA 스킬의 핵심은 단순히 버그 목록을 나열하는 것이 아니라, **버그 하나를 발견 → 수정 → 커밋 → 재검증**하는 루프를 자동으로 반복한다는 점이다.

```
QA 테스트 실행
  ├─ 버그 발견 → 심각도 분류
  ├─ 선택된 티어의 버그 수정 (소스 코드 직접 변경)
  ├─ 원자적 커밋 ("fix: [버그 설명]")
  ├─ 재검증 (해당 버그 해결 확인)
  └─ 다음 버그로 반복
```

### 건강 점수(Health Score)

QA 실행 전후로 앱의 건강 점수를 계산해 "Before: 62% → After: 94%" 형태로 개선 정도를 정량화한다. 교수님께 제출하거나 팀에 공유할 때 설득력 있는 근거가 된다.

### 리포트 전용 모드

버그 수정 없이 보고서만 원한다면 `/qa-only` 모드를 사용한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트의 초기 기능 구현을 마쳤다. 공지 목록 조회, 공지 작성, 로그인/로그아웃이 된다고 생각하지만 제대로 테스트해 본 적이 없다. 발표가 3일 뒤다.

### Standard QA 실행

```bash
# Claude Code 세션에서
> QA 스킬로 Standard 티어 테스트해 줘.
# 또는
> qa standard
> test this site
> find bugs and fix them
```

### QA 진행 중 Claude의 작업 예시

**1단계: 테스트 항목 체크**

```
[QA - Standard] 동아리 공지 게시판 테스트 시작

✅ 공지 목록 페이지 로드 (200 OK)
✅ 미로그인 상태 공지 읽기 가능
❌ 공지 작성 폼 - 제목 미입력 시 서버 오류 (500) 발생
❌ 로그인 후 리다이렉트 URL이 /notices가 아닌 / 로 이동
⚠️ 공지 목록 페이지네이션 - 2페이지 이후 공지 누락 (Medium)
```

**2단계: 버그 수정 + 원자적 커밋**

```ts
// 수정 전: app/notices/new/route.ts
export async function POST(request: Request) {
  const { title, content } = await request.json()
  // 유효성 검사 없음 → 500 발생
  await supabase.from('notices').insert({ title, content })
}

// 수정 후: 유효성 검사 추가
export async function POST(request: Request) {
  const { title, content } = await request.json()

  // [QA 수정] 제목 필수 검증
  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: '제목을 입력해 주세요.' },
      { status: 400 }
    )
  }

  await supabase.from('notices').insert({ title: title.trim(), content })
  return NextResponse.json({ success: true })
}
```

```bash
# 자동 생성되는 커밋
git commit -m "fix: 공지 작성 시 제목 미입력 500 오류 수정 — 유효성 검사 추가"
```

**3단계: 최종 리포트**

```
[QA 완료] 건강 점수: Before 61% → After 89%

수정 완료 (3개):
  - fix: 제목 미입력 500 오류 → 400 + 에러 메시지
  - fix: 로그인 리다이렉트 URL /notices로 수정
  - fix: 페이지네이션 offset 계산 버그 수정

잔여 (Exhaustive 티어, 현재 선택 안 함):
  - [Cosmetic] 공지 카드 모바일 패딩 불일치
  - [Cosmetic] 다크 모드 미지원 버튼 색상

배포 준비 상태: ✅ Standard 기준 통과
```

## 학습 포인트

- **"수동 테스트 체크리스트"를 대체**: QA 스킬 전에는 직접 브라우저를 열고 하나씩 클릭해야 했다. QA 스킬은 이 과정을 구조화하고 자동화한다.
- **원자적 커밋의 중요성**: 버그 하나 = 커밋 하나 규칙이 지켜지면, 나중에 "어떤 커밋이 어떤 버그를 고쳤는가"를 추적하기가 쉬워진다. `git bisect`로 회귀를 찾을 때도 유리하다.
- **티어 선택 전략**: 시간이 없을 때는 Quick 티어로 치명적 버그만 먼저 잡고, 여유가 생기면 Exhaustive 티어로 마무리하는 방식이 효율적이다.
- **흔한 실수**: "다 만들고 나서 한 번에 QA"는 늦다. 기능 단위로 Standard 티어를 주기적으로 돌리는 것이 전체 시간을 아낀다.
- **Next.js 15 관점 팁**: Server Actions의 에러 처리, `loading.tsx`/`error.tsx`의 존재 여부, 캐시 무효화(`revalidatePath`) 누락 같은 Next.js 특유의 버그 패턴은 QA 스킬이 잘 잡아내는 항목들이다. Exhaustive 티어에서는 `<Suspense>` 경계 누락, hydration mismatch 같은 경미한 문제도 검출된다.

## 원본과의 차이

- 원본은 "gstack" 환경을 전제하며, 실제 브라우저 자동화(Playwright 등)와 연동될 수 있다고 암시한다. 본 해설은 Claude Code의 코드 분석 기반 QA를 중심으로 설명했다.
- 원본에서 `/qa-only` 모드는 별도 스킬로 언급된다. 본 해설에서는 동일 스킬의 옵션으로 소개했다.
- 건강 점수 계산 방식의 구체적인 공식은 원본에서도 명시되지 않는다. Claude가 발견된 버그의 수와 심각도를 기반으로 휴리스틱하게 산출한다.
- 대학생 맥락에서 "발표 전날 밤" 시나리오를 추가했다. Quick 티어가 이 상황에서 특히 유용하다는 점을 강조했다.

> 원본: `~/.claude/skills/qa/SKILL.md`
