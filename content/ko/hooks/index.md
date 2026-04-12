---
title: "Hooks"
category: hooks
source_url: "https://code.claude.com/docs/en/hooks-guide"
source_author: "Anthropic"
license: "공식 문서"
last_reviewed: "2026-04-09"
tags: ["hooks", "automation", "index"]
---

# Hooks 레시피

> **Hooks** 는 Claude Code의 특정 이벤트(도구 실행 전/후, 알림 등)에서 쉘 명령을 자동 실행시키는 기능입니다. 이 섹션은 대학생이 바로 복사해 쓸 수 있는 실전 레시피를 모읍니다.

## 이 섹션의 목적

- `settings.json` 의 `hooks` 필드 작성법을 한국어로 설명합니다.
- Git hooks와 비교해 개념을 빠르게 익힐 수 있게 돕습니다.
- 코드 품질(포맷팅, 린팅, 테스트), 안전(위험 명령 차단), 생산성(알림, 로깅) 레시피를 제공합니다.

## 향후 레시피 (Phase 4)

| 레시피 | 이벤트 | 목적 |
|---|---|---|
| 자동 포맷팅 | PostToolUse | Prettier 자동 실행 |
| 위험 명령 차단 | PreToolUse | `rm -rf`, `DROP TABLE` 등 차단 |
| 완료 알림 | Notification | 데스크톱 알림 |
| 자동 테스트 | PostToolUse | 테스트 파일 변경 시 실행 |
| 작업 로그 | PostToolUse | 수정 이력 자동 기록 |

## 기여 가이드

1. `content/ko/hooks/[recipe-name].md` 파일 생성
2. JSON 스니펫은 **복사-붙여넣기 가능한 완성 형태**로 작성
3. 각 레시피는 "언제 쓰는가 / 동작 원리 / 완전한 settings.json 예시 / 트러블슈팅" 네 부분 필수

## 참고 링크

- [Hooks 공식 가이드](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code 설정 레퍼런스](https://code.claude.com/docs)

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://code.claude.com/docs/en/hooks-guide |
| 라이선스 | Anthropic 공식 문서 (참조용) |
| 해설 작성일 | 2026-04-09 |
| 작성자 | Claude-Code-Study 프로젝트 |

> ⚠️ Hooks는 쉘 명령을 자동 실행하므로 잘못 설정하면 파괴적 결과를 낳을 수 있습니다. 반드시 안전한 환경에서 먼저 테스트하세요.
