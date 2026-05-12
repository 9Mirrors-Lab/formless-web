import { createContext, useContext, type ReactNode } from 'react';

export type SiteAccessState = {
  /** Public visitors only see home; deep links normalize to `/`. */
  restricted: boolean;
};

const SiteAccessContext = createContext<SiteAccessState>({ restricted: false });

export function SiteAccessProvider({
  value,
  children,
}: {
  value: SiteAccessState;
  children: ReactNode;
}) {
  return <SiteAccessContext.Provider value={value}>{children}</SiteAccessContext.Provider>;
}

export function useSiteAccess(): SiteAccessState {
  return useContext(SiteAccessContext);
}
