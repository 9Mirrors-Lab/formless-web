-- Add Punjabi/Hindi background sentence to About bio paragraph 2
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'hero', 'body_para2', $c${"text": "Born in Winnipeg, Canada, to immigrant parents from Punjab, India, Sonika is the youngest of three. Raised in a Punjabi household, she learned to speak Punjabi and has a basic understanding of Hindi. At the age of twenty, she moved to Las Vegas, Nevada, where she has lived ever since. Over the past twenty years, she has built a successful career in Human Resources, spending the last thirteen years in the technology industry helping people and organizations navigate growth, change, and transformation."}$c$::jsonb, 'text', 4)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
