-- India Visual Discovery — MVP schema
-- INITIAL MIGRATION, single-run: apply in the Supabase SQL editor, top to
-- bottom, on a fresh project. Not written to be rerunnable (no IF NOT EXISTS
-- / DROP guards) — rerunning against a live database would error on existing
-- objects rather than silently drifting the schema.
-- Tables follow the DATA_MODEL.md entity names. RLS is ON everywhere;
-- policies are deliberately simple for the MVP vertical slice.
--
-- STATUS LIFECYCLE: posts and comments carry a simple status
-- ('published' / 'draft' [posts only] / 'deleted' / 'moderated'). Public
-- SELECT policies expose only status='published'. No moderation workflow,
-- no nested replies, no scheduled publishing in this MVP.
--
-- PAGINATION: posts, comments, likes, saves, follows and collection
-- memberships can grow without bound. The application MUST paginate every
-- such list (keyset on (created_at, id) recommended). No server-side
-- caching, materialized feeds, or ranking infrastructure in this MVP.
--
-- PUBLIC COLLECTIONS: public_collection_posts is a security-definer view
-- exposing (collection_id, post_id, place_id, sort_order, added_at) for
-- public collections only — no save_id, no user_id.
-- SOFT DELETE: the posts_soft_delete trigger converts DELETE on posts into
-- status='deleted'; hard delete is a controlled purge (see below). Account
-- deletion uses the delete_own_account() RPC (see below).

-- ── profiles ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  city text,
  interests text[] not null default '{}',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  status text not null default 'published'
    check (status in ('published', 'draft', 'deleted', 'moderated')),
  published_at timestamptz,  -- set by the app when status first becomes 'published'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_author_idx on public.posts (author_id, created_at desc);
create index posts_place_idx on public.posts (place_id, created_at desc);
create index posts_created_idx on public.posts (created_at desc);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── saves ────────────────────────────────────────────────────────────────
-- One row per user per post: the save itself. Collection membership lives in
-- collection_saves, so a saved post can sit in zero, one, or many collections.
create table public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);
create index saves_user_idx on public.saves (user_id, created_at desc);
create index saves_post_idx on public.saves (post_id, created_at desc);

-- ── collection_saves (junction) ──────────────────────────────────────────
create table public.collection_saves (
  collection_id uuid not null references public.collections (id) on delete cascade,
  save_id uuid not null references public.saves (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (collection_id, save_id)
);
create index collection_saves_save_idx on public.collection_saves (save_id);

-- ── follows ──────────────────────────────────────────────────────────────
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
-- who a user follows, chronological
create index follows_follower_idx on public.follows (follower_id, created_at desc);
-- who follows a user, chronological
create index follows_followee_idx on public.follows (followee_id, created_at desc);

-- ── likes / comments (wired later; tables ready) ──────────────────────────
create table public.likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index likes_post_idx on public.likes (post_id, created_at desc);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  status text not null default 'published'
    check (status in ('published', 'deleted', 'moderated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);

-- ── updated_at maintenance ───────────────────────────────────────────────
-- One shared trigger function; not SECURITY DEFINER (needs no elevated
-- privileges), but search_path is still pinned for hygiene.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create trigger set_comments_updated_at before update on public.comments
  for each row execute function public.set_updated_at();
create trigger set_collections_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

-- ── Soft delete for posts ──────────────────────────────────────────────────
-- The application's normal "delete post" action is converted into
-- status='deleted': the row, its saves, likes, comments and collection
-- memberships are all preserved. Plain (non-definer) function running as the
-- caller, who already holds UPDATE rights via the authors policy.
-- Account deletion does NOT use this trigger — see delete_own_account().
create or replace function public.soft_delete_post()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.posts
  set status = 'deleted', updated_at = now()
  where id = old.id;
  return null;  -- cancel the hard delete
end;
$$;

create trigger posts_soft_delete before delete on public.posts
  for each row execute function public.soft_delete_post();

-- ── Account deletion (controlled purge) ──────────────────────────────────
-- The application calls this RPC to delete an account. It briefly disables
-- posts_soft_delete so the profile DELETE cascades through posts and all
-- dependent rows for real, then re-enables the trigger — always, even if the
-- delete fails. Self-service only: a caller can delete nobody's account but
-- their own. (The Supabase Auth user itself is removed via the Admin API
-- with the service key — not in the database.)
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  alter table public.posts disable trigger posts_soft_delete;
  begin
    delete from public.profiles where id = auth.uid();
  exception when others then
    alter table public.posts enable trigger posts_soft_delete;
    raise;
  end;
  alter table public.posts enable trigger posts_soft_delete;
end;
$$;

revoke execute on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;

-- ── DELETION SEMANTICS (deliberate — read before changing) ────────────────
-- - Normal application post deletion is SOFT: the posts_soft_delete trigger
--   converts DELETE on posts into status='deleted'. The row and all its
--   saves, likes, comments and collection memberships are preserved.
-- - ACCOUNT DELETION is an explicit controlled purge and does NOT go through
--   the soft-delete trigger: the app calls public.delete_own_account(),
--   which disables posts_soft_delete, deletes the profile (hard-cascading
--   its posts, collections, saves, follows, likes and comments), and
--   re-enables the trigger — exception-safe. Never DELETE FROM profiles
--   directly: the trigger would intercept the cascaded post deletes and the
--   profile delete would fail on the FK.
-- - App roles can never hard-delete an individual post; real removal of a
--   single post happens only through a manual DBA purge with the trigger
--   disabled.
-- - A hard-deleted post cascades its post_media ROWS, likes, comments, saves
--   (and thereby their collection memberships). The STORAGE OBJECTS (files)
--   are NOT removed by the database — the application must delete the
--   post-media files on post delete, and on account deletion.
-- - Deleting a collection never deletes posts (no FK from posts to collections).
-- - Deleting a save never deletes the post (saves references posts).
-- - Removing a collection_saves row never deletes the underlying save.
-- - Deleting a place sets posts.place_id to null (posts survive).

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.places       enable row level security;
alter table public.posts        enable row level security;
alter table public.post_media   enable row level security;
alter table public.tags         enable row level security;
alter table public.post_tags    enable row level security;
alter table public.collections  enable row level security;
alter table public.collection_saves enable row level security;
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

-- posts: public reads see only published posts; authors see and manage
-- their own posts in any status (drafts, deleted, moderated)
create policy "published posts readable by all" on public.posts
  for select using (status = 'published');
create policy "authors manage own posts" on public.posts
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- post_media: everyone reads; only the post's author writes
-- post_media: public reads see only media of published posts (the bucket
-- itself is public, so storage_path must not leak for draft/deleted posts)
create policy "post media readable by all" on public.post_media
  for select using (exists (
    select 1 from public.posts p
    where p.id = post_media.post_id and p.status = 'published'
  ));
create policy "post authors manage media" on public.post_media for all using (
  exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
) with check (
  exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
);

-- post_tags: everyone reads; post authors write
-- post_tags: public reads see only tags of published posts
create policy "post tags readable by all" on public.post_tags
  for select using (exists (
    select 1 from public.posts p
    where p.id = post_tags.post_id and p.status = 'published'
  ));
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

-- collection_saves:
-- SELECT is allowed when the caller owns both the save and the collection,
-- or when the referenced collection is public (is_private = false).
-- A public collection exposes only opaque save_ids through this junction;
-- the saves rows themselves stay owner-readable, so no private save data
-- leaks. Public rendering of a collection's posts goes through the
-- public_collection_posts view (no save_id, no user_id exposed).
create policy "collection memberships readable" on public.collection_saves
  for select using (
    exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.is_private = false)
    or (exists (select 1 from public.saves s
            where s.id = collection_saves.save_id and s.user_id = auth.uid())
        and exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.owner_id = auth.uid()))
  );

-- INSERT/UPDATE/DELETE stay strictly owner-only: the caller must own BOTH
-- the save and the collection. Nobody can file somebody else's save into
-- their collection, or vice versa.
create policy "owners insert collection memberships" on public.collection_saves
  for insert with check (
    exists (select 1 from public.saves s
            where s.id = collection_saves.save_id and s.user_id = auth.uid())
    and exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.owner_id = auth.uid())
  );

create policy "owners update collection memberships" on public.collection_saves
  for update using (
    exists (select 1 from public.saves s
            where s.id = collection_saves.save_id and s.user_id = auth.uid())
    and exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.saves s
            where s.id = collection_saves.save_id and s.user_id = auth.uid())
    and exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.owner_id = auth.uid())
  );

create policy "owners delete collection memberships" on public.collection_saves
  for delete using (
    exists (select 1 from public.saves s
            where s.id = collection_saves.save_id and s.user_id = auth.uid())
    and exists (select 1 from public.collections c
            where c.id = collection_saves.collection_id and c.owner_id = auth.uid())
  );

-- follows: everyone reads; users manage their own follow rows
create policy "follows readable by all" on public.follows for select using (true);
create policy "users manage own follows" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- likes: everyone reads; users manage their own
-- likes: public reads see only likes on published posts
create policy "likes readable by all" on public.likes
  for select using (exists (
    select 1 from public.posts p
    where p.id = likes.post_id and p.status = 'published'
  ));
create policy "users manage own likes" on public.likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- comments: public reads see only published comments on published posts;
-- authors see and manage their own comments in any status
create policy "published comments readable by all" on public.comments
  for select using (
    status = 'published'
    and exists (select 1 from public.posts p
                where p.id = comments.post_id and p.status = 'published')
  );
create policy "authors manage own comments" on public.comments
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- ── Storage: post-media bucket ─────────────────────────────────────────────
-- Path convention: {user_id}/{post_id}/{filename}
-- FOLLOW-UP (not implemented): a strict post_id ownership check — verifying
-- foldername(name)[2] against posts.id / posts.author_id — would bind each
-- file to a real post owned by the uploader. Deferred: it changes the upload
-- path contract, and a malformed path segment would raise a cast error inside
-- the policy and fail the whole query. The user-folder restriction below
-- must not be weakened in the meantime.
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

-- ── Public collection contents (read-only view) ────────────────────────────
-- Narrowly scoped read path so anyone can render a PUBLIC collection without
-- touching the RLS-protected saves table. Runs with the view owner's
-- privileges (requires Postgres 15+), but the public-only restriction is
-- structural — baked into the WHERE clause — so it cannot leak private data
-- even if RLS were evaluated as the caller. Exposes no save_id and no user_id.
-- The owner keeps full access to their own data via collection_saves (which
-- also shows their non-published posts); this view is the public rendering
-- path and therefore shows only published posts.
create or replace view public.public_collection_posts
with (security_invoker = false) as
select
  cs.collection_id,
  s.post_id,
  p.place_id,
  row_number() over (
    partition by cs.collection_id
    order by cs.created_at asc, s.id asc
  ) as sort_order,
  cs.created_at as added_at
from public.collection_saves cs
join public.saves s on s.id = cs.save_id
join public.posts p on p.id = s.post_id
join public.collections c on c.id = cs.collection_id
where c.is_private = false
  and p.status = 'published';

grant select on public.public_collection_posts to anon, authenticated;
