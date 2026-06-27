-- Update home hero background to Desert Dusk
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('home', 'hero', 'background_image', '{"src": "/backgrounds/desert-dusk.jpg"}', 'image', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
