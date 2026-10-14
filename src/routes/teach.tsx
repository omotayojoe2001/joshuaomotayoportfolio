import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, ArrowLink } from "@/components/site-sections";
import { LearningPath } from "@/components/learning-path";
import { VideoSection } from "@/components/video-section";
import { Reveal } from "@/components/motion-primitives";
import { useSettings } from "@/lib/content";

const TOPICS = [
  { title: "Web Development", body: "HTML, CSS, JavaScript, React and modern interfaces." },
  { title: "Artificial Intelligence", body: "Understanding AI and where it is genuinely useful." },
  { title: "AI Integration", body: "Adding AI into websites, products and workflows." },
  { title: "Modern Technology", body: "The tools and systems behind today's web." },
  { title: "Digital Products", body: "Taking an idea from concept to a working product." },
  { title: "Building with AI", body: "Using AI as a partner in the build process." },
];

export const Route = createFileRoute("/teach")({
  head: () => ({
    meta: [
      { title: "Teach — Technology & AI Education · Joshua Omotayo" },
      {
        name: "description",
        content:
          "Joshua Omotayo teaches web development, AI, AI integration and building digital products — helping people move from understanding technology to building with it.",
      },
      { property: "og:title", content: "Teach — Technology & AI Education · Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TeachPage,
});

function TeachPage() {
  const { data: settings } = useSettings();
  const youtubeUrl = settings?.youtube_url || "";
  return (
    <>
      <PageHeader
        index="04"
        eyebrow="TEACH"
        title="I TEACH PEOPLE HOW TO BUILD WITH TECHNOLOGY."
        intro="From understanding technology to actually building with it — web development, AI and digital products."
      />

      <Section className="pt-0" index="01" label="THE PATH">
        <LearningPath />
      </Section>

      <Section index="02" label="WHAT I TEACH">
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 3) * 0.06} className="bg-background">
              <div className="h-full p-8 transition-colors hover:bg-surface">
                <span className="label-tech text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-4 text-2xl">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section index="03" label="WATCH / LEARN">
        <VideoSection />
      </Section>

      <Section className="pt-0">
        <div className="border border-border p-8 md:p-12">
          <h2 className="display max-w-3xl text-3xl md:text-5xl">
            READY TO LEARN HOW TO BUILD WITH TECHNOLOGY AND AI?
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Join the programme at Genrev Learning — or watch free lessons on my YouTube channel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ArrowLink href="https://learn.genrev.ng" tone="accent">
              Go to learn.genrev.ng
            </ArrowLink>
            {youtubeUrl ? (
              <ArrowLink href={youtubeUrl}>Go to my YouTube channel</ArrowLink>
            ) : (
              <ArrowLink to="/contact">Invite me to teach</ArrowLink>
            )}
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-border p-8 md:p-12">
          <h2 className="display max-w-xl text-3xl md:text-5xl">
            WANT A WORKSHOP, TALK OR SESSION?
          </h2>
          <ArrowLink to="/contact" tone="accent">
            Invite me to teach
          </ArrowLink>
        </div>
      </Section>
    </>
  );
}
