const BUCKET = 'csv-drops'

export async function uploadCsvToBucket(file: File): Promise<string> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()

  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'text/csv',
    upsert: false,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}
