# 아트프렌즈 아트버스 스케줄 캘린더 — Spec Document

## 1. 프로젝트 개요

아트프렌즈 스탭(14명)이 아트버스 운행 일정을 관리하는 **모바일 퍼스트 캘린더 앱**.  
스탭별 가능 날짜와 목적지를 캘린더에 표시하고, 일정을 추가/수정/삭제할 수 있다.

---

## 2. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| Frontend | Next.js 14+ (App Router) | TypeScript, Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) | Row Level Security 적용 |
| 인증 | Supabase Auth | 추후 스탭 로그인 연동 (v2) |
| 배포 | Vercel | Supabase 연동 |

---

## 3. 데이터 모델

### 3.1 `staffs` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| nickname | text (UNIQUE, NOT NULL) | 스탭 닉네임 |
| created_at | timestamptz | 생성일 |

**초기 데이터 (14명):**  
까비, 미술관가는날, 파랑새홍, 무아, 에이미, 세계여행, 그린이, 써니, 제씨킴, 티아라, 건빵, 연지빛, 토이와, 바람은

### 3.2 `destinations` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| name | text (UNIQUE, NOT NULL) | 목적지명 |
| color | text | 캘린더 표시 색상 (hex) |
| created_at | timestamptz | 생성일 |

**초기 데이터 (7곳):**  
사유원, 뮤지엄산, 강릉, 대구, 당진, 완주, 영주

### 3.3 `schedules` 테이블 (핵심)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| date | date (NOT NULL) | 운행 날짜 |
| destination_id | uuid (FK → destinations.id) | 목적지 (NULL 허용 = 미정) |
| staff_id | uuid (FK → staffs.id, NOT NULL) | 참여 스탭 |
| status | text | `available` / `confirmed` / `cancelled` |
| note | text | 메모 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

**복합 유니크 제약:** `(date, destination_id, staff_id)` — 같은 날 같은 목적지에 같은 스탭 중복 방지

---

## 4. Mock 데이터

| 날짜 | 목적지 | 참여 스탭 | status |
|------|--------|-----------|--------|
| 2026-04-07 | (미정) | 까비, 그린이, 세계여행, 써니 | available |
| 2026-04-08 | (미정) | 무아 | available |
| 2026-04-10 | 사유원 | 까비 | confirmed |
| 2026-04-11 | 뮤지엄산 | 티아라, 토이와 | confirmed |
| 2026-04-12 | 뮤지엄산 | 미술관가는날 | confirmed |
| 2026-04-15 | 사유원 | 그린이 | confirmed |
| 2026-04-18 | 사유원 | 바람은, 무아 | confirmed |
| 2026-04-18 | 뮤지엄산 | 파랑새홍, 제씨킴 | confirmed |
| 2026-04-25 | 사유원 | 미술관가는날 | confirmed |

> 주의: 4/18은 같은 날 두 목적지(사유원, 뮤지엄산)로 스탭이 나뉘어 배정됨

---

## 5. 페이지 구조

### 5.1 메인 캘린더 (`/`)

- **월간 캘린더 뷰** (2026년 4월 기본 표시)
- 각 날짜 셀에 일정 요약 표시:
  - 목적지 이름 (색상 뱃지)
  - 참여 스탭 수 또는 이름
  - 목적지 미정인 경우 "미정" 표시 (회색 뱃지)
- 월 이동 네비게이션 (← 이전 / 다음 →)
- 오늘 날짜 하이라이트

### 5.2 날짜 상세 바텀시트 (날짜 셀 탭)

- 해당 날짜의 모든 일정 목록
- 목적지별 그룹핑
- 각 일정: 목적지 뱃지 + 스탭 닉네임 + 상태
- "일정 추가" 버튼

### 5.3 일정 추가/수정 모달

- 날짜 선택 (date picker)
- 목적지 선택 (드롭다운, "미정" 옵션 포함)
- 스탭 선택 (멀티셀렉트 — 여러 스탭 동시 추가)
- 상태 선택 (available / confirmed / cancelled)
- 메모 입력
- 저장 / 취소 / 삭제 버튼

---

## 6. UI/UX 디자인 방향

### 모바일 퍼스트
- 기본 뷰포트: 375px (iPhone SE) ~ 430px (iPhone Pro Max)
- 캘린더 셀 터치 영역 최소 44px × 44px
- 바텀시트 패턴 (날짜 탭 시 아래에서 올라오는 시트)
- 스와이프로 월 이동

### 비주얼 컨셉: "갤러리 큐레이션"
- 아트프렌즈 정체성에 맞는 감각적이고 따뜻한 디자인
- 배경: 오프화이트 / 크림 톤 (미술관 벽면 느낌)
- 목적지별 컬러 팔레트:
  - 사유원: `#2D5016` (깊은 녹색 — 자연/명상)
  - 뮤지엄산: `#8B4513` (갈색 — 산/건축)
  - 강릉: `#1E6091` (바다 파랑)
  - 대구: `#B91C1C` (붉은색)
  - 당진: `#D97706` (황토/노랑)
  - 완주: `#7C3AED` (보라)
  - 영주: `#0F766E` (청록)
  - 미정: `#9CA3AF` (회색)
- 폰트: Pretendard (한글 본문), 숫자/영문 보조
- 날짜 셀: 일정 있는 날은 목적지 색상 도트 또는 소형 뱃지

### 데스크톱 대응
- max-width: 480px 중앙 정렬 (모바일 앱 느낌 유지)
- 또는 768px 이상에서 사이드 패널 레이아웃

---

## 7. 핵심 기능 (MVP — v1)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 월간 캘린더 뷰 | 날짜별 일정 표시, 월 이동 | P0 |
| 날짜 상세 보기 | 날짜 탭 → 바텀시트로 상세 표시 | P0 |
| 일정 CRUD | 추가/수정/삭제 (Supabase 연동) | P0 |
| 목적지 색상 구분 | 목적지별 고유 컬러 뱃지 | P0 |
| Mock 데이터 시드 | 초기 데이터 DB insert 스크립트 | P0 |
| 모바일 반응형 | 375~430px 최적화 | P0 |

---

## 8. 확장 기능 (v2+)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 스탭 인증 | Supabase Auth 기반 로그인 | P1 |
| 내 일정 필터 | 로그인 스탭 본인 일정만 보기 | P1 |
| 알림 | 일정 확정 시 KakaoTalk/Push 알림 | P2 |
| 스탭 가용성 투표 | 날짜별 "참여 가능" 투표 | P1 |
| 목적지/스탭 관리 | 관리자 페이지에서 추가/삭제 | P1 |
| AI 수요 예측 | 과거 데이터 기반 최적 일정 추천 | P2 |
| 주간/리스트 뷰 | 캘린더 외 대안 뷰 | P2 |

---

## 9. Supabase 설정

### 9.1 SQL 마이그레이션 (테이블 생성)

```sql
-- staffs
CREATE TABLE staffs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- destinations
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#9CA3AF',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- schedules
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staffs(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'confirmed', 'cancelled')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, destination_id, staff_id)
);

-- 인덱스
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_schedules_staff ON schedules(staff_id);
CREATE INDEX idx_schedules_destination ON schedules(destination_id);
```

### 9.2 RLS 정책 (v1: 공개 읽기/쓰기)

```sql
ALTER TABLE staffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- v1에서는 전체 공개 (인증 도입 전)
CREATE POLICY "Public read" ON staffs FOR SELECT USING (true);
CREATE POLICY "Public read" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public write" ON schedules FOR ALL USING (true);
```

### 9.3 Seed 데이터

```sql
-- 스탭 삽입
INSERT INTO staffs (nickname) VALUES
  ('까비'), ('미술관가는날'), ('파랑새홍'), ('무아'), ('에이미'),
  ('세계여행'), ('그린이'), ('써니'), ('제씨킴'), ('티아라'),
  ('건빵'), ('연지빛'), ('토이와'), ('바람은');

-- 목적지 삽입
INSERT INTO destinations (name, color) VALUES
  ('사유원', '#2D5016'),
  ('뮤지엄산', '#8B4513'),
  ('강릉', '#1E6091'),
  ('대구', '#B91C1C'),
  ('당진', '#D97706'),
  ('완주', '#7C3AED'),
  ('영주', '#0F766E');

-- 스케줄 삽입 (mock data)
INSERT INTO schedules (date, destination_id, staff_id, status) VALUES
  -- 4/7 미정: 까비, 그린이, 세계여행, 써니
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='까비'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='그린이'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='세계여행'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='써니'), 'available'),
  -- 4/8 미정: 무아
  ('2026-04-08', NULL, (SELECT id FROM staffs WHERE nickname='무아'), 'available'),
  -- 4/10 사유원: 까비
  ('2026-04-10', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='까비'), 'confirmed'),
  -- 4/11 뮤지엄산: 티아라, 토이와
  ('2026-04-11', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='티아라'), 'confirmed'),
  ('2026-04-11', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='토이와'), 'confirmed'),
  -- 4/12 뮤지엄산: 미술관가는날
  ('2026-04-12', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed'),
  -- 4/15 사유원: 그린이
  ('2026-04-15', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='그린이'), 'confirmed'),
  -- 4/18 사유원: 바람은, 무아
  ('2026-04-18', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='바람은'), 'confirmed'),
  ('2026-04-18', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='무아'), 'confirmed'),
  -- 4/18 뮤지엄산: 파랑새홍, 제씨킴
  ('2026-04-18', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='파랑새홍'), 'confirmed'),
  ('2026-04-18', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='제씨킴'), 'confirmed'),
  -- 4/25 사유원: 미술관가는날
  ('2026-04-25', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed');
```

---

## 10. 프로젝트 구조

```
artbus-calendar/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Pretendard 폰트)
│   ├── page.tsx            # 메인 캘린더 페이지
│   ├── globals.css         # Tailwind + 커스텀 CSS 변수
│   └── api/
│       └── schedules/
│           └── route.ts    # API Route (CRUD)
├── components/
│   ├── Calendar.tsx        # 월간 캘린더 그리드
│   ├── CalendarCell.tsx    # 날짜 셀 (일정 도트/뱃지)
│   ├── BottomSheet.tsx     # 날짜 상세 바텀시트
│   ├── ScheduleForm.tsx    # 일정 추가/수정 폼
│   ├── DestinationBadge.tsx # 목적지 색상 뱃지
│   └── MonthNav.tsx        # 월 이동 네비게이션
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트
│   ├── types.ts            # TypeScript 타입 정의
│   └── constants.ts        # 스탭/목적지 상수
├── supabase/
│   ├── migrations/
│   │   └── 001_init.sql    # 테이블 생성
│   └── seed.sql            # Mock 데이터
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local              # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 11. API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/schedules?year=2026&month=4` | 월별 스케줄 조회 (staff, destination join) |
| POST | `/api/schedules` | 일정 추가 |
| PATCH | `/api/schedules/[id]` | 일정 수정 |
| DELETE | `/api/schedules/[id]` | 일정 삭제 |

---

## 12. 개발 순서

1. **Supabase 프로젝트 생성** — 테이블 + seed 데이터
2. **Next.js 프로젝트 초기화** — App Router, Tailwind, Supabase 클라이언트
3. **캘린더 UI** — 월간 그리드 + 날짜 셀 렌더링
4. **데이터 연동** — Supabase에서 스케줄 fetch → 캘린더 표시
5. **바텀시트** — 날짜 탭 → 상세 보기
6. **CRUD** — 일정 추가/수정/삭제 폼
7. **모바일 최적화** — 터치, 스와이프, 반응형 점검
8. **배포** — Vercel 연동
