import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, ArrowLink } from "@/components/site-sections";
import { ProjectGrid } from "@/components/project-cards";
import { useProjects } from "@/lib/content";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Selected Work — Joshua Omotayo" },
      {
        name: "description",
        content:
          "Selected websites and digital experiences built for businesses and people across Nigeria, Canada, the United Kingdom and the United States.",
      },
      { property: "og:title", content: "Selected Work — Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { data: projects } = useProjects();

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="WORK"
        title="SELECTED WORK"
        intro="Websites, web applications and digital experiences. Case studies appear here as they are written."
      />
      <Section>
        <ProjectGrid projects={projects ?? []} />
      </Section>
      <Section className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-border p-8 md:p-12">
          <h2 className="display max-w-xl text-3xl md:text-5xl">HAVE A PROJECT LIKE THESE?</h2>
          <ArrowLink to="/contact" tone="accent">
            Start a conversation
          </ArrowLink>
        </div>
      </Section>
    </>
  );
}
