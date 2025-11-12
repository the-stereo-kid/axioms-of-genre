-- Add cover_image_url column to posts table
-- Run this in Supabase SQL Editor

alter table public.posts
add column if not exists cover_image_url text;

-- Optional: Add a comment for documentation
comment on column public.posts.cover_image_url is 'URL to the cover image stored in Supabase Storage';

