---
title: "MCP 서버"
category: mcp
source_url: "https://modelcontextprotocol.io/"
source_author: "Anthropic & 커뮤니티"
license: "각 서버별 상이"
last_reviewed: "2026-04-12"
tags: ["mcp", "index"]
---

# MCP 서버 해설

> **MCP(Model Context Protocol)** 는 Claude Code에 외부 도구·데이터 소스를 연결하는 표준 프로토콜입니다. `.claude/settings.json`의 `mcpServers` 설정으로 활성화합니다.

<CardGrid>
  <CardItem
    title="Sequential Thinking"
    tag="추론"
    summary="복잡한 문제를 단계별 추론으로 분해 — 알고리즘 설계·아키텍처 결정에 필수"
    link="/mcp/sequential-thinking"
  />
  <CardItem
    title="GitHub MCP"
    tag="버전 관리"
    summary="Claude Code에서 GitHub API 직접 호출 — PR 관리, 이슈 트래킹, 코드 검색"
    link="/mcp/github-mcp"
  />
  <CardItem
    title="Filesystem MCP"
    tag="파일 시스템"
    summary="로컬 파일 시스템 안전 접근 — 프로젝트 파일 읽기·쓰기·구조 분석"
    link="/mcp/filesystem-mcp"
  />
  <CardItem
    title="Fetch MCP"
    tag="웹 크롤링"
    summary="URL 내용 가져오기 + HTML → Markdown 변환 — 리서치·자료 수집 자동화"
    link="/mcp/fetch-mcp"
  />
  <CardItem
    title="Supabase MCP"
    tag="데이터베이스"
    summary="Supabase DB 직접 조작 — 풀스택 프로젝트의 데이터베이스 작업 자동화"
    link="/mcp/supabase-mcp"
  />
</CardGrid>

## MCP 기본 설치 방법

```json
// .claude/settings.json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": { "API_KEY": "${YOUR_API_KEY}" }
    }
  }
}
```

더 많은 MCP 서버를 찾으려면 [생태계 탐색 허브](/ecosystem/)를 참고하세요.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://modelcontextprotocol.io/ |
| 라이선스 | 각 서버별 상이 (MIT 다수) |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |

> ⚠️ 각 MCP 서버의 저작권은 원 저자에게 있습니다. 설치 전 각 레포의 라이선스를 반드시 확인하세요.
