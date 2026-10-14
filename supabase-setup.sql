-- ============================================================
-- Joshua Omotayo portfolio — full Supabase setup
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run
-- Runs the CMS schema, then seeds all 16 portfolio projects.
-- IDEMPOTENT: safe to run more than once on the same project (it skips what already exists).
-- The seed step is also idempotent (upsert by slug).
-- ============================================================

-- ---------- 1) SCHEMA ----------
-- roles
-- guarded so re-running does not throw "type app_role already exists"
do $$ begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'app_role'
  ) then
    create type public.app_role as enum ('admin','editor','user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
drop policy if exists "own roles readable" on public.user_roles;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- projects
create table if not exists public.projects (
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

create table if not exists public.articles (
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

create table if not exists public.experiments (
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

create table if not exists public.testimonials (
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

create table if not exists public.youtube_videos (
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

create table if not exists public.now_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  status text not null default 'BUILDING',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
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

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text default '',
  project_type text default '',
  budget text default '',
  message text not null,
  attachment text default '',
  created_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

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

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles" on public.articles for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write articles" on public.articles;
create policy "admin write articles" on public.articles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read experiments" on public.experiments;
create policy "public read experiments" on public.experiments for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write experiments" on public.experiments;
create policy "admin write experiments" on public.experiments for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read videos" on public.youtube_videos;
create policy "public read videos" on public.youtube_videos for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write videos" on public.youtube_videos;
create policy "admin write videos" on public.youtube_videos for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read now" on public.now_items;
create policy "public read now" on public.now_items for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
drop policy if exists "admin write now" on public.now_items;
create policy "admin write now" on public.now_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "anyone can submit" on public.contact_submissions;
create policy "anyone can submit" on public.contact_submissions for insert to anon, authenticated with check (true);
drop policy if exists "admin read submissions" on public.contact_submissions;
create policy "admin read submissions" on public.contact_submissions for select to authenticated using (public.has_role(auth.uid(),'admin'));
drop policy if exists "admin delete submissions" on public.contact_submissions;
create policy "admin delete submissions" on public.contact_submissions for delete to authenticated using (public.has_role(auth.uid(),'admin'));

drop trigger if exists projects_updated on public.projects;
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists articles_updated on public.articles;
create trigger articles_updated before update on public.articles for each row execute function public.set_updated_at();
drop trigger if exists experiments_updated on public.experiments;
create trigger experiments_updated before update on public.experiments for each row execute function public.set_updated_at();
drop trigger if exists testimonials_updated on public.testimonials;
create trigger testimonials_updated before update on public.testimonials for each row execute function public.set_updated_at();
drop trigger if exists videos_updated on public.youtube_videos;
create trigger videos_updated before update on public.youtube_videos for each row execute function public.set_updated_at();
drop trigger if exists now_updated on public.now_items;
create trigger now_updated before update on public.now_items for each row execute function public.set_updated_at();
drop trigger if exists settings_updated on public.site_settings;
create trigger settings_updated before update on public.site_settings for each row execute function public.set_updated_at();

insert into public.now_items (label, status, sort_order)
select v.label, v.status, v.sort_order from (values
 ('Building websites for clients','BUILDING',1),
 ('Exploring AI systems','EXPLORING',2),
 ('Building GenRev','BUILDING',3),
 ('Building GoodDeed Network','BUILDING',4),
 ('Teaching technology','TEACHING',5),
 ('Publishing ideas','WRITING',6)
) as v(label,status,sort_order)
where not exists (select 1 from public.now_items);

insert into public.experiments (code, title, description, status)
select v.code, v.title, v.description, v.status from (values
 ('001','Cursor field','A pointer-reactive grid exploring how motion communicates depth.','EXPLORING'),
 ('002','Prompt surfaces','Interface patterns for AI inside ordinary product screens.','BUILDING'),
 ('003','Editorial scroll','Type-driven scroll transitions for long-form technical writing.','SHIPPED')
) as v(code,title,description,status)
where not exists (select 1 from public.experiments);


-- ---------- 2) PROJECT SEED ----------
-- projects seed — generated from src/lib/data/projects.seed.ts
-- do not edit by hand; regenerate with: npx tsx scripts/generate-projects-seed.ts

insert into public.projects (
  id, title, slug, description, overview, problem, approach, design_direction,
  development, outcome, reflection, category, year, client, location,
  technologies, featured_image, gallery, url, layout, sort_order, featured, published
) values
  ('7f1c0a10-0000-4000-8000-000000000001', 'Genrev AI Business Autopilot', 'genrev-ai-autopilot', 'An AI platform that creates the content, publishes it, captures leads, follows up and converts — while the business owner does nothing.', 'Genrev''s flagship promise is absolute: the AI runs the entire business. The site had to make that claim believable in a single scroll — a clear account of what the agent does, what it costs, and what the owner still controls.', 'Small businesses are told AI will save them time, then handed a tool that needs prompt engineering, a content calendar and a social media manager to operate. Genrev needed to show automation that starts on day one, not after six hours of setup.', 'We led with the output, not the settings. A live autopilot strip shows content being written, scheduled, posted and answered in one loop, followed by the lead pipeline it feeds. Every feature is written as a sentence the owner already uses — ''it posts itself'', ''it follows up itself''.', 'Dark, confident and mechanical: near-black surfaces, a single acid accent, monospaced labels and visible rules. The interface reads like a control room rather than a SaaS marketing page.', 'React with a component-driven marketing layer, CSS-grid layouts, scroll reveals tied to the automation loop, and forms wired to the platform''s onboarding API. Section-level state keeps the demo strips light on mobile.', 'One page that carries the whole product story: clearer positioning, fewer ''what does it actually do'' questions, and demo requests arriving already pre-sold on the premise.', 'The harder job was not the animation, it was restraint — an autopilot pitch becomes credible the moment you stop over-explaining it and let one honest loop do the talking.', 'AI Platform', '2026', 'Genrev', 'Lagos, Nigeria', array['React', 'Tailwind CSS', 'REST API', 'Vite']::text[], null, array[]::text[], 'https://www.genrev.ng/', 'full', 1, true, true),
  ('7f1c0a10-0000-4000-8000-000000000002', 'Wealthtiv', 'wealthtiv', 'Everything finance — from knowing where to start, to knowing where to put your money. We teach it, we show it, we point you in the right direction.', 'Wealthtiv is the finance hub of the Acorn ecosystem: education, guidance and signposting in one place, without the jargon or the hard sell that usually surrounds money advice.', 'Most people do not fail at finance because they lack information; they fail because the information arrives in a language and a format they cannot act on. The site had to lower that barrier before asking for anything.', 'We organised the site around the question people actually arrive with — ''where do I start?'' — rather than product categories. A staged path moves from basics, to budgeting, to saving, to investing, with a clear next step at every level.', 'Calm and trustworthy: a warm neutral base, deep green as the growth accent, generous type and flat surfaces. No stock images of handshakes or gold coins.', 'Built as a fast static site with a typed content model so new lessons, calculators and pointers can be added without touching layout. Structured metadata keeps the finance content legible to search.', 'A single front door for the finance work, with clear routes into the coaching arm, the tools and the newsletter.', 'Financial trust online is earned by what you leave out. Saying ''we point you in the right direction'' honestly beats promising returns.', 'Fintech', '2026', 'Wealthtiv (Acorn Digital Solutions)', 'Nigeria / Canada', array['React', 'Tailwind CSS', 'CMS', 'SEO']::text[], null, array[]::text[], 'https://www.wealthtiv.com/', 'full', 2, true, true),
  ('7f1c0a10-0000-4000-8000-000000000003', 'Wealthtiv Coach', 'wealthtiv-coach', 'Simple, practical strategies to earn more, budget better, save consistently and invest with confidence — guided by a real coach, supported by an AI that never sleeps.', 'The coaching arm of Wealthtiv pairs human accountability with always-on AI guidance. The site sells a relationship and a routine, not a course library.', 'People had tried apps and courses and stalled. What was missing was someone who notices you skipped two weeks. The platform needed to show that a human is in the loop, while the AI handles the 11pm question.', 'Four pillars — earn, budget, save, invest — each with a plain-language strategy and the first action. Alongside them, the coach/AI split is shown explicitly: what the coach decides, what the assistant handles, what you actually do each week.', 'Editorial and quiet. A restrained palette, large readable numbers, and conversation-style snippets that make the AI feel like a chat thread rather than a dashboard.', 'React front end with a chat-style demo, a booking and intake flow connected to the coaching calendar, and progress states that persist per user session.', 'A page that converts on clarity: visitors understand the cadence, the cost and the difference between the coach and the assistant before they enquire.', 'The honest framing did the heavy lifting — ''an AI that never sleeps'' is a support claim, not a substitute for advice, and the page says so.', 'Fintech', '2026', 'Wealthtiv', 'Nigeria / Canada', array['React', 'Tailwind CSS', 'AI Chat', 'Booking Flow']::text[], null, array[]::text[], 'https://finance.wealthtiv.com/', 'landscape', 3, true, true),
  ('7f1c0a10-0000-4000-8000-000000000004', 'Genrev Learning Hub', 'genrev-learning', 'Web design, web development and AI mastery — from zero to paid clients in one complete programme.', 'A single curriculum covering web design, WordPress, AI-assisted development, UI/UX and how to actually get paid for the work. The site is the enrolment front for that programme.', 'Learners were assembling their own paths from scattered free tutorials and never reached a client-ready standard. The programme needed to present a complete path, not another lesson list.', 'The page is structured as a route: where you start, the modules in order, the projects you build, and the point at which you are ready to be paid. Outcomes are placed above features, and the curriculum expands inline so nothing is hidden behind a PDF.', 'Energetic but disciplined — bright accent on a dark base, numbered stages, and clear typographic hierarchy so a long curriculum still scans in under a minute.', 'Component-based modules rendered from a typed curriculum structure, accordion stage navigation, sticky enrolment call-to-action, and form handling into the CRM.', 'One page that answers the four questions that stop enrolment: is it for me, what will I build, how long, and what happens after.', 'Selling education is selling a sequence. Once the order is obvious, the pitch gets much shorter.', 'EdTech', '2026', 'Genrev', 'Lagos, Nigeria', array['React', 'Tailwind CSS', 'CMS', 'Forms']::text[], null, array[]::text[], 'https://learn.genrev.ng/', 'landscape', 4, true, true),
  ('7f1c0a10-0000-4000-8000-000000000005', 'Acorn Digital Solutions', 'acorn-digital-solutions', 'The parent ecosystem behind independent platforms in energy, education, fintech and mobile technology.', 'Acorn is the holding brand. Its site has to explain a portfolio of separate products without turning into a link directory or stealing attention from the platforms it hosts.', 'Visitors arrive for one product and need to understand the parent; partners arrive to assess capability and need evidence across sectors. Two audiences, one page, very different questions.', 'A layered structure: a short statement of what Acorn is, the four sectors as equal-weight cards, and each platform named with its own live link. The parent stays neutral so the products keep their voices.', 'Corporate but warm — an earth-toned accent, strong grid, generous white space and a restrained set of geometric marks instead of stock photography.', 'Static, SEO-first build with a typed registry of the ecosystem, so adding a platform is a one-line data change that propagates to the grid, the footer and the sitemap.', 'A credible front door for the group, and consistent metadata across every platform it points to.', 'Holding brands live or die on restraint. The best thing the Acorn site does is get out of the way of the products.', 'Corporate Website', '2026', 'Acorn Digital Solutions', 'Nigeria / Canada', array['React', 'Tailwind CSS', 'SEO', 'Design System']::text[], null, array[]::text[], 'https://www.acorndigitalsolution.com/', 'landscape', 5, false, true),
  ('7f1c0a10-0000-4000-8000-000000000006', 'PlayGen', 'playgen', 'Earn real naira completing tasks, winning sponsored quizzes and recharging your phone — no gambling, no tricks, money straight into your wallet.', 'PlayGen turns attention into small, real rewards. The site''s job is to overcome the first instinct anyone has toward an earning app in Nigeria: that it is a scam.', 'Users have been burned by apps that promise payout and then hide a withdrawal threshold. Every word on the page had to be verifiable, and the mechanics had to be legible in seconds.', 'Three earning paths — tasks, sponsored quizzes, airtime — each with a plain explanation and a screenshot of the wallet. The anti-gambling position is stated in the headline, and payout proof sits above the fold rather than buried in an FAQ.', 'Playful and high-contrast, with a mobile-first frame: the app mockups are the artwork, and the palette is pulled straight from them.', 'Campaign landing page with deep links into the app, a reward-mechanics explainer, and event tracking on each earning path so acquisition can be measured per channel.', 'Install and sign-up flow with clear attribution per reward type, and far fewer ''is this legit'' questions reaching support.', 'For a reward product, trust is the feature. Write the withdrawal rules honestly and the rest of the page gets easier.', 'Consumer App', '2026', 'PlayGen', 'Lagos, Nigeria', array['React', 'Tailwind CSS', 'Deep Links', 'Analytics']::text[], null, array[]::text[], 'https://www.playgen.com.ng/', 'landscape', 6, false, true),
  ('7f1c0a10-0000-4000-8000-000000000007', 'Anew Portals', 'anew-portals', 'Wisdom, inspiration and beauty in words that have shaped minds and hearts across generations.', 'An editorial portal built around reading rather than scrolling: quotations, essays and reflections, organised so a visitor can arrive curious and leave with something worth keeping.', 'Inspirational content sites are usually infinite feeds optimised for ad impressions. This one needed the opposite — calm pacing, real attribution and a structure that rewards returning to a piece.', 'A topic-and-author index in place of a feed, curated collections per theme, and a piece layout with typographic hierarchy built for long reading. Search handles the ''I remember a line but not the source'' case.', 'Print-led: serif display for the words themselves, a paper-toned background, wide measures, and no visual noise competing with the text.', 'Content-driven build with a typed article model, server-side rendering for shareable URLs, tag and collection archives, and clean metadata for link previews.', 'A library that stays readable at hundreds of entries, with stable, indexable URLs for every piece and collection.', 'Editing is the product here. Deciding what not to publish mattered more than any feature on the roadmap.', 'Editorial Platform', '2025', 'Anew Portals', 'Nigeria', array['Next.js', 'Tailwind CSS', 'CMS', 'Typography']::text[], null, array[]::text[], 'https://anewportals.com/', 'portrait', 7, false, true),
  ('7f1c0a10-0000-4000-8000-000000000008', 'Cravings Delight', 'cravings-delight', 'Premium African kitchen in Canada — soup and meal bowls built to order from premium ingredients, curated with accuracy and precision.', 'A preorder food service where every bowl is customised to taste. The website carries the two things a customer decides on in thirty seconds: what is actually in the food, and when it will be ready.', 'Customisable menus break most simple sites — options multiply, the kitchen gets ambiguous orders, and customers guess at portions and spice. The order had to be as precise as the kitchen.', 'A guided bowl builder: base, protein, heat level, sides and quantity, with each choice shown in plain language and a running total. Menu items are photographed honestly, and preorder windows are stated up front rather than at checkout.', 'Appetite first — dark plates, warm accents, full-bleed food photography and minimal chrome. Type stays quiet so the bowls lead.', 'Built the ordering layer with customisation state, pickup/delivery windows, and payment or confirmation handoff, plus a lightweight back view of orders for the kitchen.', 'Fewer clarifying calls to the kitchen, orders that read correctly the first time, and a menu that can be rotated weekly without a rebuild.', 'Preorder is a logistics promise before it is a marketing one. The site works when the kitchen can trust what the button produced.', 'Food & Beverage', '2025', 'Cravings Delight', 'Canada', array['React', 'Tailwind CSS', 'Order Flow', 'Stripe']::text[], null, array[]::text[], 'https://cravingsdelight.co.uk/', 'full', 8, false, true),
  ('7f1c0a10-0000-4000-8000-000000000009', 'Heritage Builds', 'heritage-builds', 'Premium stainless steel railing systems in AISI 304 and 316 grade — built to last, specified with confidence.', 'A product-led site for architectural ironmongery: railing systems, grades, finishes and specifications, presented so a homeowner, a fitter and a specifier all get the right answer on the same page.', 'Steel railing is bought on trust about longevity. Photos alone do not tell a buyer whether a system suits a coastal balcony, and they tell a specifier nothing about grade or load.', 'Every system is documented the same way: grade, application, finish, hardware and typical span, with 316 positioned explicitly for marine and high-exposure settings. A comparison view makes the 304-versus-316 decision obvious in seconds.', 'Materials-forward: brushed-metal neutrals, hairline rules, industrial typography and honest detailing shots lit to show the surface rather than hide it.', 'Product catalogue driven by a typed spec model, filterable by application and grade, with downloadable spec sheets and an enquiry form that carries the selected items through.', 'Enquiries arrive with the product already identified, which shortens quoting and removes most of the grade confusion from the conversation.', 'For technical goods, the specification is the marketing. Clarity about what you do not offer earns more trust than any claim about what you do.', 'Product Website', '2025', 'Heritage Builds', 'United Kingdom', array['Next.js', 'Tailwind CSS', 'Product Catalogue', 'SEO']::text[], null, array[]::text[], 'https://www.heritagebuild360.com/', 'landscape', 9, false, true),
  ('7f1c0a10-0000-4000-8000-000000000010', 'Mitalgic', 'mitalgic', 'Designing success — an international engineering consultancy delivering turnkey projects, maintenance and industrial services since 2015.', 'Mitalgic sells capability to procurement teams and project owners. The site presents the consultancy, the service lines, the sector record and a single route into a conversation.', 'Engineering firms with a long private record usually present as a list of services and a phone number. Nothing on the page answers the buyer''s real question: have you delivered something like mine, and can you still be reached in eighteen months?', 'Structure by mandate — turnkey delivery, maintenance, asset and field services — then sector by sector evidence, with dates and geography, so a reader maps their own project onto the record without hunting for it.', 'Industrial precision: steel blue and graphite, sharp geometry, wide margins, and typography set like a technical document rather than a startup page.', 'Static multi-page build with a capability register, project case entries, a qualifications section and a quote request flow that captures scope, sector and location.', 'A corporate presence that matches the actual depth of the firm, with enquiries arriving scoped instead of generic.', 'Eleven years of delivery does not need a tagline. It needs a table of contents.', 'Corporate Website', '2025', 'Mitalgic', 'International', array['React', 'Tailwind CSS', 'SEO', 'Forms']::text[], null, array[]::text[], 'https://www.mitalgic.com/', 'landscape', 10, false, true),
  ('7f1c0a10-0000-4000-8000-000000000011', 'Ariseslg', 'ariseslg', 'Empowering business with data-driven insights — analytics, reporting and decision support for growing teams.', 'Ariseslg is a data consultancy. Its website has to demonstrate the discipline it sells: clean structure, measurable claims and reporting that a non-analyst can read.', 'Analytics services are typically pitched in abstraction — dashboards, pipelines, KPIs — which means a business owner cannot tell what they would actually receive or decide with it.', 'Lead with the decision, not the dataset. Each engagement type is framed as a question a manager is stuck on, followed by the method, the deliverable and the cadence of the reporting.', 'Data-native but uncluttered: light surfaces, one strong accent, chart fragments as illustration and generously spaced type so numbers stay readable.', 'React site with embeddable chart components, a services matrix, sample report previews and an enquiry flow that routes by use case.', 'Conversations start at scope and timeline rather than at ''what is analytics'', which is the whole point of the page.', 'The proof of a data practice is a data-shaped website. If the page itself is vague, no deck will fix it.', 'Data & Analytics', '2025', 'Ariseslg', 'Nigeria', array['React', 'Chart Components', 'Tailwind CSS', 'SEO']::text[], null, array[]::text[], 'https://www.ariseslg.org/', 'landscape', 11, false, true),
  ('7f1c0a10-0000-4000-8000-000000000012', 'Afioos Global Services', 'afioos-global-services', 'A multi-service global firm — sourcing, logistics, support and business services — presented with one clear voice.', 'Afioos operates across several service lines and geographies. The site gives each line its own entry point while keeping a single, credible company story behind them.', 'Diversified service companies drift into either a wall of text or a set of disconnected pages. Customers could not tell which service they needed, and partners could not tell what the company actually was.', 'A service index that behaves like a directory: each offering summarised in one sentence, with its own detail page, process and contact route. The about layer carries the corporate substance the directory needs.', 'Global and grounded: deep navy, warm neutral support, structured grids and real service photography in place of the handshake stock that this sector leans on.', 'Page-based build generated from a service registry, breadcrumbs, per-service enquiry forms and FAQ structured data for each line.', 'Every service line became individually findable, and the company reads as one organisation instead of several brochures.', 'Breadth only looks like strength when it is indexed. Otherwise it just looks like confusion.', 'Corporate Website', '2025', 'Afioos Global Services', 'Nigeria / Canada', array['Next.js', 'Tailwind CSS', 'Structured Data', 'Forms']::text[], null, array[]::text[], 'https://www.afioosglobalservices.com/', 'portrait', 12, false, true),
  ('7f1c0a10-0000-4000-8000-000000000013', 'Naejay Services', 'naejay-services', 'Cleaning, staffing and property support services under one roof, with a separate clear path into each.', 'Naejay is a services company whose difficulty is variety: several audiences — facilities managers, households, employers — all landing on the same homepage and each needing a different next step.', 'A single contact form at the end of a mixed services page produces unqualified enquiries and slow follow-up. The site had to route people before it asked them for anything.', 'Service-first navigation with dedicated landing pages per offering, each carrying its own scope, coverage area, proof and enquiry form. Shared trust elements repeat across pages so the brand stays one piece.', 'Clean and dependable — bright whitespace, a single confident accent, iconography that labels rather than decorates, and imagery of actual crews at work.', 'Generated from a service model with per-page SEO metadata, quote forms that tag the enquiry by service and urgency, and fast static delivery.', 'Enquiries arrive labelled, so the first reply can already contain a price range and a date.', 'Routing beats persuasion. Most of the lift came from asking one good question early instead of writing better copy.', 'Services Website', '2025', 'Naejay Services', 'Canada', array['React', 'Tailwind CSS', 'Forms', 'SEO']::text[], null, array[]::text[], 'https://www.naejayservices.com/', 'landscape', 13, false, true),
  ('7f1c0a10-0000-4000-8000-000000000014', 'Dezeclean Services', 'dezeclean-services', 'A cleaning business site that turns a search for ''cleaners near me'' into a booked, sized-up job.', 'Dezeclean needed to be found locally, understood instantly and hired without a phone call being the only option. The site handles all three in one short scroll.', 'Local service sites tend to be a logo, a slider and a phone number in small print — none of which answers ''will you do my kind of job, and what will it cost''.', 'Service grid up front (residential, move-out, office, recurring), each with what is included and what it is not, then a pricing estimator and a request-a-visit form that captures property size and condition.', 'Bright and tidy by necessity: white and pale blue, high contrast, large tap targets and a layout that stays perfectly legible on a phone in a hallway.', 'Lightweight static build with a client-side estimator, LocalBusiness structured data, and enquiry routing into the owner''s existing inbox and WhatsApp.', 'Booked visits with the property details already supplied, plus a page that actually ranks for the area it serves.', 'Local SEO is mostly honesty: real service names, real coverage, real prices — the things most competitor pages leave out.', 'Services Website', '2025', 'Dezeclean Services', 'Canada', array['Astro', 'Tailwind CSS', 'Local SEO', 'Estimator']::text[], null, array[]::text[], 'https://www.dezecleaningservices.com/', 'landscape', 14, false, true),
  ('7f1c0a10-0000-4000-8000-000000000015', 'Neatify Cleaning', 'neatify-cleaning', 'Recurring home cleaning, booked by plan — weekly, fortnightly or monthly — with a straightforward quote path.', 'Neatify sells continuity rather than one-off visits. The site is organised around plans and frequency, so the subscription decision is the default one.', 'Cleaning companies quote per visit and lose the customer to whoever was cheapest that day. To build a recurring book, the website had to make frequency feel like the obvious way to buy.', 'Plan cards first, one-off visits second. Each plan states the cadence, what a session covers, and how to pause or change it, so the commitment reads as flexible rather than binding.', 'Crisp and domestic: soft neutrals, rounded detail treatments, photography of lived-in rooms rather than show flats, and clear pricing shapes.', 'Quote builder that collects bedrooms, bathrooms and frequency into an instant range, with the result carried into the booking request and confirmation email.', 'More plan-shaped enquiries and fewer single-visit hagglers; the quote tool gives the owner a defensible starting number.', 'A pricing range you can defend on the phone is worth more than a ''contact us for a quote'' button.', 'Services Website', '2025', 'Neatify Cleaning Services', 'Canada', array['React', 'Tailwind CSS', 'Quote Builder', 'Email']::text[], null, array[]::text[], 'https://www.neatifycleaning.ca/', 'landscape', 15, false, true),
  ('7f1c0a10-0000-4000-8000-000000000016', 'YouClean Services', 'youclean-services', 'Residential and move-out cleaning in Canada, with a booking path short enough that people actually finish it.', 'YouClean''s site exists to convert a hurried homeowner into a scheduled clean. Every element on the page either builds trust or shortens the path to a booking date.', 'Quote forms with eleven fields lose most of the people who were ready to book. The business needed a first contact that costs the customer five seconds.', 'One question at a time: home type, size, service, date — then details if they want to give them. Trust is carried by named services, clear inclusions and reviews placed at the decision points, not in a sidebar.', 'Fresh and reassuring: white space, a single clean accent, soft geometry and generous tap targets, with a layout that stays composed on a one-handed phone.', 'Step-based booking form with client-side validation and instant summary, submissions delivered to the owner''s inbox with a calendar-ready subject line, and Core Web Vitals tuned for mobile search.', 'A booking flow that finishes instead of abandons, and repeatable move-out season peaks handled without phone tag.', 'Removing three fields did more for conversions than redesigning the homepage. Restraint is a feature.', 'Services Website', '2024', 'YouClean Services Ltd', 'Canada', array['React', 'Tailwind CSS', 'Booking Flow', 'Performance']::text[], null, array[]::text[], 'https://www.youcleanservicesltd.com/', 'landscape', 16, false, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  overview = excluded.overview,
  problem = excluded.problem,
  approach = excluded.approach,
  design_direction = excluded.design_direction,
  development = excluded.development,
  outcome = excluded.outcome,
  reflection = excluded.reflection,
  category = excluded.category,
  year = excluded.year,
  client = excluded.client,
  location = excluded.location,
  technologies = excluded.technologies,
  url = excluded.url,
  layout = excluded.layout,
  sort_order = excluded.sort_order,
  featured = excluded.featured,
  published = excluded.published,
  updated_at = now();
