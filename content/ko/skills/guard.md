---
title: "최대 안전 모드 (Guard)"
source: "~/.claude/skills/guard/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 최대 안전 모드 (Guard)

## 한 줄 요약

`/careful`(위험 명령어 경고)와 `/freeze`(지정 디렉토리 외 편집 차단)를 **동시에 활성화**하여 프로덕션 서버 접근이나 라이브 시스템 디버깅 시 최대 수준의 안전장치를 제공하는 스킬이다.

## 언제 사용하나요?

- 프로덕션 데이터베이스에 직접 접근하거나 라이브 서버를 건드려야 할 때
- `rm -rf`, `DROP TABLE`, `force-push` 같은 파괴적 명령이 실수로 실행될 위험이 있을 때
- 특정 모듈/디렉토리만 디버깅하고 싶은데, 관련 없는 코드를 실수로 수정하는 것을 막고 싶을 때
- 팀원의 컴퓨터에서 작업하거나, 낯선 코드베이스에서 핫픽스를 적용할 때
- "guard mode", "full safety", "lock it down", "maximum safety" 등의 표현으로 Claude에게 요청할 때

## 핵심 개념

Guard 스킬은 두 개의 독립된 안전 레이어를 결합한다.

### 레이어 1: Careful (위험 명령어 경고)

다음과 같은 파괴적 작업을 실행하기 전에 **반드시 확인을 요청**한다.

| 명령어 패턴 | 위험 수준 | 예시 |
|---|---|---|
| `rm -rf` | 높음 | 디렉토리 강제 삭제 |
| `DROP TABLE` / `DELETE FROM` | 높음 | 데이터베이스 레코드 삭제 |
| `git push --force` | 높음 | 원격 브랜치 기록 덮어쓰기 |
| `git reset --hard` | 높음 | 작업 내역 영구 손실 |
| `UPDATE` (WHERE 없음) | 높음 | 전체 행 업데이트 |
| `truncate` | 중간 | 파일/테이블 비우기 |
| `chmod -R 777` | 중간 | 권한 과도 부여 |

Careful 모드에서는 위 패턴이 감지되면 Claude가 명령을 실행하기 전에 **"이 명령은 X를 수행합니다. 실행할까요?"**라는 확인 메시지를 보낸다. 사용자가 명시적으로 "예" 또는 "진행해"라고 답해야만 실행된다.

### 레이어 2: Freeze (편집 범위 제한)

지정한 디렉토리 **외부**의 파일을 Edit 또는 Write 도구로 수정하려 하면 차단한다.

```
Guard 활성화: /notices 디렉토리만 편집 허용
→ app/notices/ 내부 파일: ✅ 편집 가능
→ app/auth/ 파일: ❌ 차단 (범위 외부)
→ package.json: ❌ 차단 (범위 외부)
```

이 두 레이어가 결합되면:
- 실수로 **다른 팀원의 코드를 건드리는** 일이 없어진다
- 프로덕션 환경에서 파괴적 SQL을 실수로 실행하는 일이 없어진다
- 디버깅 범위가 명확하게 제한되어 집중도가 높아진다

### Guard vs Careful vs Freeze 비교

| 스킬 | 위험 명령어 경고 | 편집 범위 제한 |
|---|---|---|
| `/careful` | ✅ 활성화 | ❌ 없음 |
| `/freeze [dir]` | ❌ 없음 | ✅ 활성화 |
| `/guard [dir]` | ✅ 활성화 | ✅ 활성화 |

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript "동아리 공지 게시판" 프로젝트. 프로덕션 Supabase 데이터베이스에서 버그를 디버깅해야 한다. 공지 테이블(`notices`)에 잘못된 데이터가 들어간 것 같고, SQL로 직접 확인해야 한다. 실수로 다른 테이블을 건드리거나 데이터를 삭제하는 일을 막고 싶다.

```bash
# Claude Code 세션에서
> guard 모드로 진입해 줘. app/notices/ 디렉토리만 편집 허용.
```

**Guard 활성화 후 세션 동작**

```
✅ Guard 모드 활성화
   - Careful: 위험 명령어 실행 전 확인 요청
   - Freeze: app/notices/ 외부 편집 차단
```

**시나리오 1: SQL 확인 쿼리 (안전)**

```sql
-- 공지 테이블 최근 데이터 조회 (읽기 전용 — 경고 없음)
SELECT id, title, created_at, author_id
FROM notices
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

Guard 모드에서 `SELECT`는 파괴적이지 않으므로 경고 없이 실행된다.

**시나리오 2: 잘못된 데이터 수정 (경고 발생)**

```sql
-- ⚠️ Claude가 경고를 표시하는 쿼리
UPDATE notices
SET is_pinned = false;
-- WHERE 절 없음! 전체 공지의 is_pinned가 false로 변경됨
```

Guard 반응:

```
⚠️  [Careful 경고] 위험한 SQL 감지

이 UPDATE 문에는 WHERE 절이 없습니다.
공지 테이블의 모든 행(현재 47개)의 is_pinned가 false로 변경됩니다.

실행할까요? (yes/no)
> no

✋ 취소됨. WHERE 절을 추가하거나 의도를 다시 확인하세요.

// ✅ 안전한 버전
UPDATE notices
SET is_pinned = false
WHERE id = '공지-uuid-1234'; -- 특정 공지만 수정
```

**시나리오 3: 범위 외 파일 편집 시도 (차단)**

```bash
# 디버깅 중 app/auth/actions.ts 파일을 수정하려 할 때
> app/auth/actions.ts의 getUser 함수를 수정해 줘
```

Guard 반응:

```
🔒 [Freeze 차단] 편집 범위 외부 접근 거부

요청한 파일: app/auth/actions.ts
허용된 범위: app/notices/

app/auth/ 디렉토리는 현재 Guard 모드의 편집 범위 밖입니다.
범위를 확장하려면 먼저 guard를 해제하거나 범위를 업데이트하세요.
```

**Next.js 15 환경에서 Guard 활용 예시**

```typescript
// 실수를 방지하는 구체적인 시나리오:
// Supabase 마이그레이션 스크립트 작성 중 Guard 활성화

// ❌ 실수하기 쉬운 패턴 (Guard가 잡아줌)
const { error } = await supabase
  .from("notices")
  .delete(); // .match() 없이 전체 삭제 시도

// ✅ Guard 경고 후 수정된 패턴
const { error } = await supabase
  .from("notices")
  .delete()
  .match({ id: noticeId }); // 특정 ID만 삭제
```

## 학습 포인트

- **Guard는 마지막 방어선이다**: Guard가 있다고 해서 주의를 덜 기울여도 되는 것이 아니다. Guard는 "실수를 막는 것"이지 "실수를 대신 생각해 주는 것"이 아니다. 프로덕션 작업 전 항상 스테이징 환경에서 먼저 검증한다.
- **Guard는 작업 후 해제해야 한다**: Guard 모드는 세션이 끝나면 자동으로 해제된다. 하지만 장시간 작업 중 Guard가 활성화된 것을 잊으면 정상적인 작업이 불필요하게 차단될 수 있다. 작업 범위가 명확해지면 `/unfreeze`로 해제한다.
- **흔한 실수 — "일단 yes 누르기"**: Guard 경고가 뜰 때 내용을 읽지 않고 "yes"를 누르는 습관은 Guard를 무용지물로 만든다. 경고가 뜨면 **반드시 무엇이 위험한지 읽고** 의도와 일치하는지 확인한다.
- **Next.js 15 팁**: Server Action에서 `supabase.from(...).delete()` 호출 시 `.match()` 또는 `.eq()` 없이는 전체 테이블이 삭제될 수 있다. Guard의 "WHERE 없는 DELETE" 경고는 이 패턴을 잡아준다.
- **팀 프로젝트 팁**: 다른 팀원이 작업 중인 모듈에서 핫픽스를 적용할 때 Guard를 사용하면, 내 변경이 그 팀원의 작업 범위를 실수로 건드리지 않도록 명확한 경계를 만들 수 있다.

## 원본과의 차이

- 원본은 `/careful`과 `/freeze`를 결합한다고 설명한다. 본 해설은 각 레이어가 무엇을 하는지, 그리고 둘이 어떻게 상호작용하는지를 표와 시나리오로 구체화했다.
- 원본에서 언급하는 "prod or debugging live systems" 사용 사례를 Supabase + Next.js 15 Server Action 맥락으로 재해석했다.
- Guard, Careful, Freeze 세 스킬의 차이를 비교 표로 정리했다. 원본에는 이 비교가 없다.
- SQL WHERE절 없는 UPDATE/DELETE 경고 시나리오를 대학생 프로젝트 맥락에서 구체적으로 작성했다.

> 원본: `~/.claude/skills/guard/SKILL.md`
