import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { PageHeader, Section } from "@/components/site-sections";
import { Reveal } from "@/components/motion-primitives";
import { supabase } from "@/integrations/supabase/client";
import { uploadAttachment } from "@/lib/admin";
import { useSettings } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Let's Build It · Joshua Omotayo" },
      {
        name: "description",
        content:
          "Have a website, AI idea, digital product or technology problem you want to solve? Start a conversation with Joshua Omotayo.",
      },
      { property: "og:title", content: "Contact - Let's Build It · Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "AI Integration",
  "Digital Product",
  "Collaboration",
  "Speaking / Teaching",
  "Other",
];

const BUDGETS = ["< $1k", "$1k - $5k", "$5k - $15k", "$15k +", "Not sure yet"];

const field =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 label-tech transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function ContactPage() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [projectType, setProjectType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please add your name, email and a short message.");
      return;
    }
    setStatus("sending");
    try {
      let attachment = "";
      if (file) attachment = await uploadAttachment(file);
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        project_type: projectType ?? "",
        budget: budget ?? "",
        message: form.message.trim(),
        attachment,
      });
      if (error) throw error;
      setStatus("sent");
      toast.success("Message sent. I'll get back to you soon.");
    } catch {
      setStatus("idle");
      toast.error("Something went wrong sending your message. Please try again.");
    }
  }

  return (
    <>
      <Toaster position="bottom-right" theme="dark" richColors />
      <PageHeader
        index="07"
        eyebrow="CONTACT"
        title="LET'S BUILD IT."
        intro="Have a website, AI idea, digital product or technology problem you want to solve?"
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {status === "sent" ? (
              <Reveal>
                <div className="border border-accent p-10">
                  <span className="label-tech text-accent">MESSAGE RECEIVED</span>
                  <h2 className="display mt-4 text-4xl">THANK YOU.</h2>
                  <p className="mt-4 max-w-md text-muted-foreground">
                    Your message is in. I'll reply to{" "}
                    <span className="text-foreground">{form.email}</span> as soon as I can.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: "", email: "", company: "", message: "" });
                      setProjectType(null);
                      setBudget(null);
                      setFile(null);
                      setStatus("idle");
                    }}
                    className="mt-8 label-tech link-underline text-accent"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </Reveal>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="label-tech">NAME *</span>
                    <input
                      className={`${field} mt-3`}
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="label-tech">EMAIL *</span>
                    <input
                      className={`${field} mt-3`}
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="label-tech">COMPANY / INDIVIDUAL</span>
                  <input
                    className={`${field} mt-3`}
                    value={form.company}
                    onChange={update("company")}
                    placeholder="Company or individual (optional)"
                    autoComplete="organization"
                  />
                </label>

                <div>
                  <span className="label-tech">PROJECT TYPE</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((t) => (
                      <Chip
                        key={t}
                        active={projectType === t}
                        onClick={() => setProjectType(projectType === t ? null : t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="label-tech">BUDGET RANGE (OPTIONAL)</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <Chip
                        key={b}
                        active={budget === b}
                        onClick={() => setBudget(budget === b ? null : b)}
                      >
                        {b}
                      </Chip>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="label-tech">MESSAGE *</span>
                  <textarea
                    className={`${field} mt-3 min-h-40 resize-y`}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell me what you're building…"
                    required
                  />
                </label>

                <div>
                  <span className="label-tech">ATTACH A DOC (OPTIONAL)</span>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 label-tech text-muted-foreground transition-colors hover:border-accent hover:text-accent">
                      {file ? "CHANGE FILE" : "UPLOAD BRIEF / REQUIREMENTS"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md,image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {file && (
                      <span className="inline-flex items-center gap-2 text-sm text-foreground">
                        <span className="max-w-52 truncate">{file.name}</span>
                        <button
                          type="button"
                          className="label-tech text-red-400 hover:underline"
                          onClick={() => setFile(null)}
                        >
                          REMOVE
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    PDF, Word, text or image. Stored privately and shown only to me.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-3 border border-accent px-6 py-3.5 label-tech text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
                >
                  {status === "sending" ? "SENDING…" : "START A CONVERSATION"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>
            )}
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="border border-border p-8">
                <h2 className="label-tech text-accent">DIRECT</h2>
                {settings?.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="display mt-4 block text-2xl link-underline"
                  >
                    {settings.email}
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Email address is configured in the CMS and will appear here.
                  </p>
                )}
                {settings?.availability_status && (
                  <div className="mt-8 border-t border-border pt-6">
                    <h2 className="label-tech text-accent">STATUS</h2>
                    <p className="mt-3 flex items-center gap-3 text-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                      </span>
                      {settings.availability_status}
                    </p>
                  </div>
                )}
                <div className="mt-8 border-t border-border pt-6">
                  <h2 className="label-tech text-accent">BASED IN</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nigeria - building for clients worldwide.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
