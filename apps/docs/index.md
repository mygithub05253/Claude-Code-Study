---
layout: home

hero:
  name: "Claude Code 학습 허브"
  text: "한국어로 이해하는 Skills / Agents / MCP"
  tagline: 대학생 관점에서 Claude Code 리소스를 한국어로 해설·커스터마이징하는 오픈소스 학습 허브
  actions:
    - theme: brand
      text: 스킬 해설 보기
      link: /skills/
    - theme: alt
      text: 생태계 탐색
      link: /ecosystem/
    - theme: alt
      text: GitHub 레포
      link: https://github.com/mygithub05253/Claude-Code-Study

features:
  - icon: 📚
    title: 48개 스킬 한국어 카드
    details: |
      48개 공식 스킬을 기획/설계·품질/안전·코드 리뷰·배포·브라우저/QA·디자인·에이전트·메타
      8개 그룹 카드 UI로 한눈에 탐색합니다.
  - icon: 🎓
    title: 대학생 관점 실전 예제
    details: |
      모든 예제는 Next.js 15 + TypeScript + Supabase 기반
      "동아리 공지 게시판" 맥락으로 통일되어 학습 연속성을 보장합니다.
  - icon: 🌐
    title: 생태계 탐색 허브
    details: |
      GitHub Advanced Search, Smithery.ai MCP 레지스트리, Claude Skills Directory
      3개 허브를 통해 Claude Code 생태계 전체를 탐색할 수 있습니다.
  - icon: ⚡
    title: 토큰 최소화 파이프라인
    details: |
      로컬 스킬 파싱은 Claude 없이 동작하고, 해설은 1회 생성 후 git에 캐싱됩니다.
      해시 기반 증분 재생성으로 불필요한 토큰 소모를 막습니다.
---

## 프로젝트 현황 (Phase 6)

모든 48개 스킬 한국어 해설 + MCP/Hooks/Agents/Use-Cases + 카드 UI가 완성되었습니다.

- Phase 0: 레포 / 스캐폴딩 / CI — **완료**
- Phase 1: Parser (48/48 스킬 파싱) — **완료**
- Phase 2: P0 10개 한국어 해설 — **완료**
- Phase 3: VitePress 사이트 MVP — **완료**
- Phase 4: GitHub Pages 배포 — **완료**
- Phase 5: 48개 스킬 + 비스킬 콘텐츠 21개 — **완료**
- Phase 6: 카드 UI + Mermaid + 생태계 탐색 허브 — **진행 중**

자세한 로드맵은 [GitHub 레포](https://github.com/mygithub05253/Claude-Code-Study)의
`docs/PRD.md`를 참고하세요.

## 시작하기

- [스킬 해설](/skills/) — 48개 스킬 카드 그리드
- [생태계 탐색](/ecosystem/) — GitHub / Smithery.ai / Skills Directory
- [MCP 서버](/mcp/) — Claude Code 외부 도구 연결
- [Hooks 레시피](/hooks/) — 이벤트 기반 자동화
- [Agents 패턴](/agents/) — Sub-agent / Multi-agent
- [GitHub 레포 큐레이션](/repos/) — 추천 오픈소스 레포
- [Use Cases](/use-cases/) — 대학생 실무 카테고리
- [My Collection](/my-collection/) — 커스텀 리소스
- [프롬프트 모음](/prompts/) — 복사-붙여넣기용 템플릿
- [Claude Code 공식 문서](https://docs.anthropic.com/en/docs/claude-code) — 영어 원문 레퍼런스
