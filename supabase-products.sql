-- ============================================================
-- Products (the /build "Things I'm Building" showcase) — now editable from the admin panel.
-- Run in Supabase Dashboard > SQL Editor. Idempotent (safe to re-run).
-- Requires supabase-setup.sql to have run first (it creates set_updated_at + roles).
-- ============================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  url text default '',
  position text default '',
  description text default '',
  cta text default '',
  image text default '',                 -- screenshot / featured image URL (or uploaded via admin)
  visual text default 'business',        -- abstract visual style: business | assistant | impact
  status text default 'LIVE',            -- LIVE | IN PROGRESS | COMING SOON
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products
  for select to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists products_updated on public.products;
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- Seed the current showcase. Edit freely from the admin afterwards.
insert into public.products (name, slug, url, position, description, cta, visual, status, sort_order, published) values
  ('GenRev', 'genrev', 'https://genrev.ng', 'Business Development Tools',
   'A business development toolkit designed to help business owners manage and grow their businesses.',
   'Visit GenRev', 'business', 'LIVE', 1, true),
  ('GenRev AI', 'genrev-ai', 'https://genrev.app', 'AI Social Media Assistant',
   'An AI-powered social media assistant designed to help people create, manage and improve their social media presence.',
   'Explore GenRev AI', 'assistant', 'IN PROGRESS', 2, true),
  ('GoodDeed Network', 'gooddeed-network', 'https://gooddeednetwork.com', 'Technology for Social Good',
   'A technology-for-social-good initiative using technology to advocate for people and create positive social impact.',
   'Visit GoodDeed Network', 'impact', 'LIVE', 3, true),
  ('PlayGen', 'playgen', 'https://www.playgen.com.ng/', 'Earn Real Naira — Tasks & Quizzes',
   'Complete tasks, win sponsored quizzes and recharge your phone while earning money into your wallet. No gambling, no tricks.',
   'Visit PlayGen', 'business', 'LIVE · IN PROGRESS', 4, true),
  ('BuildBot', 'buildbot', '', 'AI Build Agent',
   'An AI agent that helps build and ship software. Currently in development — link coming soon.',
   'Coming soon', 'assistant', 'IN PROGRESS', 5, true)
on conflict (slug) do update set
  name = excluded.name,
  url = excluded.url,
  position = excluded.position,
  description = excluded.description,
  cta = excluded.cta,
  visual = excluded.visual,
  status = excluded.status,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
