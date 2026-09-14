INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('book', 'header', 'purchase_eyebrow', '{"text": "Out now"}', 'text', 8),
  (
    'book',
    'header',
    'purchase_lede',
    '{"text": "Now available on Kindle and Audible."}',
    'text',
    9
  )
ON CONFLICT (page, section, key) DO UPDATE
SET value = EXCLUDED.value;

DELETE FROM public.content
WHERE page = 'book'
  AND section = 'header'
  AND key IN ('purchase_title', 'purchase_cta');
