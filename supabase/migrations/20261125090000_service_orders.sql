-- ═══════════════════════════════════════════════════════════════════════════
-- Step 4A: service orders from the price calculators
-- (Website Development, AI Marketing, AI Automation).
--
-- Who can use this table:
--   • Row Level Security is ON and there are NO policies, so the public
--     ("anon") and logged-in ("authenticated") roles can't read, add, change
--     or delete anything.
--   • Orders are added only by our server route /api/orders, which uses the
--     server-only service role (that role skips Row Level Security).
--   • You can read orders in the Supabase dashboard (Table Editor).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.service_orders (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique
                      check (reference ~ '^BMB-[WMA]-[2-9A-Z]{4}$'),
  service           text not null
                      check (service in ('website', 'marketing', 'automation')),
  choices           jsonb not null,           -- every choice the customer made
  quote             jsonb not null,           -- the server's price breakdown
  estimated_total   bigint check (estimated_total is null or estimated_total >= 0),   -- one-time price in Naira (null = custom quote)
  monthly_total     bigint check (monthly_total is null or monthly_total >= 0),       -- per-month price in Naira, if any
  is_custom_quote   boolean not null default false,
  delivery_estimate text,
  full_name         text not null check (char_length(full_name) between 2 and 80),
  business_name     text check (business_name is null or char_length(business_name) <= 100),
  whatsapp          text not null check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  email             text check (email is null or char_length(email) <= 254),
  notes             text check (notes is null or char_length(notes) <= 500),
  status            text not null default 'new'
                      check (status in ('new', 'contacted', 'confirmed', 'cancelled', 'completed')),
  created_at        timestamptz not null default now()
);

comment on table public.service_orders is
  'Service orders from the website price calculators. Written only by /api/orders (service role). No public access.';

create index if not exists service_orders_created_at_idx on public.service_orders (created_at desc);
create index if not exists service_orders_status_idx on public.service_orders (status);

-- Lock it down: Row Level Security on, no policies, and no table rights for the public roles.
alter table public.service_orders enable row level security;
alter table public.service_orders force row level security;
revoke all on table public.service_orders from anon, authenticated;
