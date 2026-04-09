/**
 * content/ko/skills/*.md → apps/docs/skills/*.md 복사 스크립트.
 *
 * Windows 환경에서도 동작하도록 심볼릭 링크 대신 단순 복사를 사용한다.
 * VitePress의 루트 경로(srcDir)는 `apps/docs`이므로,
 * 해설 파일들은 `apps/docs/skills/` 아래에 있어야 라우트가 잡힌다.
 *
 * 실행:
 *   pnpm sync-docs
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SOURCE_DIR = path.join(ROOT, "content", "ko", "skills");
const DEST_DIR = path.join(ROOT, "apps", "docs", "skills");

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  if (!(await exists(SOURCE_DIR))) {
    console.error(`[sync-docs] 원본 디렉토리가 없습니다: ${SOURCE_DIR}`);
    process.exit(1);
  }

  await fs.mkdir(DEST_DIR, { recursive: true });

  // 대상 디렉토리에서 index.md를 제외한 기존 md 파일 제거 (stale 파일 방지)
  const existingFiles = await fs.readdir(DEST_DIR);
  for (const file of existingFiles) {
    if (file.endsWith(".md") && file !== "index.md") {
      await fs.unlink(path.join(DEST_DIR, file));
    }
  }

  const sourceFiles = await fs.readdir(SOURCE_DIR);
  const mdFiles = sourceFiles.filter((f) => f.endsWith(".md"));

  let copied = 0;
  for (const file of mdFiles) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(DEST_DIR, file);
    await fs.copyFile(src, dest);
    copied += 1;
    console.log(`  → ${file}`);
  }

  console.log(`[sync-docs] 완료: ${copied}개 파일 복사`);
}

main().catch((error: unknown) => {
  console.error("[sync-docs] 치명적 오류:", error);
  process.exit(1);
});
