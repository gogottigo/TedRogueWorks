import type { Locale } from './ui';

/** Prefix a site path with Astro's configured deployment base. */
export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Only pair routes that actually have both translations. Blog slugs are explicit. */
export function translationPath(pathname: string, locale: Locale, translationHref?: string): string {
  if (translationHref) return sitePath(translationHref);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length) || '/'
    : pathname;
  const normalized = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  const localPath = locale === 'en' ? normalized.replace(/^\/en(?=\/)/, '') || '/' : normalized;
  const paired = ['/', '/about/', '/contact/', '/projects/', '/blog/',
    '/projects/profistal14/', '/projects/pekarnya-chudes/', '/projects/profsanteh-plus/', '/projects/pravoslavnii-mir/'];
  const targetRoot = locale === 'ru' ? '/en' : '';
  if (paired.includes(localPath)) return sitePath(`${targetRoot}${localPath}`);
  // An unpublished/missing article translation must never become a broken URL.
  if (localPath.startsWith('/blog/')) return sitePath(`${targetRoot}/blog/`);
  return sitePath(`${targetRoot}/`);
}
