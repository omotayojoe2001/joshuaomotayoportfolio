/**
 * Real website imagery without hosting screenshots ourselves.
 * thum.io renders a live screenshot of any public URL, so product/project cards
 * show the actual site. Used only as a fallback when no uploaded image exists.
 */
export function ogImage(url?: string | null, width = 1200): string {
  if (!url || url === "#") return "";
  const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return `https://image.thum.io/get/width/${width}/noanimate/${full}`;
}
