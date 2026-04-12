---
title: "자동 포맷 훅 (auto-format)"
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (문서 기준)"
last_reviewed: "2026-04-12"
tags: ["hooks", "자동화", "prettier", "eslint", "포맷", "코드스타일"]
---

# 자동 포맷 훅 (auto-format)

## 한 줄 요약

Claude가 파일을 수정할 때마다 Prettier와 ESLint를 자동 실행하여 코드 스타일을 항상 일관되게 유지한다.

## 언제 사용하나요?

- Claude가 생성한 코드가 팀 포맷 규칙(Prettier, ESLint)을 어길 때
- 커밋 전에 수동으로 `pnpm format`을 실행하는 것을 잊는 경우
- 여러 파일을 한 번에 수정하는 작업에서 일일이 포맷을 맞추기 번거로울 때
- CI에서 포맷 검사로 인해 빌드가 자주 실패할 때

## 핵심 개념

`PostToolUse` 훅은 Claude가 특정 도구를 사용한 **직후**에 실행된다. `Write`, `Edit`, `MultiEdit` 등 파일 수정 도구가 완료되면 훅이 트리거되어 지정한 명령어를 실행한다.

동작 흐름:
```
Claude → Write/Edit 도구 실행 → 파일 저장됨
  → PostToolUse 훅 트리거
    → prettier --write [파일]
    → eslint --fix [파일]
  → 포맷된 파일 상태로 다음 작업 진행
```

훅 설정에서 `matcher` 필드는 어떤 도구 실행에 반응할지 결정한다. `Write`, `Edit`, `MultiEdit`를 매처로 지정하면 파일 수정이 일어나는 모든 상황을 잡아낼 수 있다.

`exit code` 처리:
- `0`: 정상 완료, Claude 작업 계속
- `1`: 오류 발생, Claude에 stderr 내용 전달 (작업 중단 없음)
- `2`: 작업 차단 (이 훅에서는 사용하지 않음)

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에서 Claude가 컴포넌트를 생성할 때마다 자동 포맷 적용

### `.claude/settings.json` 설정

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/auto-format.sh \"$CLAUDE_TOOL_INPUT_PATH\""
          }
        ]
      }
    ]
  }
}
```

### `scripts/auto-format.sh` 스크립트

```bash
#!/usr/bin/env bash
# Claude가 수정한 파일에 자동으로 포맷 적용
# 인자: $1 = 수정된 파일 경로 (Claude가 환경변수로 주입)

set -e

FILE="$1"

# 파일 경로가 없으면 종료
if [ -z "$FILE" ]; then
  echo "[auto-format] 파일 경로가 없어 건너뜁니다." >&2
  exit 0
fi

# 파일이 존재하는지 확인
if [ ! -f "$FILE" ]; then
  echo "[auto-format] 파일을 찾을 수 없습니다: $FILE" >&2
  exit 0
fi

# TypeScript / JavaScript / TSX / JSX / JSON 파일만 처리
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md)
    echo "[auto-format] 포맷 적용 중: $FILE"
    ;;
  *)
    echo "[auto-format] 대상 파일 아님, 건너뜁니다: $FILE"
    exit 0
    ;;
esac

# Prettier 실행
if command -v prettier &> /dev/null; then
  prettier --write "$FILE" 2>&1
  echo "[auto-format] Prettier 완료: $FILE"
else
  echo "[auto-format] prettier 명령어를 찾을 수 없습니다. pnpm add -D prettier 실행 후 재시도하세요." >&2
fi

# ESLint --fix 실행 (TS/TSX/JS/JSX만)
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx)
    if command -v eslint &> /dev/null; then
      eslint --fix "$FILE" 2>&1 || true  # ESLint 오류가 있어도 중단하지 않음
      echo "[auto-format] ESLint 완료: $FILE"
    else
      echo "[auto-format] eslint 명령어를 찾을 수 없습니다." >&2
    fi
    ;;
esac

exit 0
```

### 실제 사용 시나리오

Claude에게 요청:
```
동아리 공지 게시판의 공지 목록 컴포넌트를 생성해줘.
파일: frontend/components/notices/NoticeList.tsx
```

Claude가 파일을 저장하는 순간 `auto-format.sh`가 자동 실행되어 Prettier와 ESLint가 적용된다. 개발자는 별도로 `pnpm format`을 실행할 필요가 없다.

### pnpm 환경에서 경로 설정

프로젝트가 pnpm workspace 모노레포라면 `node_modules/.bin`에 CLI가 있으므로:

```bash
# scripts/auto-format.sh 상단에 PATH 추가
export PATH="./node_modules/.bin:$PATH"
```

## 학습 포인트

- **파일 경로 주입 방식**: `PostToolUse` 훅에서 수정된 파일 경로는 `CLAUDE_TOOL_INPUT_PATH` 환경변수로 전달된다. 공식 문서의 환경변수 목록을 반드시 확인할 것.
- **무한 루프 주의**: Prettier가 파일을 수정하면 다시 `PostToolUse`가 트리거될 수 있다. 실제로 Hooks는 Claude 도구 실행에만 반응하므로 외부 명령어가 파일을 수정해도 재트리거되지 않는다. 걱정하지 않아도 된다.
- **느린 포맷터 주의**: ESLint `--fix`는 대형 파일에서 수 초가 걸릴 수 있다. 매 저장마다 실행되면 작업 흐름이 느려지므로, 느릴 경우 `PostToolUse`를 `Write`만으로 제한하거나 큰 파일은 제외하는 조건을 추가한다.
- **ESLint 오류 처리**: `eslint --fix`가 수정할 수 없는 오류를 만나면 exit code 1을 반환한다. 스크립트에서 `|| true`를 붙여 Claude 작업이 중단되지 않도록 한다.
- **Windows Git Bash 환경**: `\` 경로 구분자 문제가 발생할 수 있다. `FILE` 변수에 슬래시 변환 처리를 추가하거나 `path.resolve`를 사용한다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| 라이선스 | CC BY 4.0 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
