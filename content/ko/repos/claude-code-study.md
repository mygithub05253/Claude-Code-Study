---
title: "Claude-Code-Study"
category: repos
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "mygithub05253 및 기여자"
license: "MIT"
last_reviewed: "2026-04-12"
tags: ["repos", "claude-code", "korean", "study", "hub", "vitepress", "open-source"]
---

# Claude-Code-Study

## 한 줄 요약

한국 대학생 관점으로 Claude Code의 Skills, MCP, Agents, 활용 사례를 한국어로 해설하고 커스터마이징하는 오픈소스 학습 허브.

## 왜 주목해야 하나요?

- **한국어 특화**: Claude Code 관련 한국어 레퍼런스가 극히 부족한 상황에서, 대학생 눈높이로 쓰인 유일한 종합 가이드
- **동아리 게시판 맥락 통일**: 추상적인 예제 대신 "Next.js 15 동아리 공지 게시판" 하나의 맥락으로 모든 예제가 연결되어 있어 학습 흐름이 자연스러움
- **VitePress 문서 사이트 포함**: 단순 README가 아닌, 검색 가능한 문서 사이트로 제공 (GitHub Pages 배포)
- **오픈소스 기여 환경**: 콘텐츠 추가, 번역, 코드 개선 모두 PR로 기여 가능

## 핵심 기능

### 수록 콘텐츠 구조

```
content/ko/
├── skills/          # 48개 공식 Skills 한국어 해설
├── mcp/             # MCP 서버 해설 (이 파일이 속한 카테고리)
├── hooks/           # Hooks 레시피 모음
├── agents/          # Sub-agent / Multi-agent 패턴
├── repos/           # GitHub 레포 큐레이션 (이 파일이 속한 카테고리)
├── use-cases/       # 카테고리별 대학생 활용법
├── my-collection/   # 사용자 변형 커스텀 리소스
└── prompts/         # 범용 프롬프트 템플릿
```

### 기술 스택

- **문서 사이트**: VitePress 1.x + i18n (한국어 우선, 영어/일본어 예정)
- **파서**: TypeScript + gray-matter + zod + fast-glob (Skills YAML 자동 파싱)
- **해설 생성**: Claude Code CLI 세션 기반 수동 생성 + 해시 캐시로 증분 재생성
- **배포**: GitHub Pages (`/Claude-Code-Study/` 서브패스)
- **모노레포**: pnpm workspace (`apps/*`, `packages/*`)

### 해설 페이지 표준 구조

모든 해설 페이지는 6섹션 구조를 따릅니다:
1. 한 줄 요약
2. 왜 대학생에게 유용한가 (시나리오)
3. 핵심 개념 / 작동 원리
4. 실전 예제 (동아리 공지 게시판 맥락)
5. 학습 포인트 / 흔한 함정
6. 원본 링크 & 저작권 표기

### 진행 단계 (2026-04-12 기준)

| Phase | 내용 | 상태 |
|---|---|---|
| Phase 0 | 레포 설정, 모노레포, CI | 완료 |
| Phase 1 | SKILL.md 파서 (48/48 성공) | 완료 |
| Phase 2 | P0 10개 Skills 한국어 해설 | 완료 |
| Phase 3 | VitePress 사이트 MVP | 완료 |
| Phase 4 | GitHub Pages 배포 | 완료 |
| Phase 5 (P1) | 38개 잔여 Skills + MCP + Agents | 진행 예정 |

## 대학생 활용 포인트

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트를 처음 시작하거나, Claude Code를 처음 접하는 상황.

**시나리오 1: 학습 출발점으로 활용**

Claude Code를 처음 쓰기 시작했다면, 이 사이트의 Skills 섹션에서 가장 기본적인 스킬(`brainstorming`, `executing-plans`, `review`)부터 읽어보세요. 한국어로 개념을 먼저 이해하면 영어 원본 문서를 더 빠르게 소화할 수 있습니다.

**시나리오 2: 프로젝트 셋업 가이드로 활용**

동아리 게시판 같은 풀스택 프로젝트를 시작할 때, `use-cases` 섹션의 "웹 개발" 카테고리에서 추천 Skills + MCP 조합을 확인해 시간을 절약할 수 있습니다.

**시나리오 3: 오픈소스 기여 첫 경험**

한국어로 Claude Code 관련 내용을 작성하고 PR을 올리면, 실제 사용자가 읽는 문서에 기여하는 경험을 할 수 있습니다. 외부 오픈소스 기여 이력이 학과 포트폴리오나 이력서에 유용합니다.

기여 방법:
1. 레포 Fork
2. `content/ko/` 아래 해당 카테고리에 마크다운 파일 작성
3. Frontmatter의 저작권 표기 섹션 반드시 포함
4. PR 제출

**시나리오 4: 팀원에게 Claude Code 소개**

팀 프로젝트 킥오프 미팅에서 "Claude Code가 뭔지 모르겠어요"라는 팀원에게 이 사이트 링크를 공유하세요. 영어로 된 공식 문서보다 훨씬 빠르게 맥락을 파악할 수 있습니다.

## 참고 링크

- GitHub: https://github.com/mygithub05253/Claude-Code-Study
- 배포 사이트: https://mygithub05253.github.io/Claude-Code-Study/
- Claude Code 공식 문서: https://docs.anthropic.com/en/docs/claude-code
- 연관 레포: https://github.com/hesreallyhim/awesome-claude-code

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://github.com/mygithub05253/Claude-Code-Study |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
