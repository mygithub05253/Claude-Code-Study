# Claude Code 학습 & 커스터마이징 허브 — PRD

> 본 문서는 `C:\Users\kik32\.claude\plans\cozy-singing-kite.md`의 구현 플랜을 확장하여 정식 PRD로 정리한 것입니다. Phase 체크리스트는 진척 추적용으로 유지·갱신됩니다.

## 1. 프로젝트 소개

**한 줄 소개**: 한국인 대학생 관점에서 Claude Code의 Skills/Agents/MCP/Plugins를 한국어로 이해하고 커스터마이징하는 오픈소스 학습 허브.

**왜 만드는가**:
- 사용자는 Next.js 15를 학습 중인 한국인 대학생으로, Claude Code를 사용하지만 Skills/Agents/MCP/Plugins의 정확한 사용법과 내부 구조를 모르는 상태다.
- 영어 공식 문서와 커뮤니티 awesome 리스트들은 진입 장벽이 높고, "어느 것부터 배워야 하는지" 큐레이션도 부족하다.
- 이 프로젝트는 로컬에 설치한 Claude Code 리소스를 한국어로 이해하고, 대학생 관점으로 커스터마이징한 뒤, 한/영/일 3개 언어 문서 사이트로 GitHub Pages에 공개하는 것이 목표다.

**핵심 원칙**: 토큰 최소화 + 최고 퀄리티. 스크립트가 기계적 파싱을 전담하고(토큰 0), Claude는 한국어 해설 생성에만 1회 호출된 뒤 결과를 마크다운으로 `git commit`하여 재사용한다.

## 2. 페르소나

**Primary: 한국 대학생 (본인)**
- Next.js 15 학습 중, TypeScript 익숙, 백엔드는 초보
- Claude Code 구독자, 영어 읽기는 가능하나 한국어 자료를 선호
- "어떤 스킬부터 써야 효율이 좋은지" 알고 싶음
- 포트폴리오/학습 기록으로도 활용 희망

**Secondary: 한국어 Claude Code 초심자**
- Claude Code를 막 시작한 개발자
- 한국어 공식 자료가 없어 진입 장벽을 느낌

**Tertiary: 영/일 사용자**
- GitHub에서 한국어 자료로 검색 유입
- 자동 번역이 아닌 구조화된 학습 허브를 찾는 사람

## 3. KPI / 성공 지표

| 지표 | 목표 (P0) | 목표 (P1) | 목표 (P2) |
|---|---|---|---|
| 한국어 스킬 해설 문서 수 | 10개 | 48개 | 48개+외부 |
| 지원 언어 | 한국어 | 한/영 | 한/영/일 |
| GitHub Pages LCP | < 2.5s | < 2.5s | < 2.0s |
| 빌드 시간 | < 60s | < 90s | < 120s |
| 파서 커버리지 | 80%+ | 85%+ | 90%+ |
| Claude 토큰 사용량 | 1회/스킬 | 1회/스킬 | 1회/스킬 |

## 4. 스코프

### In-scope (P0)
- 로컬 `~/.claude/skills/*/SKILL.md` 파싱
- P0 10개 스킬의 한국어 해설 MD 생성
- VitePress 기반 한국어 문서 사이트
- GitHub Pages 자동 배포
- pnpm workspace 모노레포
- 해시 기반 증분 재생성

### In-scope (P1)
- 나머지 38개 스킬 해설
- Commands/Agents/MCP 파싱
- 공식 마켓플레이스 플러그인 32개 문서화
- 영어 번역
- VitePress i18n (en)

### In-scope (P2)
- 외부 awesome 레포 메타 수집 및 한국어 요약
- 일본어 번역
- `@claude-code-study/cli` 추출 및 npm 배포

### Out-of-scope
- 원본 스킬 코드 수정/재배포 (라이선스 이슈)
- 유료 SaaS, 사용자 계정
- 자동 번역 서비스 래핑 (Claude만 사용)
- 실시간 업데이트 (수동 또는 스케줄 트리거만)

## 5. 운영 원칙 (필수 준수)

- **Push 시 README.md 수정 필수**: 모든 push 전 해당 변경을 README에 반영
- **메모리 기록 필수**: `C:\Users\kik32\.claude\projects\C--Users-kik32-workspace-claude-code-study\memory\`에 지속 기록
- **외부 리소스 사전 설치**: 본 프로젝트 시작 전 필요한 MCP/Skills/Agents를 먼저 설치
- **한국어 우선**: 모든 대화/주석/커밋/문서는 한국어
- **TypeScript strict**: `any` 금지, 2 spaces
- **라이선스 준수**: 외부 리소스는 링크 + 한국어 요약만, 원본 코드 복제 금지

## 6. 기술 스택

| 레이어 | 선택 | 근거 |
|---|---|---|
| 모노레포 | pnpm workspace | 타입 공유, PR 원자성 |
| 언어 | TypeScript 5+ strict | CLAUDE.md 스택 통일 |
| 문서 사이트 | VitePress 1+ | i18n 공식 지원, 마크다운 퍼스트 |
| 파서 | gray-matter + zod | 업계 표준 |
| 파일 탐색 | fast-glob | Windows 호환 |
| 테스트 | Vitest | TypeScript 친화 |
| CI/CD | GitHub Actions | 무료, Pages 통합 |
| Node | 20+ | VitePress 요구사항 |

## 7. 아키텍처

데이터 플로우:

```
~/.claude/skills/*/SKILL.md  →  [파서]  →  content/raw/skills.json
                                                    ↓
                                                [해설 생성]
                                                    ↓
                                         content/ko/skills/*.md (git commit)
                                                    ↓
                                              [sync 스크립트]
                                                    ↓
                                         apps/docs/** (VitePress)
                                                    ↓
                                              [GitHub Actions]
                                                    ↓
                         https://mygithub05253.github.io/Claude-Code-Study/
```

## 8. Phase별 작업 체크리스트

> **범례**: ✅ 완료 · 🔄 진행 중 · ⏸ 보류 · ⬜ 미착수

### Phase -1: 사전 준비 (외부 리소스 설치) ⏸ 보류
- [ ] 외부 MCP/Skills 추가 설치 — 기존 48개 로컬 스킬로 Phase 0 진행
- [ ] `installed-resources.md`에 기록 완료 시 수행

### Phase 0a: 레포 연결 + PRD + CLAUDE.md + 메모리 ✅ 완료
- [x] `git init` + 원격 연결
- [x] `.gitignore` 작성
- [x] `docs/PRD.md` 작성 (본 문서)
- [x] `CLAUDE.md` 프로젝트 규칙 작성
- [x] 메모리 파일 4종 생성 (MEMORY, installed-resources, phase-status, decisions)
- [x] 첫 커밋 + push

### Phase 0b: 모노레포 스캐폴딩 ✅ 완료
- [x] `pnpm init` + `pnpm-workspace.yaml`
- [x] `tsconfig.base.json`
- [x] ESLint + Prettier flat config
- [x] 루트 `package.json` scripts
- [x] `README.md` 한국어 초안
- [x] MIT `LICENSE`
- [x] `.env.example`

### Phase 0c: CI 워크플로우 ✅ 완료
- [x] `.github/workflows/ci.yml`
- [x] 스모크 테스트 통과
- [x] `phase-status.md` 갱신
- [x] README CI 배지 추가

### Phase 1: Parser 구현 ✅ 완료 (48/48)
- [x] `packages/parser` 스캐폴딩
- [x] `types.ts`, `schemas.ts`
- [x] `parseSkill.ts` (gray-matter + 섹션 분할 + SHA-256 해시)
- [x] `utils/walk.ts` (fast-glob)
- [x] Vitest 테스트 (fixture 3건 이상)
- [x] CLI 진입점
- [x] 48개 파싱 성공 (100%)

### Phase 2: 한국어 해설 생성 (P0) ✅ 완료
- [x] `packages/explainer` 스캐폴딩
- [x] `prompts/skillExplain.ko.ts`
- [x] `cache.ts` (해시 기반)
- [x] P0 10개 스킬 해설 생성 (Claude Code CLI 수동)
- [x] 출처 frontmatter 주입
- [x] 수동 리뷰 체크리스트 통과

### Phase 3: VitePress 사이트 MVP ✅ 완료
- [x] `apps/docs` VitePress 설치
- [x] `.vitepress/config.ts` 한국어 설정
- [x] `sync-content-to-docs.ts`
- [x] 한국어 홈 페이지
- [x] `SkillCard.vue` (CardGrid.vue + CardItem.vue)
- [x] 사이드바 자동 생성
- [x] 로컬 빌드 성공

### Phase 4: GitHub Pages 배포 ✅ 완료
- [x] `.github/workflows/deploy-pages.yml`
- [x] VitePress `base: /Claude-Code-Study/`
- [x] Pages 설정 (GitHub Actions)
- [x] 배포 성공 확인
- [x] README 배지 + 스크린샷 추가

### Phase 5: P0→P1 콘텐츠 확장 ✅ 완료
- [x] 5-A: 인프라 커밋 (VitePress 카드 UI + Mermaid 플러그인)
- [x] 5-B: 48개 스킬 한국어 해설 완성
- [x] 5-D: 비스킬 콘텐츠 21개 (mcp, hooks, agents, repos, use-cases, ecosystem)
- [ ] parseCommand/parseAgent/parseMcp (P1 자동화 — 추후)

### Phase 6: 콘텐츠 품질 강화 ✅ 완료 (6-A~F)
- [x] 6-A: CardGrid.vue + CardItem.vue + vitepress-plugin-mermaid + ecosystem 페이지
- [x] 6-B: skills/index.md 48개 카드 + 7개 섹션 index.md 카드화 + 홈페이지 업데이트
- [x] 6-C/D: 48개 스킬 7섹션 재구성 + source_url + mermaid
- [x] 6-E: 비스킬 12개 7섹션 재구성 + mermaid
- [x] 6-F: CLAUDE.md 7섹션+생태계 원칙 + README.md 갱신 + .gitignore 확장

### Phase 7: 다국어 + MCP 강화 🔄 진행 중
- [x] 7-A: MCP 서버 6개 설치 (context7, thinking, playwright, filesystem, memory, github)
- [x] 7-B: VitePress i18n 인프라 (en 로케일, locales 블록, sidebar locale 지원)
- [x] 7-C: sync-content-to-docs 다국어 확장 (LOCALES 배열)
- [x] 7-D: deploy-pages.yml 영어 경로(`content/en/**`) 추가
- [x] 7-G: 빈 섹션 콘텐츠 (my-collection 5개 + prompts 6개)
- [x] 7-H: sitemap + robots.txt + PRD 체크리스트 동기화
- [ ] 7-E: 영어 번역 — Skills 48개
- [ ] 7-F: 영어 번역 — 비스킬 32개

### Phase 8: P2 확장 (예정)
- [ ] 일본어 번역 + `content/ja/`
- [ ] `packages/cli` 추출
- [ ] npm 배포
- [ ] 외부 레포 메타 수집 (awesome 리스트)

## 9. 위험 요소 및 대응

| # | 위험 | 대응 |
|---|---|---|
| R1 | Claude API 유료 부담 | MVP는 Claude Code CLI 수동 → P1부터 SDK 검토 |
| R2 | 외부 레포 라이선스 위반 | 원본 복제 금지, 링크 + 한국어 요약만 |
| R3 | 스킬 업데이트로 stale | 해시 기반 증분 재생성 |
| R4 | Windows 경로 호환성 | `path.join`, 심볼릭 링크 대신 복사 |
| R5 | VitePress `base` 오설정 | CI 배포 후 smoke test |
| R6 | 해설 사실 오류 | P0 10개는 필수 수동 리뷰 |
| R7 | API 키 노출 | `.env.example`만 커밋, Secret 사용 |
| R8 | pnpm + VitePress 호환성 | Phase 0에서 hello world 검증 |

## 10. 참고 링크

- GitHub 레포: https://github.com/mygithub05253/Claude-Code-Study
- 배포 URL (예정): https://mygithub05253.github.io/Claude-Code-Study/
- Claude Code 공식: https://docs.claude.com/claude-code
- VitePress: https://vitepress.dev/
