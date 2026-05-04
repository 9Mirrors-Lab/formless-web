import { describe, expect, it } from 'vitest';

import { buildContentTree, type ContentRow, listItemsBySection, textFromEntry } from './content';

function row(partial: Partial<ContentRow> & Pick<ContentRow, 'page' | 'section' | 'key'>): ContentRow {
  return {
    id: partial.id ?? '00000000-0000-0000-0000-000000000000',
    page: partial.page,
    section: partial.section,
    key: partial.key,
    value: partial.value ?? {},
    type: partial.type ?? 'text',
    order: partial.order ?? 0,
    is_published: partial.is_published ?? true,
    created_at: partial.created_at ?? '2026-01-01T00:00:00Z',
    updated_at: partial.updated_at ?? '2026-01-01T00:00:00Z',
  };
}

describe('buildContentTree', () => {
  it('nests by page and section and sorts by order', () => {
    const rows = [
      row({
        page: 'book',
        section: 'quotes',
        key: 'quote_1',
        value: { text: 'Second' },
        order: 1,
      }),
      row({
        page: 'book',
        section: 'quotes',
        key: 'quote_0',
        value: { text: 'First' },
        order: 0,
      }),
    ];
    const tree = buildContentTree(rows);
    const ordered = tree.pages.book?.quotes?.ordered ?? [];
    expect(ordered.map((e) => e.key)).toEqual(['quote_0', 'quote_1']);
    expect(textFromEntry(ordered[0]!)).toBe('First');
  });

  it('collects list_item types', () => {
    const rows = [
      row({
        page: 'work',
        section: 'categories',
        key: 'a',
        value: { id: 'a', title: 'A' },
        type: 'list_item',
        order: 1,
      }),
      row({
        page: 'work',
        section: 'categories',
        key: 'b',
        value: { id: 'b', title: 'B' },
        type: 'list_item',
        order: 0,
      }),
      row({
        page: 'work',
        section: 'categories',
        key: 'note',
        value: { text: 'x' },
        type: 'text',
        order: 2,
      }),
    ];
    const tree = buildContentTree(rows);
    const items = listItemsBySection(tree, 'work', 'categories');
    expect(items.map((i) => i.key)).toEqual(['b', 'a']);
  });
});
