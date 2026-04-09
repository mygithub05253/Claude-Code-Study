/**
 * 한국어 스킬 해설 생성 프롬프트.
 *
 * 프롬프트 버전(PROMPT_VERSION)은 해시 캐시의 일부로 사용된다.
 * 프롬프트를 수정할 때는 반드시 버전을 올려 기존 해설이 재생성되도록 한다.
 */

import type { ParsedSkill } from "@claude-code-study/parser";

export const PROMPT_VERSION = "ko-v1";

/** 해설 출력에 강제되는 섹션 목록 */
export const REQUIRED_SECTIONS = [
  "한 줄 요약",
  "언제 사용하나요?",
  "핵심 개념",
  "실전 예제 (대학생 관점)",
  "학습 포인트",
  "원본과의 차이",
] as const;

/**
 * 해설 생성 프롬프트를 구성한다.
 *
 * @param skill 파싱된 스킬
 * @returns Claude에 전달할 한국어 프롬프트 문자열
 */
export function buildSkillExplainPromptKo(skill: ParsedSkill): string {
  return [
    `당신은 한국 대학생(Next.js 15 학습 중)을 위한 Claude Code 학습 허브의 집필자입니다.`,
    ``,
    `아래 원본 SKILL.md를 한국어로 해설해 주세요. 톤은 "공식 문서 + 학습 노트" 하이브리드입니다.`,
    `검색성을 위해 공식 섹션(한 줄 요약/언제 사용/핵심 개념/원본과의 차이)을 명확히 하고,`,
    `학습 동기를 위해 학습 섹션(실전 예제/학습 포인트)에서 대학생 수준의 친근한 예시를 제공해 주세요.`,
    ``,
    `## 강제 규칙`,
    `1. 출력은 **한국어**, 마크다운, 2 spaces 들여쓰기.`,
    `2. 아래 6개 섹션을 반드시 포함하고 순서를 지킬 것:`,
    ...REQUIRED_SECTIONS.map((s, i) => `   ${i + 1}. \`## ${s}\``),
    `3. "실전 예제" 섹션에는 Next.js 15 / TypeScript / 대학생 프로젝트(예: 과제 관리, 학식 앱, 동아리 사이트) 맥락의 구체적 시나리오를 1개 이상 포함.`,
    `4. 원본의 사실을 왜곡하거나 없는 기능을 만들지 말 것. 불확실하면 "원본에서 명시되지 않음"으로 표기.`,
    `5. 코드 블록의 언어 힌트(\\\`\\\`\\\`ts, \\\`\\\`\\\`bash)를 반드시 명시.`,
    `6. 마지막에 "원본: \`${skill.sourcePath}\`" 형태의 인용을 남길 것.`,
    `7. 본문에 이모지를 사용하지 말 것.`,
    ``,
    `## 원본 정보`,
    `- 이름: ${skill.name}`,
    `- 경로: ${skill.sourcePath}`,
    skill.frontmatter.version ? `- 버전: ${skill.frontmatter.version}` : ``,
    skill.frontmatter.preambleTier
      ? `- preamble-tier: ${String(skill.frontmatter.preambleTier)}`
      : ``,
    skill.frontmatter.allowedTools
      ? `- 허용 도구: ${skill.frontmatter.allowedTools.join(", ")}`
      : ``,
    skill.frontmatter.benefitsFrom
      ? `- 연관 스킬: ${skill.frontmatter.benefitsFrom.join(", ")}`
      : ``,
    ``,
    `## 원본 description`,
    skill.frontmatter.description,
    ``,
    `## 원본 본문 (요약용)`,
    skill.rawBody.slice(0, 6000),
    skill.rawBody.length > 6000 ? `\n... (잘림, 전체는 원본 파일 참고)` : ``,
    ``,
    `## 출력 형식`,
    `아래 템플릿을 채워 주세요. \`---\` frontmatter는 그대로 유지하고 값만 채울 것.`,
    ``,
    "```markdown",
    `---`,
    `title: "<한국어 제목 (영문 원제)>"`,
    `source: "${skill.sourcePath}"`,
    `sourceHash: "${skill.contentHash}"`,
    `lang: ko`,
    `generatedAt: "${new Date().toISOString()}"`,
    `promptVersion: "${PROMPT_VERSION}"`,
    `---`,
    ``,
    `# <한국어 제목>`,
    ``,
    `## 한 줄 요약`,
    `...`,
    ``,
    `## 언제 사용하나요?`,
    `...`,
    ``,
    `## 핵심 개념`,
    `...`,
    ``,
    `## 실전 예제 (대학생 관점)`,
    `...`,
    ``,
    `## 학습 포인트`,
    `...`,
    ``,
    `## 원본과의 차이`,
    `...`,
    ``,
    `> 원본: \`${skill.sourcePath}\``,
    "```",
  ]
    .filter((line) => line !== "")
    .join("\n");
}
