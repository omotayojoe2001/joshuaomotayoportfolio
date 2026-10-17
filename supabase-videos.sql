-- ============================================================
-- Teach / Watch lessons (the `youtube_videos` table behind VideoSection).
-- Run in Supabase Dashboard > SQL Editor. Idempotent (safe to re-run):
-- a row is skipped when the same video_url is already stored.
-- Requires supabase-setup.sql to have run first (it creates the table).
-- ============================================================

insert into public.youtube_videos (title, video_url, thumbnail, description, featured, published, created_at)
select v.title, v.video_url, v.thumbnail, v.description, v.featured, true, v.created_at::timestamptz
from (values
  (
    'Setting Up Your Server',
    'https://www.youtube.com/watch?v=-de8urY2C1w',
    'https://i.ytimg.com/vi/-de8urY2C1w/hqdefault.jpg',
    'From a blank hosting account to a live server: what a server actually does, how to choose one and how to get your first site answering on a domain.',
    true,
    '2026-09-18T09:00:00Z'
  ),
  (
    'Navigating the Wordpress Dashboard',
    'https://www.youtube.com/watch?v=emn79cIG3VI',
    'https://i.ytimg.com/vi/emn79cIG3VI/hqdefault.jpg',
    'A guided tour of the Wordpress admin: the sidebar, posts versus pages, media, themes and plugins - and the four screens you actually need every day.',
    false,
    '2026-09-04T09:00:00Z'
  )
) as v(title, video_url, thumbnail, description, featured, created_at)
where not exists (select 1 from public.youtube_videos e where e.video_url = v.video_url);

-- Lead the grid with the newest lesson. Scoped to these two rows so any other
-- featured video you added from the admin is left untouched.
update public.youtube_videos
set featured = (video_url = 'https://www.youtube.com/watch?v=-de8urY2C1w')
where video_url in (
  'https://www.youtube.com/watch?v=-de8urY2C1w',
  'https://www.youtube.com/watch?v=emn79cIG3VI'
);
