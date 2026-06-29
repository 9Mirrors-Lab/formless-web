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

function upsertText(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
  text: string,
  order = 0,
) {
  const target = tree.pages[page]?.[section];
  if (!target) return;

  if (target.byKey[key]) {
    setText(tree, page, section, key, text);
    return;
  }

  const entry: ContentEntry = {
    key,
    type: 'text',
    order,
    value: { text },
  };
  target.byKey[key] = entry;
  target.ordered.push(entry);
  target.ordered.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
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

function setImage(
  tree: ContentTree,
  page: string,
  section: string,
  key: string,
  src: string,
  alt = '',
) {
  setEntry(tree, page, section, key, { src, alt });
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
  setLink(revised, 'footer', 'legal', 'privacy', 'Privacy', '/privacy');
  setLink(revised, 'footer', 'legal', 'terms', 'Terms', '/terms');

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
  setImage(revised, 'home', 'hero', 'background_image', '/backgrounds/desert-dusk.jpg');

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
  setText(revised, 'work', 'header', 'title_line2', 'without becoming lost in it.');
  setText(
    revised,
    'work',
    'header',
    'lede',
    'Beneath every inner struggle is unconscious identification with thought.',
  );
  setText(revised, 'work', 'accordion_intro', 'eyebrow', 'The Pattern Repeats Until It Is Seen');
  setText(revised, 'work', 'accordion_intro', 'title_line1', 'Outer circumstances change.');
  setText(revised, 'work', 'accordion_intro', 'title_line2', 'The pattern remains.');
  upsertText(
    revised,
    'work',
    'accordion_intro',
    'lede',
    'Four places in life where suffering often appears',
  );
  setText(revised, 'work', 'reframe', 'eyebrow', 'The Central Insight');
  setText(revised, 'work', 'reframe', 'heading', 'You are not your thoughts or emotions.');
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
    'The mind creates stories, beliefs, and patterns that shape how you experience life. The practice is not to fight the mind, but to become aware of it. As awareness deepens, the patterns begin to lose their hold. In that simple shift, a different way of living begins.',
  );
  setLink(revised, 'work', 'reframe', 'cta_book', 'Explore Formless', '/book');

  setListItem(revised, 'work', 'categories', 'relationships', {
    id: 'relationships',
    title: 'Relationships',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=1000&fit=crop&q=80',
    insight: 'Every reaction in a relationship is a mirror of something unresolved within you.',
    detail:
      'Your partner, children, parents, and family become mirrors, revealing unconscious patterns you have carried from the past into the present moment.',
  });
  setListItem(revised, 'work', 'categories', 'career', {
    id: 'career',
    title: 'Career & Financial Wealth',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop&q=80',
    insight: 'When your job becomes a part of your identity, losing it can feel like losing yourself.',
    detail:
      'The fear around career and money comes from believing your worth depends on what you do, what you earn, or what you own.',
  });
  setListItem(revised, 'work', 'categories', 'body', {
    id: 'body',
    title: 'Body & Health',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop&q=80',
    insight: 'The body memorizes what the mind repeatedly lives in.',
    detail:
      'Stress, tension, exhaustion, and emotional pain become patterns the body learns to carry until they are brought into awareness.',
  });
  setListItem(revised, 'work', 'categories', 'family', {
    id: 'family',
    title: 'Family & Origins',
    image:
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=1000&fit=crop&q=80',
    insight: 'Freedom begins not through blame or resistance, but through awareness.',
    detail:
      'Our earliest relationships shape many of the beliefs, fears, and emotional patterns we carry into adulthood. Awareness is where those patterns begin to lose their hold.',
  });

  setText(revised, 'book', 'header', 'eyebrow', 'The Book');
  setText(
    revised,
    'book',
    'header',
    'title',
    'The book is a doorway into the recognition of who you truly are.',
  );
  setText(
    revised,
    'book',
    'header',
    'lede',
    'You are not your thoughts or emotions. Formless takes you within to discover what exists beyond them.',
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

  setText(revised, 'book', 'quotes', 'quote_0', 'Pause.\nFor one moment, stop. Be here.');
  setText(
    revised,
    'book',
    'quotes',
    'quote_1',
    'Observe.\nNotice your thoughts, emotions, and the story your mind is telling.',
  );
  setText(
    revised,
    'book',
    'quotes',
    'quote_2',
    'Recognize.\nYou are not what you observe. You are the one observing it.',
  );

  setListItem(revised, 'book', 'themes', 'awareness', {
    label: 'Awareness',
    title: 'You are not the mind.',
    desc: 'Learn to observe your thoughts and emotions instead of identifying with them.',
  });
  setListItem(revised, 'book', 'themes', 'presence', {
    label: 'Presence',
    title: 'You are awareness.',
    desc: 'Recognize the quiet presence that has always existed beneath every experience.',
  });
  setListItem(revised, 'book', 'themes', 'peace', {
    label: 'Peace',
    title: 'Peace is acceptance.',
    desc: 'Freedom begins when resistance ends and life is allowed to unfold as it is.',
  });
  setListItem(revised, 'book', 'themes', 'freedom', {
    label: 'Freedom',
    title: 'Life changes from within.',
    desc: 'Bring presence into your relationships, work, and everyday life, supported by insights from both ancient wisdom and modern science.',
  });

  setText(revised, 'book', 'closing', 'lede', 'The practice begins with a single recognition.');
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
  setText(
    revised,
    'about',
    'hero',
    'body_para2',
    'Born in Winnipeg, Canada, to immigrant parents from Punjab, India, Sonika is the youngest of three. Raised in a bilingual household, she learned to speak Punjabi from an early age and has a basic understanding of Hindi. At the age of twenty, she moved to Las Vegas, Nevada, where she has lived ever since. Over the past twenty years, she has built a successful career in Human Resources, spending the last thirteen years in the technology industry helping people and organizations navigate growth, change, and transformation.',
  );
  setText(
    revised,
    'about',
    'hero',
    'body_para6',
    "When she isn't writing or creating, Sonika enjoys spending time with her two children, taking walks in nature with her partner and their two dogs, listening to handpan music, meditating, and exploring the intersection of science, spirituality, and human potential.",
  );
  setListItem(revised, 'about', 'future', 'retreats', {
    title: 'Retreats',
    desc: 'Days of silence and gentle guidance. A chance to go deeper without distraction.',
  });

  return revised;
}
