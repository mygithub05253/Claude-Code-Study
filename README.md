# Claude Code 학습 & 커스터마이징 허브

> 한국 대학생 관점에서 Claude Code의 Skills / Agents / MCP / Plugins를 한국어로 이해하고, 커스터마이징한 뒤, 한/영/일 3개 언어 문서 사이트로 공개하는 오픈소스 학습 허브.

[![CI](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/ci.yml/badge.svg)](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/mygithub05253/Claude-Code-Study/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Language: Korean](https://img.shields.io/badge/Language-Korean-blue.svg)](#)

📖 **배포 사이트**: <https://mygithub05253.github.io/Claude-Code-Study/>

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

# 로컬 파서 실행 (~/.claude/skills 전체 → content/raw/skills.json)
pnpm parse

# 한국어 해설 생성 프롬프트 출력 (MVP는 Claude Code CLI 세션에서 수동 실행)
pnpm explain

# content/ko → apps/docs/skills 복사 (dev/build에서 자동 수행됨)
pnpm sync-docs

# 문서 사이트 로컬 개발 서버 (http://localhost:5173)
pnpm dev

# 전체 빌드 (패키지 + 문서 사이트)
pnpm build

# 문서 사이트만 빌드 (sync-docs 자동 포함)
pnpm build:docs
```

## 프로젝트 진행 상태

| Phase | 내용 | 상태 |
|---|---|---|
| -1 | 외부 리소스 사전 설치 | ⏸ 보류 (기존 48개 로컬 스킬 사용) |
| 0a | 레포 연결 + PRD + CLAUDE.md + 메모리 | ✅ 완료 |
| 0b | 모노레포 스캐폴딩 | ✅ 완료 |
| 0c | CI 워크플로우 | ✅ 완료 |
| 1 | Parser 구현 | ✅ 완료 (48/48 파싱) |
| 2 | 한국어 해설 생성 (P0 10개) | ✅ 완료 |
| 3 | VitePress 사이트 MVP | ✅ 완료 |
| 4 | GitHub Pages 배포 | ✅ 완료 |
| **5** | **P1: 38개 스킬 + 비스킬 콘텐츠** | ✅ **완료** |
| **6** | **카드 UI + Mermaid + 생태계 탐색 허브** | 🔄 **진행 중** |
| 7 | P2: 영어 번역 + 일본어 + CLI | ⏳ 대기 |

### Phase 6 달성 (6-A + 6-B)

- [x] VitePress 커스텀 테마 (CardGrid.vue, CardItem.vue, card.css)
- [x] vitepress-plugin-mermaid 설치 + withMermaid 설정
- [x] 생태계 탐색 허브 페이지 (GitHub / Smithery.ai / Claude Skills Directory)
- [x] 48개 스킬 카드 그리드 인덱스 (8개 그룹)
- [x] MCP / Hooks / Agents / Repos / Use-Cases / My-Collection / Prompts 인덱스 카드화
- [x] 홈페이지 features + 현황 업데이트

### Phase 5 달성 (P1)

- [x] 48개 스킬 한국어 해설 전체 완성 (10 → 48)
- [x] Hooks 레시피 5개 (auto-format, block-dangerous, notify-complete, auto-test, work-log)
- [x] Agents 패턴 4개 (explore-agent, plan-agent, parallel-dispatch, gstack-roles)
- [x] MCP 서버 5개 (sequential-thinking, github-mcp, filesystem-mcp, fetch-mcp, supabase-mcp)
- [x] GitHub 레포 큐레이션 3개
- [x] Use Cases 4개 (과제 개발, 코드 리뷰, 디버깅, 팀 협업)
- [x] VitePress 8개 섹션 라우팅

### P0 대상 10개 스킬 (한국어 해설 완료)

| # | 스킬 | 해설 |
|---|---|---|
| 1 | brainstorming | [content/ko/skills/brainstorming.md](./content/ko/skills/brainstorming.md) |
| 2 | writing-plans | [content/ko/skills/writing-plans.md](./content/ko/skills/writing-plans.md) |
| 3 | executing-plans | [content/ko/skills/executing-plans.md](./content/ko/skills/executing-plans.md) |
| 4 | ship | [content/ko/skills/ship.md](./content/ko/skills/ship.md) |
| 5 | review | [content/ko/skills/review.md](./content/ko/skills/review.md) |
| 6 | investigate | [content/ko/skills/investigate.md](./content/ko/skills/investigate.md) |
| 7 | using-superpowers | [content/ko/skills/using-superpowers.md](./content/ko/skills/using-superpowers.md) |
| 8 | writing-skills | [content/ko/skills/writing-skills.md](./content/ko/skills/writing-skills.md) |
| 9 | test-driven-development | [content/ko/skills/test-driven-development.md](./content/ko/skills/test-driven-development.md) |
| 10 | systematic-debugging | [content/ko/skills/systematic-debugging.md](./content/ko/skills/systematic-debugging.md) |

각 해설은 다음 6개 섹션을 포함한다: **한 줄 요약 / 언제 사용하나요? / 핵심 개념 / 실전 예제 (대학생 관점) / 학습 포인트 / 원본과의 차이**. 예제는 Next.js 15 + TypeScript 기반 대학생 프로젝트 맥락으로 구성되어 있다.

## 기여 / 라이선스

- **라이선스**: [MIT](./LICENSE)
- **기여**: MVP(P0) 진행 중입니다. P1 이후 기여 가이드를 공개합니다.
- **외부 리소스 저작권**: 본 프로젝트에서 인용/요약한 외부 Claude Code 리소스의 저작권은 각 원본 저작자에게 있습니다.

## 참고 링크

- [Claude Code 공식 문서](https://docs.claude.com/claude-code)
- [VitePress](https://vitepress.dev/)
- [PRD (상세 요구사항)](./docs/PRD.md)
- [CLAUDE.md (프로젝트 규칙)](./CLAUDE.md)
