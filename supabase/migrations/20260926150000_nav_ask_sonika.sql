-- Add Ask Sonika to main navigation (points to /qa).
INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('nav', 'links', 'ask_sonika', '{"text": "Ask Sonika", "href": "/qa"}', 'link', 3)
ON CONFLICT (page, section, key) DO UPDATE
SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
