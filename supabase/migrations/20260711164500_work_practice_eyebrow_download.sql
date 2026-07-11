-- Work practice section: full eyebrow line + download sheet link
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('work', 'accordion_intro', 'eyebrow', '{"text": "The Pattern Repeats Until It Is Seen"}', 'text', 0),
('work', 'accordion_intro', 'download_sheet', '{"text": "Download practice sheet", "href": "#"}', 'link', 0)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
