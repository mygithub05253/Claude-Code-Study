/**
 * 한국어 로케일용 themeConfig.
 * 루트 설정에서 spread로 병합한다.
 */

import type { DefaultTheme } from "vitepress";

export const koConfig: { themeConfig: DefaultTheme.Config } = {
  themeConfig: {
    logo: undefined,
    siteTitle: "Claude Code 학습 허브",

    nav: [
      { text: "홈", link: "/" },
      { text: "스킬", link: "/skills/" },
      {
        text: "리소스",
        items: [
          { text: "GitHub 레포", link: "https://github.com/mygithub05253/Claude-Code-Study" },
          { text: "공식 문서", link: "https://docs.claude.com/claude-code" },
          { text: "PRD", link: "https://github.com/mygithub05253/Claude-Code-Study/blob/main/docs/PRD.md" },
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
      message: "MIT License · 원본 Claude Code 리소스 저작권은 각 소유자에게 있습니다",
      copyright: "© 2026 Claude-Code-Study",
    },

    outline: {
      label: "이 페이지 내 목차",
      level: [2, 3],
    },

    docFooter: {
      prev: "이전",
      next: "다음",
    },

    lastUpdated: {
      text: "마지막 업데이트",
      formatOptions: {
        dateStyle: "medium",
      },
    },

    darkModeSwitchLabel: "테마",
    sidebarMenuLabel: "메뉴",
    returnToTopLabel: "맨 위로",
    externalLinkIcon: true,

    editLink: {
      pattern:
        "https://github.com/mygithub05253/Claude-Code-Study/edit/main/content/ko/:path",
      text: "GitHub에서 이 페이지 수정하기",
    },
  },
};
