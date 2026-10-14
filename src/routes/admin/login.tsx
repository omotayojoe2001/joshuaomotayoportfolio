import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { signInWithPassword, useAuth } from "@/lib/admin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Sign In - Joshua Omotayo" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

const field =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none";

function AdminLoginPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);

  if (session) {
    // Already signed in - skip the form.
    void router.navigate({ to: "/admin" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    const { error: err } = await signInWithPassword(email.trim(), password);
    if (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Email or password is incorrect."
          : err.message,
      );
      setStatus("idle");
      return;
    }
    await router.navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <p className="display text-3xl">
          ADMIN<span className="text-accent">.</span>
        </p>
        <p className="mt-2 label-tech text-muted-foreground">JOSHUA OMOTAYO PORTFOLIO CMS</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="label-tech">EMAIL</span>
            <input
              className={`${field} mt-2`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="label-tech">PASSWORD</span>
            <input
              className={`${field} mt-2`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full border border-accent px-4 py-3 label-tech text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {status === "sending" ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="label-tech link-underline text-muted-foreground">
            ← BACK TO SITE
          </a>
        </p>
      </div>
    </div>
  );
}
