---
title: "슈퍼파워 사용법 (Using Superpowers)"
source: "~/.claude/skills/using-superpowers/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:4dc43d08e757761109d460afe20f183a5a9be9466162eaadbd8e8f1124ef903f"
lang: ko
generatedAt: "2026-04-09T14:30:00+09:00"
promptVersion: "ko-v1"
tags: ["메타스킬", "스킬선택", "우선순위", "RedFlags", "스킬카탈로그"]
category: "메타"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
---

# 슈퍼파워 사용법 (Using Superpowers)

## 핵심 개념

원본은 다음 개념들을 제시한다.

1. **1% 규칙**: "혹시 필요할지도 모른다"는 약간의 의심만 있어도 해당 스킬을 열어 본다. 스킬 카탈로그는 Claude의 "작업 매뉴얼"이므로, 의심이 생겼을 때 바로 참고해야 한다.
2. **지시 우선순위(Instruction Priority)**: 서로 다른 출처의 지시가 충돌할 때 다음 순서를 따른다.
   - 사용자의 현재 메시지
   - 프로젝트별 `CLAUDE.md`
   - 전역 `~/.claude/CLAUDE.md`
   - 스킬 본문
   - 일반적인 모범 사례
3. **스킬 접근 방식(How to Access Skills)**: Claude Code 환경에서는 스킬이 자동으로 "도구처럼" 주입된다. Claude는 필요하다고 판단한 순간 `Skill` 도구로 해당 스킬을 호출한다.
4. **적색 신호(Red Flags)**: 특정 단어/상황이 나타나면 반드시 특정 스킬을 켜야 한다.

   | 신호 | 반응할 스킬 |
   |------|-------------|
   | "디버그", "버그", "왜 안 되지" | `investigate` / `systematic-debugging` |
   | "새 기능", "만들어 줘", "추가해 줘" | `brainstorming` |
   | "계획", "단계", "TODO 리스트" | `writing-plans` |
   | "리뷰", "PR 점검" | `review` |
   | "배포", "ship", "PR 올려" | `ship` |

5. **스킬 유형(Skill Types)**:
   - **엄격형(Rigid)**: 단계와 체크리스트가 고정된 스킬. 예: `test-driven-development`, `brainstorming`.
   - **유연형(Flexible)**: 원칙과 가이드라인 중심의 스킬. 예: `writing-skills`, `using-superpowers` 자신.

## 한 줄 요약

Claude Code가 제공하는 다른 스킬들을 **언제, 어떻게 불러 써야 하는지**를 알려 주는 메타 스킬이다. "스킬을 쓰라"는 지시, 스킬 간 우선순위, 적색 신호(Red Flags), 어떤 상황에서 어떤 스킬을 써야 하는지 등을 규정한다.

## 프로젝트에 도입하기

```bash
/using-superpowers
```

**SKILL.md 파일 위치**: `~/.claude/skills/using-superpowers/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 아침에 동아리 게시판 과제를 이어서 하려고 Claude Code를 열었다. 사용자가 말한다:

> "어제 하던 공지 게시판 작업 이어서 할래. Supabase 마이그레이션이 자꾸 실패하네."

이 한 문장 안에 **여러 스킬 신호**가 섞여 있다. `using-superpowers` 스킬은 다음과 같이 추론한다.

1. "어제 하던 ... 이어서" → **executing-plans** 스킬 후보. 계획서가 있었다면 그걸 불러서 이어 가는 게 맞다.
2. "마이그레이션이 자꾸 실패하네" → **investigate** 또는 **systematic-debugging** 스킬 후보. 버그/장애 신호다.
3. "Supabase" + "실패" → 단순 설정 오류일 수도, 권한 문제일 수도, 네트워크 문제일 수도 있다. 증상만으로는 모른다.

결론: Claude는 먼저 **investigate** 스킬로 원인을 확정한 뒤, 해결이 끝나면 **executing-plans**로 돌아가 나머지 태스크를 이어 간다. 두 스킬이 동시에 필요하지만 순서가 중요하다.

```bash
# Claude 내부 사고 (의사 코드)
if (userMessage.includes("실패") || userMessage.includes("에러")) {
  activateSkill("investigate");
}
if (userMessage.includes("이어서") && existsPlan("docs/plans/")) {
  queueSkill("executing-plans");
}
```

**또 다른 상황**: 사용자가 "이제 로그인 UI 좀 예쁘게 해 줘"라고 말한다. 이건 얼핏 "단순 스타일링"처럼 보이지만, `using-superpowers`는 적색 신호를 감지한다.

- "이제 ... UI 좀 예쁘게" → 명확한 요구사항이 없다 (구체적으로 뭘? 색? 레이아웃? 모바일?).
- → **brainstorming** 스킬을 먼저 돌려서 의도를 합의한다. 그 전에는 코드를 바꾸지 않는다.

```ts
// brainstorming 없이 바로 시작하면 이런 코드가 나오기 쉽다
// 의도 없는 스타일 변경
<button className="bg-blue-500 hover:bg-blue-700 rounded-lg shadow-lg">
  로그인
</button>

// brainstorming으로 "대학생 동아리 톤" + "접근성 AA" 결정 후
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-400">
  로그인
</button>
```

## 학습 포인트 / 흔한 함정

- **메타 스킬이 있다는 것 자체가 중요하다**: Claude Code에는 50+개의 스킬이 있다. 모든 스킬을 매번 기억하긴 어렵다. `using-superpowers`는 이 카탈로그를 "언제 무엇을 꺼낼지"의 지도로 기능한다.
- **1% 규칙의 실전 효과**: 대학생 과제에서 "혹시 이거 systematic-debugging 쓸 상황인가?" 하고 드는 0.5초의 의심이 나중에 30분을 아낀다.
- **지시 우선순위**: 사용자가 "한국어로 답해 줘"라고 말했는데 전역 CLAUDE.md에 "영어로 작성"이 있다면, 사용자 메시지가 우선이다. 이 우선순위를 아는 것만으로도 충돌 상황에서 판단이 편해진다.
- **스킬을 "쓰라고" 직접 말할 수도 있다**: Claude가 자동으로 스킬을 꺼내지 않을 때, 사용자가 "brainstorming 스킬로 먼저 의도 합의부터 해 줘"처럼 직접 지정할 수 있다. 이 권한은 사용자에게 있다.
- **Next.js 15 팁**: 프론트엔드 작업("컴포넌트 만들어 줘", "폼 추가해 줘")은 거의 항상 brainstorming → writing-plans → executing-plans 체인이 어울린다. 이 패턴을 기억하자.

## 관련 리소스

- [writing-skills](./writing-skills.md) — 나만의 스킬 만들기
- [learn](./learn.md) — 세션 간 학습 내용 관리
- [retro](./retro.md) — 스킬 활용 패턴 회고

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
