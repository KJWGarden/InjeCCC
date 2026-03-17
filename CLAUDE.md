# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

인제대학교 CCC (Campus Crusade for Christ) 홈페이지. 성경필사순 진행상황 추적, 시상식, 족보(멘토-멘티 관계) 시각화 기능을 제공하는 웹 애플리케이션.

Deployed at: https://inje-ccc.vercel.app

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
npm run start    # 프로덕션 서버
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui (new-york style, stone base color, Radix UI primitives)
- **Data**: Supabase (동적 데이터) + JSON 파일 (정적 데이터, `app/public/`)
- **State**: TanStack React Query (staleTime 5분, gcTime 10분)
- **Visualization**: Sigma.js + Graphology (족보 그래프), Recharts (차트)
- **Animation**: Framer Motion, Lottie (`@lottiefiles/dotlottie-react`)

## Architecture

5개 레이어 구조. 경로 별칭: `@/*` → 프로젝트 루트.

### Layer Import Rules

```
app/        → components/, hooks/, lib/, types/
components/ → components/ui/, lib/, types/
hooks/      → lib/, types/
lib/        → types/
types/      → 외부 의존성만
```

**역방향 import 금지**: components는 hooks를 import할 수 없고, lib는 components/hooks를 import할 수 없음.

### Key Directories

- `app/` — 라우팅 및 페이지. 페이지별 Client 컴포넌트 패턴 사용 (서버 컴포넌트 page.tsx + "use client" Client.tsx)
- `components/` — 재사용 UI. `components/ui/`는 shadcn/ui 원시 컴포넌트 (직접 수정 지양, `npx shadcn-ui` 사용)
- `hooks/` — Supabase 데이터 패칭 훅 (React Query 기반)
- `lib/` — Supabase 클라이언트, React Query 설정, `cn()` 유틸리티
- `types/` — Supabase 테이블에 대응하는 TypeScript 타입 정의

### Routes

| 경로 | 설명 |
|---|---|
| `/` | → `/Transcribe` 리다이렉트 |
| `/Transcribe` | 성경필사순 목록 (Supabase 데이터) |
| `/Transcribe/[id]` | 필사순 상세 (진행률 + 팀원) |
| `/Award` | 시상식 (JSON 정적 데이터) |
| `/Geneology` | 족보 그래프 시각화 (Sigma.js) |

### Data Flow

- **Supabase 동적 데이터**: `lib/supabaseClient.ts` → `hooks/use*.ts` (React Query) → 페이지 컴포넌트
  - 주요 테이블: `scripture_progress`, `scripture_groups`, `users`
  - 족보 테이블: `genealogy_members`, `genealogy_edges` (마이그레이션: `supabase/migrations/`)
- **JSON 정적 데이터**: `app/public/data.json` (Award), `app/public/genealogy.json` (Geneology)

### Environment Variables

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — `.env.local`에 설정
