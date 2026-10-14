import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/content";

const INTERNAL = [
  { to: "/work", label: "WORK" },
  { to: "/build", label: "BUILD" },
  { to: "/think", label: "THINK" },
  { to: "/teach", label: "TEACH" },
  { to: "/about", label: "ABOUT" },
  { to: "/lab", label: "THE LAB" },
  { to: "/contact", label: "CONTACT" },
] as const;

const EXTERNAL = [
  { href: "https://genrev.ng", label: "GenRev" },
  { href: "https://genrev.app", label: "GenRev AI" },
  { href: "https://gooddeednetwork.com", label: "GoodDeed Network" },
];

export function SiteFooter() {
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="rule grain bg-background">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="display text-[13vw] leading-[0.85] md:text-[5.5vw]">
              JOSHUA
              <br />
              OMOTAYO
            </p>
            <p className="mt-6 label-tech leading-6">
              WEB DEVELOPER
              <br />
              AI BUILDER
              <br />
              TECHNOLOGY EDUCATOR
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label-tech text-accent">SITE</p>
            <ul className="mt-4 space-y-2">
              {INTERNAL.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label-tech text-accent">ELSEWHERE</p>
            <ul className="mt-4 space-y-2">
              {settings?.youtube_url ? (
                <li>
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-muted-foreground hover:text-foreground"
                  >
                    YouTube
                  </a>
                </li>
              ) : (
                <li className="text-sm text-muted-foreground/60">YouTube — link coming soon</li>
              )}
              {EXTERNAL.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="link-underline text-sm text-muted-foreground hover:text-foreground"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="rule mt-14 flex flex-col gap-2 pt-6 label-tech md:flex-row md:items-center md:justify-between">
          <span>© {year} Joshua Omotayo</span>
          <span>BUILT FROM NIGERIA. BUILT FOR EVERYWHERE.</span>
        </div>
      </div>
    </footer>
  );
}
