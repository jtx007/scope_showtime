import type { ShowtimeRow } from '@/types/showtime'

function trim(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function normalizeTitle(title: string): string {
  let t = trim(title)
    .replace(/[\-–—\u2011:]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
  t = t.replace(/\bpart two\b/gi, 'part 2')
  return t
}

export function normalizeShowtime(row: ShowtimeRow): ShowtimeRow {
  return {
    theater_name: trim(row.theater_name),
    movie_title: trim(row.movie_title),
    auditorium: trim(row.auditorium),
    start_time: row.start_time.trim(),
    end_time: row.end_time.trim(),
    language: trim(row.language),
    format: trim(row.format),
    rating: trim(row.rating),
    last_updated: row.last_updated.trim(),
  }
}

export function matchKey(row: ShowtimeRow): string {
  const theater = trim(row.theater_name).toLowerCase()
  const title = normalizeTitle(row.movie_title)
  const start = row.start_time.trim()
  return `${theater}|${title}|${start}`
}

export function dedupeShowtimes(rows: ShowtimeRow[]): ShowtimeRow[] {
  const seen = new Map<string, ShowtimeRow>()
  for (const row of rows) {
    const key = matchKey(row)
    if (!seen.has(key)) {
      seen.set(key, normalizeShowtime(row))
    }
  }
  return Array.from(seen.values())
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (inQuotes) {
      current += c
    } else if (c === ',') {
      result.push(current)
      current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
}

export function parseCSV(text: string): ShowtimeRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const header = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'))
  const rows: ShowtimeRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    for (let j = 0; j < header.length; j++) {
      row[header[j]] = values[j]?.trim() ?? ''
    }
    const theater = row.theater_name ?? ''
    const movie = row.movie_title ?? ''
    const start = row.start_time ?? ''
    if (theater && movie && start) {
      rows.push({
        theater_name: theater,
        movie_title: movie,
        auditorium: row.auditorium ?? '',
        start_time: start,
        end_time: row.end_time ?? '',
        language: row.language ?? '',
        format: row.format ?? '',
        rating: row.rating ?? '',
        last_updated: row.last_updated ?? '',
      })
    }
  }
  return dedupeShowtimes(rows)
}

export async function parseCSVFile(file: File): Promise<ShowtimeRow[]> {
  const text = await file.text()
  return parseCSV(text)
}
