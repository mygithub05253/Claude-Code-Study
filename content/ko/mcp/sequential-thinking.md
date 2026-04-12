---
title: "sequential-thinking"
category: mcp
source_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking"
source_author: "Anthropic (Model Context Protocol)"
license: "MIT (확인 필요)"
last_reviewed: "2026-04-12"
tags: ["mcp", "reasoning", "problem-solving", "sequential"]
---

# sequential-thinking

## 한 줄 요약

복잡한 문제를 단계별 사고 블록으로 분해해 Claude의 추론 정확도와 투명성을 높이는 MCP 서버.

## 언제 사용하나요?

- 여러 조건이 얽힌 버그를 단계별로 추적하고 싶을 때
- 아키텍처 설계나 기능 구현 계획을 순서대로 검증하고 싶을 때
- Claude가 "왜 그런 결론에 도달했는지" 추론 과정을 명시적으로 보고 싶을 때
- 복잡한 알고리즘이나 비즈니스 로직을 오류 없이 구현해야 할 때

## 핵심 개념

`sequential-thinking` MCP 서버는 `sequentialthinking` 도구 하나를 제공합니다. 이 도구는 Claude가 답변을 생성하기 전에 **사고 단계(thought)**를 명시적으로 선언하고 순서대로 진행하도록 강제합니다.

### 사고 단계 구조

각 단계는 다음 필드로 구성됩니다:

| 필드 | 설명 |
|---|---|
| `thought` | 현재 단계에서의 추론 내용 |
| `thoughtNumber` | 현재 단계 번호 |
| `totalThoughts` | 예상 총 단계 수 (조정 가능) |
| `nextThoughtNeeded` | 다음 단계가 필요한지 여부 |
| `isRevision` | 이전 단계를 수정하는지 여부 |
| `revisesThought` | 수정 대상 단계 번호 |
| `branchFromThought` | 분기 시작 단계 |
| `branchId` | 분기 식별자 |

### 핵심 특징

- **동적 단계 수 조정**: 문제가 예상보다 복잡하면 `totalThoughts`를 늘릴 수 있음
- **역방향 수정**: 앞 단계의 추론이 잘못됐으면 `isRevision`으로 되돌아가 수정
- **분기 탐색**: 여러 접근법을 병렬로 비교할 때 `branchFromThought` 활용
- **최소 3단계 권장**: 너무 단순한 문제에는 오버헤드가 될 수 있음

## 설치 및 설정

### 사전 요구사항

- Node.js 18+
- npx 사용 가능 환경

### Claude Code `.claude/settings.json` 설정

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Claude Desktop `claude_desktop_config.json` 설정

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

설정 후 Claude를 재시작하면 `sequentialthinking` 도구가 활성화됩니다.

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에서 공지 작성 API에 버그가 발생했습니다. 로그인한 사용자가 공지를 작성하면 가끔 403 에러가 반환됩니다.

**프롬프트 예시**:

```
/mcp sequential-thinking 을 사용해서 다음 버그를 단계별로 분석해줘:

- Next.js 15 App Router, Supabase Auth 사용
- POST /api/notices 엔드포인트에서 간헐적 403 발생
- 에러 로그: "Row Level Security policy violation"
- 재현 조건: 로그인 직후 빠르게 공지 작성 시 주로 발생
```

**Claude의 순차 사고 흐름 예시**:

```
단계 1: 403 에러 발생 조건 분석
 - RLS(Row Level Security) 정책 위반
 - "로그인 직후 빠르게" → 타이밍 문제 의심

단계 2: Supabase Auth 토큰 전달 경로 추적
 - 클라이언트 → API Route → Supabase 클라이언트
 - supabaseServerClient()에서 쿠키/헤더 읽는 시점 확인 필요

단계 3: App Router 특성과 세션 동기화
 - cookies()는 서버 컴포넌트/Route Handler에서 동기 호출
 - 미들웨어에서 세션 갱신 후 쿠키가 아직 전파 안 됐을 수 있음

단계 4: 근본 원인 결론
 - 미들웨어의 session refresh가 완료되기 전에
   Route Handler가 구 쿠키로 Supabase 클라이언트 생성
 - 해결: middleware에서 세션 갱신 후 응답 헤더에 새 토큰 포함
```

sequential-thinking 없이 물어보면 Claude가 바로 추측 답변을 할 수 있지만, 이 MCP를 사용하면 각 단계의 논리를 명시적으로 검증할 수 있습니다.

## 학습 포인트

### 효과적인 사용 방법

- **복잡도 기준 적용**: 조건이 3개 이상 얽힌 문제에서 사용할 때 효과가 뚜렷합니다. 단순한 질문에는 오히려 응답이 느려질 수 있습니다.
- **단계 수 힌트 제공**: 프롬프트에 "5단계로 분석해줘"처럼 힌트를 주면 Claude가 적절한 `totalThoughts`를 설정합니다.
- **수정 기능 활용**: Claude가 중간 단계에서 앞 단계를 수정하는 것을 보면 그 지점이 핵심 논리 분기점입니다.

### 흔한 함정

- **모든 질문에 적용하려는 오류**: 단순 코드 생성이나 간단한 사실 질문에는 불필요합니다.
- **단계 수 과다 설정**: 10단계 이상으로 설정하면 토큰 소비가 급증합니다. 5~7단계가 일반적인 상한선입니다.
- **결과만 보고 과정 무시**: 이 MCP의 진짜 가치는 중간 단계의 추론 과정입니다. 각 `thought` 내용을 꼼꼼히 검토하세요.

### 보안 고려사항

- 이 MCP 서버 자체는 외부 네트워크나 파일시스템에 접근하지 않습니다.
- 순수하게 Claude의 사고 과정을 구조화하는 도구이므로 보안 리스크는 거의 없습니다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
