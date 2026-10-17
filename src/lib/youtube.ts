/** YouTube helpers: the CMS stores whatever link is convenient, the player
 *  needs the video id. */

const PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /^([\w-]{11})$/,
];

export function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const pattern of PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** Always-resolving poster frame (hqdefault exists for every video). */
export function youTubeThumb(url: string | null | undefined): string | null {
  const id = youTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function youTubeEmbed(id: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    autoplay: autoplay ? "1" : "0",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
