---
title: "범용 프롬프트 모음"
category: prompts
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study 프로젝트"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["prompts", "templates", "index"]
---

# Claude Code 범용 프롬프트 모음

> 외부 리소스(MCP / 레포 / Skills / Hooks / Agents)를 Claude Code에서 활용할 때 바로 복사해 쓸 수 있는 **한국어 프롬프트 템플릿** 입니다.

<CardGrid>
  <CardItem
    title="새 MCP 서버 설치"
    tag="MCP"
    summary="MCP 서버 설명 → 전제 조건 → settings.json 설정 → 테스트 명령 → 활용 예시"
    link="#1-새-mcp-서버-설치"
  />
  <CardItem
    title="외부 GitHub 레포 분석"
    tag="레포"
    summary="레포 목적·스택·구조·활용 단계·변형 시나리오·라이선스 분석 종합 프롬프트"
    link="#2-외부-github-레포-분석"
  />
  <CardItem
    title="커스텀 Skill 작성"
    tag="스킬"
    summary="목적 기반 SKILL.md 작성 → 트리거 조건 → 단계별 지시 → 실행 예시"
    link="#3-커스텀-skill-작성"
  />
  <CardItem
    title="Hooks 설정"
    tag="Hooks"
    summary="이벤트 선택 → matcher 설정 → settings.json 생성 → 동작 확인"
    link="#4-hooks-설정"
  />
  <CardItem
    title="Sub-agent 패턴 구성"
    tag="에이전트"
    summary="역할 분리 → 작업 범위 → 통신 방식 → 프롬프트 체인 → 에러 복구"
    link="#5-sub-agent-패턴-구성"
  />
  <CardItem
    title="레포 + MCP + Hooks 통합"
    tag="통합"
    summary="clone 후 CLAUDE.md 작성 → MCP 추천 → Hooks 설정 → 스킬 추가 → 워크플로우"
    link="#6-레포--mcp--hooks-통합-셋업"
  />
</CardGrid>

---

## 1. 새 MCP 서버 설치

```text
나는 [MCP 서버 이름] MCP 서버를 Claude Code에 연결하고 싶어.
1. 이 MCP 서버가 뭘 하는지 한 줄로 설명해줘
2. 설치에 필요한 전제 조건을 알려줘
3. .claude/settings.json 에 추가할 정확한 JSON 설정을 보여줘
4. 설치 후 동작 확인을 위한 테스트 명령어를 알려줘
5. 대학생 프로젝트에서 어떻게 활용할 수 있는지 예시를 들어줘
```

## 2. 외부 GitHub 레포 분석

```text
이 GitHub 레포지토리를 분석해줘: [레포 URL]
1. 목적과 핵심 기능을 한 줄로 요약
2. 기술 스택(언어, 프레임워크, 의존성) 정리
3. 디렉토리 구조 설명과 핵심 파일
4. Claude Code 에서 clone 후 활용 단계별 가이드
5. 대학생이 이 레포를 변형해서 쓸 수 있는 시나리오 3가지
6. 라이선스 확인과 사용 시 주의점
```

## 3. 커스텀 Skill 작성

```text
나만의 Claude Code Skill 을 만들고 싶어.
목적: [구체적인 목적]
1. .claude/skills/ 에 SKILL.md 파일 작성
2. description 에 트리거 조건 명확하게 기재
3. 본문에 단계별 지시사항 포함
4. 실행 예시 프롬프트 3개
5. 테스트 방법 안내
```

## 4. Hooks 설정

```text
Claude Code hooks 를 설정하고 싶어.
목적: [구체적인 목적]
1. 적합한 hook 이벤트(PreToolUse/PostToolUse/Notification 등) 선택
2. matcher 패턴 설정
3. .claude/settings.json 에 추가할 정확한 JSON 생성
4. 동작 확인 테스트 방법
5. 잘못 설정했을 때 발생 가능한 문제와 해결법
```

## 5. Sub-agent 패턴 구성

```text
Claude Code 에서 sub-agent 패턴을 활용하고 싶어.
프로젝트 맥락: [프로젝트 설명]
1. 메인/서브 에이전트 역할 분리
2. 각 에이전트 작업 범위 정의
3. 에이전트 간 통신/결과 전달 방식
4. 실제 실행 시 프롬프트 체인
5. 에러 발생 시 복구 전략
```

## 6. 레포 + MCP + Hooks 통합 셋업

```text
나는 [GitHub 레포 URL] 를 clone 해서 Claude Code 로 개발하려고 해.
이 프로젝트에 최적화된 Claude Code 환경을 셋업해줘:
1. CLAUDE.md 파일을 프로젝트에 맞게 작성
2. 필요한 MCP 서버 추천 + settings.json 설정
3. 코드 품질 hooks 설정 (포맷팅, 린팅, 테스트)
4. 유용한 커스텀 Skills 추가 제안
5. 개발 워크플로우 단계별 정리
```

---

| 항목 | 내용 |
|---|---|
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |

> 💡 각 프롬프트의 `[대괄호]` 부분을 본인 상황에 맞게 치환해서 사용하세요.
