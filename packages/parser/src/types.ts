/**
 * Claude Code 리소스의 공통 타입 정의.
 * 파서/해설기/번역기/사이트가 공유한다.
 */

/** SKILL.md의 YAML frontmatter */
export interface SkillFrontmatter {
  /** 스킬 이름 (필수, 디렉토리 이름과 일치) */
  name: string;
  /** 스킬 설명 (필수, 한 줄 또는 다중 줄) */
  description: string;
  /** preamble-tier (선택, 1~5 정도) */
  preambleTier?: number;
  /** semver 버전 (선택) */
  version?: string;
  /** 허용된 도구 목록 (선택) */
  allowedTools?: string[];
  /** benefits-from: 연관 스킬 (선택) */
  benefitsFrom?: string[];
  /** hooks가 정의되어 있는지 여부 (구조는 기록하지 않음) */
  hasHooks?: boolean;
  /** 민감 정보 취급 여부 (선택) */
  sensitive?: boolean;
}

/** 마크다운 섹션 (`## 제목` 기준 분할) */
export interface MarkdownSection {
  /** 섹션 제목 (# 개수 제외) */
  title: string;
  /** 섹션 레벨 (1~6) */
  level: number;
  /** 섹션 본문 (제목 제외) */
  body: string;
}

/** 파싱된 스킬 1개 */
export interface ParsedSkill {
  /** 스킬 이름 */
  name: string;
  /** 원본 파일 경로 (절대 경로) */
  sourcePath: string;
  /** 원본 파일을 프로젝트 루트 기준 상대 경로로 표시 (선택) */
  sourceRelativePath?: string;
  /** frontmatter */
  frontmatter: SkillFrontmatter;
  /** 본문 원본 (frontmatter 제외) */
  rawBody: string;
  /** 첫 헤더 뒤의 리드 문단 (해설 생성 시 활용) */
  lead: string;
  /** 섹션 목록 */
  sections: MarkdownSection[];
  /** 본문의 SHA-256 해시 (frontmatter + body) */
  contentHash: string;
  /** 파싱한 시각 (ISO 8601, KST 반영) */
  parsedAt: string;
}

/** 파싱 전체 결과 */
export interface ParseResult {
  /** 파싱 성공한 스킬 목록 */
  skills: ParsedSkill[];
  /** 파싱 실패 항목 (경로 + 에러 메시지) */
  errors: Array<{
    path: string;
    message: string;
  }>;
  /** 총 스캔한 파일 수 */
  totalScanned: number;
  /** 파싱 성공 수 */
  totalSucceeded: number;
}
