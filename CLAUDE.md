# Claude-Code-Study 프로젝트 규칙

> 이 파일은 이 프로젝트 전용 지침입니다. 전역 `~/.claude/CLAUDE.md`보다 우선합니다.

## 언어 및 코드 스타일
- 모든 대화, 주석, 커밋 메시지, 문서화는 **한국어**
- 들여쓰기 2 spaces, TypeScript strict 모드, `any` 사용 금지
- 변수/함수 `camelCase`, 컴포넌트/클래스 `PascalCase`, 상수 `UPPER_SNAKE_CASE`
- 파일명은 일반 `camelCase.ts`, React/Vue 컴포넌트는 `PascalCase.vue/tsx`

## 프로젝트 아키텍처
- **pnpm workspace 모노레포** (`apps/*`, `packages/*`)
- 문서 사이트: **VitePress** + i18n (ko → en → ja 순으로 확장)
- 파서/해설기: TypeScript + `gray-matter` + `zod` + `fast-glob`
- Claude 호출: MVP는 Claude Code CLI 세션 수동, P1부터 Anthropic API 검토
- 해설/번역 결과는 `git commit`으로 캐싱, 해시 기반 증분 재생성

## 디렉토리 규칙
- `apps/docs/` — VitePress 사이트 (빌드 산출물 전용, `sync-docs`로 주입)
- `packages/parser/` — SKILL.md → JSON 파서
- `packages/explainer/` — JSON → 한국어 해설 MD
- `packages/translator/` — (P1) 한국어 → 영/일 번역
- `packages/shared/` — 공통 타입/상수
- `content/raw/` — 파서 출력 (자동 생성, 커밋 포함)
- `content/ko/` — 한국어 해설 (수동+Claude 생성, 커밋)
  - `skills/` — 48개 공식 Skills 해설
  - `mcp/` — MCP 서버 해설
  - `hooks/` — Hooks 레시피
  - `agents/` — Sub-agent / Multi-agent 패턴
  - `repos/` — GitHub 인기 레포 큐레이션
  - `use-cases/` — 대학생 실무 카테고리별 활용법
  - `my-collection/` — 사용자 변형·커스텀 리소스
  - `prompts/` — 범용 프롬프트 템플릿
  - `_templates/` — 내부 참조용 템플릿 (빌드 제외)
- `content/en/`, `content/ja/` — (P1/P2)
- `scripts/` — 파이프라인 스크립트
- `docs/` — 개발 문서 (PRD, ADR). 사이트 빌드에 포함되지 않음

## 콘텐츠 작성 원칙 (필수)
모든 해설 페이지는 다음 **7섹션 구조** (Phase 6-C+ 기준)를 따른다:
1. 핵심 개념 / 작동 원리 (mermaid 흐름도 포함, 최상단 배치)
2. 한 줄 요약 (상세를 읽은 후 정리용 한 문장)
3. 프로젝트에 도입하기 (설치/설정 명령어 + 커스터마이징)
4. 실전 예제 (동아리 공지 게시판 맥락 통일: Next.js 15 + TypeScript + Supabase)
5. 학습 포인트 / 흔한 함정
6. 관련 리소스 (같은 카테고리 상호 참조 2~4개)
7. 원본 링크 & 저작권 (표준 테이블)

> **mermaid 작성 원칙**: 흐름이 복잡한 경우 `핵심 개념` 섹션에 `flowchart TD` 또는 `sequenceDiagram` 필수 삽입.
> 템플릿: `content/ko/_templates/content-v2.md` 참조

### 생태계 탐색 허브 관리 원칙
- 새 콘텐츠 추가 시 해당 카테고리 `apps/docs/[category]/index.md`의 CardGrid에 카드 추가
- `content/ko/ecosystem/index.md`는 외부 생태계 링크 허브 (GitHub / Smithery.ai / Claude Skills Directory)
- `apps/docs` 아래 sync 파일은 `.gitignore` 적용, index.md만 git 추적

### 파일 네이밍 규칙
- `content/ko/skills/[skill-name].md`
- `content/ko/mcp/[server-name].md`
- `content/ko/hooks/[recipe-name].md`
- `content/ko/agents/[pattern-name].md`
- `content/ko/repos/[repo-name].md`
- `content/ko/use-cases/[category]/[topic].md`
- `content/ko/my-collection/[type]/[name].md`
- `content/ko/prompts/[prompt-name].md`

### 저작권 표기 의무
모든 해설 페이지는 다음을 **반드시** 포함한다:
- Frontmatter: `source_url`, `source_author`, `license`, `last_reviewed`, `tags`, `category`
- 본문 하단: 원본 URL / 작성자 / 라이선스 / 해설 작성일 표준 테이블
- 표준 템플릿: `content/ko/_templates/attribution.md` 참조
- 외부 코드 원본 복제 금지, 링크 + 한국어 요약만 허용

## Git / Push 정책 (필수 준수)
- **Push 시 README.md 수정 필수** — 관련 변경을 다음 섹션에 반영:
  - 새 Phase 완료 → "프로젝트 진행 상태" 섹션 갱신
  - 새 기능 추가 → "기능" 섹션 갱신
  - 의존성 변경 → "기술 스택" 섹션 갱신
  - 배포 URL 변경 → 상단 배지 갱신
- **커밋 메시지**: 한국어 Conventional Commits
  - `feat: 스킬 파서 구현`
  - `fix: 윈도우 경로 구분자 버그 수정`
  - `docs: README 진행 상태 갱신`
  - `chore: 의존성 업데이트`
  - `ci: GitHub Pages 배포 워크플로우 추가`
- **파괴적 작업**은 사용자 승인 필수 (force push, `reset --hard`, 브랜치 삭제 등)
- **브랜치 전략**: MVP는 `main` 직접 push, P1부터 feature 브랜치 + PR
- `--no-verify`, `--no-gpg-sign` 금지

## 메모리 기록 정책
- 경로: `C:\Users\kik32\.claude\projects\C--Users-kik32-workspace-claude-code-study\memory\`
- `MEMORY.md`는 **200줄 제한**, 항상 요약·정제 상태 유지
- 토픽별 세부 메모는 별도 파일로 분리:
  - `installed-resources.md` — 외부 MCP/Skills/Agents 설치 내역
  - `phase-status.md` — Phase 진척 상태
  - `decisions.md` — 주요 결정 기록
- 각 Phase 시작/종료 시 갱신 필수
- 외부 리소스 설치/제거 시 `installed-resources.md`에 즉시 반영 (URL + 라이선스 + 설치 이유 + 커밋 ID)

## 라이선스 및 외부 리소스
- 외부 레포의 **원본 코드 복제 금지**, 링크 + 한국어 요약만 수록
- 설치한 외부 리소스는 `installed-resources.md`에 즉시 기록
- 프로젝트 본체는 **MIT**, 원본 저작권은 각 소유자 표기
- 재배포 불가 라이선스는 "참조용"으로만 사용

## 토큰 최적화 원칙
- 파싱/사이트 빌드는 Claude 호출 **없이** 동작 (토큰 0)
- 해설/번역은 1회 생성 후 `git commit`으로 재사용
- 해시 기반 증분 재생성, 스킬 변경이 없으면 재호출 금지
- 프롬프트 버전을 명시하여 프롬프트 변경 시 선택적 재생성 가능

## 기술 스택 참고
- Node.js 20+, pnpm 9+, TypeScript 5+, VitePress 1+, Vitest 1+
- CI: GitHub Actions (ubuntu-latest)
- 로컬 개발: Windows 11 + Git Bash (Unix 경로 문법 사용)
- Windows/Linux 양쪽에서 동작하도록 `path.join` 사용, 심볼릭 링크 대신 복사

## 작업 우선순위
- P0 (MVP): 한국어 스킬 해설 10개 + VitePress 사이트 + GitHub Pages 배포
- P1: 38개 잔여 스킬 + Commands/Agents/MCP + 영어
- P2: 외부 레포 요약 + 일본어 + CLI 추출
- 각 Phase는 PRD(`docs/PRD.md`)의 체크리스트를 기준으로 진척 관리

## 금지 사항
- `any` 타입 사용
- 원본 외부 코드 복제
- 영어 커밋 메시지
- `main` 브랜치 force push
- 메모리 파일 미갱신 상태 push
- README 미갱신 상태 push
