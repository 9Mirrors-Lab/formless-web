-- Update footer contact email
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('footer', 'connect', 'contact', '{"text": "Contact", "href": "mailto:hello@eyesclosed.love"}', 'link', 2)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
