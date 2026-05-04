import type { BrowserSupabaseClient } from './supabase';

export type ContentRow = {
  id: string;
  page: string;
  section: string;
  key: string;
  value: Record<string, unknown>;
  type: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ContentEntry = {
  key: string;
  type: string;
  order: number;
  value: Record<string, unknown>;
};

export type ContentSection = {
  byKey: Record<string, ContentEntry>;
  ordered: ContentEntry[];
};

export type ContentTree = {
  pages: Record<string, Record<string, ContentSection>>;
};

export type FetchContentOptions = {
  pages?: string[];
};

function mapRow(r: {
  id: string;
  page: string;
  section: string;
  key: string;
  value: unknown;
  type: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}): ContentRow {
  const value =
    r.value && typeof r.value === 'object' && !Array.isArray(r.value)
      ? (r.value as Record<string, unknown>)
      : {};
  return {
    id: r.id,
    page: r.page,
    section: r.section,
    key: r.key,
    value,
    type: r.type,
    order: r.order,
    is_published: r.is_published,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/** Pure transform; test without DB. */
export function buildContentTree(rows: ContentRow[]): ContentTree {
  const pages: ContentTree['pages'] = {};

  for (const row of rows) {
    if (!pages[row.page]) pages[row.page] = {};
    if (!pages[row.page][row.section]) {
      pages[row.page][row.section] = { byKey: {}, ordered: [] };
    }
    const entry: ContentEntry = {
      key: row.key,
      type: row.type,
      order: row.order,
      value: row.value,
    };
    const sec = pages[row.page][row.section];
    sec.byKey[row.key] = entry;
    sec.ordered.push(entry);
  }

  for (const page of Object.values(pages)) {
    for (const section of Object.values(page)) {
      section.ordered.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
    }
  }

  return { pages };
}

export async function fetchContentRows(
  client: BrowserSupabaseClient,
  options: FetchContentOptions = {},
): Promise<ContentRow[]> {
  let q = client
    .from('content')
    .select(
      'id, page, section, key, value, type, order, is_published, created_at, updated_at',
    )
    .eq('is_published', true);

  if (options.pages?.length) {
    q = q.in('page', options.pages);
  }

  const { data, error } = await q.order('page').order('section').order('order').order('key');

  if (error) throw error;
  if (!data) return [];

  return data.map((r) => mapRow(r as Parameters<typeof mapRow>[0]));
}

export function getSection(
  tree: ContentTree,
  page: string,
  section: string,
): ContentSection | undefined {
  return tree.pages[page]?.[section];
}

export function getText(tree: ContentTree, page: string, section: string, key: string): string {
  const v = tree.pages[page]?.[section]?.byKey[key]?.value;
  const t = v?.text;
  return typeof t === 'string' ? t : '';
}

export function getLink(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
): { text: string; href: string } {
  const v = tree.pages[page]?.[section]?.byKey[key]?.value;
  return {
    text: typeof v?.text === 'string' ? v.text : '',
    href: typeof v?.href === 'string' ? v.href : '#',
  };
}

export function getImage(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
): { src: string; alt: string } {
  const v = tree.pages[page]?.[section]?.byKey[key]?.value;
  return {
    src: typeof v?.src === 'string' ? v.src : '',
    alt: typeof v?.alt === 'string' ? v.alt : '',
  };
}

export function listItemsBySection(tree: ContentTree, page: string, section: string): ContentEntry[] {
  return (tree.pages[page]?.[section]?.ordered ?? []).filter((e) => e.type === 'list_item');
}

export function orderedEntries(tree: ContentTree, page: string, section: string): ContentEntry[] {
  return tree.pages[page]?.[section]?.ordered ?? [];
}

export function textFromEntry(entry: ContentEntry): string {
  const t = entry.value.text;
  return typeof t === 'string' ? t : '';
}
