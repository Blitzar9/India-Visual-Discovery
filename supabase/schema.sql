-- India Visual Discovery — MVP schema (Priority 2)
-- Apply in the Supabase SQL editor, top to bottom, in one go.
-- Tables follow the DATA_MODEL.md entity names. RLS is ON everywhere;
-- policies are deliberately simple for the MVP vertical slice.

-- ── profiles ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  city text,
  interests text[] not null default '{}',
  bio text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row the moment someone signs up.
-- SECURITY DEFINER hardened with a fixed search_path: without it, the function's
-- unqualified name resolution follows the caller's search_path, letting a
-- malicious schema shadow objects the function touches.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), 'user_' || replace(new.id::text, '-', '')),
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), nullif(new.raw_user_meta_data->>'username', ''))
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── places ───────────────────────────────────────────────────────────────
create table public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  country text not null default 'India',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- ── posts ────────────────────────────────────────────────────────────────
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid references public.places (id) on delete set null,
  body text not null default '',
  created_at timestamptz not null default now()
);

-- ── post_media ───────────────────────────────────────────────────────────
create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  storage_path text not null,          -- path inside the post-media bucket
  position int not null default 0,     -- order within a carousel
  created_at timestamptz not null default now()
);
create index post_media_post_idx on public.post_media (post_id, position);

-- ── tags / post_tags ─────────────────────────────────────────────────────
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ── collections ──────────────────────────────────────────────────────────
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── saves ────────────────────────────────────────────────────────────────
create table public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  collection_id uuid references public.collections (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);
create index saves_user_idx on public.saves (user_id, created_at desc);
create index saves_collection_idx on public.saves (collection_id);

-- ── follows ──────────────────────────────────────────────────────────────
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- ── likes / comments (wired later; tables ready) ──────────────────────────
create table public.likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.places       enable row level security;
alter table public.posts        enable row level security;
alter table public.post_media   enable row level security;
alter table public.tags         enable row level security;
alter table public.post_tags    enable row level security;
alter table public.collections  enable row level security;
alter table public.saves        enable row level security;
alter table public.follows      enable row level security;
alter table public.likes        enable row level security;
alter table public.comments     enable row level security;

-- profiles: everyone reads; owners write their own
create policy "profiles readable by all" on public.profiles
  for select using (true);
create policy "users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- places & tags: everyone reads; signed-in users can add
create policy "places readable by all" on public.places for select using (true);
create policy "signed-in users add places" on public.places
  for insert with check (auth.role() = 'authenticated');
create policy "tags readable by all" on public.tags for select using (true);
create policy "signed-in users add tags" on public.tags
  for insert with check (auth.role() = 'authenticated');

-- posts: everyone reads; authors write their own
create policy "posts readable by all" on public.posts for select using (true);
create policy "authors manage own posts" on public.posts
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- post_media: everyone reads; only the post's author writes
create policy "post media readable by all" on public.post_media for select using (true);
create policy "post authors manage media" on public.post_media for all using (
  exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
) with check (
  exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
);

-- post_tags: everyone reads; post authors write
create policy "post tags readable by all" on public.post_tags for select using (true);
create policy "post authors manage post tags" on public.post_tags for all using (
  exists (select 1 from public.posts p where p.id = post_tags.post_id and p.author_id = auth.uid())
) with check (
  exists (select 1 from public.posts p where p.id = post_tags.post_id and p.author_id = auth.uid())
);

-- collections: public ones readable by all; owners see and manage their own
create policy "collections readable" on public.collections for select using (
  is_private = false or auth.uid() = owner_id
);
create policy "owners manage own collections" on public.collections
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- saves: users see and manage only their own
create policy "users manage own saves" on public.saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- follows: everyone reads; users manage their own follow rows
create policy "follows readable by all" on public.follows for select using (true);
create policy "users manage own follows" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- likes: everyone reads; users manage their own
create policy "likes readable by all" on public.likes for select using (true);
create policy "users manage own likes" on public.likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- comments: everyone reads; authors manage their own
create policy "comments readable by all" on public.comments for select using (true);
create policy "authors manage own comments" on public.comments
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- ── Storage: post-media bucket ─────────────────────────────────────────────
-- Path convention: {user_id}/{post_id}/{filename}
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

-- Anyone can read (post images are public content)
create policy "post-media public read"
  on storage.objects for select
  using (bucket_id = 'post-media');

-- Signed-in users can upload, but only inside their own {user_id}/ folder
create policy "post-media authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update/delete only objects inside their own {user_id}/ folder
create policy "post-media owners update"
  on storage.objects for update
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "post-media owners delete"
  on storage.objects for delete
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);
