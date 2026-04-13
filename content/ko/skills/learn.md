---
title: "프로젝트 학습 관리 (Learn)"
source: "~/.claude/skills/learn/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
tags: ["메모리", "학습관리", "세션연속성", "회고"]
category: "메타"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 프로젝트 학습 관리 (Learn)

## 핵심 개념

### 학습(Learning)이란 무엇인가

여기서 "학습"은 단순한 메모가 아니다. 세션 중에 발견된 **재현 가능한 패턴, 해결된 버그의 근본 원인, 결정의 이유, 주의해야 할 함정** 등 다음 세션에서도 유효한 지식을 말한다.

예시:
- "Supabase RLS 정책에서 `auth.uid()` 를 잘못 참조하면 INSERT가 조용히 실패한다."
- "Next.js 15에서 `dynamic = 'force-dynamic'`을 빠뜨리면 캐시 문제로 공지가 최신화되지 않는다."
- "pnpm workspace에서 `--filter` 없이 install하면 루트 의존성만 설치된다."

### 4가지 핵심 기능

| 기능 | 설명 |
|------|------|
| **Review** | 축적된 학습 전체를 시간순/카테고리별로 확인 |
| **Search** | 키워드로 관련 학습 찾기 (예: "RLS", "캐시") |
| **Prune** | 더 이상 유효하지 않은 오래된 학습 항목 정리 |
| **Export** | 학습 내역을 마크다운 파일로 내보내기 (팀 공유, 문서화) |

### 저장 위치

학습 항목은 Claude Code의 메모리 파일에 누적된다. 이 프로젝트에서는 `C:\Users\kik32\.claude\projects\...\memory\` 경로의 파일들과 연동된다.

## 한 줄 요약

여러 세션에 걸쳐 축적된 **프로젝트 학습(learnings)** 을 조회·검색·정리·내보내기하는 메모리 관리 스킬로, "예전에 이 버그 고쳤었는데…"를 다시 디버깅하는 시간 낭비를 방지한다.

## 프로젝트에 도입하기

```bash
/learn
```

**SKILL.md 파일 위치**: `~/.claude/skills/learn/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트를 3주째 진행 중이다. 오늘 새 세션을 열었는데, 지난번에 Supabase 관련 버그를 고쳤던 것 같은데 정확히 뭘 배웠는지 기억이 안 난다.

### 학습 내역 조회

```bash
# Claude Code 세션에서
> 지금까지 이 프로젝트에서 뭘 배웠는지 보여 줘.
# 또는
> show learnings
> what have we learned
```

Claude가 반환하는 형태 예시:

```markdown
## 프로젝트 학습 내역 (동아리 공지 게시판)

### 데이터베이스 / Supabase
- [2026-04-05] Supabase RLS에서 service_role 키는 RLS를 우회하므로
  클라이언트 측 코드에 절대 노출하면 안 됨. anon 키만 사용할 것.
- [2026-04-07] `notices` 테이블의 INSERT 정책에서 `auth.uid() = author_id`
  조건이 없으면 로그인 없이도 쓸 수 있는 취약점이 생김.

### Next.js 15
- [2026-04-06] Server Action에서 `revalidatePath('/notices')`를 호출하지
  않으면 공지 작성 후 목록이 갱신되지 않음. 반드시 호출할 것.
- [2026-04-08] `generateStaticParams`를 사용하면 빌드 시 공지 ID 목록이
  고정되므로 동적 공지에는 부적합. `dynamic = 'force-dynamic'` 사용.
```

### 특정 주제 검색

```bash
> "캐시" 관련 학습 검색해 줘.
# 또는
> search learnings: cache
```

### 오래된 학습 정리

```bash
> 오래된 학습 항목 정리해 줘. (Next.js 14 시절 학습은 이제 맞지 않을 수 있어)
# 또는
> prune stale learnings
```

Claude가 "이 항목은 라이브러리 v14 기준이라 v15에서는 더 이상 유효하지 않을 수 있습니다. 삭제할까요?" 라고 확인을 요청한다.

### 학습 내보내기

```bash
> 학습 내역을 마크다운 파일로 내보내 줘. 팀원에게 공유하려고.
# 또는
> export learnings
```

출력 파일 예시:

```ts
// 학습을 코드 주석으로 활용하는 패턴
// [학습 2026-04-07] revalidatePath 필수 — 빠뜨리면 캐시 문제 발생
export async function createNotice(formData: FormData) {
  'use server'
  await supabase.from('notices').insert({ ... })
  revalidatePath('/notices') // 이 줄을 절대 빠뜨리지 말 것
}
```

## 학습 포인트 / 흔한 함정

- **세션 간 기억 연속성**: Claude Code는 기본적으로 세션이 끊기면 맥락을 잃는다. Learn 스킬은 이 한계를 보완하는 핵심 도구다. 프로젝트가 길어질수록 가치가 커진다.
- **학습 기록 습관**: 버그를 고쳤을 때, 예상치 못한 동작을 발견했을 때, "다음에 또 이런 상황이 오면 이렇게 하겠다"고 생각될 때마다 Claude에게 학습으로 기록해 달라고 요청하자.
- **Prune 주기**: 라이브러리 메이저 버전 업그레이드 이후, 아키텍처 리팩토링 이후에는 반드시 prune을 실행해야 한다. 오래된 학습이 잘못된 방향으로 이끄는 것이 기록이 없는 것보다 나쁘다.
- **흔한 실수**: 학습을 "이미 다 알고 있다"고 생각해서 기록하지 않는 경우다. 한 달 후 같은 버그를 다시 디버깅하는 경험을 한 번 하면 기록 습관이 생긴다.
- **Next.js 15 관점 팁**: App Router의 캐싱 동작(fetch 캐시, Full Route Cache, Router Cache)은 처음 만나면 직관과 반대인 경우가 많다. 이런 "함정 지식"을 학습으로 남겨두면 다음 세션에서 같은 함정에 빠지지 않는다.

## 관련 리소스

- [retro](./retro.md) — 주간 엔지니어링 회고 스킬
- [health](./health.md) — 코드베이스 건강 상태 점검
- [using-superpowers](./using-superpowers.md) — 스킬 메타 가이드

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
