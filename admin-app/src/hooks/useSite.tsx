import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SITE_SLUG, type SiteSlug } from "../lib/site";

type SiteContextValue = {
  siteSlug: SiteSlug;
  setSiteSlug: (slug: SiteSlug) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteSlug, setSiteSlug] = useState<SiteSlug>(DEFAULT_SITE_SLUG);
  const value = useMemo(() => ({ siteSlug, setSiteSlug }), [siteSlug]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
