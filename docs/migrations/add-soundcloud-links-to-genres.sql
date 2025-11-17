-- Add soundcloud_links column to genres table
-- Run this in Supabase SQL Editor

ALTER TABLE public.genres
ADD COLUMN IF NOT EXISTS soundcloud_links JSONB;

-- Optional: Add a comment for documentation
COMMENT ON COLUMN public.genres.soundcloud_links IS 'Array of SoundCloud URLs (tracks, playlists, or profiles) stored as JSONB';
