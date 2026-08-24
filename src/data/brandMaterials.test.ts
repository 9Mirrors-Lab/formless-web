import { describe, expect, it } from 'vitest';

import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  BRAND_ASSET_FAMILIES,
  BRAND_DESIGNS,
  activeDesigns,
  designById,
  designChipFacetLabel,
  designChips,
  designCurrentVersion,
  designKindLabel,
  designPreviewSrc,
  designVersionRoleLabel,
  designsByKind,
  draftDesigns,
  liveWindowLabel,
  materialStatusLabel,
} from '@/data/brandMaterials';

describe('brandMaterials', () => {
  it('keeps special preview as the live microsite with no extra versions', () => {
    const design = designById('special-preview');
    expect(design).toBeDefined();
    expect(design?.status).toBe('active');
    expect(design?.kind).toBe('microsite');
    expect(design?.campaign).toBe('Pre-launch');
    expect(design?.audience).toBe('Waitlist');
    expect(design?.channel).toBe('Email');
    expect(design?.owner).toBe('Soni');
    expect(design?.liveFrom).toBe('2026-08-22');
    expect(design?.liveUntil).toBe('2026-09-14');
    expect(design?.href).toBe('/special-preview');
    expect(design?.usedFor.toLowerCase()).toContain('waitlist');
    expect(design?.aliases).toContain('/preorder');
    expect(designPreviewSrc(design!)).toBe('/design/previews/special-preview.jpg');
    expect(designPreviewSrc(design!)).not.toBe(FORMLESS_BOOK_COVER.src);
    expect(design?.versions).toHaveLength(1);
    expect(design?.versions[0]?.filename).toBe('special-preview.jpg');
  });

  it('puts the named boards and letter mocks together under Stay Close', () => {
    const design = designById('stay-close-letter');
    expect(design).toBeDefined();
    expect(design?.kind).toBe('zoho-email');
    expect(design?.campaign).toBe('Stay Close');
    expect(designCurrentVersion(design!).id).toBe('template');
    expect(design?.versions.map((version) => version.filename)).toEqual([
      'formless-waitlist-thankyou-brandkit.png',
      'formless-waitlist-listen-first-page.png',
      'formless-waitlist-editorial-page.png',
      'formless-preorder-page-concepts.png',
      'formless-stay-close-newsletter-brandkit.png',
      'formless-stay-close-newsletter-template.png',
      'formless-waitlist-email-intended.jpg',
    ]);
    expect(designById('waitlist-thankyou')).toBeUndefined();
  });

  it('does not flatten explorations into their own design rows', () => {
    expect(BRAND_DESIGNS.map((design) => design.id)).toEqual([
      'special-preview',
      'stay-close-letter',
      'waitlist-letter',
      'kindle-preorder',
    ]);
    expect(designsByKind('zoho-email')).toHaveLength(3);
    expect(designsByKind('page')).toHaveLength(0);
  });

  it('lists the coded waitlist and Kindle preorder letters', () => {
    const waitlist = designById('waitlist-letter');
    const preorder = designById('kindle-preorder');
    expect(waitlist?.href).toBe('/email-previews/waitlist-intended.html');
    expect(designPreviewSrc(waitlist!)).toBe(
      '/design/previews/formless-waitlist-email-html.png',
    );
    expect(preorder?.href).toBe('/emails/formless-preorder.html');
    expect(designPreviewSrc(preorder!)).toBe(
      '/design/previews/formless-preorder-email.png',
    );
  });

  it('exposes kind, campaign, audience, channel, and owner as chips', () => {
    const design = designById('special-preview');
    expect(design).toBeDefined();
    if (!design) return;
    const chips = designChips(design);
    expect(chips.map((chip) => chip.facet)).toEqual([
      'kind',
      'campaign',
      'audience',
      'channel',
      'owner',
    ]);
    expect(chips.map((chip) => chip.label)).toEqual([
      'Microsite',
      'Pre-launch',
      'Waitlist',
      'Email',
      'Soni',
    ]);
    expect(chips.map((chip) => designChipFacetLabel(chip.facet))).toEqual([
      'Kind',
      'Campaign',
      'Audience',
      'Channel',
      'Owner',
    ]);
    expect(liveWindowLabel(design.liveFrom!, design.liveUntil!)).toBe('Aug 22 – Sep 14');
  });

  it('filters designs by kind', () => {
    expect(designsByKind('microsite')).toHaveLength(1);
    expect(designsByKind('zoho-email')).toHaveLength(3);
    expect(designsByKind('all')).toHaveLength(BRAND_DESIGNS.length);
  });

  it('keeps Kindle and print covers in one family', () => {
    const covers = BRAND_ASSET_FAMILIES.find((family) => family.id === 'formless-cover');
    expect(covers).toBeDefined();
    const ids = covers?.variants.map((variant) => variant.id);
    expect(ids).toEqual(['ebook', 'print']);
    expect(covers?.variants[0]?.src).toBe(FORMLESS_BOOK_COVER.src);
    expect(covers?.variants[0]?.canonicalPath).toBe('/book-covers/formless-ebook.jpg');
    expect(covers?.variants[1]?.canonicalPath).toBe('/book-covers/formless-print.jpg');
  });

  it('splits live from in-work', () => {
    expect(activeDesigns().every((design) => design.status === 'active')).toBe(true);
    expect(draftDesigns().every((design) => design.status === 'draft')).toBe(true);
    expect(activeDesigns()).toHaveLength(1);
    expect(draftDesigns()).toHaveLength(3);
  });

  it('labels status, kind, and version roles in studio language', () => {
    expect(materialStatusLabel('active')).toBe('Active');
    expect(materialStatusLabel('archived')).toBe('Archived');
    expect(materialStatusLabel('draft')).toBe('Draft');
    expect(designKindLabel('microsite')).toBe('Microsite');
    expect(designKindLabel('page')).toBe('Page');
    expect(designKindLabel('zoho-email')).toBe('Zoho email');
    expect(designKindLabel('kit')).toBe('Kit');
    expect(designVersionRoleLabel('live')).toBe('Live');
    expect(designVersionRoleLabel('intended')).toBe('Intended');
    expect(designVersionRoleLabel('system')).toBe('System');
    expect(designVersionRoleLabel('exploration')).toBe('Exploration');
    expect(designVersionRoleLabel('mock')).toBe('Mock');
  });
});
