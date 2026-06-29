-- Work page accordion intro lead-in below section title
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('work', 'accordion_intro', 'lede', '{"text": "Four places in life where suffering often appears"}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
