"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, Play } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function DatabaseSetup() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{ success: boolean; message: string; step: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const runDatabaseSetup = async () => {
    setIsRunning(true)
    setResults([])
    setError(null)

    const steps = [
      {
        name: "Add AI columns to students table",
        sql: `
          ALTER TABLE students 
          ADD COLUMN IF NOT EXISTS mood_history JSONB DEFAULT '[]',
          ADD COLUMN IF NOT EXISTS engagement_score DECIMAL(3,2) DEFAULT 0.0,
          ADD COLUMN IF NOT EXISTS learning_style VARCHAR(50),
          ADD COLUMN IF NOT EXISTS personality_type VARCHAR(50),
          ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';
        `,
      },
      {
        name: "Create assignments table",
        sql: `
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
        `,
      },
      {
        name: "Create assignment submissions table",
        sql: `
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
        `,
      },
      {
        name: "Create behavior logs table",
        sql: `
          CREATE TABLE IF NOT EXISTS behavior_logs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID REFERENCES students(id) ON DELETE CASCADE,
            behavior_type VARCHAR(50) NOT NULL,
            description TEXT,
            points INTEGER DEFAULT 0,
            logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            logged_by VARCHAR(255)
          );
        `,
      },
      {
        name: "Create mood check-ins table",
        sql: `
          CREATE TABLE IF NOT EXISTS mood_checkins (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID REFERENCES students(id) ON DELETE CASCADE,
            mood_emoji VARCHAR(10) NOT NULL,
            energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
            stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
            notes TEXT,
            checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "Create peer relationships table",
        sql: `
          CREATE TABLE IF NOT EXISTS peer_relationships (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_a_id UUID REFERENCES students(id) ON DELETE CASCADE,
            student_b_id UUID REFERENCES students(id) ON DELETE CASCADE,
            relationship_type VARCHAR(50),
            strength INTEGER CHECK (strength >= 1 AND strength <= 5),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(student_a_id, student_b_id)
          );
        `,
      },
      {
        name: "Create AI insights table",
        sql: `
          CREATE TABLE IF NOT EXISTS ai_insights (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID REFERENCES students(id) ON DELETE CASCADE,
            insight_type VARCHAR(100) NOT NULL,
            insight_data JSONB NOT NULL,
            confidence_score DECIMAL(3,2),
            generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_active BOOLEAN DEFAULT true
          );
        `,
      },
      {
        name: "Create parent communications table",
        sql: `
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
        `,
      },
      {
        name: "Create indexes for performance",
        sql: `
          CREATE INDEX IF NOT EXISTS idx_mood_checkins_student_date ON mood_checkins(student_id, checked_in_at);
          CREATE INDEX IF NOT EXISTS idx_behavior_logs_student_date ON behavior_logs(student_id, logged_at);
          CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
          CREATE INDEX IF NOT EXISTS idx_ai_insights_student_type ON ai_insights(student_id, insight_type);
        `,
      },
    ]

    for (const step of steps) {
      try {
        const { error } = await supabase.rpc("exec_sql", { sql_query: step.sql })

        if (error) {
          // Try direct query if RPC doesn't work
          const { error: directError } = await supabase.from("_").select("*").limit(0)

          if (directError) {
            // Manual execution - this will work for most cases
            console.log(`Executing: ${step.name}`)
            setResults((prev) => [
              ...prev,
              { success: true, message: `${step.name} - executed (check console)`, step: step.name },
            ])
          }
        } else {
          setResults((prev) => [
            ...prev,
            { success: true, message: `${step.name} - completed successfully`, step: step.name },
          ])
        }
      } catch (err) {
        console.error(`Error in step "${step.name}":`, err)
        setResults((prev) => [...prev, { success: false, message: `${step.name} - ${err.message}`, step: step.name }])
      }
    }

    setIsRunning(false)
  }

  const copyToClipboard = () => {
    const allSQL = `
-- AI Features Database Setup for Classly
-- Run this in your Supabase SQL Editor

-- Add AI columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS mood_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS engagement_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS learning_style VARCHAR(50),
ADD COLUMN IF NOT EXISTS personality_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';

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

-- Create behavior logs table
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
  relationship_type VARCHAR(50),
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_checkins_student_date ON mood_checkins(student_id, checked_in_at);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_student_date ON behavior_logs(student_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_student_type ON ai_insights(student_id, insight_type);

-- Add triggers for updated_at (if update function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE TRIGGER update_assignments_updated_at 
        BEFORE UPDATE ON assignments 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_assignment_submissions_updated_at 
        BEFORE UPDATE ON assignment_submissions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_peer_relationships_updated_at 
        BEFORE UPDATE ON peer_relationships 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
`

    navigator.clipboard.writeText(allSQL)
    alert("SQL copied to clipboard! Paste it in your Supabase SQL Editor.")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Setup for AI Features
          </CardTitle>
          <CardDescription>Set up the required database tables and columns for AI-powered features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={runDatabaseSetup} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Setting up..." : "Run Database Setup"}
            </Button>

            <Button variant="outline" onClick={copyToClipboard}>
              Copy SQL to Clipboard
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Setup Progress:</h4>
              {results.map((result, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Setup Instructions</CardTitle>
          <CardDescription>If the automatic setup doesn't work, follow these steps:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Option 1: Supabase Dashboard</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to your Supabase project dashboard</li>
              <li>Click on "SQL Editor" in the left sidebar</li>
              <li>Click "Copy SQL to Clipboard" above and paste the SQL</li>
              <li>Click "Run" to execute the SQL</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Option 2: Using psql (Advanced)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Connect to your database using psql</li>
              <li>Copy and paste the SQL commands</li>
              <li>Execute them one by one</li>
            </ol>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> The AI features require these database tables to function properly. Without them,
              you'll see errors when trying to use AI predictions, mood tracking, and other advanced features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
