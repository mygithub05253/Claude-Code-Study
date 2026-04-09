/**
 * Parser CLI 진입점.
 *
 * 사용 예:
 *   pnpm --filter @claude-code-study/parser run cli -- \
 *     --input ~/.claude --output content/raw/skills.json
 *
 * 옵션:
 *   --input  <dir>   Claude 설정 루트 (기본: ~/.claude)
 *   --output <file>  출력 JSON 경로 (기본: content/raw/skills.json)
 *   --verbose        상세 로그
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parseSkillFile } from "./parseSkill.js";
import type { ParseResult } from "./types.js";
import { findSkillFiles } from "./utils/walk.js";

interface CliOptions {
  input: string;
  output: string;
  verbose: boolean;
}

/**
 * 간단한 인자 파서. commander 의존성 없이 경량으로 유지한다.
 */
function parseArgs(argv: string[]): CliOptions {
  const defaults: CliOptions = {
    input: path.join(os.homedir(), ".claude"),
    output: path.join(process.cwd(), "content", "raw", "skills.json"),
    verbose: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input" && argv[i + 1]) {
      defaults.input = expandHome(argv[i + 1] ?? "");
      i += 1;
    } else if (arg === "--output" && argv[i + 1]) {
      defaults.output = path.resolve(argv[i + 1] ?? "");
      i += 1;
    } else if (arg === "--verbose" || arg === "-v") {
      defaults.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return defaults;
}

function expandHome(input: string): string {
  if (input.startsWith("~")) {
    return path.join(os.homedir(), input.slice(1));
  }
  return path.resolve(input);
}

function printHelp(): void {
  const helpText = `
@claude-code-study/parser CLI

사용법:
  parser [옵션]

옵션:
  --input  <dir>   Claude 설정 루트 (기본: ~/.claude)
  --output <file>  출력 JSON 경로 (기본: content/raw/skills.json)
  --verbose, -v    상세 로그 출력
  --help, -h       도움말

예:
  parser --input ~/.claude --output content/raw/skills.json
`.trim();
  console.log(helpText);
}

/**
 * 메인 실행 함수. 스킬을 파싱하여 JSON으로 저장한다.
 */
async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.verbose) {
    console.log(`[parser] 입력 루트: ${options.input}`);
    console.log(`[parser] 출력 경로: ${options.output}`);
  }

  const files = await findSkillFiles(options.input);
  if (options.verbose) {
    console.log(`[parser] 스캔된 SKILL.md: ${files.length}개`);
  }

  const result: ParseResult = {
    skills: [],
    errors: [],
    totalScanned: files.length,
    totalSucceeded: 0,
  };

  for (const file of files) {
    try {
      const skill = await parseSkillFile(file);
      // 파일 경로는 사용자 민감 정보를 일부 포함할 수 있으므로
      // 출력 JSON에는 홈 디렉토리를 `~`로 대체한다.
      const homeDir = os.homedir();
      const redactedPath = file.startsWith(homeDir) ? "~" + file.slice(homeDir.length) : file;
      result.skills.push({
        ...skill,
        sourcePath: redactedPath,
      });
      result.totalSucceeded += 1;
      if (options.verbose) {
        console.log(`  ✓ ${skill.name}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({ path: file, message });
      console.error(`  ✗ ${path.basename(path.dirname(file))}: ${message}`);
    }
  }

  // 안정적 순서 보장 (이름순)
  result.skills.sort((a, b) => a.name.localeCompare(b.name));

  // 출력 디렉토리 확인 및 저장
  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, JSON.stringify(result, null, 2) + "\n", "utf8");

  console.log(
    `[parser] 완료: ${result.totalSucceeded}/${result.totalScanned}개 성공, 실패 ${result.errors.length}개`,
  );
  console.log(`[parser] 결과: ${options.output}`);

  if (result.errors.length > 0) {
    // 실패가 있으면 비정상 종료 (CI에서 감지 가능)
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error("[parser] 치명적 오류:", error);
  process.exit(1);
});
