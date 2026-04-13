---
title: "modelcontextprotocol/servers"
category: repos
lang: en
source_url: "https://github.com/modelcontextprotocol/servers"
source_author: "Anthropic (Model Context Protocol)"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["repos", "mcp", "official", "servers", "anthropic", "filesystem", "github", "fetch"]
---

# modelcontextprotocol/servers

## One-Line Summary

The official Anthropic-managed collection repo of MCP servers, containing the source code of reference implementations that can be integrated with Claude.

## Why Should You Pay Attention?

- **Officially maintained by Anthropic**: A trustworthy implementation maintained directly by Anthropic, not a community version
- **Reference implementation**: When building your own MCP server, you can learn patterns by referencing this code
- **Ready to use immediately**: All servers can be run without installation using a single npx command
- The `filesystem-mcp`, `github-mcp`, `fetch-mcp`, and `sequential-thinking` explanations in this project all originate from this repo

## Core Features

### List of Included Official Servers

| Server | Package Name | Key Features |
|---|---|---|
| filesystem | `@modelcontextprotocol/server-filesystem` | Local file read/write |
| github | `@modelcontextprotocol/server-github` | GitHub API integration |
| fetch | `@modelcontextprotocol/server-fetch` | HTTP request execution |
| sequential-thinking | `@modelcontextprotocol/server-sequential-thinking` | Sequential thinking structuring |
| postgres | `@modelcontextprotocol/server-postgres` | Direct PostgreSQL connection |
| sqlite | `@modelcontextprotocol/server-sqlite` | SQLite file manipulation |
| puppeteer | `@modelcontextprotocol/server-puppeteer` | Browser automation |
| brave-search | `@modelcontextprotocol/server-brave-search` | Brave web search |
| google-maps | `@modelcontextprotocol/server-google-maps` | Map/place search |
| slack | `@modelcontextprotocol/server-slack` | Slack message sending |
| memory | `@modelcontextprotocol/server-memory` | Knowledge graph-based memory |
| everything | `@modelcontextprotocol/server-everything` | All-in-one server for testing |

### Repo Structure

```
servers/
├── src/
│   ├── filesystem/     # Filesystem server source
│   ├── github/         # GitHub server source
│   ├── fetch/          # Fetch server source
│   ├── sequentialthinking/  # Sequential thinking server source
│   └── ...
├── package.json        # pnpm workspace monorepo
└── README.md
```

Each server is published as an independent npm package, and you can read the source code directly to learn how to implement an MCP server.

### MCP Server Implementation Pattern

The servers in this repo commonly follow this pattern:

```
1. Initialize MCP server with @modelcontextprotocol/sdk
2. Define tool schemas (JSON Schema) with tool() method
3. Implement actual logic in the tool handler
4. Communicate with Claude via stdio or SSE transport
```

If you want to build your own MCP server, it is recommended to start by analyzing the simpler servers (fetch, filesystem) in this repo.

## University Student Use Cases

**Scenario**: Maximizing Claude Code productivity on a team project for a Next.js 15 "Student Club Notice Board."

**Scenario 1: Immediate Use — filesystem + github Combination**

In the early stages of notice board development, adding the following two servers to `settings.json` lets Claude read files directly and create GitHub issues. It is recommended to start with the configuration below.

Configuration example:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\yourname\\workspace\\club-notice-board"
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

**Scenario 2: Custom MCP Server Development (Capstone Project)**

When building a custom server like a "Club Calendar Integration MCP Server," reference `src/fetch/index.ts` or `src/filesystem/index.ts` in this repo for your implementation. Simply follow the TypeScript + MCP SDK pattern.

**Scenario 3: Direct Dev DB Manipulation with the postgres Server**

By connecting a local PostgreSQL development DB with the `postgres` MCP server, you can execute queries while conversing with Claude without Supabase Studio.

**Scenario 4: E2E Test Automation with the puppeteer Server**

Connecting the `puppeteer` server lets you request "run an E2E test from notice board login to notice creation."

## Reference Links

- GitHub: https://github.com/modelcontextprotocol/servers
- MCP official site: https://modelcontextprotocol.io
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP server implementation guide: https://modelcontextprotocol.io/docs/concepts/servers

---

| Field | Value |
|---|---|
| Source URL | https://github.com/modelcontextprotocol/servers |
| License | MIT |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |
