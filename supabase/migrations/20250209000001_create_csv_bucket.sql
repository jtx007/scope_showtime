-- Create storage bucket for CSV drops
INSERT INTO storage.buckets (id, name, public)
VALUES ('csv-drops', 'csv-drops', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anon read (for public URLs)
CREATE POLICY "Public read for csv-drops"
ON storage.objects FOR SELECT
USING (bucket_id = 'csv-drops');

-- Allow anon insert (client uploads with anon key)
CREATE POLICY "Anon upload for csv-drops"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'csv-drops');
