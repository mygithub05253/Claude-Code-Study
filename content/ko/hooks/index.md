---
title: "Hooks"
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "공식 문서"
last_reviewed: "2026-04-12"
tags: ["hooks", "automation", "index"]
---

# Hooks 레시피

> **Hooks** 는 Claude Code의 특정 이벤트(도구 실행 전·후, 알림 등)에서 쉘 명령을 자동 실행시키는 기능입니다. `.claude/settings.json`의 `hooks` 필드로 설정합니다.

<CardGrid>
  <CardItem
    title="자동 포맷팅"
    tag="코드 품질"
    summary="파일 편집 후 Prettier 자동 실행 — PostToolUse(Edit) 이벤트 활용"
    link="/hooks/auto-format"
  />
  <CardItem
    title="위험 명령 차단"
    tag="안전"
    summary="rm -rf, DROP TABLE, force-push 등 파괴적 명령 PreToolUse에서 차단"
    link="/hooks/block-dangerous"
  />
  <CardItem
    title="완료 알림"
    tag="생산성"
    summary="작업 완료 시 데스크톱 알림 — 긴 작업 중 다른 일을 하다가 완료 확인"
    link="/hooks/notify-complete"
  />
  <CardItem
    title="자동 테스트"
    tag="코드 품질"
    summary="테스트 파일 변경 시 자동으로 테스트 실행 — PostToolUse(Write) 활용"
    link="/hooks/auto-test"
  />
  <CardItem
    title="작업 로그"
    tag="생산성"
    summary="파일 수정 이력을 자동으로 로그 파일에 기록 — 감사 추적·복원에 활용"
    link="/hooks/work-log"
  />
</CardGrid>

## Hooks 기본 설정 구조

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "prettier --write $CLAUDE_FILE_PATH" }
        ]
      }
    ]
  }
}
```

이벤트 종류: `PreToolUse`, `PostToolUse`, `Notification`, `Stop`

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| 라이선스 | Anthropic 공식 문서 (참조용) |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |

> ⚠️ Hooks는 쉘 명령을 자동 실행하므로 잘못 설정하면 파괴적 결과를 낳을 수 있습니다. 안전한 환경에서 먼저 테스트하세요.
