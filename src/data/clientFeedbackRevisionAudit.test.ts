import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { buildContentTree, getLink, getText, type ContentRow, type ContentTree } from '@/lib/content';
import { applyClientFeedbackRevision } from '@/data/clientFeedbackRevisionContent';

function parseSeedValue(rest: string): { value: Record<string, unknown>; remainder: string } | null {
  if (rest.startsWith('$c$')) {
    const end = rest.indexOf('$c$', 3);
    if (end === -1) return null;
    const raw = rest.slice(3, end);
    let remainder = rest.slice(end + 3);
    if (remainder.startsWith('::jsonb')) remainder = remainder.slice('::jsonb'.length);
    return { value: JSON.parse(raw) as Record<string, unknown>, remainder };
  }

  if (!rest.startsWith("'")) return null;

  let i = 1;
  while (i < rest.length) {
    if (rest[i] === "'") {
      if (rest[i + 1] === "'") {
        i += 2;
        continue;
      }

      const raw = rest.slice(1, i).replace(/''/g, "'");
      let remainder = rest.slice(i + 1);
      if (remainder.startsWith('::jsonb')) remainder = remainder.slice('::jsonb'.length);
      return { value: JSON.parse(raw) as Record<string, unknown>, remainder };
    }
    i += 1;
  }

  return null;
}

function loadSeedTree(): ContentTree {
  const seed = readFileSync(
    fileURLToPath(new URL('../../supabase/migrations/20260504000001_seed_content.sql', import.meta.url)),
    'utf8',
  );

  const rows: ContentRow[] = [];
  const rowStart = /^\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*/;

  for (const line of seed.split('\n')) {
    const trimmed = line.trim();
    const match = trimmed.match(rowStart);
    if (!match) continue;

    const [, page, section, key] = match;
    const afterKey = trimmed.slice(match[0].length);
    const parsed = parseSeedValue(afterKey);
    if (!parsed) continue;

    const tail = parsed.remainder.trim();
    const tailMatch = tail.match(/^,\s*'([^']+)',\s*(\d+)\),?$/);
    if (!tailMatch) continue;

    const [, type, order] = tailMatch;

    rows.push({
      id: `${page}-${section}-${key}`,
      page,
      section,
      key,
      value: parsed.value,
      type,
      order: Number(order),
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    });
  }

  return buildContentTree(rows);
}

function revised(): ContentTree {
  return applyClientFeedbackRevision(loadSeedTree());
}

describe('client feedback revision audit (/revised)', () => {
  const tree = revised();

  it('#2 nav: The Work → The Practice', () => {
    expect(getLink(tree, 'nav', 'links', 'work').text).toBe('The Practice');
    expect(getLink(tree, 'footer', 'explore', 'work').text).toBe('The Practice');
  });

  it('#3 nav brand: Formless → Eyes Closed', () => {
    expect(getText(tree, 'nav', 'brand', 'name')).toBe('Eyes Closed');
  });

  it('#4 brand hierarchy: Formless remains book nav label', () => {
    expect(getLink(tree, 'nav', 'links', 'book').text).toBe('Formless');
    expect(getText(tree, 'nav', 'brand', 'name')).not.toBe('Formless');
  });

  it('#5 nav science label uses Spirituality & Science', () => {
    expect(getLink(tree, 'nav', 'links', 'science').text).toBe('Spirituality & Science');
  });

  it('#6 footer connect language aligns Stay Close → Connect', () => {
    expect(getText(tree, 'footer', 'connect', 'heading')).toBe('Connect');
    expect(getLink(tree, 'footer', 'connect', 'stay_close').text).toBe('Connect');
  });

  it('#7 hero headline becomes Remembering Who You Are Beyond The Mind', () => {
    expect(getText(tree, 'home', 'hero', 'headline_primary')).toBe('Remembering Who You Are');
    expect(getText(tree, 'home', 'hero', 'headline_secondary')).toBe('Beyond The Mind');
  });

  it('#8 hero lede introduces Eyes Closed inward framing', () => {
    expect(getText(tree, 'home', 'hero', 'lede')).toContain('Eyes Closed points you inward');
  });

  it('#9 invitation appears in hero eyebrow', () => {
    expect(getText(tree, 'home', 'hero', 'eyebrow')).toBe('An Invitation to go within.');
  });

  it('#10 hero CTA uses A moment to go within', () => {
    expect(getLink(tree, 'home', 'hero', 'cta_reflection').text).toBe('A moment to go within');
  });

  it('#11 curtain panels use THE / MIND instead of THE / VOICE', () => {
    expect(getText(tree, 'home', 'curtain', 'panel_left')).toBe('THE');
    expect(getText(tree, 'home', 'curtain', 'panel_right')).toBe('MIND');
  });

  it('#12 curtain body uses freedom / observe the mind copy', () => {
    expect(getText(tree, 'home', 'curtain', 'headline_line1')).toContain(
      'Freedom begins the moment you separate yourself from your thoughts',
    );
    expect(getText(tree, 'home', 'curtain', 'headline_line2')).toContain('observe the mind');
  });

  it('#15 curtain subtitle uses awareness insight copy', () => {
    expect(getText(tree, 'home', 'curtain', 'subtitle')).toContain(
      'Behind every thought is the awareness that sees it',
    );
  });

  it('#14/#27 invitation tagline is applied in footer brand', () => {
    expect(getText(tree, 'footer', 'brand', 'tagline')).toBe(
      'An invitation to go within and meet yourself beyond the identities and stories.',
    );
  });

  it('#16 work eyebrow becomes The Practice', () => {
    expect(getText(tree, 'work', 'header', 'eyebrow')).toBe('The Practice');
  });

  it('#17 work header lede reflects inner-struggle teaching', () => {
    expect(getText(tree, 'work', 'header', 'lede')).toBe(
      'Beneath every inner struggle is unconscious identification with thought.',
    );
  });

  it('#18 accordion intro copy is adapted into two title lines', () => {
    expect(getText(tree, 'work', 'accordion_intro', 'title_line1')).toBe('Outer circumstances change.');
    expect(getText(tree, 'work', 'accordion_intro', 'title_line2')).toBe('The pattern remains.');
  });

  it('#20 relationships category uses richer proposed copy', () => {
    const item = tree.pages.work.categories.byKey.relationships.value;
    expect(item.detail).toContain('Your partner, your children, your parents or extended family');
  });

  it('#21 career title becomes Career & Financial Wealth', () => {
    expect(tree.pages.work.categories.byKey.career.value.title).toBe('Career & Financial Wealth');
  });

  it('#22 career insight uses softer proposed wording', () => {
    expect(tree.pages.work.categories.byKey.career.value.insight).toContain(
      'losing it can feel like losing yourself',
    );
  });

  it('#24 body category uses memorizes / conditioned patterns copy', () => {
    expect(tree.pages.work.categories.byKey.body.value.insight).toBe(
      'The body memorizes what the mind repeatedly lives in.',
    );
  });

  it('#25 family category removes software metaphor', () => {
    const family = tree.pages.work.categories.byKey.family.value;
    expect(String(family.detail)).toContain('Family dynamics shape many of the beliefs');
    expect(String(family.detail)).not.toContain('software');
  });

  it('#29-31 work reframe block uses proposed teaching copy', () => {
    expect(getText(tree, 'work', 'reframe', 'heading')).toBe('You are not your thoughts or beliefs.');
    expect(getText(tree, 'work', 'reframe', 'emphasis')).toContain('You are awareness');
    expect(getText(tree, 'work', 'reframe', 'body')).toContain('something deeper than the mind begins to emerge');
  });

  it('book/science closing CTAs use revised labels', () => {
    expect(getLink(tree, 'book', 'closing', 'cta_work').text).toBe('Explore The Practice');
    expect(getLink(tree, 'book', 'closing', 'cta_science').text).toBe('Read Spirituality & Science');
    expect(getLink(tree, 'science', 'closing', 'cta_work').text).toBe('Explore The Practice');
    expect(getLink(tree, 'science', 'closing', 'cta_book').text).toBe('Read Formless');
  });

  it('revised routes are prefixed with /revised', () => {
    expect(getLink(tree, 'nav', 'links', 'work').href).toBe('/revised/work');
    expect(getLink(tree, 'home', 'hero', 'cta_reflection').href).toBe('/revised#reflection');
  });
});

describe('client feedback revision gaps', () => {
  const tree = revised();

  it('#1 Ryan unresolved hero note remains unimplemented by design', () => {
    expect(getText(tree, 'home', 'hero', 'headline_primary')).not.toBe('change this.');
  });

  it('#13 reflection EYES CLOSED label is not mapped to a content field', () => {
    const homeKeys = Object.keys(tree.pages.home ?? {});
    expect(homeKeys).not.toContain('reflection');
  });

  it('#19 accordion eyebrow still says The Pattern Repeats instead of Outer circumstances change', () => {
    expect(getText(tree, 'work', 'accordion_intro', 'eyebrow')).toBe('The Pattern Repeats');
  });

  it('#23 career detail omits stems from survival phrase from feedback', () => {
    expect(String(tree.pages.work.categories.byKey.career.value.detail)).not.toContain('stems from survival');
  });

  it('#26 work closing CTA is still Explore Formless, not EYES CLOSED', () => {
    expect(getLink(tree, 'work', 'reframe', 'cta_book').text).toBe('Explore Formless');
  });

  it('#28 future theme pillars are not implemented in revised pages', () => {
    expect(tree.pages.work.categories.byKey.awareness).toBeUndefined();
  });

  it('book page uses pre-release copy and notify form content', () => {
    expect(getText(tree, 'book', 'header', 'lede')).toContain('voice in your head');
    expect(getText(tree, 'book', 'header', 'notify_heading')).toContain('Join the waitlist');
    expect(getText(tree, 'book', 'header', 'notify_cta')).toBe('Notify me');
    expect(getText(tree, 'science', 'header', 'title')).toContain('bridge for the part of you');
  });

  it('about page copy is untouched in revision transform', () => {
    expect(getText(tree, 'about', 'hero', 'title')).toBe('About the Author');
    expect(getText(tree, 'about', 'hero', 'body_para1')).toContain('Awareness Guide');
  });
});
