/**
 * 해시 기반 캐시 유틸리티.
 *
 * 이미 생성된 해설 MD의 frontmatter에서 `sourceHash`와 `promptVersion`을 읽어,
 * 현재 스킬의 해시/프롬프트와 비교해 재생성이 필요한지 판단한다.
 */

import fs from "node:fs/promises";
import path from "node:path";

export interface CachedMetadata {
  sourceHash?: string;
  promptVersion?: string;
}

/**
 * 기존 해설 MD 파일에서 frontmatter의 sourceHash와 promptVersion만 단순 추출한다.
 * gray-matter를 쓰지 않고 정규표현식으로 최소 파싱한다.
 */
export async function readCachedMetadata(filePath: string): Promise<CachedMetadata | null> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
    if (!fmMatch?.[1]) return null;
    const fmBody = fmMatch[1];

    const hashMatch = /sourceHash:\s*"?([^"\n]+)"?/.exec(fmBody);
    const versionMatch = /promptVersion:\s*"?([^"\n]+)"?/.exec(fmBody);
    return {
      sourceHash: hashMatch?.[1]?.trim(),
      promptVersion: versionMatch?.[1]?.trim(),
    };
  } catch {
    return null;
  }
}

/**
 * 재생성이 필요한지 판단.
 * 파일이 없거나, 해시/프롬프트 버전이 다르면 true.
 */
export async function shouldRegenerate(
  filePath: string,
  currentHash: string,
  currentPromptVersion: string,
): Promise<boolean> {
  const cached = await readCachedMetadata(filePath);
  if (!cached) return true;
  if (cached.sourceHash !== currentHash) return true;
  if (cached.promptVersion !== currentPromptVersion) return true;
  return false;
}

/**
 * 해설 MD의 기본 출력 경로를 결정한다.
 * 관례: `content/ko/skills/<skill-name>.md`
 */
export function getExplanationOutputPath(contentRoot: string, skillName: string): string {
  return path.join(contentRoot, "ko", "skills", `${skillName}.md`);
}
