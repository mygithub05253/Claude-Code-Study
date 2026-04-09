/**
 * 해설 생성 파이프라인 (MVP: 수동 모드).
 *
 * MVP에서는 Anthropic API를 직접 호출하지 않는다.
 * 대신 스킬별 프롬프트를 STDOUT/파일로 출력하여,
 * Claude Code CLI 세션이나 웹 UI에 복사-붙여넣기하여 수동으로 해설을 작성한다.
 *
 * P1 이후 `ANTHROPIC_API_KEY`가 설정되면 자동 호출로 확장할 수 있다.
 *
 * 사용 예:
 *   tsx packages/explainer/src/generate.ts \
 *     --input content/raw/skills.json \
 *     --only brainstorming,writing-plans \
 *     --prompts-out .prompts
 */

import fs from "node:fs/promises";
import path from "node:path";

import type { ParsedSkill, ParseResult } from "@claude-code-study/parser";
import { buildSkillExplainPromptKo, PROMPT_VERSION } from "./prompts/skillExplain.ko.js";
import { getExplanationOutputPath, shouldRegenerate } from "./cache.js";

interface GenerateOptions {
  input: string;
  contentRoot: string;
  only: string[] | null;
  promptsOut: string | null;
  force: boolean;
}

function parseArgs(argv: string[]): GenerateOptions {
  const options: GenerateOptions = {
    input: path.join(process.cwd(), "content", "raw", "skills.json"),
    contentRoot: path.join(process.cwd(), "content"),
    only: null,
    promptsOut: null,
    force: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input" && argv[i + 1]) {
      options.input = path.resolve(argv[i + 1] ?? "");
      i += 1;
    } else if (arg === "--content-root" && argv[i + 1]) {
      options.contentRoot = path.resolve(argv[i + 1] ?? "");
      i += 1;
    } else if (arg === "--only" && argv[i + 1]) {
      options.only = (argv[i + 1] ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      i += 1;
    } else if (arg === "--prompts-out" && argv[i + 1]) {
      options.promptsOut = path.resolve(argv[i + 1] ?? "");
      i += 1;
    } else if (arg === "--force") {
      options.force = true;
    }
  }
  return options;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const rawJson = await fs.readFile(options.input, "utf8");
  const parsed = JSON.parse(rawJson) as ParseResult;

  const targetSkills: ParsedSkill[] = options.only
    ? parsed.skills.filter((s) => options.only?.includes(s.name))
    : parsed.skills;

  console.log(
    `[explainer] 대상 스킬: ${targetSkills.length}개 (전체 ${parsed.skills.length}개 중)`,
  );

  if (options.promptsOut) {
    await fs.mkdir(options.promptsOut, { recursive: true });
  }

  let regenerateCount = 0;
  let skipCount = 0;

  for (const skill of targetSkills) {
    const outputPath = getExplanationOutputPath(options.contentRoot, skill.name);
    const needsRegen =
      options.force || (await shouldRegenerate(outputPath, skill.contentHash, PROMPT_VERSION));

    if (!needsRegen) {
      skipCount += 1;
      console.log(`  = ${skill.name} (캐시 일치, skip)`);
      continue;
    }

    regenerateCount += 1;
    const prompt = buildSkillExplainPromptKo(skill);

    if (options.promptsOut) {
      const promptFile = path.join(options.promptsOut, `${skill.name}.prompt.md`);
      await fs.writeFile(promptFile, prompt, "utf8");
      console.log(`  → ${skill.name}: 프롬프트 저장 → ${promptFile}`);
    } else {
      console.log(`  → ${skill.name}: 재생성 필요 (프롬프트는 --prompts-out으로 출력 가능)`);
    }
  }

  console.log(`[explainer] 완료: 재생성 ${regenerateCount}개 / 스킵 ${skipCount}개`);
  console.log(
    `[explainer] MVP는 수동 모드. Claude Code 세션에서 프롬프트를 실행하여 해설을 작성해 주세요.`,
  );
}

main().catch((error: unknown) => {
  console.error("[explainer] 치명적 오류:", error);
  process.exit(1);
});
