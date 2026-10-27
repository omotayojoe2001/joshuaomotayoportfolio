-- ============================================================
-- Buffson Fitness App case study (interactive Figma prototype)
-- Run in Supabase Dashboard > SQL Editor. Idempotent (safe to re-run).
-- Adds the row to the projects table so /work and /work/buffson-fitness-app
-- find it even when the CMS is the authoritative source.
-- ============================================================

insert into public.projects (
  id, title, slug, description, overview, problem, approach, design_direction,
  development, outcome, reflection, category, year, client, location,
  technologies, featured_image, gallery, url, layout, sort_order, featured, published
) values (
  '7f1c0a10-0000-4000-8000-000000000001',
  'Buffson Fitness App',
  'buffson-fitness-app',
  'A fitness app designed end to end in Figma - onboarding, plan, live set logging, streaks and progress. Interactive prototype, tap it here.',
  'Buffson is a self-initiated product design exploration: a training companion for people who lift three to five times a week and want the app to keep the log, not the other way around. The full flow lives in Figma as a working prototype, playable inside this portfolio.',
  'Most fitness apps treat logging as a tax you pay between sets. The design brief was to make the log feel like part of the set - fast to enter, hard to lose, and readable at a glance with sweaty hands and small phone screens.',
  'I mapped the app to five flows: onboarding with realistic goal setting, the plan view, the live session, the recovery and streak view, and the progress archive. Each flow was designed mobile-first, thumb-reachable and legible in a gym. Everything is a component in a small system so screens stay consistent as they grow.',
  'Dark surface for gym glare, one energetic accent for state, and huge numerals for reps and weight because that is what a lifter actually reads between sets. Type is tight, spacing is generous, and the interface never asks you to look twice for the number that matters.',
  'Built entirely in Figma with auto layout, variants, component properties and interactive components. Prototype uses variables and conditional logic for streak, rest timer state and personal bests so a reviewer can tap through a full week without any static frames.',
  'A tapable, shareable, always-current prototype. It opens directly on this page for anyone reviewing the work, and stays editable so the design can keep moving after it ships.',
  'The strongest design deliverable is not a screenshot, it is something a reviewer can hold and step through. Embedding the live prototype changed how the work reads and cut the explanation short.',
  'Product Design',
  '2026',
  'Self-initiated',
  'Lagos, Nigeria',
  array['Figma', 'Prototyping', 'Design System', 'Mobile UI']::text[],
  null,
  array[]::text[],
  'https://www.figma.com/proto/mGsh7uvwl7Y1wooI0sg68L/Buffson-Fitness-App-Updated',
  'portrait',
  1,
  true,
  true
)
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

-- Push Buffson to the top of the /work grid (in case older rows had sort_order 1).
update public.projects set sort_order = sort_order + 1 where slug <> 'buffson-fitness-app' and sort_order < 1;
