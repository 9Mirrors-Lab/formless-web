INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('book', 'header', 'notify_heading', '{"text": "Join the waitlist and be the first to know when the book is here."}', 'text', 0),
  ('book', 'header', 'notify_meta_release', '{"text": "Releasing September 1"}', 'text', 0),
  ('book', 'header', 'notify_meta_updates', '{"text": "Launch updates"}', 'text', 0),
  ('book', 'header', 'notify_meta_privacy', '{"text": "No spam. Unsubscribe anytime."}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE
SET value = EXCLUDED.value;

UPDATE public.content
SET value = '{"text": "Join the waitlist and be the first to know when the book is here."}'::jsonb
WHERE page = 'book' AND section = 'header' AND key = 'notify_heading';

UPDATE public.content
SET value = '{"text": "Releasing September 1"}'::jsonb
WHERE page = 'book' AND section = 'header' AND key = 'notify_fine_print';
