import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  buildContentTree,
  fetchContentRows,
  getImage,
  getLink,
  getSection,
  getText,
  listItemsBySection,
  orderedEntries,
  textFromEntry,
  type ContentTree,
} from '@/lib/content';
import { createBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

export type ContentApi = {
  tree: ContentTree;
  getText: (page: string, section: string, key: string) => string;
  getLink: (page: string, section: string, key: string) => { text: string; href: string };
  getImage: (page: string, section: string, key: string) => { src: string; alt: string };
  listItems: (page: string, section: string) => ReturnType<typeof listItemsBySection>;
  ordered: (page: string, section: string) => ReturnType<typeof orderedEntries>;
  textFromEntry: typeof textFromEntry;
  getSection: (page: string, section: string) => ReturnType<typeof getSection>;
};

type Status = 'loading' | 'ready' | 'error' | 'misconfigured';

type ContentStateValue = {
  status: Status;
  errorMessage?: string;
  api?: ContentApi;
};

const ContentStateContext = createContext<ContentStateValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [tree, setTree] = useState<ContentTree | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      setStatus('misconfigured');
      setErrorMessage('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See .env.example.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const client = createBrowserSupabaseClient();
        const rows = await fetchContentRows(client);
        if (cancelled) return;
        setTree(buildContentTree(rows));
        setStatus('ready');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(e instanceof Error ? e.message : 'Failed to load content.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const api = useMemo((): ContentApi | undefined => {
    if (!tree) return undefined;
    return {
      tree,
      getText: (p, s, k) => getText(tree, p, s, k),
      getLink: (p, s, k) => getLink(tree, p, s, k),
      getImage: (p, s, k) => getImage(tree, p, s, k),
      listItems: (p, s) => listItemsBySection(tree, p, s),
      ordered: (p, s) => orderedEntries(tree, p, s),
      textFromEntry,
      getSection: (p, s) => getSection(tree, p, s),
    };
  }, [tree]);

  const value = useMemo<ContentStateValue>(
    () => ({ status, errorMessage, api }),
    [status, errorMessage, api],
  );

  return <ContentStateContext.Provider value={value}>{children}</ContentStateContext.Provider>;
}

export function useContent(): ContentApi {
  const ctx = useContext(ContentStateContext);
  if (!ctx?.api) {
    throw new Error('useContent requires loaded content inside ContentProvider.');
  }
  return ctx.api;
}

export function useContentStatus(): ContentStateValue {
  const ctx = useContext(ContentStateContext);
  if (!ctx) {
    throw new Error('useContentStatus requires ContentProvider.');
  }
  return ctx;
}
