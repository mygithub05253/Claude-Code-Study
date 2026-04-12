---
title: "브라우저 쿠키 가져오기 (Setup Browser Cookies)"
source: "~/.claude/skills/setup-browser-cookies/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 브라우저 쿠키 가져오기 (Setup Browser Cookies)

## 한 줄 요약

실제 Chromium 브라우저에 저장된 쿠키를 **대화형 도메인 선택 UI**를 통해 Headless 브라우저 세션으로 가져와, 로그인 인증이 필요한 페이지를 Headless 환경에서도 테스트할 수 있게 해주는 쿠키 이식 스킬이다.

## 언제 사용하나요?

- "쿠키 가져와 줘", "사이트에 로그인해 줘", "브라우저 인증해 줘" 같은 요청을 받았을 때
- Headless 브라우저(`/browse`)로 테스트하려는 페이지에 로그인이 필요할 때
- QA 자동화 세션 시작 전, 인증된 사용자 관점의 페이지를 테스트해야 할 때
- 소셜 로그인(카카오, Google, GitHub 등) 때문에 자동 로그인 스크립트 작성이 어려울 때
- 세션 만료 후 Headless 세션을 다시 인증된 상태로 초기화해야 할 때

## 핵심 개념

### Headless 브라우저에서 인증이 왜 문제인가

Headless 브라우저(gstack의 `/browse`)는 사용자의 실제 Chrome 프로필과 **완전히 격리된 새 세션**으로 시작된다. 이 말은 다음을 의미한다.

- 실제 Chrome에서 이미 로그인한 사이트도 Headless에서는 로그아웃 상태
- `document.cookie`가 비어 있어 인증 API 호출 시 401/403 반환
- JWT 토큰, 세션 ID, CSRF 토큰이 모두 없는 초기 상태

기존에는 이 문제를 해결하기 위해 테스트 계정 아이디/비밀번호를 평문으로 스크립트에 넣거나, 소셜 로그인을 우회하는 복잡한 스크립트를 작성해야 했다. Setup Browser Cookies는 이 문제를 **쿠키 이식**으로 해결한다.

### 대화형 도메인 선택 UI

Setup Browser Cookies가 실행되면 다음과 같은 인터랙티브 선택 UI가 나타난다.

```
[Setup Browser Cookies] 실제 Chromium에서 발견된 도메인 목록:

  [ ] accounts.google.com
  [ ] github.com
  [x] localhost:3000         ← 동아리 게시판 개발 서버
  [ ] notion.so
  [x] kakao.com              ← 카카오 소셜 로그인
  [ ] youtube.com
  ...

선택한 도메인의 쿠키를 Headless 세션으로 가져옵니다.
[Enter] 확인  [Space] 토글  [a] 전체선택
```

사용자가 필요한 도메인만 선택하면, 해당 쿠키만 Headless 세션에 복사된다. 불필요한 쿠키(YouTube 등)는 가져오지 않아 프라이버시와 테스트 격리성을 유지한다.

### 쿠키 이식 이후의 세션 상태

쿠키 이식 완료 후 Headless 브라우저는 실제 Chrome과 동일한 인증 상태를 갖는다.

```
[Setup Browser Cookies] 완료

가져온 쿠키:
  localhost:3000  →  next-auth.session-token (만료: 2026-04-15)
  kakao.com       →  _kawlt, _kaot30 (만료: 2026-04-30)

Headless 세션 상태: 인증됨
이제 /browse 또는 /qa 스킬로 인증이 필요한 페이지를 테스트할 수 있습니다.
```

### 보안 고려 사항

- 쿠키는 로컬 머신 내에서만 이동하며 외부로 전송되지 않는다
- Headless 세션은 테스트 종료 후 자동으로 정리된다
- 실제 Chrome의 쿠키는 수정하지 않는다 (읽기 전용 복사)
- 도메인별 선택이 가능하므로 업무 관련 쿠키만 선별적으로 가져올 수 있다

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + NextAuth.js로 구현된 "동아리 공지 게시판"에 로그인 후 볼 수 있는 관리자 페이지(`/admin`)를 Headless QA로 자동 테스트하려 한다. 실제 Chrome에서는 이미 로그인되어 있지만 Headless 세션에서는 로그아웃 상태다.

### 1단계 — 쿠키 없이 Headless 테스트 시도 (실패 케이스)

```bash
> /browse http://localhost:3000/admin 의 공지 목록이 제대로 표시되는지 확인해 줘
```

```
[browse] http://localhost:3000/admin 탐색
[browse] 경고: 302 리디렉션 → /login
[browse] 로그인 페이지로 이동됨 — 인증 필요

→ 인증된 페이지 테스트 불가. setup-browser-cookies 실행 필요.
```

### 2단계 — 쿠키 가져오기 실행

```bash
> setup-browser-cookies 스킬로 로컬 개발 서버 쿠키를 Headless 세션으로 가져와 줘
```

```
[Setup Browser Cookies] 실제 Chrome에서 쿠키 스캔 중...

발견된 도메인 (선택하려면 Space, 확인은 Enter):
  [ ] accounts.google.com
  [x] localhost:3000       ← Space로 선택
  [ ] kakao.com

확인...
[Setup Browser Cookies] localhost:3000 쿠키 이식 완료
  next-auth.session-token: eyJhbGci... (만료: 2026-04-15 23:59)
  next-auth.csrf-token: a3f9... (세션 고정)
Headless 세션 인증 상태: ✓ 완료
```

### 3단계 — 인증 후 Headless QA 재시도

```bash
> /qa http://localhost:3000/admin 의 공지 CRUD 기능 전체를 테스트해 줘
```

```
[qa] http://localhost:3000/admin 탐색 중...
[qa] 인증 확인: 관리자로 로그인됨 ✓

테스트 항목:
  ✓ 공지 목록 표시 (10개 공지 확인)
  ✓ 새 공지 작성 (제목/내용/카테고리 입력 → 저장)
  ✓ 공지 수정 (기존 공지 편집 → 업데이트)
  ✗ 공지 삭제 — 삭제 확인 다이얼로그 버튼 미응답

[qa] 1개 실패 항목 발견: 삭제 다이얼로그 버튼 클릭 이슈
```

발견된 버그 즉시 수정:

```tsx
// components/DeleteConfirmDialog.tsx — 버그 수정
// 문제: Dialog 내부 버튼에 onClick 이벤트는 있으나 type="button"이 없어
//       폼 안에 있을 때 의도치 않게 폼 submit이 발생함

// Before
<button
  onClick={() => onConfirm()}
  className="rounded bg-red-600 px-4 py-2 text-white"
>
  삭제 확인
</button>

// After (setup-browser-cookies QA로 발견된 버그 수정)
<button
  type="button"       // 명시적 type 추가 — 폼 submit 방지
  onClick={() => onConfirm()}
  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2"
>
  삭제 확인
</button>
```

### NextAuth.js와의 통합 예시

```typescript
// middleware.ts — NextAuth 미들웨어 설정
// setup-browser-cookies가 가져오는 쿠키 이름 확인용
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token !== null,
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/admin/:path*', '/my/:path*'],
};

// next-auth.session-token 쿠키가 있으면 위 경로에 접근 가능
// setup-browser-cookies로 이 쿠키를 가져오면 Headless에서도 접근 가능
```

```typescript
// 쿠키 만료 확인 유틸리티 (setup-browser-cookies 전에 실행)
// utils/checkSessionExpiry.ts
export async function checkSessionExpiry(): Promise<boolean> {
  const response = await fetch('/api/auth/session');
  const session = await response.json();

  if (!session?.expires) return false;

  const expiresAt = new Date(session.expires);
  const now = new Date();
  const remainingMinutes = (expiresAt.getTime() - now.getTime()) / 1000 / 60;

  if (remainingMinutes < 5) {
    console.warn(`세션 만료 임박: ${Math.floor(remainingMinutes)}분 남음. 재로그인 필요.`);
    return false;
  }

  return true;
}
```

## 학습 포인트

- **소셜 로그인의 현실적 문제**: 카카오, Google, GitHub 소셜 로그인은 OAuth 리디렉션 플로우가 복잡해서 자동화 스크립트로 로그인을 재현하기 매우 어렵다. Setup Browser Cookies는 이 복잡한 과정을 건너뛰고 이미 로그인된 상태를 바로 활용할 수 있게 해준다.
- **흔한 실수 — 쿠키 만료 후 재테스트 실패**: 쿠키를 가져온 후 시간이 지나 세션이 만료되면 Headless 세션도 다시 로그아웃 상태가 된다. QA 세션이 길어질 경우 중간에 쿠키를 다시 가져와야 한다.
- **흔한 실수 — 운영 환경 쿠키 오염**: 개발 서버(`localhost:3000`) 쿠키와 스테이징/운영 환경 쿠키를 혼동하지 않도록 주의해야 한다. 도메인 선택 UI에서 반드시 올바른 도메인을 선택해야 한다.
- **Next.js 15 팁 — NextAuth 세션 토큰 이름**: NextAuth.js v5(Auth.js)에서는 세션 쿠키 이름이 `next-auth.session-token`(HTTP) 또는 `__Secure-next-auth.session-token`(HTTPS)으로 구분된다. 로컬 개발 서버는 HTTP이므로 `next-auth.session-token`을 선택하면 된다.
- **QA 자동화 워크플로우**: `setup-browser-cookies` → `/qa` → 결과 확인 순서가 인증이 필요한 페이지의 표준 Headless QA 워크플로우다. 이 패턴을 마스터하면 로그인 뒤에 숨겨진 기능을 자동으로 테스트할 수 있다.

## 원본과의 차이

- 원본은 gstack Headless 브라우저와 실제 Chromium 간 쿠키 이식을 위한 내부 API를 사용한다. 본 해설은 NextAuth.js 기반의 Next.js 15 프로젝트에서 어떤 쿠키가 이식되는지를 구체적으로 설명했다.
- 소셜 로그인(카카오, Google, GitHub)이 자동화 인증 스크립트 작성을 어렵게 만든다는 맥락을 추가하여, 왜 쿠키 이식 방식이 실용적인지를 설명했다.
- 쿠키 만료 확인 유틸리티 코드를 추가하여 장시간 QA 세션에서 발생하는 세션 만료 문제를 예방하는 방법을 보여줬다.

> 원본: `~/.claude/skills/setup-browser-cookies/SKILL.md`
