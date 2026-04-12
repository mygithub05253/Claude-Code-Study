---
title: "설계 분리 에이전트 (plan-agent)"
category: agents
source_url: "https://docs.anthropic.com/en/docs/claude-code/sub-agents"
source_author: "Anthropic"
license: "CC BY 4.0 (문서 기준)"
last_reviewed: "2026-04-12"
tags: ["agents", "sub-agent", "계획", "설계", "plan", "컨텍스트관리"]
---

# 설계 분리 에이전트 (plan-agent)

## 한 줄 요약

구현 작업 전에 Plan 서브에이전트를 별도로 실행해 설계 문서를 분리 작성함으로써, 메인 구현 세션의 컨텍스트 창을 아끼고 설계의 품질을 높인다.

## 언제 사용하나요?

- 새 기능 구현 전에 어떻게 만들지 먼저 체계적으로 설계하고 싶을 때
- 설계 탐색 과정에서 생기는 대화와 코드 읽기가 구현 세션 컨텍스트를 오염시키는 것을 피하고 싶을 때
- `/writing-plans` 스킬처럼 구조화된 계획 수립 방법론을 에이전트와 함께 활용하고 싶을 때
- 설계 문서를 팀원과 공유하거나 리뷰받아야 할 때

## 핵심 개념

Claude Code의 컨텍스트 창은 유한하다. 설계를 탐색하는 동안 읽는 파일, 나누는 대화, 시도했다 버린 코드 조각들이 모두 컨텍스트를 소모한다. 이 설계 탐색 과정을 서브에이전트에 위임하면 메인 세션은 최종 설계 문서만 받아 깨끗한 상태에서 구현을 시작할 수 있다.

Plan 에이전트 패턴의 3단계:
```
1단계: Plan Agent 실행 (서브에이전트)
   → 요구사항 분석
   → 기존 코드 탐색
   → 설계 옵션 검토
   → 최종 plan.md 작성

2단계: 사용자 검토
   → plan.md를 읽고 승인/수정
   → 구현 범위와 우선순위 확정

3단계: Implementation 세션 시작 (새 메인 세션)
   → plan.md를 컨텍스트로 제공
   → 깨끗한 컨텍스트에서 구현 진행
```

`/writing-plans` 스킬과의 연동:
- `/writing-plans` 스킬은 계획 수립을 위한 구조화된 프롬프트 패턴을 제공한다
- Plan 에이전트에게 이 스킬의 형식을 따르도록 지시하면 일관된 품질의 설계 문서가 생성된다

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에 공지사항 좋아요(Like) 기능을 추가하기 전에 설계를 먼저 분리 작성

### Claude Code 세션에서의 실제 사용 방법

**메인 세션에서 Plan Agent 실행 요청:**

```
서브에이전트를 실행해서 아래 기능의 구현 계획서를 작성해줘.
메인 세션을 건드리지 않고, 계획서만 파일로 저장해줘.

기능: 공지사항 좋아요(Like) 기능
- 로그인한 동아리 회원이 공지에 좋아요를 누를 수 있음
- 좋아요 수가 공지 목록에 표시됨
- 같은 사람이 두 번 좋아요를 누르면 취소됨

에이전트 작업:
1. 현재 프로젝트의 공지사항 관련 파일 탐색 (frontend/components/notices/, backend/routes/)
2. 기존 데이터 모델 파악 (prisma/schema.prisma 또는 types 폴더)
3. /writing-plans 스킬 형식에 따라 구현 계획서 작성
4. 결과를 docs/plans/like-feature-plan.md에 저장
```

### Plan Agent가 생성하는 `docs/plans/like-feature-plan.md`

```markdown
# 공지사항 좋아요 기능 구현 계획

## 1. 목표
로그인한 동아리 회원이 공지에 좋아요를 누르고,
중복 좋아요는 자동 취소되는 토글 기능 구현.

## 2. 현재 상태 분석
- Notice 모델: id, title, content, authorId, createdAt
- 인증: NextAuth.js 세션 사용 확인
- 공지 목록 컴포넌트: frontend/components/notices/NoticeList.tsx

## 3. 변경 범위

### 데이터 모델 변경 (prisma/schema.prisma)
\`\`\`prisma
model Noticelike {
  id        String   @id @default(cuid())
  noticeId  String
  userId    String
  createdAt DateTime @default(now())
  notice    Notice   @relation(fields: [noticeId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([noticeId, userId])  // 중복 좋아요 방지
}
\`\`\`

### API 라우트 (backend/routes/notices/[id]/like.ts)
- POST: 좋아요 토글 (추가 또는 삭제)
- GET: 특정 공지 좋아요 수 조회

### 프론트엔드 (frontend/components/notices/LikeButton.tsx)
- 신규 컴포넌트: 좋아요 버튼 + 카운트 표시
- NoticeCard에 LikeButton 통합

## 4. 구현 순서
1. DB 마이그레이션 (NoticeLike 모델 추가)
2. API 라우트 구현 + 테스트
3. LikeButton 컴포넌트 구현
4. NoticeCard에 통합
5. 통합 테스트

## 5. 예상 소요 시간
약 2시간 (Claude 1 세션)

## 6. 위험 요소
- 낙관적 업데이트(Optimistic Update) 구현 복잡도
- 로그인 상태 확인 미들웨어 필요
```

### 계획 검토 후 구현 세션 시작

```
위에서 생성한 docs/plans/like-feature-plan.md를 참고해서
좋아요 기능을 구현해줘.
계획서의 순서대로 진행하고, 각 단계마다 확인을 받아줘.
```

## 학습 포인트

- **Plan은 별도 세션, 구현은 새 세션**: Plan Agent가 작업하는 동안 생긴 탐색 내역이 구현 세션에 섞이지 않도록 계획 완료 후 새 세션을 시작하는 것이 이상적이다.
- **계획 검토 단계 필수**: 서브에이전트가 작성한 계획을 그대로 실행하지 말고 반드시 사람이 검토한다. 에이전트는 존재하지 않는 파일을 탐색했다고 착각하거나 잘못된 가정을 할 수 있다.
- **파일로 계획 저장**: 계획을 파일로 저장하면 여러 세션에서 참조할 수 있고, git으로 버전 관리도 된다. 메모리에만 존재하는 계획은 세션이 끊기면 사라진다.
- **`/writing-plans` 스킬 활용**: 이 스킬은 요구사항 → 분석 → 옵션 → 결정 → 실행 계획 구조를 강제한다. Plan Agent에게 이 스킬의 형식을 따르도록 명시하면 더 체계적인 계획서가 나온다.
- **계획의 세분화**: 너무 상세한 계획은 구현 시 유연성을 잃게 한다. "무엇을 만들지"는 상세하게, "어떻게 만들지 코드 레벨"은 구현 세션에 위임한다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/sub-agents |
| 라이선스 | CC BY 4.0 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
