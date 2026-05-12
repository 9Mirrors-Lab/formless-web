import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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

type LoadState =
  | { status: 'loading' }
  | { status: 'misconfigured'; errorMessage: string }
  | { status: 'error'; errorMessage: string }
  | { status: 'ready'; tree: ContentTree };

type LoadAction =
  | { type: 'misconfigured'; message: string }
  | { type: 'error'; message: string }
  | { type: 'ready'; tree: ContentTree };

function loadReducer(state: LoadState, action: LoadAction): LoadState {
  switch (action.type) {
    case 'misconfigured':
      return { status: 'misconfigured', errorMessage: action.message };
    case 'error':
      return { status: 'error', errorMessage: action.message };
    case 'ready':
      return { status: 'ready', tree: action.tree };
    default:
      return state;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [load, dispatch] = useReducer(loadReducer, { status: 'loading' });

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      dispatch({
        type: 'misconfigured',
        message: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See .env.example.',
      });
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const client = createBrowserSupabaseClient();
        const rows = await fetchContentRows(client);
        if (cancelled) return;
        const tree = buildContentTree(rows);
        dispatch({ type: 'ready', tree });
      } catch (e) {
        if (cancelled) return;
        dispatch({
          type: 'error',
          message: e instanceof Error ? e.message : 'Failed to load content.',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const api = useMemo((): ContentApi | undefined => {
    if (load.status !== 'ready') return undefined;
    const { tree } = load;
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
  }, [load]);

  const value = useMemo<ContentStateValue>(() => {
    switch (load.status) {
      case 'loading':
        return { status: 'loading' };
      case 'misconfigured':
        return { status: 'misconfigured', errorMessage: load.errorMessage };
      case 'error':
        return { status: 'error', errorMessage: load.errorMessage };
      case 'ready':
        return { status: 'ready', api };
    }
  }, [load, api]);

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
