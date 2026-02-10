import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { FileDropzone } from '@/components/ui/file-dropzone'
import { uploadCsvToBucket } from '@/api/storage'
import { parseCSVFile } from '@/lib/showtime-utils'
import type { ReconcileResult } from '@/types/showtime'

interface CsvUploadProps {
  onReconcile: (result: ReconcileResult, currentCount: number) => void
  currentCount: number
  disabled?: boolean
}

export function CsvUpload({ onReconcile, disabled }: CsvUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDrop(files: File[]) {
    const file = files[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      await uploadCsvToBucket(file)

      const incoming = await parseCSVFile(file)
      const { reconcile } = await import('@/lib/reconcile')
      const { fetchShowtimes } = await import('@/api/showtimes')

      const current = await fetchShowtimes()
      const result = reconcile(
        current as Parameters<typeof reconcile>[0][],
        incoming
      )
      onReconcile(result, current.length)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <FileDropzone
        onDrop={handleDrop}
        accept={{ 'text/csv': ['.csv'], 'application/csv': ['.csv'] }}
        maxFiles={1}
        disabled={disabled || uploading}
      >
        <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              Uploading…
            </>
          ) : (
            'Drag and drop a CSV here, or click to select'
          )}
        </p>
      </FileDropzone>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
