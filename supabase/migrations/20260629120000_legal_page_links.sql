-- Point footer legal links to privacy and terms pages
INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('footer', 'legal', 'privacy', '{"text": "Privacy", "href": "/privacy"}', 'link', 0),
  ('footer', 'legal', 'terms', '{"text": "Terms", "href": "/terms"}', 'link', 1)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
