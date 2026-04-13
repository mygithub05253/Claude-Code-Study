/**
 * 영어(en) 로케일용 themeConfig.
 * config.ts의 locales.en에서 참조한다.
 */

import type { DefaultTheme } from "vitepress";

export const enConfig: { themeConfig: DefaultTheme.Config } = {
  themeConfig: {
    logo: undefined,
    siteTitle: "Claude Code Learning Hub",

    nav: [
      { text: "Home", link: "/en/" },
      { text: "Skills", link: "/en/skills/" },
      {
        text: "Resources",
        items: [
          { text: "MCP Servers", link: "/en/mcp/" },
          { text: "Hooks", link: "/en/hooks/" },
          { text: "Agents", link: "/en/agents/" },
          { text: "GitHub Repos", link: "/en/repos/" },
          { text: "Ecosystem Explorer", link: "/en/ecosystem/" },
        ],
      },
      {
        text: "Usage",
        items: [
          { text: "Use Cases", link: "/en/use-cases/" },
          { text: "My Collection", link: "/en/my-collection/" },
          { text: "Prompt Library", link: "/en/prompts/" },
        ],
      },
      {
        text: "Project",
        items: [
          { text: "GitHub Repository", link: "https://github.com/mygithub05253/Claude-Code-Study" },
          { text: "Official Docs", link: "https://docs.claude.com/claude-code" },
          {
            text: "PRD",
            link: "https://github.com/mygithub05253/Claude-Code-Study/blob/main/docs/PRD.md",
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/mygithub05253/Claude-Code-Study",
      },
    ],

    footer: {
      message: "MIT License · Original Claude Code resources copyright belongs to their respective owners",
      copyright: "© 2026 Claude-Code-Study",
    },

    outline: {
      label: "On this page",
      level: [2, 3],
    },

    docFooter: {
      prev: "Previous",
      next: "Next",
    },

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
      },
    },

    darkModeSwitchLabel: "Theme",
    sidebarMenuLabel: "Menu",
    returnToTopLabel: "Return to top",
    externalLinkIcon: true,

    editLink: {
      pattern: "https://github.com/mygithub05253/Claude-Code-Study/edit/main/content/en/:path",
      text: "Edit this page on GitHub",
    },
  },
};
