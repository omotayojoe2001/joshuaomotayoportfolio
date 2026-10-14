import type { Project } from "@/lib/content";

/**
 * Portfolio catalogue.
 *
 * This is the single source of truth for the work shown on /work. The same
 * records are also emitted as an SQL seed (drizzle/migrations/0001_projects_seed.sql)
 * so the Supabase `projects` table can be kept in sync — when the table answers,
 * its rows win; when it is empty or unreachable, these records render instead.
 */
export type ProjectSeed = Project;

type Draft = {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  problem: string;
  approach: string;
  design_direction: string;
  development: string;
  outcome: string;
  reflection: string;
  category: string;
  year: string;
  client: string;
  location: string;
  technologies: string[];
  url: string;
  layout?: Project["layout"];
  sort_order?: number;
  featured?: boolean;
};

function build(draft: Draft): Project {
  return {
    featured_image: "",
    gallery: [],
    layout: "landscape",
    sort_order: 0,
    featured: false,
    published: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...draft,
  };
}

export const seedProjects: Project[] = [
  build({
    id: "7f1c0a10-0000-4000-8000-000000000002",
    title: "Wealthtiv",
    slug: "wealthtiv",
    description:
      "Everything finance — from knowing where to start, to knowing where to put your money. We teach it, we show it, we point you in the right direction.",
    overview:
      "Wealthtiv is the finance hub of the Acorn ecosystem: education, guidance and signposting in one place, without the jargon or the hard sell that usually surrounds money advice.",
    problem:
      "Most people do not fail at finance because they lack information; they fail because the information arrives in a language and a format they cannot act on. The site had to lower that barrier before asking for anything.",
    approach:
      "We organised the site around the question people actually arrive with — 'where do I start?' — rather than product categories. A staged path moves from basics, to budgeting, to saving, to investing, with a clear next step at every level.",
    design_direction:
      "Calm and trustworthy: a warm neutral base, deep green as the growth accent, generous type and flat surfaces. No stock images of handshakes or gold coins.",
    development:
      "Built as a fast static site with a typed content model so new lessons, calculators and pointers can be added without touching layout. Structured metadata keeps the finance content legible to search.",
    outcome:
      "A single front door for the finance work, with clear routes into the coaching arm, the tools and the newsletter.",
    reflection:
      "Financial trust online is earned by what you leave out. Saying 'we point you in the right direction' honestly beats promising returns.",
    category: "Fintech",
    year: "2026",
    client: "Wealthtiv (Acorn Digital Solutions)",
    location: "Nigeria / Canada",
    technologies: ["React", "Tailwind CSS", "CMS", "SEO"],
    url: "https://www.wealthtiv.com/",
    layout: "full",
    sort_order: 2,
    featured: true,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000003",
    title: "Wealthtiv Coach",
    slug: "wealthtiv-coach",
    description:
      "Simple, practical strategies to earn more, budget better, save consistently and invest with confidence — guided by a real coach, supported by an AI that never sleeps.",
    overview:
      "The coaching arm of Wealthtiv pairs human accountability with always-on AI guidance. The site sells a relationship and a routine, not a course library.",
    problem:
      "People had tried apps and courses and stalled. What was missing was someone who notices you skipped two weeks. The platform needed to show that a human is in the loop, while the AI handles the 11pm question.",
    approach:
      "Four pillars — earn, budget, save, invest — each with a plain-language strategy and the first action. Alongside them, the coach/AI split is shown explicitly: what the coach decides, what the assistant handles, what you actually do each week.",
    design_direction:
      "Editorial and quiet. A restrained palette, large readable numbers, and conversation-style snippets that make the AI feel like a chat thread rather than a dashboard.",
    development:
      "React front end with a chat-style demo, a booking and intake flow connected to the coaching calendar, and progress states that persist per user session.",
    outcome:
      "A page that converts on clarity: visitors understand the cadence, the cost and the difference between the coach and the assistant before they enquire.",
    reflection:
      "The honest framing did the heavy lifting — 'an AI that never sleeps' is a support claim, not a substitute for advice, and the page says so.",
    category: "Fintech",
    year: "2026",
    client: "Wealthtiv",
    location: "Nigeria / Canada",
    technologies: ["React", "Tailwind CSS", "AI Chat", "Booking Flow"],
    url: "https://finance.wealthtiv.com/",
    layout: "landscape",
    sort_order: 3,
    featured: true,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000004",
    title: "Genrev Learning Hub",
    slug: "genrev-learning",
    description:
      "Web design, web development and AI mastery — from zero to paid clients in one complete programme.",
    overview:
      "A single curriculum covering web design, WordPress, AI-assisted development, UI/UX and how to actually get paid for the work. The site is the enrolment front for that programme.",
    problem:
      "Learners were assembling their own paths from scattered free tutorials and never reached a client-ready standard. The programme needed to present a complete path, not another lesson list.",
    approach:
      "The page is structured as a route: where you start, the modules in order, the projects you build, and the point at which you are ready to be paid. Outcomes are placed above features, and the curriculum expands inline so nothing is hidden behind a PDF.",
    design_direction:
      "Energetic but disciplined — bright accent on a dark base, numbered stages, and clear typographic hierarchy so a long curriculum still scans in under a minute.",
    development:
      "Component-based modules rendered from a typed curriculum structure, accordion stage navigation, sticky enrolment call-to-action, and form handling into the CRM.",
    outcome:
      "One page that answers the four questions that stop enrolment: is it for me, what will I build, how long, and what happens after.",
    reflection:
      "Selling education is selling a sequence. Once the order is obvious, the pitch gets much shorter.",
    category: "EdTech",
    year: "2026",
    client: "Genrev",
    location: "Lagos, Nigeria",
    technologies: ["React", "Tailwind CSS", "CMS", "Forms"],
    url: "https://learn.genrev.ng/",
    layout: "landscape",
    sort_order: 4,
    featured: true,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000005",
    title: "Acorn Digital Solutions",
    slug: "acorn-digital-solutions",
    description:
      "The parent ecosystem behind independent platforms in energy, education, fintech and mobile technology.",
    overview:
      "Acorn is the holding brand. Its site has to explain a portfolio of separate products without turning into a link directory or stealing attention from the platforms it hosts.",
    problem:
      "Visitors arrive for one product and need to understand the parent; partners arrive to assess capability and need evidence across sectors. Two audiences, one page, very different questions.",
    approach:
      "A layered structure: a short statement of what Acorn is, the four sectors as equal-weight cards, and each platform named with its own live link. The parent stays neutral so the products keep their voices.",
    design_direction:
      "Corporate but warm — an earth-toned accent, strong grid, generous white space and a restrained set of geometric marks instead of stock photography.",
    development:
      "Static, SEO-first build with a typed registry of the ecosystem, so adding a platform is a one-line data change that propagates to the grid, the footer and the sitemap.",
    outcome:
      "A credible front door for the group, and consistent metadata across every platform it points to.",
    reflection:
      "Holding brands live or die on restraint. The best thing the Acorn site does is get out of the way of the products.",
    category: "Corporate Website",
    year: "2026",
    client: "Acorn Digital Solutions",
    location: "Nigeria / Canada",
    technologies: ["React", "Tailwind CSS", "SEO", "Design System"],
    url: "https://www.acorndigitalsolution.com/",
    layout: "landscape",
    sort_order: 5,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000006",
    title: "PlayGen",
    slug: "playgen",
    description:
      "Earn real naira completing tasks, winning sponsored quizzes and recharging your phone — no gambling, no tricks, money straight into your wallet.",
    overview:
      "PlayGen turns attention into small, real rewards. The site's job is to overcome the first instinct anyone has toward an earning app in Nigeria: that it is a scam.",
    problem:
      "Users have been burned by apps that promise payout and then hide a withdrawal threshold. Every word on the page had to be verifiable, and the mechanics had to be legible in seconds.",
    approach:
      "Three earning paths — tasks, sponsored quizzes, airtime — each with a plain explanation and a screenshot of the wallet. The anti-gambling position is stated in the headline, and payout proof sits above the fold rather than buried in an FAQ.",
    design_direction:
      "Playful and high-contrast, with a mobile-first frame: the app mockups are the artwork, and the palette is pulled straight from them.",
    development:
      "Campaign landing page with deep links into the app, a reward-mechanics explainer, and event tracking on each earning path so acquisition can be measured per channel.",
    outcome:
      "Install and sign-up flow with clear attribution per reward type, and far fewer 'is this legit' questions reaching support.",
    reflection:
      "For a reward product, trust is the feature. Write the withdrawal rules honestly and the rest of the page gets easier.",
    category: "Consumer App",
    year: "2026",
    client: "PlayGen",
    location: "Lagos, Nigeria",
    technologies: ["React", "Tailwind CSS", "Deep Links", "Analytics"],
    url: "https://www.playgen.com.ng/",
    layout: "landscape",
    sort_order: 6,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000007",
    title: "Anew Portals",
    slug: "anew-portals",
    description:
      "Wisdom, inspiration and beauty in words that have shaped minds and hearts across generations.",
    overview:
      "An editorial portal built around reading rather than scrolling: quotations, essays and reflections, organised so a visitor can arrive curious and leave with something worth keeping.",
    problem:
      "Inspirational content sites are usually infinite feeds optimised for ad impressions. This one needed the opposite — calm pacing, real attribution and a structure that rewards returning to a piece.",
    approach:
      "A topic-and-author index in place of a feed, curated collections per theme, and a piece layout with typographic hierarchy built for long reading. Search handles the 'I remember a line but not the source' case.",
    design_direction:
      "Print-led: serif display for the words themselves, a paper-toned background, wide measures, and no visual noise competing with the text.",
    development:
      "Content-driven build with a typed article model, server-side rendering for shareable URLs, tag and collection archives, and clean metadata for link previews.",
    outcome:
      "A library that stays readable at hundreds of entries, with stable, indexable URLs for every piece and collection.",
    reflection:
      "Editing is the product here. Deciding what not to publish mattered more than any feature on the roadmap.",
    category: "Editorial Platform",
    year: "2025",
    client: "Anew Portals",
    location: "Nigeria",
    technologies: ["Next.js", "Tailwind CSS", "CMS", "Typography"],
    url: "https://anewportals.com/",
    layout: "portrait",
    sort_order: 7,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000008",
    title: "Cravings Delight",
    slug: "cravings-delight",
    description:
      "Premium African kitchen in Canada — soup and meal bowls built to order from premium ingredients, curated with accuracy and precision.",
    overview:
      "A preorder food service where every bowl is customised to taste. The website carries the two things a customer decides on in thirty seconds: what is actually in the food, and when it will be ready.",
    problem:
      "Customisable menus break most simple sites — options multiply, the kitchen gets ambiguous orders, and customers guess at portions and spice. The order had to be as precise as the kitchen.",
    approach:
      "A guided bowl builder: base, protein, heat level, sides and quantity, with each choice shown in plain language and a running total. Menu items are photographed honestly, and preorder windows are stated up front rather than at checkout.",
    design_direction:
      "Appetite first — dark plates, warm accents, full-bleed food photography and minimal chrome. Type stays quiet so the bowls lead.",
    development:
      "Built the ordering layer with customisation state, pickup/delivery windows, and payment or confirmation handoff, plus a lightweight back view of orders for the kitchen.",
    outcome:
      "Fewer clarifying calls to the kitchen, orders that read correctly the first time, and a menu that can be rotated weekly without a rebuild.",
    reflection:
      "Preorder is a logistics promise before it is a marketing one. The site works when the kitchen can trust what the button produced.",
    category: "Food & Beverage",
    year: "2025",
    client: "Cravings Delight",
    location: "Canada",
    technologies: ["React", "Tailwind CSS", "Order Flow", "Stripe"],
    url: "https://cravingsdelight.co.uk/",
    layout: "full",
    sort_order: 8,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000009",
    title: "Heritage Builds",
    slug: "heritage-builds",
    description:
      "Premium stainless steel railing systems in AISI 304 and 316 grade — built to last, specified with confidence.",
    overview:
      "A product-led site for architectural ironmongery: railing systems, grades, finishes and specifications, presented so a homeowner, a fitter and a specifier all get the right answer on the same page.",
    problem:
      "Steel railing is bought on trust about longevity. Photos alone do not tell a buyer whether a system suits a coastal balcony, and they tell a specifier nothing about grade or load.",
    approach:
      "Every system is documented the same way: grade, application, finish, hardware and typical span, with 316 positioned explicitly for marine and high-exposure settings. A comparison view makes the 304-versus-316 decision obvious in seconds.",
    design_direction:
      "Materials-forward: brushed-metal neutrals, hairline rules, industrial typography and honest detailing shots lit to show the surface rather than hide it.",
    development:
      "Product catalogue driven by a typed spec model, filterable by application and grade, with downloadable spec sheets and an enquiry form that carries the selected items through.",
    outcome:
      "Enquiries arrive with the product already identified, which shortens quoting and removes most of the grade confusion from the conversation.",
    reflection:
      "For technical goods, the specification is the marketing. Clarity about what you do not offer earns more trust than any claim about what you do.",
    category: "Product Website",
    year: "2025",
    client: "Heritage Builds",
    location: "United Kingdom",
    technologies: ["Next.js", "Tailwind CSS", "Product Catalogue", "SEO"],
    url: "https://www.heritagebuild360.com/",
    layout: "landscape",
    sort_order: 9,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000010",
    title: "Mitalgic",
    slug: "mitalgic",
    description:
      "Designing success — an international engineering consultancy delivering turnkey projects, maintenance and industrial services since 2015.",
    overview:
      "Mitalgic sells capability to procurement teams and project owners. The site presents the consultancy, the service lines, the sector record and a single route into a conversation.",
    problem:
      "Engineering firms with a long private record usually present as a list of services and a phone number. Nothing on the page answers the buyer's real question: have you delivered something like mine, and can you still be reached in eighteen months?",
    approach:
      "Structure by mandate — turnkey delivery, maintenance, asset and field services — then sector by sector evidence, with dates and geography, so a reader maps their own project onto the record without hunting for it.",
    design_direction:
      "Industrial precision: steel blue and graphite, sharp geometry, wide margins, and typography set like a technical document rather than a startup page.",
    development:
      "Static multi-page build with a capability register, project case entries, a qualifications section and a quote request flow that captures scope, sector and location.",
    outcome:
      "A corporate presence that matches the actual depth of the firm, with enquiries arriving scoped instead of generic.",
    reflection: "Eleven years of delivery does not need a tagline. It needs a table of contents.",
    category: "Corporate Website",
    year: "2025",
    client: "Mitalgic",
    location: "International",
    technologies: ["React", "Tailwind CSS", "SEO", "Forms"],
    url: "https://www.mitalgic.com/",
    layout: "landscape",
    sort_order: 10,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000011",
    title: "Ariseslg",
    slug: "ariseslg",
    description:
      "Empowering business with data-driven insights — analytics, reporting and decision support for growing teams.",
    overview:
      "Ariseslg is a data consultancy. Its website has to demonstrate the discipline it sells: clean structure, measurable claims and reporting that a non-analyst can read.",
    problem:
      "Analytics services are typically pitched in abstraction — dashboards, pipelines, KPIs — which means a business owner cannot tell what they would actually receive or decide with it.",
    approach:
      "Lead with the decision, not the dataset. Each engagement type is framed as a question a manager is stuck on, followed by the method, the deliverable and the cadence of the reporting.",
    design_direction:
      "Data-native but uncluttered: light surfaces, one strong accent, chart fragments as illustration and generously spaced type so numbers stay readable.",
    development:
      "React site with embeddable chart components, a services matrix, sample report previews and an enquiry flow that routes by use case.",
    outcome:
      "Conversations start at scope and timeline rather than at 'what is analytics', which is the whole point of the page.",
    reflection:
      "The proof of a data practice is a data-shaped website. If the page itself is vague, no deck will fix it.",
    category: "Data & Analytics",
    year: "2025",
    client: "Ariseslg",
    location: "Nigeria",
    technologies: ["React", "Chart Components", "Tailwind CSS", "SEO"],
    url: "https://www.ariseslg.org/",
    layout: "landscape",
    sort_order: 11,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000012",
    title: "Afioos Global Services",
    slug: "afioos-global-services",
    description:
      "A multi-service global firm — sourcing, logistics, support and business services — presented with one clear voice.",
    overview:
      "Afioos operates across several service lines and geographies. The site gives each line its own entry point while keeping a single, credible company story behind them.",
    problem:
      "Diversified service companies drift into either a wall of text or a set of disconnected pages. Customers could not tell which service they needed, and partners could not tell what the company actually was.",
    approach:
      "A service index that behaves like a directory: each offering summarised in one sentence, with its own detail page, process and contact route. The about layer carries the corporate substance the directory needs.",
    design_direction:
      "Global and grounded: deep navy, warm neutral support, structured grids and real service photography in place of the handshake stock that this sector leans on.",
    development:
      "Page-based build generated from a service registry, breadcrumbs, per-service enquiry forms and FAQ structured data for each line.",
    outcome:
      "Every service line became individually findable, and the company reads as one organisation instead of several brochures.",
    reflection:
      "Breadth only looks like strength when it is indexed. Otherwise it just looks like confusion.",
    category: "Corporate Website",
    year: "2025",
    client: "Afioos Global Services",
    location: "Nigeria / Canada",
    technologies: ["Next.js", "Tailwind CSS", "Structured Data", "Forms"],
    url: "https://www.afioosglobalservices.com/",
    layout: "portrait",
    sort_order: 12,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000013",
    title: "Naejay Services",
    slug: "naejay-services",
    description:
      "Cleaning, staffing and property support services under one roof, with a separate clear path into each.",
    overview:
      "Naejay is a services company whose difficulty is variety: several audiences — facilities managers, households, employers — all landing on the same homepage and each needing a different next step.",
    problem:
      "A single contact form at the end of a mixed services page produces unqualified enquiries and slow follow-up. The site had to route people before it asked them for anything.",
    approach:
      "Service-first navigation with dedicated landing pages per offering, each carrying its own scope, coverage area, proof and enquiry form. Shared trust elements repeat across pages so the brand stays one piece.",
    design_direction:
      "Clean and dependable — bright whitespace, a single confident accent, iconography that labels rather than decorates, and imagery of actual crews at work.",
    development:
      "Generated from a service model with per-page SEO metadata, quote forms that tag the enquiry by service and urgency, and fast static delivery.",
    outcome:
      "Enquiries arrive labelled, so the first reply can already contain a price range and a date.",
    reflection:
      "Routing beats persuasion. Most of the lift came from asking one good question early instead of writing better copy.",
    category: "Services Website",
    year: "2025",
    client: "Naejay Services",
    location: "Canada",
    technologies: ["React", "Tailwind CSS", "Forms", "SEO"],
    url: "https://www.naejayservices.com/",
    layout: "landscape",
    sort_order: 13,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000014",
    title: "Dezeclean Services",
    slug: "dezeclean-services",
    description:
      "A cleaning business site that turns a search for 'cleaners near me' into a booked, sized-up job.",
    overview:
      "Dezeclean needed to be found locally, understood instantly and hired without a phone call being the only option. The site handles all three in one short scroll.",
    problem:
      "Local service sites tend to be a logo, a slider and a phone number in small print — none of which answers 'will you do my kind of job, and what will it cost'.",
    approach:
      "Service grid up front (residential, move-out, office, recurring), each with what is included and what it is not, then a pricing estimator and a request-a-visit form that captures property size and condition.",
    design_direction:
      "Bright and tidy by necessity: white and pale blue, high contrast, large tap targets and a layout that stays perfectly legible on a phone in a hallway.",
    development:
      "Lightweight static build with a client-side estimator, LocalBusiness structured data, and enquiry routing into the owner's existing inbox and WhatsApp.",
    outcome:
      "Booked visits with the property details already supplied, plus a page that actually ranks for the area it serves.",
    reflection:
      "Local SEO is mostly honesty: real service names, real coverage, real prices — the things most competitor pages leave out.",
    category: "Services Website",
    year: "2025",
    client: "Dezeclean Services",
    location: "Canada",
    technologies: ["Astro", "Tailwind CSS", "Local SEO", "Estimator"],
    url: "https://www.dezecleaningservices.com/",
    layout: "landscape",
    sort_order: 14,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000015",
    title: "Neatify Cleaning",
    slug: "neatify-cleaning",
    description:
      "Recurring home cleaning, booked by plan — weekly, fortnightly or monthly — with a straightforward quote path.",
    overview:
      "Neatify sells continuity rather than one-off visits. The site is organised around plans and frequency, so the subscription decision is the default one.",
    problem:
      "Cleaning companies quote per visit and lose the customer to whoever was cheapest that day. To build a recurring book, the website had to make frequency feel like the obvious way to buy.",
    approach:
      "Plan cards first, one-off visits second. Each plan states the cadence, what a session covers, and how to pause or change it, so the commitment reads as flexible rather than binding.",
    design_direction:
      "Crisp and domestic: soft neutrals, rounded detail treatments, photography of lived-in rooms rather than show flats, and clear pricing shapes.",
    development:
      "Quote builder that collects bedrooms, bathrooms and frequency into an instant range, with the result carried into the booking request and confirmation email.",
    outcome:
      "More plan-shaped enquiries and fewer single-visit hagglers; the quote tool gives the owner a defensible starting number.",
    reflection:
      "A pricing range you can defend on the phone is worth more than a 'contact us for a quote' button.",
    category: "Services Website",
    year: "2025",
    client: "Neatify Cleaning Services",
    location: "Canada",
    technologies: ["React", "Tailwind CSS", "Quote Builder", "Email"],
    url: "https://www.neatifycleaning.ca/",
    layout: "landscape",
    sort_order: 15,
  }),
  build({
    id: "7f1c0a10-0000-4000-8000-000000000016",
    title: "YouClean Services",
    slug: "youclean-services",
    description:
      "Residential and move-out cleaning in Canada, with a booking path short enough that people actually finish it.",
    overview:
      "YouClean's site exists to convert a hurried homeowner into a scheduled clean. Every element on the page either builds trust or shortens the path to a booking date.",
    problem:
      "Quote forms with eleven fields lose most of the people who were ready to book. The business needed a first contact that costs the customer five seconds.",
    approach:
      "One question at a time: home type, size, service, date — then details if they want to give them. Trust is carried by named services, clear inclusions and reviews placed at the decision points, not in a sidebar.",
    design_direction:
      "Fresh and reassuring: white space, a single clean accent, soft geometry and generous tap targets, with a layout that stays composed on a one-handed phone.",
    development:
      "Step-based booking form with client-side validation and instant summary, submissions delivered to the owner's inbox with a calendar-ready subject line, and Core Web Vitals tuned for mobile search.",
    outcome:
      "A booking flow that finishes instead of abandons, and repeatable move-out season peaks handled without phone tag.",
    reflection:
      "Removing three fields did more for conversions than redesigning the homepage. Restraint is a feature.",
    category: "Services Website",
    year: "2024",
    client: "YouClean Services Ltd",
    location: "Canada",
    technologies: ["React", "Tailwind CSS", "Booking Flow", "Performance"],
    url: "https://www.youcleanservicesltd.com/",
    layout: "landscape",
    sort_order: 16,
  }),
];

export const seedProjectsBySlug: Record<string, Project> = Object.fromEntries(
  seedProjects.map((p) => [p.slug, p]),
);
