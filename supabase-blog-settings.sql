-- ============================================================
-- Blog (Think) + Site Settings extras — makes the admin panel fully cover your requests.
-- Run in Supabase Dashboard > SQL Editor. Idempotent (safe to re-run).
-- Adds: a YouTube link on articles (video-with-the-article), and a location on site settings.
-- Requires supabase-setup.sql to have run first.
-- ============================================================

-- 1) Articles (Think/blog) can carry a YouTube video people watch in full.
alter table public.articles add column if not exists video_url text default '';

-- 2) Site settings: your location is now editable from the admin panel.
alter table public.site_settings add column if not exists location text default '';

-- 2b) Site settings: TikTok link, shown in the footer socials.
alter table public.site_settings add column if not exists tiktok_url text default '';

-- 3) Make sure the single settings row exists (safe if it already does).
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- 4) Fill your defaults ONLY if they are still empty (never overwrites admin edits).
update public.site_settings set youtube_url = 'https://www.youtube.com/@joshua-omotayo'
  where id = 1 and (youtube_url is null or youtube_url = '');
update public.site_settings set location = 'Lagos, Nigeria'
  where id = 1 and (location is null or location = '');
update public.site_settings set email = 'playgen.ng@gmail.com'
  where id = 1 and (email is null or email = '');

-- 5) Retire the outdated now-board entry. "Building GenRev" (genrev.ng is down)
--    becomes "Building Arise SLG". Only renames the old label, leaves admin edits alone.
update public.now_items set label = 'Building Arise SLG' where label = 'Building GenRev';

-- 6) Retire work that pointed at the dead genrev.ng site:
--    the GenRev AI Autopilot case study (the GenRev AI product on /build stays, on genrev.app).
delete from public.projects where slug = 'genrev-ai-autopilot';
