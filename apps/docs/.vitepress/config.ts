/**
 * VitePress 루트 설정.
 *
 * 현재는 한국어(ko) 로케일만 활성화되어 있다.
 * Phase 5(P1)에서 영어, Phase 6(P2)에서 일본어 로케일을 추가한다.
 */

import { defineConfig } from "vitepress";

import { koConfig } from "./config/ko.js";
import { generateSectionSidebar, generateSkillSidebar } from "./sidebar.js";

const base = "/Claude-Code-Study/";

export default defineConfig({
  base,
  lang: "ko-KR",
  title: "Claude Code 학습 허브",
  description:
    "한국 대학생 관점으로 Claude Code의 Skills / Agents / MCP / Plugins를 한국어로 이해하고 커스터마이징하는 오픈소스 학습 허브",
  cleanUrls: true,
  lastUpdated: true,

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
        },
      },
    },
  },
});
