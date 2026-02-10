import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  onDrop: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function FileDropzone({
  onDrop,
  accept = { 'text/csv': ['.csv'], 'application/csv': ['.csv'] },
  maxFiles = 1,
  disabled = false,
  className,
  children,
}: FileDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) onDrop(acceptedFiles)
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors',
        isDragActive && 'border-primary bg-primary/5',
        !isDragActive && 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input {...getInputProps()} />
      {children ?? (
        <p className="text-center text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop the CSV file here…'
            : 'Drag and drop a CSV here, or click to select'}
        </p>
      )}
    </div>
  )
}
