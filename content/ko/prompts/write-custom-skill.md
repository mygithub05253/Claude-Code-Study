---
title: "커스텀 스킬 작성 프롬프트"
category: "prompts"
tags: ["Skills", "커스텀", "프롬프트", "자동화"]
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study 커뮤니티"
license: "MIT"
last_reviewed: "2026-04-13"
lang: ko
---

# 커스텀 스킬 작성 프롬프트

## 1. 핵심 개념 / 작동 원리

```mermaid
flowchart TD
  A[스킬 목적 설명] --> B[Claude Code 분석]
  B --> C[스킬 파일 구조 설계]
  C --> D[YAML frontmatter]
  C --> E[스킬 실행 프롬프트]
  C --> F[예시/출력 형식]
  D --> G[~/.claude/skills/스킬명.md]
  E --> G
  F --> G
  G --> H[/스킬명 호출 테스트]
```

Claude Code의 커스텀 스킬은 `~/.claude/skills/` 또는 `.claude/skills/`에 위치한 마크다운 파일입니다. 이 프롬프트로 원하는 커스텀 스킬을 자동 생성할 수 있습니다.

## 2. 한 줄 요약

"이런 스킬이 필요해" 설명만 하면 올바른 YAML frontmatter, 실행 프롬프트, 예시 출력을 포함한 완성된 스킬 파일을 생성합니다.

## 3. 프롬프트 템플릿

```
다음 목적의 Claude Code 커스텀 스킬 파일을 작성해줘.

스킬 목적: [원하는 스킬 설명]
스킬 이름: [영어 하이픈 형식, 예: korean-report]
호출 방법: /[스킬이름]

포함할 내용:
1. YAML frontmatter (name, description)
2. 스킬 실행 시 Claude가 따를 지시사항
3. 입력 파라미터 처리 방법
4. 출력 형식 예시

저장 위치: ~/.claude/skills/[스킬이름].md

한국어 주석 포함, TypeScript/Next.js 15 프로젝트 컨텍스트 고려
```

## 4. 실전 예제

**동아리 공지 게시판 API 문서 자동 생성 스킬**:

```markdown
---
name: api-docs-ko
description: 현재 프로젝트의 API 엔드포인트를 분석해 한국어 API 문서를 생성
---

현재 프로젝트에서 API 엔드포인트(Express 라우터 또는 Next.js API Routes)를
분석하여 한국어 API 문서를 생성합니다.

## 분석 대상
- Express: routes/ 또는 src/routes/ 디렉토리
- Next.js: app/api/ 또는 pages/api/ 디렉토리
- Spring Boot: @RestController 어노테이션이 붙은 클래스

## 출력 형식
### [메서드] [경로]
- **설명**: 엔드포인트의 역할
- **요청**: 파라미터/바디 스키마
- **응답**: 성공/실패 예시
- **인증**: 필요 여부
```

## 5. 학습 포인트 / 흔한 함정

- 스킬 이름은 소문자 + 하이픈만 (공백, 특수문자 불가)
- 너무 복잡한 스킬은 프롬프트 길이가 길어져 토큰 낭비
- 프로젝트 전용 스킬은 `.claude/skills/`에, 전역은 `~/.claude/skills/`에

## 6. 관련 리소스

- [한국어 보고서 작성 스킬](../my-collection/skill-korean-report.md)
- [스킬 해설 허브](../skills/)
- [통합 셋업 프롬프트](./integrated-setup.md)

## 7. 원본 링크 & 저작권

| 항목 | 내용 |
|------|------|
| 원본 URL | https://github.com/mygithub05253/Claude-Code-Study |
| 작성자 | Claude-Code-Study 커뮤니티 |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-13 |
| 카테고리 | prompts / 커스텀 스킬 |
