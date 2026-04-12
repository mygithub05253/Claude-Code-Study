---
title: "modelcontextprotocol/servers"
category: repos
source_url: "https://github.com/modelcontextprotocol/servers"
source_author: "Anthropic (Model Context Protocol)"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["repos", "mcp", "official", "servers", "anthropic", "filesystem", "github", "fetch"]
---

# modelcontextprotocol/servers

## 한 줄 요약

Anthropic이 공식으로 관리하는 MCP 서버 모음 레포로, Claude와 연동 가능한 레퍼런스 구현체들의 원본 코드를 담고 있습니다.

## 왜 주목해야 하나요?

- **Anthropic 공식 관리**: 커뮤니티 버전이 아닌 Anthropic이 직접 유지보수하는 신뢰할 수 있는 구현체
- **레퍼런스 구현**: 자신만의 MCP 서버를 만들 때 이 코드를 참고해 패턴을 익힐 수 있음
- **즉시 사용 가능**: npx 한 줄로 모든 서버를 설치 없이 실행 가능
- 이 프로젝트의 `filesystem-mcp`, `github-mcp`, `fetch-mcp`, `sequential-thinking` 해설이 모두 이 레포에서 나왔음

## 핵심 기능

### 포함된 공식 서버 목록

| 서버 | 패키지명 | 주요 기능 |
|---|---|---|
| filesystem | `@modelcontextprotocol/server-filesystem` | 로컬 파일 읽기/쓰기 |
| github | `@modelcontextprotocol/server-github` | GitHub API 연동 |
| fetch | `@modelcontextprotocol/server-fetch` | HTTP 요청 실행 |
| sequential-thinking | `@modelcontextprotocol/server-sequential-thinking` | 순차적 사고 구조화 |
| postgres | `@modelcontextprotocol/server-postgres` | PostgreSQL 직접 연결 |
| sqlite | `@modelcontextprotocol/server-sqlite` | SQLite 파일 조작 |
| puppeteer | `@modelcontextprotocol/server-puppeteer` | 브라우저 자동화 |
| brave-search | `@modelcontextprotocol/server-brave-search` | Brave 웹 검색 |
| google-maps | `@modelcontextprotocol/server-google-maps` | 지도/장소 검색 |
| slack | `@modelcontextprotocol/server-slack` | Slack 메시지 전송 |
| memory | `@modelcontextprotocol/server-memory` | 지식 그래프 기반 메모리 |
| everything | `@modelcontextprotocol/server-everything` | 테스트용 All-in-one 서버 |

### 레포 구조

```
servers/
├── src/
│   ├── filesystem/     # 파일시스템 서버 소스
│   ├── github/         # GitHub 서버 소스
│   ├── fetch/          # Fetch 서버 소스
│   ├── sequentialthinking/  # 순차적 사고 서버 소스
│   └── ...
├── package.json        # pnpm workspace 모노레포
└── README.md
```

각 서버는 독립적인 npm 패키지로 배포되며, 소스코드를 직접 읽어 MCP 서버 구현 방법을 학습할 수 있습니다.

### MCP 서버 구현 패턴

이 레포의 서버들은 공통적으로 다음 패턴을 따릅니다:

```
1. @modelcontextprotocol/sdk로 MCP 서버 초기화
2. tool() 메서드로 도구 스키마(JSON Schema) 정의
3. tool 핸들러에서 실제 로직 구현
4. stdio 또는 SSE 전송 방식으로 Claude와 통신
```

직접 MCP 서버를 만들고 싶다면 이 레포의 간단한 서버(fetch, filesystem)부터 코드를 분석하는 것을 권장합니다.

## 대학생 활용 포인트

**상황**: Next.js 15 "동아리 공지 게시판" 팀 프로젝트에서 Claude Code 생산성을 극대화하려는 상황.

**시나리오 1: 즉시 사용 — filesystem + github 조합**

공지 게시판 개발 초기에 아래 두 서버를 `settings.json`에 추가하면 Claude가 파일을 직접 읽고 GitHub에 이슈를 올릴 수 있습니다. 아래 구성으로 시작하는 것을 권장합니다.

설정 예시:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\kik32\\workspace\\club-notice-board"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}
```

**시나리오 2: 커스텀 MCP 서버 개발 (캡스톤 프로젝트)**

"동아리 캘린더 연동 MCP 서버" 같은 커스텀 서버를 만들 때, 이 레포의 `src/fetch/index.ts`나 `src/filesystem/index.ts`를 참고해 구현하면 됩니다. TypeScript + MCP SDK 패턴을 그대로 따라하면 됩니다.

**시나리오 3: postgres 서버로 개발 DB 직접 조작**

로컬 PostgreSQL 개발 DB를 `postgres` MCP 서버로 연결하면 Supabase Studio 없이 Claude와 대화하면서 쿼리를 실행할 수 있습니다.

**시나리오 4: puppeteer 서버로 E2E 테스트 자동화**

`puppeteer` 서버를 연결하면 "공지 게시판 로그인부터 공지 작성까지 E2E 테스트를 실행해줘"라고 요청할 수 있습니다.

## 참고 링크

- GitHub: https://github.com/modelcontextprotocol/servers
- MCP 공식 사이트: https://modelcontextprotocol.io
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP 서버 구현 가이드: https://modelcontextprotocol.io/docs/concepts/servers

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://github.com/modelcontextprotocol/servers |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
