import type {
  FieldDiff,
  ReconcileResult,
  Showtime,
  ShowtimeRow,
  ShowtimeUpdate,
} from '@/types/showtime'
import { matchKey } from './showtime-utils'

const FIELDS: (keyof ShowtimeRow)[] = [
  'theater_name',
  'movie_title',
  'auditorium',
  'start_time',
  'end_time',
  'language',
  'format',
  'rating',
  'last_updated',
]

function getFieldDiff(
  existing: Showtime,
  incoming: ShowtimeRow,
): FieldDiff[] {
  const diffs: FieldDiff[] = []
  for (const field of FIELDS) {
    const a = String(existing[field] ?? '')
    const b = String(incoming[field] ?? '')
    if (a !== b) {
      diffs.push({ field, from: a, to: b })
    }
  }
  return diffs
}

export function reconcile(
  current: Showtime[],
  incoming: ShowtimeRow[],
): ReconcileResult {
  const adds: ShowtimeRow[] = []
  const updates: ShowtimeUpdate[] = []
  const archives: Showtime[] = []

  const incomingByKey = new Map<string, ShowtimeRow>()
  for (const row of incoming) {
    incomingByKey.set(matchKey(row), row)
  }

  const currentByKey = new Map<string, Showtime>()
  for (const row of current) {
    currentByKey.set(matchKey(row), row)
  }

  for (const [key, inc] of incomingByKey) {
    const existing = currentByKey.get(key)
    if (!existing) {
      adds.push(inc)
    } else {
      const diffs = getFieldDiff(existing, inc)
      if (diffs.length > 0) {
        updates.push({ existing, incoming: inc, diffs })
      }
    }
  }

  for (const [key, existing] of currentByKey) {
    if (!incomingByKey.has(key)) {
      archives.push(existing)
    }
  }

  return { adds, updates, archives }
}
