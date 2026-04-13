---
title: "MCP Servers"
lang: en
category: mcp
source_url: "https://modelcontextprotocol.io/"
source_author: "Anthropic & Community"
license: "Varies by server"
last_reviewed: "2026-04-12"
tags: ["mcp", "index"]
---

# MCP Server Guide

> **MCP (Model Context Protocol)** is the standard protocol for connecting external tools and data sources to Claude Code. It is activated through the `mcpServers` setting in `.claude/settings.json`.

<CardGrid>
  <CardItem
    title="Sequential Thinking"
    tag="Reasoning"
    summary="Break down complex problems with step-by-step reasoning — essential for algorithm design and architecture decisions"
    link="/en/mcp/sequential-thinking"
  />
  <CardItem
    title="GitHub MCP"
    tag="Version Control"
    summary="Call GitHub API directly from Claude Code — PR management, issue tracking, code search"
    link="/en/mcp/github-mcp"
  />
  <CardItem
    title="Filesystem MCP"
    tag="File System"
    summary="Safe access to the local file system — read, write, and analyze project files"
    link="/en/mcp/filesystem-mcp"
  />
  <CardItem
    title="Fetch MCP"
    tag="Web Scraping"
    summary="Fetch URL content + HTML to Markdown conversion — automate research and data collection"
    link="/en/mcp/fetch-mcp"
  />
  <CardItem
    title="Supabase MCP"
    tag="Database"
    summary="Directly manage Supabase DB — automate database operations in full-stack projects"
    link="/en/mcp/supabase-mcp"
  />
</CardGrid>

## Basic MCP Installation

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

To discover more MCP servers, see the [Ecosystem Explorer Hub](/ecosystem/).

---

| Field | Value |
|---|---|
| Source URL | https://modelcontextprotocol.io/ |
| License | Varies by server (MIT for many) |
| Translation Date | 2026-04-12 |
| Author | Claude-Code-Study Project |

> Each MCP server's copyright belongs to its original author. Always check each repository's license before installing.
