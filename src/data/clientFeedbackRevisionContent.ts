import type { ContentEntry, ContentTree } from '@/lib/content';

type EntryValue = Record<string, unknown>;

function cloneTree(tree: ContentTree): ContentTree {
  return {
    pages: Object.fromEntries(
      Object.entries(tree.pages).map(([pageName, sections]) => [
        pageName,
        Object.fromEntries(
          Object.entries(sections).map(([sectionName, section]) => [
            sectionName,
            {
              byKey: Object.fromEntries(
                Object.entries(section.byKey).map(([key, entry]) => [
                  key,
                  { ...entry, value: { ...entry.value } },
                ]),
              ),
              ordered: section.ordered.map((entry) => ({
                ...entry,
                value: { ...entry.value },
              })),
            },
          ]),
        ),
      ]),
    ),
  };
}

function setEntry(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
  value: EntryValue,
) {
  const target = tree.pages[page]?.[section];
  const existing = target?.byKey[key];
  if (!target || !existing) return;

  const nextEntry: ContentEntry = {
    ...existing,
    value,
  };

  target.byKey[key] = nextEntry;
  target.ordered = target.ordered.map((entry) => (entry.key === key ? nextEntry : entry));
}

function setText(tree: ContentTree, page: string, section: string, key: string, text: string) {
  setEntry(tree, page, section, key, { text });
}

function setLink(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
  text: string,
  href: string,
) {
  setEntry(tree, page, section, key, { text, href });
}

function setListItem(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
  value: EntryValue,
) {
  setEntry(tree, page, section, key, value);
}

export function applyClientFeedbackRevision(tree: ContentTree): ContentTree {
  const revised = cloneTree(tree);

  setText(revised, 'nav', 'brand', 'name', 'Eyes Closed');
  setLink(revised, 'nav', 'links', 'work', 'The Practice', '/work');
  setLink(revised, 'nav', 'links', 'book', 'Formless', '/book');
  setLink(revised, 'nav', 'links', 'science', 'Spirituality & Science', '/science');
  setLink(revised, 'nav', 'cta', 'about', 'About', '/about');

  setText(revised, 'footer', 'brand', 'name', 'Eyes Closed');
  setText(
    revised,
    'footer',
    'brand',
    'tagline',
    'An invitation to go within and meet yourself beyond the identities and stories.',
  );
  setLink(revised, 'footer', 'explore', 'work', 'The Practice', '/work');
  setLink(revised, 'footer', 'explore', 'book', 'Formless', '/book');
  setLink(revised, 'footer', 'explore', 'science', 'Spirituality & Science', '/science');
  setLink(revised, 'footer', 'connect', 'about', 'About', '/about');
  setLink(revised, 'footer', 'connect', 'stay_close', 'Connect', '/about#stay-close');
  setLink(
    revised,
    'footer',
    'connect',
    'contact',
    'Contact',
    'mailto:hello@eyesclosed.love',
  );
  setText(revised, 'footer', 'legal', 'copyright', '© 2026 Eyes Closed. All rights reserved.');

  setText(revised, 'home', 'hero', 'eyebrow', 'An Invitation to go within');
  setText(revised, 'home', 'hero', 'headline_primary', 'Remembering Who You Are');
  setText(revised, 'home', 'hero', 'headline_secondary', 'Beyond The Mind');
  setText(
    revised,
    'home',
    'hero',
    'lede',
    'The world teaches you to look outward for fulfillment.\nEyes Closed points you inward.',
  );
  setLink(revised, 'home', 'hero', 'cta_reflection', 'A moment to go within', '#reflection');

  setText(
    revised,
    'home',
    'curtain',
    'headline_line1',
    'Freedom begins the moment',
  );
  setText(revised, 'home', 'curtain', 'headline_line2', 'you observe the mind');
  setText(
    revised,
    'home',
    'curtain',
    'subtitle',
    'Behind every thought is the awareness that sees it.\nThat awareness is what you are, untouched\nand unharmed by any experience of life.',
  );
  setText(revised, 'home', 'curtain', 'panel_left', 'THE');
  setText(revised, 'home', 'curtain', 'panel_right', 'MIND');

  setText(revised, 'work', 'header', 'eyebrow', 'The Practice');
  setText(revised, 'work', 'header', 'title_line1', 'Learn to observe the mind');
  setText(revised, 'work', 'header', 'title_line2', 'without becoming lost within it.');
  setText(
    revised,
    'work',
    'header',
    'lede',
    'Beneath every inner struggle is unconscious identification with thought.',
  );
  setText(revised, 'work', 'accordion_intro', 'eyebrow', 'The Pattern Repeats');
  setText(revised, 'work', 'accordion_intro', 'title_line1', 'Outer circumstances change.');
  setText(revised, 'work', 'accordion_intro', 'title_line2', 'The pattern remains.');
  setText(revised, 'work', 'reframe', 'eyebrow', 'The Central Insight');
  setText(revised, 'work', 'reframe', 'heading', 'You are not your thoughts or beliefs.');
  setText(
    revised,
    'work',
    'reframe',
    'emphasis',
    'You are the one that observes them. You are awareness.',
  );
  setText(
    revised,
    'work',
    'reframe',
    'body',
    'The mind creates stories based on the past, and projects fear into the future. Beneath every inner struggle is the identification with thought. The practice is not to fight those thoughts, but to become aware of them. When you begin to recognize these patterns, something deeper than the mind begins to emerge.',
  );
  setLink(revised, 'work', 'reframe', 'cta_book', 'Explore Formless', '/book');

  setListItem(revised, 'work', 'categories', 'relationships', {
    id: 'relationships',
    title: 'Relationships',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=1000&fit=crop&q=80',
    insight: 'Every reaction in a relationship is a mirror of something unresolved within you.',
    detail:
      'Your partner, your children, your parents or extended family. Each one reveals unconscious patterns, thoughts, and beliefs you have carried from the past into the present moment.',
  });
  setListItem(revised, 'work', 'categories', 'career', {
    id: 'career',
    title: 'Career & Financial Wealth',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop&q=80',
    insight: 'When your job becomes a part of your identity, losing it can feel like losing yourself.',
    detail:
      'The fear around career and finances is tied to the story the mind has created about who you are, your worth, and what happens if it all disappears.',
  });
  setListItem(revised, 'work', 'categories', 'body', {
    id: 'body',
    title: 'Body & Health',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop&q=80',
    insight: 'The body memorizes what the mind repeatedly lives in.',
    detail:
      'Stress, chronic tension, exhaustion, and emotional pain become conditioned patterns within the body until they are brought into awareness.',
  });
  setListItem(revised, 'work', 'categories', 'family', {
    id: 'family',
    title: 'Family & Origins',
    image:
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=1000&fit=crop&q=80',
    insight: 'Freedom begins not through blame or resistance, but through awareness.',
    detail:
      'Family dynamics shape many of the beliefs, fears, and emotional patterns carried into adulthood.',
  });

  setText(revised, 'book', 'header', 'eyebrow', 'The Manuscript');
  setText(
    revised,
    'book',
    'header',
    'lede',
    'There is a voice in your head that has been telling you who you are for as long as you can remember. Formless is about what exists beneath it.',
  );
  setText(
    revised,
    'book',
    'header',
    'notify_heading',
    'Join the waitlist and be the first to know when the book is here.',
  );
  setText(revised, 'book', 'header', 'notify_cta', 'Notify me');
  setText(revised, 'book', 'header', 'notify_fine_print', 'Releasing September 1');
  setText(
    revised,
    'book',
    'header',
    'notify_success',
    "You're on the list.",
  );
  setText(
    revised,
    'book',
    'header',
    'notify_error',
    'Enter a valid email, or try again in a moment.',
  );

  setLink(revised, 'book', 'closing', 'cta_work', 'Explore The Practice', '/work');
  setLink(revised, 'book', 'closing', 'cta_science', 'Read Spirituality & Science', '/science');
  setLink(revised, 'science', 'closing', 'cta_work', 'Explore The Practice', '/work');
  setLink(revised, 'science', 'closing', 'cta_book', 'Read Formless', '/book');

  setLink(
    revised,
    'about',
    'stay_close',
    'email_link',
    'hello@eyesclosed.love',
    'mailto:hello@eyesclosed.love',
  );

  return revised;
}
