-- Drop unique constraint on showtimes (if it exists)
ALTER TABLE showtimes
DROP CONSTRAINT IF EXISTS showtimes_theater_name_movie_title_start_time_key;
