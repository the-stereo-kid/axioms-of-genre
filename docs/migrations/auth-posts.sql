-- Posts table for the author blog experience.
-- Run this in the Supabase SQL editor or via the CLI once the project is connected.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  markdown text not null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Policies will be added after we define author roles.

