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
      text: GitHub 레포
      link: https://github.com/mygithub05253/Claude-Code-Study

features:
  - icon: 📚
    title: 공식 문서 + 학습 노트 하이브리드
    details: |
      각 스킬마다 "한 줄 요약 / 언제 사용 / 핵심 개념 / 실전 예제 / 학습 포인트 / 원본과의 차이"
      6개 섹션으로 정리되어 있습니다. 검색성과 학습 동기를 동시에 챙깁니다.
  - icon: 🎓
    title: Next.js 15 대학생 예제
    details: |
      모든 실전 예제는 Next.js 15 + TypeScript + Supabase 기반
      "동아리 공지 게시판" 과제 맥락으로 통일되어 있어, 하나의 프로젝트를 관통하며 학습할 수 있습니다.
  - icon: ⚡
    title: 토큰 최소화 파이프라인
    details: |
      로컬 스킬 파싱은 Claude 없이 동작하고, 해설은 1회 생성 후 git에 캐싱됩니다.
      해시 기반 증분 재생성으로 불필요한 토큰 소모를 막습니다.
  - icon: 🌏
    title: 한 → 영 → 일 확장
    details: |
      MVP(P0)는 한국어, P1에서 영어, P2에서 일본어 번역을 추가합니다.
      VitePress i18n으로 동일한 콘텐츠를 3개 언어로 제공합니다.
---

## 프로젝트 현황 (MVP — Phase 3)

현재 P0 10개 핵심 스킬의 한국어 해설이 완성되어 있습니다.

- Phase 0: 레포 / 스캐폴딩 / CI — **완료**
- Phase 1: Parser (48/48 스킬 파싱) — **완료**
- Phase 2: P0 10개 한국어 해설 — **완료**
- Phase 3: VitePress 사이트 MVP — **진행 중**
- Phase 4: GitHub Pages 배포 — **대기**

자세한 로드맵은 [GitHub 레포](https://github.com/mygithub05253/Claude-Code-Study)의
`docs/PRD.md`를 참고하세요.

## 시작하기

- [스킬 해설](/skills/) — P0 10개 핵심 스킬
- [MCP 서버](/mcp/) — Claude Code 외부 도구 연결
- [Hooks 레시피](/hooks/) — 자동화 스니펫
- [Agents 패턴](/agents/) — Sub-agent / Multi-agent
- [GitHub 레포 큐레이션](/repos/) — Stars 10K+ 선별
- [Use Cases](/use-cases/) — 대학생 실무 카테고리
- [My Collection](/my-collection/) — 커스텀 리소스
- [프롬프트 모음](/prompts/) — 복사-붙여넣기용 템플릿
- [Claude Code 공식 문서](https://docs.claude.com/claude-code) — 영어 원문 레퍼런스
