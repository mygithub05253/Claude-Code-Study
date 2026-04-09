/**
 * SHA-256 해시 유틸리티.
 * 스킬 본문 변경 감지를 위해 `sha256:<hex>` 형식으로 반환한다.
 */

import { createHash } from "node:crypto";

/**
 * 문자열의 SHA-256 해시를 계산한다.
 * @returns `sha256:<64자 16진수>` 형식
 */
export function sha256(input: string): string {
  const hex = createHash("sha256").update(input, "utf8").digest("hex");
  return `sha256:${hex}`;
}
