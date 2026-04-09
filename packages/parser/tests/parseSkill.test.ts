/**
 * parseSkill 단위 테스트.
 * 실제 fixture 파일들을 사용하여 파서의 핵심 기능을 검증한다.
 */

import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseSkillContent, parseSkillFile } from "../src/parseSkill.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, "fixtures");

describe("parseSkillFile", () => {
  it("최소 frontmatter를 가진 파일을 파싱할 수 있다", async () => {
    const filePath = path.join(fixturesDir, "minimal", "SKILL.md");
    const skill = await parseSkillFile(filePath);

    expect(skill.name).toBe("minimal");
    expect(skill.frontmatter.description).toContain("최소한의 frontmatter");
    expect(skill.frontmatter.preambleTier).toBeUndefined();
    expect(skill.frontmatter.version).toBeUndefined();
    expect(skill.sections.length).toBeGreaterThan(0);
    expect(skill.contentHash).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("복잡한 frontmatter를 정규화하여 파싱한다", async () => {
    const filePath = path.join(fixturesDir, "complex", "SKILL.md");
    const skill = await parseSkillFile(filePath);

    expect(skill.name).toBe("complex");
    expect(skill.frontmatter.preambleTier).toBe(3);
    expect(skill.frontmatter.version).toBe("1.0.0");
    expect(skill.frontmatter.allowedTools).toEqual(["Bash", "Read", "Write"]);
    expect(skill.frontmatter.benefitsFrom).toEqual(["brainstorming"]);
    expect(skill.frontmatter.description).toContain("복잡한 frontmatter");
  });

  it("name 필드가 없으면 에러를 던진다", async () => {
    const filePath = path.join(fixturesDir, "broken", "SKILL.md");
    await expect(parseSkillFile(filePath)).rejects.toThrow(/frontmatter 검증 실패/);
  });
});

describe("parseSkillContent (섹션 분할)", () => {
  it("`##` 헤더 기준으로 섹션을 나눈다", () => {
    const content = [
      "---",
      "name: test",
      "description: 테스트",
      "---",
      "",
      "# Title",
      "",
      "리드 문단.",
      "",
      "## 섹션 A",
      "A 내용",
      "",
      "## 섹션 B",
      "B 내용",
    ].join("\n");

    const skill = parseSkillContent(content, "/fake/test/SKILL.md");
    expect(skill.sections).toHaveLength(3); // Title + 섹션 A + 섹션 B
    expect(skill.sections[0]?.title).toBe("Title");
    expect(skill.sections[0]?.level).toBe(1);
    expect(skill.sections[1]?.title).toBe("섹션 A");
    expect(skill.sections[2]?.title).toBe("섹션 B");
  });

  it("코드 블록 안의 `#`은 헤더로 취급하지 않는다", () => {
    const content = [
      "---",
      "name: test",
      "description: 테스트",
      "---",
      "",
      "# Title",
      "",
      "```bash",
      "# 이건 주석이지 헤더가 아니다",
      "## 이것도 아니다",
      "```",
      "",
      "## 진짜 섹션",
      "내용",
    ].join("\n");

    const skill = parseSkillContent(content, "/fake/test/SKILL.md");
    const titles = skill.sections.map((s) => s.title);
    expect(titles).toEqual(["Title", "진짜 섹션"]);
  });

  it("첫 헤더 뒤의 리드 문단을 추출한다", () => {
    const content = [
      "---",
      "name: test",
      "description: 테스트",
      "---",
      "",
      "# Title",
      "",
      "첫 리드 문단입니다.",
      "",
      "## 다음 섹션",
      "...",
    ].join("\n");

    const skill = parseSkillContent(content, "/fake/test/SKILL.md");
    expect(skill.lead).toBe("첫 리드 문단입니다.");
  });

  it("같은 내용은 같은 해시를 반환한다", () => {
    const content = [
      "---",
      "name: test",
      "description: 테스트",
      "---",
      "",
      "# Title",
      "본문",
    ].join("\n");

    const a = parseSkillContent(content, "/fake/test/SKILL.md");
    const b = parseSkillContent(content, "/fake/test/SKILL.md");
    expect(a.contentHash).toBe(b.contentHash);
  });

  it("디렉토리 이름이 있으면 frontmatter.name을 덮어쓴다", () => {
    const content = [
      "---",
      "name: different-name",
      "description: 테스트",
      "---",
      "# Title",
    ].join("\n");

    const skill = parseSkillContent(content, "/fake/actual-dir/SKILL.md");
    expect(skill.name).toBe("actual-dir");
  });
});
