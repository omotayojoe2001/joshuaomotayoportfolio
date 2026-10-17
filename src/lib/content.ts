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
export type ContactSubmission = Tables<"contact_submissions">;

/** Shown when the CMS is unreachable - the site never looks broken. */
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Joshua Omotayo",
  email: "playgen.ng@gmail.com",
  youtube_url: "https://www.youtube.com/@joshua-omotayo",
  linkedin_url: "https://www.linkedin.com/in/joshua-omotayo/",
  github_url: "",
  twitter_url: "",
  instagram_url: "",
  tiktok_url: "https://www.tiktok.com/@joshua.o.timilehin",
  location: "Lagos, Nigeria",
  availability_status: "Available for new projects",
  current_focus: "",
  updated_at: new Date().toISOString(),
};

const SEED_NOW: NowItem[] = [
  {
    id: "n1",
    label: "Building websites for clients",
    status: "BUILDING",
    sort_order: 1,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "n2",
    label: "Exploring AI systems",
    status: "EXPLORING",
    sort_order: 2,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "n3",
    label: "Building Arise SLG",
    status: "BUILDING",
    sort_order: 3,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "n4",
    label: "Building PlayGen",
    status: "BUILDING",
    sort_order: 4,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "n5",
    label: "Teaching technology",
    status: "TEACHING",
    sort_order: 5,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "n6",
    label: "Publishing ideas",
    status: "WRITING",
    sort_order: 6,
    published: true,
    created_at: "",
    updated_at: "",
  },
];

/**
 * Teach / Watch lesson catalogue. The CMS (`youtube_videos`) is authoritative;
 * this is the floor so the surface is never an empty box. Newest lesson first,
 * matching the `created_at desc` order used by useVideos().
 */
const SEED_VIDEOS: Video[] = [
  {
    id: "v-server-setup",
    title: "Setting Up Your Server",
    video_url: "https://www.youtube.com/watch?v=-de8urY2C1w",
    thumbnail: "https://i.ytimg.com/vi/-de8urY2C1w/hqdefault.jpg",
    description:
      "From a blank hosting account to a live server: what a server actually does, how to choose one and how to get your first site answering on a domain.",
    featured: true,
    published: true,
    created_at: "2026-09-18T09:00:00.000Z",
    updated_at: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "v-wp-dashboard",
    title: "Navigating the Wordpress Dashboard",
    video_url: "https://www.youtube.com/watch?v=emn79cIG3VI",
    thumbnail: "https://i.ytimg.com/vi/emn79cIG3VI/hqdefault.jpg",
    description:
      "A guided tour of the Wordpress admin: the sidebar, posts versus pages, media, themes and plugins - and the four screens you actually need every day.",
    featured: false,
    published: true,
    created_at: "2026-09-04T09:00:00.000Z",
    updated_at: "2026-09-04T09:00:00.000Z",
  },
];

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
      const rows = (error ? [] : data) as Project[];
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
      if (error) return [];
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
      const rows = (error ? [] : data) as Video[];
      // Same rule as projects and now_items: the catalogue is the floor, so a
      // CMS that is empty or unreachable still shows real lessons.
      return rows.length === 0 ? SEED_VIDEOS : rows;
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
      if (error) return SEED_NOW;
      const rows = (data ?? []) as NowItem[];
      return rows.length === 0 ? SEED_NOW : rows;
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
      if (error) return DEFAULT_SETTINGS;
      return (data as SiteSettings | null) ?? DEFAULT_SETTINGS;
    },
  });
}
