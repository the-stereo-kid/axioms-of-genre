-- Rename "Techno" to "Groovy Techno" and ensure it's a root genre
-- Run this in Supabase SQL Editor

UPDATE public.genres
SET 
  name = 'Groovy Techno',
  is_root = true
WHERE name = 'Techno';

-- Optional: Update description to reflect the personalized nature
UPDATE public.genres
SET description = 'Groovy techno is driven by a dependable kick and repetitive patterns, with an emphasis on infectious grooves that make you move.'
WHERE name = 'Groovy Techno';
