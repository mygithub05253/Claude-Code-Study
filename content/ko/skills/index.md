---
title: "스킬 해설"
category: skills
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic & 커뮤니티"
license: "각 스킬별 상이"
last_reviewed: "2026-04-12"
tags: ["skills", "index"]
---

# Claude Code 스킬 해설

> Claude Code에 내장된 **48개 공식 스킬**을 한국 대학생 관점으로 한국어 해설합니다. 슬래시 명령어(`/skill-name`)로 즉시 호출 가능합니다.

## 기획 / 설계

<CardGrid>
  <CardItem
    title="브레인스토밍"
    tag="기획/설계"
    summary="창작 작업 전 사용자 의도·요구사항을 구조화된 질문으로 탐색"
    link="/skills/brainstorming"
  />
  <CardItem
    title="계획 작성"
    tag="기획/설계"
    summary="코드 작성 전 구현 계획서를 체계적으로 작성"
    link="/skills/writing-plans"
  />
  <CardItem
    title="계획 실행"
    tag="기획/설계"
    summary="계획서 기반 단계별 실행 + 중간 리뷰 체크포인트"
    link="/skills/executing-plans"
  />
  <CardItem
    title="CEO 리뷰"
    tag="기획/설계"
    summary="CEO·파운더 시각으로 계획 문제 발굴 + 범위 재정의"
    link="/skills/plan-ceo-review"
  />
  <CardItem
    title="디자인 리뷰"
    tag="기획/설계"
    summary="디자이너 관점으로 UI/UX 계획 평가·개선"
    link="/skills/plan-design-review"
  />
  <CardItem
    title="엔지니어링 리뷰"
    tag="기획/설계"
    summary="엔지니어링 매니저 시각으로 아키텍처·실행 계획 검토"
    link="/skills/plan-eng-review"
  />
  <CardItem
    title="오피스 아워"
    tag="기획/설계"
    summary="YC Office Hours 스타일 스타트업·빌더 아이디어 탐색 2가지 모드"
    link="/skills/office-hours"
  />
  <CardItem
    title="자동 계획 파이프라인"
    tag="기획/설계"
    summary="CEO → Design → Eng 리뷰를 자동으로 순차 실행"
    link="/skills/autoplan"
  />
</CardGrid>

## 품질 / 안전

<CardGrid>
  <CardItem
    title="테스트 주도 개발"
    tag="품질/안전"
    summary="기능 구현 전 Red-Green-Refactor 사이클로 테스트 먼저"
    link="/skills/test-driven-development"
  />
  <CardItem
    title="체계적 디버깅"
    tag="품질/안전"
    summary="버그 근본 원인 규명 → 가설 검증 → 수정 체계적 접근"
    link="/skills/systematic-debugging"
  />
  <CardItem
    title="조사 (Investigate)"
    tag="품질/안전"
    summary="조사→분석→가설→구현 4단계, 근본 원인 없이 수정 금지"
    link="/skills/investigate"
  />
  <CardItem
    title="완료 전 검증"
    tag="품질/안전"
    summary="완료 선언 전 실제 실행 출력으로 검증 증거 확보 필수"
    link="/skills/verification-before-completion"
  />
  <CardItem
    title="신중 모드"
    tag="품질/안전"
    summary="파괴적 명령(rm -rf, DROP TABLE, force-push) 전 안전 경고"
    link="/skills/careful"
  />
  <CardItem
    title="가드 모드"
    tag="품질/안전"
    summary="디렉토리 제한 + 파괴적 명령 경고 동시 적용 풀 세이프티"
    link="/skills/guard"
  />
  <CardItem
    title="편집 잠금"
    tag="품질/안전"
    summary="특정 디렉토리만 편집 허용해 의도치 않은 파일 수정 차단"
    link="/skills/freeze"
  />
  <CardItem
    title="편집 잠금 해제"
    tag="품질/안전"
    summary="freeze로 설정한 편집 제한을 해제하고 전체 편집 허용 복원"
    link="/skills/unfreeze"
  />
  <CardItem
    title="보안 감사관"
    tag="품질/안전"
    summary="인프라 우선 보안 감사: 비밀값·의존성·OWASP Top 10·STRIDE"
    link="/skills/cso"
  />
</CardGrid>

## 코드 리뷰 / 피드백

<CardGrid>
  <CardItem
    title="PR 리뷰"
    tag="코드 리뷰"
    summary="머지 전 SQL 안전성·LLM 신뢰 경계·사이드 이펙트 구조 검토"
    link="/skills/review"
  />
  <CardItem
    title="리뷰 요청"
    tag="코드 리뷰"
    summary="코드 리뷰 요청 전 자체 검증 + 기술적 엄밀성 확보"
    link="/skills/requesting-code-review"
  />
  <CardItem
    title="리뷰 수신"
    tag="코드 리뷰"
    summary="피드백 수신 후 맹목적 수락 금지, 기술적 검토 후 구현"
    link="/skills/receiving-code-review"
  />
  <CardItem
    title="Codex CLI"
    tag="코드 리뷰"
    summary="OpenAI Codex CLI 3가지 모드: 리뷰·적대적 테스트·컨설트"
    link="/skills/codex"
  />
</CardGrid>

## 배포 / 릴리스

<CardGrid>
  <CardItem
    title="배포 (Ship)"
    tag="배포/릴리스"
    summary="테스트→리뷰→버전 범프→CHANGELOG→PR 생성 전체 자동화"
    link="/skills/ship"
  />
  <CardItem
    title="개발 브랜치 완료"
    tag="배포/릴리스"
    summary="구현 완료 후 머지·PR·정리 중 최적 통합 방법 안내"
    link="/skills/finishing-a-development-branch"
  />
  <CardItem
    title="랜딩 & 배포"
    tag="배포/릴리스"
    summary="PR 머지 → CI 대기 → 배포 → 프로덕션 카나리 확인"
    link="/skills/land-and-deploy"
  />
  <CardItem
    title="배포 설정"
    tag="배포/릴리스"
    summary="배포 플랫폼(Fly.io, Vercel, Netlify 등) 자동 감지·설정"
    link="/skills/setup-deploy"
  />
  <CardItem
    title="릴리스 문서화"
    tag="배포/릴리스"
    summary="출시 후 README·ARCHITECTURE·CHANGELOG 등 문서 업데이트"
    link="/skills/document-release"
  />
</CardGrid>

## 브라우저 / QA

<CardGrid>
  <CardItem
    title="브라우저 탐색"
    tag="브라우저/QA"
    summary="헤드리스 브라우저 탐색·요소 조작·스크린샷·반응형 테스트"
    link="/skills/browse"
  />
  <CardItem
    title="GSTACK"
    tag="브라우저/QA"
    summary="브라우저 QA: 페이지 탐색, 상태 검증, before/after diff"
    link="/skills/gstack"
  />
  <CardItem
    title="GSTACK 업그레이드"
    tag="브라우저/QA"
    summary="gstack 최신 버전으로 업그레이드 + 변경 사항 확인"
    link="/skills/gstack-upgrade"
  />
  <CardItem
    title="Chrome 연결"
    tag="브라우저/QA"
    summary="실제 Chrome을 gstack으로 제어, Side Panel 확장 자동 로드"
    link="/skills/connect-chrome"
  />
  <CardItem
    title="브라우저 쿠키 설정"
    tag="브라우저/QA"
    summary="Chromium 쿠키를 헤드리스 세션으로 가져와 인증 테스트"
    link="/skills/setup-browser-cookies"
  />
  <CardItem
    title="QA 테스트 + 수정"
    tag="브라우저/QA"
    summary="웹 앱 QA 후 버그 반복 수정·검증 + 원자적 커밋"
    link="/skills/qa"
  />
  <CardItem
    title="QA 보고서 전용"
    tag="브라우저/QA"
    summary="수정 없이 버그 보고서만 생성하는 리포트 전용 QA"
    link="/skills/qa-only"
  />
  <CardItem
    title="성능 벤치마크"
    tag="브라우저/QA"
    summary="페이지 로드·Core Web Vitals·리소스 크기 성능 회귀 감지"
    link="/skills/benchmark"
  />
</CardGrid>

## 디자인

<CardGrid>
  <CardItem
    title="디자인 컨설팅"
    tag="디자인"
    summary="제품 이해 → 디자인 시스템 제안 → DESIGN.md 작성 컨설팅"
    link="/skills/design-consultation"
  />
  <CardItem
    title="HTML 디자인 구현"
    tag="디자인"
    summary="승인된 목업을 프로덕션급 HTML/CSS로 구현"
    link="/skills/design-html"
  />
  <CardItem
    title="디자인 리뷰"
    tag="디자인"
    summary="시각적 불일치·간격·계층 문제 발견 → 원자적 수정·검증"
    link="/skills/design-review"
  />
  <CardItem
    title="디자인 샷건"
    tag="디자인"
    summary="여러 AI 디자인 변형 생성 → 비교 보드 → 피드백·반복"
    link="/skills/design-shotgun"
  />
</CardGrid>

## 에이전트 / 병렬화

<CardGrid>
  <CardItem
    title="병렬 에이전트 디스패치"
    tag="에이전트"
    summary="독립 작업 2개 이상을 병렬 에이전트로 분배 처리"
    link="/skills/dispatching-parallel-agents"
  />
  <CardItem
    title="서브에이전트 주도 개발"
    tag="에이전트"
    summary="현재 세션에서 독립 작업을 서브에이전트로 병렬 실행"
    link="/skills/subagent-driven-development"
  />
  <CardItem
    title="Git Worktrees 활용"
    tag="에이전트"
    summary="작업 격리를 위한 Git Worktree 생성·관리"
    link="/skills/using-git-worktrees"
  />
  <CardItem
    title="체크포인트"
    tag="에이전트"
    summary="작업 상태 저장 → 나중에 정확히 같은 위치에서 재개"
    link="/skills/checkpoint"
  />
</CardGrid>

## 메타 / 워크플로우

<CardGrid>
  <CardItem
    title="슈퍼파워 활용"
    tag="메타"
    summary="대화 시작 시 스킬 찾기·사용 방법 확인 + Skill tool 필수 호출"
    link="/skills/using-superpowers"
  />
  <CardItem
    title="스킬 작성"
    tag="메타"
    summary="새 스킬 생성·편집 + 배포 전 동작 검증 가이드"
    link="/skills/writing-skills"
  />
  <CardItem
    title="학습 관리"
    tag="메타"
    summary="프로젝트 학습 내용 검토·검색·정리·내보내기"
    link="/skills/learn"
  />
  <CardItem
    title="주간 회고"
    tag="메타"
    summary="커밋 이력·작업 패턴·코드 품질 분석 주간 엔지니어링 회고"
    link="/skills/retro"
  />
  <CardItem
    title="코드 헬스"
    tag="메타"
    summary="타입 검사·린터·테스트·사용하지 않는 코드 종합 품질 대시보드"
    link="/skills/health"
  />
  <CardItem
    title="카나리 모니터링"
    tag="메타"
    summary="배포 후 라이브 앱 콘솔 에러·성능 회귀·페이지 실패 모니터링"
    link="/skills/canary"
  />
</CardGrid>

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic & 커뮤니티 |
| 라이선스 | 각 스킬별 상이 |
| 해설 작성일 | 2026-04-12 |

> 💡 각 스킬 상세 페이지에서 `/skill-name` 슬래시 명령어와 프로젝트 도입 방법을 확인하세요.
