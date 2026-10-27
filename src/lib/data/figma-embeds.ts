/**
 * Interactive design prototypes (Figma embeds) attached to case studies by slug.
 *
 * The `projects` table does not have a figma column and adding one would need
 * a DB migration for something only a couple of case studies will ever use.
 * Keeping the mapping in-repo means the CMS row and the interactive layer stay
 * independent: the CMS owns the copy, this owns the embed.
 *
 * Two URLs per project:
 *  - embedUrl: what we mount inside the player (embed.figma.com/... , loads
 *    Figma's runtime with the prototype sidebar and starting node).
 *  - figmaUrl: what we link to as "Open in Figma" (figma.com/proto/... , the
 *    canonical URL a visitor would share or bookmark).
 */
export type FigmaEmbed = {
  embedUrl: string;
  figmaUrl: string;
  title: string;
  eyebrow?: string;
};

const FILE = "mGsh7uvwl7Y1wooI0sg68L";
const FILE_NAME = "Buffson-Fitness-App-Updated";

export const figmaEmbedsBySlug: Record<string, FigmaEmbed> = {
  "buffson-fitness-app": {
    embedUrl:
      `https://embed.figma.com/proto/${FILE}/${FILE_NAME}` +
      `?node-id=11-198&scaling=scale-down&content-scaling=fixed` +
      `&page-id=0%3A1&starting-point-node-id=2%3A2&show-proto-sidebar=1&embed-host=share`,
    figmaUrl:
      `https://www.figma.com/proto/${FILE}/${FILE_NAME}` +
      `?node-id=11-198&scaling=scale-down&content-scaling=fixed` +
      `&page-id=0%3A1&starting-point-node-id=2%3A2&show-proto-sidebar=1`,
    title: "Buffson Fitness App",
    eyebrow: "NOW PLAYING",
  },
};
