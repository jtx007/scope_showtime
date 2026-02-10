import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ReconcileResult } from '@/types/showtime'

interface PreviewChangesProps {
  result: ReconcileResult
  onApply: () => void
  onCancel: () => void
  isApplying?: boolean
}

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

export function PreviewChanges({
  result,
  onApply,
  onCancel,
  isApplying,
}: PreviewChangesProps) {
  const { adds, updates, archives } = result
  const total = adds.length + updates.length + archives.length
  if (total === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview changes</CardTitle>
        <p className="text-sm text-muted-foreground">
          {adds.length} add(s), {updates.length} update(s), {archives.length}{' '}
          archive(s)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {adds.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-green-600 dark:text-green-500">
              Add ({adds.length})
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Theater</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Auditorium</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Format</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adds.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.theater_name}</TableCell>
                    <TableCell>{r.movie_title}</TableCell>
                    <TableCell>{r.auditorium}</TableCell>
                    <TableCell>{formatTime(r.start_time)}</TableCell>
                    <TableCell>{r.format}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {updates.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-amber-600 dark:text-amber-500">
              Update ({updates.length})
            </h4>
            <div className="space-y-4">
              {updates.map((u, i) => (
                <Card key={i} className="border-amber-200 dark:border-amber-900">
                  <CardContent className="pt-4">
                    <p className="mb-2 font-medium">
                      {u.incoming.theater_name} · {u.incoming.movie_title} — {formatTime(u.existing.start_time)}
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {u.diffs.map((d, j) => (
                        <li key={j}>
                          <span className="font-medium">{d.field}</span>:{' '}
                          <del className="text-red-500">{d.from}</del> →{' '}
                          <ins className="text-green-600 dark:text-green-400">{d.to}</ins>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {archives.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-red-600 dark:text-red-500">
              Archive ({archives.length})
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Theater</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Auditorium</TableHead>
                  <TableHead>Start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archives.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.theater_name}</TableCell>
                    <TableCell>{r.movie_title}</TableCell>
                    <TableCell>{r.auditorium}</TableCell>
                    <TableCell>{formatTime(r.start_time)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onApply} disabled={isApplying}>
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying…
            </>
          ) : (
            'Apply changes'
          )}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isApplying}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
