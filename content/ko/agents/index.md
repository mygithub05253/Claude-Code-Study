---
title: "Agents"
category: agents
source_url: "https://docs.anthropic.com/en/docs/claude-code/sub-agents"
source_author: "Anthropic & 커뮤니티"
license: "각 에이전트별 상이"
last_reviewed: "2026-04-12"
tags: ["agents", "sub-agent", "index"]
---

# Agents 패턴 해설

> Claude Code의 **Sub-agent / Multi-agent 패턴** 을 대학생 프로젝트 맥락에서 설명합니다. 복잡한 작업을 독립 에이전트로 분리해 병렬·효율적으로 처리합니다.

<CardGrid>
  <CardItem
    title="Explore Agent"
    tag="탐색"
    summary="코드베이스를 빠르게 탐색하는 특화 에이전트 — 파일 패턴 검색·키워드 분석·구조 파악"
    link="/agents/explore-agent"
  />
  <CardItem
    title="Plan Agent"
    tag="계획"
    summary="구현 계획 수립 전담 에이전트 — 단계별 계획·핵심 파일 식별·아키텍처 트레이드오프"
    link="/agents/plan-agent"
  />
  <CardItem
    title="병렬 디스패치"
    tag="병렬화"
    summary="독립적인 여러 작업을 동시 에이전트로 분배해 처리 — 속도·병렬성 극대화"
    link="/agents/parallel-dispatch"
  />
  <CardItem
    title="GSTACK 역할 에이전트"
    tag="역할 기반"
    summary="프론트엔드·백엔드·QA 역할별 에이전트 분리 — 대규모 풀스택 프로젝트 자동화"
    link="/agents/gstack-roles"
  />
</CardGrid>

## Sub-agent 기본 패턴

```text
# 메인 에이전트 프롬프트 예시
다음 3가지 독립 작업을 병렬로 처리해줘:
1. [작업 A] — Explore agent로 코드 구조 파악
2. [작업 B] — Plan agent로 구현 계획 수립
3. [작업 C] — 테스트 코드 자동 생성
각 결과를 합쳐 최종 구현 계획을 만들어.
```

관련 스킬: [병렬 에이전트 디스패치](/skills/dispatching-parallel-agents), [서브에이전트 주도 개발](/skills/subagent-driven-development)

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/sub-agents |
| 라이선스 | 각 에이전트별 상이 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
