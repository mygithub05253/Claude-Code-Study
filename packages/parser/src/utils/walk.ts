/**
 * 파일 시스템 탐색 유틸리티.
 * `fast-glob`을 사용하여 Windows/Linux 양쪽에서 동작한다.
 */

import fg from "fast-glob";
import path from "node:path";

/**
 * 주어진 루트 경로에서 `skills/\*\/SKILL.md` 패턴으로 스킬 파일을 찾는다.
 * @param claudeRoot `~/.claude` 디렉토리 (절대 경로)
 * @returns 발견된 SKILL.md 파일의 절대 경로 목록
 */
export async function findSkillFiles(claudeRoot: string): Promise<string[]> {
  const skillsDir = path.join(claudeRoot, "skills");
  // fast-glob은 POSIX 스타일 경로를 기대하므로 Windows 백슬래시를 변환한다.
  const pattern = path.join(skillsDir, "*", "SKILL.md").replace(/\\/g, "/");

  const files = await fg(pattern, {
    absolute: true,
    onlyFiles: true,
    // 심볼릭 링크는 따라가되 무한 루프 방지
    followSymbolicLinks: false,
  });

  // 반환값도 OS에 맞는 경로로 정규화
  return files.map((f) => path.normalize(f));
}
