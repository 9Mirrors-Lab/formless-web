-- Science pillar 3: replace Observation with The Body
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'pillars',
  'observation',
  $c${
    "label": "The Body",
    "hook": "Your experiences don't live only in memory.\nYour nervous system and body learn emotional patterns through repetition and memorize them.",
    "keywords": ["Stress", "Fear", "Worry", "Safety", "Joy", "Love", "Presence"],
    "body": "Your body is always listening.\n\nAwareness allows those unconscious patterns to become conscious."
  }$c$::jsonb,
  'list_item',
  2
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
