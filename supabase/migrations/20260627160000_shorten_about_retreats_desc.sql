-- Shorten retreats future-item copy so description wraps to two lines like siblings
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'future', 'retreats', $c${"title": "Retreats", "desc": "Days of silence and gentle guidance. A chance to go deeper without distraction."}$c$::jsonb, 'list_item', 1)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
