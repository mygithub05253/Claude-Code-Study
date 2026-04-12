---
title: "CEO 관점 계획 검토 (Plan CEO Review)"
source: "~/.claude/skills/plan-ceo-review/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# CEO 관점 계획 검토 (Plan CEO Review)

## 한 줄 요약

CEO/창업자 모드로 계획을 검토하여 **문제 자체를 재정의하고, 더 큰 그림의 제품을 찾아내며, 전제를 도전하고, 더 나은 제품을 만들 수 있다면 범위를 과감히 확장**하는 전략적 계획 검토 스킬이다.

## 언제 사용하나요?

- "더 크게 생각해 봐", "범위를 확장해 줘", "전략 리뷰해 줘" 같은 요청을 받았을 때
- "이 계획이 충분히 야심 찬가?" 또는 "더 좋은 접근법이 없을까?" 라는 의문이 들 때
- 현재 계획이 문제의 근본을 해결하지 못하고 증상만 다루는 것처럼 느껴질 때
- 팀원들이 계획을 보고 "이게 최선인가요?"라는 피드백을 줄 때
- 제품 아이디어의 초기 단계에서 방향성을 잡기 전에 검증받고 싶을 때

## 핵심 개념

### 4가지 검토 모드

Plan CEO Review는 상황에 따라 4가지 모드 중 하나를 선택하여 계획을 검토한다.

**1. SCOPE EXPANSION (범위 확장)**

"10배 더 크게 생각한다"는 원칙 아래 현재 계획의 범위를 과감히 넓힌다. 기존 전제를 모두 버리고 "이상적인 세상에서 이 문제를 가장 잘 해결하는 제품은 무엇인가?"를 먼저 묻는다. 작은 공지 게시판이 아니라 대학 전체의 동아리 허브가 될 수도 있다.

**2. SELECTIVE EXPANSION (선택적 확장)**

핵심 범위는 유지하되, 전체적인 가치를 크게 높이는 특정 확장 항목만 선별하여 추가한다. "범위를 다 키우기는 어렵지만 이것 하나만 더하면 10배 좋아진다"는 식의 접근이다.

**3. HOLD SCOPE (범위 고정)**

현재 범위는 그대로 유지하되, 각 세부 항목의 실행 품질을 최대로 끌어올린다. 기능 목록보다 각 기능이 얼마나 탄탄하게 구현되는지에 집중한다.

**4. SCOPE REDUCTION (범위 축소)**

MVP의 정수를 남기고 나머지를 제거한다. "사용자가 가장 원하는 단 하나는 무엇인가?"를 묻고, 그것에만 집중할 수 있도록 나머지 항목을 과감히 삭제한다.

### "10-star 제품" 사고 방식

CEO 모드의 핵심 질문은 "현재 계획이 10점 만점에 몇 점인가?"가 아니라 "**10점짜리 제품은 어떤 모습인가?**"이다. 먼저 이상적인 10점 제품을 정의하고, 현재 계획과의 갭을 메우는 방향으로 계획을 수정한다.

### 전제 도전 (Challenge Premises)

CEO 관점 검토에서 가장 강력한 도구는 현재 계획의 전제(premise)를 의심하는 것이다.

- "왜 우리는 게시판 형태로 만들어야 하는가?"
- "사용자가 정말로 원하는 것은 공지를 '올리는' 것인가, '놓치지 않는' 것인가?"
- "슬랙/카카오톡 연동으로 해결하면 게시판이 필요 없지 않은가?"

이런 질문이 불편하게 느껴지더라도 구현을 시작하기 전에 해야 한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판" 구현 계획을 세웠다. 기본적인 CRUD + 인증 + 파일 첨부 기능을 구현하려는 계획이 있다. Plan CEO Review로 이 계획을 검토한다.

### 1단계 — CEO Review 요청

```bash
> plan-ceo-review 스킬로 아래 계획을 검토해 줘:
  - 동아리 공지 게시판 (Next.js 15 + TypeScript)
  - 기능: 공지 CRUD, 로그인/로그아웃, 파일 첨부, 댓글
  - 사용자: 동아리 부원 50명
  - 목표: 카카오톡 단체방 공지를 대체
```

### 2단계 — CEO Review 결과 예시 (SCOPE EXPANSION 모드)

```
[Plan CEO Review] SCOPE EXPANSION 모드 적용

현재 계획: 8점/10점
10점 제품까지의 갭:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
전제 도전
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: 왜 카카오톡 단체방을 "대체"하려 하는가?
→ 카카오톡의 문제: 공지가 메시지에 묻혀 찾기 어려움
→ 실제 니즈: 중요 공지를 "놓치지 않는" 것
→ 시사점: 대체보다 "카카오톡 연동 + 공지 아카이브"가 더 나은 해결책일 수 있음

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10점 제품 구상
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
현재: 한 동아리의 공지 게시판
10점: 대학교 전체 동아리 허브
  - 동아리 가입/탈퇴 관리
  - 행사 캘린더 + 출석 체크
  - 후배 모집 공고 통합 관리
  - 카카오톡 채널 자동 연동

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
추천: SELECTIVE EXPANSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
전체 확장은 범위 초과. 다음 하나만 추가하면 가치가 3배:
  → "카카오톡 알림 연동" (Webhook)
  공지가 올라올 때 카카오톡으로 자동 전송 → 기존 습관 유지 + 검색 가능한 아카이브
```

### 3단계 — 수정된 계획 반영

```typescript
// 수정 전 계획 — NoticeService (CRUD만)
export class NoticeService {
  async create(dto: CreateNoticeDto): Promise<Notice> {
    return this.noticeRepository.save(dto);
  }
}

// 수정 후 계획 — NoticeService (카카오톡 알림 추가)
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly kakaoNotifier: KakaoNotifierService, // 추가
  ) {}

  async create(dto: CreateNoticeDto): Promise<Notice> {
    const notice = await this.noticeRepository.save(dto);
    // CEO Review에서 제안한 핵심 확장: 카카오톡 자동 알림
    await this.kakaoNotifier.sendNotice(notice);
    return notice;
  }
}
```

```typescript
// app/api/notices/route.ts — Next.js 15 App Router
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notice = await noticeService.create(body);

  // CEO Review 제안 반영: 카카오톡 웹훅 트리거
  await fetch(process.env.KAKAO_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `[동아리 공지] ${notice.title}\n${notice.content.slice(0, 100)}...`,
    }),
  });

  return NextResponse.json(notice, { status: 201 });
}
```

## 학습 포인트

- **"이미 세운 계획도 전제를 바꿀 수 있다"**: 한국 대학생은 보통 "일단 구현하고 나중에 고친다"는 방식을 택하는 경향이 있다. CEO Review는 구현 전에 방향을 검증하는 단계로, 잘못된 방향으로 열심히 달리는 것보다 초반에 방향을 바로잡는 것이 비용이 훨씬 적다.
- **흔한 실수 — 모드 선택 없이 무조건 확장**: CEO Review의 강점은 4가지 모드를 상황에 맞게 선택하는 것이다. 항상 SCOPE EXPANSION만 하면 마감 기한을 지키지 못한다. 발표 D-3이라면 SCOPE REDUCTION이 최선의 선택이다.
- **흔한 실수 — 전제 질문을 불편해함**: "왜 이걸 만들어야 하지?"라는 질문이 무례하게 느껴질 수 있다. 하지만 이 질문이 없으면 올바른 문제를 푸는 것인지 알 수 없다. CEO Review의 전제 도전은 공격이 아니라 제품을 더 좋게 만들기 위한 도구다.
- **Next.js 15 팁 — Server Actions와 CEO Review**: CEO Review에서 카카오톡 알림 연동이 제안된 경우, Next.js 15의 Server Actions를 활용하면 API 라우트 없이 서버에서 바로 Webhook을 호출할 수 있어 코드가 간결해진다.
- **`/plan-eng-review`, `/plan-design-review`와의 관계**: 세 스킬은 계획 검토의 3가지 관점이다. CEO Review(방향/전략) → Design Review(UX/시각) → Eng Review(구현/아키텍처) 순서로 실행하는 것이 이상적이다.

## 원본과의 차이

- 원본은 gstack 환경의 plan 모드와 직접 연동되는 워크플로우를 전제한다. 본 해설은 Claude Code CLI 대화 흐름 기반으로 재구성했다.
- 4가지 모드(SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION)를 한국 대학생의 프로젝트 현실(팀 프로젝트 마감, 발표 일정)에 맞춰 선택 기준을 구체화했다.
- "10-star 제품" 사고 방식을 "동아리 공지 게시판 → 대학 동아리 허브"라는 구체적 사례로 설명하여 추상적 개념을 실감 있게 전달했다.

> 원본: `~/.claude/skills/plan-ceo-review/SKILL.md`
