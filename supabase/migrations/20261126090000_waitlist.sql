-- ═══════════════════════════════════════════════════════════════════════════
-- Step 4B: waitlist for the coming-soon Instagram and TikTok assistants.
--
-- One row per person per channel ("Both" is saved as two rows).
-- The same WhatsApp number can't be added twice for the same channel.
--
-- Who can use this table:
--   • Row Level Security is ON (and forced) with NO policies, and the public
--     ("anon") and logged-in ("authenticated") roles have no rights at all.
--   • Rows are added only by our server route /api/waitlist, which uses the
--     server-only service role (that role skips Row Level Security).
--   • You can read the list in the Supabase dashboard (Table Editor).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null check (char_length(full_name) between 2 and 80),
  whatsapp    text not null check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  email       text check (email is null or char_length(email) <= 254),
  channel     text not null check (channel in ('instagram', 'tiktok')),
  created_at  timestamptz not null default now(),
  constraint waitlist_whatsapp_channel_key unique (whatsapp, channel)
);

comment on table public.waitlist is
  'Waitlist for the Instagram and TikTok assistants. Written only by /api/waitlist (service role). No public access.';

create index if not exists waitlist_channel_created_idx on public.waitlist (channel, created_at desc);

-- Lock it down: Row Level Security on and forced, no policies, no rights for the public roles.
alter table public.waitlist enable row level security;
alter table public.waitlist force row level security;
revoke all on table public.waitlist from anon, authenticated;
