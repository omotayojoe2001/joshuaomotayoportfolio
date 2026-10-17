import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SystemChrome } from "@/components/system/system-chrome";

/**
 * Decides, before the first paint, whether the boot curtain plays. Runs in the
 * head so the curtain is either skipped or animating from frame one, and the
 * decision never has to be mirrored in React state (no hydration branch).
 */
const BOOT_SCRIPT = `
try {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = window.sessionStorage.getItem("jo-booted") === "1";
  if (reduce || seen || location.pathname.indexOf("/admin") === 0) {
    document.documentElement.setAttribute("data-boot", "skip");
  } else {
    window.sessionStorage.setItem("jo-booted", "1");
  }
} catch (e) {
  document.documentElement.setAttribute("data-boot", "skip");
}
`;

const BOOT_NAME = "JOSHUA OMOTAYO";

const SITE_URL = "https://joshuaomotayo.com.ng";
const DEFAULT_TITLE = "Joshua Omotayo - Web Developer, AI Builder & Technology Educator";
const DEFAULT_DESCRIPTION =
  "Websites, AI-powered experiences and digital products built from Nigeria for businesses and people around the world.";
const DEFAULT_IMAGE = `${SITE_URL}/joshua.jpg`;
const DEFAULT_KEYWORDS =
  "Joshua Omotayo, web developer Nigeria, AI builder, AI integration, website design, digital products, technology educator, frontend developer, Lagos, React, GenRev, PlayGen";

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joshua Omotayo",
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  jobTitle: ["Web Developer", "AI Builder", "Technology Educator"],
  email: "mailto:playgen.ng@gmail.com",
  knowsAbout: [
    "Web Development",
    "AI Integration & Automation",
    "Digital Products",
    "Technology Education",
    "React",
    "TypeScript",
  ],
  areaServed: ["Nigeria", "Canada", "United Kingdom", "United States"],
  sameAs: [
    "https://www.youtube.com/@joshua-omotayo",
    "https://www.linkedin.com/in/joshua-omotayo/",
    "https://www.tiktok.com/@joshua.o.timilehin",
    "https://genrev.app",
  ],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Joshua Omotayo",
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en",
  author: { "@type": "Person", name: "Joshua Omotayo" },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="label-tech text-accent">SIGNAL LOST</span>
      <h1 className="display text-[18vw] leading-[0.82] md:text-[9vw]">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page is not part of the build. Everything else is still running.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 label-tech">
        <Link
          to="/"
          className="border border-accent px-4 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          GO HOME →
        </Link>
        <Link
          to="/work"
          className="border border-border-strong px-4 py-2.5 transition-colors hover:border-accent hover:text-accent"
        >
          VIEW WORK
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function BootCurtain() {
  const words = BOOT_NAME.split(" ");
  return (
    <div className="boot" aria-hidden>
      <p className="display text-[15vw] leading-[0.86] md:text-[7vw]">
        {words.map((word, w) => (
          <span key={word} className="boot-word block overflow-hidden">
            {word.split("").map((letter, i) => (
              <span
                key={`${word}-${i}`}
                style={{ animationDelay: `${0.04 + (w * 7 + i) * 0.028}s` }}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </p>
      <div className="boot-line w-56 md:w-80" />
      <p className="label-tech boot-word">
        <span style={{ animationDelay: "0.52s" }}>
          WEB DEVELOPMENT / AI SYSTEMS / DIGITAL PRODUCTS
        </span>
      </p>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "keywords", content: DEFAULT_KEYWORDS },
      { name: "author", content: "Joshua Omotayo" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#050505" },
      { property: "og:site_name", content: "Joshua Omotayo" },
      { property: "og:locale", content: "en_NG" },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_IMAGE },
      { property: "og:image:alt", content: DEFAULT_TITLE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DEFAULT_TITLE },
      { name: "twitter:description", content: DEFAULT_DESCRIPTION },
      { name: "twitter:image", content: DEFAULT_IMAGE },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/admin");
  const canonical = pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname.replace(/\/$/, "")}`;
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {!bare && <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />}
        {!bare && <link rel="canonical" href={canonical} />}
        {!bare && <meta property="og:url" content={canonical} />}
        {!bare && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
            />
          </>
        )}
      </head>
      <body>
        {!bare && <BootCurtain />}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // The admin dashboard is a private, chrome-free surface: no marketing nav/footer.
  const bare = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {bare ? (
        // Required: nested routes render here. Removing <Outlet /> breaks all child routes.
        <Outlet />
      ) : (
        <div className="relative flex min-h-screen flex-col">
          <SystemChrome />
          <SiteNav />
          <main key={pathname} className="page-enter relative z-10 flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <div className="relative z-10">
            <SiteFooter />
          </div>
        </div>
      )}
    </QueryClientProvider>
  );
}
