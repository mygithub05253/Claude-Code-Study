---
title: "작업 내역 로그 훅 (work-log)"
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (문서 기준)"
last_reviewed: "2026-04-12"
tags: ["hooks", "자동화", "로그", "감사", "추적", "PostToolUse"]
---

# 작업 내역 로그 훅 (work-log)

## 한 줄 요약

Claude가 실행하는 모든 도구 사용 내역을 타임스탬프와 함께 `.claude/work.log`에 자동 기록하여 작업 이력을 추적한다.

## 언제 사용하나요?

- Claude가 어떤 파일을 언제 수정했는지 추적해야 할 때
- 긴 세션 후 "Claude가 무슨 작업을 했지?"를 회고할 때
- 팀 프로젝트에서 AI가 수행한 변경 이력을 감사(audit)용으로 보관해야 할 때
- Claude 작업이 예상과 다를 때 로그를 보고 원인을 파악하고 싶을 때

## 핵심 개념

`PostToolUse` 훅은 Claude가 어떤 도구를 실행하든 호출된다. 훅 실행 시 Claude는 현재 도구명(`CLAUDE_TOOL_NAME`), 입력값(`CLAUDE_TOOL_INPUT_*`) 등을 환경변수로 제공한다. 이를 파일에 append하면 전체 작업 이력이 쌓인다.

로그 구조 예시:
```
2026-04-12T14:23:05+09:00 | Write       | frontend/components/NoticeList.tsx
2026-04-12T14:23:12+09:00 | Bash        | pnpm test --run
2026-04-12T14:23:45+09:00 | Edit        | frontend/components/NoticeList.tsx
2026-04-12T14:24:01+09:00 | Read        | frontend/components/NoticeCard.tsx
```

훅이 로그 파일에 쓰는 동작은 Claude의 실제 작업에 영향을 주지 않는다. 순수하게 관찰(observation) 목적으로 동작한다.

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에서 Claude 세션 중 발생한 모든 파일 조작과 명령어 실행을 로그로 보관

### `.claude/settings.json` 설정

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/work-log.sh"
          }
        ]
      }
    ]
  }
}
```

`matcher: ".*"` 는 모든 도구에 반응하는 패턴이다. 특정 도구만 기록하려면 `"Write|Edit|Bash"` 처럼 좁힐 수 있다.

### `scripts/work-log.sh` 스크립트

```bash
#!/usr/bin/env bash
# PostToolUse 훅: Claude의 모든 도구 실행을 work.log에 기록

# ─────────────────────────────────────────────
# 설정
# ─────────────────────────────────────────────
LOG_DIR="/workspace/.claude"
LOG_FILE="${LOG_DIR}/work.log"
MAX_LOG_SIZE_MB=10  # 로그 파일 최대 크기 (MB)

# 로그 디렉토리 생성 (없으면)
mkdir -p "$LOG_DIR"

# ─────────────────────────────────────────────
# 환경변수에서 정보 추출
# ─────────────────────────────────────────────
TOOL_NAME="${CLAUDE_TOOL_NAME:-unknown}"
TIMESTAMP=$(date '+%Y-%m-%dT%H:%M:%S%z')  # KST 기준 ISO 8601

# 도구별 주요 정보 추출
case "$TOOL_NAME" in
  Write|Edit|MultiEdit)
    DETAIL="${CLAUDE_TOOL_INPUT_PATH:-}"
    ;;
  Bash)
    # 명령어 전체가 너무 길 수 있으므로 첫 80자만 기록
    RAW_CMD="${CLAUDE_TOOL_INPUT_COMMAND:-}"
    DETAIL="${RAW_CMD:0:80}"
    if [ ${#RAW_CMD} -gt 80 ]; then
      DETAIL="${DETAIL}..."
    fi
    ;;
  Read)
    DETAIL="${CLAUDE_TOOL_INPUT_PATH:-}"
    ;;
  Glob|Grep)
    DETAIL="${CLAUDE_TOOL_INPUT_PATTERN:-}  [in: ${CLAUDE_TOOL_INPUT_PATH:-}]"
    ;;
  *)
    DETAIL=""
    ;;
esac

# ─────────────────────────────────────────────
# 로그 파일 크기 확인 (순환 로그)
# ─────────────────────────────────────────────
if [ -f "$LOG_FILE" ]; then
  LOG_SIZE_MB=$(du -m "$LOG_FILE" | cut -f1)
  if [ "${LOG_SIZE_MB:-0}" -ge "$MAX_LOG_SIZE_MB" ]; then
    # 기존 로그를 .old로 백업하고 새 파일 시작
    mv "$LOG_FILE" "${LOG_FILE}.old"
    echo "[work-log] 로그 파일 순환: ${LOG_FILE}.old 로 이동" >> "$LOG_FILE"
  fi
fi

# ─────────────────────────────────────────────
# 로그 기록
# ─────────────────────────────────────────────
printf "%-35s | %-15s | %s\n" \
  "$TIMESTAMP" \
  "$TOOL_NAME" \
  "$DETAIL" >> "$LOG_FILE"

exit 0
```

### 로그 확인 스크립트 (`scripts/show-work-log.sh`)

```bash
#!/usr/bin/env bash
# 오늘 날짜의 작업 로그만 보기

LOG_FILE="/workspace/.claude/work.log"
TODAY=$(date '+%Y-%m-%d')

echo "=== Claude 작업 로그 ($TODAY) ==="
echo ""

if [ -f "$LOG_FILE" ]; then
  grep "^${TODAY}" "$LOG_FILE" || echo "(오늘 기록 없음)"
else
  echo "로그 파일 없음: $LOG_FILE"
fi
```

### 로그 출력 예시

```
2026-04-12T14:20:01+0900    | Read            | frontend/app/page.tsx
2026-04-12T14:20:05+0900    | Glob            | **/*.tsx  [in: frontend/]
2026-04-12T14:20:15+0900    | Write           | frontend/components/notices/NoticeList.tsx
2026-04-12T14:20:22+0900    | Write           | frontend/components/notices/NoticeCard.tsx
2026-04-12T14:20:35+0900    | Bash            | pnpm test --run packages/...
2026-04-12T14:20:50+0900    | Edit            | frontend/components/notices/NoticeList.tsx
2026-04-12T14:21:03+0900    | Bash            | git add frontend/components/notices/
```

### `.gitignore` 설정

```
# Claude 작업 로그 (개인 환경별로 다를 수 있음)
.claude/work.log
.claude/work.log.old
```

팀이 공유 감사 로그를 원한다면 `.gitignore`에서 제외하고 커밋할 수도 있다.

## 학습 포인트

- **환경변수 이름 확인 필수**: `CLAUDE_TOOL_NAME`, `CLAUDE_TOOL_INPUT_PATH` 등의 정확한 변수명은 Claude Code 공식 문서의 훅 레퍼런스를 확인해야 한다. 버전에 따라 변수명이 바뀔 수 있다.
- **로그 파일 크기 관리**: 대규모 세션에서 로그가 수십 MB로 불어날 수 있다. 순환 로그(log rotation) 또는 날짜별 파일 분리를 처음부터 설계한다.
- **민감 정보 주의**: Bash 명령어 로그에 API 키나 비밀번호가 포함될 수 있다. 전체 명령어를 기록할 때는 환경변수 값이 포함되지 않도록 주의하고, 로그 파일을 `.gitignore`에 추가한다.
- **성능 영향 최소화**: 모든 도구 실행마다 파일 I/O가 발생하므로 스크립트를 가능한 한 가볍게 유지한다. `printf` 한 줄만 append하는 수준은 거의 오버헤드가 없다.
- **`matcher: ".*"` 범위**: 모든 도구를 기록하면 `Read`, `Glob` 같은 조회 도구도 포함된다. 수정 도구만 기록하고 싶다면 `"Write|Edit|MultiEdit|Bash"`로 좁히는 것이 깔끔하다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| 라이선스 | CC BY 4.0 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
