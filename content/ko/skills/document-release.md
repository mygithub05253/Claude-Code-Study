---
title: "릴리즈 후 문서 동기화 (Document Release)"
source: "~/.claude/skills/document-release/SKILL.md"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
---

# 릴리즈 후 문서 동기화 (Document Release)

## 한 줄 요약

PR이 머지되거나 코드가 배포된 직후, **프로젝트의 모든 문서(README, ARCHITECTURE, CONTRIBUTING, CLAUDE.md, CHANGELOG)를 실제 변경 사항과 대조해 자동으로 동기화**하고, 버전 번프와 TODO 정리까지 수행하는 스킬이다.

## 언제 사용하나요?

- "문서 업데이트해 줘", "독스 동기화해 줘", "배포 후 문서 정리해 줘" 같은 요청을 받았을 때
- PR이 머지된 직후 자동으로 호출(프로액티브 제안)할 때
- CHANGELOG의 문체가 일관되지 않거나 "placeholder" 항목이 남아 있을 때
- README의 기능 설명이 실제 코드와 달라져 있는 걸 발견했을 때
- 릴리즈 전 문서 체크리스트를 빠뜨리지 않고 처리하고 싶을 때

## 핵심 개념

### 문서 드리프트(Document Drift)

코드는 빠르게 변하지만 문서는 그 속도를 따라가지 못한다. 이를 **문서 드리프트**라고 한다. 대표적인 증상은 다음과 같다.

- README의 "설치 방법"에 이미 삭제된 환경 변수가 남아 있음
- ARCHITECTURE.md가 6개월 전 구조를 설명하고 있음
- CONTRIBUTING.md의 PR 프로세스가 실제 브랜치 전략과 다름
- CHANGELOG에 "TODO: 설명 추가" 같은 미완성 항목이 남아 있음

Document Release는 diff를 읽고 이 드리프트를 자동으로 해소한다.

### 처리 대상 문서

| 문서 | 처리 내용 |
|------|-----------|
| `README.md` | 기능 목록, 설치 방법, 환경 변수, API 엔드포인트 갱신 |
| `ARCHITECTURE.md` | 컴포넌트/모듈 구조 다이어그램 및 설명 갱신 |
| `CONTRIBUTING.md` | 브랜치 전략, PR 규칙, 코드 스타일 가이드 갱신 |
| `CLAUDE.md` | 프로젝트 전용 Claude 지침 갱신 |
| `CHANGELOG.md` | 새 버전 항목 추가, 문체 통일, TODO 제거 |
| `VERSION` | Semantic Versioning 규칙에 따라 선택적 번프 |

### diff 기반 정밀 업데이트

스킬은 `git diff [base]...HEAD`를 읽고 **실제로 변경된 내용만** 문서에 반영한다. 변경되지 않은 섹션은 건드리지 않는다. 이 방식 덕분에 문서를 처음부터 재작성하는 것보다 빠르고, 기존 맥락이 보존된다.

### CHANGELOG 문체 통일 (Voice Polish)

여러 사람이 작성한 CHANGELOG는 문체가 제각각이다. Document Release는 일관된 서술 규칙을 적용한다.

- 동사로 시작하는 명령형 (`추가:`, `수정:`, `제거:`)
- 사용자 영향 중심 서술 ("로그인 버튼이 모바일에서 클릭 안 되는 문제 수정" ← "버그 픽스")
- 내부 구현 세부 사항 제거 ("useEffect 의존성 배열 수정" → 제거 또는 요약)

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판에 "이미지 업로드" 기능을 추가하는 PR을 머지했다. 이제 README의 기능 목록, CHANGELOG, CLAUDE.md의 환경 변수 섹션을 모두 업데이트해야 한다.

### 1단계 — Document Release 실행

```bash
# PR 머지 후
> document-release 스킬로 방금 머지한 PR의 변경 사항을 문서에 반영해 줘
```

### 2단계 — diff 분석 결과 예시

```
[Document Release] diff 분석 완료

변경 파일 (12개):
  - app/notices/new/actions.ts — S3 presigned URL 추가
  - components/ImageUploader.tsx — 신규 컴포넌트
  - lib/s3.ts — S3 클라이언트 유틸리티
  - prisma/schema.prisma — Notice.imageUrls 필드 추가
  - .env.example — S3_BUCKET_NAME, AWS_REGION 추가
  ... 7개 더

문서 업데이트 필요 항목:
  ✗ README.md > 기능 섹션: "이미지 업로드" 미언급
  ✗ README.md > 환경 변수 섹션: S3_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID 미등록
  ✗ CHANGELOG.md: 0.3.0 항목 없음
  ✗ CLAUDE.md > 주요 라이브러리: @aws-sdk/client-s3 미언급
```

### 3단계 — 자동 업데이트 결과

```markdown
<!-- README.md — 기능 섹션 업데이트 전 -->
## 기능
- 공지사항 CRUD
- 동아리원 인증 (이메일 로그인)

<!-- README.md — 기능 섹션 업데이트 후 -->
## 기능
- 공지사항 CRUD
- 동아리원 인증 (이메일 로그인)
- **이미지 업로드** — 공지당 최대 5장, S3 저장 (v0.3.0 추가)
```

```markdown
<!-- README.md — 환경 변수 섹션 업데이트 -->
## 환경 변수

| 변수명 | 필수 | 설명 |
|--------|------|------|
| DATABASE_URL | ✓ | PostgreSQL 연결 문자열 |
| NEXTAUTH_SECRET | ✓ | NextAuth 서명 키 |
| S3_BUCKET_NAME | ✓ (v0.3.0+) | 이미지 저장 S3 버킷 이름 |
| AWS_REGION | ✓ (v0.3.0+) | S3 버킷 리전 (예: ap-northeast-2) |
| AWS_ACCESS_KEY_ID | ✓ (v0.3.0+) | AWS IAM 액세스 키 |
| AWS_SECRET_ACCESS_KEY | ✓ (v0.3.0+) | AWS IAM 시크릿 키 |
```

```markdown
<!-- CHANGELOG.md — 신규 버전 항목 추가 -->
## [0.3.0] — 2026-04-12

### 추가
- 공지 작성 시 이미지 업로드 기능 (최대 5장, S3 저장)
- ImageUploader 컴포넌트: 드래그앤드롭 + 클릭 업로드 지원
- Notice 데이터 모델에 `imageUrls` 필드 추가

### 변경
- 공지 작성 폼: 이미지 첨부 UI 통합

### 인프라
- AWS S3 연동 (ap-northeast-2 리전)
- 필수 환경 변수 3개 추가 (S3_BUCKET_NAME, AWS_REGION, AWS_*KEY)
```

### 4단계 — VERSION 번프 (선택)

```bash
[Document Release] 버전 번프가 필요합니까?
현재: 0.2.1
제안: 0.3.0 (새 기능 추가 → minor 버전 업)
      0.2.2 (작은 개선만 포함 → patch 버전 업)

> 0.3.0으로 올려 줘
```

```
[Document Release] 업데이트 완료
  ✓ README.md — 기능 섹션, 환경 변수 섹션 갱신
  ✓ CHANGELOG.md — 0.3.0 항목 추가, 문체 통일
  ✓ CLAUDE.md — @aws-sdk/client-s3 라이브러리 언급 추가
  ✓ VERSION — 0.2.1 → 0.3.0
  ✓ 커밋: "docs: v0.3.0 릴리즈 문서 동기화"
```

## 학습 포인트

- **문서는 코드의 일부다**: 기능을 추가하면서 문서를 안 업데이트하는 것은 코드 절반만 쓴 것과 같다. 특히 환경 변수 목록이 낡으면 새 팀원 온보딩 때 "환경 변수 왜 안 돌아가지?"로 수 시간을 낭비하게 된다.
- **흔한 실수 — CHANGELOG를 마지막에 몰아쓰기**: 여러 PR이 쌓인 뒤 한꺼번에 CHANGELOG를 작성하면 내용이 누락되거나 순서가 뒤바뀐다. PR마다 Document Release를 돌려 즉시 기록하는 습관이 중요하다.
- **이 프로젝트(Claude-Code-Study) 적용**: 이 프로젝트의 `CLAUDE.md`에는 "Push 시 README.md 수정 필수" 규칙이 있다. Document Release 스킬을 사용하면 이 규칙을 잊어버리는 실수를 방지할 수 있다.
- **Next.js 15 팁 — `.env.example` 관리**: 실제 `.env.local`은 `.gitignore`에 포함하고, `.env.example`에는 키 이름과 예시값만 커밋한다. Document Release는 `.env.example` 변경을 감지해 README의 환경 변수 표를 자동으로 갱신한다.
- **Semantic Versioning 기억법**: MAJOR(호환성 깨짐) / MINOR(새 기능 추가) / PATCH(버그 수정). 대학 프로젝트에서는 보통 0.x.y 범위에서 MINOR와 PATCH만 사용한다.

## 원본과의 차이

- 원본은 gstack 환경의 코드베이스를 전제한다. 본 해설은 Next.js 15 + pnpm monorepo 환경으로 재구성했다.
- 원본의 "TODOS 정리" 기능을 코드 내 `// TODO:` 주석 추적 및 CHANGELOG 미완성 항목 제거로 구체화해 설명했다.
- 이 프로젝트의 `CLAUDE.md`에 명시된 "Push 시 README.md 수정 필수" 규칙과 Document Release의 연관성을 강조했다.

> 원본: `~/.claude/skills/document-release/SKILL.md`
