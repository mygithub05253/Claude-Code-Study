---
title: "저작권 표기 표준 템플릿"
category: internal
license: "MIT"
last_reviewed: "2026-04-09"
tags: ["template", "internal"]
---

# 저작권·메타데이터 표준 템플릿

> 이 파일은 **빌드에 포함되지 않는 내부 참조용** 입니다. 새 해설 페이지를 만들 때 이 구조를 복사해 사용하세요.

## Frontmatter 표준

```yaml
---
title: "해설 제목"
category: skills | mcp | hooks | agents | repos | use-cases | my-collection | prompts
source_url: "https://원본-URL"
source_author: "원본 작성자/조직명"
license: "MIT | Apache-2.0 | GPL-3.0 | 기타"
last_reviewed: "YYYY-MM-DD"
tags: ["태그1", "태그2"]
---
```

## 본문 6섹션 템플릿

```markdown
# [해설 제목]

## 1. 한 줄 요약
이 리소스가 무엇을 하는지 한 문장으로.

## 2. 왜 대학생에게 유용한가
구체적 시나리오. "동아리 공지 게시판" 맥락을 기본으로.

## 3. 핵심 개념 / 작동 원리
개념 설명 + 다이어그램(선택).

## 4. 실전 예제
복사-붙여넣기 가능한 코드/프롬프트.

## 5. 학습 포인트 / 흔한 함정
처음 쓸 때 놓치기 쉬운 점.

## 6. 원본 링크 & 저작권
(하단 표준 테이블 참조)
```

## 본문 하단 저작권 테이블 (필수)

```markdown
---

| 항목 | 내용 |
|---|---|
| 원본 URL | [링크](원본 주소) |
| 원본 작성자 | 작성자/조직명 |
| 라이선스 | MIT / Apache-2.0 / 등 |
| 해설 작성일 | YYYY-MM-DD |
| 해설 작성자 | Claude-Code-Study 프로젝트 |

> ⚠️ 이 해설은 원본을 한국어로 재해석한 학습 자료입니다. 원본 저작권은 각 소유자에게 있으며, 정확한 정보는 원본을 참고하세요.
```
