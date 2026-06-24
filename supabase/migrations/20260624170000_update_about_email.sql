-- Update About page contact email
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'stay_close', 'email_link', '{"text": "hello@eyesclosed.love", "href": "mailto:hello@eyesclosed.love"}', 'link', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
