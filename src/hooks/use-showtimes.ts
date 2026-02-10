import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  applyChanges,
  clearSchedule,
  fetchShowtimes,
} from '@/api/showtimes'
import { queryKeys } from '@/api/queries/keys'
import type { ReconcileResult } from '@/types/showtime'

const THEATER = 'Scope Labs Cinema'

export function useShowtimes(theater = THEATER) {
  return useQuery({
    queryKey: queryKeys.showtimes.byTheater(theater),
    queryFn: () => fetchShowtimes(theater),
  })
}

export function useApplyChanges() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (result: ReconcileResult) => applyChanges(result),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['showtimes'] })
    },
  })
}

export function useClearSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => clearSchedule(THEATER),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['showtimes'] })
      const previous = qc.getQueriesData({ queryKey: ['showtimes'] })
      qc.setQueriesData({ queryKey: ['showtimes'] }, () => [])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        for (const [queryKey, data] of context.previous) {
          qc.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['showtimes'] })
    },
  })
}
