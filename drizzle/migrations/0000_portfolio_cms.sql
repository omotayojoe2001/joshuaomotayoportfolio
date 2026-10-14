-- roles
create type public.app_role as enum ('admin','editor','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  overview text default '',
  problem text default '',
  approach text default '',
  design_direction text default '',
  development text default '',
  outcome text default '',
  reflection text default '',
  category text default 'Web',
  year text default '',
  client text default '',
  location text default '',
  technologies text[] not null default '{}',
  featured_image text default '',
  gallery text[] not null default '{}',
  url text default '',
  layout text not null default 'landscape',
  sort_order int not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  cover_image text default '',
  category text default 'Technology',
  kind text not null default 'article',
  tags text[] not null default '{}',
  reading_time int not null default 3,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  code text not null default '001',
  title text not null,
  description text default '',
  status text not null default 'EXPLORING',
  url text default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text default '',
  role text default '',
  quote text not null,
  image text default '',
  country text default '',
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_url text not null,
  thumbnail text default '',
  description text default '',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.now_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  status text not null default 'BUILDING',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id int primary key default 1,
  site_name text default 'Joshua Omotayo',
  email text default '',
  youtube_url text default '',
  linkedin_url text default '',
  github_url text default '',
  twitter_url text default '',
  instagram_url text default '',
  availability_status text default 'Available for new projects',
  current_focus text default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text default '',
  project_type text default '',
  budget text default '',
  message text not null,
  created_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

grant select on public.projects, public.articles, public.experiments, public.testimonials, public.youtube_videos, public.now_items, public.site_settings to anon, authenticated;
grant insert, update, delete on public.projects, public.articles, public.experiments, public.testimonials, public.youtube_videos, public.now_items, public.site_settings to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, update, delete on public.contact_submissions to authenticated;
grant all on public.projects, public.articles, public.experiments, public.testimonials, public.youtube_videos, public.now_items, public.site_settings, public.contact_submissions to service_role;

alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.experiments enable row level security;
alter table public.testimonials enable row level security;
alter table public.youtube_videos enable row level security;
alter table public.now_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_submissions enable row level security;

create policy "public read published projects" on public.projects for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read published articles" on public.articles for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write articles" on public.articles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read experiments" on public.experiments for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write experiments" on public.experiments for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read videos" on public.youtube_videos for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write videos" on public.youtube_videos for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read now" on public.now_items for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin write now" on public.now_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin write settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "anyone can submit" on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "admin read submissions" on public.contact_submissions for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete submissions" on public.contact_submissions for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger articles_updated before update on public.articles for each row execute function public.set_updated_at();
create trigger experiments_updated before update on public.experiments for each row execute function public.set_updated_at();
create trigger testimonials_updated before update on public.testimonials for each row execute function public.set_updated_at();
create trigger videos_updated before update on public.youtube_videos for each row execute function public.set_updated_at();
create trigger now_updated before update on public.now_items for each row execute function public.set_updated_at();
create trigger settings_updated before update on public.site_settings for each row execute function public.set_updated_at();

insert into public.now_items (label, status, sort_order) values
 ('Building websites for clients','BUILDING',1),
 ('Exploring AI systems','EXPLORING',2),
 ('Building GenRev','BUILDING',3),
 ('Building GoodDeed Network','BUILDING',4),
 ('Teaching technology','TEACHING',5),
 ('Publishing ideas','WRITING',6);

insert into public.experiments (code, title, description, status) values
 ('001','Cursor field','A pointer-reactive grid exploring how motion communicates depth.','EXPLORING'),
 ('002','Prompt surfaces','Interface patterns for AI inside ordinary product screens.','BUILDING'),
 ('003','Editorial scroll','Type-driven scroll transitions for long-form technical writing.','SHIPPED');
