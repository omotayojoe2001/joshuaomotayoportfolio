import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, ArrowLink } from "@/components/site-sections";
import { ProductShowcase } from "@/components/product-showcase";
import { NowBoard } from "@/components/now-board";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Build — Things I'm Building · Joshua Omotayo" },
      {
        name: "description",
        content:
          "Products Joshua Omotayo is building: GenRev, GenRev AI and GoodDeed Network — business tools, an AI social media assistant and technology for social good.",
      },
      { property: "og:title", content: "Build — Things I'm Building · Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BuildPage,
});

function BuildPage() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="BUILD"
        title="THINGS I'M BUILDING"
        intro="Client work is part of what I do. Building my own technology is how I explore what comes next."
      />
      <Section className="pt-0">
        <ProductShowcase />
      </Section>
      <Section index="—" label="CURRENTLY">
        <div className="mb-10 max-w-xl">
          <h2 className="display text-3xl md:text-5xl">THE BUILD BOARD</h2>
          <p className="mt-4 text-muted-foreground">
            A live view of what is in progress, updated from the studio.
          </p>
        </div>
        <NowBoard />
      </Section>
      <Section className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-border p-8 md:p-12">
          <h2 className="display max-w-xl text-3xl md:text-5xl">WANT TO BUILD SOMETHING TOO?</h2>
          <ArrowLink to="/contact" tone="accent">
            Start a project
          </ArrowLink>
        </div>
      </Section>
    </>
  );
}
