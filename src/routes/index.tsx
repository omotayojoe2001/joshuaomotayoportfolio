import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/home-page";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx (now Joshua-branded), and ships no og:image so serve-time hosting
// can inject the project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: HomePage,
});
