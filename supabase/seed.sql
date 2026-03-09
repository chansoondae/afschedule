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
  ('영주', '#0F766E'),
  ('솔올', '#E8590C');

-- 스케줄 삽입 (mock data)
INSERT INTO schedules (date, destination_id, staff_id, status) VALUES
  -- 4/7 미정: 까비, 그린이, 세계여행, 써니
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='까비'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='그린이'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='세계여행'), 'available'),
  ('2026-04-07', NULL, (SELECT id FROM staffs WHERE nickname='써니'), 'available'),
  -- 4/8 뮤지엄산: 에이미
  ('2026-04-08', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='에이미'), 'confirmed'),
  -- 4/11 뮤지엄산: 티아라, 토이와
  ('2026-04-11', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='티아라'), 'confirmed'),
  ('2026-04-11', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='토이와'), 'confirmed'),
  -- 4/12 뮤지엄산: 미술관가는날
  ('2026-04-12', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed'),
  -- 4/15 사유원: 그린이, 무아, 미술관가는날
  ('2026-04-15', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='그린이'), 'confirmed'),
  ('2026-04-15', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='무아'), 'confirmed'),
  ('2026-04-15', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed'),
  -- 4/18 사유원: 바람은
  ('2026-04-18', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='바람은'), 'confirmed'),
  -- 4/18 뮤지엄산: 파랑새홍, 제씨킴
  ('2026-04-18', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='파랑새홍'), 'confirmed'),
  ('2026-04-18', (SELECT id FROM destinations WHERE name='뮤지엄산'), (SELECT id FROM staffs WHERE nickname='제씨킴'), 'confirmed'),
  -- 4/22 사유원: 미술관가는날, 세계여행
  ('2026-04-22', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed'),
  ('2026-04-22', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='세계여행'), 'confirmed'),
  -- 4/25 사유원: 미술관가는날
  ('2026-04-25', (SELECT id FROM destinations WHERE name='사유원'), (SELECT id FROM staffs WHERE nickname='미술관가는날'), 'confirmed'),
  -- 4/25 솔올: 토이와
  ('2026-04-25', (SELECT id FROM destinations WHERE name='솔올'), (SELECT id FROM staffs WHERE nickname='토이와'), 'confirmed'),
  -- 4/29 솔올: 무아
  ('2026-04-29', (SELECT id FROM destinations WHERE name='솔올'), (SELECT id FROM staffs WHERE nickname='무아'), 'confirmed');
