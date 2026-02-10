import { useQuery } from '@tanstack/react-query'

import { getSupabase } from '@/lib/supabase'

import { queryKeys } from '@/api/queries/keys'

/**
 * Example query hook demonstrating Supabase + TanStack Query integration.
 * Replace with your own table queries using queryKeys.tables(tableName).
 */
export function useSessionQuery() {
  return useQuery({
    queryKey: [...queryKeys.all, 'session'],
    queryFn: async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    },
  })
}
