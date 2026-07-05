-- Split about hero labels: portrait tag vs copy eyebrow
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'hero', 'eyebrow', '{"text": "The Journey"}', 'text', 1),
('about', 'hero', 'portrait_tag', '{"text": "The Author"}', 'text', 1)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
