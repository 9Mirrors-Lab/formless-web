-- Remove partner name from About bio personal paragraph
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'hero', 'body_para6', $c${"text": "When she isn't writing or creating, Sonika enjoys spending time with her two children, taking walks in nature with her partner and their two dogs, listening to handpan music, meditating, and exploring the intersection of science, spirituality, and human potential."}$c$::jsonb, 'text', 8)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
