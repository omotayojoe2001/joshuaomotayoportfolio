import type { ReactNode } from "react";
import { Hero } from "@/components/home/hero";
import { Section, ArrowLink } from "@/components/site-sections";
import { Credibility } from "@/components/credibility";
import { Capabilities } from "@/components/capabilities";
import { ProjectGrid } from "@/components/project-cards";
import { FeaturedPrototype } from "@/components/featured-prototype";
import { GlobalReach } from "@/components/global-reach";
import { ProductShowcase } from "@/components/product-showcase";
import { ArticleList } from "@/components/article-list";
import { LearningPath } from "@/components/learning-path";
import { VideoSection } from "@/components/video-section";
import { NowBoard } from "@/components/now-board";
import { FinalCta } from "@/components/final-cta";
import { Reveal } from "@/components/motion-primitives";
import { useArticles, useProjects } from "@/lib/content";

function BlockHead({ title, sub, action }: { title: ReactNode; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 className="display text-4xl md:text-6xl">{title}</h2>
        {sub && <p className="mt-4 max-w-lg text-base text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function HomePage() {
  const { data: projects } = useProjects(4);
  const { data: articles } = useArticles({ limit: 4 });

  return (
    <>
      <Hero />

      {/* 02 - Live Figma prototype */}
      <Section index="00" label="LIVE FROM FIGMA">
        <FeaturedPrototype />
      </Section>

      {/* 03 - Credibility */}
      <Section>
        <Credibility />
      </Section>

      {/* 04 - What I do */}
      <Section index="01" label="WHAT I DO">
        <Capabilities />
      </Section>

      {/* 05 - Selected work */}
      <Section index="02" label="SELECTED WORK">
        <BlockHead
          title="SELECTED WORK"
          sub="Some of the digital experiences I've built."
          action={<ArrowLink to="/work">View all work</ArrowLink>}
        />
        <ProjectGrid projects={projects ?? []} />
      </Section>

      {/* 06 - Global reach */}
      <Section index="03" label="GLOBAL REACH">
        <GlobalReach />
      </Section>

      {/* 07 - Things I'm building */}
      <Section index="04" label="THINGS I'M BUILDING">
        <BlockHead
          title="THINGS I'M BUILDING"
          sub="Client work is part of what I do. Building my own technology is how I explore what comes next."
          action={<ArrowLink to="/build">Explore products</ArrowLink>}
        />
        <ProductShowcase />
      </Section>

      {/* 08 - Technology / AI */}
      <Section index="05" label="TECHNOLOGY / AI">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="display text-4xl md:text-6xl">
              BUILDING WITH <span className="text-accent">AI.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              AI is not a gimmick layered on top. It is part of how I design and build - websites
              that respond, products that assist, workflows that think. Useful technology, built
              intentionally from idea to interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 label-tech">
              {["WEB DEVELOPMENT", "AI INTEGRATION", "DIGITAL PRODUCTS", "EDUCATION"].map((t) => (
                <span key={t} className="border border-border px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 09 - Think / journal */}
      <Section index="06" label="THINK">
        <BlockHead
          title="FROM THE JOURNAL"
          sub="Writing, ideas and experiments on web development, AI and building."
          action={<ArrowLink to="/think">Read the journal</ArrowLink>}
        />
        <ArticleList articles={articles ?? []} />
      </Section>

      {/* 10 - Teach */}
      <Section index="07" label="TEACH">
        <BlockHead
          title={
            <>
              I DON'T JUST BUILD WITH TECHNOLOGY.
              <br />
              <span className="text-accent">I TEACH PEOPLE HOW TO BUILD WITH IT.</span>
            </>
          }
          action={<ArrowLink to="/teach">Learn more</ArrowLink>}
        />
        <LearningPath />
      </Section>

      {/* 11 - YouTube */}
      <Section index="08" label="WATCH / LEARN">
        <VideoSection />
      </Section>

      {/* 12 - Now */}
      <Section index="09" label="NOW">
        <BlockHead
          title="CURRENTLY"
          sub="A live board of what I'm building, learning and shipping."
        />
        <NowBoard />
      </Section>

      {/* 13 - Final CTA */}
      <FinalCta />
    </>
  );
}
