-- Science hero intro line
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'header',
  'intro',
  '{"text": "The deepest truths about who you are do not require belief."}',
  'text',
  0
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
