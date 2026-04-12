---
title: "실제 Chrome 연결 (Connect Chrome)"
source: "~/.claude/skills/connect-chrome/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 실제 Chrome 연결 (Connect Chrome)

## 한 줄 요약

gstack의 Side Panel 확장 프로그램이 자동으로 로드된 **실제 Chrome 창**을 Claude가 직접 제어하도록 연결하여, 모든 브라우저 동작을 사용자가 실시간으로 눈앞에서 관찰할 수 있게 하는 브라우저 자동화 스킬이다.

## 언제 사용하나요?

- "Chrome 연결해 줘", "실제 브라우저로 열어 줘", "Chrome 실행해 줘" 같은 요청을 받았을 때
- Claude의 브라우저 동작을 **실시간으로 직접 눈으로 확인**하고 싶을 때
- 로그인 세션, 쿠키, localStorage가 이미 존재하는 상태에서 테스트해야 할 때
- 사이트의 동적 상호작용(드래그앤드롭, 애니메이션, 모달 팝업 등)을 관찰해야 할 때
- Headless 브라우저로는 재현이 어려운 렌더링 이슈를 디버깅할 때

## 핵심 개념

### Headless vs 실제 Chrome의 차이

Connect Chrome을 이해하려면 먼저 두 가지 브라우저 자동화 방식의 차이를 알아야 한다.

| 항목 | Headless 브라우저 (`/browse`) | 실제 Chrome (`connect-chrome`) |
|------|-------------------------------|-------------------------------|
| 화면 표시 | 없음 (백그라운드) | 있음 (사용자 화면에 표시) |
| 실시간 관찰 | 불가 (스크린샷만) | 가능 (모든 동작 실시간 확인) |
| 쿠키/세션 | 격리된 신규 세션 | 기존 브라우저 세션 공유 가능 |
| 속도 | 빠름 | 실제 브라우저 속도 |
| 용도 | 자동화 테스트, 스크래핑 | 실시간 감독, 인증 필요 작업 |
| Side Panel | 없음 | 있음 (gstack 확장 자동 로드) |

### Side Panel 확장 프로그램

gstack의 Chrome 확장 프로그램은 Connect Chrome 실행 시 자동으로 로드되며, Chrome 우측 사이드 패널에 **실시간 활동 피드(activity feed)**를 표시한다. Claude가 어떤 요소를 클릭하는지, 어떤 텍스트를 입력하는지, 어떤 판단을 내리는지를 텍스트 로그로 보여준다.

```
[Side Panel 활동 피드 예시]
09:32:01  공지 목록 페이지 탐색 중...
09:32:02  "새 공지 작성" 버튼 발견 — 클릭
09:32:03  제목 입력란에 포커스
09:32:04  "정기 총회 공지" 입력 중
09:32:05  내용 에디터로 이동
09:32:07  제출 버튼 클릭
09:32:08  성공 토스트 메시지 확인 ✓
```

### 실제 Chrome 사용의 장점

**1. 기존 세션 재사용**

Connect Chrome은 사용자의 기존 Chrome 프로필에서 실행되므로, 이미 로그인한 사이트의 쿠키와 세션을 그대로 활용할 수 있다. 별도의 인증 절차 없이 인증된 페이지를 바로 테스트할 수 있다.

**2. 렌더링 일관성**

실제 사용자가 보는 것과 100% 동일한 렌더링 환경이다. Headless 브라우저에서는 재현이 어려운 CSS 애니메이션, Web Font 렌더링, GPU 가속 효과도 동일하게 확인된다.

**3. 개입 가능성**

Claude가 실수를 할 것 같다면 사용자가 즉시 개입하여 중단시킬 수 있다. "잠깐, 그 버튼 말고 다른 거 눌러 줘"처럼 실시간 방향 수정이 가능하다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"의 공지 작성 플로우를 직접 눈으로 보면서 QA하고 싶다. Claude가 공지를 작성하는 과정을 실시간으로 관찰하며 UI/UX 문제를 발견한다.

### 1단계 — Chrome 연결

```bash
> connect-chrome 스킬로 Chrome을 실행하고 http://localhost:3000 에 접속해 줘
```

Claude 응답:

```
[connect-chrome] Chrome 창 열림
[connect-chrome] gstack Side Panel 확장 로드 완료
[connect-chrome] http://localhost:3000 탐색 중...
[connect-chrome] 페이지 로드 완료

Side Panel에서 실시간 활동 피드를 확인하세요.
Chrome 창에서 모든 동작이 진행됩니다.
```

### 2단계 — 실시간 QA 세션

```bash
> 공지 작성 플로우 전체를 실행해 줘: 새 공지 작성 → 제목/내용 입력 → 카테고리 선택 → 제출 → 결과 확인
```

이 시점에서 사용자는 Chrome 창을 직접 보면서 Claude의 모든 동작을 관찰한다.

실시간으로 발견할 수 있는 문제 예시:

```
[Side Panel]
09:33:15  카테고리 드롭다운 클릭
09:33:16  경고: 드롭다운이 열리지 않음 — 클릭 이벤트 미등록 의심
09:33:17  대안: Enter 키로 시도
09:33:17  경고: Enter 키도 반응 없음

→ 사용자 관찰: "아, 카테고리 select 컴포넌트에 onClick이 없네!"
→ 즉시 개입: "잠깐, 그 컴포넌트 코드 고쳐 줘"
```

### 3단계 — 발견된 문제 즉시 수정

```tsx
// 실시간 관찰로 발견된 버그 수정
// components/CategorySelect.tsx — Before

// 문제: onChange만 있고 onKeyDown이 없어 키보드 접근성 불가
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="rounded-lg border p-2"
>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>{cat.label}</option>
  ))}
</select>
```

```tsx
// components/CategorySelect.tsx — After (connect-chrome QA로 발견 후 수정)
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  onKeyDown={(e) => {
    // 키보드 접근성: Enter/Space로 선택 가능
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }}
  // 접근성: 명시적 aria-label 추가
  aria-label="공지 카테고리 선택"
  className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>{cat.label}</option>
  ))}
</select>
```

### Headless와 Connect Chrome을 언제 선택할까

```bash
# Headless 브라우저 사용 케이스
> /browse 로 https://example.com 의 공지 목록을 스크래핑해 줘
# → 자동화 배치, 사용자 관찰 불필요, 빠른 스크린샷만 필요할 때

# Connect Chrome 사용 케이스
> connect-chrome 스킬로 동아리 게시판 로그인 + 공지 작성 플로우를 실시간으로 보여 줘
# → 인증 필요, 실시간 관찰 필요, 인터랙션 QA, 개입 가능성 필요할 때
```

## 학습 포인트

- **"Claude를 믿되 확인하라"**: Claude의 브라우저 자동화는 강력하지만 예상치 못한 곳을 클릭하거나 잘못된 판단을 내릴 수 있다. Connect Chrome은 이 과정을 실시간으로 감독할 수 있게 해줘 신뢰성을 높인다.
- **흔한 실수 — 중요한 작업에 Headless 사용**: 실제 데이터에 변경을 가하는 작업(데이터 제출, 삭제, 결제 등)을 Headless로 실행하면 결과를 확인하기 어렵다. 이런 작업은 항상 Connect Chrome으로 실시간 감독하며 진행해야 한다.
- **흔한 실수 — 쿠키 세션 문제**: 로그인이 필요한 페이지를 Headless로 테스트하면 "로그인 안 된 상태"가 되어 실제 동작을 테스트하지 못한다. `/setup-browser-cookies` 또는 Connect Chrome을 사용해야 한다.
- **Next.js 15 팁 — 개발 서버와 연결**: `next dev`로 실행 중인 로컬 개발 서버(`localhost:3000`)에 Connect Chrome을 연결하면, Hot Reload로 코드 수정 → 즉시 브라우저에서 변경 확인이 가능한 실시간 개발 루프를 만들 수 있다.
- **Side Panel을 통한 AI 사고 과정 관찰**: Side Panel의 활동 피드는 Claude가 페이지를 어떻게 이해하는지(어떤 요소를 "버튼"으로 인식하는지 등)를 보여준다. 이 피드를 관찰하면 Claude의 실수를 사전에 예방할 수 있다.

## 원본과의 차이

- 원본은 gstack 플랫폼의 Chrome 확장 프로그램 자동 로드와 Side Panel 실시간 피드 기능이 핵심이다. 본 해설은 이 기능이 왜 유용한지를 Headless 브라우저와의 비교를 통해 설명했다.
- "실제 Chrome vs Headless" 비교 표를 추가하여 어떤 상황에서 어떤 브라우저를 선택해야 하는지 명확한 판단 기준을 제시했다.
- Next.js 15 로컬 개발 서버와의 연동 흐름을 예시로 추가하여 실제 개발 워크플로우에서 어떻게 사용하는지 보여줬다.

> 원본: `~/.claude/skills/connect-chrome/SKILL.md`
