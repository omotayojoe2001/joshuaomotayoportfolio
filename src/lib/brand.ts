/**
 * Joshua's own products — distinct from client work in the `projects` table.
 * Content is fixed by the brand brief; each product keeps its own visual
 * identity while staying inside the black / white / teal system.
 */

export type ProductVisual = "business" | "assistant" | "impact";

export type Product = {
  name: string;
  url: string;
  domain: string;
  position: string;
  description: string;
  cta: string;
  visual: ProductVisual;
  index: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "GenRev",
    url: "https://genrev.ng",
    domain: "genrev.ng",
    position: "Business Development Tools",
    description:
      "A business development toolkit designed to help business owners manage and grow their businesses.",
    cta: "Visit GenRev",
    visual: "business",
    index: "01",
  },
  {
    name: "GenRev AI",
    url: "https://genrev.app",
    domain: "genrev.app",
    position: "AI Social Media Assistant",
    description:
      "An AI-powered social media assistant designed to help people create, manage and improve their social media presence.",
    cta: "Explore GenRev AI",
    visual: "assistant",
    index: "02",
  },
  {
    name: "GoodDeed Network",
    url: "https://gooddeednetwork.com",
    domain: "gooddeednetwork.com",
    position: "Technology for Social Good",
    description:
      "A technology-for-social-good initiative focused on using technology to advocate for people and create positive social impact.",
    cta: "Visit GoodDeed Network",
    visual: "impact",
    index: "03",
  },
];

/** Markets Joshua builds for — used by the global-reach section. */
export const MARKETS = [
  { country: "Nigeria", flag: "🇳🇬", code: "NG", note: "Home base" },
  { country: "Canada", flag: "🇨🇦", code: "CA", note: "Client work" },
  { country: "United Kingdom", flag: "🇬🇧", code: "GB", note: "Client work" },
  { country: "United States", flag: "🇺🇸", code: "US", note: "Client work" },
] as const;

/** Capability cards for the "What I do" section. */
export const CAPABILITIES = [
  {
    code: "01",
    title: "Web Development",
    body: "Modern websites and web applications designed and built for businesses, organizations and individuals.",
    tags: ["React", "TypeScript", "Design systems"],
  },
  {
    code: "02",
    title: "AI Integration",
    body: "Integrating AI into websites, products and workflows to make technology more useful and intelligent.",
    tags: ["LLMs", "Automation", "Assistants"],
  },
  {
    code: "03",
    title: "Digital Products",
    body: "Designing and building technology products from idea to working product.",
    tags: ["Concept", "Build", "Launch"],
  },
  {
    code: "04",
    title: "Technology Education",
    body: "Teaching people how to understand, build and work with modern web technology and AI.",
    tags: ["Web", "AI", "Building"],
  },
] as const;

/** The learning path used on the Teach surface. */
export const LEARNING_PATH = ["Idea", "Web", "AI", "Product", "Launch"] as const;
