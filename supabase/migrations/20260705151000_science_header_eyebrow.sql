-- Science hero eyebrow: Two Languages One Truth
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('science', 'header', 'eyebrow', '{"text": "Two Languages One Truth"}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
