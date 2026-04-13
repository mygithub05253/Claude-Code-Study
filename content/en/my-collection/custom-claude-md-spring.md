---
title: "CLAUDE.md Template for Spring Boot 3 Projects"
category: "my-collection"
tags: ["CLAUDE.md", "Spring Boot", "Java", "customization"]
source_url: "https://github.com/mygithub05253/Claude-Code-Study"
source_author: "Claude-Code-Study Community"
license: "MIT"
last_reviewed: "2026-04-13"
lang: en
---

# CLAUDE.md Template for Spring Boot 3 Projects

## Core Concepts / How It Works

```mermaid
flowchart TD
  A[CLAUDE.md] --> B[Layered Architecture Rules]
  B --> C[Controller Layer]
  B --> D[Service Layer]
  B --> E[Repository Layer]
  C --> F[DTO Conversion Required]
  D --> G[@Transactional Management]
  E --> H[JPA Usage]
  F --> I[Request/Response DTO Separation]
  G --> J[Business Logic Focus]
```

A CLAUDE.md template optimized for Spring Boot 3.x backend projects. By explicitly defining Layered Architecture patterns and JPA usage rules, Claude Code generates code in a consistent pattern.

## One-Line Summary

A CLAUDE.md template that guides Claude Code to automatically follow @Transactional service layers, DTO patterns, and constructor injection in Spring Boot 3 + JPA + Layered Architecture projects.

## Getting Started

```bash
# Run from the Spring Boot project root
touch CLAUDE.md
```

```markdown
# [Project Name] CLAUDE.md

## Language & Code Style
- Comments, commit messages: your preferred language
- Java 17+, Spring Boot 3.x
- 4-space indentation (Java standard)
- Variables/methods: camelCase, classes: PascalCase, constants: UPPER_SNAKE_CASE

## Architecture Rules
- **Layered Architecture**: Controller → Service → Repository
- **Controller**: handles HTTP requests, responsible only for DTO conversion
- **Service**: concentrates business logic, manages @Transactional
- **Repository**: uses JPA Repository interfaces

## Dependency Injection
- **Constructor injection required** (no @Autowired field injection)
- Use Lombok @RequiredArgsConstructor

## DTO Pattern
- Request/Response DTOs must be separated
- No direct Entity return
- Actively use record types (Java 16+)

## Exception Handling
- @ControllerAdvice for global exception handling
- Maintain custom exception class hierarchy
- Return appropriate HTTP status codes

## Commit Conventions
- feat: new feature
- fix: bug fix
- refactor: refactoring

## Prohibited
- @Autowired field injection
- Returning Entity directly (DTO conversion required)
- Write operations in Service layer without @Transactional
```

## Practical Example

Applying to the Student Club Notice Board backend (Spring Boot + PostgreSQL):

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
@Transactional(readOnly = true)  // Default read-only
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public List<NoticeResponse> findAll() {
        return noticeRepository.findAll().stream()
                .map(NoticeResponse::from)
                .toList();
    }

    @Transactional  // Separate declaration for write operations
    public NoticeResponse create(CreateNoticeRequest request) {
        Notice notice = Notice.of(request.title(), request.content());
        return NoticeResponse.from(noticeRepository.save(notice));
    }
}
```

## Learning Points / Common Pitfalls

**@Transactional pitfall**:
```java
// ❌ Write attempt with readOnly=true → exception thrown
@Transactional(readOnly = true)
public Notice create(Notice notice) {
    return noticeRepository.save(notice); // Error!
}

// ✅ Write methods require a separate @Transactional declaration
@Transactional
public Notice create(Notice notice) {
    return noticeRepository.save(notice);
}
```

**Common pitfalls**:
- N+1 problem: use JPA Fetch Join or @EntityGraph
- Circular reference in bidirectional associations → resolve with DTO conversion
- @Transactional self-invocation → separate into a distinct bean

## Related Resources

- [Next.js 15 Project CLAUDE.md](/en/my-collection/custom-claude-md-nextjs.md)
- [Fullstack MCP Settings Combination](/en/my-collection/mcp-settings-fullstack.md)
- [Integrated Setup Prompt](/en/prompts/integrated-setup.md)

## Source & Attribution

| Field | Value |
|-------|-------|
| Source URL | https://github.com/mygithub05253/Claude-Code-Study |
| Author | Claude-Code-Study Community |
| License | MIT |
| Translation Date | 2026-04-13 |
| Category | my-collection / custom resources |
