---
title: "보안 감사 (CSO - Chief Security Officer)"
source: "~/.claude/skills/cso/SKILL.md"
source_url: "https://docs.anthropic.com/en/docs/claude-code/skills"
source_author: "Anthropic"
sourceHash: "sha256:placeholder"
lang: ko
generatedAt: "2026-04-12T10:00:00+09:00"
promptVersion: "ko-v1"
license: "해설 MIT, 원본 참조용"
last_reviewed: "2026-04-12"
tags: ["cso", "보안", "OWASP", "STRIDE", "취약점", "시크릿"]
category: "품질/안전"
---

# 보안 감사 (CSO - Chief Security Officer)

## 핵심 개념

CSO 스킬은 Claude를 "Chief Security Officer"로 역할 전환시켜 체계적인 보안 감사를 수행한다.

### 두 가지 실행 모드

**Daily 모드 (기본, confidence gate 8/10)**
- 노이즈 없는 고신뢰 발견사항만 리포트한다.
- 일상적인 PR 리뷰나 주간 점검에 적합하다.
- 80% 이상 확실한 취약점만 보고하므로 "오탐(false positive)"이 적다.

**Comprehensive 모드 (월간 심층 스캔, confidence gate 2/10)**
- 의심스러운 사항을 모두 나열한다(bar가 낮다).
- 분기 보안 감사, 실서비스 전환 전, 외부 투자자·고객 데모 전에 사용한다.
- 발견사항이 많으므로 우선순위를 직접 판단해야 한다.

### 언제 사용하나요?

- 코드베이스에 "보안 감사를 해 줘", "위협 모델 만들어 줘"라고 요청할 때
- 의존성 패키지 중 알려진 취약점(CVE)이 있는지 확인하고 싶을 때
- CI/CD 파이프라인 설정(GitHub Actions, Dockerfile 등)의 보안을 점검할 때
- OWASP Top 10 기준으로 웹 애플리케이션의 취약점을 체계적으로 리뷰할 때
- 팀 프로젝트를 외부에 공개하거나 실제 서비스로 전환하기 전 "pentest review"가 필요할 때
- AI/LLM을 사용하는 프로젝트에서 프롬프트 인젝션·신뢰 경계 취약점을 점검할 때

### 감사 도메인

| 도메인 | 설명 |
|--------|------|
| 시크릿 고고학 (Secrets Archaeology) | `.env` 파일, git 히스토리, 코드 내 하드코딩된 API 키·토큰·비밀번호 탐색 |
| 의존성 공급망 | `package.json`, `lock` 파일의 알려진 CVE, 악성 패키지, 오래된 패키지 |
| CI/CD 파이프라인 보안 | GitHub Actions 워크플로우의 권한 범위, 시크릿 주입 방식, self-hosted runner 위험 |
| LLM/AI 보안 | 프롬프트 인젝션, 모델 신뢰 경계, AI 출력의 직접 실행 위험 |
| 스킬 공급망 스캔 | `~/.claude/skills/` 내 외부 스킬의 검증 여부 |
| OWASP Top 10 | XSS, SQL 인젝션, 인증 결함, IDOR 등 웹 앱 10대 취약점 |
| STRIDE 위협 모델링 | Spoofing·Tampering·Repudiation·Info Disclosure·DoS·Elevation 6가지 위협 분류 |

### 트렌드 추적

감사 결과를 누적해 이전 실행과 비교한다. "지난 달보다 CVE 2개 해소, XSS 위험 신규 발견" 같은 진척도를 볼 수 있다.

## 한 줄 요약

인프라 우선 보안 감사를 수행하는 **가상의 CISO 역할 스킬**로, 시크릿 노출·의존성 공급망·CI/CD 파이프라인·OWASP Top 10·STRIDE 위협 모델링까지 두 가지 모드(일상/종합)로 프로젝트를 점검한다.

## 프로젝트에 도입하기

```bash
/cso
```

**SKILL.md 파일 위치**: `~/.claude/skills/cso/SKILL.md`

커스터마이징이 필요하면 SKILL.md 내용을 복사 후 수정한다.

## 실전 예제 (대학생 관점)

**상황**: 동아리 공지 게시판 프로젝트(Next.js 15 + TypeScript + Supabase)를 실제 서비스로 전환하기 전 보안 점검을 받고 싶다. GitHub Actions로 Vercel 자동 배포를 설정했고, 환경 변수로 Supabase URL과 Anon Key를 관리 중이다.

### 1단계: Daily 보안 감사 실행

```
> CSO 스킬로 이 프로젝트 보안 감사 해 줘.
```

Claude가 수행하는 작업(일부 의사 코드):

```ts
// 1. 시크릿 고고학 — .env 파일 및 git 로그 스캔
// 위험: NEXT_PUBLIC_* 접두사 환경변수는 브라우저에 노출됨
// 발견: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY 가 노출되어 있으면 치명적

// 2. 의존성 CVE 스캔
// package.json → npm audit / pnpm audit 결과 해석
// 예: next@14.1.0 에 known CVE가 있으면 즉시 업그레이드 권고

// 3. CI/CD 점검
// .github/workflows/deploy.yml 의 permissions 범위 확인
// GITHUB_TOKEN 에 write 권한이 불필요하게 부여되어 있는지 확인

// 4. OWASP A01 - Broken Access Control
// notices API Route에서 로그인 없이 POST 가능한지 확인
// app/api/notices/route.ts 의 인증 미들웨어 존재 여부
```

### 2단계: 발견된 취약점 코드 수정 예시

CSO 스킬이 다음과 같은 취약점을 발견한다고 가정한다.

```ts
// app/api/notices/route.ts — 취약한 버전 (인증 없음)
export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("notices")
    .insert(body); // 누구나 공지를 작성할 수 있는 취약점!
  return Response.json({ data, error });
}
```

CSO 권고 후 수정한 버전:

```ts
// app/api/notices/route.ts — 수정된 버전
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // 인증 확인 (OWASP A01 대응)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 임원 권한 확인 (IDOR 방지)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "officer") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("notices")
    .insert({ ...body, author_id: user.id }); // author_id 서버에서 주입

  return Response.json({ data, error });
}
```

### 3단계: GitHub Actions 보안 강화

```yaml
# .github/workflows/deploy.yml — 수정 전 (과도한 권한)
permissions:
  contents: write
  deployments: write
  pull-requests: write  # 불필요

# CSO 권고 후 — 최소 권한 원칙 적용
permissions:
  contents: read
  deployments: write
```

### 4단계: STRIDE 위협 모델 예시

CSO 스킬이 생성하는 위협 모델 표의 일부:

| 위협 | 시나리오 | 대응 |
|------|---------|------|
| Spoofing | 다른 사람 이름으로 공지 작성 | JWT 기반 서버 인증, `author_id` 서버에서 삽입 |
| Tampering | 공지 내용 무단 수정 | RLS(Row Level Security) 정책 적용 |
| Info Disclosure | 미공개 공지 열람 | `is_published` 필드 + RLS 필터 |
| Elevation | 일반 회원이 관리자 기능 접근 | RBAC `profiles.role` 체크 |

## 학습 포인트 / 흔한 함정

- **보안은 "나중에"가 아니라 "지금"이다**: 대학생 프로젝트에서 보안을 마지막에 생각하는 경우가 많다. CSO 스킬을 PR 리뷰 단계에서 습관적으로 실행하면 취약점이 main 브랜치에 들어가는 것을 방지할 수 있다.
- **`NEXT_PUBLIC_` 접두사의 위험**: Next.js의 `NEXT_PUBLIC_` 변수는 브라우저 번들에 포함된다. `SERVICE_ROLE_KEY` 같은 민감한 변수에 절대 붙여서는 안 된다. CSO 스킬이 이 패턴을 즉시 탐지한다.
- **`pnpm audit`을 CI에 포함시키자**: `package.json` 의존성 CVE는 코드 변경 없이도 매일 새로 발견된다. GitHub Actions에 `pnpm audit --audit-level=high` 스텝을 추가하면 자동으로 잡힌다.
- **흔한 함정 — git 히스토리에 남은 시크릿**: `.env` 파일을 이미 커밋한 뒤 `.gitignore`에 추가해도 git 히스토리에는 남는다. CSO 스킬이 이를 탐지하면 `git filter-repo`로 히스토리 전체를 정리해야 한다.
- **STRIDE는 "내 코드 뒤집어 보기"다**: STRIDE 위협 모델링은 "공격자의 시선으로 내 시스템을 보는" 훈련이다. 보안 전문가가 아니어도 CSO 스킬이 6가지 위협 카테고리로 안내해 주므로 처음 접하는 사람도 체계적으로 생각할 수 있다.

## 관련 리소스

- [careful](./careful.md) — 파괴적 명령어 실행 전 안전 확인
- [guard](./guard.md) — 최대 안전 모드 (Careful + Freeze)
- [verification-before-completion](./verification-before-completion.md) — 완료 전 최종 검증

---

| 항목 | 내용 |
|---|---|
| 원본 URL | https://docs.anthropic.com/en/docs/claude-code/skills |
| 작성자/출처 | Anthropic |
| 라이선스 | 해설 MIT, 원본 참조용 |
| 해설 작성일 | 2026-04-12 |
