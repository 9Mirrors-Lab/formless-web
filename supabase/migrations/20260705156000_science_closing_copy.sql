-- Science closing band copy update
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('science', 'closing', 'eyebrow', '{"text": "Science points to what the ancient teachings have known."}', 'text', 0),
('science', 'closing', 'title_line1', $c${"text": "You are not the mind's interpretation of reality."}$c$::jsonb, 'text', 0),
('science', 'closing', 'title_line2', '{"text": "You are the awareness that sees it."}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
