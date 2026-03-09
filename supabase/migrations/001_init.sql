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

-- RLS 활성화
ALTER TABLE staffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- v1: 전체 공개 정책
CREATE POLICY "Public read" ON staffs FOR SELECT USING (true);
CREATE POLICY "Public read" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public write" ON schedules FOR ALL USING (true);
CREATE POLICY "Public write staffs" ON staffs FOR ALL USING (true);
CREATE POLICY "Public write destinations" ON destinations FOR ALL USING (true);
