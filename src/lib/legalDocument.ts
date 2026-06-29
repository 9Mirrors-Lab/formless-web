import type { ContentApi } from '@/context/ContentContext';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  intro: string;
  contactEmail: string;
  sections: LegalSection[];
};

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function sectionFromEntry(value: Record<string, unknown>): LegalSection | null {
  const id = typeof value.id === 'string' ? value.id : '';
  const title = typeof value.title === 'string' ? value.title : '';
  const paragraphs = stringArray(value.paragraphs);
  if (!id || !title || paragraphs.length === 0) return null;

  const list = stringArray(value.list);
  return list.length > 0 ? { id, title, paragraphs, list } : { id, title, paragraphs };
}

export function legalDocumentFromContent(api: ContentApi, page: string): LegalDocument | null {
  const title = api.getText(page, 'header', 'title');
  const effectiveDate = api.getText(page, 'header', 'effective_date');
  const intro = api.getText(page, 'header', 'intro');
  const contactEmail = api.getText(page, 'header', 'contact_email');

  const sections = api
    .listItems(page, 'sections')
    .map((entry) => sectionFromEntry(entry.value))
    .filter((section): section is LegalSection => section !== null);

  if (!title || !effectiveDate || !intro || sections.length === 0) {
    return null;
  }

  return {
    title,
    effectiveDate,
    intro,
    contactEmail: contactEmail || 'hello@eyesclosed.love',
    sections,
  };
}
