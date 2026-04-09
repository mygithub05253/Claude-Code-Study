# Claude Code 학습 & 커스터마이징 허브

> 한국 대학생 관점에서 Claude Code의 Skills / Agents / MCP / Plugins를 한국어로 이해하고, 커스터마이징한 뒤, 한/영/일 3개 언어 문서 사이트로 공개하는 오픈소스 학습 허브.

[![CI](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/ci.yml/badge.svg)](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Language: Korean](https://img.shields.io/badge/Language-Korean-blue.svg)](#)

📖 **배포 사이트 (예정)**: <https://mygithub05253.github.io/Claude-Code-Study/>

---

## 왜 만드나요?

- Claude Code는 강력하지만, Skills / Agents / MCP / Plugins 각각이 어떻게 동작하고 어떻게 커스터마이징하는지 **한국어 자료**가 거의 없다.
- 영어 공식 문서와 커뮤니티 awesome 리스트는 진입 장벽이 높다.
- 로컬에 설치된 리소스를 **토큰 0으로 파싱**하고, **Claude로 단 1회 해설**을 생성해 git에 캐싱하는 **토큰 최적화 파이프라인**을 만들고 싶었다.

## 핵심 원칙

1. **한국어 우선** — 모든 대화, 주석, 커밋, 문서는 한국어
2. **토큰 최소화** — 파싱은 Claude 없이 동작, 해설은 1회 생성 후 캐싱
3. **대학생 관점** — 공식 문서 톤 + 학습 노트 톤 하이브리드
4. **오픈소스 안전** — 외부 코드 복제 금지, 링크 + 한국어 요약만

## 기술 스택

| 레이어 | 선택 |
|---|---|
| 모노레포 | pnpm workspace |
| 언어 | TypeScript 5+ strict |
| 문서 사이트 | VitePress 1+ (i18n: ko → en → ja) |
| 파서 | gray-matter + zod + fast-glob |
| 테스트 | Vitest |
| CI/CD | GitHub Actions → GitHub Pages |

## 디렉토리 구조

```
claude-code-study/
├── apps/
│   └── docs/            # VitePress 사이트 (Phase 3+)
├── packages/
│   ├── parser/          # SKILL.md → JSON (Phase 1)
│   ├── explainer/       # JSON → 한국어 해설 MD (Phase 2)
│   ├── translator/      # 한국어 → 영/일 (P1/P2)
│   ├── shared/          # 공통 타입/상수
│   └── cli/             # @claude-code-study/cli (P2)
├── content/
│   ├── raw/             # 파서 출력 (자동 생성, git 포함)
│   ├── ko/              # 한국어 해설 (수동+Claude 생성, git commit)
│   ├── en/              # (P1)
│   └── ja/              # (P2)
├── scripts/             # 파이프라인 스크립트
├── docs/                # 개발 문서 (PRD, ADR)
│   └── PRD.md           # 정식 PRD
├── .github/workflows/   # CI + Pages 배포
├── CLAUDE.md            # Claude Code 프로젝트 규칙
├── LICENSE              # MIT
└── README.md            # 이 파일
```

## 빠른 시작

### 전제조건

- Node.js 20+
- pnpm 9+
- Git
- (선택) GitHub CLI (`gh`)

### 설치 및 개발

```bash
# 의존성 설치
pnpm install

# 로컬 파서 실행 (Phase 1 완료 후)
pnpm parse

# 한국어 해설 생성 (Phase 2, MVP는 Claude Code CLI 세션에서 수동)
# pnpm explain

# 문서 사이트 로컬 개발 서버 (Phase 3 완료 후)
pnpm dev

# 빌드
pnpm build
```

## 프로젝트 진행 상태

| Phase | 내용 | 상태 |
|---|---|---|
| -1 | 외부 리소스 사전 설치 | ⏸ 보류 (기존 48개 로컬 스킬 사용) |
| 0a | 레포 연결 + PRD + CLAUDE.md + 메모리 | ✅ 완료 |
| 0b | 모노레포 스캐폴딩 | 🔄 진행 중 |
| 0c | CI 워크플로우 | ⏳ 대기 |
| 1 | Parser 구현 | ⏳ 대기 |
| 2 | 한국어 해설 생성 (P0 10개) | ⏳ 대기 |
| 3 | VitePress 사이트 MVP | ⏳ 대기 |
| 4 | GitHub Pages 배포 | ⏳ 대기 |
| 5 | P1: 나머지 38개 + 영어 | ⏳ 대기 |
| 6 | P2: 외부 레포 + 일본어 + CLI | ⏳ 대기 |

### P0 대상 10개 스킬

1. [brainstorming](https://github.com/mygithub05253/Claude-Code-Study/tree/main/content/ko/skills/brainstorming.md)
2. writing-plans
3. executing-plans
4. ship
5. review
6. investigate
7. using-superpowers
8. writing-skills
9. test-driven-development
10. systematic-debugging

## 기여 / 라이선스

- **라이선스**: [MIT](./LICENSE)
- **기여**: MVP(P0) 진행 중입니다. P1 이후 기여 가이드를 공개합니다.
- **외부 리소스 저작권**: 본 프로젝트에서 인용/요약한 외부 Claude Code 리소스의 저작권은 각 원본 저작자에게 있습니다.

## 참고 링크

- [Claude Code 공식 문서](https://docs.claude.com/claude-code)
- [VitePress](https://vitepress.dev/)
- [PRD (상세 요구사항)](./docs/PRD.md)
- [CLAUDE.md (프로젝트 규칙)](./CLAUDE.md)
