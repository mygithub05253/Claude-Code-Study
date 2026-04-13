/**
 * VitePress 루트 설정.
 *
 * Phase 7에서 영어(en) 로케일 추가.
 * root = 한국어(ko), /en/ = 영어, /ja/ = 일본어(P2)
 */

import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

import { koConfig } from "./config/ko.js";
import { enConfig } from "./config/en.js";
import { generateSectionSidebar, generateSkillSidebar } from "./sidebar.js";

const base = "/Claude-Code-Study/";
const hostname = "https://mygithub05253.github.io/Claude-Code-Study/";

/** 영어 사이드바 (en/ 서브경로) */
function enSidebar() {
  return {
    "/en/skills/": generateSkillSidebar("en"),
    "/en/mcp/": generateSectionSidebar("mcp", "MCP Servers", "Coming soon", "en"),
    "/en/hooks/": generateSectionSidebar("hooks", "Hooks Recipes", "Coming soon", "en"),
    "/en/agents/": generateSectionSidebar("agents", "Agent Patterns", "Coming soon", "en"),
    "/en/repos/": generateSectionSidebar("repos", "GitHub Repos", "Coming soon", "en"),
    "/en/use-cases/": generateSectionSidebar("use-cases", "Use Cases", "Coming soon", "en"),
    "/en/my-collection/": generateSectionSidebar("my-collection", "My Collection", "Coming soon", "en"),
    "/en/prompts/": generateSectionSidebar("prompts", "Prompt Library", "Coming soon", "en"),
    "/en/ecosystem/": generateSectionSidebar("ecosystem", "Ecosystem", "Coming soon", "en"),
  };
}

export default withMermaid(defineConfig({
  base,
  lang: "ko-KR",
  title: "Claude Code 학습 허브",
  description:
    "한국 대학생 관점으로 Claude Code의 Skills / Agents / MCP / Plugins를 한국어로 이해하고 커스터마이징하는 오픈소스 학습 허브",
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname,
  },

  head: [
    ["meta", { name: "theme-color", content: "#0ea5e9" }],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "og:title", content: "Claude Code 학습 허브" }],
    [
      "meta",
      {
        name: "og:description",
        content: "한국어로 이해하는 Claude Code Skills / Agents / MCP / Plugins",
      },
    ],
  ],

  locales: {
    root: {
      label: "한국어",
      lang: "ko-KR",
    },
    en: {
      label: "English",
      lang: "en-US",
      title: "Claude Code Learning Hub",
      description: "An open-source learning hub for understanding and customizing Claude Code Skills / Agents / MCP / Plugins",
      themeConfig: {
        ...enConfig.themeConfig,
        sidebar: enSidebar(),
      },
    },
  },

  themeConfig: {
    ...koConfig.themeConfig,
    sidebar: {
      "/skills/": generateSkillSidebar(),
      "/mcp/": generateSectionSidebar("mcp", "MCP 서버"),
      "/hooks/": generateSectionSidebar("hooks", "Hooks 레시피"),
      "/agents/": generateSectionSidebar("agents", "Agents 패턴"),
      "/repos/": generateSectionSidebar("repos", "GitHub 레포"),
      "/use-cases/": generateSectionSidebar("use-cases", "Use Cases"),
      "/my-collection/": generateSectionSidebar("my-collection", "My Collection"),
      "/prompts/": generateSectionSidebar("prompts", "프롬프트 모음"),
      "/ecosystem/": generateSectionSidebar("ecosystem", "생태계 탐색"),
    },
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "검색",
                buttonAriaLabel: "사이트 검색",
              },
              modal: {
                noResultsText: "검색 결과가 없습니다",
                resetButtonTitle: "검색어 지우기",
                footer: {
                  selectText: "선택",
                  navigateText: "이동",
                  closeText: "닫기",
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: "Search",
                buttonAriaLabel: "Search docs",
              },
              modal: {
                noResultsText: "No results for",
                resetButtonTitle: "Clear search query",
                footer: {
                  selectText: "to select",
                  navigateText: "to navigate",
                  closeText: "to close",
                },
              },
            },
          },
        },
      },
    },
  },
}));
