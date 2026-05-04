-- Seed marketing copy (upsert for idempotent re-runs)

INSERT INTO public.content (page, section, key, value, type, "order") VALUES

-- nav
('nav', 'brand', 'name', '{"text": "Formless"}', 'text', 0),
('nav', 'links', 'work', '{"text": "The Work", "href": "/work"}', 'link', 0),
('nav', 'links', 'book', '{"text": "The Book", "href": "/book"}', 'link', 1),
('nav', 'links', 'science', '{"text": "Science", "href": "/science"}', 'link', 2),
('nav', 'cta', 'about', '{"text": "About", "href": "/about"}', 'link', 0),

-- footer
('footer', 'brand', 'name', '{"text": "Formless"}', 'text', 0),
('footer', 'brand', 'tagline', '{"text": "A quiet invitation to stop, pause, go within, and begin to live with more space, peace, and groundedness."}', 'text', 0),
('footer', 'explore', 'heading', '{"text": "Explore"}', 'text', 0),
('footer', 'connect', 'heading', '{"text": "Connect"}', 'text', 0),
('footer', 'explore', 'work', '{"text": "The Work", "href": "/work"}', 'link', 0),
('footer', 'explore', 'book', '{"text": "The Book", "href": "/book"}', 'link', 1),
('footer', 'explore', 'science', '{"text": "The Science", "href": "/science"}', 'link', 2),
('footer', 'connect', 'about', '{"text": "About", "href": "/about"}', 'link', 0),
('footer', 'connect', 'stay_close', '{"text": "Stay Close", "href": "/about#stay-close"}', 'link', 1),
('footer', 'connect', 'contact', '{"text": "Contact", "href": "mailto:hello@formless.co"}', 'link', 2),
('footer', 'legal', 'copyright', '{"text": "© 2026 Formless. All rights reserved."}', 'text', 0),
('footer', 'legal', 'privacy', '{"text": "Privacy", "href": "#"}', 'link', 0),
('footer', 'legal', 'terms', '{"text": "Terms", "href": "#"}', 'link', 1),

-- home hero
('home', 'hero', 'eyebrow', '{"text": "For anyone who has had enough"}', 'text', 0),
('home', 'hero', 'headline_primary', '{"text": "There is another"}', 'text', 0),
('home', 'hero', 'headline_secondary', '{"text": "way to live."}', 'text', 0),
('home', 'hero', 'lede', '{"text": "Stop. Pause. Go within. Notice the voice in the head. Notice the story it is telling. If you can hear it, who is listening?"}', 'text', 0),
('home', 'hero', 'cta_reflection', '{"text": "Begin with a reflection", "href": "#reflection"}', 'link', 0),
('home', 'hero', 'background_image', '{"src": "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1920&q=80"}', 'image', 0),

-- home curtain
('home', 'curtain', 'headline_line1', '{"text": "If you can hear the voice,"}', 'text', 0),
('home', 'curtain', 'headline_line2', '{"text": "who is listening?"}', 'text', 0),
('home', 'curtain', 'subtitle', '{"text": "There is the voice in your head, narrating the problem. And then there is the awareness observing it. You are not the voice."}', 'text', 0),
('home', 'curtain', 'panel_left', '{"text": "THE"}', 'text', 0),
('home', 'curtain', 'panel_right', '{"text": "VOICE"}', 'text', 0),

-- work
('work', 'header', 'eyebrow', '{"text": "The Work"}', 'text', 0),
('work', 'header', 'title_line1', '{"text": "Every problem points"}', 'text', 0),
('work', 'header', 'title_line2', '{"text": "back within."}', 'text', 0),
('work', 'header', 'lede', '{"text": "The situation may change. The subject may change. But the pattern beneath stays the same until it is seen."}', 'text', 0),
('work', 'accordion_intro', 'eyebrow', '{"text": "The pattern repeats"}', 'text', 0),
('work', 'accordion_intro', 'title_line1', '{"text": "The subject changes."}', 'text', 0),
('work', 'accordion_intro', 'title_line2', '{"text": "The pattern remains."}', 'text', 0),
('work', 'reframe', 'eyebrow', '{"text": "The central insight"}', 'text', 0),
('work', 'reframe', 'heading', '{"text": "There is a voice in the head."}', 'text', 0),
('work', 'reframe', 'emphasis', '{"text": "Who is listening?"}', 'text', 0),
('work', 'reframe', 'body', '{"text": "If you can hear the voice, you are not the voice. You are the awareness behind it. This recognition creates space, and in that space, freedom begins."}', 'text', 0),
('work', 'reframe', 'cta_book', '{"text": "Explore the book", "href": "/book"}', 'link', 0),

('work', 'categories', 'relationships', $c${"id": "relationships", "title": "Relationships", "image": "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=1000&fit=crop&q=80", "insight": "The trigger is never the other person.", "detail": "Every reaction in a relationship is a mirror of something unresolved within. The partner, the child, the parent: each one activates what was already there."}$c$::jsonb, 'list_item', 0),
('work', 'categories', 'career', $c${"id": "career", "title": "Career & Money", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop&q=80", "insight": "When work becomes identity, losing it feels like dying.", "detail": "The fear around money and career is rarely about survival. It is about the story the mind tells about who you are without it."}$c$::jsonb, 'list_item', 1),
('work', 'categories', 'body', $c${"id": "body", "title": "Body & Health", "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop&q=80", "insight": "The body keeps the score of every unresolved thought.", "detail": "Chronic tension, exhaustion, and pain are often the body expressing what the mind refuses to acknowledge. Awareness interrupts the loop."}$c$::jsonb, 'list_item', 2),
('work', 'categories', 'family', $c${"id": "family", "title": "Family & Origins", "image": "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=1000&fit=crop&q=80", "insight": "The oldest patterns are the hardest to see.", "detail": "Family dynamics installed the original software. Seeing the pattern is the beginning of freedom from it, not by fighting, but by noticing."}$c$::jsonb, 'list_item', 3),

-- book
('book', 'header', 'eyebrow', '{"text": "The Manuscript"}', 'text', 0),
('book', 'header', 'title', '{"text": "The book is a doorway into the recognition."}', 'text', 0),
('book', 'header', 'lede', '{"text": "Not a method. Not a program. A quiet invitation to stop and see what is already here: the awareness behind every thought, every feeling, every story."}', 'text', 0),
('book', 'header', 'cta_excerpt', '{"text": "Read an excerpt", "href": "#"}', 'link', 0),
('book', 'cover', 'title', '{"text": "Formless"}', 'text', 0),

('book', 'quotes', 'quote_0', '{"text": "You do not have to rearrange your entire life to begin."}', 'text', 0),
('book', 'quotes', 'quote_1', '{"text": "For one moment, stop. Notice the voice in the head. Notice the story it is telling."}', 'text', 1),
('book', 'quotes', 'quote_2', '{"text": "If you can hear it, who is listening?"}', 'text', 2),

('book', 'themes_intro', 'eyebrow', '{"text": "What the book points to"}', 'text', 0),
('book', 'themes_intro', 'title', '{"text": "Four recognitions."}', 'text', 0),

('book', 'themes', 'awareness', $c${"label": "Awareness", "title": "Seeing without judgment", "desc": "The book invites you to notice thought without engaging with it, and to become the observer rather than the participant."}$c$::jsonb, 'list_item', 0),
('book', 'themes', 'presence', $c${"label": "Presence", "title": "Arriving in this moment", "desc": "Not the past. Not the future. The teaching points to what is already here, already available, already at peace."}$c$::jsonb, 'list_item', 1),
('book', 'themes', 'peace', $c${"label": "Peace", "title": "Not circumstantial", "desc": "Peace does not depend on life arranging itself perfectly. It is the recognition that you are already the space in which life unfolds."}$c$::jsonb, 'list_item', 2),
('book', 'themes', 'freedom', '{"label": "Freedom", "title": "From the pattern itself", "desc": "Not freedom from life''s difficulties, but freedom from the mind''s compulsive narration about them."}'::jsonb, 'list_item', 3),

('book', 'closing', 'lede', '{"text": "The work begins with a single recognition."}', 'text', 0),
('book', 'closing', 'cta_work', '{"text": "Explore the work", "href": "/work"}', 'link', 0),
('book', 'closing', 'cta_science', '{"text": "Read the science", "href": "/science"}', 'link', 1),

-- science
('science', 'header', 'eyebrow', '{"text": "A Quiet Bridge"}', 'text', 0),
('science', 'header', 'title', '{"text": "A bridge for the part of you that needs to understand."}', 'text', 0),
('science', 'header', 'lede', '{"text": "The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one."}', 'text', 0),

('science', 'pillars', 'perception', $c${"label": "Perception", "hook": "Your brain is not showing you reality. It is building a prediction of what reality should be.", "body": "Neuroscience reveals that perception is constructed, not received. What you see is filtered through memory, expectation, and conditioning."}$c$::jsonb, 'list_item', 0),
('science', 'pillars', 'observation', $c${"label": "Observation", "hook": "Conscious observation changes what is being observed.", "body": "The observer effect in quantum mechanics mirrors a deeper truth: awareness itself alters the pattern."}$c$::jsonb, 'list_item', 1),
('science', 'pillars', 'neuroplasticity', $c${"label": "Neuroplasticity", "hook": "The neural pathways of suffering can be interrupted: not by force, but by awareness.", "body": "Repeated patterns of thought create physical grooves in the brain. New attention creates new pathways."}$c$::jsonb, 'list_item', 2),

('science', 'closing', 'eyebrow', '{"text": "The science points to what the teaching already knows"}', 'text', 0),
('science', 'closing', 'title_line1', '{"text": "You are not the constructed perception."}', 'text', 0),
('science', 'closing', 'title_line2', '{"text": "You are the awareness that sees it."}', 'text', 0),
('science', 'closing', 'cta_work', '{"text": "Explore the work", "href": "/work"}', 'link', 0),
('science', 'closing', 'cta_book', '{"text": "Read the book", "href": "/book"}', 'link', 1),

-- about
('about', 'hero', 'image', $c${"src": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop&q=80", "alt": "Mountain above clouds"}$c$::jsonb, 'image', 0),
('about', 'hero', 'eyebrow', '{"text": "The Author"}', 'text', 0),
('about', 'hero', 'title', '{"text": "A living teaching, still unfolding."}', 'text', 0),
('about', 'hero', 'body_para1', '{"text": "This work did not begin as a theory. It began as a breaking point: the moment when the old way of living stopped working entirely, and something quieter took its place."}', 'text', 0),
('about', 'hero', 'body_para2', '{"text": "Formless is the beginning of something larger: a book, future talks, retreats, community, and deeper teachings that all stem from one foundation. That foundation is the recognition that you are not the voice in the head, and that peace does not depend on outer circumstances arranging themselves perfectly."}', 'text', 0),

('about', 'future_intro', 'eyebrow', '{"text": "What is unfolding"}', 'text', 0),
('about', 'future_intro', 'title', '{"text": "The beginning of something larger."}', 'text', 0),

('about', 'future', 'talks', $c${"title": "Talks & Gatherings", "desc": "Intimate spaces where the teaching is shared in person. No stage performance, just presence."}$c$::jsonb, 'list_item', 0),
('about', 'future', 'retreats', $c${"title": "Retreats", "desc": "Structured days of silence, observation, and gentle guidance. A chance to go deeper without distraction."}$c$::jsonb, 'list_item', 1),
('about', 'future', 'community', $c${"title": "Community", "desc": "A quiet circle of people walking the same path. Not a platform, but a space for honest recognition."}$c$::jsonb, 'list_item', 2),
('about', 'future', 'deeper', $c${"title": "Deeper Teachings", "desc": "Material that goes beyond the book. For those who have begun to see and want to see more clearly."}$c$::jsonb, 'list_item', 3),

('about', 'stay_close', 'eyebrow', '{"text": "Stay Close"}', 'text', 0),
('about', 'stay_close', 'title', '{"text": "Return when you are ready."}', 'text', 0),
('about', 'stay_close', 'lede', '{"text": "Receive reflections, notes from the desk, and the occasional silence. No urgency. No pressure. Just a quiet thread when there is something worth sharing."}', 'text', 0),
('about', 'stay_close', 'email_placeholder', '{"text": "Your email"}', 'text', 0),
('about', 'stay_close', 'submit', '{"text": "Stay close"}', 'text', 0),
('about', 'stay_close', 'fine_print', '{"text": "No spam. Unsubscribe anytime."}', 'text', 0),
('about', 'stay_close', 'form_success', '{"text": "Thank you. We will be in touch."}', 'text', 0),
('about', 'stay_close', 'email_link', '{"text": "hello@formless.co", "href": "mailto:hello@formless.co"}', 'link', 0)

ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
