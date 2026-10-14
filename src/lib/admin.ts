import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AdminAuth = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

/** Live Supabase auth session for the current browser. */
export function useAuth(): AdminAuth {
  const [state, setState] = useState<AdminAuth>({
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active)
          setState({ session: data.session, user: data.session?.user ?? null, loading: false });
      })
      .catch(() => active && setState({ session: null, user: null, loading: false }));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return;
      setState({ session, user: session?.user ?? null, loading: false });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/** Does the signed-in user hold the admin (or editor) role? Read via RLS-allowed own-role query. */
export function useIsAdmin(user: User | null): { isAdmin: boolean; loading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["admin", "editor"]);
        if (active) {
          setIsAdmin((data?.length ?? 0) > 0);
          setLoading(false);
        }
      } catch {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  return { isAdmin, loading };
}

export const signInWithPassword = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

/** Upload a file to the public `media` bucket and return its public URL. */
export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export function useUploadMedia() {
  return useMutation({ mutationFn: uploadMedia });
}

/**
 * Upload a contact-form document to the private `attachments` bucket.
 * Returns the storage path (not a public URL) - the admin panel opens it with
 * a short-lived signed link, so uploaded briefs are never world-readable.
 */
export async function uploadAttachment(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("attachments").upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}

/** Create a temporary download link for an attachment path (admin only). */
export async function getAttachmentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from("attachments").createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}
