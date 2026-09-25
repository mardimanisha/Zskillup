-- ZSkillup admin panel schema
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query -> paste -> Run) on a fresh project.
--
-- These three tables replace the site's previously-static content:
--   - blog_posts   replaces content/blog.ts's `blogPosts` array
--   - events       replaces content/events.ts's `featuredEvents` AND
--                   `galleryPhotos` arrays, merged into one table and
--                   distinguished by the `is_featured` flag (both arrays
--                   held the same `Photo` shape, so one table is enough)
--   - testimonials replaces content/testimonials.ts's `testimonials` array
--
-- content/blog.ts's `allCategories`/`categoryColors`, content/events.ts's
-- `galleryFilters`/`badgeColors`/`badgeLabels`/`inAction`, and
-- content/testimonials.ts's `testimonialsIntro` are NOT covered here - they
-- stay as static TS constants in the codebase, not admin-editable.
--
-- After running this file, also create the ONE admin user this app expects:
-- Supabase Dashboard -> Authentication -> Users -> Add user -> set an email
-- and password. There is no self-serve sign-up anywhere in this app - the
-- admin panel only ever calls supabase.auth.signInWithPassword with
-- credentials you create here.

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null,
  category_label text not null,
  date date not null,
  read_time int not null,
  author_name text not null,
  author_avatar text,
  cover_image text,
  featured boolean not null default false,
  sections jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "blog_posts_select_anyone"
  on public.blog_posts for select
  to anon, authenticated
  using (true);

create policy "blog_posts_insert_authenticated"
  on public.blog_posts for insert
  to authenticated
  with check (true);

create policy "blog_posts_update_authenticated"
  on public.blog_posts for update
  to authenticated
  using (true)
  with check (true);

create policy "blog_posts_delete_authenticated"
  on public.blog_posts for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- events (featured + gallery, merged via is_featured)
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  src text not null,
  alt text not null,
  title text not null,
  caption text not null,
  category text not null,
  date text,
  location text,
  is_featured boolean not null default false,
  articles jsonb not null default '[]',
  photos jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "events_select_anyone"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "events_insert_authenticated"
  on public.events for insert
  to authenticated
  with check (true);

create policy "events_update_authenticated"
  on public.events for update
  to authenticated
  using (true)
  with check (true);

create policy "events_delete_authenticated"
  on public.events for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text not null,
  institution text not null,
  category text not null,
  vertical text not null check (vertical in ('commerce', 'institutions', 'prephasz')),
  quote text not null,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials_select_anyone"
  on public.testimonials for select
  to anon, authenticated
  using (true);

create policy "testimonials_insert_authenticated"
  on public.testimonials for insert
  to authenticated
  with check (true);

create policy "testimonials_update_authenticated"
  on public.testimonials for update
  to authenticated
  using (true)
  with check (true);

create policy "testimonials_delete_authenticated"
  on public.testimonials for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for admin-uploaded images (cover images, section images,
-- event photos, testimonial photos). Public read so the static site can
-- render them; only an authenticated (admin) session can upload.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_select_anyone"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "media_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- seo_pages
-- One row per public page, keyed by its path ("/", "/blog", "/events").
-- Edited from /admin/seo. A missing row just means "use the built-in default"
-- from content/seo.ts, so this table can start empty.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_pages (
  path text primary key,
  meta_title text not null default '',
  meta_description text not null default '',
  keywords text not null default '',
  og_image text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.seo_pages enable row level security;

create policy "seo_pages_select_anyone"
  on public.seo_pages for select
  to anon, authenticated
  using (true);

create policy "seo_pages_insert_authenticated"
  on public.seo_pages for insert
  to authenticated
  with check (true);

create policy "seo_pages_update_authenticated"
  on public.seo_pages for update
  to authenticated
  using (true)
  with check (true);

create policy "seo_pages_delete_authenticated"
  on public.seo_pages for delete
  to authenticated
  using (true);
