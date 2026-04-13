---
title: "개발 브랜치 완료 처리 (Finishing a Development Branch)"
source: "~/.claude/skills/finishing-a-development-branch/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["finishing-a-development-branch", "브랜치", "PR", "머지", "커밋 정리"]
category: "배포"
---

# 개발 브랜치 완료 처리 (Finishing a Development Branch)

## 핵심 개념

### 세 가지 통합 경로

Finishing a Development Branch는 상황에 따라 세 가지 경로를 안내한다.

#### 경로 A — 직접 머지 (Direct Merge)

혼자 개발하는 소규모 프로젝트 또는 이미 충분한 리뷰가 구두로 이뤄진 경우.

```
feature/add-image-upload → main
방법: git merge --no-ff (merge commit으로 이력 명확화)
     또는 git rebase + merge (선형 이력 유지)
```

#### 경로 B — Pull Request 생성 (PR Creation)

팀 협업 또는 코드 리뷰가 필요한 경우. 스킬은 다음을 자동화한다.

1. PR 제목과 본문 초안 생성 (변경 사항 요약 + 테스트 방법 체크리스트)
2. `gh pr create` 실행
3. 리뷰어 지정 제안
4. Draft PR로 먼저 올릴지 여부 결정

#### 경로 C — 정리 후 통합 (Cleanup + Merge)

커밋 이력이 지저분하거나 WIP 커밋이 섞인 경우. 스킬은 다음을 안내한다.

1. `git log --oneline` 결과 분석
2. squash 대상 커밋 식별 ("WIP", "fix typo", "minor" 등)
3. `git rebase -i`로 정리 후 머지 또는 PR 생성

### 언제 사용하나요?

- "다 됐어, 이제 어떻게 해?", "브랜치 마무리해 줘" 같은 요청을 받았을 때
- 기능 구현이 완료되고 `pnpm test`가 전부 통과한 순간
- 혼자 작업하는 사이드 프로젝트에서 직접 머지할지 PR을 만들지 결정이 필요할 때
- 팀 작업에서 PR 작성, 리뷰 요청, 브랜치 삭제까지 한 번에 처리하고 싶을 때
- `git log --oneline` 결과가 너무 지저분해서 squash 머지가 필요한지 판단할 때

### 완료 후 정리 작업

통합 방법과 무관하게, 머지 후 공통으로 수행하는 정리 작업이 있다.

- **브랜치 삭제**: `git branch -d feature/xxx` (로컬) + `git push origin --delete feature/xxx` (원격)
- **관련 이슈 닫기**: PR 본문의 `Closes #123` 키워드 확인 또는 수동 닫기
- **Document Release 제안**: 새 기능이 추가된 경우 `/document-release` 스킬 실행 제안
- **다음 작업 스냅샷**: MEMORY.md 또는 프로젝트 TODO 갱신 제안

## 한 줄 요약

구현이 완료되고 테스트가 모두 통과한 뒤, **머지/PR 생성/정리 중 어떤 통합 방법을 선택할지 구조화된 선택지를 제시하고 선택한 경로를 완전히 수행**하는 스킬이다.

## 프로젝트에 도입하기

```bash
/finishing-a-development-branch
```

**SKILL.md 파일 위치**: `~/.claude/skills/finishing-a-development-branch/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: "동아리 공지 게시판"의 `feature/add-image-upload` 브랜치 작업이 완료됐다. `pnpm test`와 `pnpm typecheck`가 모두 통과했다. 이제 브랜치를 마무리해야 한다.

### 1단계 — 스킬 실행

```bash
> finishing-a-development-branch 스킬로 feature/add-image-upload 브랜치 마무리해 줘
```

### 2단계 — 현황 파악 및 선택지 제시

```
[Finishing Branch] 현황 분석

브랜치: feature/add-image-upload
베이스: main (3 커밋 뒤처짐)
테스트: ✓ 전체 통과 (47 tests)
타입체크: ✓ 오류 없음

커밋 이력 (8개):
  abc1234 feat: 이미지 업로드 S3 연동
  def5678 feat: ImageUploader 컴포넌트 구현
  ghi9012 WIP: 드래그앤드롭 임시 저장      ← WIP
  jkl3456 fix: S3 presigned URL 만료 이슈
  mno7890 fix typo in ImageUploader        ← 정리 대상
  pqr1234 test: ImageUploader 단위 테스트
  stu5678 docs: S3 설정 방법 README 추가
  vwx9012 chore: aws-sdk 패키지 설치

⚠ WIP 커밋 1개, "fix typo" 커밋 1개 발견 → 정리 권장

통합 방법을 선택하세요:
  A. 직접 머지 (혼자 작업, 빠른 통합)
  B. PR 생성 (팀 리뷰, GitHub 이슈 연동)
  C. 커밋 정리 후 PR 생성 (권장 — 이력 깔끔하게)

> C
```

### 3단계 — 커밋 정리 (Squash)

```bash
[Finishing Branch] 커밋 정리 계획

다음 커밋을 squash할 예정입니다:
  ghi9012 WIP: 드래그앤드롭 임시 저장    ↘ def5678에 squash
  mno7890 fix typo in ImageUploader      ↘ def5678에 squash

최종 커밋 이력 (6개):
  abc1234 feat: 이미지 업로드 S3 연동
  def5678 feat: ImageUploader 컴포넌트 구현 (드래그앤드롭 포함)
  jkl3456 fix: S3 presigned URL 만료 이슈 수정
  pqr1234 test: ImageUploader 단위 테스트 추가
  stu5678 docs: S3 환경 변수 설정 방법 README 추가
  vwx9012 chore: @aws-sdk/client-s3 패키지 설치

진행할까요? (y/n) > y
```

### 4단계 — PR 생성

생성되는 PR 본문 예시:

```markdown
## 변경 사항
- 공지 작성 시 이미지 업로드 기능 추가 (최대 5장)
- ImageUploader 컴포넌트: 드래그앤드롭 + 클릭 업로드 지원
- AWS S3 presigned URL 기반 안전한 직접 업로드
- Notice 데이터 모델에 `imageUrls: string[]` 필드 추가

## 테스트 방법
- [ ] 공지 작성 페이지에서 이미지 드래그앤드롭 동작 확인
- [ ] 5장 초과 업로드 시 에러 메시지 표시 확인
- [ ] 업로드된 이미지가 공지 상세 페이지에서 보이는지 확인
- [ ] S3_BUCKET_NAME 환경 변수 미설정 시 에러 처리 확인

## 관련 이슈
Closes #42

## 참고
- AWS 콘솔에서 S3 버킷 생성 및 CORS 설정 필요
- `.env.example` 참조: S3_BUCKET_NAME, AWS_REGION, AWS_*KEY
```

### 5단계 — 머지 후 정리

```bash
[Finishing Branch] PR #58 머지 완료

정리 작업 수행:
  ✓ 로컬 브랜치 삭제: feature/add-image-upload
  ✓ 원격 브랜치 삭제
  ✓ 이슈 #42 자동으로 닫힘 (Closes 키워드)

추천 다음 단계:
  → /document-release 실행 (README 환경 변수 섹션 갱신 필요)
  → .canary 모니터링 시작 (이미지 업로드 기능 배포 후 감시)
```

## 학습 포인트 / 흔한 함정

- **WIP 커밋은 머지 전에 반드시 정리**: `git commit -m "WIP"`, `git commit -m "fix"`, `git commit -m "a"` 같은 커밋이 main 브랜치 이력에 들어가면, 나중에 `git log`로 변경 이유를 추적할 때 아무 정보도 없는 노이즈가 된다.
- **흔한 실수 — 빠르다고 `git push -f` 남용**: squash 후 강제 push가 필요한 경우가 있지만, 공유 브랜치(다른 사람이 checkout한 브랜치)에 `git push -f`를 하면 동료의 이력이 꼬인다. 혼자 사용하는 feature 브랜치에만 사용한다.
- **PR 본문은 코드 리뷰어를 위한 안내서다**: "무엇을 바꿨는가"는 diff를 보면 알 수 있다. PR 본문에서 중요한 것은 "왜 바꿨는가"와 "어떻게 테스트하면 되는가"다.
- **이 프로젝트 적용**: 이 프로젝트의 `CLAUDE.md`에는 "main 직접 push, P1부터 feature 브랜치 + PR" 전략이 명시되어 있다. Finishing Branch 스킬은 이 전략에서 경로 A(직접 머지, MVP 단계)와 경로 B(PR, P1 이후)를 명확히 구분해 안내한다.
- **Next.js 15 팁 — `pnpm typecheck` 필수**: 테스트 통과만으로는 부족하다. `pnpm typecheck`(= `tsc --noEmit`)를 브랜치 완료 전에 반드시 실행해 타입 오류가 없는지 확인한다. 타입 오류는 런타임에 나타나지 않다가 배포 후 갑자기 터지는 경우가 있다.

## 관련 리소스

- [document-release](./document-release.md) — 머지 후 문서 동기화 (브랜치 완료 이후 단계)
- [ship](./ship.md) — 배포 파이프라인 자동화
- [review](./review.md) — 머지 전 코드 리뷰 자동화

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
