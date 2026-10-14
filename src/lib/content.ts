import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { seedProjects, seedProjectsBySlug } from "@/lib/data/projects.seed";

export type Project = Tables<"projects">;
export type Article = Tables<"articles">;
export type Experiment = Tables<"experiments">;
export type Testimonial = Tables<"testimonials">;
export type Video = Tables<"youtube_videos">;
export type NowItem = Tables<"now_items">;
export type SiteSettings = Tables<"site_settings">;
export type BuildProduct = Tables<"products">;

export function useBuildProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as BuildProduct[];
    },
  });
}

export function useProjects(limit?: number) {
  return useQuery({
    queryKey: ["projects", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      const rows = data as Project[];
      // The in-repo catalogue is the fallback: it renders whenever the CMS is
      // empty or unreachable, so the portfolio is never a blank page.
      if (rows.length === 0) {
        return limit ? seedProjects.slice(0, limit) : seedProjects;
      }
      return rows;
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) return seedProjectsBySlug[slug] ?? null;
      return (data as Project | null) ?? seedProjectsBySlug[slug] ?? null;
    },
  });
}

/** Non-hook lookup used by route loaders. Never throws, always returns a project if the slug exists in the catalogue. */
export async function loadProject(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) return seedProjectsBySlug[slug] ?? null;
    return (data as Project | null) ?? seedProjectsBySlug[slug] ?? null;
  } catch {
    return seedProjectsBySlug[slug] ?? null;
  }
}

/** Published projects in grid order, database first, catalogue as fallback. */
export async function loadProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data ?? []) as Project[];
    return rows.length > 0 ? rows : seedProjects;
  } catch {
    return seedProjects;
  }
}

export function useArticles(opts?: { kind?: string; limit?: number }) {
  return useQuery({
    queryKey: ["articles", opts?.kind ?? "all", opts?.limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (opts?.kind) q = q.eq("kind", opts.kind);
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as Article | null;
    },
  });
}

export function useExperiments() {
  return useQuery({
    queryKey: ["experiments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiments")
        .select("*")
        .eq("published", true)
        .order("code", { ascending: true });
      if (error) throw error;
      return data as Experiment[];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Video[];
    },
  });
}

export function useNowItems() {
  return useQuery({
    queryKey: ["now_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("now_items")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as NowItem[];
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
  });
}
