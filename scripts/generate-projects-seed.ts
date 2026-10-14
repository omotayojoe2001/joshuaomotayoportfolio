// Generates drizzle/migrations/0001_projects_seed.sql from src/lib/data/projects.seed.ts
// Run with: npx tsx scripts/generate-projects-seed.ts
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { seedProjects } from "../src/lib/data/projects.seed";

const q = (value: string) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
const text = (value: string | null) => (value == null || value === "" ? "null" : q(value));

const rows = seedProjects.map(
  (p) =>
    "  (" +
    [
      q(p.id),
      q(p.title),
      q(p.slug),
      text(p.description),
      text(p.overview),
      text(p.problem),
      text(p.approach),
      text(p.design_direction),
      text(p.development),
      text(p.outcome),
      text(p.reflection),
      text(p.category),
      text(p.year),
      text(p.client),
      text(p.location),
      `array[${p.technologies.map(q).join(", ")}]::text[]`,
      text(p.featured_image),
      `array[]::text[]`,
      text(p.url),
      q(p.layout),
      String(p.sort_order),
      p.featured ? "true" : "false",
      p.published ? "true" : "false",
    ].join(", ") +
    ")",
);

const sql = `-- projects seed - generated from src/lib/data/projects.seed.ts
-- do not edit by hand; regenerate with: npx tsx scripts/generate-projects-seed.ts

insert into public.projects (
  id, title, slug, description, overview, problem, approach, design_direction,
  development, outcome, reflection, category, year, client, location,
  technologies, featured_image, gallery, url, layout, sort_order, featured, published
) values
${rows.join(",\n")}
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
`;

const out = resolve(import.meta.dirname, "../drizzle/migrations/0001_projects_seed.sql");
writeFileSync(out, sql, "utf8");
console.log(`wrote ${seedProjects.length} projects -> ${out}`);
