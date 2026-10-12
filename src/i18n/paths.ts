/** Prefix a site path with Astro's configured base (kept unset until deployment is decided). */
export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
