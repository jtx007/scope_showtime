import { useState, useMemo } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Showtime } from '@/types/showtime'

interface ShowtimesTableProps {
  showtimes: Showtime[]
  isLoading?: boolean
  onClearSchedule: () => void
  isClearing?: boolean
}

type SortKey = 'movie_title' | 'auditorium' | 'start_time' | 'format' | 'rating'

function formatTime(s: string) {
  try {
    const d = new Date(s)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return s
  }
}

export function ShowtimesTable({
  showtimes,
  isLoading,
  onClearSchedule,
  isClearing,
}: ShowtimesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('start_time')
  const [sortAsc, setSortAsc] = useState(true)
  const [filterMovie, setFilterMovie] = useState('')
  const [filterFormat, setFilterFormat] = useState('')

  const sorted = useMemo(() => {
    const arr = [...showtimes]
    arr.sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortAsc ? cmp : -cmp
    })
    return arr
  }, [showtimes, sortKey, sortAsc])

  const filtered = useMemo(() => {
    let arr = sorted
    if (filterMovie) {
      const q = filterMovie.toLowerCase()
      arr = arr.filter((s) =>
        s.movie_title.toLowerCase().includes(q)
      )
    }
    if (filterFormat) {
      const q = filterFormat.toLowerCase()
      arr = arr.filter((s) =>
        s.format.toLowerCase().includes(q)
      )
    }
    return arr
  }, [sorted, filterMovie, filterFormat])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Filter movie:</label>
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Filter format:</label>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movie</TableHead>
                <TableHead>Auditorium</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Filter movie:</label>
          <input
            type="text"
            placeholder="Movie title…"
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
            className="rounded border border-input bg-background px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Filter format:</label>
          <input
            type="text"
            placeholder="2D, 3D, IMAX…"
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="rounded border border-input bg-background px-2 py-1 text-sm"
          />
        </div>
        <Button
          variant="destructive"
          onClick={onClearSchedule}
          disabled={isClearing || showtimes.length === 0}
        >
          {isClearing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Clearing…
            </>
          ) : (
            'Clear schedule'
          )}
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={() => handleSort('movie_title')}
                >
                  Movie {sortKey === 'movie_title' && (sortAsc ? '↑' : '↓')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={() => handleSort('auditorium')}
                >
                  Auditorium {sortKey === 'auditorium' && (sortAsc ? '↑' : '↓')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={() => handleSort('start_time')}
                >
                  Start {sortKey === 'start_time' && (sortAsc ? '↑' : '↓')}
                </button>
              </TableHead>
              <TableHead>End</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={() => handleSort('format')}
                >
                  Format {sortKey === 'format' && (sortAsc ? '↑' : '↓')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="font-medium hover:underline"
                  onClick={() => handleSort('rating')}
                >
                  Rating {sortKey === 'rating' && (sortAsc ? '↑' : '↓')}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No showtimes. Upload a CSV to add some.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.movie_title}</TableCell>
                  <TableCell>{s.auditorium}</TableCell>
                  <TableCell>{formatTime(s.start_time)}</TableCell>
                  <TableCell>{formatTime(s.end_time)}</TableCell>
                  <TableCell>{s.language}</TableCell>
                  <TableCell>{s.format}</TableCell>
                  <TableCell>{s.rating}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
