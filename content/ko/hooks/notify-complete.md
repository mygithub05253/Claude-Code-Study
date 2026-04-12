---
title: "작업 완료 알림 훅 (notify-complete)"
category: hooks
source_url: "https://docs.anthropic.com/en/docs/claude-code/hooks"
source_author: "Anthropic"
license: "CC BY 4.0 (문서 기준)"
last_reviewed: "2026-04-12"
tags: ["hooks", "자동화", "알림", "notify", "stop", "windows"]
---

# 작업 완료 알림 훅 (notify-complete)

## 한 줄 요약

Claude가 긴 작업을 마치면 `Stop` 훅을 통해 Windows 알림 또는 콘솔 메시지로 완료를 즉시 알려준다.

## 언제 사용하나요?

- Claude에게 긴 리팩토링이나 대량 파일 생성을 맡기고 다른 작업을 하다가 완료 시점을 놓치는 경우
- 터미널을 백그라운드로 두고 완료 신호를 받고 싶을 때
- 테스트 실행이나 빌드처럼 시간이 걸리는 작업 후 즉시 결과를 확인해야 할 때
- 집중 모드(Focus Mode)에서 Claude 작업 완료만 알림으로 받고 싶을 때

## 핵심 개념

`Stop` 훅은 Claude가 응답을 **완전히 마치고 멈출 때** 실행된다. 에이전트 루프의 마지막 시점이다.

동작 흐름:
```
Claude → 모든 도구 실행 완료 → 최종 응답 출력
  → Stop 훅 트리거
    → 알림 명령어 실행 (Windows Toast / 소리 / 메시지)
  → 사용자에게 알림 표시
```

`Stop` 훅의 특성:
- Claude가 정상적으로 완료한 경우와 중간에 오류로 멈춘 경우 모두에서 실행된다
- 훅의 exit code는 무시된다 (이미 완료된 상태이므로 차단 불가)
- stderr에 출력한 내용은 Claude 세션에 표시되지 않는다 (로그 용도로만 사용)

## 실전 예제

**상황**: Next.js 15 "동아리 공지 게시판" 프로젝트에서 Claude가 대규모 컴포넌트 리팩토링을 완료하면 알림을 받는 설정

### `.claude/settings.json` 설정

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /workspace/scripts/notify-complete.sh"
          }
        ]
      }
    ]
  }
}
```

### `scripts/notify-complete.sh` 스크립트 (Windows Git Bash 환경)

```bash
#!/usr/bin/env bash
# Stop 훅: Claude 작업 완료 시 Windows 알림 전송
# Windows 11 + Git Bash 환경 기준

TITLE="Claude Code 완료"
MESSAGE="작업이 완료되었습니다! 터미널로 돌아오세요."

# ─────────────────────────────────────────────
# 방법 1: PowerShell을 통한 Windows Toast 알림
# ─────────────────────────────────────────────
notify_windows_toast() {
  powershell.exe -NoProfile -Command "
    \$ErrorActionPreference = 'SilentlyContinue'
    Add-Type -AssemblyName System.Windows.Forms
    \$balloon = New-Object System.Windows.Forms.NotifyIcon
    \$balloon.Icon = [System.Drawing.SystemIcons]::Information
    \$balloon.BalloonTipIcon = 'Info'
    \$balloon.BalloonTipTitle = '${TITLE}'
    \$balloon.BalloonTipText = '${MESSAGE}'
    \$balloon.Visible = \$true
    \$balloon.ShowBalloonTip(5000)
    Start-Sleep -Seconds 1
  " 2>/dev/null
}

# ─────────────────────────────────────────────
# 방법 2: Windows msg 명령 (간단, 항상 작동)
# ─────────────────────────────────────────────
notify_msg() {
  msg.exe "%USERNAME%" "${TITLE}: ${MESSAGE}" 2>/dev/null || true
}

# ─────────────────────────────────────────────
# 방법 3: 비프음 + 콘솔 출력 (알림이 안 될 때 fallback)
# ─────────────────────────────────────────────
notify_beep() {
  # 터미널 벨 소리
  echo -e "\a"
  # 콘솔에 완료 메시지 출력 (타임스탬프 포함)
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[notify-complete] ${TIMESTAMP} — Claude 작업 완료"
}

# ─────────────────────────────────────────────
# 실행: Toast → 실패 시 msg → 최후 fallback 벨
# ─────────────────────────────────────────────
if notify_windows_toast; then
  echo "[notify-complete] Windows Toast 알림 전송 완료"
elif notify_msg; then
  echo "[notify-complete] msg 알림 전송 완료"
else
  notify_beep
fi

exit 0
```

### 더 간단한 PowerShell 전용 버전

Git Bash가 불편하다면 `.claude/settings.json`에서 직접 PowerShell을 호출할 수 있다:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NoProfile -WindowStyle Hidden -Command \"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.ShowBalloonTip(4000, 'Claude Code', '작업 완료!', 'Info')\""
          }
        ]
      }
    ]
  }
}
```

### 실제 사용 시나리오

```
# 사용자: 공지 게시판 전체 컴포넌트를 리팩토링해줘 (15분 예상)
# → Claude 작업 시작
# → 사용자는 다른 창에서 다른 작업 진행
# → 15분 후 Claude 완료
# → Windows 알림 팝업: "Claude Code 완료 - 작업이 완료되었습니다!"
# → 사용자가 터미널로 돌아와 결과 확인
```

## 학습 포인트

- **Stop vs PostToolUse 차이**: `PostToolUse`는 개별 도구 실행마다 실행되고, `Stop`은 Claude 세션 전체가 끝날 때 한 번만 실행된다. 완료 알림에는 `Stop`이 적합하다.
- **Windows msg.exe 제약**: `msg.exe`는 Windows Home 에디션에서도 작동하지만, 원격 데스크톱 세션 또는 일부 환경에서는 동작하지 않을 수 있다. Toast 알림 방식을 먼저 시도하는 것이 권장된다.
- **작업 중단 시에도 실행**: Claude가 오류 없이 완료한 경우뿐만 아니라 `Ctrl+C`로 중단하거나 오류로 종료된 경우에도 `Stop` 훅이 실행될 수 있다. 정확한 완료 여부는 `CLAUDE_STOP_REASON` 환경변수로 확인할 수 있다.
- **WSL(Windows Subsystem for Linux) 환경**: WSL bash에서 `powershell.exe`를 호출하면 Windows GUI 알림이 작동한다. Git Bash와 동일한 방식으로 사용 가능하다.
- **macOS/Linux 확장**: macOS는 `osascript -e 'display notification "완료!" with title "Claude Code"'`, Linux는 `notify-send "Claude Code" "작업 완료"` 명령어로 대체할 수 있다.

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/hooks |
| 라이선스 | CC BY 4.0 |
| 해설 작성일 | 2026-04-12 |
| 작성자 | Claude-Code-Study 프로젝트 |
