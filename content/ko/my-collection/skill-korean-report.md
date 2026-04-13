---
title: "한국어 보고서 작성 커스텀 스킬"
category: "my-collection"
tags: ["Skills", "한국어", "보고서", "커스텀", "대학생"]
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study 커뮤니티"
license: "MIT"
last_reviewed: "2026-04-13"
lang: ko
---

# 한국어 보고서 작성 커스텀 스킬

## 1. 핵심 개념 / 작동 원리

```mermaid
flowchart TD
  A[/korean-report 스킬 호출] --> B[프로젝트 컨텍스트 분석]
  B --> C{보고서 유형 감지}
  C --> D[기술 보고서]
  C --> E[회의록]
  C --> F[프로젝트 진행 보고서]
  D --> G[구조화된 한국어 마크다운]
  E --> G
  F --> G
  G --> H[표/차트/코드블록 포함]
  H --> I[최종 보고서 출력]
```

Claude Code의 커스텀 스킬 기능을 활용해 `~/.claude/skills/korean-report.md`로 저장하는 스킬입니다. `/korean-report`를 호출하면 현재 프로젝트 맥락에 맞는 한국어 보고서를 자동 생성합니다.

## 2. 한 줄 요약

`/korean-report` 스킬 한 줄로 프로젝트 현황, 기술 문서, 회의록을 한국어 마크다운 형식으로 자동 생성하여 대학교 과제 및 팀 커뮤니케이션을 지원합니다.

## 3. 프로젝트에 도입하기

`~/.claude/skills/korean-report.md` 파일을 생성합니다:

```markdown
---
name: korean-report
description: 프로젝트 현황/기술 보고서/회의록을 한국어 마크다운으로 작성
---

현재 프로젝트의 컨텍스트를 분석하여 요청된 유형의 한국어 보고서를 작성합니다.

## 보고서 작성 규칙
1. 모든 내용은 **한국어**로 작성
2. 마크다운 형식 사용 (GitHub Flavored Markdown)
3. 헤딩은 ## (h2)부터 시작
4. 코드 블록은 언어 명시 (```typescript, ```java 등)
5. 수치/날짜는 명확하게 표기

## 지원 보고서 유형
- **기술 보고서**: 구현 내용, 기술 스택, 아키텍처 다이어그램
- **진행 보고서**: 완료 항목, 진행 중, 다음 계획
- **회의록**: 일시, 참석자, 논의 내용, 결정 사항, 액션 아이템

## 출력 형식 예시 (진행 보고서)
---
**프로젝트명**: [프로젝트명]
**보고 일시**: [KST 날짜]
**작성자**: [작성자명]

### 이번 주 완료 항목
- [ ] 항목 1
- [x] 항목 2 ✅

### 다음 주 계획
1. 계획 1
2. 계획 2

### 이슈/리스크
| 이슈 | 영향도 | 해결 방안 |
|------|--------|----------|
| ... | 높음/중간/낮음 | ... |
---

요청한 보고서 유형과 추가 정보를 알려주시면 바로 작성하겠습니다.
```

## 4. 실전 예제

**동아리 공지 게시판 프로젝트 주간 보고서 생성**:

```
사용자: /korean-report 이번 주 개발 진행 보고서 작성해줘

Claude 출력:
---
**프로젝트명**: 동아리 공지 게시판
**보고 일시**: 2026-04-13 (KST)
**작성자**: 개발팀

### 이번 주 완료 항목
- [x] 공지사항 CRUD API 구현 (Spring Boot) ✅
- [x] Next.js 15 공지 목록 페이지 구현 ✅
- [x] Supabase Auth 소셜 로그인 연동 ✅

### 진행 중
- [ ] 이미지 업로드 기능 (Supabase Storage)
- [ ] 실시간 알림 (Supabase Realtime)

### 다음 주 계획
1. 이미지 업로드 완료
2. 관리자 대시보드 구현
3. 배포 환경 설정 (Vercel + Railway)

### 이슈
| 이슈 | 영향도 | 해결 방안 |
|------|--------|----------|
| N+1 쿼리 | 높음 | Fetch Join 적용 예정 |
---
```

## 5. 학습 포인트 / 흔한 함정

**스킬 파일 위치**:
- 전역: `~/.claude/skills/korean-report.md`
- 프로젝트 전용: `.claude/skills/korean-report.md` (프로젝트 루트)

**흔한 함정**:
- 스킬 이름에 공백 사용 불가 → 하이픈(-) 사용
- 너무 긴 스킬 파일 → 프롬프트 토큰 낭비
- 프로젝트 컨텍스트 없이 호출 → 보고서 내용이 generic해짐

## 6. 관련 리소스

- [커스텀 스킬 작성 프롬프트](../prompts/write-custom-skill.md)
- [Next.js CLAUDE.md 템플릿](./custom-claude-md-nextjs.md)
- [스킬 해설 허브](../skills/)

## 7. 원본 링크 & 저작권

| 항목 | 내용 |
|------|------|
| 원본 URL | https://github.com/mygithub05253/Claude-Code-Study |
| 작성자 | Claude-Code-Study 커뮤니티 |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-13 |
| 카테고리 | my-collection / 커스텀 스킬 |
