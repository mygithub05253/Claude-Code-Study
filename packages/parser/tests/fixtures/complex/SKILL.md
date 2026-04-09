---
name: complex
preamble-tier: 3
version: 1.0.0
description: |
  복잡한 frontmatter를 가진 테스트용 스킬.
  여러 줄 설명과 allowed-tools를 포함한다.
allowed-tools:
  - Bash
  - Read
  - Write
benefits-from: "brainstorming"
---

# Complex Skill

리드 문단이 여기 있다. 해설 생성 시 사용된다.

## Section One

섹션 1 본문.

```bash
echo "코드 블록 안의 # 헤더는 무시되어야 한다"
# 이건 헤더가 아니다
```

## Section Two

섹션 2 본문.

### Subsection

하위 섹션.
