# 아트프렌즈 아트버스 캘린더

아트프렌즈 스탭(14명)이 아트버스 운행 일정을 관리하는 모바일 퍼스트 캘린더 앱.

## 기능

- 월간 캘린더 뷰 — 날짜별 목적지 및 참여 스탭 표시
- 날짜 탭 → 바텀시트로 상세 일정 확인
- 일정 추가 / 수정 / 삭제 (CRUD)
- 목적지별 고유 색상 구분
- 모바일 퍼스트 디자인 (375px ~ 430px)

## 기술 스택

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL)
- **배포**: Vercel

## 로컬 실행

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에 Supabase 프로젝트 정보를 입력합니다.

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase DB 설정

Supabase Dashboard → SQL Editor에서 순서대로 실행합니다.

```
supabase/migrations/001_init.sql  # 테이블 생성
supabase/seed.sql                 # 초기 데이터 삽입
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## 목적지 색상

| 목적지 | 색상 |
|--------|------|
| 사유원 | `#2D5016` 깊은 녹색 |
| 뮤지엄산 | `#8B4513` 갈색 |
| 강릉 | `#1E6091` 바다 파랑 |
| 대구 | `#B91C1C` 붉은색 |
| 당진 | `#D97706` 황토 |
| 완주 | `#7C3AED` 보라 |
| 영주 | `#0F766E` 청록 |
| 솔올 | `#E8590C` 주황 |

## 스탭 (14명)

까비, 미술관가는날, 파랑새홍, 무아, 에이미, 세계여행, 그린이, 써니, 제씨킴, 티아라, 건빵, 연지빛, 토이와, 바람은

## 프로젝트 구조

```
app/
├── api/
│   ├── schedules/        # GET, POST
│   ├── schedules/[id]/   # PATCH, DELETE
│   ├── staffs/           # GET
│   └── destinations/     # GET
├── layout.tsx
└── page.tsx
components/
├── Calendar.tsx
├── CalendarCell.tsx
├── BottomSheet.tsx
├── ScheduleForm.tsx
├── DestinationBadge.tsx
└── MonthNav.tsx
lib/
├── supabase.ts
├── types.ts
└── constants.ts
supabase/
├── migrations/001_init.sql
└── seed.sql
```
