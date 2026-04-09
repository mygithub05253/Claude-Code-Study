// ESLint flat config (ESLint 9+)
// 한국어 주석 허용, TypeScript strict 원칙을 강제한다.

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 기본 권장 설정
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    // 공통 규칙
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // `any` 금지 (CLAUDE.md 규약)
      "@typescript-eslint/no-explicit-any": "error",
      // 사용하지 않는 변수 경고 (밑줄 시작은 허용)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 한국어 주석 및 템플릿 문자열 허용
      "no-irregular-whitespace": "off",
    },
  },

  {
    // 무시할 경로
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.vitepress/cache/**",
      "**/.vitepress/dist/**",
      "**/coverage/**",
      "content/raw/**",
    ],
  },
);
