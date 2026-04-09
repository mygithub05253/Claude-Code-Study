/**
 * content/ko/skills/ 아래 md 파일들을 스캔해 VitePress 사이드바를 자동 생성한다.
 *
 * 빌드 시점(config 로드 시)에 동기적으로 동작한다.
 * 새 해설이 추가되면 별도 수정 없이 자동 반영된다.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { DefaultTheme } from "vitepress";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** apps/docs/.vitepress에서 상위로 올라가 skills 페이지 디렉토리를 찾는다. */
const SKILLS_DIR = resolve(__dirname, "..", "skills");

/**
 * md 파일의 frontmatter에서 title을 정규식으로 추출한다.
 * gray-matter를 추가로 설치하지 않고 최소 파싱한다.
 */
function extractTitle(filePath: string, fallback: string): string {
  try {
    const content = readFileSync(filePath, "utf8");
    const match = /^title:\s*"([^"]+)"/m.exec(content);
    return match?.[1]?.trim() ?? fallback;
  } catch {
    return fallback;
  }
}

/** 사이드바 항목 목록을 정렬 순서대로 생성한다. */
export function generateSkillSidebar(): DefaultTheme.SidebarItem[] {
  if (!existsSync(SKILLS_DIR)) {
    return [
      {
        text: "스킬",
        items: [{ text: "준비 중", link: "/skills/" }],
      },
    ];
  }

  const files = readdirSync(SKILLS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort();

  const items: DefaultTheme.SidebarItem[] = files.map((file) => {
    const name = file.replace(/\.md$/, "");
    const title = extractTitle(join(SKILLS_DIR, file), name);
    return {
      text: title,
      link: `/skills/${name}`,
    };
  });

  return [
    {
      text: "스킬 해설",
      collapsed: false,
      items,
    },
  ];
}
