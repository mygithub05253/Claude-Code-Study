---
title: "자동 테스트 훅 (auto-test)"
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (문서 기준)"
last_reviewed: "2026-04-12"
tags: ["hooks", "자동화", "vitest", "테스트", "TDD", "PostToolUse"]
---

# 자동 테스트 훅 (auto-test)

## 한 줄 요약

Claude가 소스 파일이나 테스트 파일을 수정할 때마다 Vitest를 자동 실행하여 TDD 사이클을 Claude와 함께 실천한다.

## 언제 사용하나요?

- Claude에게 기능을 구현시키면서 테스트가 동시에 통과하는지 즉시 확인하고 싶을 때
- TDD(Red → Green → Refactor) 사이클을 Claude 작업 흐름에 내장하고 싶을 때
- Claude가 리팩토링을 할 때 기존 테스트가 깨지지 않는지 실시간으로 검증하려 할 때
- 테스트 결과를 Claude에게 즉시 피드백하여 자동 수정 루프를 구성하고 싶을 때

## 핵심 개념

`PostToolUse` 훅이 파일 수정 도구(`Write`, `Edit`, `MultiEdit`) 실행 후 Vitest를 실행한다. 테스트 결과(pass/fail)는 Claude의 다음 응답에 영향을 줄 수 있어, 테스트 실패 시 Claude가 자동으로 코드를 수정하는 루프를 형성할 수 있다.

TDD 자동화 흐름:
```
사용자 → "공지 목록 API를 테스트와 함께 구현해줘"
  → Claude: 테스트 파일 먼저 작성 (Red 단계)
    → PostToolUse 훅: pnpm test --run
      → 테스트 실패 결과를 Claude에 전달
  → Claude: 구현 파일 작성 (Green 단계)
    → PostToolUse 훅: pnpm test --run
      → 테스트 통과 확인
  → Claude: 리팩토링 (Refactor 단계)
    → PostToolUse 훅: pnpm test --run
      → 여전히 통과 확인
```

훅 실행 결과가 Claude에게 전달되는 방식:
- 훅의 stdout/stderr 내용이 Claude의 컨텍스트에 추가된다
- 테스트 실패 메시지가 전달되면 Claude는 이를 인식하고 수정을 시도할 수 있다

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에서 공지사항 API 유틸리티 함수를 TDD로 구현

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
            "command": "bash /workspace/scripts/auto-test.sh \"$CLAUDE_TOOL_INPUT_PATH\""
          }
        ]
      }
    ]
  }
}
```

### `scripts/auto-test.sh` 스크립트

```bash
#!/usr/bin/env bash
# PostToolUse 훅: 파일 수정 후 관련 Vitest 테스트 자동 실행
# 인자: $1 = 수정된 파일 경로

set -e

FILE="$1"
PROJECT_ROOT="/workspace"  # 프로젝트 루트 경로로 변경

# 파일 경로 확인
if [ -z "$FILE" ]; then
  exit 0
fi

# 테스트 실행 대상인지 판별
should_run_test() {
  local file="$1"
  case "$file" in
    # 테스트 파일 자체가 수정됨
    *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx)
      return 0
      ;;
    # 소스 파일 수정 → 관련 테스트 존재 여부 확인
    *.ts|*.tsx)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# 테스트 실행 대상이 아니면 종료
if ! should_run_test "$FILE"; then
  echo "[auto-test] 테스트 대상 아님, 건너뜁니다: $FILE"
  exit 0
fi

echo "[auto-test] 테스트 실행 중... (수정 파일: $FILE)"
echo "────────────────────────────────────"

# 수정된 파일과 관련된 테스트 파일 찾기
BASENAME=$(basename "$FILE" | sed 's/\.[^.]*$//')  # 확장자 제거
DIRNAME=$(dirname "$FILE")

# 관련 테스트 파일 경로 후보들
TEST_CANDIDATES=(
  "${DIRNAME}/${BASENAME}.test.ts"
  "${DIRNAME}/${BASENAME}.test.tsx"
  "${DIRNAME}/__tests__/${BASENAME}.test.ts"
  "${DIRNAME}/__tests__/${BASENAME}.test.tsx"
)

# 관련 테스트 파일이 있으면 해당 파일만 실행 (빠름)
for TEST_FILE in "${TEST_CANDIDATES[@]}"; do
  if [ -f "$TEST_FILE" ]; then
    echo "[auto-test] 관련 테스트 파일 발견: $TEST_FILE"
    cd "$PROJECT_ROOT" && pnpm test --run "$TEST_FILE" 2>&1
    TEST_EXIT=$?
    if [ $TEST_EXIT -eq 0 ]; then
      echo "────────────────────────────────────"
      echo "[auto-test] 테스트 통과"
    else
      echo "────────────────────────────────────"
      echo "[auto-test] 테스트 실패 (exit: $TEST_EXIT)"
    fi
    exit $TEST_EXIT
  fi
done

# 관련 테스트 파일이 없으면 전체 테스트 실행
echo "[auto-test] 관련 테스트 파일 없음 → 전체 테스트 실행"
cd "$PROJECT_ROOT" && pnpm test --run 2>&1
TEST_EXIT=$?

echo "────────────────────────────────────"
if [ $TEST_EXIT -eq 0 ]; then
  echo "[auto-test] 전체 테스트 통과"
else
  echo "[auto-test] 전체 테스트 실패 (exit: $TEST_EXIT)"
fi

exit $TEST_EXIT
```

### 실제 사용 시나리오

Claude에게 요청:
```
공지사항 날짜를 "YYYY년 MM월 DD일" 형식으로 변환하는
formatNoticeDate() 함수를 TDD로 작성해줘.
```

Claude 실행 순서:
```
1. packages/utils/formatNoticeDate.test.ts 작성
   → auto-test.sh 실행 → 테스트 실패 (Red)
   → Claude: "테스트 실패를 확인했습니다. 구현을 작성합니다."

2. packages/utils/formatNoticeDate.ts 작성
   → auto-test.sh 실행 → 테스트 통과 (Green)
   → Claude: "모든 테스트가 통과했습니다."

3. 코드 정리 (Refactor)
   → auto-test.sh 실행 → 여전히 통과 확인
```

### Vitest 설정 (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 자동 테스트 훅에서는 watch 모드 대신 --run 사용
    // CI와 동일한 환경으로 실행
    reporters: ['verbose'],
    // 타임아웃: 훅이 너무 오래 걸리지 않도록 설정
    testTimeout: 10000,
  },
})
```

## 학습 포인트

- **`--run` 플래그 필수**: Vitest의 기본 모드는 watch 모드다. 훅에서 실행할 때는 반드시 `--run`을 붙여 한 번 실행 후 종료하도록 해야 한다. 없으면 훅이 영원히 실행된다.
- **전체 테스트 vs 관련 테스트**: 파일 수정마다 전체 테스트를 실행하면 느려진다. 수정된 파일 이름으로 관련 테스트 파일을 찾아 한정 실행하는 것이 효율적이다.
- **테스트 실패가 Claude를 차단하지 않음**: `PostToolUse` 훅에서 exit code 1로 종료해도 Claude 작업이 완전히 중단되지는 않는다. exit code 2만 도구 실행을 차단한다. 테스트 실패는 Claude에게 피드백으로 전달된다.
- **긴 테스트 스위트 주의**: 테스트가 수백 개라면 매 파일 저장마다 수분이 걸릴 수 있다. `testTimeout`을 낮추고 느린 테스트를 분리하거나, 관련 테스트만 실행하는 로직을 정교하게 짜야 한다.
- **monorepo에서의 경로**: pnpm workspace 모노레포에서는 `cd packages/utils && pnpm test --run`처럼 해당 패키지 디렉토리로 이동해서 실행해야 할 수 있다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| 라이선스 | CC BY 4.0 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
