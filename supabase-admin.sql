-- ============================================================
-- Joshua Omotayo portfolio — admin prerequisites
-- Run this in Supabase Dashboard > SQL Editor after supabase-setup.sql.
-- All statements are idempotent (safe to run more than once).
-- ============================================================

-- 1) Make the account an ADMIN so it can create/edit everything in the CMS.
--    (uid + email provided by Joshua)
insert into public.user_roles (user_id, role)
values ('84967466-434d-4a7f-97e5-051a07708be0'::uuid, 'admin')
on conflict (user_id, role) do nothing;

-- 2) A public storage bucket for uploads made from the admin panel
--    (project images, product screenshots, video thumbnails, portrait).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public can read media (the portfolio shows these images to visitors).
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

-- Only admin/editor users can upload, change or delete media.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

-- 3) Fill in your details (EDIT THE VALUES, then run). These power the
--    Contact "DIRECT" email, footer links, availability and location text.
update public.site_settings set
  id = 1,
  site_name = 'Joshua Omotayo',
  email = 'playgen.ng@gmail.com',              -- <-- your direct email
  youtube_url = 'https://www.youtube.com/@joshua-omotayo',  -- <-- your YouTube channel
  github_url = '',
  linkedin_url = '',
  twitter_url = '',
  instagram_url = '',
  availability_status = 'Available for new projects',
  current_focus = ''
where id = 1;

-- Done. Sign in to the admin panel with the email + password for the account
-- above (uid 84967466-434d-4a7f-97e5-051a07708be0).
