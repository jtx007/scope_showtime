-- Showtimes table for theater schedule management
CREATE TABLE IF NOT EXISTS showtimes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theater_name TEXT NOT NULL,
  movie_title TEXT NOT NULL,
  auditorium TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  language TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  rating TEXT NOT NULL DEFAULT '',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_showtimes_theater ON showtimes(theater_name);
CREATE INDEX IF NOT EXISTS idx_showtimes_archived ON showtimes(archived_at) WHERE archived_at IS NULL;
