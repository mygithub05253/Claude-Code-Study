/**
 * apps/docs/{section}/ 아래 md 파일들을 스캔해 VitePress 사이드바를 자동 생성한다.
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

/** apps/docs 루트 (이 파일 기준 상위) */
const DOCS_ROOT = resolve(__dirname, "..");

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

/**
 * 지정한 섹션 디렉토리의 md 파일을 스캔해 사이드바 항목을 생성한다.
 *
 * @param section 디렉토리명 (예: "skills", "mcp")
 * @param heading 사이드바 상단 제목
 * @param placeholder 아직 파일이 없을 때 보여줄 안내 텍스트
 */
export function generateSectionSidebar(
  section: string,
  heading: string,
  placeholder = "준비 중",
): DefaultTheme.SidebarItem[] {
  const sectionDir = resolve(DOCS_ROOT, section);

  if (!existsSync(sectionDir)) {
    return [
      {
        text: heading,
        items: [{ text: placeholder, link: `/${section}/` }],
      },
    ];
  }

  const files = readdirSync(sectionDir)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort();

  const items: DefaultTheme.SidebarItem[] = files.map((file) => {
    const name = file.replace(/\.md$/, "");
    const title = extractTitle(join(sectionDir, file), name);
    return {
      text: title,
      link: `/${section}/${name}`,
    };
  });

  if (items.length === 0) {
    return [
      {
        text: heading,
        items: [{ text: placeholder, link: `/${section}/` }],
      },
    ];
  }

  return [
    {
      text: heading,
      collapsed: false,
      items,
    },
  ];
}

/** 하위 호환: 기존 config에서 참조하던 함수 */
export function generateSkillSidebar(): DefaultTheme.SidebarItem[] {
  return generateSectionSidebar("skills", "스킬 해설");
}
