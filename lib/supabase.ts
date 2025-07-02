import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface DatabaseStudent {
  id: string
  name: string
  email: string
  grade: number | null
  notes: string | null
  tags: string[]
  group_id: string | null
  position_x: number | null
  position_y: number | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseGroup {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}
