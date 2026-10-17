import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // CMS content changes rarely, so cache it. This stops React Query from
        // refetching from Supabase on every mount / tab focus, which made
        // in-app navigation feel slow. Data still refreshes on a real reload.
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Keep preloaded route data fresh long enough to be reused on arrival,
    // so hovering a link (which preloads it) makes the click instant.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 30_000,
  });

  return router;
};
