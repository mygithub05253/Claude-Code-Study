/**
 * SKILL.md 파서.
 *
 * 입력: 파일 경로 또는 파일 내용 문자열
 * 출력: {@link ParsedSkill} 구조
 *
 * 책임:
 * 1. gray-matter로 frontmatter 분리
 * 2. zod로 frontmatter 검증 + 카멜 케이스 정규화
 * 3. 본문을 `## 제목` 기준으로 섹션 분할
 * 4. 첫 헤더(H1/H2) 뒤의 리드 문단 추출
 * 5. SHA-256 해시 계산 (변경 감지용)
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import type { MarkdownSection, ParsedSkill, SkillFrontmatter } from "./types.js";
import { normalizeFrontmatter, skillFrontmatterSchema } from "./schemas.js";
import { sha256 } from "./utils/hash.js";

/**
 * 파일 경로로부터 SKILL.md를 읽어서 파싱한다.
 */
export async function parseSkillFile(filePath: string): Promise<ParsedSkill> {
  const content = await fs.readFile(filePath, "utf8");
  return parseSkillContent(content, filePath);
}

/**
 * 이미 메모리에 로드된 문자열 내용을 파싱한다.
 * @param content SKILL.md 전체 내용
 * @param sourcePath 원본 파일 경로 (절대 경로 권장)
 */
export function parseSkillContent(content: string, sourcePath: string): ParsedSkill {
  // 1) frontmatter 분리
  const parsed = matter(content);

  // 2) zod 검증
  const validationResult = skillFrontmatterSchema.safeParse(parsed.data);
  if (!validationResult.success) {
    const issues = validationResult.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`frontmatter 검증 실패 (${sourcePath}): ${issues}`);
  }
  const normalized = normalizeFrontmatter(validationResult.data);

  // 3) 디렉토리 이름과 name 필드 불일치 경고 (디렉토리 기준 우선)
  const dirName = path.basename(path.dirname(sourcePath));
  const frontmatter: SkillFrontmatter = {
    ...normalized,
    // 디렉토리 이름이 있으면 그것을 최종 이름으로 사용
    name: dirName || normalized.name,
  };

  // 4) 섹션 분할
  const body = parsed.content;
  const sections = splitIntoSections(body);
  const lead = extractLead(body);

  // 5) 해시 계산 (frontmatter 원본 + 본문)
  const hashInput = `${JSON.stringify(parsed.data)}\n---\n${body}`;
  const contentHash = sha256(hashInput);

  return {
    name: frontmatter.name,
    sourcePath,
    frontmatter,
    rawBody: body,
    lead,
    sections,
    contentHash,
    parsedAt: new Date().toISOString(),
  };
}

/**
 * 본문을 `#`/`##`/`###` ... 헤더 기준으로 섹션 배열로 분할한다.
 * 헤더가 없는 본문은 빈 배열을 반환한다.
 */
function splitIntoSections(body: string): MarkdownSection[] {
  const lines = body.split(/\r?\n/);
  const sections: MarkdownSection[] = [];

  let currentTitle: string | null = null;
  let currentLevel = 0;
  let currentBodyLines: string[] = [];
  let inCodeBlock = false;

  const flush = (): void => {
    if (currentTitle !== null) {
      sections.push({
        title: currentTitle,
        level: currentLevel,
        body: currentBodyLines.join("\n").trim(),
      });
    }
  };

  for (const line of lines) {
    // 코드 블록 내부에서는 `#` 헤더로 취급하지 않음
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      currentBodyLines.push(line);
      continue;
    }
    if (inCodeBlock) {
      currentBodyLines.push(line);
      continue;
    }
    const headerMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (headerMatch) {
      flush();
      currentLevel = headerMatch[1]?.length ?? 1;
      currentTitle = headerMatch[2] ?? "";
      currentBodyLines = [];
    } else {
      currentBodyLines.push(line);
    }
  }
  flush();

  return sections;
}

/**
 * 첫 헤더 뒤에서 첫 비어있지 않은 문단을 리드로 추출한다.
 * 해설 생성 시 "스킬이 무엇을 하는가"를 간단히 전달하는 용도.
 */
function extractLead(body: string): string {
  const lines = body.split(/\r?\n/);
  let afterFirstHeader = false;
  const leadLines: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    if (/^#{1,6}\s+/.test(line)) {
      if (!afterFirstHeader) {
        afterFirstHeader = true;
        continue;
      }
      // 두 번째 헤더에서 중단
      break;
    }
    if (!afterFirstHeader) continue;
    if (line.trim() === "") {
      if (leadLines.length > 0) break;
      continue;
    }
    leadLines.push(line.trim());
  }
  return leadLines.join(" ");
}
