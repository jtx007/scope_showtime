export interface ShowtimeRow {
  theater_name: string
  movie_title: string
  auditorium: string
  start_time: string
  end_time: string
  language: string
  format: string
  rating: string
  last_updated: string
}

export interface Showtime extends ShowtimeRow {
  id: string
  archived_at?: string | null
}

export interface FieldDiff {
  field: keyof ShowtimeRow
  from: string
  to: string
}

export interface ShowtimeUpdate {
  existing: Showtime
  incoming: ShowtimeRow
  diffs: FieldDiff[]
}

export interface ReconcileResult {
  adds: ShowtimeRow[]
  updates: ShowtimeUpdate[]
  archives: Showtime[]
}
