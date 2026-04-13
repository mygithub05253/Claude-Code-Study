---
title: "체계적 디버깅 (Systematic Debugging)"
source: "~/.claude/skills/systematic-debugging/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:4c5294b035bc51b4f9c3c268f1d6acf6883cf2ef6547fe5a6fabd860967bcf20"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["디버깅", "근본원인", "버그수정", "품질", "철칙"]
category: "품질/안전"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 체계적 디버깅 (Systematic Debugging)

## 핵심 개념

원본의 **철칙(Iron Law)**은 명확하다.

> **근본 원인이 확정되지 않은 상태에서는 어떤 수정도 하지 않는다.**

이를 지키기 위한 4단계:

1. **Phase 1 — Investigation (조사)**: 사실만 수집한다. 에러 메시지, 스택 트레이스, 로그, 재현 절차, 관련 커밋, 환경 차이. 이 단계에서는 해석·가설 금지.
2. **Phase 2 — Pattern Analysis (패턴 분석)**: 수집한 사실에서 **반복되는 패턴**을 찾는다. "이 에러는 항상 X 이후에 난다", "Y 상태에서만 난다". 이 단계는 여전히 해석이지만, 가설을 세우는 건 다음 단계다.
3. **Phase 3 — Hypothesis & Testing (가설·검증)**: 가능한 원인을 나열하고, 각 가설을 **검증 가능한 절차**와 함께 적는다. 한 번에 한 가설씩 검증한다.
4. **Phase 4 — Implementation (구현)**: 검증된 원인 하나를 고친다. "혹시 몰라서 다른 것도 같이 고치자"는 금지. 한 원인, 한 수정.

미봉책의 유혹(try/catch로 덮기, `?? 0`, 타입 캐스팅, "일단 리로드하면 됨")은 거의 항상 **Phase 1~3을 건너뛴 결과**다.

이 스킬은 `investigate` 스킬과 내용이 겹친다. 차이는 강조점이다 — `investigate`가 실제 상황에서 "진입점"으로 쓰이는 워크플로우 스킬이라면, `systematic-debugging`은 원칙 자체를 가르치는 **교재 스킬**에 가깝다.

## 한 줄 요약

모든 버그/테스트 실패/이상 동작 앞에서 **근본 원인을 확정하기 전에는 수정하지 않는다**는 철칙을 4단계(Investigation → Pattern Analysis → Hypothesis/Testing → Implementation)로 강제하는 디버깅 교재 스킬이다.

## 프로젝트에 도입하기

```bash
/systematic-debugging
```

**SKILL.md 파일 위치**: `~/.claude/skills/systematic-debugging/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 배포 후 가끔 목록 페이지가 빈 화면으로 뜬다는 제보. "새로고침하면 정상으로 돌아온다"고 한다. 로컬에서는 재현되지 않는다.

**Phase 1 — Investigation**

수집할 사실 체크리스트:

```
- 제보 시각: 2026-04-05 10:13, 10:47, 14:22 (주로 낮 시간대)
- 브라우저: 크롬/사파리 섞임 → 브라우저 문제는 아님
- 네트워크 탭: /notices 응답이 200이지만 body가 "[]"
- Vercel 로그: 해당 시각에 별도 에러 로그 없음
- DB 쿼리 로그: 정상 응답, 행 5개 반환
- 최근 커밋: Supabase 클라이언트를 Server Component에서 직접 만드는 구조로 변경 (3일 전)
- 관련 파일: app/notices/page.tsx, lib/supabase/server.ts
```

이 단계에서는 "응? Supabase가 이상한가?" 같은 가설을 **쓰지 않는다**. 사실만 수집.

**Phase 2 — Pattern Analysis**

```
- 응답은 200이지만 body가 "[]" (네트워크상 에러 아님)
- DB에는 데이터가 있다 (직접 쿼리로 확인됨)
- → "서버에서 DB는 잘 보이는데, Next.js 응답에는 빈 배열이 들어간다"는 패턴
- 재현: 시간대·브라우저·사용자와 무관. "때때로"만 있음
- → Next.js의 캐싱 계층이 개입하는 시간대? 또는 Vercel의 엣지 캐시?
```

패턴이 보인다: **응답 200 + 빈 body + 서버 코드는 정상**. 이건 "캐시된 빈 응답"의 냄새다.

**Phase 3 — Hypothesis & Testing**

| # | 가설 | 검증 방법 |
|---|------|-----------|
| H1 | Next.js의 `fetch` 기본 캐시가 초기 빈 응답을 캐싱했다 | `app/notices/page.tsx`에서 `cache: "no-store"` 또는 `dynamic = "force-dynamic"` 추가 후 재배포 |
| H2 | Vercel Edge Network가 Stale 응답을 서빙한다 | Vercel 대시보드 Edge Requests 통계 확인, 해당 시각 캐시 히트 여부 |
| H3 | Supabase 클라이언트가 요청 간 상태를 공유해 쿠키 꼬임 발생 | 서버 로그에 Supabase 세션 정보 dump |
| H4 | 첫 배포 직후 RSC 페이로드가 비어 있는 구버전 캐시가 남아 있다 | 배포 시각과 제보 시각의 상관관계 확인 |

**Phase 4 — Implementation**

H1과 H2를 우선 검증한다. 로그를 보니 배포 직후 첫 수 분간 Edge Cache Hit가 있고, 그 기간에 정확히 빈 응답이 나오는 패턴이다. **H1이 원인으로 확정**.

```ts
// 근본 원인 기반 수정
// app/notices/page.tsx
export const dynamic = "force-dynamic"; // 또는 revalidate: 0

import { createClient } from "@/lib/supabase/server";

export default async function NoticesPage() {
  const supabase = createClient();
  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error; // 증상 덮기 금지

  return <NoticeList notices={notices ?? []} />;
}
```

**미봉책이었다면 이런 코드가 나왔을 것이다**:

```ts
// app/notices/page.tsx
export default async function NoticesPage() {
  const data = await fetchNotices();
  if (data.length === 0) {
    // "혹시 캐시 이슈일지 모르니 한 번 더 시도"
    return redirect("/notices?t=" + Date.now());
  }
  return <NoticeList notices={data} />;
}
```

이 미봉책은 증상은 가리지만, 같은 "빈 응답 캐시" 문제가 나중에 다른 페이지에서 다시 나타난다. Phase 1~3을 거쳤다면 이런 코드를 쓸 이유가 없다.

## 학습 포인트 / 흔한 함정

- **"근본 원인 없이 수정 금지"가 가장 어렵다**: 대학생 과제의 현실에서는 마감이 급해 "일단 돌아가게만"이 유혹적이다. 하지만 이 유혹에 굴복할 때마다 버그 관리 비용이 복리로 늘어난다.
- **사실 수집과 해석을 분리하는 훈련**: 인간의 뇌는 관찰과 동시에 해석하려 든다. "에러 메시지에 'null'이 있으니 null 체크 넣자"가 튀어나올 때, 한 박자 멈추고 "왜 null인지"를 먼저 묻자.
- **`investigate` vs `systematic-debugging`**: 두 스킬은 철학이 같다. 실전에서는 `investigate`가 "진입점", `systematic-debugging`이 "교재" 정도로 쓰면 된다. 경험 많은 개발자는 이 구분을 의식하지 않고 둘 다 같은 루틴으로 돌린다.
- **Next.js 15 팁**: App Router의 캐시 계층(Full Route Cache, Data Cache, Router Cache)은 "때때로 빈 응답" 류 버그의 단골 원인이다. `dynamic`, `revalidate`, `cache: "no-store"` 사용법을 체계적으로 기억해 두자.
- **미봉책의 세 가지 냄새**: (1) "일단 X로 해 두고 나중에", (2) `try/catch`로 에러를 삼킴, (3) "이 부분만 피하면 됨" — 이 세 가지 중 하나가 떠오르면 Phase 1로 돌아가자.

## 관련 리소스

- [investigate](./investigate.md) — 실전 진입점 디버깅 워크플로우
- [test-driven-development](./test-driven-development.md) — 버그 재현 테스트로 재발 방지
- [verification-before-completion](./verification-before-completion.md) — 수정 완료 전 검증

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
