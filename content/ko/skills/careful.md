---
title: "파괴적 명령어 안전 가드 (Careful)"
source: "~/.claude/skills/careful/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 파괴적 명령어 안전 가드 (Careful)

## 한 줄 요약

`rm -rf`, `DROP TABLE`, `git reset --hard`, `force push`, `kubectl delete` 같은 **되돌리기 어렵거나 불가능한 명령어** 실행 전에 경고를 띄우고 사용자 확인을 요구하는 안전 장치 스킬이다.

## 언제 사용하나요?

- 운영 환경(production) 서버 또는 운영 DB에 접근할 때
- 라이브 시스템을 직접 디버깅하거나 핫픽스를 배포할 때
- 팀원이 공유하는 환경(공용 스테이징, 공유 브랜치)에서 작업할 때
- 대규모 데이터 마이그레이션이나 스키마 변경 작업 전에
- "실수하면 진짜 큰일 나는" 상황에서 Claude에게 위임하기 전에 안전망을 깔고 싶을 때

## 핵심 개념

### 감시 대상 명령어 목록

Careful 모드는 다음 범주의 명령어를 사전에 가로챈다.

| 범주 | 명령어 예시 | 위험 |
|------|------------|------|
| **파일 시스템** | `rm -rf`, `rmdir /s`, `truncate` | 파일/디렉토리 영구 삭제 |
| **데이터베이스** | `DROP TABLE`, `DELETE FROM` (WHERE 없음), `TRUNCATE` | 데이터 영구 삭제 |
| **Git** | `git push --force`, `git reset --hard`, `git clean -f` | 커밋/변경사항 영구 제거 |
| **컨테이너/클러스터** | `kubectl delete`, `docker system prune` | 서비스 종료, 이미지 삭제 |
| **프로세스** | `kill -9 PID`, `pkill -f` | 프로세스 강제 종료 |

### 경고 → 사용자 선택 흐름

```
Claude: 이 명령어는 되돌릴 수 없습니다:
        rm -rf ./uploads/
        계속하시겠습니까? [y/N/이유 설명]

사용자: y  → 실행
사용자: N  → 중단
사용자: "사실 temp 폴더만 지우고 싶어" → 명령어 수정 제안
```

### 사용자 재정의(Override) 허용

경고는 "강제 중단"이 아니라 **확인 요청**이다. 사용자가 의도적으로 위험한 작업임을 알고 있다면 각 경고를 개별적으로 재정의(y)할 수 있다. 스킬은 사용자를 믿지만, 실수할 가능성을 줄여 주는 안전망 역할을 한다.

### Careful 모드 활성화 방법

```bash
# 이 세션 동안 Careful 모드 활성화
> 조심해 줘  # 또는
> careful mode  # 또는
> safety mode  # 또는
> prod mode (운영 환경임을 명시)
```

## 실전 예제 (대학생 관점)

**상황**: Next.js 15 + TypeScript 기반 "동아리 공지 게시판" 프로젝트를 Supabase에 배포했다. 운영 DB에 테스트 데이터가 섞여 있어서 정리하려고 Claude에게 위임하기 전에 Careful 모드를 켰다.

### 시나리오 1: 운영 DB 테스트 데이터 삭제

```bash
> careful 모드로 켜 줘. 운영 Supabase DB에서 테스트 공지 데이터 지우려고.
```

Claude의 동작:

```
⚠️ Careful 모드 활성화됨. 파괴적 작업 전에 반드시 확인하겠습니다.

다음 쿼리를 실행하려 합니다:
DELETE FROM notices WHERE title LIKE '%테스트%';

주의사항:
- 이 작업은 되돌릴 수 없습니다.
- 영향받는 행: 약 12개 (SELECT COUNT(*) 결과)
- 운영 DB 대상입니다.

백업 후 진행을 권장합니다.
계속하시겠습니까? [y/N]
```

### 시나리오 2: 실수로 인한 위험한 Git 명령어

```bash
> main 브랜치 최신 커밋 되돌려 줘.
```

Claude의 동작:

```
⚠️ 파괴적 Git 작업 감지됨:
git reset --hard HEAD~1

이 명령어는 main 브랜치의 마지막 커밋을 영구적으로 제거합니다.
공유 브랜치(main)에서의 reset --hard는 팀원에게 영향을 줍니다.

안전한 대안:
  git revert HEAD  (되돌리는 커밋을 새로 추가, 히스토리 유지)

대안을 사용하시겠습니까? [y(원래 명령)/r(revert 사용)/N(취소)]
```

### 시나리오 3: 전체 업로드 폴더 삭제

```ts
// Claude가 실행하려던 코드
import { execSync } from 'child_process'
execSync('rm -rf ./public/uploads/test-*')
```

Careful 모드가 활성화된 경우:

```
⚠️ 파괴적 파일 시스템 작업:
rm -rf ./public/uploads/test-*

삭제 대상 파일 목록:
  - test-notice-001.jpg (2.3MB)
  - test-banner.png (1.1MB)
  - ... 외 8개 파일

총 11개 파일이 영구 삭제됩니다.
계속하시겠습니까? [y/N]
```

## 학습 포인트

- **"나는 실수 안 해"의 함정**: 피로하거나 집중력이 떨어진 상태에서 운영 환경 작업은 누구나 실수한다. Careful 모드는 개인의 집중력에 의존하는 대신 시스템적 안전망을 제공한다.
- **경고를 무시하는 습관을 피하기**: 경고가 너무 자주 뜨면 무시하게 된다. 개발 환경에서는 Careful 모드를 끄고, 운영/스테이징 환경에 접근할 때만 켜는 것이 좋다.
- **안전한 대안 제안 기능 활용**: 단순히 "하지 마"가 아니라 `git revert`처럼 안전한 대안을 제시해 주는 것이 Careful 스킬의 핵심 가치다. 대안을 읽는 것 자체가 학습이다.
- **흔한 실수**: `git push --force`는 개인 feature 브랜치에서는 허용될 수 있지만, `main` 브랜치에서는 절대 안 된다. Careful 모드는 브랜치 이름을 보고 위험도를 가중한다.
- **Next.js 15 관점 팁**: 빌드 캐시 초기화(`rm -rf .next/`)는 개발 환경에서는 안전하지만, 운영 서버에서 실행하면 일시적인 서비스 중단이 발생할 수 있다. Careful 모드가 이런 맥락을 잡아준다.

## 원본과의 차이

- 원본은 "gstack" 환경을 전제하며, Conductor 워크스페이스 간 작업에서의 파괴적 명령어 감시를 포함한다. 본 해설은 로컬 개발 환경과 Supabase/Vercel 배포 맥락으로 재구성했다.
- 원본에서 감시 대상 명령어 목록은 사용 환경에 따라 확장될 수 있다고 명시한다. 본 해설의 표는 대학생 프로젝트에서 가장 자주 마주치는 명령어를 중심으로 구성했다.
- `kubectl delete` 등 쿠버네티스 관련 명령어는 원본에 포함되지만, 본 해설에서는 간략히 언급만 했다. 대학생 환경에서 쿠버네티스를 직접 운영하는 경우는 드물다.
- CLAUDE.md의 "파괴적 작업은 사용자 승인 필수" 원칙과 이 스킬은 직접 연계된다. 본 프로젝트에서 Careful 스킬은 해당 원칙의 실제 구현체다.

> 원본: `~/.claude/skills/careful/SKILL.md`
