import { getSupabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import type { ReconcileResult, Showtime } from '@/types/showtime'

type ShowtimeInsert = Database['public']['Tables']['showtimes']['Insert']
type ShowtimeUpdate = Database['public']['Tables']['showtimes']['Update']

const THEATER_NAME = 'Scope Labs Cinema'

export async function fetchShowtimes(): Promise<Showtime[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .is('archived_at', null)
    .order('start_time', { ascending: true })

  if (error) throw error
  return (data ?? []) as Showtime[]
}

export async function applyChanges(result: ReconcileResult): Promise<void> {
  const supabase = getSupabase()

  for (const row of result.adds) {
    const payload: ShowtimeInsert = {
      theater_name: row.theater_name,
      movie_title: row.movie_title,
      auditorium: row.auditorium,
      start_time: row.start_time,
      end_time: row.end_time,
      language: row.language,
      format: row.format,
      rating: row.rating,
      last_updated: row.last_updated,
    }
    const { error } = await supabase.from('showtimes').insert(payload as never)
    if (error) throw error
  }

  for (const u of result.updates) {
    const payload: ShowtimeUpdate = {
      movie_title: u.incoming.movie_title,
      auditorium: u.incoming.auditorium,
      end_time: u.incoming.end_time,
      language: u.incoming.language,
      format: u.incoming.format,
      rating: u.incoming.rating,
      last_updated: u.incoming.last_updated,
    }
    const { error } = await supabase
      .from('showtimes')
      .update(payload as never)
      .eq('id', u.existing.id)
    if (error) throw error
  }

  const now = new Date().toISOString()
  for (const row of result.archives) {
    const { error } = await supabase
      .from('showtimes')
      .update({ archived_at: now } as never)
      .eq('id', row.id)
    if (error) throw error
  }
}

export async function clearSchedule(_theater?: string): Promise<void> {
  const supabase = getSupabase()
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('showtimes')
    .update({ archived_at: now } as never)
    .is('archived_at', null)

  if (error) throw error
}
