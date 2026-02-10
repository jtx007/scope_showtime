-- Performance indexes for showtimes queries
CREATE INDEX IF NOT EXISTS idx_showtimes_active_start 
  ON showtimes(start_time) 
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_showtimes_theater_active 
  ON showtimes(theater_name) 
  WHERE archived_at IS NULL;

DROP INDEX IF EXISTS idx_showtimes_archived;
