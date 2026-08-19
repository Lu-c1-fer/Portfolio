// STUB: there is no GET /api/sites (or any sites-list) endpoint on the
// backend yet, so this admin app has no way to discover valid site slugs at
// runtime — they're hardcoded here. The "site switcher" dropdown in
// Layout.tsx is real UI wired to this list, but the list itself is a
// placeholder, not a finished feature: adding a second site (e.g. the
// planned restaurant site) means adding its slug here by hand until a real
// GET /api/sites endpoint exists on the backend to replace this.
export const KNOWN_SITE_SLUGS = ["portfolio"] as const;

export type SiteSlug = (typeof KNOWN_SITE_SLUGS)[number];

export const DEFAULT_SITE_SLUG: SiteSlug = KNOWN_SITE_SLUGS[0];
