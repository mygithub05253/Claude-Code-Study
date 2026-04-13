---
title: "Spring Boot 3 프로젝트용 CLAUDE.md 템플릿"
category: "my-collection"
tags: ["CLAUDE.md", "Spring Boot", "Java", "커스터마이징"]
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study 커뮤니티"
license: "MIT"
last_reviewed: "2026-04-13"
lang: ko
---

# Spring Boot 3 프로젝트용 CLAUDE.md 템플릿

## 1. 핵심 개념 / 작동 원리

```mermaid
flowchart TD
  A[CLAUDE.md] --> B[레이어드 아키텍처 규칙]
  B --> C[Controller 레이어]
  B --> D[Service 레이어]
  B --> E[Repository 레이어]
  C --> F[DTO 변환 필수]
  D --> G[@Transactional 관리]
  E --> H[JPA 사용]
  F --> I[요청/응답 DTO 분리]
  G --> J[비즈니스 로직 집중]
```

Spring Boot 3.x 기반 백엔드 프로젝트에 최적화된 CLAUDE.md 템플릿입니다. Layered Architecture 패턴과 JPA 사용 규칙을 명시하여 Claude Code가 일관된 패턴으로 코드를 생성합니다.

## 2. 한 줄 요약

Spring Boot 3 + JPA + Layered Architecture 프로젝트에서 Claude Code가 @Transactional 서비스 계층, DTO 패턴, 생성자 주입을 자동으로 따르도록 안내하는 CLAUDE.md 템플릿입니다.

## 3. 프로젝트에 도입하기

```bash
# Spring Boot 프로젝트 루트에서 실행
touch CLAUDE.md
```

```markdown
# [프로젝트명] CLAUDE.md

## 언어 및 코드 스타일
- 주석, 커밋 메시지: **한국어**
- Java 17+, Spring Boot 3.x
- 들여쓰기 4 spaces (Java 표준)
- 변수/메서드: camelCase, 클래스: PascalCase, 상수: UPPER_SNAKE_CASE

## 아키텍처 규칙
- **Layered Architecture**: Controller → Service → Repository
- **Controller**: HTTP 요청 처리, DTO 변환만 담당
- **Service**: 비즈니스 로직 집중, @Transactional 관리
- **Repository**: JPA Repository 인터페이스 사용

## 의존성 주입
- **생성자 주입 필수** (@Autowired 필드 주입 금지)
- Lombok @RequiredArgsConstructor 활용

## DTO 패턴
- 요청/응답 DTO 필수 분리
- 엔티티 직접 반환 금지
- record 타입 적극 활용 (Java 16+)

## 예외 처리
- @ControllerAdvice로 전역 예외 처리
- 커스텀 예외 클래스 계층 구조 유지
- 적절한 HTTP 상태 코드 반환

## 커밋 컨벤션
- feat: 새 기능
- fix: 버그 수정
- refactor: 리팩토링

## 금지 사항
- @Autowired 필드 주입
- 엔티티 직접 반환 (DTO 변환 필수)
- @Transactional 없는 Service 레이어 쓰기 작업
```

## 4. 실전 예제

동아리 공지 게시판 백엔드(Spring Boot + PostgreSQL) 적용 예시:

```java
// NoticeController.java
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<List<NoticeResponse>> getNotices() {
        return ResponseEntity.ok(noticeService.findAll());
    }

    @PostMapping
    public ResponseEntity<NoticeResponse> createNotice(
            @Valid @RequestBody CreateNoticeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noticeService.create(request));
    }
}

// NoticeService.java
@Service
@Transactional(readOnly = true)  // 기본 읽기 전용
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public List<NoticeResponse> findAll() {
        return noticeRepository.findAll().stream()
                .map(NoticeResponse::from)
                .toList();
    }

    @Transactional  // 쓰기 작업은 별도 선언
    public NoticeResponse create(CreateNoticeRequest request) {
        Notice notice = Notice.of(request.title(), request.content());
        return NoticeResponse.from(noticeRepository.save(notice));
    }
}
```

## 5. 학습 포인트 / 흔한 함정

**@Transactional 함정**:
```java
// ❌ readOnly=true에서 쓰기 시도 → 예외 발생
@Transactional(readOnly = true)
public Notice create(Notice notice) {
    return noticeRepository.save(notice); // 오류!
}

// ✅ 쓰기 메서드는 @Transactional 별도 선언
@Transactional
public Notice create(Notice notice) {
    return noticeRepository.save(notice);
}
```

**흔한 함정**:
- N+1 문제: JPA Fetch Join 또는 @EntityGraph 사용
- 양방향 연관관계 순환 참조 → DTO 변환으로 해결
- @Transactional self-invocation → 별도 빈으로 분리

## 6. 관련 리소스

- [Next.js 15 프로젝트용 CLAUDE.md](./custom-claude-md-nextjs.md)
- [MCP 풀스택 설정 조합](./mcp-settings-fullstack.md)
- [통합 셋업 프롬프트](../prompts/integrated-setup.md)

## 7. 원본 링크 & 저작권

| 항목 | 내용 |
|------|------|
| 원본 URL | https://github.com/mygithub05253/Claude-Code-Study |
| 작성자 | Claude-Code-Study 커뮤니티 |
| 라이선스 | MIT |
| 해설 작성일 | 2026-04-13 |
| 카테고리 | my-collection / 커스텀 리소스 |
