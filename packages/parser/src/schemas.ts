/**
 * zod 스키마: SKILL.md frontmatter 검증.
 * gray-matter의 파싱 결과를 런타임에 검증하여 타입 안전성을 확보한다.
 */

import { z } from "zod";

/**
 * SKILL.md frontmatter 스키마.
 * 실제 스킬 파일에 존재하는 필드들을 허용하며, 모르는 필드는 무시한다.
 */
export const skillFrontmatterSchema = z
  .object({
    name: z.string().min(1, "name은 필수입니다"),
    description: z.string().min(1, "description은 필수입니다"),
    // 케밥 케이스 원본 필드를 그대로 받아 카멜로 변환
    "preamble-tier": z.number().int().positive().optional(),
    version: z.string().optional(),
    "allowed-tools": z.union([z.string(), z.array(z.string())]).optional(),
    "benefits-from": z.union([z.string(), z.array(z.string())]).optional(),
    // hooks는 Claude Code 공식 스펙으로 PreToolUse/PostToolUse 등 복잡한 중첩 객체다.
    // 본 파서는 hooks를 사이트에 노출하지 않으므로 구조는 검증하지 않고 존재만 인정한다.
    hooks: z.unknown().optional(),
    sensitive: z.boolean().optional(),
  })
  .passthrough(); // 미지의 필드는 통과

export type RawSkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;

/**
 * 원본(케밥) frontmatter를 카멜 케이스로 정규화.
 * 문자열 필드는 배열로 자동 승격한다.
 */
export function normalizeFrontmatter(raw: RawSkillFrontmatter): {
  name: string;
  description: string;
  preambleTier?: number;
  version?: string;
  allowedTools?: string[];
  benefitsFrom?: string[];
  /** hooks의 존재 여부만 기록 (구조는 사이트에 노출하지 않는다) */
  hasHooks?: boolean;
  sensitive?: boolean;
} {
  const toArray = (value: string | string[] | undefined): string[] | undefined => {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value : [value];
  };

  return {
    name: raw.name,
    description: raw.description.trim(),
    preambleTier: raw["preamble-tier"],
    version: raw.version,
    allowedTools: toArray(raw["allowed-tools"] as string | string[] | undefined),
    benefitsFrom: toArray(raw["benefits-from"] as string | string[] | undefined),
    hasHooks: raw.hooks !== undefined,
    sensitive: raw.sensitive,
  };
}
