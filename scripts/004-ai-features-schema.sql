-- Add AI-related tables and columns

-- Add mood tracking to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS mood_history JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS engagement_score DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS learning_style VARCHAR(50);
ALTER TABLE students ADD COLUMN IF NOT EXISTS personality_type VARCHAR(50);
ALTER TABLE students ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  subject VARCHAR(100),
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  grade DECIMAL(5,2),
  submitted_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  time_spent_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Create behavior tracking table
CREATE TABLE IF NOT EXISTS behavior_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  behavior_type VARCHAR(50) NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logged_by VARCHAR(255)
);

-- Create mood check-ins table
CREATE TABLE IF NOT EXISTS mood_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  mood_emoji VARCHAR(10) NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  notes TEXT,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create peer relationships table
CREATE TABLE IF NOT EXISTS peer_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_a_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_b_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50), -- 'friend', 'study_buddy', 'conflict', etc.
  strength INTEGER CHECK (strength >= 1 AND strength <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_a_id, student_b_id)
);

-- Create AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  insight_type VARCHAR(100) NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create parent communications table
CREATE TABLE IF NOT EXISTS parent_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  communication_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  content TEXT,
  ai_generated BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  response_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mood_checkins_student_date ON mood_checkins(student_id, checked_in_at);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_student_date ON behavior_logs(student_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_student_type ON ai_insights(student_id, insight_type);

-- Add triggers for updated_at
CREATE TRIGGER update_assignments_updated_at 
    BEFORE UPDATE ON assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at 
    BEFORE UPDATE ON assignment_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_peer_relationships_updated_at 
    BEFORE UPDATE ON peer_relationships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
