export type UpdateStatus = 'live' | 'rolling-out' | 'planned';

export type SiteUpdate = {
  id: string;
  title: string;
  status: UpdateStatus;
  summary: string;
  whyItMatters: string;
  whatYouWillNotice: string;
};

export const CLIENT_SITE_UPDATES_INTRO = {
  eyebrow: 'For Sonika & the Eyes Closed team',
  title: 'How we are helping more people find you',
  lede:
    'This page is a quiet behind-the-scenes look at the work we are doing so the right people can discover Eyes Closed, understand the message, and feel at home when they arrive.',
  note:
    'Nothing here changes the voice of the site. It strengthens the paths that lead people to your words.',
};

export const SITE_UPDATES: SiteUpdate[] = [
  {
    id: 'first-impression',
    title: 'A clear first impression in the browser',
    status: 'live',
    summary:
      'When someone opens the site, the browser tab now carries your invitation line and a refined Eyes Closed mark instead of a generic placeholder.',
    whyItMatters:
      'People often have many tabs open. A thoughtful title and icon help the site feel intentional and trustworthy before they read a single word.',
    whatYouWillNotice:
      'The tab reads “Remembering Who You Are Beyond The Mind” and shows the Eyes Closed favicon.',
  },
  {
    id: 'search-guidance',
    title: 'Guidance for search engines',
    status: 'live',
    summary:
      'We added a small instructions file (robots.txt) that tells search engines which pages to explore and which quiet corners to skip, such as sign-in screens and internal design pages.',
    whyItMatters:
      'Search engines do their best work when they are pointed toward the pages that matter: Home, The Practice, Formless, Science, About, and your legal pages.',
    whatYouWillNotice:
      'You will not see this on the site itself. It works in the background so public teaching pages get more attention than login or draft areas.',
  },
  {
    id: 'ai-welcome',
    title: 'A welcome guide for AI assistants',
    status: 'rolling-out',
    summary:
      'We are adding two companion files at the root of the website: a short index (llms.txt) and a fuller readable guide (llms-full.txt) written for AI systems that help people search and explore the web.',
    whyItMatters:
      'More people are discovering websites through AI assistants, not only traditional search. These files introduce Eyes Closed in your language, point to the right pages, and help tools describe the work accurately.',
    whatYouWillNotice:
      'When complete, visiting eyesclosed.love/llms.txt will show a curated overview. The full guide will mirror your public page content so AI answers stay aligned with what visitors see on the site.',
  },
  {
    id: 'content-system',
    title: 'A flexible content system behind the pages',
    status: 'live',
    summary:
      'The words on your main pages live in a structured content system so copy updates can be made with care and consistency, without rebuilding the entire site each time.',
    whyItMatters:
      'As your message evolves, small refinements to headlines, bios, or section copy can flow through quickly while the design stays calm and cohesive.',
    whatYouWillNotice:
      'The site you see today already runs on this system. Future text refinements become smoother and safer to publish.',
  },
  {
    id: 'listening',
    title: 'Thoughtful listening, not surveillance',
    status: 'live',
    summary:
      'We added privacy-conscious analytics so we can see which pages people visit and how they move through the site, without collecting unnecessary personal detail.',
    whyItMatters:
      'Gentle insight helps us learn what resonates: which invitations people open, where they pause, and whether the journey feels clear. That informs better structure and copy over time.',
    whatYouWillNotice:
      'There is no change to how visitors experience the site. This is a quiet layer for the team building and caring for the website.',
  },
  {
    id: 'email-community',
    title: 'Ways to stay close',
    status: 'live',
    summary:
      'Book waitlist and Stay Close sign-up flows are connected so interest can be welcomed, remembered, and honored with clear privacy language.',
    whyItMatters:
      'Discovery is only the first step. When someone feels moved to stay in touch, the path should feel as calm and trustworthy as the rest of Eyes Closed.',
    whatYouWillNotice:
      'Forms on the Book and About pages, plus dedicated Privacy and Terms pages that explain how information is handled.',
  },
  {
    id: 'member-space',
    title: 'A private area for what comes next',
    status: 'live',
    summary:
      'Sign-in is in place for a members area that is not public yet. This page lives in that private space so you can see progress without exposing work-in-progress to search engines.',
    whyItMatters:
      'Some updates are meant for you first: previews, notes, and explanations like this one. The foundation is ready when you want to open more behind the login.',
    whatYouWillNotice:
      'You can sign in to view this page. It is not linked from the public navigation, and search engines are asked not to index it.',
  },
  {
    id: 'sitemap',
    title: 'A map of the public site',
    status: 'planned',
    summary:
      'A sitemap will list the public pages in one place for search engines, complementing the AI welcome guide and robots instructions.',
    whyItMatters:
      'Think of it as a table of contents for the open web. It helps search tools find every page you want shared, especially as new offerings appear.',
    whatYouWillNotice:
      'No visible change for visitors. Search tools will have an easier time discovering new pages when they go live.',
  },
];

export const CLIENT_SITE_UPDATES_CLOSING = {
  title: 'What this means for Eyes Closed',
  paragraphs: [
    'Together, these updates do one thing: they make it easier for the right person to arrive, feel the tone of the work, and find their way to what matters, whether they come from search, social, word of mouth, or an AI assistant.',
    'The site itself remains the source of truth. Everything we add in the background simply helps that truth travel further, with clarity and care.',
    'Questions about anything on this page are welcome. This is your space to understand what we are building and why.',
  ],
};

export const STATUS_LABELS: Record<UpdateStatus, string> = {
  live: 'Live now',
  'rolling-out': 'Rolling out',
  planned: 'Coming soon',
};
