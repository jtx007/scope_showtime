import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { env } from './env'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  }
  return supabaseClient
}
