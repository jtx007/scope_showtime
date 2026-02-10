import { useState } from 'react'

import { CsvUpload } from '@/components/csv-upload'
import { PreviewChanges } from '@/components/preview-changes'
import { ShowtimesTable } from '@/components/showtimes-table'
import {
  useApplyChanges,
  useClearSchedule,
  useShowtimes,
} from '@/hooks/use-showtimes'
import type { ReconcileResult } from '@/types/showtime'

function App() {
  const { data: showtimes = [], isLoading } = useShowtimes()
  const applyChanges = useApplyChanges()
  const clearSchedule = useClearSchedule()
  const [preview, setPreview] = useState<{
    result: ReconcileResult
  } | null>(null)

  function handleReconcile(result: ReconcileResult) {
    setPreview({ result })
  }

  function handleApply() {
    if (!preview) return
    applyChanges.mutate(preview.result, {
      onSuccess: () => setPreview(null),
    })
  }

  function handleClearSchedule() {
    if (!window.confirm('Clear all showtimes? This will archive every current showtime.')) return
    clearSchedule.mutate()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Scope Labs Theatre — Showtimes Admin</h1>
        </header>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Upload CSV</h2>
          <CsvUpload
            onReconcile={handleReconcile}
            currentCount={showtimes.length}
            disabled={!!preview}
          />
        </section>

        {preview ? (
          <PreviewChanges
            result={preview.result}
            onApply={handleApply}
            onCancel={() => setPreview(null)}
            isApplying={applyChanges.isPending}
          />
        ) : null}

        <section>
          <h2 className="mb-4 text-lg font-semibold">Current showtimes</h2>
          <ShowtimesTable
            showtimes={showtimes}
            isLoading={isLoading}
            onClearSchedule={handleClearSchedule}
            isClearing={clearSchedule.isPending}
          />
        </section>
      </div>
    </div>
  )
}

export default App
