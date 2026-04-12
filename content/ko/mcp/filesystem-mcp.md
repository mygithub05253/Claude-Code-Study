---
title: "filesystem-mcp"
category: mcp
source_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem"
source_author: "Anthropic (Model Context Protocol)"
license: "MIT (확인 필요)"
last_reviewed: "2026-04-12"
tags: ["mcp", "filesystem", "files", "local", "claude-desktop"]
---

# filesystem-mcp

## 한 줄 요약

지정된 로컬 디렉토리에 한정해 파일을 읽고 쓸 수 있게 하는 MCP 서버로, Claude Desktop에서 프로젝트 파일을 안전하게 다룰 수 있습니다.

## 언제 사용하나요?

- Claude Desktop에서 로컬 프로젝트 파일을 직접 읽고 수정하고 싶을 때
- 특정 폴더만 허용해 Claude의 파일 접근 범위를 제한하고 싶을 때
- 여러 파일을 한 번에 분석하거나 일괄 수정 작업을 Claude에게 맡기고 싶을 때
- Claude Code CLI 없이 Claude Desktop 환경에서도 파일 작업이 필요할 때

## 핵심 개념

`filesystem-mcp`는 허용된 디렉토리 경로를 설정에 명시하고, 그 범위 내에서만 파일 조작을 허용합니다. 경로 탈출(path traversal) 공격을 방지하는 안전한 샌드박스 방식입니다.

### 제공 도구 목록

| 도구 | 설명 |
|---|---|
| `read_file` | 단일 파일 전체 내용 읽기 |
| `read_multiple_files` | 여러 파일을 한 번에 읽기 |
| `write_file` | 파일 생성 또는 덮어쓰기 |
| `edit_file` | 기존 파일의 특정 부분만 수정 (검색 & 교체) |
| `create_directory` | 디렉토리 생성 |
| `list_directory` | 디렉토리 내 파일/폴더 목록 조회 |
| `directory_tree` | 트리 형태로 디렉토리 구조 출력 |
| `move_file` | 파일 이동 또는 이름 변경 |
| `search_files` | 파일명 패턴으로 파일 검색 |
| `search_file_content` | 파일 내용을 정규식으로 검색 |
| `get_file_info` | 파일 메타데이터 조회 (크기, 날짜 등) |
| `list_allowed_directories` | 현재 허용된 디렉토리 목록 확인 |

### 보안 모델

- 설정 파일에 명시한 경로만 접근 가능
- 심볼릭 링크를 통한 허용 범위 밖 접근 차단
- 상대 경로(`../`) 탈출 시도 차단

## 설치 및 설정

### 사전 요구사항

- Node.js 18+
- 접근을 허용할 로컬 디렉토리 경로

### Claude Code `.claude/settings.json` 설정

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects",
        "/Users/username/Documents"
      ]
    }
  }
}
```

### Windows 경로 예시

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\kik32\\workspace\\club-notice-board",
        "C:\\Users\\kik32\\Documents\\notes"
      ]
    }
  }
}
```

### Claude Desktop `claude_desktop_config.json` 설정 (macOS 예시)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/workspace/club-notice-board"
      ]
    }
  }
}
```

**핵심**: `args` 배열에서 패키지 이름 뒤에 오는 항목들이 허용 경로입니다. 여러 경로를 공백으로 나열할 수 있습니다.

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트를 Claude Desktop에서 분석하고 수정하려 합니다. Claude Code CLI 대신 Claude Desktop을 사용하는 환경입니다.

**예제 1: 프로젝트 구조 파악**

```
club-notice-board 프로젝트 전체 디렉토리 트리를 보여줘.
그 다음 app/ 폴더 아래 모든 page.tsx 파일을 읽어서
라우팅 구조를 정리해줘.
```

**예제 2: 여러 파일 일괄 분석**

```
다음 파일들을 한 번에 읽어서 Supabase 클라이언트 초기화 방식이
서버/클라이언트 컴포넌트에서 어떻게 다른지 비교해줘:
- lib/supabase/server.ts
- lib/supabase/client.ts
- middleware.ts
```

**예제 3: 파일 내용 검색**

```
프로젝트 전체에서 "createServerClient" 함수가 사용되는
모든 파일을 찾아서 목록으로 보여줘.
```

**예제 4: 설정 파일 수정**

```
tailwind.config.ts 파일을 읽고,
darkMode를 'class' 방식으로 변경해줘.
변경 전후 diff도 보여줘.
```

## 학습 포인트

### 효과적인 사용 방법

- **최소 권한 원칙**: 허용 경로를 프로젝트 루트로 한정하세요. 홈 디렉토리 전체(`/Users/username`)를 허용하는 것은 위험합니다.
- **읽기 전용 작업 구분**: 분석만 필요한 경우 `read_file`과 `list_directory`만 사용하도록 프롬프트를 작성하면 실수로 파일이 변경되는 것을 방지할 수 있습니다.
- **`directory_tree` 선 실행**: 큰 프로젝트를 다룰 때는 먼저 `directory_tree`로 구조를 파악한 뒤 필요한 파일만 읽도록 유도하세요.

### 흔한 함정

- **Claude Code와 중복 사용 주의**: Claude Code CLI를 사용 중이라면 이미 파일 접근 기능이 내장되어 있습니다. Claude Desktop과 병행할 때만 이 MCP가 필요합니다.
- **대용량 파일 주의**: 수만 줄짜리 파일을 `read_file`로 읽으면 컨텍스트 창이 가득 찰 수 있습니다. `search_file_content`로 필요한 부분만 찾는 방식을 권장합니다.
- **write_file 덮어쓰기**: `write_file`은 기존 파일을 경고 없이 덮어씁니다. 중요한 파일 수정 전에는 반드시 백업하거나 git commit 후 진행하세요.
- **Windows 경로 구분자**: Windows에서는 경로에 `\\` 또는 `/`를 사용해야 합니다. JSON 내에서는 `\\`로 이스케이프해야 합니다.

### 보안 고려사항

- 허용 경로를 최대한 좁게 설정하세요. 민감한 정보(`.env`, SSH 키, 인증서)가 있는 디렉토리는 절대 포함하지 마세요.
- `write_file` 권한이 있으면 Claude가 실수로 설정 파일을 덮어쓸 수 있습니다. 중요 파일이 있는 경로는 읽기 전용으로 운영하는 것을 검토하세요.
- 팀 프로젝트에서 공유 설정 파일에 허용 경로를 커밋하지 마세요. 각자 로컬 경로가 다릅니다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
