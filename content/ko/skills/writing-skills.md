---
title: "스킬 작성법 (Writing Skills)"
source: "~/.claude/skills/writing-skills/SKILL.md"
sourceHash: "sha256:7cc2872192aae3e9d230ae9d002fa8bb4c204a233b637d951e0722cb7f98c0da"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
---

# 스킬 작성법 (Writing Skills)

## 한 줄 요약

새 Claude Code 스킬(SKILL.md)을 만들거나 기존 스킬을 수정할 때 **TDD 방식**(테스트 먼저)으로 설계하고 검증하는 방법을 알려 주는 메타 스킬이다. 스킬 자체를 "프로세스 문서"로 취급하고 품질을 강제한다.

## 언제 사용하나요?

- 자주 반복하는 작업(예: PR 리뷰 체크리스트, 마이그레이션 루틴)을 스킬로 추출하고 싶을 때
- 기존 스킬이 뜻대로 작동하지 않아 수정해야 할 때
- 팀에서 공통 워크플로우를 스킬로 문서화하고 싶을 때
- 본 프로젝트처럼 "Claude Code 스킬을 학습하는" 입장에서 직접 써 보는 경험이 필요할 때

## 핵심 개념

원본의 핵심 아이디어는 **"프로세스 문서에도 TDD를 적용할 수 있다"**는 것이다. 테스트 주도 개발의 Red → Green → Refactor를 스킬 작성에 매핑한다.

1. **Red (테스트 먼저)**: "이 스킬이 제대로 작동한다면 어떤 관찰 가능한 결과가 나와야 하는가?"를 먼저 적는다. 이것이 스킬의 수용 기준이다.
2. **Green (최소 구현)**: 수용 기준을 만족하는 **최소한의** SKILL.md를 작성한다. 장황하게 쓰지 않는다.
3. **Refactor (정제)**: 실제 Claude 세션에서 스킬을 돌려 보고, 수용 기준을 통과하는지 검증한다. 실패하면 스킬을 다듬는다.

스킬 유형은 세 가지로 분류된다.

- **기술형(Technique)**: 특정 기술/도구의 사용법을 정리. 예: "Next.js Server Actions 안전하게 쓰기"
- **패턴형(Pattern)**: 반복 등장하는 설계 패턴을 정리. 예: "브레인스토밍", "TDD"
- **참조형(Reference)**: 체크리스트나 조견표. 예: "Supabase RLS 안티 패턴 목록"

또 원본은 **CSO(Concise Self-descriptive Opening)** 원칙을 강조한다. SKILL.md의 `description` 필드는 첫 문장에서 "이 스킬이 뭘 해결하는지"를 밝혀야 하며, 이는 Claude가 스킬을 자동으로 "꺼내 올지" 결정하는 기준이 된다.

## 실전 예제 (대학생 관점)

**상황**: 본 프로젝트(`Claude-Code-Study`) 자체를 진행하면서 "매번 README를 업데이트하는 걸 까먹는다"는 문제가 반복된다. 이걸 **나만의 스킬**로 만들어 보자. 이름은 `update-readme-on-push`.

**1) Red — 수용 기준 작성**

```markdown
# update-readme-on-push 스킬의 수용 기준
1. 사용자가 "push 전에 README 확인해 줘"라고 말하면 활성화된다.
2. 현재 diff를 스캔해 다음 변경 범주를 감지한다:
   - 새 스크립트 추가 (package.json 변경)
   - 새 디렉토리/패키지 추가
   - CI 워크플로우 변경
   - 배포 URL 변경
3. 감지된 범주에 대응하는 README 섹션을 찾아 업데이트 필요 여부를 보고한다.
4. 사용자 승인 후에만 README를 수정한다. 자동 커밋은 하지 않는다.
```

**2) Green — 최소 SKILL.md 작성**

```markdown
---
name: update-readme-on-push
description: push 직전 diff를 스캔해 README 갱신이 필요한 섹션을 찾아 보고한다.
  새 스크립트/패키지/CI/배포 URL 변경을 감지한다. 자동 커밋은 하지 않는다.
preamble-tier: 2
---

# update-readme-on-push

## When to use
사용자가 "push 전 README 확인"이라 하거나, git commit 직후 "push"를 언급할 때.

## Process
1. `git diff --cached` + `git diff HEAD...origin/main`으로 변경 범위 확인
2. 다음 범주 매칭:
   - `package.json` scripts → README "명령어" 섹션
   - `packages/*/`나 `apps/*/` 신규 → README "디렉토리 구조" 섹션
   - `.github/workflows/*.yml` → README CI 배지
   - `apps/docs/.vitepress/config.ts`의 `base` 변경 → README 배포 URL
3. 매칭된 섹션을 `README.md`에서 찾아 "아래 변경이 반영돼야 할 수 있다"는 제안을 출력
4. 사용자 승인 시 Edit 도구로 README 수정

## What NOT to do
- README 자동 커밋 금지 (사용자 승인 없이)
- 변경이 없는 파일까지 스캔하지 말 것 (토큰 낭비)
```

**3) Refactor — 검증**

```bash
# 새 스킬을 ~/.claude/skills/update-readme-on-push/SKILL.md에 저장 후
# Claude Code 세션 재시작

# 테스트 1: 아무 변경이 없을 때 스킬이 "변경 없음"이라고 답하는가?
> push 전 README 확인해 줘
# 기대: "변경이 없어 업데이트 불필요"

# 테스트 2: package.json 스크립트를 추가한 뒤
> push 전 README 확인해 줘
# 기대: "명령어 섹션에 'pnpm <새 스크립트>' 추가 제안"
```

수용 기준 1~4번이 모두 통과하면 Green. 실패하는 기준이 있으면 SKILL.md를 수정하고 다시 돈다.

```ts
// 이 스킬 자체는 코드 파일이 아니라 마크다운이지만,
// 테스트 가능한 관찰 지점("어떤 입력 → 어떤 출력")을 미리 정의했다는 점에서
// 코드 TDD와 동일한 안전장치를 얻는다.
```

## 학습 포인트

- **"문서에 TDD?"라는 의문**: 스킬은 코드가 아니라 프롬프트 조각이지만, "이 스킬이 돌면 관찰 가능한 어떤 일이 일어나야 하는가"를 미리 적으면 품질이 급상승한다. 적어 두지 않으면 스킬이 점점 장황해지기만 한다.
- **CSO 규칙의 실용성**: SKILL.md의 `description`이 모호하면 Claude가 언제 이 스킬을 꺼낼지 모른다. 대학생이 자주 쓸 스킬(예: "Supabase RLS 체크")을 만든다면, description 첫 문장에 **"언제 / 왜 / 무엇"**을 다 넣자.
- **최소성의 원칙**: 좋은 스킬은 짧다. 원본의 Iron Law에 가까운 것 한 줄을 끝까지 지키는 편이, 20가지 규칙을 나열하는 것보다 훨씬 잘 작동한다.
- **Next.js 15 팁**: Next.js 프로젝트 특유의 반복 작업(Server Action 안전성 체크, RSC-클라이언트 경계 검증, 환경변수 네이밍 규칙)은 모두 스킬로 추출할 수 있는 훌륭한 후보다.
- **본 프로젝트와의 연결**: 본 `Claude-Code-Study` 프로젝트의 P2 단계에서는 `@claude-code-study/cli`로 "SKILL.md 파싱/검증/배포"를 자동화한다. writing-skills 스킬의 원칙을 자동으로 강제해 주는 도구가 될 수 있다.

## 원본과의 차이

- 원본의 TDD 매핑(Red/Green/Refactor)과 스킬 유형(Technique/Pattern/Reference), CSO 원칙은 그대로 유지했다.
- 원본은 일반적인 엔지니어링 팀 맥락을 전제한다. 본 해설은 **"본인을 위한 스킬"**을 직접 만드는 대학생 관점으로 예제를 재구성했다.
- 원본에는 SKILL.md의 frontmatter 필드 전체 목록(예: `allowed-tools`, `benefits-from`, `hooks`)과 각 필드의 세부 의미가 있을 수 있다. 본 해설에서는 대표 필드 몇 개만 예제로 실었다. 필드 전체 정의는 원본을 참고하자.
- 원본의 "스킬 배포 절차"(팀 공유 방법, 버전 관리)는 본 해설에서 범위 밖으로 뒀다.

> 원본: `~/.claude/skills/writing-skills/SKILL.md`
