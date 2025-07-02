-- Insert sample groups
INSERT INTO groups (id, name, color) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Project Team A', 'bg-blue-100 border-blue-300'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Needs Support', 'bg-yellow-100 border-yellow-300'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Honor Roll', 'bg-green-100 border-green-300')
ON CONFLICT (id) DO NOTHING;

-- Insert sample students
INSERT INTO students (id, name, email, grade, notes, tags, group_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'Emma Johnson', 'emma.j@school.edu', 92, 'Excellent participation in class discussions', ARRAY['honor-roll', 'active'], '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Liam Chen', 'liam.c@school.edu', 78, 'Needs help with essay structure', ARRAY['needs-support', 'creative'], '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Sophia Rodriguez', 'sophia.r@school.edu', 95, 'Natural leader, helps other students', ARRAY['honor-roll', 'leader'], '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440014', 'Noah Williams', 'noah.w@school.edu', 85, 'Great improvement this semester', ARRAY['improving', 'active'], NULL),
  ('550e8400-e29b-41d4-a716-446655440015', 'Ava Davis', 'ava.d@school.edu', NULL, 'Absent - makeup assignment needed', ARRAY['absent', 'makeup-needed'], '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440016', 'Ethan Brown', 'ethan.b@school.edu', 88, 'Strong analytical skills', ARRAY['analytical', 'quiet'], NULL),
  ('550e8400-e29b-41d4-a716-446655440017', 'Isabella Garcia', 'isabella.g@school.edu', 91, 'Excellent writer, creative thinker', ARRAY['honor-roll', 'creative'], '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440018', 'Mason Taylor', 'mason.t@school.edu', 73, 'Struggles with time management', ARRAY['needs-support'], '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440019', 'Olivia Anderson', 'olivia.a@school.edu', 89, 'Great team player', ARRAY['active', 'leader'], '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440020', 'Lucas Martinez', 'lucas.m@school.edu', 82, 'Improving steadily', ARRAY['improving'], '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;
