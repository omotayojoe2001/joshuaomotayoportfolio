-- ============================================================
-- Joshua Omotayo portfolio — contact attachments + admin inquiries
-- Run in Supabase Dashboard > SQL Editor after supabase-setup.sql.
-- All statements are idempotent (safe to run more than once).
-- ============================================================

-- 1) Let a submission carry an optional document (brief / requirements file).
alter table public.contact_submissions
  add column if not exists attachment text default '';

-- 2) A PRIVATE bucket for uploaded documents. Not public-read, so a stranger
--    can't guess the URL — the admin panel opens them with a short-lived link.
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

-- Anonymous visitors may upload an attachment (they still can't read any back).
drop policy if exists "attachments anon insert" on storage.objects;
create policy "attachments anon insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'attachments');

-- Only admin/editor can list/read/manage stored documents.
drop policy if exists "attachments admin read" on storage.objects;
create policy "attachments admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'attachments' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

drop policy if exists "attachments admin insert" on storage.objects;
create policy "attachments admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'attachments' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

drop policy if exists "attachments admin delete" on storage.objects;
create policy "attachments admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'attachments' and (
    public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor')
  ));

-- Done. Contact submissions already flow into public.contact_submissions
-- (see supabase-setup.sql "anyone can submit" / "admin read submissions").
-- Open them in the admin panel under the INQUIRIES tab.
