-- Enforce at most one active showtime per (theater, movie, start_time)
CREATE UNIQUE INDEX idx_showtimes_unique_active
  ON showtimes(theater_name, movie_title, start_time)
  WHERE archived_at IS NULL;
