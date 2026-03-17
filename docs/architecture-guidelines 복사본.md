# Architecture Guidelines

Next.js 14 App Router 기반 프로젝트로, 다섯 개의 레이어로 구성된다.
경로 별칭은 `@/*` → `./*` (프로젝트 루트)를 사용한다.

## Layer Rules

- `app/`: 라우팅, 페이지 엔트리, 레이아웃, 프로바이더. 페이지별 클라이언트 컴포넌트를 포함할 수 있다.
- `components/`: 재사용 가능한 UI 컴포넌트. `components/ui/`는 shadcn/ui 기반 원시 컴포넌트이다.
- `hooks/`: 데이터 패칭 및 상태 관리를 위한 커스텀 훅.
- `lib/`: 외부 서비스 클라이언트(Supabase), 유틸리티 함수, React Query 설정.
- `types/`: 공유 TypeScript 타입 정의.

## Allowed Imports

- `app/` → `components/`, `hooks/`, `lib/`, `types/`
- `components/` → `components/ui/`, `lib/`, `types/`
- `hooks/` → `lib/`, `types/`
- `lib/` → `types/`
- `types/` → 외부 의존성만 허용

## Disallowed Imports

- `components/` → `app/`, `hooks/`
- `hooks/` → `app/`, `components/`
- `lib/` → `app/`, `components/`, `hooks/`
- `types/` → `app/`, `components/`, `hooks/`, `lib/`

## Import Pattern Examples

Allowed:

```ts
// app/Transcribe/page.tsx
import TranscribeClient from "@/app/Transcribe/TranscribeClient";
import { useScriptureProgress } from "@/hooks/useScriptureProgress";
```

```ts
// components/teamChart.tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
```

```ts
// hooks/useScriptureDetail.ts
import { supabase } from "@/lib/supabaseClient";
import type { ScriptureProgress } from "@/types/scripture_progress";
```

Disallowed:

```ts
// components/ui/card.tsx
import { useScriptureProgress } from "@/hooks/useScriptureProgress";
```

```ts
// lib/utils.ts
import { Navigation } from "@/components/navigation";
```

## Directory Details

### `app/`

```
app/
├── layout.tsx              # 루트 레이아웃 (폰트, Providers)
├── page.tsx                # / → /Transcribe 리다이렉트
├── globals.css             # Tailwind + CSS 변수 (라이트/다크)
├── providers.tsx           # QueryClientProvider
├── components/header.tsx   # 앱 공통 헤더
├── public/                 # JSON 데이터 (data.json, genealogy.json)
├── Transcribe/             # 성경필사순
│   ├── page.tsx
│   ├── TranscribeClient.tsx
│   └── [id]/page.tsx
├── Award/page.tsx          # 갓같가 시상식
└── Geneology/page.tsx      # 족보 시각화 (Sigma.js)
```

### `components/`

```
components/
├── ui/                     # shadcn/ui 원시 컴포넌트 (수정 지양)
│   ├── button.tsx, card.tsx, chart.tsx, dialog.tsx, ...
├── navigation.tsx          # 탭 네비게이션
├── tabSelect.tsx           # MotionTabs
├── transcribeCard.tsx      # 필사 카드
├── progressBar.tsx         # 진행률 바
├── geneologySheet.tsx      # 족보 시트
├── teamChart.tsx           # 팀별 차트 (Recharts)
├── toprating.tsx           # Top 10 랭킹
├── total.tsx               # 총 채운시간
├── day.tsx                 # DDay 이벤트 링크
└── customTooltip.tsx       # 차트 툴팁
```

### `hooks/`

| 훅 | 역할 |
|---|---|
| `useScriptureProgress` | 필사 진행률 전체 조회 |
| `useScriptureDetail` | 필사 상세 (progress + group + members) |
| `useScriptureGroupMembers` | 순별 멤버 조회 |

### `lib/`

| 파일 | 역할 |
|---|---|
| `utils.ts` | `cn()` (clsx + tailwind-merge) |
| `supabaseClient.ts` | Supabase 클라이언트 인스턴스 |
| `queryClient.ts` | React Query 기본 설정 |

### `types/`

도메인 모델 타입 정의: `scripture.ts`, `scripture_progress.ts`, `scripture_groups.ts`, `reading_progress.ts`, `reading_groups.ts`, `membership_groups.ts`, `affiliation_groups.ts`, `user.ts`, `users.ts`

## Tech Stack

| 항목 | 기술 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS + shadcn/ui (Radix UI) |
| 데이터 | Supabase (서버), JSON 파일 (정적) |
| 상태관리 | TanStack React Query |
| 시각화 | Recharts, Sigma.js + Graphology |
| 애니메이션 | Framer Motion, Lottie |
