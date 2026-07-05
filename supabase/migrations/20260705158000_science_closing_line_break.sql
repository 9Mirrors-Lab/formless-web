-- Science closing: line break after "mind's"
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'closing',
  'title_line1',
  $c${"text": "You are not the mind's\ninterpretation of reality."}$c$::jsonb,
  'text',
  0
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
