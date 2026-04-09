---
title: "체계적 조사 (Investigate)"
source: "~/.claude/skills/investigate/SKILL.md"
sourceHash: "sha256:b7d27181a411a66c6f34c0eedd187f776e7aaa97c95d1fa04ce30cfcab407705"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
---

# 체계적 조사 (Investigate)

## 한 줄 요약

버그/장애/이상 동작을 만났을 때 **"증상 → 가설 → 수정"이 아니라 "근본 원인 확정 → 수정"의 순서**를 강제하는 디버깅 스킬이다. `investigate → analyze → hypothesize → implement` 4단계로 진행한다.

## 언제 사용하나요?

- 원인이 명확하지 않은 버그를 마주했을 때
- 테스트가 갑자기 빨간불로 바뀌었는데 "뭐가 바뀌었는지" 모를 때
- 운영 환경에서만 나는 에러, 가끔씩만 나는 에러
- "일단 try/catch로 감싸자" 같은 미봉책이 생각날 때
- 동일 증상을 여러 번 반복해서 겪고 있을 때

반대로, 원인이 이미 100% 명확한 타이포나 단순 오탈자는 이 스킬이 과하다. 바로 고치면 된다.

## 핵심 개념

원본의 **철칙(Iron Law)**은 한 줄이다.

> **근본 원인이 확정되기 전에는 어떤 수정도 하지 않는다.**

이 규칙을 유지하기 위해 4단계를 거친다.

1. **Investigate (조사)**: 에러 메시지, 로그, 재현 절차, 관련 코드를 수집한다. 이 단계에서는 가설을 세우지 않는다. 오직 사실만 모은다.
2. **Analyze (분석)**: 수집한 사실을 엮어 "무슨 일이 일어나고 있는가"를 기술한다. 예: "A 함수가 null을 리턴하는데, B 컴포넌트가 그 값을 `.length`로 접근한다."
3. **Hypothesize (가설)**: 가능한 원인을 나열하고, 각각에 대해 **검증 가능한 가설**을 세운다. "A가 null을 리턴하는 이유는 (a) 요청 파라미터가 비어서, (b) DB에 레코드가 없어서, (c) RLS 정책에 걸려서 중 하나다."
4. **Implement (구현)**: 검증된 원인 하나를 고친다. 여러 가설을 동시에 "혹시 몰라서" 고치지 않는다.

핵심은 **"증상 패치"와 "원인 수정"의 구분**이다. try/catch, `?? 0`, 타입 캐스팅 같은 도구는 원인을 가릴 때가 많다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판을 배포했는데, 임원진 계정으로 로그인했는데도 `/notices/new`에서 "권한 없음" 페이지가 뜬다. 로컬에서는 잘 됐다. 원인을 모른다.

**1) Investigate — 사실 수집**

```bash
# 사실 수집 체크리스트
- 브라우저 Network 탭: /notices/new 요청이 403으로 리다이렉트됨
- Vercel 로그: "User role check failed: role = null"
- 로컬 DB의 profiles 테이블: 해당 사용자 row 존재, role = 'officer'
- 운영 DB의 profiles 테이블: ??? (아직 확인 안 함)
```

이 단계에서는 **가설을 세우지 않는다**. "혹시 Supabase 버그인가?" 같은 추측을 억누른다.

**2) Analyze — 사실 엮기**

```
로컬에서는 profiles.role이 'officer'로 읽힌다.
운영에서는 'role = null'이 로그에 찍힌다.
→ "role 컬럼이 null로 읽히는 지점이 있다"
```

**3) Hypothesize — 가능한 원인 나열**

| # | 가설 | 검증 방법 |
|---|------|-----------|
| H1 | 운영 DB에 해당 사용자의 profiles row가 없다 (FK 미일치) | 운영 DB에서 `select * from profiles where id = ?` 실행 |
| H2 | 운영 DB의 profiles 테이블에 role 컬럼이 없다 (마이그레이션 누락) | 운영 DB 스키마 확인 |
| H3 | 미들웨어가 SSR 쿠키를 제대로 읽지 못한다 (환경변수 누락) | Vercel 환경변수에 SUPABASE_URL, ANON_KEY 확인 |
| H4 | 프로덕션 빌드에서 RLS 정책이 다르게 동작한다 | Supabase SQL Editor에서 직접 쿼리 실행 |

가설은 많아도 된다. 중요한 건 **각 가설이 검증 가능한 절차를 가져야 한다**는 점이다.

**4) Implement — 검증된 원인만 수정**

운영 DB를 보니 `profiles` 테이블에 row는 있지만 `role`이 `null`이다. 로컬에서는 개발 중 시드로 `'officer'`를 넣어 뒀지만, 운영에는 시드를 안 돌린 것이다. **H1이 원인으로 확정.**

```sql
-- 운영 DB에서 실행 (마이그레이션 파일로 관리하는 것이 더 낫다)
update profiles set role = 'officer'
where email = 'leader@example.com';
```

그리고 재발을 막기 위해 **회원가입 시 기본 role을 'member'로 자동 삽입**하는 트리거를 추가하는 별도 태스크를 생성한다.

```sql
-- supabase/migrations/0002_profile_defaults.sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

**중요**: `middleware.ts`나 `auth.ts`에 "role이 null이면 member로 간주" 같은 증상 패치를 넣지 않았다. 그건 근본 문제(시드 누락)를 숨길 뿐이다.

## 학습 포인트

- **가설 없이 사실만 수집하는 단계를 "참고" 말 것**: 사람(그리고 LLM)은 관찰 동시에 해석하려 든다. investigate 스킬의 가치는 이 충동을 의식적으로 분리하는 데 있다.
- **증상 패치의 유혹**: "일단 try/catch로 감싸서 빨간불만 꺼 두자"는 대학생 과제에서 가장 흔한 함정이다. 같은 버그가 다음 주에 다른 형태로 돌아온다.
- **Next.js 15 팁**: 로컬과 운영의 차이로 생기는 버그는 Next.js 프로젝트에서 정말 자주 나온다. 환경변수, 빌드 모드, 캐시, RSC 직렬화 — 이 네 가지는 항상 의심 목록에 넣자.
- **가설은 검증 절차와 세트**: "~ 때문인 것 같다"는 가설이 아니라 추측이다. 가설은 "이 쿼리를 돌려 보면 확인 가능하다" 같은 구체적 절차를 동반해야 한다.

## 원본과의 차이

- 원본의 4단계(Investigate → Analyze → Hypothesize → Implement)와 Iron Law("근본 원인 없이 수정 금지")는 그대로 유지했다.
- 원본은 gstack 생태계의 일부로, 범용 디버깅을 다룬다. 본 해설은 Next.js 15 + Supabase 과제에서 자주 나오는 "로컬 vs 운영" 차이 버그로 예제를 재구성했다.
- 원본은 `systematic-debugging` 스킬과 내용적으로 상당히 겹친다 (같은 Iron Law, 비슷한 단계). gstack 안에서 `investigate`는 워크플로우적 진입점에 가깝고, `systematic-debugging`은 더 이론적·교재적이다. 본 해설에서도 두 스킬을 별도 문서로 분리했지만 서로 참조하자.
- 원본의 특정 단계별 세부 프롬프트나 내부 명령은 본 해설에서 생략했다 — 추측하지 않기 위해서.

> 원본: `~/.claude/skills/investigate/SKILL.md`
