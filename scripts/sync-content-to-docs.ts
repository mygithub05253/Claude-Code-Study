/**
 * content/ko/{section}/*.md → apps/docs/{section}/*.md 복사 스크립트.
 *
 * Windows 환경에서도 동작하도록 심볼릭 링크 대신 단순 복사를 사용한다.
 * VitePress의 루트 경로(srcDir)는 `apps/docs`이므로,
 * 해설 파일들은 `apps/docs/{section}/` 아래에 있어야 라우트가 잡힌다.
 *
 * 동기화 대상 섹션은 SECTIONS 배열에 선언한다.
 * 언더스코어(_)로 시작하는 디렉토리(예: _templates)는 내부 참조용이므로 제외한다.
 *
 * 실행:
 *   pnpm sync-docs
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());

/** 동기화 대상 섹션 목록 (content/ko 하위 디렉토리명) */
const SECTIONS = [
  "skills",
  "mcp",
  "hooks",
  "agents",
  "repos",
  "use-cases",
  "my-collection",
  "prompts",
  "ecosystem",
] as const;

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** 한 섹션의 md 파일을 복사한다. stale 파일은 제거한다. */
async function syncSection(section: string): Promise<number> {
  const sourceDir = path.join(ROOT, "content", "ko", section);
  const destDir = path.join(ROOT, "apps", "docs", section);

  if (!(await exists(sourceDir))) {
    console.warn(`[sync-docs] 건너뜀 (원본 없음): ${section}`);
    return 0;
  }

  await fs.mkdir(destDir, { recursive: true });

  const sourceFiles = await fs.readdir(sourceDir);
  const mdFiles = sourceFiles.filter((f) => f.endsWith(".md"));
  const sourceSet = new Set(mdFiles);

  // 대상 디렉토리에서 stale 파일 제거.
  // 단, 원본에 index.md가 없다면 대상의 index.md는 보존한다
  // (skills 섹션은 apps/docs/skills/index.md 가 직접 관리됨).
  const existingFiles = await fs.readdir(destDir);
  for (const file of existingFiles) {
    if (!file.endsWith(".md")) continue;
    if (file === "index.md" && !sourceSet.has("index.md")) continue;
    if (sourceSet.has(file)) continue;
    await fs.unlink(path.join(destDir, file));
  }

  for (const file of mdFiles) {
    await fs.copyFile(path.join(sourceDir, file), path.join(destDir, file));
    console.log(`  → ${section}/${file}`);
  }

  return mdFiles.length;
}

async function main(): Promise<void> {
  let total = 0;
  for (const section of SECTIONS) {
    total += await syncSection(section);
  }
  console.log(`[sync-docs] 완료: ${total}개 파일 복사 (${SECTIONS.length}개 섹션)`);
}

main().catch((error: unknown) => {
  console.error("[sync-docs] 치명적 오류:", error);
  process.exit(1);
});
