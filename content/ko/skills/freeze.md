---
title: "편집 범위 고정 (Freeze)"
source: "~/.claude/skills/freeze/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 편집 범위 고정 (Freeze)

## 한 줄 요약

현재 세션에서 **지정한 디렉토리 외부**의 파일을 Edit 또는 Write 도구로 수정하지 못하도록 차단하여, 디버깅 또는 집중 작업 시 의도치 않은 파일 변경을 방지하는 스킬이다.

## 언제 사용하나요?

- 특정 모듈(예: `app/notices/`)의 버그만 고치고 싶을 때, 수정이 다른 모듈로 번지는 것을 막고 싶을 때
- "이 폴더만 건드릴게, 나머지는 손대지 마"라는 제약을 Claude에게 명시적으로 부여하고 싶을 때
- 팀원이 작업 중인 모듈이 있고, 내가 그 모듈을 실수로 수정하는 것을 예방하고 싶을 때
- 리팩토링 시 범위를 한 디렉토리로 엄격하게 제한하고 싶을 때
- "freeze", "restrict edits", "only edit this folder", "lock down edits" 등의 표현으로 요청할 때

## 핵심 개념

### 동작 방식

Freeze는 Claude의 도구 사용에 소프트웨어적 제약을 건다.

```
/freeze app/notices
```

이 명령 이후:
- `app/notices/` 내부 파일: Edit, Write 도구 **허용**
- `app/notices/` 외부 파일: Edit, Write 도구 **차단**
- 읽기(Read, Grep, Glob 등): **제한 없음** (어디서나 읽을 수 있음)

**중요**: Freeze는 파일을 **읽는** 것을 막지 않는다. 오직 **쓰는** 것만 막는다. 범위 밖의 파일을 참조하거나 코드를 이해하기 위해 읽는 것은 여전히 가능하다.

### 활성화 방법

```bash
# 특정 디렉토리만 허용
/freeze app/notices

# 여러 디렉토리 허용 (gstack 구현에 따라 다를 수 있음)
/freeze app/notices app/components/notice

# 상대 경로 또는 절대 경로 모두 가능
/freeze ./src/features/notice
```

### 해제 방법

```bash
# 세션 내에서 freeze 해제 → /unfreeze 스킬 참조
/unfreeze
```

또는 세션을 종료하면 자동으로 해제된다.

### Freeze가 필요한 이유

Claude는 디버깅 중에 "문제의 원인"을 찾다 보면 관련된 다른 파일도 수정하려는 경향이 있다. 예를 들어, 공지 목록 컴포넌트의 버그를 찾다가 공통 레이아웃이나 인증 로직을 "개선"하는 경우다. 이런 수정이 나쁜 것은 아니지만, 디버깅 범위를 벗어나면 예상치 못한 부작용이 생길 수 있다.

Freeze는 "이번 작업의 범위는 여기까지"라는 명확한 경계를 만든다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판"에서 `app/notices/` 디렉토리의 페이지네이션 버그를 디버깅 중이다. 인증 로직이나 공통 컴포넌트를 건드리지 않고 공지 관련 파일만 수정하고 싶다.

```bash
# 세션 시작 시
> freeze 스킬로 app/notices/ 디렉토리만 편집 허용해 줘
```

**Freeze 활성화 후 출력**

```
🔒 Freeze 활성화
   허용 경로: app/notices/
   차단 대상: 그 외 모든 경로의 Edit/Write 작업
   읽기 제한: 없음
```

**정상 작업 예시**

```typescript
// app/notices/page.tsx 수정 — ✅ 허용됨

// 페이지네이션 버그: 마지막 페이지에서 빈 배열이 반환되는 문제
// 원인: offset 계산이 잘못되어 범위 초과

// ❌ 기존 코드
const offset = (page - 1) * PAGE_SIZE; // page=1일 때 offset=0 (정상)
                                         // page=0이 들어오면 offset=-20 (버그)

// ✅ 수정된 코드
const safePage = Math.max(1, page); // 최소 1 보장
const offset = (safePage - 1) * PAGE_SIZE;
```

**범위 외 파일 수정 시도 — 차단 예시**

```bash
# 디버깅 중 Claude가 auth 로직 개선을 제안하며 수정하려 할 때
> app/lib/auth.ts에서 getUser 함수의 에러 처리를 개선해 볼게요.
```

Freeze 반응:

```
🔒 [Freeze 차단]

요청 파일: app/lib/auth.ts
허용 범위: app/notices/

현재 세션은 app/notices/ 디렉토리만 편집할 수 있습니다.
auth.ts 개선이 필요하다면 먼저 /unfreeze를 실행하거나,
이번 디버깅 세션이 끝난 후 별도 작업으로 처리하세요.

공지 페이지네이션 버그 수정을 계속 진행할까요?
```

**읽기는 허용 — 참조를 위한 코드 분석**

```bash
# auth.ts를 읽는 것은 가능 (수정 불가능, 읽기는 자유)
> app/lib/auth.ts의 getUser 함수가 어떻게 동작하는지 설명해 줘
```

Freeze 반응:

```
📖 app/lib/auth.ts 읽기 (Freeze 범위 외부이지만 읽기는 허용)

// app/lib/auth.ts
export async function getUser() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}

이 함수는 Supabase 서버 클라이언트를 생성하고 현재 세션의 사용자를 반환합니다.
공지 페이지에서 호출 중인 방식과 연결해 설명이 필요하면 말씀해주세요.
```

**디렉토리 구조와 Freeze 경계 시각화**

```
app/
├── notices/          ← ✅ Freeze 허용 범위
│   ├── page.tsx         (수정 가능)
│   ├── [id]/
│   │   └── page.tsx     (수정 가능)
│   └── create/
│       ├── page.tsx     (수정 가능)
│       └── actions.ts   (수정 가능)
├── auth/             ← ❌ Freeze 차단 범위
│   └── callback/
│       └── route.ts     (수정 불가)
├── lib/              ← ❌ Freeze 차단 범위
│   └── auth.ts          (수정 불가)
└── layout.tsx        ← ❌ Freeze 차단 범위 (수정 불가)
```

## 학습 포인트

- **Freeze는 집중을 강제한다**: 디버깅 중 "이것도 고치면 좋겠다"는 유혹이 생길 때, Freeze가 있으면 지금 하는 작업에만 집중하게 된다. 이는 버그 수정이 다른 버그를 만드는 상황을 막는다.
- **읽기와 쓰기를 분리해서 생각하기**: Freeze는 쓰기만 막는다. 범위 밖의 코드를 이해하기 위해 읽는 것은 언제나 가능하고, 그것이 좋은 디버깅 방법이기도 하다.
- **흔한 실수 — 너무 좁은 범위**: `app/notices/[id]/page.tsx` 하나만 Freeze 허용으로 설정하면, 같은 공지 관련 파일인 `app/notices/page.tsx`도 못 건드리게 된다. 범위는 파일이 아닌 **디렉토리** 단위로 설정하는 것이 실용적이다.
- **Next.js 15 팁**: App Router에서 같은 기능 관련 파일은 `app/[feature]/` 하위에 모아두는 것이 관례다. 이 구조를 따르면 Freeze 범위 설정도 자연스러워진다. `app/notices/` 하나만 허용해도 해당 기능의 모든 페이지, 레이아웃, 액션을 포함할 수 있다.
- **Guard와의 차이**: Freeze는 편집 범위만 제한한다. 위험 명령어(rm, DROP TABLE 등)에 대한 경고가 필요하면 Guard를 사용한다. 파괴적 작업이 없는 디버깅 세션이라면 Freeze만으로 충분하다.

## 원본과의 차이

- 원본은 Freeze의 핵심 동작(지정 디렉토리 외부 Edit/Write 차단)을 간결하게 설명한다. 본 해설은 읽기는 허용되고 쓰기만 차단된다는 점을 명시적으로 강조했다.
- 원본의 "debugging to prevent accidentally fixing unrelated code" 사용 사례를 Next.js App Router의 디렉토리 구조와 연결지어 시각화했다.
- Guard, Careful, Freeze 간의 차이와 사용 시점에 대한 비교를 추가했다. 원본에는 없는 내용이다.
- 디렉토리 트리 시각화로 Freeze 경계를 직관적으로 표현했다.

> 원본: `~/.claude/skills/freeze/SKILL.md`
