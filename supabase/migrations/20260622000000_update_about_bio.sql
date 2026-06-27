-- Update About page author bio copy
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('about', 'hero', 'title', '{"text": "About the Author"}', 'text', 2),
('about', 'hero', 'body_para1', $c${"text": "Sonika Cottman is an Awareness Guide, author, and founder of Eyes Closed, a platform devoted to helping people reconnect with who they are beyond the mind."}$c$::jsonb, 'text', 3),
('about', 'hero', 'body_para2', $c${"text": "Born in Winnipeg, Canada, to immigrant parents from Punjab, India, Sonika is the youngest of three. At the age of twenty, she moved to Las Vegas, Nevada, where she has lived ever since. Over the past twenty years, she has built a successful career in Human Resources, spending the last thirteen years in the technology industry helping people and organizations navigate growth, change, and transformation."}$c$::jsonb, 'text', 4),
('about', 'hero', 'body_para3', $c${"text": "For much of her life, achievement, success, and external milestones shaped the direction of her path. In 2023, however, a profound shift in awareness changed the way she viewed herself, her relationships, her work, and life itself. What once drove her no longer held the same meaning. The pursuit of external success gradually gave way to a deeper desire for peace, freedom, and understanding."}$c$::jsonb, 'text', 5),
('about', 'hero', 'body_para4', $c${"text": "That transformation led to the creation of Eyes Closed and inspired her first book, Formless."}$c$::jsonb, 'text', 6),
('about', 'hero', 'body_para5', $c${"text": "Today, Sonika shares what she continues to discover through writing, speaking, and creating content centered on awareness, presence, and inner transformation. Her work is grounded in a simple message: lasting peace is not found outside of us, but through recognizing who we truly are beyond our thoughts, emotions, and conditioned identities."}$c$::jsonb, 'text', 7),
('about', 'hero', 'body_para6', $c${"text": "When she isn't writing or creating, Sonika enjoys spending time with her two children, taking walks in nature with her partner and their two dogs, listening to handpan music, meditating, and exploring the intersection of science, spirituality, and human potential."}$c$::jsonb, 'text', 8)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
