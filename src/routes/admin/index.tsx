import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signOut, useAuth, useIsAdmin, uploadMedia, getAttachmentUrl } from "@/lib/admin";
import type {
  Article,
  BuildProduct,
  ContactSubmission,
  Project,
  SiteSettings,
  Video,
} from "@/lib/content";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin - Joshua Omotayo" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

type Draft = Omit<Project, "id" | "created_at" | "updated_at">;

const EMPTY: Draft = {
  title: "",
  slug: "",
  description: "",
  overview: "",
  problem: "",
  approach: "",
  design_direction: "",
  development: "",
  outcome: "",
  reflection: "",
  category: "Web",
  year: String(new Date().getFullYear()),
  client: "",
  location: "",
  technologies: [],
  featured_image: "",
  gallery: [],
  url: "",
  layout: "landscape",
  sort_order: 0,
  featured: false,
  published: true,
};

const input =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const label = "label-tech text-muted-foreground";

function toDraft(p: Project): Draft {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = p;
  return rest;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Field({
  label: l,
  value,
  onChange,
  type = "text",
  area,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  area?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={label}>{l.toUpperCase()}</span>
      {area ? (
        <textarea
          className={`${input} mt-1.5 min-h-24 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={`${input} mt-1.5`}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function ProjectsManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const list = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (draft: Draft) => {
      const payload = {
        ...draft,
        technologies: draft.technologies ?? [],
        gallery: draft.gallery ?? [],
      };
      if (isNew) {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").update(payload).eq("slug", draft.slug);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("projects").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const set = (patch: Partial<Draft>) => setEditing((d) => (d ? { ...d, ...patch } : d));

  async function onUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      set({ featured_image: url });
    } finally {
      setUploading(false);
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">{isNew ? "NEW PROJECT" : "EDIT PROJECT"}</h2>
          <button className="label-tech text-accent" onClick={() => setEditing(null)}>
            ← BACK
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Title"
              value={editing.title}
              onChange={(v) =>
                set({ title: v, slug: isNew || !editing.slug ? slugify(v) : editing.slug })
              }
            />
            <Field label="Slug" value={editing.slug} onChange={(v) => set({ slug: v })} />
          </div>

          <Field
            label="Description (card + intro)"
            value={editing.description ?? ""}
            area
            onChange={(v) => set({ description: v })}
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="Category"
              value={editing.category ?? ""}
              onChange={(v) => set({ category: v })}
            />
            <Field label="Year" value={editing.year ?? ""} onChange={(v) => set({ year: v })} />
            <Field
              label="Client"
              value={editing.client ?? ""}
              onChange={(v) => set({ client: v })}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Location"
              value={editing.location ?? ""}
              onChange={(v) => set({ location: v })}
            />
            <Field label="Live URL" value={editing.url ?? ""} onChange={(v) => set({ url: v })} />
          </div>

          <Field
            label="Technologies (comma separated)"
            value={(editing.technologies ?? []).join(", ")}
            onChange={(v) =>
              set({
                technologies: v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />

          <div>
            <span className={label}>FEATURED IMAGE</span>
            <div className="mt-1.5 flex gap-2">
              <input
                className={input}
                value={editing.featured_image ?? ""}
                placeholder="https://… or upload"
                onChange={(e) => set({ featured_image: e.target.value })}
              />
              <label className="shrink-0 border border-border px-3 py-2 label-tech cursor-pointer hover:border-accent hover:text-accent">
                {uploading ? "…" : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>
            {editing.featured_image && (
              <img
                src={editing.featured_image}
                alt=""
                className="mt-3 h-32 w-full border border-border object-cover"
              />
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className={label}>LAYOUT</span>
              <select
                className={`${input} mt-1.5`}
                value={editing.layout}
                onChange={(e) => set({ layout: e.target.value })}
              >
                {["landscape", "portrait", "split", "full"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Sort order"
              type="number"
              value={String(editing.sort_order)}
              onChange={(v) => set({ sort_order: Number(v) || 0 })}
            />
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editing.published}
                  onChange={(e) => set({ published: e.target.checked })}
                />
                <span className={label}>PUBLISHED</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) => set({ featured: e.target.checked })}
                />
                <span className={label}>FEATURED</span>
              </label>
            </div>
          </div>

          <Field
            label="Overview"
            value={editing.overview ?? ""}
            area
            onChange={(v) => set({ overview: v })}
          />
          <Field
            label="The Problem"
            value={editing.problem ?? ""}
            area
            onChange={(v) => set({ problem: v })}
          />
          <Field
            label="Approach"
            value={editing.approach ?? ""}
            area
            onChange={(v) => set({ approach: v })}
          />
          <Field
            label="Design Direction"
            value={editing.design_direction ?? ""}
            area
            onChange={(v) => set({ design_direction: v })}
          />
          <Field
            label="Development"
            value={editing.development ?? ""}
            area
            onChange={(v) => set({ development: v })}
          />
          <Field
            label="Outcome"
            value={editing.outcome ?? ""}
            area
            onChange={(v) => set({ outcome: v })}
          />
          <Field
            label="Reflection"
            value={editing.reflection ?? ""}
            area
            onChange={(v) => set({ reflection: v })}
          />

          <div className="flex items-center gap-3 pt-2">
            <button
              className="border border-accent px-5 py-2.5 label-tech text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              disabled={save.isPending || !editing.title || !editing.slug}
              onClick={() => save.mutate(editing)}
            >
              {save.isPending ? "SAVING…" : "SAVE PROJECT"}
            </button>
            <button
              className="label-tech text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(null)}
            >
              CANCEL
            </button>
            {save.isError && (
              <span className="text-sm text-red-400">
                Save failed - check you are signed in as admin.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">PROJECTS</h2>
        <button
          className="border border-accent px-4 py-2 label-tech text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            setIsNew(true);
            setEditing({ ...EMPTY });
          }}
        >
          + NEW PROJECT
        </button>
      </div>

      {list.isLoading && <p className="mt-6 label-tech text-muted-foreground">LOADING…</p>}
      {list.isError && (
        <p className="mt-6 text-sm text-red-400">
          Could not load projects. Make sure the site is connected to Supabase and you are an admin.
        </p>
      )}

      <ul className="mt-6 divide-y divide-border border border-border">
        {(list.data ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{p.title}</p>
              <p className="mt-1 truncate label-tech text-muted-foreground">
                {p.slug} · {p.category} · {p.year} · {p.published ? "PUBLISHED" : "DRAFT"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                className="label-tech text-accent hover:underline"
                onClick={() => {
                  setIsNew(false);
                  setEditing(toDraft(p));
                }}
              >
                EDIT
              </button>
              <button
                className="label-tech text-red-400 hover:underline"
                onClick={() => {
                  if (confirm(`Delete "${p.title}"? This cannot be undone.`)) remove.mutate(p.slug);
                }}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PDraft = Omit<BuildProduct, "id" | "created_at" | "updated_at">;

const EMPTY_PRODUCT: PDraft = {
  name: "",
  slug: "",
  url: "",
  position: "",
  description: "",
  cta: "",
  image: "",
  visual: "business",
  status: "LIVE",
  sort_order: 0,
  published: true,
};

function ProductsManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PDraft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const list = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as BuildProduct[];
    },
  });

  const save = useMutation({
    mutationFn: async (draft: PDraft) => {
      if (isNew) {
        const { error } = await supabase.from("products").insert(draft);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").update(draft).eq("slug", draft.slug);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("products").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const set = (patch: Partial<PDraft>) => setEditing((d) => (d ? { ...d, ...patch } : d));

  async function onUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      set({ image: await uploadMedia(file) });
    } finally {
      setUploading(false);
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">{isNew ? "NEW PRODUCT" : "EDIT PRODUCT"}</h2>
          <button className="label-tech text-accent" onClick={() => setEditing(null)}>
            ← BACK
          </button>
        </div>
        <div className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              value={editing.name}
              onChange={(v) =>
                set({ name: v, slug: isNew || !editing.slug ? slugify(v) : editing.slug })
              }
            />
            <Field label="Slug" value={editing.slug} onChange={(v) => set({ slug: v })} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live URL" value={editing.url ?? ""} onChange={(v) => set({ url: v })} />
            <Field
              label="Position / tagline"
              value={editing.position ?? ""}
              onChange={(v) => set({ position: v })}
            />
          </div>
          <Field
            label="Description"
            value={editing.description ?? ""}
            area
            onChange={(v) => set({ description: v })}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="CTA text" value={editing.cta ?? ""} onChange={(v) => set({ cta: v })} />
            <Field
              label="Status (LIVE / IN PROGRESS / COMING SOON)"
              value={editing.status ?? ""}
              onChange={(v) => set({ status: v })}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className={label}>VISUAL STYLE</span>
              <select
                className={`${input} mt-1.5`}
                value={editing.visual ?? "business"}
                onChange={(e) => set({ visual: e.target.value })}
              >
                {["business", "assistant", "impact"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Sort order"
              type="number"
              value={String(editing.sort_order)}
              onChange={(v) => set({ sort_order: Number(v) || 0 })}
            />
            <label className="flex items-center gap-2 self-end pb-1">
              <input
                type="checkbox"
                checked={!!editing.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
              <span className={label}>PUBLISHED</span>
            </label>
          </div>
          <div>
            <span className={label}>IMAGE / SCREENSHOT</span>
            <div className="mt-1.5 flex gap-2">
              <input
                className={input}
                value={editing.image ?? ""}
                placeholder="https://… or upload"
                onChange={(e) => set({ image: e.target.value })}
              />
              <label className="shrink-0 border border-border px-3 py-2 label-tech cursor-pointer hover:border-accent hover:text-accent">
                {uploading ? "…" : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>
            {editing.image && (
              <img
                src={editing.image}
                alt=""
                className="mt-3 h-32 w-full border border-border object-cover"
              />
            )}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="border border-accent px-5 py-2.5 label-tech text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              disabled={save.isPending || !editing.name || !editing.slug}
              onClick={() => save.mutate(editing)}
            >
              {save.isPending ? "SAVING…" : "SAVE PRODUCT"}
            </button>
            <button
              className="label-tech text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(null)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">PRODUCTS - /build</h2>
        <button
          className="border border-accent px-4 py-2 label-tech text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            setIsNew(true);
            setEditing({ ...EMPTY_PRODUCT });
          }}
        >
          + NEW PRODUCT
        </button>
      </div>

      {list.isLoading && <p className="mt-6 label-tech text-muted-foreground">LOADING…</p>}
      {list.isError && (
        <p className="mt-6 text-sm text-red-400">
          Could not load products. Run <code className="text-accent">supabase-products.sql</code> in
          the SQL editor first.
        </p>
      )}

      <ul className="mt-6 divide-y divide-border border border-border">
        {(list.data ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{p.name}</p>
              <p className="mt-1 truncate label-tech text-muted-foreground">
                {p.slug} · {p.status} · {p.published ? "PUBLISHED" : "HIDDEN"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                className="label-tech text-accent hover:underline"
                onClick={() => {
                  setIsNew(false);
                  const { id: _id, created_at: _c, updated_at: _u, ...rest } = p;
                  setEditing(rest);
                }}
              >
                EDIT
              </button>
              <button
                className="label-tech text-red-400 hover:underline"
                onClick={() => {
                  if (confirm(`Delete "${p.name}"?`)) remove.mutate(p.slug);
                }}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ADraft = Omit<Article, "id" | "created_at" | "updated_at">;

const EMPTY_ARTICLE: ADraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "Technology",
  kind: "article",
  tags: [],
  reading_time: 3,
  featured: false,
  published: false,
  published_at: null,
  video_url: "",
};

function ArticlesManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ADraft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const list = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
  });

  const save = useMutation({
    mutationFn: async (draft: ADraft) => {
      const payload = { ...draft, published_at: draft.published_at || new Date().toISOString() };
      if (isNew) {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").update(payload).eq("slug", draft.slug);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("articles").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const set = (patch: Partial<ADraft>) => setEditing((d) => (d ? { ...d, ...patch } : d));

  async function onUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      set({ cover_image: await uploadMedia(file) });
    } finally {
      setUploading(false);
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">{isNew ? "NEW POST" : "EDIT POST"}</h2>
          <button className="label-tech text-accent" onClick={() => setEditing(null)}>
            ← BACK
          </button>
        </div>
        <div className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Title"
              value={editing.title}
              onChange={(v) =>
                set({ title: v, slug: isNew || !editing.slug ? slugify(v) : editing.slug })
              }
            />
            <Field label="Slug" value={editing.slug} onChange={(v) => set({ slug: v })} />
          </div>
          <Field
            label="Excerpt"
            area
            value={editing.excerpt ?? ""}
            onChange={(v) => set({ excerpt: v })}
          />
          <Field
            label="Content"
            area
            value={editing.content ?? ""}
            placeholder="Write the full article here…"
            onChange={(v) => set({ content: v })}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="Category"
              value={editing.category ?? ""}
              onChange={(v) => set({ category: v })}
            />
            <label className="block">
              <span className={label}>TYPE</span>
              <select
                className={`${input} mt-1.5`}
                value={editing.kind}
                onChange={(e) => set({ kind: e.target.value })}
              >
                {["article", "video", "both"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Reading time (min)"
              type="number"
              value={String(editing.reading_time)}
              onChange={(v) => set({ reading_time: Number(v) || 1 })}
            />
          </div>
          <Field
            label="YouTube link (video with the article)"
            value={editing.video_url ?? ""}
            placeholder="https://youtube.com/watch?v=…"
            onChange={(v) => set({ video_url: v })}
          />
          <Field
            label="Tags (comma separated)"
            value={editing.tags.join(", ")}
            onChange={(v) =>
              set({
                tags: v
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          />
          <div>
            <span className={label}>COVER IMAGE</span>
            <div className="mt-1.5 flex gap-2">
              <input
                className={input}
                value={editing.cover_image ?? ""}
                placeholder="https://… or upload"
                onChange={(e) => set({ cover_image: e.target.value })}
              />
              <label className="shrink-0 border border-border px-3 py-2 label-tech cursor-pointer hover:border-accent hover:text-accent">
                {uploading ? "…" : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>
            {editing.cover_image && (
              <img
                src={editing.cover_image}
                alt=""
                className="mt-3 h-32 w-full border border-border object-cover"
              />
            )}
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!editing.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
              <span className={label}>PUBLISHED</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) => set({ featured: e.target.checked })}
              />
              <span className={label}>FEATURED</span>
            </label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="border border-accent px-5 py-2.5 label-tech text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              disabled={save.isPending || !editing.title || !editing.slug}
              onClick={() => save.mutate(editing)}
            >
              {save.isPending ? "SAVING…" : "SAVE POST"}
            </button>
            <button
              className="label-tech text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(null)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">BLOG - /think</h2>
        <button
          className="border border-accent px-4 py-2 label-tech text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            setIsNew(true);
            setEditing({ ...EMPTY_ARTICLE });
          }}
        >
          + NEW POST
        </button>
      </div>

      {list.isLoading && <p className="mt-6 label-tech text-muted-foreground">LOADING…</p>}
      {list.isError && (
        <p className="mt-6 text-sm text-red-400">
          Could not load posts. Make sure the site is connected to Supabase.
        </p>
      )}

      <ul className="mt-6 divide-y divide-border border border-border">
        {(list.data ?? []).map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{a.title}</p>
              <p className="mt-1 truncate label-tech text-muted-foreground">
                {a.kind} · {a.published ? "PUBLISHED" : "DRAFT"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                className="label-tech text-accent hover:underline"
                onClick={() => {
                  setIsNew(false);
                  const { id: _id, created_at: _c, updated_at: _u, ...rest } = a;
                  setEditing(rest);
                }}
              >
                EDIT
              </button>
              <button
                className="label-tech text-red-400 hover:underline"
                onClick={() => {
                  if (confirm(`Delete "${a.title}"?`)) remove.mutate(a.slug);
                }}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type VDraft = Omit<Video, "id" | "created_at" | "updated_at">;

const EMPTY_VIDEO: VDraft = {
  title: "",
  video_url: "",
  thumbnail: "",
  description: "",
  featured: false,
  published: true,
};

function VideosManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<VDraft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [source, setSource] = useState<"youtube" | "upload">("youtube");
  const [uploading, setUploading] = useState(false);

  const list = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_videos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Video[];
    },
  });

  const save = useMutation({
    mutationFn: async (draft: VDraft) => {
      if (isNew) {
        const { error } = await supabase.from("youtube_videos").insert(draft);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("youtube_videos")
          .update(draft)
          .eq("id", editId ?? "");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("youtube_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const [editId, setEditId] = useState<string | null>(null);
  const set = (patch: Partial<VDraft>) => setEditing((d) => (d ? { ...d, ...patch } : d));

  async function onUploadVideo(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      set({ video_url: await uploadMedia(file) });
    } finally {
      setUploading(false);
    }
  }
  async function onUploadThumb(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      set({ thumbnail: await uploadMedia(file) });
    } finally {
      setUploading(false);
    }
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">{isNew ? "NEW VIDEO" : "EDIT VIDEO"}</h2>
          <button className="label-tech text-accent" onClick={() => setEditing(null)}>
            ← BACK
          </button>
        </div>
        <div className="mt-6 space-y-5">
          <Field label="Title" value={editing.title} onChange={(v) => set({ title: v })} />
          <div>
            <span className={label}>SOURCE</span>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={source === "youtube"}
                  onChange={() => setSource("youtube")}
                />
                <span className={label}>YOUTUBE LINK</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={source === "upload"}
                  onChange={() => setSource("upload")}
                />
                <span className={label}>UPLOAD FROM COMPUTER</span>
              </label>
            </div>
          </div>
          {source === "youtube" ? (
            <Field
              label="YouTube URL"
              value={editing.video_url}
              placeholder="https://youtube.com/watch?v=…"
              onChange={(v) => set({ video_url: v })}
            />
          ) : (
            <div className="flex gap-2">
              <input
                className={input}
                value={editing.video_url}
                placeholder="Uploaded file URL, or paste a link"
                onChange={(e) => set({ video_url: e.target.value })}
              />
              <label className="shrink-0 border border-border px-3 py-2 label-tech cursor-pointer hover:border-accent hover:text-accent">
                {uploading ? "…" : "UPLOAD VIDEO"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => onUploadVideo(e.target.files?.[0])}
                />
              </label>
            </div>
          )}
          <Field
            label="Description"
            area
            value={editing.description ?? ""}
            onChange={(v) => set({ description: v })}
          />
          <div>
            <span className={label}>THUMBNAIL</span>
            <div className="mt-1.5 flex gap-2">
              <input
                className={input}
                value={editing.thumbnail ?? ""}
                placeholder="https://… or upload"
                onChange={(e) => set({ thumbnail: e.target.value })}
              />
              <label className="shrink-0 border border-border px-3 py-2 label-tech cursor-pointer hover:border-accent hover:text-accent">
                {uploading ? "…" : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUploadThumb(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!editing.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
              <span className={label}>PUBLISHED</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) => set({ featured: e.target.checked })}
              />
              <span className={label}>FEATURED</span>
            </label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="border border-accent px-5 py-2.5 label-tech text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              disabled={save.isPending || !editing.title || !editing.video_url}
              onClick={() => save.mutate(editing)}
            >
              {save.isPending ? "SAVING…" : "SAVE VIDEO"}
            </button>
            <button
              className="label-tech text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(null)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">BUILDING IN PUBLIC - VIDEOS</h2>
        <button
          className="border border-accent px-4 py-2 label-tech text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            setIsNew(true);
            setSource("youtube");
            setEditId(null);
            setEditing({ ...EMPTY_VIDEO });
          }}
        >
          + NEW VIDEO
        </button>
      </div>

      {list.isLoading && <p className="mt-6 label-tech text-muted-foreground">LOADING…</p>}
      {list.isError && (
        <p className="mt-6 text-sm text-red-400">
          Could not load videos. Make sure the site is connected to Supabase.
        </p>
      )}

      <ul className="mt-6 divide-y divide-border border border-border">
        {(list.data ?? []).map((v) => (
          <li key={v.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{v.title}</p>
              <p className="mt-1 truncate label-tech text-muted-foreground">{v.video_url}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                className="label-tech text-accent hover:underline"
                onClick={() => {
                  setIsNew(false);
                  setEditId(v.id);
                  setSource(/youtube\.com|youtu\.be/i.test(v.video_url) ? "youtube" : "upload");
                  const { id: _id, created_at: _c, updated_at: _u, ...rest } = v;
                  setEditing(rest);
                }}
              >
                EDIT
              </button>
              <button
                className="label-tech text-red-400 hover:underline"
                onClick={() => {
                  if (confirm(`Delete "${v.title}"?`)) remove.mutate(v.id);
                }}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [msg, setMsg] = useState("");

  const load = useQuery({
    queryKey: ["admin-settings"],
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

  useEffect(() => {
    if (load.data && !form) setForm(load.data);
  }, [load.data, form]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const { id: _id, updated_at: _u, ...fields } = form;
      const { error } = await supabase.from("site_settings").update(fields).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      setMsg("SAVED");
      setTimeout(() => setMsg(""), 2500);
    },
  });

  const set = (patch: Partial<SiteSettings>) => setForm((f) => (f ? { ...f, ...patch } : f));
  const field = (key: keyof SiteSettings, l: string, area?: boolean) => (
    <Field
      label={l}
      {...(area ? { area } : {})}
      value={String(form?.[key] ?? "")}
      onChange={(v) => set({ [key]: v } as Partial<SiteSettings>)}
    />
  );

  if (load.isLoading && !form) return <p className="label-tech text-muted-foreground">LOADING…</p>;
  if (!form)
    return (
      <p className="text-sm text-red-400">
        Could not load settings. Run <code className="text-accent">supabase-blog-settings.sql</code>{" "}
        in the SQL editor.
      </p>
    );

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="display text-2xl">SITE SETTINGS</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Details shown across the site - contact email, location and social links.
      </p>
      <div className="mt-6 space-y-5">
        {field("site_name", "Site name")}
        <div className="grid gap-5 sm:grid-cols-2">
          {field("email", "Direct email")}
          {field("location", "Location")}
        </div>
        {field("youtube_url", "YouTube channel URL")}
        <div className="grid gap-5 sm:grid-cols-2">
          {field("linkedin_url", "LinkedIn URL")}
          {field("tiktok_url", "TikTok URL")}
          {field("github_url", "GitHub URL")}
          {field("twitter_url", "Twitter / X URL")}
          {field("instagram_url", "Instagram URL")}
        </div>
        {field("availability_status", "Availability status")}
        {field("current_focus", "Current focus", true)}
        <div className="flex items-center gap-3 pt-2">
          <button
            className="border border-accent px-5 py-2.5 label-tech text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            disabled={save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? "SAVING…" : "SAVE SETTINGS"}
          </button>
          {msg && <span className="label-tech text-accent">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

type AdminTab = "projects" | "products" | "blog" | "videos" | "settings" | "inquiries";

function InquiriesManager() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  async function openDoc(path: string) {
    setBusyId(path);
    try {
      const url = await getAttachmentUrl(path);
      window.open(url, "_blank", "noopener");
    } finally {
      setBusyId(null);
    }
  }

  const fileName = (path: string) => path.split("/").pop() ?? path;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">INQUIRIES - /contact</h2>
        <button className="label-tech text-accent hover:underline" onClick={() => list.refetch()}>
          REFRESH
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Every message from the contact form lands here. Reply straight to the sender's email.
      </p>

      {list.isLoading && <p className="mt-6 label-tech text-muted-foreground">LOADING…</p>}
      {list.isError && (
        <p className="mt-6 text-sm text-red-400">
          Could not load inquiries. Run{" "}
          <code className="text-accent">supabase-contact-attachments.sql</code> and make sure you
          are signed in as admin.
        </p>
      )}
      {!list.isLoading && (list.data ?? []).length === 0 && (
        <p className="mt-6 label-tech text-muted-foreground">NO INQUIRIES YET.</p>
      )}

      <ul className="mt-6 space-y-4">
        {(list.data ?? []).map((s) => (
          <li key={s.id} className="border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{s.name}</span>
                  {s.company ? <span className="text-muted-foreground"> · {s.company}</span> : null}
                </p>
                <a href={`mailto:${s.email}`} className="label-tech text-accent hover:underline">
                  {s.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="label-tech text-muted-foreground">
                  {new Date(s.created_at).toLocaleString()}
                </span>
                <button
                  className="label-tech text-red-400 hover:underline"
                  onClick={() => {
                    if (confirm("Delete this inquiry?")) remove.mutate(s.id);
                  }}
                >
                  DELETE
                </button>
              </div>
            </div>

            {(s.project_type || s.budget) && (
              <p className="mt-3 label-tech text-muted-foreground">
                {s.project_type ? `TYPE: ${s.project_type}` : ""}
                {s.project_type && s.budget ? " · " : ""}
                {s.budget ? `BUDGET: ${s.budget}` : ""}
              </p>
            )}

            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{s.message}</p>

            {s.attachment && (
              <button
                className="mt-4 inline-flex items-center gap-2 border border-border px-3 py-1.5 label-tech text-accent hover:border-accent disabled:opacity-50"
                disabled={busyId === s.attachment}
                onClick={() => openDoc(s.attachment ?? "")}
              >
                {busyId === s.attachment ? "OPENING…" : "VIEW DOC"}
                <span className="max-w-40 truncate text-muted-foreground">
                  {fileName(s.attachment)}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminContent() {
  const [tab, setTab] = useState<AdminTab>("projects");
  const tabBtn = (active: boolean) =>
    `px-4 py-2 label-tech transition-colors ${
      active
        ? "border-b-2 border-accent text-accent"
        : "text-muted-foreground hover:text-foreground"
    }`;
  const tabs: { id: AdminTab; label: string }[] = [
    { id: "projects", label: "PROJECTS" },
    { id: "products", label: "PRODUCTS" },
    { id: "blog", label: "BLOG / THINK" },
    { id: "videos", label: "VIDEOS" },
    { id: "settings", label: "SETTINGS" },
    { id: "inquiries", label: "INQUIRIES" },
  ];
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} className={tabBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "projects" && <ProjectsManager />}
      {tab === "products" && <ProductsManager />}
      {tab === "blog" && <ArticlesManager />}
      {tab === "videos" && <VideosManager />}
      {tab === "settings" && <SettingsManager />}
      {tab === "inquiries" && <InquiriesManager />}
    </div>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const { user, session, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin(user);

  useEffect(() => {
    if (!loading && !session) void router.navigate({ to: "/admin/login" });
  }, [loading, session, router]);

  const body = useMemo(() => {
    if (loading || roleLoading) return <p className="label-tech text-muted-foreground">LOADING…</p>;
    if (!session) return null;
    if (!isAdmin)
      return (
        <div className="border border-border p-8">
          <p className="display text-2xl">NOT AN ADMIN</p>
          <p className="mt-3 text-sm text-muted-foreground">
            This account ({user?.email}) is signed in but does not have the admin role. Run{" "}
            <code className="text-accent">supabase-admin.sql</code> in the Supabase SQL editor, then
            sign out and back in.
          </p>
        </div>
      );
    return <AdminContent />;
  }, [loading, roleLoading, session, isAdmin, user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="display text-lg">
            PORTFOLIO <span className="text-accent">ADMIN</span>
          </p>
          <div className="flex items-center gap-5 label-tech">
            <a href="/" className="text-muted-foreground hover:text-foreground">
              VIEW SITE
            </a>
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <button
              className="text-accent hover:underline"
              onClick={() => void signOut().then(() => router.navigate({ to: "/admin/login" }))}
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{body}</main>
    </div>
  );
}
